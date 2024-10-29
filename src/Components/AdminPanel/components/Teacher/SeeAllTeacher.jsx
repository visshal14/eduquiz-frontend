import React, { useEffect, useState } from 'react'
import axios from "../../../../axios"
import { Close } from '@mui/icons-material'
const SeeAllTeacher = () => {
    const [teacher, setTeacher] = useState([])
    const [detailedTeacher, setDetailedTeacher] = useState()
    useEffect(() => {
        axios.get("/getAllTeacher").then((response) => {

            if (response.data.errMsg) return alert("Error")
            setTeacher(response.data)
        })
    }, [])


    const getDetails = (ele) => {
        setDetailedTeacher(ele)
        // console.log(ele)
    }
    const startLink = (ele) => {
        window.location.href = `/conference/${ele}/hello`
    }
    const closeBtn = () => {
        setDetailedTeacher(null)
    }

    return (
        <div className='seeQuiz-main'>
            <table>
                <thead>
                    <tr className='editQuiz-table-head'>
                        <th>Id</th>
                        <th>Name</th>

                        {/* <th>question</th> */}
                        <th>Email</th>
                        <th>Quizzes</th>
                    </tr>

                </thead>
                <tbody>

                    {teacher?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.id}</td>
                            <td>{ele.name}</td>

                            {/* <td>{ele.questions}</td> */}
                            <td>{ele.email}</td>
                            <td>{ele.quizes.length}</td>
                            <td><button onClick={() => getDetails(ele)}>Get Details</button></td>

                        </tr>

                    )}

                </tbody>
            </table>

            {detailedTeacher &&

                <div className='edit-quiz-overlay'>

                    <div><Close onClick={closeBtn} className='close-btn' /></div>
                    <div className='see-all-details'>

                        <div className='see-all-students'><span>Quizzes</span>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Quiz id</th>
                                        <th>Quiz name</th>
                                        <th>No of Question</th>
                                        <th>Question to attempt</th>
                                        <th>Students Attempted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedTeacher?.quizes.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.quizId}</td>
                                            <td>{ele.name}</td>
                                            <td>{ele.question.length}</td>
                                            <td>{ele.no_of_question_to_attempt}</td>
                                            <td>{ele.result.length}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className='see-all-students'><span>Room Meeting</span>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Meet id</th>
                                        <th>Meet name</th>
                                        <th>Password</th>
                                        <th>Time</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedTeacher?.room.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.meeting_id}</td>
                                            <td>{ele.name}</td>
                                            <td>{ele.password}</td>
                                            <td>{ele.time}</td>
                                            <td>{ele.date}</td>
                                            <td><button onClick={() => startLink(ele.meeting_id)}>Join</button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            }

        </div>
    )
}

export default SeeAllTeacher