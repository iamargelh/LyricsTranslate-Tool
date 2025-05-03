// import { getResultFromIndex }  from '../logic/lrclib'
import { musicbrainz } from '../services/musicbrainz.js'
import { get_deezer_url } from '../logic/deezer.js'
import { get_odesli_urls } from '../logic/odesli.js'

export async function get(artistName,trackName){
    const isrc = await musicbrainz(artistName,trackName)
    const {linkDeezer, coverImage} = await get_deezer_url({artistName:artistName,trackName:trackName,isrc:isrc})
    const streaming_sites = await get_odesli_urls(linkDeezer)

    const info_map = new Map([
        ["track_name", trackName ?? null],
        ["artist_name", artistName ?? null],
        ["isrcs", isrc ?? null],
        ["cover", coverImage ?? null],
        ["streaming_sites", streaming_sites ?? null],
    ])

    return (info_map)
}


get("EDEN","take care")
.then(
    result =>{
        console.log({result})
    }
)