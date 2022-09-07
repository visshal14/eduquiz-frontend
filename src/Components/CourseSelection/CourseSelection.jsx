import React from 'react'
import "./CourseSelection.css"
import { courseSelectedBack } from '../../Assets/src'
import Button from '../Button'
import { LoginChecker } from '../../LoginChecker';
function CourseSelection() {
    LoginChecker(-1)
    const courseSel_main = {
        width: "100%",
        height: '100%',
        background: `url(${courseSelectedBack})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: ' flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        padding: '0 50px'
    }
    const courseSel_nameCourse = {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '39px',
    }
    return (
        <div style={courseSel_main}>
            <div className='courseSel_chooseCourse'>
                <Button name={"Courses"} font={"40"} link={"/courseSelection"} padding={"120"} />
            </div>
            <div style={courseSel_nameCourse}>
                <Button name={"C++"} font={"30"} link={"/quizpage/C++"} padding={"100"} />
                <br />
                <Button name={"Python"} font={"30"} link={"/quizpage/python"} padding={"100"} />
            </div>
        </div>
    )
}

export default CourseSelection