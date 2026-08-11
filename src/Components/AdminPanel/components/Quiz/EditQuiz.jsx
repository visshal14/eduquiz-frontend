import React, { useEffect, useState } from 'react'
import {
    Box, Button, Card, Chip, Divider, FormControlLabel, IconButton, MenuItem, Stack, Switch,
    TextField, Tooltip, Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import axios from "../../../../axios"
import QuestionEditor from './QuestionEditor'
import { PageHeader, DataTable, DetailDialog, EmptyState, useFeedback } from '../../../ui'

const EditQuiz = ({ teacher }) => {
    const notify = useFeedback()

    const [name, setName] = useState("")
    const [quizes, setQuizes] = useState([])
    const [isEditTrue, setIsEditTrue] = useState(false)
    const [question, setQuestion] = useState([])
    const [studentEmails, setStudentEmails] = useState(" ")
    const [releaseResult, setReleaseResult] = useState(false)
    const [toAttempt, setToAttempt] = useState("")

    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")
    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(true)

    function getAllQuiz() {
        axios.get(`/getAllQuiz/${teacher ? teacher : "all"}`).then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify("Could not load quizzes.", "error")
            setQuizes(response.data)
        })
    }

    useEffect(() => {
        getAllQuiz()
        if (teacher) {
            setTeacherId(teacher)
        } else {
            axios.get("/getAllTeacher").then((response) => {
                if (response.data.errMsg) {
                    return notify("Could not load teachers. Try again.", "error")
                }
                setTeachers(response.data)
            })
        }
        // eslint-disable-next-line
    }, [teacher])

    const [editQuiz, setEditQuiz] = useState("")

    const editClick = (id) => {
        quizes.forEach((ele) =>
            ele.quizId === id ? setEditQuiz(ele) : ""
        )
        setIsEditTrue(true)
    }

    useEffect(() => {
        setResult(editQuiz?.result)
        setName(editQuiz.name)
        setQuestion(editQuiz.question)
        setStudentEmails(editQuiz.users || " ")
        setReleaseResult(editQuiz.can_release_result || false)
        setToAttempt(editQuiz.no_of_question_to_attempt)
        setTeacherId(editQuiz.owner?.id)
    }, [editQuiz])

    const submit = () => {
        axios.post(`/editQuiz`, {
            teacherId,
            quizId: editQuiz.quizId,
            name: editQuiz.name,
            question,
            studentEmails,
            releaseResult,
            toAttempt,
            result
        }).then((response) => {
            if (response.data.errMsg) return notify("Could not save the quiz.", "error")
            notify(response.data.msg || "Quiz saved.", "success")
            getAllQuiz()
            setIsEditTrue(false)
            setEditQuiz("")
        })
            .catch(function (error) {
                console.log(error);
                notify("Could not reach the server.", "error")
            });
    }

    const NoQuestionAdd = () => {
        setQuestion(prev => [...prev, {
            serialNo: prev.length + 1,
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            answer: ""
        }])
    }

    const updateQuestion = (index, key, value) => {
        setQuestion((prev) => prev.map((ele, j) => (index === j ? { ...ele, [key]: value } : ele)))
    }

    const deleteQuestion = (serialNo) => {
        setQuestion((prev) => prev
            .filter((ele) => parseInt(ele.serialNo) !== parseInt(serialNo))
            .map((ele, i) => ({ ...ele, serialNo: i + 1 })))
    }

    const deleteQuiz = (id) => {
        axios.post(`/deleteQuiz`, {
            id
        }).then((response) => {
            if (response.data.errMsg) return notify("Could not delete the quiz.", "error")
            setQuizes(response.data)
            notify("Quiz deleted.", "success")
        })
            .catch(function (error) {
                console.log(error);
                notify("Could not reach the server.", "error")
            });
    }

    const closeBtn = () => {
        setIsEditTrue(false)
    }

    const toAttemptChanged = (e) => {
        if (e.target.value > question.length) {
            setToAttempt(question.length)
        } else {
            setToAttempt(e.target.value)
        }
    }

    const deleteResult = (e) => {
        setResult((prev) => prev.filter((ele) => ele.id !== e.id))
    }

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
        { key: 'question', label: 'Questions', align: 'right', render: (row) => row.question.length },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => editClick(row.quizId)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => deleteQuiz(row.quizId)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
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
            render: (row) => `${row.result} / ${editQuiz?.no_of_question_to_attempt}`,
        },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Tooltip title="Remove this result">
                    <IconButton
                        size="small"
                        onClick={() => deleteResult(row)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader
                title="Edit quiz"
                subtitle="Pick a quiz to change its details, questions or released results."
            />

            <DataTable
                columns={columns}
                rows={quizes}
                loading={loading}
                getRowKey={(row) => row.quizId}
                empty={<EmptyState title="No quizzes yet" description="Create one from the Create quiz screen." />}
            />

            <DetailDialog
                open={isEditTrue}
                onClose={closeBtn}
                title={editQuiz?.name || 'Edit quiz'}
                subtitle={editQuiz?.quizId ? `Quiz ID ${editQuiz.quizId}` : undefined}
                actions={
                    <>
                        <Button color="inherit" onClick={closeBtn}>Cancel</Button>
                        <Button variant="contained" onClick={submit}>Save changes</Button>
                    </>
                }
            >
                <Stack spacing={3}>
                    <Card>
                        <Box sx={{ px: 3, py: 2.5 }}>
                            <Typography variant="h5" component="h2">Details</Typography>
                        </Box>
                        <Divider />
                        <Box
                            sx={{
                                p: 3,
                                display: 'grid',
                                gap: 2.5,
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                            }}
                        >
                            <TextField
                                label="Quiz name"
                                value={name || ''}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <TextField
                                label="Questions to attempt"
                                value={toAttempt ?? ''}
                                onChange={toAttemptChanged}
                                helperText={`Capped at ${question?.length || 0}`}
                            />

                            <Box sx={{ gridColumn: '1 / -1' }}>
                                <TextField
                                    label="Student emails"
                                    value={studentEmails || ''}
                                    onChange={(e) => setStudentEmails(e.target.value)}
                                    helperText="Separated by commas"
                                />
                            </Box>

                            {!teacher && (
                                <TextField
                                    select
                                    label="Teacher"
                                    value={teacherId || ''}
                                    onChange={(e) => setTeacherId(e.target.value)}
                                >
                                    {teachers?.map((ele) => (
                                        <MenuItem key={ele.id} value={ele.id}>{ele.name}</MenuItem>
                                    ))}
                                </TextField>
                            )}

                            <FormControlLabel
                                sx={{ alignSelf: 'center' }}
                                control={
                                    <Switch
                                        checked={Boolean(releaseResult)}
                                        onChange={() => setReleaseResult(!releaseResult)}
                                    />
                                }
                                label="Release results to students"
                            />
                        </Box>
                    </Card>

                    <DataTable
                        caption="Results"
                        columns={resultColumns}
                        rows={result}
                        getRowKey={(row, i) => row.id ?? i}
                        empty={<EmptyState title="No submissions yet" />}
                    />

                    <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                            <Typography variant="h5" component="h2">
                                Questions
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    {question?.length || 0}
                                </Typography>
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                startIcon={<AddIcon />}
                                onClick={NoQuestionAdd}
                                sx={{ bgcolor: 'background.paper' }}
                            >
                                Add question
                            </Button>
                        </Stack>

                        <Stack spacing={2}>
                            {question?.map((ele, i) => (
                                <QuestionEditor
                                    key={i}
                                    index={i}
                                    value={ele}
                                    onChange={updateQuestion}
                                    onDelete={deleteQuestion}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </DetailDialog>
        </Box>
    )
}

export default EditQuiz
