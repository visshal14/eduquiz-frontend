import React from 'react'
import { Box, Button, Card, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const ThankYou = () => (
    <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="sm">
            <Card sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
                <Box
                    sx={{
                        width: 56, height: 56, mx: 'auto', mb: 3,
                        display: 'grid', placeItems: 'center',
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        color: '#fff',
                    }}
                >
                    <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />
                </Box>

                <Typography variant="h2" sx={{ mb: 1.5 }}>Quiz submitted</Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    Your answers are in. Results will appear on your dashboard once your
                    teacher releases them.
                </Typography>

                <Button component={RouterLink} to="/student" variant="contained" size="large">
                    Back to dashboard
                </Button>
            </Card>
        </Container>
    </Box>
)

export default ThankYou
