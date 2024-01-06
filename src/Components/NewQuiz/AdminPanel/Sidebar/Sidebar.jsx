import React, { useEffect } from 'react'
import "./Sidebar.css"
import { useNavigate, useParams } from 'react-router-dom'

const Sidebar = ({ sidebarFunc }) => {

    const navigate = useNavigate()
    const { id } = useParams()
    let routes = {
        1: "CreateQuiz",
        2: "EditQuiz",
        3: "SeeAllQuiz",

        4: "CreateTeacher",
        5: "EditTeacher",
        6: "SeeAllTeacher",

        7: "CreateStudent",
        8: "EditStudent",
        9: "SeeAllStudent",

        10: "CreateRoom",
        11: "EditRoom",
        12: "SeeAllRoom",
        13: "Add Admin"

    }


    let routes2 = {
        "CreateQuiz": 1,
        "EditQuiz": 2,
        "SeeAllQuiz": 3,

        "CreateTeacher": 4,
        "EditTeacher": 5,
        "SeeAllTeacher": 6,

        "CreateStudent": 7,
        "EditStudent": 8,
        "SeeAllStudent": 9,

        "CreateRoom": 10,
        "EditRoom": 11,
        "SeeAllRoom": 12,
        "AddAdmin": 13

    }
    function checkSidebarColor(r) {

        for (let i = 0; i < document.getElementsByClassName("sidebarBtn").length; i++) {
            if (i === (r - 1)) {
                document.getElementsByClassName("sidebarBtn")[i].style.backgroundColor = "rgb(255, 255, 255)"
                document.getElementsByClassName("sidebarBtn")[i].style.color = " #308C99"

            } else {
                document.getElementsByClassName("sidebarBtn")[i].style.backgroundColor = " #308C99"
                document.getElementsByClassName("sidebarBtn")[i].style.color = " rgb(255, 255, 255)"
            }
        }
    }

    const routeChange = (r) => {
        sidebarFunc()
        checkSidebarColor(r)

        navigate(`/admin/${routes[r]}`)
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


            <button className="sidebarBtn" onClick={() => routeChange(4)}>Create Teacher</button>
            <button className="sidebarBtn" onClick={() => routeChange(5)}>Edit Teacher</button>
            <button className="sidebarBtn" onClick={() => routeChange(6)}>See All Teacher</button>


            <button className="sidebarBtn" onClick={() => routeChange(7)}>Create Student</button>
            <button className="sidebarBtn" onClick={() => routeChange(8)}>Edit Student</button>
            <button className="sidebarBtn" onClick={() => routeChange(9)}>See All Student</button>



            <button className="sidebarBtn" onClick={() => routeChange(10)}>Create Room</button>
            <button className="sidebarBtn" onClick={() => routeChange(11)}>Edit Room</button>
            <button className="sidebarBtn" onClick={() => routeChange(12)}>See All Room</button>



            {/* <button className="sidebarBtn" onClick={() => routeChange(13)}>Add Admin</button> */}
        </div>
    )
}

export default Sidebar