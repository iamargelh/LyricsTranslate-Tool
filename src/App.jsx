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
import { getFromStorage, deleteFromStorage } from './logic/itemHandler.js'

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

  useEffect(()=>{
    if (!currentWIP) return
    const currentLyrics = Array.from(lyricsInfo.entries())
    window.localStorage.setItem(`lyrics_${currentWIP}`,JSON.stringify(currentLyrics))
  },[lyricsInfo])

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

  useEffect(()=>{
    if (!currentWIP) return
    window.localStorage.setItem(`trackName_${currentWIP}`,JSON.stringify(fullTrackName))
  },[fullTrackName])

  const [wipTittle,setWIPTittle] = useState(
    ()=>{
      if (currentWIP){
        const tittle = window.localStorage.getItem(`tittle_${currentWIP}`)
        console.log({tittle})
        if (tittle) return tittle
      }
      return ""
    }
  )

  useEffect(()=>{
    if (!currentWIP) return
    window.localStorage.setItem(`tittle_${currentWIP}`,wipTittle)

    const newWipList = new Map(wipList)
    newWipList.set(currentWIP, wipTittle)
    console.log({newWipList})
    setWIPList(newWipList)
    window.localStorage.setItem(`wipList`,JSON.stringify(Array.from(newWipList.entries())))
  },[wipTittle])

  const [response,setResponse] = useState()
  const abortControllerRef = useRef(null)

  const newItem = ()=>{
    console.log('DISCARD')

    setCurrentWIP("")
    setWIPTittle("")
    setFullTrackName({artistName:null,trackName:null})
    setLyricsInfo(new Map())
    window.localStorage.removeItem('currentWIP')
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
    if (currentWIP===item) return

    const {
      tittle:newTittle,
      fullTrackName:newFullTrackName,
      lyrics:newLyrics
    } = getFromStorage(item)

    setLyricsInfo(newLyrics)
    setFullTrackName(newFullTrackName)
    setWIPTittle(newTittle)

    setCurrentWIP(item)
    window.localStorage.setItem(`currentWIP`,JSON.stringify(item))
  }

  const deleteItemFromStorage = (item)=>{
    if (item===currentWIP) newItem()
    const newWipList = deleteFromStorage(item,wipList)
    setWIPList(newWipList)
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
        deleteFromStorageItem={deleteItemFromStorage}
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
