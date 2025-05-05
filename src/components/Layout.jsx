import {
  Input,
  Toolbar,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material"
import { styled } from "@mui/material/styles"
import MuiAppBar from "@mui/material/AppBar"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import { useState, useEffect } from "react"
import { AppDrawer } from "./AppDrawer"
import { DeleteOutline, Save } from "@mui/icons-material"


const drawerWidth = 270
export function Layout({ discard, fetchLyrics, fullTrackName, children }) {
  // no sync: tristam different
  // sync: eden take care
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("eden take care")
  const [tittle,setTittle] = useState("Untitled")
  const [alignment, setAlignment] = useState('translation');


  const handleChangeSave = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(()=>{
    const artistName = fullTrackName?.artistName?.[0] ?? false
    if (!artistName) {
      setTittle("Untitled")
      return
    }
    const newTittle = `${artistName} - ${fullTrackName.trackName}`
    setTittle(newTittle)
  },[fullTrackName])

  useEffect(() => {
    fetchLyrics(query)
  }, [query])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (query === search.trim()) return
    setQuery(search.trim())
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
  }
  const handleTittleChange = (event)=>{
    setTittle(event.target.value)
  }

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleDiscard = ()=>{
    discard()
  }

  return (
    <>
      <AppBar position="fixed" drawerOpen={drawerOpen}>
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
                          input.selectionStart = input.value.length;
                          input.selectionEnd = input.value.length;
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
      <AppDrawer
        drawerOpen={drawerOpen}
        toggleDrawerOpen={toggleDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <List>
          <ListItem key="wipItem" disablePadding>
            <ListItemButton>
              <ListItemText primary={`Work in Progress`} />
            </ListItemButton>
          </ListItem>
        </List>
      </AppDrawer>
      <MainContent drawerOpen={drawerOpen}>{children}</MainContent>
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
    </>
  )
}

// from https://mui.com/material-ui/react-drawer/#persistent-drawer, still learning it.
const MainContent = styled("main", {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(6), // padding should be 3
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `0px`,
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}px`,
      },
    },
  ],
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})(({ theme }) => ({
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
