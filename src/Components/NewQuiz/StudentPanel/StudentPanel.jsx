import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "../../../axios"
import "./Student.css"
import frontendUrl from '../../../frontendUrl'
import { Close } from '@mui/icons-material'
const StudentPanel = () => {
    const { id } = useParams()
    const [details, setDetails] = useState()
    // const [questionAttempted, setQuestionAttempted] = useState([])
    const [detailedQuiz, setDetailedQuiz] = useState(null)

    useEffect(() => {
        if (id) {

            axios.get(`/getStudent/${id}`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
                // console.log(response.data)
                if (response.data.errMsg) return window.location.href = "/student/login/0"
                setDetails(response.data)

            })
        } else {
            axios.get("/isStudent", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
                // console.log(response.data)
                if (response.data.errMsg) {
                    return window.location.href = "/student/login/0"
                }

                window.location.href = `/student/${response.data}`
            })
        }

    }, [id])
    const getDetails = (ele) => {
        // setDetailedQuiz(ele)
        console.log(ele)
        setDetailedQuiz(ele.result?.[0]?.questionAttempted)

    }
    // useEffect(() => {
    //     console.log(detailedQuiz)
    // }, [detailedQuiz])
    const closeBtn = () => {
        setDetailedQuiz(null)
    }

    return (
        <div className='student-main'>
            <div className='student-div'>
                <div>
                    <p>Name</p>
                    <div> {details?.name}</div>
                </div>
                <div>
                    <p>Email</p>
                    <div> {details?.email}</div>
                </div>
            </div>


            <div className='see-all-students see-all-question '>


                <span>Quizzes</span>
                <table>
                    <thead>
                        <tr >
                            <th>Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Teacher Name</th>
                            <th>No Of Question</th>
                            <th>Result</th>
                            {/* <th>Answer</th> */}

                        </tr>
                    </thead>
                    <tbody>
                        {details?.quizes?.map((ele, i) =>
                            <tr key={i}>
                                <td>{ele.name}</td>
                                <td>{ele.date}</td>
                                <td>{ele.time}</td>
                                <td>{ele.owner.name}</td>
                                <td>{ele.no_of_question_to_attempt}</td>
                                <td>{ele.result?.[0].result}</td>
                                <td>
                                    {!ele.can_release_result
                                        ? <button onClick={() => window.location = `/takingQuiz/${ele.quizId}`}>Start</button>
                                        :
                                        ele.result?.[0]?.questionAttempted ? <button onClick={() => getDetails(ele)}>Answer Key</button> :
                                            ""}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {detailedQuiz &&
                <div className='edit-quiz-overlay'>

                    <div><Close onClick={closeBtn} className='close-btn' /></div>
                    <div className='see-all-details'>
                        {/* <div className='see-all-students'><span>Students</span>
                            <p> {detailedQuiz?.users}</p>
                        </div>
                        {detailedQuiz?.result.length > 0 && <div className='see-all-students'><span>Result</span>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Student id</th>
                                        <th>Student name</th>
                                        <th>Marks</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedQuiz?.result?.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.student}</td>
                                            <td>{ele.name}</td>
                                            <td>{ele.result} / {detailedQuiz?.no_of_question_to_attempt} </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>} */}
                        <div className='see-all-students see-all-question '>


                            <span>Question</span>
                            <table>
                                <thead>
                                    <tr >
                                        <th>Serial No</th>
                                        <th>Question</th>
                                        <th>Option 1</th>
                                        <th>Option 2</th>
                                        <th>Option 3</th>
                                        <th>Option 4</th>
                                        <th>Answer</th>
                                        <th>Chosen Answer</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedQuiz?.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.questionNo}</td>
                                            <td>{ele.question}</td>
                                            <td>{ele.option1}</td>
                                            <td>{ele.option2}</td>
                                            <td>{ele.option3}</td>
                                            <td>{ele.option4}</td>
                                            <td>{ele.answer}</td>
                                            <td>{ele.chosen}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }


            <div className='see-all-students see-all-question student-room'>
                <span>Meeting Room</span>
                <table>
                    <thead>
                        <tr >
                            <th>Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Id</th>
                            <th>Teacher Name</th>
                            <th>Password</th>
                            {/* <th>Option 4</th> */}
                            {/* <th><a href={`https://boisterous-piroshki-f8242f.netlify.app/conference/${ele.meeting_id}/hello`} rel="noreferrer" target="_blank">Start Link</a></th> */}

                        </tr>
                    </thead>
                    <tbody>
                        {details?.room?.map((ele, i) =>
                            <tr key={i}>
                                <td>{ele.name}</td>
                                <td>{ele.date}</td>
                                <td>{ele.time}</td>
                                <td>{ele.meeting_id}</td>
                                <td>{ele.admin_details?.name}</td>
                                <td>{ele.password}</td>
                                <td> <a href={`${frontendUrl}/conference/${ele.meeting_id}/hello`} rel="noreferrer" target="_blank">Join</a></td>
                                {/* <td>{ele.answer}</td> */}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* <div>
                <h3>List of Meeting</h3><br />
                {details?.room?.map((ele, i) =>
                    <div key={i}>
                        <h1>Name: {ele.name}</h1>
                        <h3>Date: {ele.date}</h3>
                        <h3>Time:{ele.time}</h3>
                        <h3>id:{ele.meeting_id}</h3>
                        <h3>password:{ele.password}</h3>
                       
                        <h3>Teacher Name:{ele.owner?.name}</h3> 

                        {!ele.result && <button onClick={() => window.location = `/takingQuiz/${ele.quizId}`}>Start</button>} 

                    </div>
                )}

            </div> */}


        </div>
    )
}

export default StudentPanel