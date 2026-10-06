import React, { useState } from 'react'
import {
    Alert, Box, Button, CircularProgress, Container, IconButton, InputAdornment,
    Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import CheckIcon from '@mui/icons-material/Check'
import axios from '../../axios'
import Logo from '../Layout/Logo'
import { layout, tokens } from '../../theme'

/**
 * One login screen for all three roles. The student, teacher and admin routes
 * were three copies of the same markup differing only in endpoint and redirect;
 * those now live in `roles` below.
 */
const roles = {
    student: {
        label: 'Student',
        icon: <PersonOutlineIcon />,
        loginPath: '/student/login/0',
        endpoint: '/react-login',
        redirect: (data) => `/student/${data.id}`,
    },
    teacher: {
        label: 'Teacher',
        icon: <SchoolOutlinedIcon />,
        loginPath: '/teacher/login/0',
        endpoint: '/teacherLogin',
        redirect: (data) => `/teacher/${data.id}/CreateQuiz`,
    },
    admin: {
        label: 'Admin',
        icon: <AdminPanelSettingsOutlinedIcon />,
        loginPath: '/admin/login/0',
        endpoint: '/adminLogin',
        redirect: () => '/admin/CreateQuiz',
    },
}

const highlights = [
    'Assign quizzes and release results when you choose',
    'Run live sessions with screen share and recording',
    'Teach on a whiteboard the whole room can draw on',
]

const AuthPage = ({ role }) => {
    const navigate = useNavigate()
    const config = roles[role]

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const submit = (event) => {
        event.preventDefault()
        if (!email || !password) {
            setError('Enter your email and password.')
            return
        }

        setError('')
        setSubmitting(true)

        axios.post(config.endpoint, { email, password })
            .then((response) => {
                if (response.data.errMsg) {
                    setError(response.data.errMsg)
                    setSubmitting(false)
                    return
                }
                window.localStorage.setItem('accessToken', response.data.accessToken)
                navigate(config.redirect(response.data))
            })
            .catch((err) => {
                console.log(err)
                setError('Could not reach the server. Try again.')
                setSubmitting(false)
            })
    }

    return (
        <Box
            sx={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                minHeight: `calc(100vh - ${layout.navHeight}px)`,
            }}
        >
            {/* ---------------------------------------------------------- form */}
            <Box sx={{ display: 'grid', placeItems: 'center', px: 2, py: { xs: 5, md: 8 } }}>
                <Container maxWidth="xs" disableGutters>
                    <Typography variant="h2" sx={{ mb: 1 }}>Log in to your account</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Welcome back. Pick your role to continue.
                    </Typography>

                    <ToggleButtonGroup
                        value={role}
                        exclusive
                        fullWidth
                        onChange={(_, next) => next && navigate(roles[next].loginPath)}
                        sx={{
                            mb: 3.5,
                            '& .MuiToggleButton-root': {
                                flexDirection: 'column',
                                gap: 0.75,
                                py: 1.75,
                                textTransform: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: 'text.secondary',
                                borderColor: 'divider',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                    borderColor: 'primary.main',
                                    bgcolor: tokens.accentSoft,
                                    zIndex: 1,
                                    '&:hover': { bgcolor: tokens.accentSoft },
                                },
                            },
                        }}
                    >
                        {Object.entries(roles).map(([key, value]) => (
                            <ToggleButton key={key} value={key}>
                                {value.icon}
                                {value.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <Box component="form" onSubmit={submit} noValidate>
                        <Stack spacing={2.5}>
                            {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                autoFocus
                                size="medium"
                            />

                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                size="medium"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword
                                                    ? <VisibilityOffOutlinedIcon fontSize="small" />
                                                    : <VisibilityOutlinedIcon fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={submitting}
                                startIcon={submitting
                                    ? <CircularProgress size={16} color="inherit" />
                                    : null}
                            >
                                {submitting ? 'Signing in…' : `Log in as ${config.label.toLowerCase()}`}
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* --------------------------------------------------- brand panel */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: 8,
                    color: '#fff',
                    background: `linear-gradient(155deg, ${tokens.accentDark} 0%, ${tokens.accent} 55%, #7C3AED 100%)`,
                }}
            >
                <Logo to={null} invert size={34} />
                <Typography variant="h2" sx={{ mt: 4, mb: 3, maxWidth: 420 }}>
                    The classroom, the quiz and the whiteboard in one place.
                </Typography>
                <Stack spacing={2}>
                    {highlights.map((item) => (
                        <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                            <Box
                                sx={{
                                    mt: '2px', width: 20, height: 20, flexShrink: 0,
                                    borderRadius: '50%', display: 'grid', placeItems: 'center',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                <CheckIcon sx={{ fontSize: 13 }} />
                            </Box>
                            <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 380 }}>{item}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </Box>
        </Box>
    )
}

export default AuthPage
