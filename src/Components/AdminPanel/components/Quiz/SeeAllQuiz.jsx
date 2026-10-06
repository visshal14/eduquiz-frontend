import React, { useEffect, useState } from 'react'
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material'
import axios from "../../../../axios"
import { PageHeader, DataTable, DetailDialog, EmptyState, questionColumns, useFeedback } from '../../../ui'

const SeeAllQuiz = ({ teacher }) => {
    const notify = useFeedback()
    const [quizes, setQuizes] = useState([])
    const [loading, setLoading] = useState(true)
    const [detailedQuiz, setDetailedQuiz] = useState()
    const [detailedQuestionAttempted, setDetailedQuestionAttempted] = useState(null)

    useEffect(() => {
        axios.get(`/getAllQuiz/${teacher ? teacher : "all"}`).then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify("Could not load quizzes.", "error")
            setQuizes(response.data)
        })
        // eslint-disable-next-line
    }, [teacher])

    const columns = [
        { key: 'quizId', label: 'Quiz ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'owner', label: 'Teacher', render: (row) => row.owner?.name },
        {
            key: 'can_release_result',
            label: 'Results',
            render: (row) => (
                <Chip
                    size="small"
                    label={row.can_release_result ? 'Released' : 'Held'}
                    color={row.can_release_result ? 'success' : 'default'}
                    variant={row.can_release_result ? 'filled' : 'outlined'}
                />
            ),
        },
        { key: 'questions', label: 'Questions', align: 'right', render: (row) => row.question.length },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Button size="small" variant="outlined" color="inherit" onClick={() => setDetailedQuiz(row)}>
                    Details
                </Button>
            ),
        },
    ]

    const resultColumns = [
        { key: 'student', label: 'Student ID', nowrap: true },
        { key: 'name', label: 'Name' },
        {
            key: 'result',
            label: 'Marks',
            align: 'right',
            render: (row) => (
                <Typography variant="body2" fontWeight={600}>
                    {row.result} / {detailedQuiz?.no_of_question_to_attempt}
                </Typography>
            ),
        },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={() => setDetailedQuestionAttempted(row.questionAttempted)}
                >
                    Answer key
                </Button>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader title="All quizzes" subtitle="Every quiz, who owns it and how students did." />

            <DataTable
                columns={columns}
                rows={quizes}
                loading={loading}
                getRowKey={(row) => row.quizId}
                empty={<EmptyState title="No quizzes yet" description="Create one from the Create quiz screen." />}
            />

            {/* Quiz detail */}
            <DetailDialog
                open={Boolean(detailedQuiz)}
                onClose={() => setDetailedQuiz(null)}
                title={detailedQuiz?.name || 'Quiz'}
                subtitle={detailedQuiz?.quizId ? `Quiz ID ${detailedQuiz.quizId}` : undefined}
            >
                <Stack spacing={3}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Assigned students
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            {detailedQuiz?.users || '—'}
                        </Typography>
                    </Card>

                    {detailedQuiz?.result?.length > 0 && (
                        <DataTable
                            caption="Results"
                            columns={resultColumns}
                            rows={detailedQuiz.result}
                            getRowKey={(row, i) => row.id ?? i}
                        />
                    )}

                    <DataTable
                        caption="Questions"
                        columns={questionColumns()}
                        rows={detailedQuiz?.question}
                        getRowKey={(row, i) => i}
                    />
                </Stack>
            </DetailDialog>

            {/* Per-student answer key, opened from the results table above */}
            <DetailDialog
                open={Boolean(detailedQuestionAttempted)}
                onClose={() => setDetailedQuestionAttempted(null)}
                title="Answer key"
                subtitle="What this student chose, against the correct answer."
            >
                <DataTable
                    columns={questionColumns({ numberKey: 'questionNo', withChosen: true })}
                    rows={detailedQuestionAttempted}
                    getRowKey={(row, i) => i}
                />
            </DetailDialog>
        </Box>
    )
}

export default SeeAllQuiz
