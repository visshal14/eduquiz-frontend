import React from 'react'
import { Box, Stack, Typography } from '@mui/material'

/**
 * Title block that opens every panel screen. `actions` sits on the right on
 * desktop and wraps underneath on narrow viewports.
 */
const PageHeader = ({ title, subtitle, actions }) => (
    <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
    >
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="h3" component="h1">{title}</Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
        {actions && <Stack direction="row" spacing={1} flexShrink={0}>{actions}</Stack>}
    </Stack>
)

export default PageHeader
