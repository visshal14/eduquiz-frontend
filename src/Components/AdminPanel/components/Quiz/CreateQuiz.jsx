import React, { useEffect, useState } from 'react'
import axios from "../../../../axios"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./Quiz.css"
import format from "./format.png"
import { Close } from '@mui/icons-material';

const CreateQuiz = ({ teacher }) => {

    const [name, setName] = useState("")
    const [isFormat, setIsFormat] = useState(false)
    //array for question
    const [questions, setQuestion] = useState([
        {
            serialNo: 1,
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            answer: ""
        }
    ])
    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")
    const [studentEmails, setStudentEmails] = useState("")
    const [toAttempt, setToAttempt] = useState("")
    const [noQuestion, setNoQuestion] = useState(1)

    // eslint-disable-next-line
    const [questionUpload, setQuestionUpload] = useState(null)
    const submit = (e) => {
        if (name === "" || teacherId === "" || questions[0].question === "") return


        axios.post(`/createQuiz`, {
            name, questions, teacherId, studentEmails,
            toAttempt
        }).then((response) => {
            if (response.data.errMsg) {
                return alert("error")
            }
            alert(response.data.msg)
            setName("")
            setNoQuestion(1)
            setQuestion([
                {
                    serialNo: 1,
                    question: "",
                    option1: "",
                    option2: "",
                    option3: "",
                    option4: "",
                    answer: ""
                }
            ])
            setStudentEmails("")
            setToAttempt("")
            setQuestionUpload(null)
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        if (teacher) {
            setTeacherId(teacher)
        } else {

            axios.get("/getAllTeacher").then((response) => {
                // console.log(response.data)
                if (response.data.errMsg) {
                    return alert("error, try again")
                }
                setTeachers(response.data)
                setTeacherId(response.data[0].id)
            })
        }



    }, [teacher])





    const NoQuestionAdd = () => {
        setNoQuestion(noQuestion + 1)

        setQuestion(prev => [...prev, {
            serialNo: noQuestion + 1,
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            answer: ""
        }])

    }
    const NoQuestionSub = () => {
        if (noQuestion === 1) return
        setNoQuestion(noQuestion - 1)
        // console.log(questions)
        setQuestion(questions.slice(0, -1))
    }


    //for reading csv file
    const fileReader = new FileReader();
    const fileUpload = async (e) => {
        if (e.target.files[0]) {
            setQuestionUpload(e.target.files[0])
            fileReader.onload = async function (event) {
                const csvOutput = event.target.result;
                let json = convertCsvToJson(csvOutput)
                json.sort((a, b) => {
                    return a.serialNo - b.serialNo;
                });

                if (questions.length === 1 && questions[0].question === "") {
                    setQuestion([])
                    setNoQuestion(json.length)
                    setNoQuestion(json.length)
                } else if (questions.length > 1) {

                    let tempQuestions = questions.filter((ele) => ele.question !== "")
                    console.log(tempQuestions)
                    setQuestion(tempQuestions)

                    setNoQuestion(tempQuestions.length + json.length)

                }

                // eslint-disable-next-line
                json.map((ele) => {
                    setQuestion(prev => [...prev, {
                        serialNo: prev.length + 1,
                        question: ele.question,
                        option1: ele.option1,
                        option2: ele.option2,
                        option3: ele.option3,
                        option4: ele.option4,
                        answer: ele.answer
                    }])

                })

            };
            fileReader.readAsText(e.target.files[0]);
        }
    }


    function convertCsvToJson(csv) {
        const array = csv.toString().split("\r\n")
        if (array[array.length - 1] === '') {
            array.pop()
        }
        let result = []
        for (let i = 0; i < array.length; i++) {
            let columns = array[i].split(",")
            let tempResult = {}

            if (i !== 0) {
                // eslint-disable-next-line
                array[0].split(",").map((e, j) => {
                    tempResult[e] = columns[j] || ""
                })
                result.push(tempResult)
            }
        }
        return result
    }

    const closeBtn = () => {
        setIsFormat(false)
    }



    const deleteQuestion = (n) => {

        let tempQuestion = questions.filter(ele => parseInt(ele.serialNo) !== parseInt(n))
        tempQuestion.map((ele, i) =>
            ele.serialNo = i + 1
        )
        setNoQuestion(tempQuestion.length)
        setQuestion(tempQuestion)
        // setQuestion(prev => {
        //     prev.filter(ele => ele.serialNo !== n)
        // })
    }

    return (
        <div className='form-main'>
            <div>
                <div className='top-div'>

                    <div>
                        <label htmlFor="name">Quiz Name</label><br />
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="">Enter Student Mail ID</label>
                        <input type="text" id="" name="" placeholder='seprated by commas(,)' value={studentEmails} onChange={(e) => setStudentEmails(e.target.value)} />
                    </div>
                    <div>

                        <label htmlFor="">How Many Questions To Attempts</label>
                        <input type="text" id="" name="" value={toAttempt} onChange={(e) => setToAttempt(e.target.value)} />
                    </div>
                    <div>

                        <label htmlFor="">No of Question</label>
                        <div>
                            <input type="text" id="" name="" disabled value={noQuestion} onChange={(e) => setNoQuestion(e.target.value)} min={1} />
                            <button onClick={NoQuestionAdd}><AddIcon className='questionIcon' /></button>
                            <button onClick={NoQuestionSub}><RemoveIcon className='questionIcon' /></button>
                        </div>
                    </div>





                    {!teacher && <div>
                        <label htmlFor="">Select Teacher:</label>
                        <select name="teacher" id="teacher" onChange={(e) => setTeacherId(e.target.value)} >
                            {
                                teachers?.map((ele, i) =>
                                    <option key={i} value={ele.id}>{ele.name}</option>
                                )
                            }

                        </select>
                    </div>}


                    <div className='uploadQuestion'>

                        <label htmlFor="file">Upload Question</label>
                        <button onClick={() => setIsFormat(true)} >Check Format</button>
                        <input type="file" id="file" name="" value={""} style={{ display: "none" }} onChange={fileUpload} />
                        {isFormat && <div className='edit-quiz-overlay format-div'>

                            <div className='format-close'><Close onClick={closeBtn} className='close-btn ' /></div>
                            <div > <img src={format} alt="format" /></div>
                        </div>}

                    </div>

                </div>


                <div className='create-quiz-bottom-div'>


                    {[...Array(noQuestion)]?.map((ele, i) =>

                        <div key={i} className='create-quiz-question-div'>

                            <div>
                                <label className='question-serial-label' >{questions[i]?.serialNo}.</label>
                                <input type="text" className="question-input" id="name" placeholder='Question' name="name" value={questions[i]?.question} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, question: e.target.value } : ele))} />

                                <button className='question-serial-label' style={{ margin: "0 0 0 10px" }} onClick={() => deleteQuestion(questions[i]?.serialNo)}><Close /></button>
                            </div>
                            <div>
                                <label className='question-serial-label' style={{ visibility: "hidden" }}>{questions[i]?.serialNo}.</label>
                                <input type="text" id="option1" name="option1" placeholder='Option 1' value={questions[i]?.option1} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option1: e.target.value } : ele))} />
                            </div>

                            <div>
                                <label className='question-serial-label' style={{ visibility: "hidden" }}>{questions[i]?.serialNo}.</label>

                                <input type="text" id="option2" name="option2" placeholder='Option 2' value={questions[i]?.option2} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option2: e.target.value } : ele))} />
                            </div>
                            <div>
                                <label className='question-serial-label' style={{ visibility: "hidden" }}>{questions[i] && questions[i]?.serialNo}.</label>

                                <input type="text" id="option3" name="option3" placeholder='Option 3' value={questions[i]?.option3} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option3: e.target.value } : ele))} />
                            </div>
                            <div>
                                <label className='question-serial-label' style={{ visibility: "hidden" }}>{questions[i]?.serialNo}.</label>

                                <input type="text" id="option4" name="option4" placeholder='Option 4' value={questions[i]?.option4} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, option4: e.target.value } : ele))} />
                            </div>
                            <div>
                                <label className='question-serial-label' style={{ visibility: "hidden" }}>{questions[i]?.serialNo}.</label>

                                <input type="text" id="answer" name="answer" placeholder='Answer' value={questions[i]?.answer} onChange={(e) => setQuestion((prev) =>
                                    prev.map((ele, j) => i === j ? { ...ele, answer: e.target.value } : ele))} />
                            </div>
                        </div>
                    )}


                    <button onClick={submit} className='submitBtn'>submit</button>
                </div>
            </div>


        </div>
    )
}

export default CreateQuiz