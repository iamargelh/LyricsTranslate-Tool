export function getResultFromIndex(json,index){
    let item = json[index]

    const artistName = getArtistName(item.artistName)
    const trackName = item.trackName
    const lyrics = getLyricsField(item)

    return {artistName,trackName,lyrics}
}

const HEX_TIMECODES = [
    /\[(\d{2}:\d{2}\.\d{2,3})\]/,
    /\[(\d{2}:\d{2}:\d{2}\.\d{2,3})\]/
]

function getLyricsField (item){
    if (item.syncedLyrics) {
        return processLyricsMap(item.syncedLyrics)
    } else {
        return processLyricsMap(item.plainLyrics)
    }
}

export function processLyricsMap(string){
    const lines = string.replaceAll('\n\n', '\n \n').split('\n')
    const lrcMap = new Map()

    let timeStampFound = false
    let noResultCount = 0

    let loopNumber = 1
    let hex_len = HEX_TIMECODES.length
    let count = 0

    const saveLineItem = ({line, code, timecode})=>{
        const newLine = line.replace(code,'')
        const lyric = newLine === ' ' ? newLine : newLine.trim()

        lrcMap.set(`lrc_${String(count).padStart(2,'0')}`,
            {
                time_start:timecode,
                time_end:timecode,
                lyric:lyric,
                translation:'',
                comment:''
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
                    saveLineItem({line, code, timecode:'00:00.00'})
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
    // console.log({lrcMap})
    return lrcMap
}

function getArtistName(artistName) {
    // Regular expressions to match different patterns in the artist name
    const join_phrase = [
        /\sfeat\.\s/i,      // ' feat. '
        /\sft\.\s/i,        // ' ft. '
        /\s&\s/,            // ' & '
        /\s,\s/,            // ' , '
    ]

    let phrases = null
    for (const pattern of join_phrase) {
        if (pattern.test(artistName)) {
            phrases = pattern
            break
        }
    }

    const parts = artistName.split(phrases).map(part => part.trim())

    const finalParts = []
    for (const part of parts) {
        if (/\s&\s/.test(part)) {
            finalParts.push(...part.split(/\s&\s/).map(p => p.trim()))
        } else {
            finalParts.push(part)
        }
    }

    return finalParts.filter(part => part.length > 0)
}