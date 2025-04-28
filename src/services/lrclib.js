
const LRCLIB_ENDPOINT = 'https://lrclib.net/api/search?q='

export async function getLyrics(query) {
    if (!query) return null;
    console.log({query})
    try{
        const result = await fetch(`${LRCLIB_ENDPOINT}${query}`)
        if (result.ok){
            const data = result.json()
            return data
        } else
        {
            throw new Error('Lyrics response not ok')
        }

    } catch {
        throw new Error('Error searching lyrics')
    }
}