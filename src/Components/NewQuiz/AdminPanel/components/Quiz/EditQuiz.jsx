import React, { useEffect, useState } from 'react'
import axios from "../../../../../axios"
import "./EditQuiz.css"
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Close } from '@mui/icons-material';

const EditQuiz = ({ teacher }) => {

    const [name, setName] = useState("")
    const [quizes, setQuizes] = useState([])
    const [isEditTrue, setIsEditTrue] = useState(false)
    const [question, setQuestion] = useState([])
    const [studentEmails, setStudentEmails] = useState(" ")
    const [releaseResult, setReleaseResult] = useState(Boolean)
    const [toAttempt, setToAttempt] = useState("")

    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")
    const [result, setResult] = useState([])


    // useEffect(() => {
    //     console.log(releaseResult)
    // }, [releaseResult])

    function getAllQuiz() {

        axios.get(`/getAllQuiz/${teacher ? teacher : "all"}`).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setQuizes(response.data)
            // console.log(response.data)
        })
    }

    useEffect(() => {
        getAllQuiz()
        if (teacher) {
            setTeacherId(teacher)
        } else {
            axios.get("/getAllTeacher").then((response) => {
                // console.log(response.data)
                if (response.data.errMsg) {
                    return alert("error, try again")
                }
                setTeachers(response.data)
            })
        }



        // eslint-disable-next-line
    }, [teacher])

    const [editQuiz, setEditQuiz] = useState("")

    const editClick = (id) => {
        quizes.forEach((ele) =>
            ele.quizId === id ? setEditQuiz(ele) : ""
        )
        setIsEditTrue(true)
    }
    useEffect(() => {
        // console.log(editQuiz)
        setResult(editQuiz?.result)
        setName(editQuiz.name)
        setQuestion(editQuiz.question)
        setStudentEmails(editQuiz.users || " ")
        // console.log(editQuiz)
        setReleaseResult(editQuiz.can_release_result || false)
        setToAttempt(editQuiz.no_of_question_to_attempt)
        setTeacherId(editQuiz.owner?.id)
    }, [editQuiz])


    const submit = () => {
        // setEditQuiz((prev) => prev.question = question)
        axios.post(`/editQuiz`, {
            teacherId,
            quizId: editQuiz.quizId,
            name: editQuiz.name,
            question,
            studentEmails,
            releaseResult,
            toAttempt,
            result
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            // console.log(response.data)
            alert(response.data.msg)
            getAllQuiz()
            setIsEditTrue(false)
            setEditQuiz("")
        })
            .catch(function (error) {
                console.log(error);
            });

    }

    const NoQuestionAdd = () => {

        setQuestion(prev => [...prev, {
            serialNo: prev.length + 1,
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            answer: ""
        }])

    }
    const NoQuestionSub = () => {

        // console.log(questions)
        setQuestion(question.slice(0, -1))
    }

    const deleteQuiz = (id) => {
        // console.log(id)
        axios.post(`/deleteQuiz`, {
            id
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setQuizes(response.data)
            alert("deleted")
            // console.log(response.data)
        })
            .catch(function (error) {
                console.log(error);
            });


    }


    const closeBtn = () => {
        setIsEditTrue(false)
    }

    const toAttemptChanged = (e) => {
        // console.log(question.length)
        if (e.target.value > question.length) {
            // console.log("df")
            setToAttempt(question.length)
        } else {
            setToAttempt(e.target.value)
        }
    }


    const deleteResult = (e) => {


        setResult((prev) => prev.filter((ele) => ele.id !== e.id))

    }



    return (
        <div className='editQuiz-main'>
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

                    {quizes && quizes?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.quizId}</td>
                            <td>{ele.name}</td>
                            <td>{ele.owner.name}</td>

                            {/* <td>{ele.questions}</td> */}
                            <td>{String(ele.can_release_result)}</td>
                            <td>{ele.question.length}</td>
                            {/* <td>{ele.date}</td> */}
                            <td><button onClick={() => editClick(ele.quizId)}><EditIcon /></button></td>
                            <td><button onClick={() => deleteQuiz(ele.quizId)}><DeleteOutlineIcon /></button></td>
                        </tr>

                    )}

                </tbody>
            </table>


            {isEditTrue && <div className='edit-quiz-overlay'>
                <div><Close onClick={closeBtn} className='close-btn' /></div>

                <div className='top-div'>

                    <div>
                        <label htmlFor="name">Quiz Name</label><br />
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="">Enter Student Mail(separated by comma , )</label>
                        <input type="text" id="" name="" value={studentEmails} onChange={(e) => setStudentEmails(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="">How Many Questions To Attempts</label>
                        <input type="text" id="" name="" value={toAttempt} onChange={toAttemptChanged} />
                    </div>


                    {!teacher && <div>
                        <label htmlFor="">Select Teacher:</label>
                        <select name="teacher" id="teacher" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} >
                            {
                                teachers?.map((ele, i) =>
                                    <option key={i} value={ele.id}>{ele.name}</option>
                                )
                            }
                            {/* <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option> */}
                        </select>
                    </div>}

                    <div className='declaredResult'>
                        <input type="checkbox" id="declaredResult" name="" checked={releaseResult}
                            onChange={(e) => setReleaseResult(!releaseResult)}
                        />
                        <label htmlFor="declaredResult">declared result </label>
                    </div>


                    <div className='remove-add-button-div'>
                        <label htmlFor="">No of Question</label>
                        <div>
                            <input type="text" id="" name="" disabled value={question?.length} min={1} readOnly={true} />
                            <button onClick={NoQuestionAdd}><AddIcon className='questionIcon' /></button>
                            <button onClick={NoQuestionSub}><RemoveIcon className='questionIcon' /></button>
                        </div>
                    </div>
                </div>

                <div className='see-all-students'><span>Result</span>

                    <table>
                        <thead>
                            <tr>
                                <th>Student id</th>
                                <th>Student name</th>
                                <th>Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result?.map((ele, i) =>
                                <tr key={i}>
                                    <td>{ele.student}</td>
                                    <td>{ele.name}</td>
                                    <td>{ele.result} / {editQuiz?.no_of_question_to_attempt} </td>
                                    <td><button onClick={() => deleteResult(ele)}><DeleteOutlineIcon /></button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                <div className='create-quiz-bottom-div'>

                    {question?.map((ele, i) =>

                        <div key={i} className='create-quiz-question-div'>
                            <div>

                                <label >{ele.serialNo}.</label>
                                {/* <label htmlFor="question">Question </label> */}
                                <input type="text" id="name" className="question-input" name="name" value={ele.question} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, question: e.target.value } : ele))} />
                            </div>
                            <div>

                                <label htmlFor="option1">option 1 </label>
                                <input type="text" id="option1" name="option1" value={ele.option1} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option1: e.target.value } : ele))} />
                            </div>
                            <div>

                                <label htmlFor="option2">option 2 </label>
                                <input type="text" id="option2" name="option2" value={ele.option2} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option2: e.target.value } : ele))} />
                            </div>
                            <div>

                                <label htmlFor="option3">option 3 </label>
                                <input type="text" id="option3" name="option3" value={ele.option3} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option3: e.target.value } : ele))} />
                            </div>
                            <div>

                                <label htmlFor="option4">option 4 </label>
                                <input type="text" id="option4" name="option4" value={ele.option4} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option4: e.target.value } : ele))} />
                            </div>
                            <div>

                                <label htmlFor="answer">answer </label>
                                <input type="text" id="answer" name="answer" value={ele.answer} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, answer: e.target.value } : ele))} />
                            </div>
                        </div>

                    )}
                </div>

                <button onClick={submit} className='submitBtn'> Save</button>



            </div>}

        </div >
    )
}

export default EditQuiz