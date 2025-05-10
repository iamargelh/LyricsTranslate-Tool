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
  const [lyricsInfo,setLyricsInfo] = useState(
    ()=>{
      const lyricsFromStorage = window.localStorage.getItem("currentLyrics")
      console.log({lyricsFromStorage})
      if (lyricsFromStorage) return new Map(JSON.parse(lyricsFromStorage))
      return new Map()
    }
  )

  const [fullTrackName,setFullTrackName] = useState(
    ()=>{
      const fullTrackNameFromStorage = window.localStorage.getItem("currentTrackName")
      console.log({fullTrackNameFromStorage})
      if (fullTrackNameFromStorage) return JSON.parse(fullTrackNameFromStorage)
      return { artistName: null, trackName: null }
    }
  )

  const [response,setResponse] = useState()
  const abortControllerRef = useRef(null)

  useEffect(()=>{
    const currentLyrics = Array.from(lyricsInfo.entries())
    window.localStorage.setItem("currentLyrics",JSON.stringify(currentLyrics))
  },[lyricsInfo])

  useEffect(()=>{
    window.localStorage.setItem("currentTrackName",JSON.stringify(fullTrackName))
  },[fullTrackName])

  const resetApp = ()=>{
    console.log("DISCARD")
    window.localStorage.removeItem("currentLyrics")
    window.localStorage.removeItem("currentTrackName")
    setFullTrackName({artistName:null,trackName:null})
    setLyricsInfo(new Map())
  }

  const setFromFetch = (index)=>{
    const {artistName, trackName, lyrics} = getResultFromIndex(response,index)
    setFullTrackName({artistName,trackName})
    setLyricsInfo(lyrics)
    console.log(lyrics)
    console.time("RENDER")
  }

  const fetchLyrics =
    (query)=>{
      console.time("Fetch")

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
        if (error.name === "AbortError") {
          console.log("Abort")
        } else {
          console.error(error)
        }
      })
      .finally(
        console.timeEnd("Fetch")
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

  return (
    <>
      <Layout
        fetchLyrics={fetchLyrics}
        fullTrackName={fullTrackName}
        discard={resetApp}
        response={response}
        setFromFetch={setFromFetch}
      >
        <Box width={"55dvw"}>
          <Box>
            <LyricsTable>
              {
                (lyricsInfo.size!==0) &&
                [...lyricsInfo].map(([key, content])=>{
                  return (
                    <LyricsRow>
                      <LyricsCell
                        value={content.time_start}
                        align={"right"}
                        id={key}
                        type={"start"}
                        updateLyrics={updateLyrics}
                      />
                      <LyricsCell
                        value={content.time_end}
                        id={key}
                        type={"end"}
                        updateLyrics={updateLyrics}
                      />
                      <LyricsCell
                        value={content.lyric}
                        align={"right"}
                        id={key} type={"lyric"}
                        updateLyrics={updateLyrics}
                      />
                      <LyricsCell
                        value={content.translation}
                        id={key}
                        type={"translation"}
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
                {"Waiting for Lyrics..."}
              </p>
            }
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default App
