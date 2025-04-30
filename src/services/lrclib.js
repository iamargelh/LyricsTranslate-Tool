
const LRCLIB_ENDPOINT = 'https://lrclib.net/api/search?q='

export async function getLyrics(query) {
    if (!query) return null;
    console.log({query})
    try{
        const result = await fetch(`${LRCLIB_ENDPOINT}${query}`)

        if (!result.ok) throw new Error('Lyrics response not ok')

        const data = await result.json()
        return data

    } catch {
        throw new Error('Error searching lyrics')
    }
}