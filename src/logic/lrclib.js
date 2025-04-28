export function getResultFromIndex(json,index){
    let item = json[index]

    const artist_name = item.artistName
    const track_name = item.trackName
    const lyrics = item.syncedLyrics ?? item.plainLyrics

    return {artist_name,track_name,lyrics}
}