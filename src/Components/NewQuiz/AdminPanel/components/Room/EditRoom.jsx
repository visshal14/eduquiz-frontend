import React, { useEffect, useState } from 'react'
import axios from "../../../../../axios"
import { Close, Edit } from '@mui/icons-material'
const EditRoom = ({ teacher }) => {
    const [room, setRoom] = useState()
    const [isEditTrue, setIsEditTrue] = useState(false)
    const [editRoom, setEditRoom] = useState()
    const [newName, setNewName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [studentEmails, setStudentEmails] = useState(" ")
    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")



    useEffect(() => {

        if (teacher) {
            setTeacherId(teacher)
        } else {
            axios.get("/getAllTeacher").then((response) => {

                if (response.data.errMsg) {
                    return alert("error, try again")
                }
                setTeachers(response.data)
            })
        }
        axios.get(`/getAllRoom/${teacher ? teacher : "all"}`).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setRoom(response.data)

        })

    }, [teacher])

    const editClick = (id) => {
        room.forEach((ele) =>
            ele.meeting_id === id ? setEditRoom(ele) : ""
        )
        setIsEditTrue(true)
    }


    useEffect(() => {

        setNewName(editRoom?.name || "")
        setNewPassword(editRoom?.password || "")
        setTeacherId(editRoom?.admin_details?.id)
        let tempStudent = []
        editRoom?.names_of_participants.map((ele, i) =>
            tempStudent.push(ele.email)
        )

        setStudentEmails(tempStudent.toString())
        // eslint-disable-next-line
    }, [editRoom])
    const submit = () => {
        axios.post(`/editRoom`, {
            meetId: editRoom.meeting_id,
            password: newPassword,
            name: newName,
            teacherId,
            studentEmails
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setNewName("")
            setNewPassword("")
            alert("success")
            setIsEditTrue(false)
        })
            .catch(function (error) {
                console.log(error);
            });

    }
    const closeBtn = () => {
        setIsEditTrue(false)
    }

    return (
        <div className='editQuiz-main'>

            <table>
                <thead>
                    <tr className='editQuiz-table-head'>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Teacher</th>

                        <th>Password</th>



                    </tr>

                </thead>
                <tbody>

                    {room?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.meeting_id}</td>
                            <td>{ele.name || "-"}</td>
                            <td>{ele.admin_details?.name || "-"}</td>



                            {/* <td>{ele.students}</td> */}
                            <td>{ele.password || "-"}</td>
                            <td><button onClick={() => editClick(ele.meeting_id)}><Edit /></button></td>
                        </tr>

                    )}

                </tbody>
            </table>

            {isEditTrue && <div className='edit-quiz-overlay'>
                <div><Close onClick={closeBtn} className='close-btn' /></div>

                <div className='top-div'>

                    <div>
                        <label htmlFor="">name</label>
                        <input type="text" id="" name="" value={newName} onChange={(e) => setNewName(e.target.value)} />

                    </div>
                    <div>
                        <label htmlFor="">password</label>
                        <input type="text" id="" name="" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="">Enter Student Mail(separated by comma , )</label>
                        <input type="text" id="" name="" value={studentEmails} onChange={(e) => setStudentEmails(e.target.value)} />
                    </div>

                    {!teacher && <div>
                        <label htmlFor="">Select Teacher:</label>
                        <select name="teacher" id="teacher" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} >
                            {
                                teachers?.map((ele, i) =>
                                    <option key={i} value={ele.id}>{ele.name}</option>
                                )
                            }

                        </select>
                    </div>}



                </div>


                <button onClick={submit} className='submitBtn'> Save</button>



            </div>
            }



        </div>

    )
}

export default EditRoom