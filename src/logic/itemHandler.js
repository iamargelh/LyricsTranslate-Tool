export function getFromStorage (id){
    const lyrics = new Map(JSON.parse(window.localStorage.getItem(`lyrics_${id}`)))

    const fullTrackName = JSON.parse(window.localStorage.getItem(`trackName_${id}`))

    const tittle = window.localStorage.getItem(`tittle_${id}`)
    console.log({tittle})

    window.localStorage.setItem(`currentWIP`,JSON.stringify(id))

    return {tittle,fullTrackName,lyrics}
}