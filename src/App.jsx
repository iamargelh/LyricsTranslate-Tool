import { useState, useEffect } from 'react'
import './App.css'
import { getLyrics } from './services/lrclib.js'

function App() {

  const [lyricsinfo,setLyricsinfo] = useState("");
  const query = "EDEN - take care"

  useEffect(
    ()=>{
      getLyrics(query)
      .then(res => setLyricsinfo(JSON.stringify(res)))
      .then(res => console.log({res}))
    },[]
  )

  return (
    <>
      <h1>LyricsTranslate Tool</h1>
      <p>{lyricsinfo}</p>
    </>
  )
}

export default App
