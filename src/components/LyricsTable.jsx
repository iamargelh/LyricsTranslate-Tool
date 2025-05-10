import { Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Box } from "@mui/material"
import { useEffect, memo, useState } from "react"

export const MemoLyricsTable = memo(LyricsTable)

export function LyricsTable ({children}){
    return(
        <>
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
                    { children }
                    {console.timeEnd("RENDER")}
                </TableBody>
            </Table>
        </>
    )
}

// export const MemoLyricsRow = memo(LyricsRow)
export function LyricsRow({children}){

    return(
        <>
            <TableRow>
                {children}
            </TableRow>
        </>
    )
}

export function LyricsCell({value,align="left", id, type, updateLyrics}){
    const [editable, setEditable] = useState(false)
    const [cellText, setCellText] = useState(value)
    const [prevCellText, setPrevCellText] = useState(value)

    useEffect(()=>{
        setCellText(value)
        setPrevCellText(value)
        console.log("CELL CHANGE")
    },[value])

    const cell_id = `${id}_${type}`


    const cursor = (type==="start" || type==="end") ? 'auto' : 'pointer'

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
                className={`lrc-cell ${(editable) ? "lrc-cell-editable" : ""}`}
                sx={
                    {
                        cursor:cursor,
                        height:'2rem',
                        // border:'dashed red'
                    }
                }
                onClick={toggleEditable}
            >
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
                                    input.selectionStart = input.value.length
                                    input.selectionEnd = input.value.length
                                }
                            }}
                            sx={
                                {
                                    marginTop:'0.1rem',
                                    paddingBottom:'0rem'
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
                                        paddingTop: "0.4rem"
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