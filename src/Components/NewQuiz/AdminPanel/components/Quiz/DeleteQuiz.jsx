import React, { useEffect, useState } from 'react'
import axios from "../../../../../axios"
const DeleteQuiz = ({ teacher }) => {

    const [quizes, setQuizes] = useState([])
    useEffect(() => {
        axios.get(`/getAllQuiz/${teacher ? teacher : "all"}`).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setQuizes(response.data)
        })
    }, [teacher])

    const deleteQuiz = (id) => {
        // console.log(id)
        axios.post(`/deleteQuiz`, {
            id
        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setQuizes(response.data)
            // console.log(response.data)
        })
            .catch(function (error) {
                console.log(error);
            });


    }
    return (
        <div>
            {quizes?.map((ele, i) =>
                <div key={i}>{i + 1}. {ele.name} {ele.owner.name}
                    <button onClick={() => deleteQuiz(ele.quizId)}>Delete</button>
                </div>
            )}


        </div>
    )
}

export default DeleteQuiz