import { styled, Toolbar, Box, ToggleButtonGroup, ToggleButton, Button, IconButton, TextField, Input, Autocomplete, Card, CardActionArea, CardContent, Typography, CircularProgress } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import { useEffect, useState } from 'react'
import { Save, DeleteOutline } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import { useDebounce } from '../../hooks/useDebounce'

export function TopBar ({drawerOpen,toggleDrawerOpen,wipTittle,setWIPTittle,discard,drawerWidth,query,setQuery, response, setFromFetch}){
  const [tittle,setTittle] = useState(wipTittle??'Untitled')
  const [search, setSearch] = useState('')
  const [isSearchBlank,setIsSearchBlank] = useState(true)
  const [searchFocus, setSearchFocus] = useState(false)
  const [isSearching,setIsSearching] = useState(false)
  const debouncedSearch = useDebounce(search,250)

  useEffect(()=>{
    setIsSearching(false)
    if (!wipTittle) setTittle('Untitled')
    else setTittle(wipTittle)
  },[wipTittle])

  useEffect(()=>{
    setIsSearching(false)
  },[response])

  useEffect(()=>{
    if (debouncedSearch.trim() && debouncedSearch.trim() !== query) {
      setQuery(debouncedSearch.trim())
    }
  },[debouncedSearch,query])


  const handleTittleChange = (event)=>{
    setTittle(event.target.value)
  }

  const handleOnBlur = ()=>{
    setWIPTittle(tittle)
  }

  const handleDiscard = ()=>{
    setSearch('')
    discard()
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    if (newSearch.trim() === '') {
      console.log('MAL')
      if(isSearchBlank) return
      setIsSearchBlank(true)
    }
    else {
      if(!isSearchBlank) return
      console.log('BN')
      setIsSearchBlank(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (query === search.trim()) return
    setIsSearching(true)
    setQuery(search.trim())
  }

  const setIndex = (index) => {
    setSearch('')
    setFromFetch(index)
  }

  const onFocus= ()=>{
    setSearchFocus(true)
  }

  const onBlur = ()=>{
    setTimeout(() => {
      if (!searchFocus) return
      setSearchFocus(false)
    }, 150)
  }

  return(
    <AppBar position='fixed' drawerOpen={drawerOpen} drawerWidth={drawerWidth}>
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          onClick={toggleDrawerOpen}
          sx={[
            { mr: 2 },
            drawerOpen && { visibility: 'hidden' }, //  display: 'none'  causes popping
          ]}
        >
          <MenuIcon />

        </IconButton>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            width: '100%',
          }}
        >
          <Box sx={{
            // border:'dashed red',
          }}/>
          <Box sx={{
            // border:'dashed red',
            height:'100%'
          }}>
            <TextField
                InputProps={{
                    inputProps: {
                        style: {
                            textAlign: 'center',
                            height:'1rem',
                            fontSize:'1.8rem'
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
                onBlur={handleOnBlur}
                variant='outlined'
                value={tittle}
                key={'TRACKNAME'}
                margin='none'
                label='Tittle'
                color='primary'
                focused

            />
          </Box>
          <Box sx={{
            display:'flex',
            // border:'dashed red',
            flexDirection:'column',
            height:'3rem',
            alignItems:'center',
            justifyContent:'center'
          }}>
            <form onSubmit={handleSubmit} alignItems>
              <Input
                onChange={handleChange}
                value={search}
                placeholder='tristam - ruthless'
                onFocus={onFocus}
                onBlur={onBlur}
              ></Input>
              <IconButton
                size='medium'
                edge='start'
                color='inherit'
                type='submit'
              >
                {
                isSearching
                ? <CircularProgress size={25}/>
                : <SearchIcon />
                }
              </IconButton>
            </form>
            <Box
            sx={{
              position:'fixed',
              top:'70px',
              width:'20%',
            }}
            >
              <Results
                response={response}
                setIndex={setIndex}
                searchFocus={searchFocus}
                setIsSearching={setIsSearching}
                search={search}
                isBlank={isSearchBlank}/>
            </Box>
          </Box>
          <Box sx={{
            display:'flex',
            // border:'dashed red',
            height:'3rem',
            alignItems:'center',
            justifyContent:'center'
          }}>
            <Button variant='contained' color='error' startIcon={<DeleteOutline/>} onClick={handleDiscard}>
              <b>Discard</b>
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}


export function Results ({response,setIndex,searchFocus,setIsSearching,isBlank}){
  const [items,setItems] = useState()
  const [focus,setFocus] = useState(searchFocus)

  useEffect(()=>{
    setItems(response)
  },[response])

  useEffect(()=>{
    setFocus(searchFocus)
  },[searchFocus])

  return(
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, minmax(min(200px, 10%), 1fr))',
          gap: 0.5,
          opacity: focus ? 1 : 0,
          transition: 'opacity 100ms ease-in-out',
          pointerEvents: focus ? 'auto' : 'none',
        }}
      >
        {
          (items && !isBlank) &&
          items.slice(0,5).map((item,index)=>{
            const onClick = ()=>{
              setIsSearching(true)
              setFocus(false)
              setIndex(index)
            }
            return (
              <Card>
                <CardActionArea
                  onClick={onClick}
                  disableRipple
                >
                  <CardContent>
                    <Typography>
                      {item.artistName+' - '+item.trackName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            )
          })
        }
      </Box>
    </>
  )
}

export function BottomBar ({drawerOpen, drawerWidth}){
    const [alignment, setAlignment] = useState('translation')

    const handleChangeSave = (event, newAlignment) => {
      if (!newAlignment) return
      setAlignment(newAlignment)
    }

    return(
        <AppBar position='fixed' drawerWidth={drawerWidth} drawerOpen={drawerOpen} sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
              <Box
                  sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  width: '100%',
                  }}
              >
                  <Box sx={{
                  // border:'dashed red',
                  }}></Box>

                  <Box sx={{
                  // border:'dashed red',
                  height:'100%'
                  }}>

                      <Box sx={{
                    // border:'dashed red',
                    height:'100%'
                    }}/>
                  </Box>
                  <Box sx={{
                  display:'flex',
                  // border:'dashed red',
                  height:'3rem',
                  alignItems:'center',
                  justifyContent:'center'
                  }}>
                  </Box>
                  <Box sx={{
                  display:'flex',
                  // border:'dashed red',
                  height:'3rem',
                  alignItems:'center',
                  justifyContent:'center',
                  }}>
                  <ToggleButtonGroup
                      color='primary'
                      value={alignment}
                      exclusive
                      onChange={handleChangeSave}
                      aria-label='Platform'
                      sx={{
                      height:'75%',
                      paddingRight:'10px'
                      }}
                  >
                      <ToggleButton value='lyrics'>Lyrics</ToggleButton>
                      <ToggleButton value='translation'>Translation</ToggleButton>
                  </ToggleButtonGroup>
                  <Button variant='contained' color='primary' startIcon={<Save/>} onClick={()=>{}}>
                      <b>Save</b>
                  </Button>
                  </Box>
              </Box>
            </Toolbar>
        </AppBar>
    )
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'drawerOpen' && prop !== 'drawerWidth',
})(({ theme, drawerWidth }) => ({
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