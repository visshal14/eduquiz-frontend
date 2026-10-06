import React from 'react'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

/**
 * Navigation rail for the admin and teacher panels.
 *
 * sections: [{ label, items: [{ id, label, icon }] }]
 * The active item is derived from the current route, so nothing here mutates
 * the DOM to keep highlighting in sync.
 */
const PanelSidebar = ({ sections, activeId, onSelect, footer }) => (
    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flex: 1 }}>
            {sections.map((section) => (
                <Box key={section.label} sx={{ mb: 1.5 }}>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={{ px: 2.5, display: 'block', mb: 0.25 }}
                    >
                        {section.label}
                    </Typography>
                    <List disablePadding sx={{ px: 1.25 }}>
                        {section.items.map((item) => {
                            const selected = item.id === activeId
                            return (
                                <ListItemButton
                                    key={item.id}
                                    selected={selected}
                                    onClick={() => onSelect(item.id)}
                                    sx={{
                                        mb: 0.25,
                                        py: 0.9,
                                        color: selected ? 'primary.main' : 'text.secondary',
                                        '&.Mui-selected': {
                                            backgroundColor: (t) => alpha(t.palette.primary.main, 0.08),
                                            '&:hover': {
                                                backgroundColor: (t) => alpha(t.palette.primary.main, 0.12),
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.875rem',
                                            fontWeight: selected ? 650 : 500,
                                        }}
                                    />
                                </ListItemButton>
                            )
                        })}
                    </List>
                </Box>
            ))}
        </Box>
        {footer && <Box sx={{ px: 2.5, pt: 1 }}>{footer}</Box>}
    </Box>
)

export default PanelSidebar
