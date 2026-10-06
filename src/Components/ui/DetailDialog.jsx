import React from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

/**
 * Replaces the hand-rolled absolutely-positioned overlay that every screen used
 * to duplicate. Focus trapping, scroll locking and Esc-to-close come from MUI.
 */
const DetailDialog = ({
    open,
    onClose,
    title,
    subtitle,
    actions,
    children,
    maxWidth = 'lg',
}) => (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth={maxWidth} fullWidth scroll="paper">
        <DialogTitle sx={{ pr: 7 }}>
            <Stack spacing={0.25}>
                <Typography variant="h4" component="span">{title}</Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" fontWeight={400}>{subtitle}</Typography>
                )}
            </Stack>
            <IconButton
                onClick={onClose}
                aria-label="Close"
                sx={{ position: 'absolute', right: 12, top: 14, color: 'text.secondary' }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
            {children}
        </DialogContent>
        {actions && <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>}
    </Dialog>
)

export default DetailDialog
