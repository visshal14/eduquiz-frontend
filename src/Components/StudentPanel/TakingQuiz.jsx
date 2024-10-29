import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from "../../axios"
import "./TakingQuiz.css"
const TakingQuiz = () => {


    const { id } = useParams()
    // eslint-disable-next-line
    const [currentUser, setCurrentUser] = useState()
    const currentUserRef = useRef()
    const [quizes, setQuizes] = useState()
    const [questionRandom, setQuestionRandom] = useState()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const currentQuestionRef = useRef(0)
    const [result, setResult] = useState(0)
    const resultRef = useRef(0)
    // const [isResultSend, setIsResultSend] = useState(false)
    const resultSendRef = useRef(false)

    // const [questionAttempted, setQuestionAttempted] = useState([])
    const questionAttemptedRef = useRef([])
    const question_to_attempt = useRef()


    useEffect(() => {
        //getQuestion
        axios.get(`/getQuestion/${id}`,
            { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }
        ).then((response) => {

            if (response.data.errMsg) return alert("Error")
            setQuizes(response.data)
        })


        //getStudent
        axios.get(`/getStudentQuiz`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            currentUserRef.current = response.data
            setCurrentUser(response.data)

        })

    }, [id])


    useEffect(() => {
        // eslint-disable-next-line


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
        // console.log(quizes)
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
        // console.log(quizes?.question[questionRandom[currentQuestion]])
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
    // useEffect(() => {
    //     console.log("current")
    //     console.log(currentUser)
    // }, [currentUser])
    //result submit
    const putResult = () => {
        // console.log(currentUserRef)
        axios.post("/putResult", {
            id: currentUserRef.current.id,
            result: resultRef.current,
            quizId: id,
            name: currentUserRef.current?.name,
            questionAttempted: questionAttemptedRef.current
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            // console.log(response.data)
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

    const checkAnswer = async () => {
        var inputs = document.getElementsByName('answerOptions');
        for (var input of inputs) {
            if (input.checked) {
                // quizes?.question[questionRandom[currentQuestion]]
                let value = input.value
                let temp = quizes?.question[questionRandom[currentQuestion]]
                // setQuestionAttempted(prev => [...prev, {
                //     questionNo: temp.serialNo,
                //     question: temp.question,
                //     option1: temp.option1,
                //     option2: temp.option2,
                //     option3: temp.option3,
                //     option4: temp.option4,
                //     answer: temp.answer,
                //     chosen: value
                // }])
                questionAttemptedRef.current.push({
                    questionNo: temp.serialNo,
                    question: temp.question,
                    option1: temp.option1,
                    option2: temp.option2,
                    option3: temp.option3,
                    option4: temp.option4,
                    answer: temp.answer,
                    chosen: value
                })

                // console.log(quizes?.question[questionRandom[currentQuestion]])
                if (quizes?.question[questionRandom[currentQuestion]]?.answer === input.value) {
                    setResult(result + 1);
                    resultRef.current = resultRef.current + 1
                }
                // eslint-disable-next-line
                input.checked = false
            }
        }

    }





    return (
        <div className='takingQuiz-main'>
            <div className='quiz_main'>
                <div className='quiz_content' >
                    <div className='quiz_quizArea'>
                        <div className='quiz_question'>
                            <span className="quiz_questionNumber" style={{
                                border: "1px solid ",
                                boderColor: "#308C99",
                                padding: "0 5px",
                                marginRight: "5px"
                            }}>Q{currentQuestion + 1} Out of {quizes?.no_of_question_to_attempt}</span>
                            {quizes?.question[questionRandom[currentQuestion]]?.question}

                        </div>
                        <div className='quiz_options'>
                            <label htmlFor="option_1">
                                <input type="radio" id="option_1" name="answerOptions" value={quizes?.question[questionRandom[currentQuestion]]?.option1} />{quizes?.question[questionRandom[currentQuestion]]?.option1}</label>
                            <label htmlFor="option_2">
                                <input type="radio" id="option_2" name="answerOptions" value={quizes?.question[questionRandom[currentQuestion]]?.option2} />{quizes?.question[questionRandom[currentQuestion]]?.option2}</label>
                            <label htmlFor="option_3">
                                <input type="radio" id="option_3" name="answerOptions" value={quizes?.question[questionRandom[currentQuestion]]?.option3} />{quizes?.question[questionRandom[currentQuestion]]?.option3}</label>
                            <label htmlFor="option_4">
                                <input type="radio" id="option_4" name="answerOptions" value={quizes?.question[questionRandom[currentQuestion]]?.option4} />{quizes?.question[questionRandom[currentQuestion]]?.option4}</label>

                        </div>
                        <div className='quiz_submitBtn'>

                            <button onClick={nextQuestion} className='submitBtn'>Next Question</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>


    )
}

export default TakingQuiz