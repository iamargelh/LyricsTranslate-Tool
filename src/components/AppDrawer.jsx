import { IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


export function AppDrawer ({drawerWidth=270,toggleDrawerOpen, drawerOpen, children }){

    return(
        <>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
            >
                <DrawerHeader>
                    <IconButton onClick={toggleDrawerOpen}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Box sx={{ overflow: 'auto', mb: 6}}>
                    {children}
                </Box>
                <DrawerFooter>
                    <Typography>LyricTranslate Tool</Typography>
                    <Typography variant='body2'>Made with <span style={{color:'#FF0000'}} >❤</span> by Argel H</Typography>

                </DrawerFooter>
            </Drawer>
        </>
    )
}

const DrawerFooter = styled('div')(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    width:'100%',
    padding: `${theme.spacing(1)} 0 ${theme.spacing(1)} 0`,

    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));