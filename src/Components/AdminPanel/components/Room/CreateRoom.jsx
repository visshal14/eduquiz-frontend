import React, { useState, useEffect } from 'react'
import axios from '../../../../axios'
const CreateRoom = ({ teacher }) => {
    const [name, setName] = useState("")
    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")
    const [studentEmails, setStudentEmails] = useState("")
    const [password, setPassword] = useState("")
    const submit = (e) => {
        if (name === "" || teacherId === "") return
        axios.post(`/createRoom`, {
            name, teacherId, studentEmails, password

        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            // console.log(response.data)

            setName("")
            setStudentEmails("")
            setPassword("")
            alert("success")

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
                if (response.data.errMsg) return alert("Error")
                setTeachers(response.data)
                setTeacherId(response.data[0].id)
            })
        }


    }, [teacher])
    return (
        <div className='form-main'>
            <div>
                <div className='top-div'>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />

                    </div>
                    <div>
                        <label htmlFor="">Password (if dont want to add leave it blank) </label>
                        <input type="password" id="password" name="" value={password} onChange={(e) => setPassword(e.target.value)} />

                    </div>
                    <div>
                        <label htmlFor="">Enter Student Mail</label>
                        <input type="text" id="student" name="" placeholder="separated by comma (,)" value={studentEmails} onChange={(e) => setStudentEmails(e.target.value)} />
                    </div>
                    {!teacher &&
                        <div>
                            <label htmlFor="">Select Teacher:</label>
                            <select name="teacher" id="teacher" onChange={(e) => setTeacherId(e.target.value)}>
                                {
                                    teachers?.map((ele, i) =>
                                        <option key={i} value={ele.id}>{ele.name}</option>
                                    )
                                }

                            </select>
                        </div>}<br />






                </div>
                <button onClick={submit} className='submitBtn'>submit</button>
            </div>
        </div>
    )
}


//email
//password
//teacher

export default CreateRoom