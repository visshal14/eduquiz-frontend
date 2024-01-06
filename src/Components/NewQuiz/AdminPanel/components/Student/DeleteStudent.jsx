import React, { useEffect, useState } from 'react'
import axios from "../../../../../axios"
const DeleteStudent = () => {
    const [student, setStudent] = useState([])
    const getStudent = () => {


        axios.get("/getAllStudent").then((response) => {
            if (response.data.errMsg) return alert("Error")
            setStudent(response.data)
        })
    }
    useEffect(() => {
        getStudent()
    }, [])

    const deleteQuiz = (id) => {

        axios.post(`/deleteStudent`, {
            id
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            getStudent()

        })
            .catch(function (error) {
                console.log(error);
            });


    }




    return (
        <div>
            {student?.map((ele, i) =>
                <div key={i}>{i + 1}. {ele.id} {ele.name}
                    <button onClick={() => deleteQuiz(ele.id)}>Delete</button>
                </div>
            )}


        </div>
    )

}

export default DeleteStudent