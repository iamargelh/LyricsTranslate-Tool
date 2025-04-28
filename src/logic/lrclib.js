export function getResultFromIndex(json,index){
    let item = json[index]

    const artist_name = item.artistName
    const track_name = item.trackName
    const lyrics = ()=>{
        if (item.syncedLyrics) {
            return processLyricsMap(item.syncedLyrics)
        } else {
            return processLyricsMap(item.plainLyrics)
        }
    }

    return {artist_name,track_name,lyrics}
}

const HEX_TIMECODES = [
    /\[(\d{2}:\d{2}\.\d{2,3})\]/,
    /\[(\d{2}:\d{2}:\d{2}\.\d{2,3})\]/
];

export function processLyricsMap(string){
    const lines = string.split("\n")
    const lrcMap = new Map()

    let timeStampFound = false
    let noResultCount = 0

    let loopNumber = 1
    let hex_len = HEX_TIMECODES.length
    let count = 0

    const saveLineItem = ({line, code, timecode})=>{
        const lyric = line.replace(code,'').trim()
        lrcMap.set(`lrc_${String(count).padStart(2,"0")}`,
            {
                time_start:timecode,
                time_end:timecode,
                lyric:lyric,
                translation:"",
                comment:""
            })
        count++
    }

    for(const code of HEX_TIMECODES){
        noResultCount = 0
        if (timeStampFound) break
        for(const line of lines){
            const match = line.match(code)

            if (!match) {
                if (noResultCount>=2 && hex_len!==loopNumber){
                    console.log(`BREAK`)
                    break
                }
                if (hex_len===loopNumber) {
                    saveLineItem({line, code, timecode:"00:00.00"})
                } else{
                    noResultCount++
                    console.log(`No result, attempt ${noResultCount}`)
                }
            } else {
                saveLineItem({line, code, timecode:match[1]})
                timeStampFound=true
            }
        }
        loopNumber++
    }

    if (lrcMap.size===0) return
    console.log({lrcMap})
    return lrcMap
}