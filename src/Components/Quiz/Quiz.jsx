import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { quiztime } from '../../Assets/src'
import Button from '../Button'
import "./Quiz.css"
import { LoginChecker } from "../../LoginChecker"
import { useEffect } from 'react'
import axios from "../../axios"


function Quiz() {
    let { course } = useParams()
    LoginChecker(-1)

    const [quiz_result_display, setQuiz_result_display] = useState("none")
    const [questionAnswer, setQuestionAnswer] = useState({
        question_no: "1",
        question_name: "",
        option_1: "",
        option_2: "",
        option_3: "",
        option_4: "",
        correct_answer: ""
    })
    const [currentQuesNo, setCurrentQuesNo] = useState(1)
    const [easyQuesNo, setEasyQuesNo] = useState({})
    const [interQuesNo, setInterQuesNo] = useState({})
    const [hardQuesNo, setHardQuesNo] = useState({})
    const [questionArray, setQuestionArray] = useState([])
    const [result, setResult] = useState(0)
    const [resultStat, setResultStat] = useState([])

    const checkAnswer = async () => {
        var inputs = document.getElementsByName('answerOptions');
        for (var input of inputs) {
            if (input.checked) {

                if (questionAnswer.correct_answer === input.value) {
                    setResult(result + 1);
                }
                // eslint-disable-next-line
                await setResultStat(resultStat => [...resultStat, { questionName: questionAnswer.question_name, yourAnwser: input.value, correctAnswer: questionAnswer.correct_answer }])
                input.checked = false
            }
        }

    }

    const nextQuestion = () => {
        checkAnswer()
        if (currentQuesNo === 15) {
            return complete()
        }
        setQuestionAnswer({
            question_no: currentQuesNo + 1,
            question_name: questionArray[currentQuesNo].question_name,
            option_1: questionArray[currentQuesNo].option_1,
            option_2: questionArray[currentQuesNo].option_2,
            option_3: questionArray[currentQuesNo].option_3,
            option_4: questionArray[currentQuesNo].option_4,
            correct_answer: questionArray[currentQuesNo].correct_option,
        })
        setCurrentQuesNo(currentQuesNo + 1)

    }
    const complete = () => {
        axios.post(`/levelUpdate/${course}`, {
            level: result,
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then((response) => {
                console.log(response.data)
            })
        console.log(result)
        console.log(resultStat)
        setQuiz_result_display("flex")
    }

    useEffect(() => {
        axios.get(`/totalquestion/${course}`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(function (response) {
                setEasyQuesNo(random(response.data.begCount))
                setInterQuesNo(random(response.data.interCount))
                setHardQuesNo(random(response.data.hardCount))
            });
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        const values = [
            { quesType: easyQuesNo },
            { quesType: interQuesNo },
            { quesType: hardQuesNo },
        ]
        if (!values[0].quesType[2]) return
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < 5; j++) {
                axios.get(`/getQuestion/${course}/${i}/${values[i].quesType[j]}`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
                    .then(function (response) {
                        setQuestionArray(questionArray => [...questionArray, response.data])
                    });
            }
        }
        // eslint-disable-next-line
    }, [easyQuesNo])

    useEffect(() => {
        try {
            setQuestionAnswer({
                question_no: currentQuesNo,
                question_name: questionArray[0].question_name,
                option_1: questionArray[0].option_1,
                option_2: questionArray[0].option_2,
                option_3: questionArray[0].option_3,
                option_4: questionArray[0].option_4,
                correct_answer: questionArray[0].correct_option,
            })
        } catch (e) { }
        // eslint-disable-next-line
    }, [questionArray])





    const quiz_result = {
        position: "fixed",
        top: "40%",
        left: "30%",
        backgroundColor: "antiquewhite",
        width: "400px",
        /* height: 300px; */
        padding: "30px",
        borderRadius: "25px",
        border: "1px solid black",
        display: quiz_result_display,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }

    return (
        <div className='quiz_main'>
            <div className='quiz_content' >
                <div className='quiz_quizArea'>
                    <div className='quiz_question'>
                        <span className="quiz_questionNumber" style={{
                            border: "1px solid black",
                            padding: "0 5px",
                            marginRight: "5px"
                        }}>Q{questionAnswer.question_no} Out of 15</span>
                        {questionAnswer.question_name}

                    </div>
                    <div className='quiz_options'>
                        <label htmlFor="option_1">
                            <input type="radio" id="option_1" name="answerOptions" value={questionAnswer.option_1} />{questionAnswer.option_1}</label>
                        <label htmlFor="option_2">
                            <input type="radio" id="option_2" name="answerOptions" value={questionAnswer.option_2} />{questionAnswer.option_2}</label>
                        <label htmlFor="option_3">
                            <input type="radio" id="option_3" name="answerOptions" value={questionAnswer.option_3} />{questionAnswer.option_3}</label>
                        <label htmlFor="option_4">
                            <input type="radio" id="option_4" name="answerOptions" value={questionAnswer.option_4} />{questionAnswer.option_4}</label>

                    </div>
                    <div className='quiz_submitBtn'>
                        <Button name={"End Test"} link={complete} font={"25"} padding={"50"} />
                        <Button name={"Next Question"} font={"30"} link={nextQuestion} padding={"60"} />
                    </div>
                </div>
                <div className='quiz_bottomImage'>
                    <img src={quiztime} style={{ width: "100%" }} alt="" />
                </div>
                <div style={quiz_result}>
                    <span style={{ fontSize: "25px" }}>Your Result:{result} out of 15 </span>
                    <Button name={"OK"} font={"20"} link={`/videopage/${course}/2`} padding={"60"} />
                </div>
            </div>
        </div>
    )
}

function random(count) {
    let ques = []
    for (let i = 0; i < 5; i++) {
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

export default Quiz