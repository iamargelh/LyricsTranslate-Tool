
const LRCLIB_ENDPOINT = 'https://lrclib.net/api/search?q='

export async function getLyrics(query) {
    if (!query) return null;
    const result = await fetch(`${LRCLIB_ENDPOINT}${query}`)
    const data = result.json()
    return data
}