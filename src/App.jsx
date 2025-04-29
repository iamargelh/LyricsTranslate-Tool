import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { getLyrics } from './services/lrclib.js'
import { getResultFromIndex } from './logic/lrclib.js'
import { Typography } from '@mui/material'
import { Layout } from './components/Layout.jsx'


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
    const {artist_name, track_name, lyrics} = getResultFromIndex(json,0)
    setFullTrackName({artistName:artist_name,trackName:track_name})
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

  return (
    <>
      <Layout fetchLyrics={fetchLyrics}>
        <Typography variant='h4' component='h1'>LyricsTranslate Tool</Typography>
        <Typography variant='h5' component='h2' gutterBottom>
          {(fullTrackName.artistName && fullTrackName.trackName)
            ? `${fullTrackName.artistName} - ${fullTrackName.trackName}`
            : "Cargando Titulo..."}
        </Typography>

        {
          (lyricsInfo)
          ? [...lyricsInfo].map(([key, content])=>{ // Tenga o no lyrics sync, este será un mapa
              return <Typography key={key} > {`${content.lyric}`} </Typography>
            })
          : <p>{"Cargando Lyrics..."}</p>
        }

      </Layout>
    </>
  )
}

export default App
