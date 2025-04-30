import {
  Input,
  Toolbar,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import MuiAppBar from "@mui/material/AppBar"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import { useState, useEffect } from "react"
import { AppDrawer } from "./AppDrawer"


const drawerWidth = 270
export function Layout({ fetchLyrics, children }) {
  // no sync: tristam different
  // sync: eden take care
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("eden take care")

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

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen)
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
              gridTemplateColumns: "1fr auto 1fr",
              width: "100%",
            }}
          >
            <Box />
            <Box>
              <form onSubmit={handleSubmit}>
                <Input
                  onChange={handleChange}
                  value={search}
                  placeholder="EDEN - take care"
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
            <Box />
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
