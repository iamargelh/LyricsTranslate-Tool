import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { getLyrics } from './services/lrclib.js'
import { getResultFromIndex } from './logic/lrclib.js'

function App() {
  const [artistName,setArtistName] = useState()
  const [trackName,setTraclName] = useState()
  const [lyricsInfo,setlyricsInfo] = useState()
  const query = "EDEN - take care"

  const setNewInfo = useCallback((json)=>{
    const {artist_name, track_name, lyrics} = getResultFromIndex(json,0)
    console.log({artist_name,track_name,lyrics})
    setArtistName(artist_name)
    setTraclName(track_name)
    setlyricsInfo(JSON.stringify(lyrics))
  })

  const updateLyrics = useCallback(
    (query)=>{
      getLyrics(query)
      .then(res => setNewInfo(res))
    }
  )

  useEffect(
    ()=>{
      updateLyrics(query)
    },[]
  )

  return (
    <>
      <h1>LyricsTranslate Tool</h1>
      <h2>{(artistName&&trackName) ? `${artistName} - ${trackName}` : "Cargando Titulo..."}</h2>
      <p>{lyricsInfo ? lyricsInfo : "Cargando Lyrics..."}</p>
    </>
  )
}

export default App
