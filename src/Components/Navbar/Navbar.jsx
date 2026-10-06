import React, { useState } from 'react'
import {
    AppBar, Avatar, Box, Button, Divider, IconButton, ListItemIcon, ListItemText,
    Menu, MenuItem, Stack, Toolbar, Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useShell } from '../Layout/ShellContext'
import Logo from '../Layout/Logo'
import { layout } from '../../theme'

const panels = [
    { label: 'Student panel', href: '/student', icon: <PersonOutlineIcon fontSize="small" /> },
    { label: 'Teacher panel', href: '/teacher', icon: <SchoolOutlinedIcon fontSize="small" /> },
    { label: 'Admin panel', href: '/admin/CreateQuiz', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" /> },
]

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null)
    const { hasSidebar, toggleSidebar } = useShell()
    const { pathname } = useLocation()

    // The conference runs its own full-bleed dark chrome and takes the whole
    // viewport, so the marketing/app navbar stays out of its way.
    if (pathname.startsWith('/conference')) return null

    const isHome = pathname === '/'
    const logout = () => {
        window.localStorage.removeItem('accessToken')
        window.location.href = '/'
    }

    return (
        <AppBar
            position="sticky"
            elevation={0}
            color="transparent"
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ minHeight: `${layout.navHeight}px !important`, px: { xs: 2, md: 3 }, gap: 1 }}>
                {hasSidebar && (
                    <IconButton
                        edge="start"
                        onClick={toggleSidebar}
                        aria-label="Open navigation"
                        sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 0.5 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Logo />

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Button
                        component={RouterLink}
                        to="/"
                        color={isHome ? 'primary' : 'inherit'}
                        sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: isHome ? 700 : 500 }}
                    >
                        Home
                    </Button>

                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Account menu" sx={{ ml: 0.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                            <PersonOutlineIcon fontSize="small" />
                        </Avatar>
                    </IconButton>
                </Stack>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{ paper: { sx: { minWidth: 216 } } }}
                >
                    <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, py: 0.5, display: 'block' }}>
                        Go to
                    </Typography>
                    {panels.map((panel) => (
                        <MenuItem
                            key={panel.href}
                            component={RouterLink}
                            to={panel.href}
                            onClick={() => setAnchorEl(null)}
                        >
                            <ListItemIcon>{panel.icon}</ListItemIcon>
                            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>
                                {panel.label}
                            </ListItemText>
                        </MenuItem>
                    ))}
                    <Divider sx={{ my: 0.75 }} />
                    <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
                        <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>Log out</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
