import React from 'react'
import { useParams } from 'react-router-dom'



import {
    CreateQuiz, EditQuiz, SeeAllQuiz, DeleteQuiz, CreateTeacher, EditTeacher, SeeAllTeacher, DeleteTeacher, CreateStudent, EditStudent, SeeAllStudent, DeleteStudent, CreateRoom, EditRoom, SeeAllRoom,
} from './FileConfig'

const RightMain = () => {

    const { id } = useParams()

    let routes = {
        "CreateQuiz": <CreateQuiz />,
        "EditQuiz": <EditQuiz />,
        "SeeAllQuiz": <SeeAllQuiz />,
        "DeleteQuiz": <DeleteQuiz />,
        "CreateTeacher": <CreateTeacher />,
        "EditTeacher": <EditTeacher />,
        "SeeAllTeacher": <SeeAllTeacher />,
        "DeleteTeacher": <DeleteTeacher />,
        "CreateStudent": <CreateStudent />,
        "EditStudent": <EditStudent />,
        "SeeAllStudent": <SeeAllStudent />,
        "DeleteStudent": <DeleteStudent />,
        "CreateRoom": <CreateRoom />,
        "EditRoom": <EditRoom />,
        "SeeAllRoom": <SeeAllRoom />
    }




    return (
        <div>{routes[id]}</div>
    )
}

export default RightMain