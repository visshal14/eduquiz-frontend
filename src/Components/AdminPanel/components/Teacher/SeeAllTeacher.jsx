import React, { useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import axios from "../../../../axios"
import { PageHeader, DataTable, DetailDialog, EmptyState, useFeedback } from '../../../ui'

const SeeAllTeacher = () => {
    const notify = useFeedback()
    const [teacher, setTeacher] = useState([])
    const [loading, setLoading] = useState(true)
    const [detailedTeacher, setDetailedTeacher] = useState(null)

    useEffect(() => {
        axios.get("/getAllTeacher").then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify("Could not load teachers.", "error")
            setTeacher(response.data)
        })
        // eslint-disable-next-line
    }, [])

    const startLink = (meetingId) => {
        window.location.href = `/conference/${meetingId}/hello`
    }

    const columns = [
        { key: 'id', label: 'ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'quizes', label: 'Quizzes', align: 'right', render: (row) => row.quizes.length },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Button size="small" variant="outlined" color="inherit" onClick={() => setDetailedTeacher(row)}>
                    Details
                </Button>
            ),
        },
    ]

    const quizColumns = [
        { key: 'quizId', label: 'Quiz ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'total', label: 'Questions', align: 'right', render: (row) => row.question.length },
        { key: 'no_of_question_to_attempt', label: 'To attempt', align: 'right' },
        { key: 'attempted', label: 'Submissions', align: 'right', render: (row) => row.result.length },
    ]

    const roomColumns = [
        { key: 'meeting_id', label: 'Meeting ID', nowrap: true },
        { key: 'name', label: 'Name', render: (row) => row.name || '—' },
        { key: 'password', label: 'Password', render: (row) => row.password || '—' },
        { key: 'time', label: 'Time' },
        { key: 'date', label: 'Date' },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<VideocamOutlinedIcon />}
                    onClick={() => startLink(row.meeting_id)}
                >
                    Join
                </Button>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader title="All teachers" subtitle="Every teacher account, their quizzes and their rooms." />

            <DataTable
                columns={columns}
                rows={teacher}
                loading={loading}
                getRowKey={(row) => row.id}
                empty={<EmptyState title="No teachers yet" description="Add one from the Create teacher screen." />}
            />

            <DetailDialog
                open={Boolean(detailedTeacher)}
                onClose={() => setDetailedTeacher(null)}
                title={detailedTeacher?.name || 'Teacher'}
                subtitle={detailedTeacher?.email}
            >
                <Stack spacing={3}>
                    <DataTable
                        caption="Quizzes"
                        columns={quizColumns}
                        rows={detailedTeacher?.quizes}
                        getRowKey={(row) => row.quizId}
                        empty={<EmptyState title="No quizzes" />}
                    />
                    <DataTable
                        caption="Meeting rooms"
                        columns={roomColumns}
                        rows={detailedTeacher?.room}
                        getRowKey={(row) => row.meeting_id}
                        empty={<EmptyState title="No rooms" />}
                    />
                </Stack>
            </DetailDialog>
        </Box>
    )
}

export default SeeAllTeacher
