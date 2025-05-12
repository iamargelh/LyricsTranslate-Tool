import {
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import { useState, useEffect } from 'react'
import { AppDrawer } from './AppDrawer'
import { BottomBar, TopBar } from './Layout/LayoutBar'


const drawerWidth = 270

export function Layout({
  discard,
  fetchLyrics,
  wipTittle,
  setWIPTittle,
  children,
  response,
  setFromFetch,
  wipList,
  setFromStorageItem }) {

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchLyrics(query)
  }, [query])

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <>
      <TopBar
        drawerOpen={drawerOpen}
        toggleDrawerOpen={toggleDrawerOpen}
        wipTittle={wipTittle}
        setWIPTittle={setWIPTittle}
        discard={discard}
        drawerWidth={drawerWidth}
        query={query}
        setQuery={setQuery}
        response={response}
        setFromFetch={setFromFetch}
      />
      <AppDrawer
        drawerOpen={drawerOpen}
        toggleDrawerOpen={toggleDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <List>
          {
            wipList &&
            [...wipList].toReversed().map(([key, content])=>{
              const onClick = ()=>{
                setFromStorageItem(key)
                toggleDrawerOpen()
              }
              return(
                <ListItem key={`wipItem_${key}`} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={content} onClick={onClick} />
                  </ListItemButton>
                </ListItem>
              )
            })
          }
          {/* <ListItem key='wipItem' disablePadding>
            <ListItemButton>
              <ListItemText primary={`Work in Progress`} />
            </ListItemButton>
          </ListItem> */}
        </List>
      </AppDrawer>

      <MainContent drawerOpen={drawerOpen}>{children}</MainContent>

      <BottomBar
        drawerOpen={drawerOpen}
        drawerWidth={drawerWidth}
      />

    </>
  )
}

// from https://mui.com/material-ui/react-drawer/#persistent-drawer, still learning it.
const MainContent = styled('main', {
  shouldForwardProp: (prop) => prop !== 'drawerOpen',
})(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(6), // padding should be 3
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `0px`,
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}px`,
      },
    },
  ],
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'drawerOpen',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))
