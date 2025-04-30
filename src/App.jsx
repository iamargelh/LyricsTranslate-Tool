import {
  useState,
  useCallback
} from 'react'
import './App.css'
import { getLyrics } from './services/lrclib.js'
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
    setFullTrackName({artistName:null,trackName:null})
    setLyricsInfo(null)
  }

  const setFromFetch = (json)=>{
    const {artistName, trackName, lyrics} = getResultFromIndex(json,0)
    setFullTrackName({artistName,trackName})
    setLyricsInfo(lyrics)
  }

  const fetchLyrics = useCallback(
    (query)=>{
      getLyrics(query)
      .then((res) => {
        if(res.length !== 0) setFromFetch(res)
      })
    },[]
  )

  const updateLyrics = ()=>{

  }

  return (
    <>
      <Layout fetchLyrics={fetchLyrics}>
        <Box width={"55dvw"}>
          <Box>
            <Typography variant='h4' component='h1'>LyricsTranslate Tool</Typography>
            <Typography variant='h5' component='h2' gutterBottom>
              {(fullTrackName.artistName && fullTrackName.trackName)
                ? `${fullTrackName.artistName[0]} - ${fullTrackName.trackName}`
                : "Cargando Titulo..."}
            </Typography>
          </Box>
          <Box>
            <LyricsTable lyricsMap={lyricsInfo} updateLyrics={updateLyrics}/>
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default App
