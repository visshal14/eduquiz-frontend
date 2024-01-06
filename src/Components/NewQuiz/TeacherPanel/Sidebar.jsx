import React, { useEffect } from 'react'
import "../AdminPanel/Sidebar/Sidebar.css"
import { useNavigate, useParams } from 'react-router-dom'

const Sidebar = ({ sidebarFunc }) => {

    const navigate = useNavigate()
    const { teacherId, id } = useParams()
    let routes = {
        1: "CreateQuiz",
        2: "EditQuiz",
        3: "SeeAllQuiz",


        4: "CreateRoom",
        5: "EditRoom",
        6: "SeeAllRoom"

    }
    let routes2 = {
        "CreateQuiz": 1,
        "EditQuiz": 2,
        "SeeAllQuiz": 3,

        "CreateRoom": 4,
        "EditRoom": 5,
        "SeeAllRoom": 6

    }
    function checkSidebarColor(r) {

        for (let i = 0; i < document.getElementsByClassName("sidebarBtn").length; i++) {
            if (i === (r - 1)) {
                document.getElementsByClassName("sidebarBtn")[i].style.backgroundColor = "rgb(255, 255, 255)"
                document.getElementsByClassName("sidebarBtn")[i].style.color = " rgb(23, 44, 44)"

            } else {
                document.getElementsByClassName("sidebarBtn")[i].style.backgroundColor = " #308C99"
                document.getElementsByClassName("sidebarBtn")[i].style.color = " rgb(255, 255, 255)"
            }
        }
    }

    const routeChange = (r) => {
        sidebarFunc()
        checkSidebarColor(r)
        navigate(`/teacher/${teacherId}/${routes[r]}`)
    }
    useEffect(() => {

        checkSidebarColor(routes2[id])
        // eslint-disable-next-line
    }, [])

    return (
        <div className='sidebar-main'>
            <button className="sidebarBtn" onClick={() => routeChange(1)}>Create Quiz</button>
            <button className="sidebarBtn" onClick={() => routeChange(2)}>Edit Quiz</button>
            <button className="sidebarBtn" onClick={() => routeChange(3)}>See All Quiz</button>


            <button className="sidebarBtn" onClick={() => routeChange(4)}>Create Room</button>
            <button className="sidebarBtn" onClick={() => routeChange(5)}>Edit Room</button>
            <button className="sidebarBtn" onClick={() => routeChange(6)}>See All Room</button>

        </div>
    )
}

export default Sidebar