import {
  useState,
  useCallback,
  useRef
} from 'react'
import './App.css'
import { fetchLyrics as getLyrics } from './services/lrclib.js'
import { getResultFromIndex } from './logic/lrclib.js'
import {
  Box,
  Typography
} from '@mui/material'
import { Layout } from './components/Layout.jsx'
import { LyricsTable } from './components/LyricsTable.jsx'


function App() {
  const [lyricsInfo,setLyricsInfo] = useState() // MAP
  const [fullTrackName,setFullTrackName] = useState({
    artistName: null,
    trackName: null
  })
  const [response,setResponse] = useState()
  const abortControllerRef = useRef(null)

  const resetApp = ()=>{
    console.log("DISCARD")
    setFullTrackName({artistName:null,trackName:null})
    setLyricsInfo(null)
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
            <LyricsTable fullTrackName={fullTrackName} lyricsMap={lyricsInfo} updateLyrics={updateLyrics} />
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default App
