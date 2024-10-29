import React, { useEffect, useState } from 'react'
import axios from "../../../../axios"
import { Close } from '@mui/icons-material'
const SeeAllStudent = () => {
    const [student, setStudent] = useState([])
    const [detailedStudent, setDetailedStudent] = useState()

    useEffect(() => {
        axios.get("/getAllStudent").then((response) => {
            // console.log(response.data)
            if (response.data.errMsg) return alert("Error")
            setStudent(response.data)
            // console.log(response.data)
        })
    }, [])
    const getDetails = (ele) => {

        let temp = ele
        // eslint-disable-next-line
        temp.quizes.map((e, i) => {
            if (typeof (e.result) === "object") {
                // eslint-disable-next-line
                e.result.map((r) => {
                    if (r.student === temp.id) {
                        ele.quizes[i].result = r.result
                    }
                })
            }
        }
        )
        // console.log(ele)
        setDetailedStudent(ele)
        // console.log(ele)
    }
    const closeBtn = () => {
        setDetailedStudent(null)
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



                    </tr>

                </thead>
                <tbody>

                    {student && student?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.id}</td>
                            <td>{ele.name}</td>

                            {/* <td>{ele.questions}</td> */}
                            <td>{ele.email}</td>
                            <td><button onClick={() => getDetails(ele)}>Get Details</button></td>

                        </tr>

                    )}

                </tbody>
            </table>
            {detailedStudent &&
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
                                        <th>Result</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedStudent?.quizes.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.quizId}</td>
                                            <td>{ele.name}</td>
                                            <td>{ele.no_of_question_to_attempt}</td>
                                            <td>{ele.result[0]?.student ? "" : ele.result ? ele.result : ""}</td>
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
                                    {detailedStudent?.room.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.meeting_id}</td>
                                            <td>{ele.name}</td>
                                            <td>{ele.password}</td>
                                            <td>{ele.time}</td>
                                            <td>{ele.date}</td>
                                            {/* <td><button onClick={() => startLink(ele.meeting_id)}>Join</button></td> */}
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

export default SeeAllStudent