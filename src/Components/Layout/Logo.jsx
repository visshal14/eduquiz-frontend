import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

/**
 * Wordmark plus mark. The mark is a checked answer box — the one gesture the
 * whole product is about.
 */
const Logo = ({ to = '/', invert = false, size = 30 }) => (
    <Box
        component={to ? RouterLink : 'div'}
        to={to || undefined}
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            textDecoration: 'none',
            color: invert ? '#fff' : 'text.primary',
            flexShrink: 0,
        }}
    >
        <Box
            component="svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            sx={{ width: size, height: size, display: 'block', color: 'primary.main' }}
        >
            <rect width="32" height="32" rx="9" fill="currentColor" />
            <path
                d="M9.5 16.6l4.2 4.2 8.8-9.4"
                fill="none"
                stroke="#fff"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Box>
        <Typography
            component="span"
            sx={{ fontSize: '1.125rem', fontWeight: 750, letterSpacing: '-0.02em', lineHeight: 1 }}
        >
            EduQuiz
        </Typography>
    </Box>
)

export default Logo
