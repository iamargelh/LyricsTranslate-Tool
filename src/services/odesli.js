const ODESLI_ENDPOINT = (url)=>{
    return `https://api.song.link/v1-alpha.1/links?url=${url}`
}

// "deezer", data?.linksByPlatform?.deezer?.url
// "apple_music", data?.linksByPlatform?.appleMusic?.url
// "spotify", data?.linksByPlatform?.spotify?.url
// "youtube", data?.linksByPlatform?.youtube?.url
// "amazon", data?.linksByPlatform?.amazonMusic?.url
// "soundcloud", data?.linksByPlatform?.soundcloud?.url
// "tidal", data?.linksByPlatform?.tidal?.url

export async function fetch_odesli_urls(url) {
    if (!url) return

    try {
        const result = await fetch(ODESLI_ENDPOINT(url))
        if (!result.ok) throw new Error("")
        const data = result.json()

        if (data?.statusCode) return false
        return data
    } catch {
        throw new Error("")
    }
}

// get_odesli_urls("https://www.deezer.com/mx/track/449199512")
// .then(data=>{
//     const stringify = JSON.stringify(data)
//     console.log({stringify})
// })