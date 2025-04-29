import { AppBar, Button, Input, Toolbar, IconButton, Typography, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect, Children } from 'react';

export function Layout ( {fetchLyrics, children} ) {
    // no sync: tristam different
    // sync: eden take care
    const [search, setSearch] = useState('')
    const [query,setQuery] = useState('eden take care')

    useEffect(
        ()=>{
            fetchLyrics(query)
        },[query]
    )

    const handleSubmit = (event) => {
        event.preventDefault()
        if (query===search.trim()) return
        setQuery(search.trim())
    }

    const handleChange = (event) => {
        const newSearch = event.target.value
        setSearch(newSearch)
    }

    return (
        <>
            <AppBar component="nav">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                >
                    <MenuIcon/>
                </IconButton>
                <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
                />
                    <Box>
                        <form onSubmit={handleSubmit}>
                        <Input onChange={handleChange} value={search} placeholder='EDEN - take care'></Input>
                        <IconButton
                            size="medium"
                            edge="start"
                            color="inherit"
                            type='submit'
                        >
                            <SearchIcon/>
                        </IconButton>
                        </form>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
            {/* {Replace sx p to 3} */}
            <Box component="main" sx={{ p: 6 }}>
                { children }
            </Box>
        </>
    )
}