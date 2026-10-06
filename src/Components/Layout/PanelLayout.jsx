import React, { useEffect } from 'react'
import { Box, Drawer, Toolbar } from '@mui/material'
import { useShell } from './ShellContext'
import { layout } from '../../theme'

/**
 * Two-column shell shared by the admin and teacher panels: a navigation rail
 * that is permanent from `md` up and a temporary drawer below it, plus the
 * scrolling content column.
 *
 * The drawer's open state lives in ShellContext because the button that toggles
 * it sits in the global Navbar.
 */
const PanelLayout = ({ sidebar, children }) => {
    const { sidebarOpen, closeSidebar, setHasSidebar } = useShell()

    // Tell the Navbar to show its hamburger only while a panel is mounted.
    useEffect(() => {
        setHasSidebar(true)
        return () => setHasSidebar(false)
    }, [setHasSidebar])

    return (
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0, bgcolor: 'background.default' }}>
            {/* Permanent rail — desktop */}
            <Box
                component="nav"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: layout.sidebarWidth,
                    flexShrink: 0,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Box
                    sx={{
                        position: 'sticky',
                        top: layout.navHeight,
                        height: `calc(100vh - ${layout.navHeight}px)`,
                        overflowY: 'auto',
                    }}
                >
                    {sidebar}
                </Box>
            </Box>

            {/* Temporary drawer — mobile */}
            <Drawer
                open={sidebarOpen}
                onClose={closeSidebar}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', md: 'none' } }}
                PaperProps={{ sx: { width: layout.sidebarWidth, borderRight: '1px solid', borderColor: 'divider' } }}
            >
                <Toolbar sx={{ minHeight: `${layout.navHeight}px !important` }} />
                {sidebar}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    px: { xs: 2, sm: 3, lg: 5 },
                    py: { xs: 3, lg: 4 },
                }}
            >
                {children}
            </Box>
        </Box>
    )
}

export default PanelLayout
