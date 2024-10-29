import React, { useEffect, useState } from 'react'
import axios from "../../../../axios"
const DeleteTeacher = () => {
    const [teacher, setTeacher] = useState([])
    const getTeacher = () => {


        axios.get("/getAllTeacher").then((response) => {
            if (response.data.errMsg) return alert("Error")
            console.log(response.data)
            setTeacher(response.data)
        })
    }
    useEffect(() => {
        getTeacher()
    }, [])

    const deleteQuiz = (id) => {
        // console.log(id)
        axios.post(`/deleteTeacher`, {
            id
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            getTeacher()

        })
            .catch(function (error) {
                console.log(error);
            });


    }
    return (
        <div>
            {teacher?.map((ele, i) =>
                <div key={i}>{i + 1}. {ele.id} {ele.name}
                    <button onClick={() => deleteQuiz(ele.id)}>Delete</button>
                </div>
            )}


        </div>
    )

}

export default DeleteTeacher