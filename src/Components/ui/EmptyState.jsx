import React from 'react'
import { Box, Typography } from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

const EmptyState = ({ icon, title = 'Nothing here yet', description }) => (
    <Box sx={{ py: 6, px: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Box
            sx={{
                width: 44, height: 44, mx: 'auto', mb: 1.5,
                display: 'grid', placeItems: 'center',
                borderRadius: 2, bgcolor: 'action.hover', color: 'text.secondary',
            }}
        >
            {icon || <InboxOutlinedIcon fontSize="small" />}
        </Box>
        <Typography variant="subtitle1" color="text.primary" fontWeight={600}>{title}</Typography>
        {description && (
            <Typography variant="body2" sx={{ mt: 0.5, maxWidth: 380, mx: 'auto' }}>{description}</Typography>
        )}
    </Box>
)

export default EmptyState
