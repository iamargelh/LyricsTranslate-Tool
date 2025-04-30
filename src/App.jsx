import {
  useState,
  useCallback
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

  const resetApp = ()=>{
    console.log("DISCARD")
    setFullTrackName({artistName:null,trackName:null})
    setLyricsInfo(null)
  }

  const setFromFetch = (json)=>{
    const {artistName, trackName, lyrics} = getResultFromIndex(json,0)
    setFullTrackName({artistName,trackName})
    setLyricsInfo(lyrics)
    console.timeEnd("Fetch")
    console.log(lyrics)
    console.time("RENDER")
  }

  const fetchLyrics = useCallback(
    (query)=>{
      console.time("Fetch");
      getLyrics(query)
      .then((res) => {
        if(res.length !== 0) setFromFetch(res)
      })
    },[]
  )

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
      <Layout fetchLyrics={fetchLyrics} fullTrackName={fullTrackName} discard={resetApp}>
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
