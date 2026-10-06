import React from 'react'
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material'

/**
 * A titled card wrapping a group of form fields, with an optional footer for
 * the submit row. `columns` lays the children out on a responsive grid.
 */
const FormCard = ({ title, description, children, footer, columns = 2, maxWidth = 900 }) => (
    <Card sx={{ maxWidth }}>
        {(title || description) && (
            <>
                <Box sx={{ px: 3, py: 2.5 }}>
                    {title && <Typography variant="h5" component="h2">{title}</Typography>}
                    {description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {description}
                        </Typography>
                    )}
                </Box>
                <Divider />
            </>
        )}
        <CardContent sx={{ p: 3 }}>
            <Box
                sx={{
                    display: 'grid',
                    gap: 2.5,
                    gridTemplateColumns: { xs: '1fr', sm: `repeat(${columns}, minmax(0, 1fr))` },
                }}
            >
                {children}
            </Box>
        </CardContent>
        {footer && (
            <>
                <Divider />
                <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ px: 3, py: 2 }}>
                    {footer}
                </Stack>
            </>
        )}
    </Card>
)

/** Makes a child span the full width of the FormCard grid. */
export const FullWidth = ({ children }) => (
    <Box sx={{ gridColumn: '1 / -1' }}>{children}</Box>
)

export default FormCard
