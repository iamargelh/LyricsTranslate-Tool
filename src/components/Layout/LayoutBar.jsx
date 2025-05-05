import { styled, Toolbar, Box, ToggleButtonGroup, ToggleButton, Button, IconButton, TextField, Input } from '@mui/material'
import MuiAppBar from "@mui/material/AppBar"
import { useEffect, useState } from 'react'
import { Save, DeleteOutline } from "@mui/icons-material"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"


export function TopBar ({drawerOpen,toggleDrawerOpen,fullTrackName,discard,drawerWidth,query,setQuery}){
  const [tittle,setTittle] = useState("Untitled")
  const [search, setSearch] = useState("")

  useEffect(()=>{
    const artistName = fullTrackName?.artistName?.[0] ?? false
    if (!artistName) {
      setTittle("Untitled")
      return
    }
    const newTittle = `${artistName} - ${fullTrackName.trackName}`
    setTittle(newTittle)
  },[fullTrackName])


  const handleTittleChange = (event)=>{
    setTittle(event.target.value)
  }

  const handleDiscard = ()=>{
    discard()
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    if (query === search.trim()) return
    setQuery(search.trim())
  }

  return(
    <AppBar position="fixed" drawerOpen={drawerOpen} drawerWidth={drawerWidth}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={toggleDrawerOpen}
          sx={[
            { mr: 2 },
            drawerOpen && { visibility: "hidden" }, //  display: 'none'  causes popping
          ]}
        >
          <MenuIcon />

        </IconButton>
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
            <TextField
                InputProps={{
                    inputProps: {
                        style: {
                            textAlign: "center",
                            height:"1rem",
                            fontSize:"1.8rem"
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
                        // marginTop:'-4px',
                        // paddingBottom:'2.5px'

                    }
                }
                fullWidth
                onChange={handleTittleChange}
                variant="outlined"
                value={tittle}
                key={"TRACKNAME"}
                margin="none"
                label="Tittle"
                color="primary"
                focused

            />
          </Box>
          <Box sx={{
            display:"flex",
            // border:'dashed red',
            height:"3rem",
            alignItems:"center",
            justifyContent:"center"
          }}>
            <form onSubmit={handleSubmit} alignItems>
              <Input
                onChange={handleChange}
                value={search}
                placeholder="tristam - ruthless"
              ></Input>
              <IconButton
                size="medium"
                edge="start"
                color="inherit"
                type="submit"
              >
                <SearchIcon />
              </IconButton>
            </form>
          </Box>
          <Box sx={{
            display:"flex",
            // border:'dashed red',
            height:"3rem",
            alignItems:"center",
            justifyContent:"center"
          }}>
            <Button variant="contained" color="error" startIcon={<DeleteOutline/>} onClick={handleDiscard}>
              <b>Discard</b>
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export function BottomBar ({drawerOpen, drawerWidth}){
    const [alignment, setAlignment] = useState('translation')

    const handleChangeSave = (event, newAlignment) => {
        setAlignment(newAlignment)
    }

    return(
        <AppBar position="fixed" drawerWidth={drawerWidth} drawerOpen={drawerOpen} sx={{ top: 'auto', bottom: 0 }}>
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
                  }}></Box>

                  <Box sx={{
                  // border:'dashed red',
                  height:"100%"
                  }}>

                      <Box sx={{
                    // border:'dashed red',
                    height:"100%"
                    }}/>
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "drawerOpen" && prop !== "drawerWidth",
})(({ theme, drawerWidth }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))