import React, { useEffect } from 'react'
import { Box, Button, Card, Chip, Container, LinearProgress, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined'
import { layout, tokens } from '../../theme'

const features = [
    {
        icon: <QuizOutlinedIcon />,
        title: 'Quiz engine',
        body: 'Build quizzes by hand or import a CSV. Assign them by email, randomise the question order, and release results when you are ready.',
    },
    {
        icon: <VideocamOutlinedIcon />,
        title: 'Live rooms',
        body: 'Peer-to-peer video with screen share, participant list and recording. No third-party meeting service in the loop.',
    },
    {
        icon: <BrushOutlinedIcon />,
        title: 'Shared whiteboard',
        body: 'Pens, shapes, colours and undo — synced live. Keep it host-only or hand the pen to the whole room.',
    },
]

function Home() {
    // Existing embed handshake — kept as-is so host pages that listen for it
    // keep working.
    useEffect(() => {
        const timer = setTimeout(() => {
            window.top.postMessage('hello', '*')
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <Box sx={{ flex: 1, bgcolor: 'background.paper' }}>
            {/* ---------------------------------------------------------- hero */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    // Two soft colour washes behind the fold, nothing loud.
                    backgroundImage: `
                        radial-gradient(900px 420px at 12% -8%, ${tokens.accentSoft} 0%, transparent 60%),
                        radial-gradient(700px 380px at 92% 8%, #F0FDFA 0%, transparent 60%)
                    `,
                }}
            >
                <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gap: { xs: 6, md: 8 },
                            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
                            alignItems: 'center',
                            minHeight: { md: `calc(100vh - ${layout.navHeight}px - 160px)` },
                        }}
                    >
                        <Box>
                            <Chip
                                label="Quizzes · Live classes · Whiteboard"
                                size="small"
                                sx={{
                                    mb: 3,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                }}
                            />
                            <Typography variant="h1" sx={{ mb: 2.5 }}>
                                Test what you know.
                                <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                                    Learn what you don&rsquo;t.
                                </Box>
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                sx={{ maxWidth: 520, mb: 4, fontSize: '1.0625rem' }}
                            >
                                One platform for assigning quizzes, running live sessions and teaching on a
                                shared whiteboard — for teachers and their students.
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                <Button
                                    component={RouterLink}
                                    to="/student/login/0"
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Get started
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/teacher/login/0"
                                    variant="outlined"
                                    size="large"
                                    color="inherit"
                                >
                                    I&rsquo;m a teacher
                                </Button>
                            </Stack>
                        </Box>

                        <QuizPreview />
                    </Box>
                </Container>
            </Box>

            {/* ------------------------------------------------------ features */}
            <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
                <Typography variant="h2" sx={{ mb: 1 }}>Everything a class needs</Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 5, maxWidth: 560 }}>
                    Built around the three things that actually happen in a lesson.
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    }}
                >
                    {features.map((feature) => (
                        <Card key={feature.title} sx={{ p: 3, height: '100%' }}>
                            <Box
                                sx={{
                                    width: 40, height: 40, mb: 2,
                                    display: 'grid', placeItems: 'center',
                                    borderRadius: 2,
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Typography variant="h5" sx={{ mb: 1 }}>{feature.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{feature.body}</Typography>
                        </Card>
                    ))}
                </Box>
            </Container>

            {/* -------------------------------------------------------- footer */}
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary">
                        EduQuiz — React, WebRTC, PeerJS, Socket.io.
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}

/**
 * A static mock of the quiz-taking screen. Rendered rather than shipped as an
 * image so it stays crisp and always matches the real design tokens.
 */
const QuizPreview = () => (
    <Card
        sx={{
            p: 0,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(15, 23, 42, 0.14)',
            transform: { md: 'rotate(-1.2deg)' },
        }}
    >
        <Box sx={{ px: 3, py: 2.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Question 3 of 10</Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>02:14 left</Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={30}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.25)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#fff' },
                }}
            />
            <Typography variant="h5" sx={{ mt: 2.5, fontSize: '1.0625rem' }}>
                Which protocol lets browsers stream media directly to each other?
            </Typography>
        </Box>

        <Stack spacing={1.25} sx={{ p: 3 }}>
            {[
                { label: 'HTTP long polling', correct: false },
                { label: 'WebRTC', correct: true },
                { label: 'FTP', correct: false },
                { label: 'SMTP', correct: false },
            ].map((option) => (
                <Stack
                    key={option.label}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                        px: 2, py: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: option.correct ? 'success.main' : 'divider',
                        bgcolor: option.correct ? tokens.successSoft : 'transparent',
                    }}
                >
                    <Box
                        sx={{
                            width: 18, height: 18, borderRadius: '50%',
                            display: 'grid', placeItems: 'center',
                            border: option.correct ? 'none' : '1.5px solid',
                            borderColor: 'divider',
                            color: 'success.main',
                        }}
                    >
                        {option.correct && <CheckCircleIcon sx={{ fontSize: 18 }} />}
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: option.correct ? 600 : 400 }}
                    >
                        {option.label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    </Card>
)

export default Home
