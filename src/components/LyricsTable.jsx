import { Input, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField } from "@mui/material";
import { useState } from "react";


export function LyricsTable ({lyricsMap, updateLyrics}){

    return(
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={"9%"} align="right">
                            <Typography variant="h6" variantMapping={"p"}>
                                Start
                                </Typography>
                        </TableCell>
                        <TableCell width={"9%"}>
                            <Typography variant="h6" variantMapping={"p"}>
                                End
                                </Typography>
                        </TableCell>
                        <TableCell width={"30%"} align="right">
                            <Typography variant="h6" variantMapping={"p"}>
                                Lyric
                                </Typography>
                        </TableCell>
                        <TableCell width={"30%"}>
                            <Typography variant="h6" variantMapping={"p"}>
                                Translation
                                </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        (lyricsMap)
                        ? [...lyricsMap].map(([key, content])=>{ // Tenga o no lyrics sync, este será un mapa
                            console.log({content})
                            return <LyricsRow key={key} content={content}/>
                            })
                        : <></>
                    }
                </TableBody>
            </Table>
            { (lyricsMap) ? <></> : <p>{"Cargando Lyrics..."}</p> }
        </>
    )
}

function LyricsRow({content}){
    const [rowInfo,setRowInfo] = useState(content)

    return(
        <>
            <TableRow>
                {
                    Object.values(rowInfo).map((item,key)=>{
                        if (key===4) return
                        const align = (key%2 === 0) ? 'right' : 'left'
                        const rows = (key===2 || key===3) ? 2 : 1
                        return <LyricsCell value={item} align={align} rows={rows}/>
                    }
                    )
                }

            </TableRow>
        </>
    )

}

function LyricsCell({value,align, rows}){
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
                />
            </TableCell>
        </>
    )
}