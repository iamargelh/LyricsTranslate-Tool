import { useState, useEffect, useCallback, use } from 'react'
import './App.css'
import { getLyrics } from './services/lrclib.js'
import { getResultFromIndex } from './logic/lrclib.js'
import { Button, Input } from '@mui/material'

function App() {
  const [search, setSearch] = useState('')
  const [query,setQuery] = useState('eden take care')
  const [lyricsInfo,setLyricsInfo] = useState() // MAP
  const [fullTrackName,setFullTrackName] = useState({
    artistName: null,
    trackName: null
  })

  // no sync: tristam different
  // sync: eden take care

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

  useEffect(
    ()=>{
      fetchLyrics(query)
    },[query]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (query===search.trim()) return
    setQuery(search.trim())
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
  }

  return (
    <>
      <h1>LyricsTranslate Tool</h1>
      <form onSubmit={handleSubmit}>
        <Input onChange={handleChange} value={search} placeholder='eden take care'></Input>
        <Button type='submit' >Buscar</Button>
      </form>
      <h2>
        {(fullTrackName.artistName && fullTrackName.trackName)
          ? `${fullTrackName.artistName} - ${fullTrackName.trackName}`
          : "Cargando Titulo..."}
      </h2>
      {
        (lyricsInfo)
        ? [...lyricsInfo].map(([key, content])=>{ // Tenga o no lyrics sync, este será un mapa
            return <p key={key}> {`${content.lyric}`} </p>
          })
        : <p>{"Cargando Lyrics..."}</p>
      }
    </>
  )
}

export default App
