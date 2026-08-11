import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
    Box, Button, Card, CircularProgress, Container, Divider, FormControlLabel, LinearProgress,
    Radio, RadioGroup, Stack, Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axios from "../../axios"
import { useFeedback } from '../ui'

const TakingQuiz = () => {
    const { id } = useParams()
    const notify = useFeedback()

    // eslint-disable-next-line
    const [currentUser, setCurrentUser] = useState()
    const currentUserRef = useRef()
    const [quizes, setQuizes] = useState()
    const [questionRandom, setQuestionRandom] = useState()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const currentQuestionRef = useRef(0)
    const [result, setResult] = useState(0)
    const resultRef = useRef(0)
    const resultSendRef = useRef(false)

    // The chosen option for the question on screen. Cleared on every advance.
    const [selected, setSelected] = useState("")

    const questionAttemptedRef = useRef([])
    const question_to_attempt = useRef()

    useEffect(() => {
        //getQuestion
        axios.get(`/getQuestion/${id}`,
            { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }
        ).then((response) => {
            if (response.data.errMsg) return notify("Could not load this quiz.", "error")
            setQuizes(response.data)
        })

        //getStudent
        axios.get(`/getStudentQuiz`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
            if (response.data.errMsg) return notify("Could not load your details.", "error")
            currentUserRef.current = response.data
            setCurrentUser(response.data)
        })
        // eslint-disable-next-line
    }, [id])

    useEffect(() => {
        // result already there then reroute to thank you page
        if (currentUser) {
            // eslint-disable-next-line
            quizes?.result?.map((ele) => {
                if (ele.student === currentUser?.id) {
                    window.location.href = "/thankyou"
                }
            })
        }

        question_to_attempt.current = quizes?.no_of_question_to_attempt
    }, [quizes, currentUser])

    //when quizes loaded random question array generated
    useEffect(() => {
        let x = random(quizes?.question?.length, quizes?.no_of_question_to_attempt)
        setQuestionRandom(x)
        // eslint-disable-next-line
    }, [quizes])

    //start ------- function for unique array
    function random(count, no) {
        let ques = []
        for (let i = 0; i < no; i++) {
            ques.push(Math.floor(Math.random() * (count - 2)) + 1)
            for (let j = 0; j < i; j++) {
                if (ques[i] === ques[j]) {
                    r(count, ques)
                }
            }
        }
        return ques
    }

    function r(count, ques) {
        ques.pop()
        ques.push(Math.floor(Math.random() * (count - 2)) + 1)

        for (let x = 0; x < ques.length; x++) {
            for (let y = 0; y < x; y++) {
                if (ques[x] === ques[y]) {
                    r(count, ques)
                }
            }
        }
    }
    //end -------

    const nextQuestion = () => {
        checkAnswer()
        //if currentQuestion is last question then submit or next question
        if (currentQuestion > (parseInt(quizes?.no_of_question_to_attempt) - 2)) {
            resultSendRef.current = true
            putResult()
            window.location.href = "/thankyou"
            return
        } else {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    //result submit
    const putResult = () => {
        axios.post("/putResult", {
            id: currentUserRef.current.id,
            result: resultRef.current,
            quizId: id,
            name: currentUserRef.current?.name,
            questionAttempted: questionAttemptedRef.current
        }).then((response) => {
            if (response.data.errMsg) return notify("Could not submit your result.", "error")
            window.location.href = "/thankyou"
        })
    }

    useEffect(() => {
        currentQuestionRef.current = currentQuestion
        // eslint-disable-next-line
    }, [currentQuestion])

    useEffect(() => {
        window.addEventListener('beforeunload', function () {
            //only putResult when result already not submitted and currentQuestion is not less than total question before unload
            if (!resultSendRef.current && currentQuestionRef.current !== 0 && currentQuestionRef.current !== (parseInt(question_to_attempt.current) - 1)) {
                putResult()
            }
        }, false)
        // eslint-disable-next-line
    }, [])

    /**
     * Records the answer for the question on screen. Skipping (no selection)
     * records nothing and scores nothing, same as before.
     */
    const checkAnswer = () => {
        if (!selected) return

        const temp = quizes?.question[questionRandom[currentQuestion]]
        questionAttemptedRef.current.push({
            questionNo: temp.serialNo,
            question: temp.question,
            option1: temp.option1,
            option2: temp.option2,
            option3: temp.option3,
            option4: temp.option4,
            answer: temp.answer,
            chosen: selected
        })

        if (temp?.answer === selected) {
            setResult(result + 1)
            resultRef.current = resultRef.current + 1
        }

        setSelected("")
    }

    const question = quizes?.question?.[questionRandom?.[currentQuestion]]
    const total = parseInt(quizes?.no_of_question_to_attempt) || 0
    const isLast = currentQuestion > (total - 2)
    const options = question
        ? [question.option1, question.option2, question.option3, question.option4]
        : []

    if (!question) {
        return (
            <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ flex: 1, bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="md">
                <Card sx={{ overflow: 'hidden' }}>
                    {/* -------------------------------------------- question */}
                    <Box sx={{ px: { xs: 3, md: 4 }, py: 3.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                                Question {currentQuestion + 1} of {total}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                                {quizes?.name}
                            </Typography>
                        </Stack>

                        <LinearProgress
                            variant="determinate"
                            value={total ? ((currentQuestion) / total) * 100 : 0}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.25)',
                                '& .MuiLinearProgress-bar': { bgcolor: '#fff' },
                            }}
                        />

                        <Typography variant="h3" component="h1" sx={{ mt: 3 }}>
                            {question.question}
                        </Typography>
                    </Box>

                    {/* --------------------------------------------- options */}
                    <RadioGroup
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                        sx={{ p: { xs: 2.5, md: 3 }, gap: 1.25 }}
                    >
                        {options.map((option, i) => {
                            const isSelected = selected === option && option !== undefined
                            return (
                                <FormControlLabel
                                    key={i}
                                    value={option ?? ''}
                                    control={<Radio />}
                                    label={option}
                                    sx={{
                                        m: 0,
                                        px: 2,
                                        py: 1.25,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                        bgcolor: isSelected ? 'action.hover' : 'transparent',
                                        transition: 'border-color 120ms, background-color 120ms',
                                        '&:hover': { borderColor: 'primary.light' },
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '1rem',
                                            fontWeight: isSelected ? 600 : 400,
                                        },
                                    }}
                                />
                            )
                        })}
                    </RadioGroup>

                    <Divider />

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ px: { xs: 2.5, md: 3 }, py: 2 }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {selected ? 'Answer selected' : 'Nothing selected — you can skip'}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={nextQuestion}
                            endIcon={!isLast ? <ArrowForwardIcon /> : null}
                        >
                            {isLast ? 'Submit quiz' : 'Next question'}
                        </Button>
                    </Stack>
                </Card>
            </Container>
        </Box>
    )
}

export default TakingQuiz
