import React from 'react'
import { useParams } from 'react-router-dom'
import Button from '../Button';
import { taketest } from "../../Assets/src"

import { LoginChecker } from '../../LoginChecker';
function QuizPage() {
    LoginChecker(-1)



    let { course } = useParams();
    const quizpage_main = {
        width: "100%",
        height: '100%',
        background: `url(${taketest})`,
        backgroundPosition: 'center',

        padding: '0 50px'
    }
    const quizpage_tests = {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '39px',
    }
    const quizpage_content = {
        width: "40%",
        height: '100%',

        display: ' flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: "center"
    }

    return (
        <div style={quizpage_main}>
            <div style={quizpage_content}>
                <div className='courseSel_chooseCourse'>
                    <Button name={course} font={"40"} link={`/quizpage/${course}`} padding={"120"} />
                </div>
                <div style={quizpage_tests}>
                    <Button name={"Take Test"} font={"30"} link={`/quiz/${course}`} padding={"100"} />
                    <br />
                    <Button name={"Start from beginning"} font={"30"} link={`/videopage/${course}/0`} padding={"100"} />
                    <br />
                    <Button name={"Resume Test"} font={"30"} link={`/videopage/${course}/1`} padding={"100"} />

                </div>
            </div>

        </div>
    )
}

export default QuizPage