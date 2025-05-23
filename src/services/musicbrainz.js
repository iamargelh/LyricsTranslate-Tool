const MUSICBRAINZ_TRACK_ENDPOINT = (artistName,trackName)=>{
    return `https://musicbrainz.org/ws/2/recording/?query=artist:'${artistName}' AND recording:'${trackName}'&fmt=json&limit=1`
}

const MUSICBRAINZ_ARTIST_ENDPOINT = (artistId)=>{
    return `https://musicbrainz.org/ws/2/artist/${artistId}?inc=url-rels&fmt=json'`
}

export async function musicbrainz(artistName,trackName){
    try {
        const result = await fetch(
            MUSICBRAINZ_TRACK_ENDPOINT(artistName,trackName),
            {
                headers: {
                    'User-Agent': 'application/json'
                }
            }
        )
        if (!result.ok) throw new Error('ISRC response not ok')

        const data = await result.json()

        if (!data?.recordings[0]?.isrcs) {
            return false
        }

        return data
    } catch {
        throw new Error('Error searching ISRC')
    }
}

