import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

/**
 * Shared chrome state between the Navbar and whichever panel layout is mounted.
 *
 * The mobile menu button lives in the Navbar but the drawer it opens belongs to
 * PanelLayout, so the two need a channel. PanelLayout also announces its own
 * presence, which is how the Navbar knows whether to show the button at all.
 */
const ShellContext = createContext({
    sidebarOpen: false,
    openSidebar: () => { },
    closeSidebar: () => { },
    toggleSidebar: () => { },
    hasSidebar: false,
    setHasSidebar: () => { },
})

export const ShellProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [hasSidebar, setHasSidebar] = useState(false)

    const openSidebar = useCallback(() => setSidebarOpen(true), [])
    const closeSidebar = useCallback(() => setSidebarOpen(false), [])
    const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])

    const value = useMemo(
        () => ({ sidebarOpen, openSidebar, closeSidebar, toggleSidebar, hasSidebar, setHasSidebar }),
        [sidebarOpen, openSidebar, closeSidebar, toggleSidebar, hasSidebar],
    )

    return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export const useShell = () => useContext(ShellContext)

export default ShellProvider
