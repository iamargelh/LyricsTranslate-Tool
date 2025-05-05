import { Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Box } from "@mui/material";
import { useEffect, memo, useMemo, useState } from "react";

export const MemoLyricsTable = memo(LyricsTable)

export function LyricsTable ({lyricsMap, updateLyrics, fullTrackName}){
    return(
        <>
            {/* <Box>
                <Typography variant='h4' component='h1'>LyricsTranslate Tool</Typography>
            </Box> */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={"9%"} align="right">
                            <Typography>
                                <b>Start</b>
                            </Typography>
                        </TableCell>
                        <TableCell width={"9%"}>
                            <Typography>
                                <b>End</b>
                            </Typography>
                        </TableCell>
                        <TableCell width={"30%"} align="right">
                            <Typography>
                                <b>Lyric</b>
                            </Typography>
                        </TableCell>
                        <TableCell width={"30%"}>
                            <Typography>
                                <b>Translation</b>
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        (lyricsMap)
                        ? [...lyricsMap].map(([key, content])=>{
                            return <LyricsRow
                                key={key}
                                lyric={content.lyric}
                                time_end={content.time_end}
                                time_start={content.time_start}
                                translation={content.translation}
                                id={key}
                                updateLyrics={updateLyrics}/>
                            })
                        : <></>

                    }
                    {console.timeEnd("RENDER")}
                </TableBody>
            </Table>
            { (lyricsMap) ? <></> : <p>{"Waiting for Lyrics..."}</p> }
        </>
    )
}

// export const MemoLyricsRow = memo(LyricsRow)
function LyricsRow({time_start,time_end,lyric,translation,id, updateLyrics}){

    return(
        <>
            <TableRow>
                <LyricsCell value={time_start} align={"right"} id={id} type={"start"} updateLyrics={updateLyrics}/>
                <LyricsCell value={time_end} id={id} type={"end"} updateLyrics={updateLyrics}/>
                <LyricsCell value={lyric} align={"right"} id={id} type={"lyric"} updateLyrics={updateLyrics}/>
                <LyricsCell value={translation} id={id} type={"translation"} updateLyrics={updateLyrics}/>
            </TableRow>
        </>
    )
}

function LyricsCell({value,align="left", id, type, updateLyrics}){
    const [editable, setEditable] = useState(false);
    const [cellText, setCellText] = useState(value);
    const [prevCellText, setPrevCellText] = useState(value)

    useEffect(()=>{
        setCellText(value)
        setPrevCellText(value)
        console.log("CELL CHANGE")
    },[value])

    const cell_id = `${id}_${type}`;

    const toggleEditable = ()=>{
        if (type==="start"|| type==="end") return
        setEditable(true)
    }

    const handleChange = (event)=>{
        setCellText(event.target.value)
    }

    const handleBlur = ()=>{
        setEditable(false)
        const trimmedCellText = cellText.trim()
        if (trimmedCellText !== cellText) setCellText(cellText.trim())
        if (trimmedCellText === prevCellText) return
        setPrevCellText(cellText)
        updateLyrics(id,type,trimmedCellText)
    }


    return(
        <>
            <TableCell
            sx={
                {
                    cursor:'pointer',
                    height:'2rem',
                    // border:'dashed red'
                }
            }
            onClick={toggleEditable}>
                <Box
                    sx={{
                        display:'flex',
                        // border:"dashed red",
                        justifyContent:`${align}`,
                        alignItems:"center"
                    }}>
                    {
                        editable
                        ?
                        <TextField
                            InputProps={{
                                inputProps: {
                                    style: {
                                        textAlign: align,
                                    },
                                },
                            }}
                            inputRef={input => {
                                if (input) {
                                    // Set the cursor position to the end of the text
                                    input.selectionStart = input.value.length;
                                    input.selectionEnd = input.value.length;
                                }
                            }}
                            sx={
                                {
                                    marginTop:'-4px',
                                    paddingBottom:'2.5px'
                                }
                            }
                            autoFocus
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="standard"
                            multiline
                            fullWidth
                            value={cellText}
                            key={cell_id}
                            margin="none"
                        />
                        :

                            <Typography
                                key={cell_id}
                                align={align}
                                gutterBottom
                                sx={
                                    {
                                        userSelect:'none',
                                        height: '100%',
                                    }
                                }
                            >
                                    {value}
                            </Typography>

                    }
                </Box>
            </TableCell>
        </>
    )
}