export function getFromStorage (id){
    const lyrics = new Map(JSON.parse(window.localStorage.getItem(`lyrics_${id}`)))

    const fullTrackName = JSON.parse(window.localStorage.getItem(`trackName_${id}`))

    const tittle = window.localStorage.getItem(`tittle_${id}`)
    console.log({tittle})

    window.localStorage.setItem(`currentWIP`,JSON.stringify(id))

    return {tittle,fullTrackName,lyrics}
}

export function deleteFromStorage (id, wipList) {
    let newWipList = new Map(wipList)
    newWipList.delete(id)
    window.localStorage.setItem(`wipList`,JSON.stringify(Array.from(newWipList.entries())))

    window.localStorage.removeItem(`lyrics_${id}`)
    window.localStorage.removeItem(`trackName_${id}`)
    window.localStorage.removeItem(`tittle_${id}`)

    return newWipList
}