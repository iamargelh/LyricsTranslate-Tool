import { Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Box } from "@mui/material";
import { useState } from "react";


export function LyricsTable ({lyricsMap, updateLyrics, fullTrackName}){

    return(
        <>
            <Box>
                <Typography variant='h4' component='h1'>LyricsTranslate Tool</Typography>
                <Typography variant='h5' component='h2' gutterBottom>
                {(fullTrackName.artistName && fullTrackName.trackName)
                    ? `${fullTrackName.artistName[0]} - ${fullTrackName.trackName}`
                    : "Cargando Titulo..."}
                </Typography>
            </Box>
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
                                id={key}/>
                            })
                        : <></>


                    }
                </TableBody>
            </Table>
            { (lyricsMap) ? <></> : <p>{"Cargando Lyrics..."}</p> }
        </>
    )
}

function LyricsRow({time_start,time_end,lyric,translation,id}){
    return(
        <>
            <TableRow>
                <LyricsCell value={time_start} align={"right"} id={`${id}_start`}/>
                <LyricsCell value={time_end} id={`${id}_end`}/>
                <LyricsCell value={lyric} align={"right"} rows={2} id={`${id}_lyric`}/>
                <LyricsCell value={translation} rows={2} id={`${id}_translate`}/>
                </TableRow>
        </>
    )

}

function LyricsCell({value,align="left",rows=1,id}){
    return(
        <>
            <TableCell>
                <TextField
                    InputProps={{
                        inputProps: {
                            style: {
                                textAlign: align,
                            },
                        },
                    }}
                    align="right"
                    variant="standard"
                    readOnly
                    multiline
                    fullWidth
                    minRows={rows}
                    value={value}
                    key={id}
                />
            </TableCell>
        </>
    )
}