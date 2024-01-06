import React, { useEffect, useState } from 'react'
import axios from "../../../../../axios"
import { Close, Edit } from '@mui/icons-material'

const EditTeacher = () => {

    const [teacher, setTeacher] = useState([])
    const getAllTeacher = () => {

        axios.get("/getAllTeacher").then((response) => {
            if (response.data.errMsg) return alert("Error")
            setTeacher(response.data)
        })
    }
    useEffect(() => {
        getAllTeacher()
    }, [])

    const [isEditing, setIsEditing] = useState(false)
    const [editTeacher, setEditTeacher] = useState()
    const [newName, setNewName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const editClick = (id) => {

        setIsEditing(true)
        teacher.forEach((ele) =>
            ele.id === id ? setEditTeacher(ele) : ""
        )
    }

    const submit = () => {
        axios.post(`/editTeacher`, {
            id: editTeacher.id,
            name: newName,
            password: newPassword
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            // console.log(response.data)
            setNewName("")
            setNewPassword("")
            alert("success")

            setIsEditing(false)
            getAllTeacher()
        })
            .catch(function (error) {
                console.log(error);
            });

    }
    // const deleteClick = (id) => {
    //     // console.log(id)
    //     axios.post(`/deleteTeacher`, {
    //         id
    //     }).then((response) => {
    //         if (response.data.errMsg) return alert("Error")
    //         getAllTeacher()
    //         // setTeacher(response.data)
    //         // console.log(response.data)
    //     })
    //         .catch(function (error) {
    //             console.log(error);
    //         });


    // }

    const closeBtn = () => {
        setIsEditing(false)
    }

    return (
        <div className='see-all-students editQuiz-main'>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        {/* <th>question</th> */}




                    </tr>

                </thead>
                <tbody>

                    {teacher?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.id}</td>
                            <td>{ele.name}</td>
                            <td>{ele.email}</td>


                            <td><button onClick={() => editClick(ele.id)}><Edit /></button></td>
                            {/* <td><button onClick={() => deleteClick(ele.quizId)}><DeleteOutlineIcon /></button></td> */}
                        </tr>

                    )}

                </tbody>
            </table>


            {isEditing &&
                <div className='edit-quiz-overlay'>

                    <div><Close onClick={closeBtn} className='close-btn' /></div>
                    <div className='top-div'>
                        <div>
                            <label htmlFor="name">Name </label>
                            <input type="text" id="name" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} /><br />
                        </div>
                        <div>
                            <label htmlFor="password">Password </label>
                            <input type="text" id="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>

                        <button onClick={submit} className='submitBtn'>Save</button>

                    </div>
                </div>}
        </div>
    )
}

export default EditTeacher