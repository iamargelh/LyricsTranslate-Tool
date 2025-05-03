import { fetch_odesli_urls } from '../services/odesli.js'

export async function get_odesli_urls (url){
    if (!url) return
    return await fetch_odesli_urls(url)
    .then(data=>{
        const urls = new Map([
            ["deezer", data?.linksByPlatform?.deezer?.url ?? null],
            ["apple_music", data?.linksByPlatform?.appleMusic?.url ?? null],
            ["spotify", data?.linksByPlatform?.spotify?.url ?? null],
            ["youtube", data?.linksByPlatform?.youtube?.url ?? null],
            ["amazon", data?.linksByPlatform?.amazonMusic?.url ?? null],
            ["soundcloud", data?.linksByPlatform?.soundcloud?.url ?? null],
            ["tidal", data?.linksByPlatform?.tidal?.url ?? null]
        ])
        return urls
    })
}

// get_odesli_urls("https://www.deezer.com/mx/track/449199512")
// .then(data=>{
//     console.log({data})
// })