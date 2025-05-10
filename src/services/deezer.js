const DEEZER_ISRC_ENDPOINT = (isrc)=>{
    return `https://api.deezer.com/2.0/track/isrc:${isrc}`
}

export async function fetch_deezer_url_from_isrc(isrc) {
    if (!isrc) return
    try{
        const result = await fetch(DEEZER_ISRC_ENDPOINT(isrc))
        if (!result.ok) throw new Error('Deezer response not ok')
        const data = await result.json()
        // const coverImage = data?.album?.cover_xl ?? null
        // const linkDeezer = data.link ?? null
        return data
    } catch {
        throw new Error('Error searching deezer from isrc')
    }
}

const DEEZER_NAME_ENDPOINT = (artistName,trackName)=>{
    return `https://api.deezer.com/search?q=artist:'${artistName}'track:'${trackName}'&limit=1`
}

export async function fetch_deezer_url_from_name(artistName, trackName) {
    if (!artistName || !trackName) return

    try{
        const result = await fetch(DEEZER_NAME_ENDPOINT(artistName,trackName))
        if (!result.ok) throw new Error('Deezer response not ok')
        const data = await result.json()
        // const coverImage = data?.album?.cover_xl ?? null
        // const linkDeezer = data.link ?? null
        // const strigsify = JSON.stringify(data)
        // console.log({strigsify})
        return data
    } catch {
        throw new Error('Error searching deezer from name')
    }
}

// fetch_deezer_url_from_name('EDEN','take care')
// fetch_deezer_url_from_isrc('USUM71710301')