import {fetch_deezer_url_from_isrc, fetch_deezer_url_from_name} from '../services/deezer.js'

export async function get_deezer_url ({artistName=null,trackName=null,isrc=null}){
    let data

    if (isrc) data =  await fetch_deezer_url_from_isrc(isrc)
    else {
        data = await fetch_deezer_url_from_name(artistName,trackName)
            .then((respone)=>{
                data = respone?.data[0] ?? null
            })
    }

    const coverImage = data?.album?.cover_xl ?? null
    const linkDeezer = data?.link ?? null

    return {linkDeezer,coverImage}
}

// get_deezer_url({isrc:"USUM71710301"})
// .then(({linkDeezer,coverImage})=>{
//     console.log({linkDeezer})
//     console.log({coverImage})
// })

// get_deezer_url({trackName:"take care",artistName:"EDEN"})
// .then(({linkDeezer,coverImage})=>{
//     console.log({linkDeezer})
//     console.log({coverImage})
// })