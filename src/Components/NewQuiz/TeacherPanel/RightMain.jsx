import React from 'react'
import { useParams } from 'react-router-dom'

import CreateQuiz from '../AdminPanel/components/Quiz/CreateQuiz'
import EditQuiz from '../AdminPanel/components/Quiz/EditQuiz'
import SeeAllQuiz from '../AdminPanel/components/Quiz/SeeAllQuiz'
import DeleteQuiz from "../AdminPanel/components/Quiz/DeleteQuiz"
import CreateRoom from '../AdminPanel/components/Room/CreateRoom'
import EditRoom from '../AdminPanel/components/Room/EditRoom'
import SeeAllRoom from '../AdminPanel/components/Room/SeeAllRoom'
const RightMain = () => {

    const { id, teacherId } = useParams()
    let routes = {
        "CreateQuiz": <CreateQuiz teacher={teacherId} />,
        "EditQuiz": <EditQuiz teacher={teacherId} />,
        "SeeAllQuiz": <SeeAllQuiz teacher={teacherId} />,
        "DeleteQuiz": <DeleteQuiz teacher={teacherId} />,
        "CreateRoom": <CreateRoom teacher={teacherId} />,
        "EditRoom": <EditRoom teacher={teacherId} />,
        "SeeAllRoom": <SeeAllRoom teacher={teacherId} />
    }




    return (
        <div>{routes[id]}</div>
    )
}

export default RightMain