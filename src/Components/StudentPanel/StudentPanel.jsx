import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Box, Button, Card, Container, Stack, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import axios from "../../axios"
import frontendUrl from '../../frontendUrl'
import { PageHeader, DataTable, DetailDialog, EmptyState, questionColumns } from '../ui'

const StudentPanel = () => {
    const { id } = useParams()
    const [details, setDetails] = useState()
    const [loading, setLoading] = useState(true)
    const [detailedQuiz, setDetailedQuiz] = useState(null)

    useEffect(() => {
        if (id) {
            axios.get(`/getStudent/${id}`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
                setLoading(false)
                if (response.data.errMsg) return window.location.href = "/student/login/0"
                setDetails(response.data)
            })
        } else {
            axios.get("/isStudent", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
                if (response.data.errMsg) {
                    return window.location.href = "/student/login/0"
                }
                window.location.href = `/student/${response.data}`
            })
        }
    }, [id])

    const quizColumns = [
        {
            key: 'name',
            label: 'Quiz',
            render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>,
        },
        { key: 'date', label: 'Date', nowrap: true },
        { key: 'time', label: 'Time', nowrap: true },
        { key: 'owner', label: 'Teacher', render: (row) => row.owner?.name },
        { key: 'no_of_question_to_attempt', label: 'Questions', align: 'right' },
        {
            key: 'result',
            label: 'Result',
            align: 'right',
            render: (row) => (
                <Typography variant="body2" fontWeight={600}>
                    {row.result?.[0]?.result ?? '—'}
                </Typography>
            ),
        },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => {
                // Before results are released the quiz is still takeable;
                // afterwards the answer key replaces the start button.
                if (!row.can_release_result) {
                    return (
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => { window.location = `/takingQuiz/${row.quizId}` }}
                        >
                            Start
                        </Button>
                    )
                }
                if (row.result?.[0]?.questionAttempted) {
                    return (
                        <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            onClick={() => setDetailedQuiz(row.result[0].questionAttempted)}
                        >
                            Answer key
                        </Button>
                    )
                }
                return null
            },
        },
    ]

    const roomColumns = [
        {
            key: 'name',
            label: 'Room',
            render: (row) => <Typography variant="body2" fontWeight={600}>{row.name || '—'}</Typography>,
        },
        { key: 'date', label: 'Date', nowrap: true },
        { key: 'time', label: 'Time', nowrap: true },
        { key: 'meeting_id', label: 'Meeting ID', nowrap: true },
        { key: 'teacher', label: 'Teacher', render: (row) => row.admin_details?.name },
        { key: 'password', label: 'Password', render: (row) => row.password || '—' },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Button
                    size="small"
                    variant="contained"
                    startIcon={<VideocamOutlinedIcon />}
                    href={`${frontendUrl}/conference/${row.meeting_id}/hello`}
                    rel="noreferrer"
                    target="_blank"
                >
                    Join
                </Button>
            ),
        },
    ]

    const initials = (details?.name || '?')
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <Box sx={{ flex: 1, bgcolor: 'background.default', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                <PageHeader title="Your dashboard" subtitle="Quizzes assigned to you and rooms you can join." />

                <Card sx={{ p: 3, mb: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 52, height: 52, bgcolor: 'primary.main', fontWeight: 700 }}>
                            {initials}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h4" noWrap>{details?.name || '—'}</Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {details?.email || '—'}
                            </Typography>
                        </Box>
                    </Stack>
                </Card>

                <Stack spacing={4}>
                    <DataTable
                        caption="Quizzes"
                        columns={quizColumns}
                        rows={details?.quizes}
                        loading={loading}
                        getRowKey={(row, i) => row.quizId ?? i}
                        empty={<EmptyState title="No quizzes assigned" description="Your teacher hasn't set you anything yet." />}
                    />

                    <DataTable
                        caption="Meeting rooms"
                        columns={roomColumns}
                        rows={details?.room}
                        loading={loading}
                        getRowKey={(row, i) => row.meeting_id ?? i}
                        empty={<EmptyState title="No rooms" description="You haven't been invited to a live session." />}
                    />
                </Stack>

                <DetailDialog
                    open={Boolean(detailedQuiz)}
                    onClose={() => setDetailedQuiz(null)}
                    title="Answer key"
                    subtitle="What you chose, against the correct answer."
                >
                    <DataTable
                        columns={questionColumns({ numberKey: 'questionNo', withChosen: true })}
                        rows={detailedQuiz}
                        getRowKey={(row, i) => i}
                    />
                </DetailDialog>
            </Container>
        </Box>
    )
}

export default StudentPanel
