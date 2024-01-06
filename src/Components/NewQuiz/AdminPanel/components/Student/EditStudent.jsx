import React, { useEffect, useState } from 'react'
import axios from "../../../../../axios"
import { Close, Edit } from '@mui/icons-material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const EditStudent = () => {
    const [student, setStudent] = useState([])
    const getAllStudent = () => {

        axios.get("/getAllStudent").then((response) => {
            if (response.data.errMsg) return alert("Error")
            setStudent(response.data)
            // console.log(response.data)
        })
    }
    useEffect(() => {
        getAllStudent()
    }, [])

    const [isEditing, setIsEditing] = useState(false)
    const [editStudent, setEditStudent] = useState()
    const [newName, setNewName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const editClick = (id) => {
        setIsEditing(true)
        student.forEach((ele) =>
            ele.id === id ? setEditStudent(ele) : ""
        )
    }


    const submit = () => {
        axios.post(`/editStudent`, {
            id: editStudent.id,
            name: newName,
            password: newPassword
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            // console.log(response.data)
            setNewName("")
            setNewPassword("")
            alert("success")

            setIsEditing(false)
            getAllStudent()
        })
            .catch(function (error) {
                console.log(error);
            });

    }
    const deleteClick = (id) => {
        // console.log(id)
        axios.post(`/deleteStudent`, {
            id
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            getAllStudent()
            // setTeacher(response.data)
            // console.log(response.data)
        })
            .catch(function (error) {
                console.log(error);
            });


    }
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

                    {student?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.id}</td>
                            <td>{ele.name}</td>
                            <td>{ele.email}</td>


                            <td><button onClick={() => editClick(ele.id)}><Edit /></button></td>
                            <td><button onClick={() => deleteClick(ele.id)}><DeleteOutlineIcon /></button></td>
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

export default EditStudent