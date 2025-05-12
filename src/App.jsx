import {
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react'
import './App.css'
import { fetchLyrics as getLyrics } from './services/lrclib.js'
import { getResultFromIndex } from './logic/lrclib.js'
import {
  Box,
  Typography
} from '@mui/material'
import { Layout } from './components/Layout.jsx'
import { LyricsTable, LyricsRow, LyricsCell } from './components/LyricsTable.jsx'

function App() {
  const [wipList,setWIPList] = useState(
    ()=>{
      const list = window.localStorage.getItem('wipList')
      console.log({list})
      if (list) return new Map(JSON.parse(list))
      return new Map()
    }
  )

  const [currentWIP,setCurrentWIP] = useState(
    ()=>{
      const wip = window.localStorage.getItem('currentWIP')
      if (wip) return JSON.parse(wip)
      return ""
    }
  )

  const [lyricsInfo,setLyricsInfo] = useState(
    ()=>{
      if (currentWIP){
        const lyricsFromStorage = window.localStorage.getItem(`lyrics_${currentWIP}`)
        console.log({lyricsFromStorage})
        if (lyricsFromStorage) return new Map(JSON.parse(lyricsFromStorage))
      }
      return new Map()
    }
  )

  const [fullTrackName,setFullTrackName] = useState(
    ()=>{
      if (currentWIP){
        const fullTrackNameFromStorage = window.localStorage.getItem(`trackName_${currentWIP}`)
        console.log({fullTrackNameFromStorage})
        if (fullTrackNameFromStorage) return JSON.parse(fullTrackNameFromStorage)
      }
      return { artistName: null, trackName: null }
    }
  )

  const [wipTittle,setWIPTittle] = useState(
    ()=>{
      if (currentWIP){
        const tittle = window.localStorage.getItem(`tittle_${currentWIP}`)
        console.log({tittle})
        if (tittle) return JSON.parse(tittle)
      }
      return ""
    }
  )

  const [response,setResponse] = useState()
  const abortControllerRef = useRef(null)

  useEffect(()=>{
    if (!currentWIP) return
    const currentLyrics = Array.from(lyricsInfo.entries())
    window.localStorage.setItem(`lyrics_${currentWIP}`,JSON.stringify(currentLyrics))
  },[lyricsInfo])

  useEffect(()=>{
    if (!currentWIP) return
    window.localStorage.setItem(`trackName_${currentWIP}`,JSON.stringify(fullTrackName))
  },[fullTrackName])

  useEffect(()=>{
    if (!currentWIP) return
    window.localStorage.setItem(`tittle_${currentWIP}`,JSON.stringify(wipTittle))

    const newWipList = wipList
    newWipList.set(currentWIP, wipTittle)
    console.log({newWipList})
    setWIPList(newWipList)
    window.localStorage.setItem(`wipList`,JSON.stringify(Array.from(newWipList.entries())))
  },[wipTittle])

  const newItem = ()=>{
    console.log('DISCARD')
    // window.localStorage.removeItem('currentLyrics')
    // window.localStorage.removeItem('currentTrackName')

    setCurrentWIP("")
    setWIPTittle("")
    setFullTrackName({artistName:null,trackName:null})
    setLyricsInfo(new Map())
  }

  const deleteFromStorage = (wip)=>{
    window.localStorage.removeItem(`lyrics_${wip}`)
    window.localStorage.removeItem(`trackName_${wip}`)
    window.localStorage.removeItem(`tittle_${wip}`)
  }

  const setFromFetch = (index)=>{
    let newWipList = wipList

    if(newWipList.size === 10){
      const lastkey = newWipList.keys().next().value
      deleteFromStorage(lastkey)
      newWipList.delete(lastkey)
    }

    const newCurrentWIP = Date.now()
    const {artistName, trackName, lyrics} = getResultFromIndex(response,index)
    const newTittle = `${artistName?.[0]} - ${trackName}`

    newWipList.set(newCurrentWIP, newTittle)
    console.log({newWipList,newCurrentWIP})
    setWIPList(newWipList)
    setCurrentWIP(newCurrentWIP)
    window.localStorage.setItem(`currentWIP`,JSON.stringify(newCurrentWIP))
    window.localStorage.setItem(`wipList`,JSON.stringify(Array.from(newWipList.entries())))
    setWIPTittle(newTittle)
    setFullTrackName({artistName,trackName})
    setLyricsInfo(lyrics)

    console.log(lyrics)
    console.time('RENDER')
  }

  const fetchLyrics =
    (query)=>{
      console.time('Fetch')

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      getLyrics(query, { signal: controller.signal })
      .then((res) => {
        setResponse(res)
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Abort')
        } else {
          console.error(error)
        }
      })
      .finally(
        console.timeEnd('Fetch')
      )
    }

  const updateLyrics = useCallback((id, type, newValue)=>{
    setLyricsInfo(
      oldLyricsMap =>{
        const newMap = new Map(oldLyricsMap)
        const lineEdit = newMap.get(id)
        lineEdit[type]=newValue
        newMap.set(id,lineEdit)
        console.log({newMap})
        return newMap
      }
    )
  }, [])

  const setFromStorageItem = (item)=>{
    setCurrentWIP(item)

    console.log(wipList.size)

    const lyricsFromStorage = window.localStorage.getItem(`lyrics_${item}`)
    setLyricsInfo(new Map(JSON.parse(lyricsFromStorage)))

    const fullTrackNameFromStorage = window.localStorage.getItem(`trackName_${item}`)
    setFullTrackName(JSON.parse(fullTrackNameFromStorage))

    const tittle = window.localStorage.getItem(`tittle_${item}`)
    setWIPTittle(JSON.parse(tittle))
  }

  return (
    <>
      <Layout
        fetchLyrics={fetchLyrics}
        wipTittle={wipTittle}
        setWIPTittle={setWIPTittle}
        discard={newItem}
        response={response}
        setFromFetch={setFromFetch}
        wipList={wipList}
        setFromStorageItem={setFromStorageItem}
      >
        <Box width={'55dvw'}>
          <Box>
            <LyricsTable>
              {
                (lyricsInfo.size!==0) &&
                [...lyricsInfo].map(([key, content])=>{
                  return (
                    <LyricsRow>
                      <LyricsCell
                        value={content.time_start}
                        align={'right'}
                        id={key}
                        type={'start'}
                        updateLyrics={updateLyrics}
                      />
                      <LyricsCell
                        value={content.time_end}
                        id={key}
                        type={'end'}
                        updateLyrics={updateLyrics}
                      />
                      <LyricsCell
                        value={content.lyric}
                        align={'right'}
                        id={key} type={'lyric'}
                        updateLyrics={updateLyrics}
                      />
                      <LyricsCell
                        value={content.translation}
                        id={key}
                        type={'translation'}
                        updateLyrics={updateLyrics}
                      />
                    </LyricsRow>
                  )
                })
              }
            </LyricsTable>
            {
              (lyricsInfo.size===0) &&
              <p>
                {'Waiting for Lyrics...'}
              </p>
            }
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default App
