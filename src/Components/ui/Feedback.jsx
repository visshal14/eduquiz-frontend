import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

const FeedbackContext = createContext(() => { })

/**
 * Replaces window.alert() across the app with a non-blocking snackbar.
 *
 * `notify(message, severity)` — severity is one of success | error | info | warning.
 */
export const FeedbackProvider = ({ children }) => {
    const [toast, setToast] = useState(null)

    const notify = useCallback((message, severity = 'info') => {
        setToast({ message, severity, key: Date.now() })
    }, [])

    const value = useMemo(() => notify, [notify])

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            <Snackbar
                key={toast?.key}
                open={Boolean(toast)}
                autoHideDuration={4000}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast(null)}
                    severity={toast?.severity || 'info'}
                    variant="filled"
                    sx={{ boxShadow: 3 }}
                >
                    {toast?.message}
                </Alert>
            </Snackbar>
        </FeedbackContext.Provider>
    )
}

export const useFeedback = () => useContext(FeedbackContext)

export default FeedbackProvider
