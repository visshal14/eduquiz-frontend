import React, { useEffect, useState } from 'react'
import {
    Box, Button, Card, Divider, MenuItem, Stack, TextField, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import axios from "../../../../axios"
import format from "./format.png"
import QuestionEditor from './QuestionEditor'
import { PageHeader, FormCard, FullWidth, DetailDialog, useFeedback } from '../../../ui'

const blankQuestion = (serialNo) => ({
    serialNo,
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: ""
})

const CreateQuiz = ({ teacher }) => {
    const notify = useFeedback()

    const [name, setName] = useState("")
    const [isFormat, setIsFormat] = useState(false)
    //array for question
    const [questions, setQuestion] = useState([blankQuestion(1)])
    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")
    const [studentEmails, setStudentEmails] = useState("")
    const [toAttempt, setToAttempt] = useState("")
    const [noQuestion, setNoQuestion] = useState(1)

    // eslint-disable-next-line
    const [questionUpload, setQuestionUpload] = useState(null)

    const submit = () => {
        if (name === "" || teacherId === "" || questions[0].question === "") {
            return notify("Add a quiz name, a teacher and at least one question.", "warning")
        }

        axios.post(`/createQuiz`, {
            name, questions, teacherId, studentEmails,
            toAttempt
        }).then((response) => {
            if (response.data.errMsg) {
                return notify(response.data.errMsg || "Could not create the quiz.", "error")
            }
            notify(response.data.msg || "Quiz created.", "success")
            setName("")
            setNoQuestion(1)
            setQuestion([blankQuestion(1)])
            setStudentEmails("")
            setToAttempt("")
            setQuestionUpload(null)
        })
            .catch(function (error) {
                console.log(error);
                notify("Could not reach the server.", "error")
            });
    }

    useEffect(() => {
        if (teacher) {
            setTeacherId(teacher)
        } else {

            axios.get("/getAllTeacher").then((response) => {
                if (response.data.errMsg) {
                    return notify("Could not load teachers. Try again.", "error")
                }
                setTeachers(response.data)
                setTeacherId(response.data[0]?.id || "")
            })
        }
        // eslint-disable-next-line
    }, [teacher])

    const NoQuestionAdd = () => {
        setNoQuestion(noQuestion + 1)
        setQuestion(prev => [...prev, blankQuestion(noQuestion + 1)])
    }

    const updateQuestion = (index, key, value) => {
        setQuestion((prev) => prev.map((ele, j) => (index === j ? { ...ele, [key]: value } : ele)))
    }

    const deleteQuestion = (n) => {
        let tempQuestion = questions.filter(ele => parseInt(ele.serialNo) !== parseInt(n))
        tempQuestion.map((ele, i) =>
            ele.serialNo = i + 1
        )
        setNoQuestion(tempQuestion.length)
        setQuestion(tempQuestion)
    }

    //for reading csv file
    const fileReader = new FileReader();
    const fileUpload = async (e) => {
        if (e.target.files[0]) {
            setQuestionUpload(e.target.files[0])
            fileReader.onload = async function (event) {
                const csvOutput = event.target.result;
                let json = convertCsvToJson(csvOutput)
                json.sort((a, b) => {
                    return a.serialNo - b.serialNo;
                });

                if (questions.length === 1 && questions[0].question === "") {
                    setQuestion([])
                    setNoQuestion(json.length)
                } else if (questions.length > 1) {

                    let tempQuestions = questions.filter((ele) => ele.question !== "")
                    setQuestion(tempQuestions)

                    setNoQuestion(tempQuestions.length + json.length)

                }

                // eslint-disable-next-line
                json.map((ele) => {
                    setQuestion(prev => [...prev, {
                        serialNo: prev.length + 1,
                        question: ele.question,
                        option1: ele.option1,
                        option2: ele.option2,
                        option3: ele.option3,
                        option4: ele.option4,
                        answer: ele.answer
                    }])

                })

                notify(`Imported ${json.length} question${json.length === 1 ? '' : 's'}.`, "success")
            };
            fileReader.readAsText(e.target.files[0]);
        }
    }

    function convertCsvToJson(csv) {
        const array = csv.toString().split("\r\n")
        if (array[array.length - 1] === '') {
            array.pop()
        }
        let result = []
        for (let i = 0; i < array.length; i++) {
            let columns = array[i].split(",")
            let tempResult = {}

            if (i !== 0) {
                // eslint-disable-next-line
                array[0].split(",").map((e, j) => {
                    tempResult[e] = columns[j] || ""
                })
                result.push(tempResult)
            }
        }
        return result
    }

    return (
        <Box>
            <PageHeader
                title="Create quiz"
                subtitle="Set the details, then add questions by hand or import them from a CSV."
                actions={
                    <Button variant="contained" onClick={submit}>Create quiz</Button>
                }
            />

            <Stack spacing={3} sx={{ maxWidth: 900 }}>
                <FormCard title="Quiz details">
                    <TextField
                        label="Quiz name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        label="Questions to attempt"
                        value={toAttempt}
                        onChange={(e) => setToAttempt(e.target.value)}
                        helperText="How many of the questions each student sees"
                    />

                    <FullWidth>
                        <TextField
                            label="Student emails"
                            value={studentEmails}
                            onChange={(e) => setStudentEmails(e.target.value)}
                            placeholder="ana@school.edu, ben@school.edu"
                            helperText="Separated by commas"
                        />
                    </FullWidth>

                    {!teacher && (
                        <TextField
                            select
                            label="Teacher"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                        >
                            {teachers?.map((ele) => (
                                <MenuItem key={ele.id} value={ele.id}>{ele.name}</MenuItem>
                            ))}
                        </TextField>
                    )}
                </FormCard>

                <Card>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        justifyContent="space-between"
                        sx={{ px: 3, py: 2.5 }}
                    >
                        <Box>
                            <Typography variant="h5" component="h2">Questions</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                {noQuestion} question{noQuestion === 1 ? '' : 's'} in this quiz
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Button
                                component="label"
                                htmlFor="file"
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<UploadFileOutlinedIcon />}
                            >
                                Import CSV
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<HelpOutlineIcon />}
                                onClick={() => setIsFormat(true)}
                            >
                                Format
                            </Button>
                        </Stack>
                    </Stack>
                    <input
                        type="file"
                        id="file"
                        accept=".csv"
                        value={""}
                        style={{ display: "none" }}
                        onChange={fileUpload}
                    />

                    <Divider />

                    <Stack spacing={2} sx={{ p: 3, bgcolor: 'background.default' }}>
                        {[...Array(noQuestion)]?.map((ele, i) => (
                            <QuestionEditor
                                key={i}
                                index={i}
                                value={questions[i]}
                                onChange={updateQuestion}
                                onDelete={deleteQuestion}
                            />
                        ))}

                        <Button
                            onClick={NoQuestionAdd}
                            startIcon={<AddIcon />}
                            variant="outlined"
                            color="inherit"
                            sx={{ alignSelf: 'flex-start', bgcolor: 'background.paper' }}
                        >
                            Add question
                        </Button>
                    </Stack>

                    <Divider />

                    <Stack direction="row" justifyContent="flex-end" sx={{ px: 3, py: 2 }}>
                        <Button variant="contained" onClick={submit}>Create quiz</Button>
                    </Stack>
                </Card>
            </Stack>

            <DetailDialog
                open={isFormat}
                onClose={() => setIsFormat(false)}
                title="CSV format"
                subtitle="Your file needs these column headers, in any order."
                maxWidth="md"
            >
                <Box
                    component="img"
                    src={format}
                    alt="Example CSV with serialNo, question, option1-4 and answer columns"
                    sx={{ width: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                />
            </DetailDialog>
        </Box>
    )
}

export default CreateQuiz
