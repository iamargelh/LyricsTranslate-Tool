
export function DownBar (){
    return(
        <AppBar position="fixed" drawerOpen={drawerOpen} sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
            <Box
                sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr auto",
                width: "100%",
                }}
            >
                <Box sx={{
                // border:'dashed red',
                }}/>
                <Box sx={{
                // border:'dashed red',
                height:"100%"
                }}>
                </Box>
                <Box sx={{
                display:"flex",
                // border:'dashed red',
                height:"3rem",
                alignItems:"center",
                justifyContent:"center"
                }}>
                </Box>
                <Box sx={{
                display:"flex",
                // border:'dashed red',
                height:"3rem",
                alignItems:"center",
                justifyContent:"center",
                }}>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChangeSave}
                    aria-label="Platform"
                    sx={{
                    height:"75%",
                    paddingRight:"10px"
                    }}
                >
                    <ToggleButton value="lyrics">Lyrics</ToggleButton>
                    <ToggleButton value="translation">Translation</ToggleButton>
                </ToggleButtonGroup>
                <Button variant="contained" color="primary" startIcon={<Save/>} onClick={()=>{}}>
                    <b>Save</b>
                </Button>
                </Box>
            </Box>
            </Toolbar>
        </AppBar>
    )
}