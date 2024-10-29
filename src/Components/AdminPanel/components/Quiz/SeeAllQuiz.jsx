import React, { useEffect, useState } from 'react'
import axios from "../../../../axios"
import "./SeeAllQuiz.css"
import { Close } from '@mui/icons-material'
const SeeAllQuiz = ({ teacher }) => {
    const [quizes, setQuizes] = useState([])
    const [detailedQuiz, setDetailedQuiz] = useState()
    const [detailedQuestionAttempted, setDetailedQuestionAttempted] = useState(null)
    useEffect(() => {
        axios.get(`/getAllQuiz/${teacher ? teacher : "all"}`).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setQuizes(response.data)
        })
    }, [teacher])


    const getDetails = (ele) => {
        setDetailedQuiz(ele)
        // console.log(ele)
    }
    const closeBtn = () => {
        setDetailedQuiz(null)
    }
    const getQuestionAttempted = (ele) => {
        setDetailedQuestionAttempted(ele.questionAttempted)
        console.log(ele)
    }
    const closeQuestionAttempted = () => {
        setDetailedQuestionAttempted(null)
    }

    return (
        <div className='seeQuiz-main'>
            <table>
                <thead>
                    <tr className='editQuiz-table-head'>
                        <th>Quiz Id</th>
                        <th>Quiz Name</th>
                        <th>Teacher Name</th>

                        {/* <th>question</th> */}
                        <th>Result Declared</th>
                        <th>No Of Question</th>
                        {/* <th>date</th> */}
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>

                    </tr>

                </thead>
                <tbody>

                    {quizes?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.quizId}</td>
                            <td>{ele.name}</td>
                            <td>{ele.owner.name}</td>

                            {/* <td>{ele.questions}</td> */}
                            <td>{String(ele.can_release_result)}</td>
                            <td>{ele.question.length}</td>
                            {/* <td>{ele.date}</td> */}
                            <td><button onClick={() => getDetails(ele)}>Get Details</button></td>
                        </tr>

                    )}

                </tbody>
            </table>


            {detailedQuestionAttempted &&
                <div className='edit-quiz-overlay ' style={{ zIndex: 9 }}>

                    <div><Close onClick={closeQuestionAttempted} className='close-btn' /></div>
                    <div className='see-all-details'>

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
                                    {detailedQuestionAttempted?.map((ele, i) =>
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

            {detailedQuiz &&
                <div className='edit-quiz-overlay'>

                    <div><Close onClick={closeBtn} className='close-btn' /></div>
                    <div className='see-all-details'>
                        <div className='see-all-students'><span>Students</span>
                            <p> {detailedQuiz?.users}</p>
                        </div>
                        {detailedQuiz?.result.length > 0 && <div className='see-all-students'><span>Result</span>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Student id</th>
                                        <th>Student name</th>
                                        <th>Marks</th>
                                        <th>Answer Key</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedQuiz?.result?.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.student}</td>
                                            <td>{ele.name}</td>
                                            <td>{ele.result} / {detailedQuiz?.no_of_question_to_attempt} </td>
                                            <td><button onClick={() => getQuestionAttempted(ele)}>Get Details</button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>}
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

                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedQuiz?.question?.map((ele, i) =>
                                        <tr key={i}>
                                            <td>{ele.serialNo}</td>
                                            <td>{ele.question}</td>
                                            <td>{ele.option1}</td>
                                            <td>{ele.option2}</td>
                                            <td>{ele.option3}</td>
                                            <td>{ele.option4}</td>
                                            <td>{ele.answer}</td>
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

export default SeeAllQuiz