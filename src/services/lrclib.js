
const LRCLIB_ENDPOINT = 'https://lrclib.net/api/search?q='

export async function fetchLyrics(query) {
    if (!query) return null
    console.time("lrc req")
    console.log({query})
    try{
        const result = await fetch(`${LRCLIB_ENDPOINT}${query}`)

        if (!result.ok) throw new Error('Lyrics response not ok')

        const data = await result.json()
        console.timeEnd("lrc req")
        return data

    } catch {
        throw new Error('Error searching lyrics')
    }
}