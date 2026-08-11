import React, { useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import axios from "../../../../axios"
import { PageHeader, DataTable, DetailDialog, EmptyState, useFeedback } from '../../../ui'

const SeeAllStudent = () => {
    const notify = useFeedback()
    const [student, setStudent] = useState([])
    const [loading, setLoading] = useState(true)
    const [detailedStudent, setDetailedStudent] = useState(null)

    useEffect(() => {
        axios.get("/getAllStudent").then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify("Could not load students.", "error")
            setStudent(response.data)
        })
        // eslint-disable-next-line
    }, [])

    // Each quiz carries every student's result; flatten it down to this one's.
    const getDetails = (ele) => {
        let temp = ele
        // eslint-disable-next-line
        temp.quizes.map((e, i) => {
            if (typeof (e.result) === "object") {
                // eslint-disable-next-line
                e.result.map((r) => {
                    if (r.student === temp.id) {
                        ele.quizes[i].result = r.result
                    }
                })
            }
        })
        setDetailedStudent(ele)
    }

    const columns = [
        { key: 'id', label: 'ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Button size="small" variant="outlined" color="inherit" onClick={() => getDetails(row)}>
                    Details
                </Button>
            ),
        },
    ]

    const quizColumns = [
        { key: 'quizId', label: 'Quiz ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'no_of_question_to_attempt', label: 'Questions', align: 'right' },
        {
            key: 'result',
            label: 'Result',
            align: 'right',
            render: (row) => (row.result?.[0]?.student ? '' : row.result ? row.result : '—'),
        },
    ]

    const roomColumns = [
        { key: 'meeting_id', label: 'Meeting ID', nowrap: true },
        { key: 'name', label: 'Name', render: (row) => row.name || '—' },
        { key: 'password', label: 'Password', render: (row) => row.password || '—' },
        { key: 'time', label: 'Time' },
        { key: 'date', label: 'Date' },
    ]

    return (
        <Box>
            <PageHeader title="All students" subtitle="Every student account, their quizzes and their rooms." />

            <DataTable
                columns={columns}
                rows={student}
                loading={loading}
                getRowKey={(row) => row.id}
                empty={<EmptyState title="No students yet" description="Add one from the Create student screen." />}
            />

            <DetailDialog
                open={Boolean(detailedStudent)}
                onClose={() => setDetailedStudent(null)}
                title={detailedStudent?.name || 'Student'}
                subtitle={detailedStudent?.email}
            >
                <Stack spacing={3}>
                    <DataTable
                        caption="Quizzes"
                        columns={quizColumns}
                        rows={detailedStudent?.quizes}
                        getRowKey={(row) => row.quizId}
                        empty={<EmptyState title="No quizzes assigned" />}
                    />
                    <DataTable
                        caption="Meeting rooms"
                        columns={roomColumns}
                        rows={detailedStudent?.room}
                        getRowKey={(row) => row.meeting_id}
                        empty={<EmptyState title="No rooms" />}
                    />
                </Stack>
            </DetailDialog>
        </Box>
    )
}

export default SeeAllStudent
