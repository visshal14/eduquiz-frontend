import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import RightMain from './RightMain'
import axios from "../../axios"
import { useParams } from 'react-router-dom'
const TeacherPanel = ({ isSidebar, sidebarFunc }) => {
    const { teacherId } = useParams()

    useEffect(() => {
        if (teacherId) {
            axios.get("/isTeacher", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
                // console.log(response.data)
                if (response.data.errMsg) {
                    return window.location.href = "/teacher/login/0"
                    // return alert(response.data.errMsg)
                }

                // window.location.href = `/teacher/${response.data}/CreateQuiz`
            })
            return
        } else {
            axios.get("/isTeacher", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
                // console.log("else")
                // console.log(response.data)
                if (response.data.errMsg) {
                    return window.location.href = "/teacher/login/0"
                    // return alert(response.data.errMsg)
                }

                window.location.href = `/teacher/${response.data}/CreateQuiz`
            })
        }
    }, [teacherId])


    return (
        <div className='admin-main'>
            {/* <div className='admin-sidebar-main'>
                <Sidebar sidebarFunc={sidebarFunc} />
            </div> */}

            <div className='admin-sidebar-main'>
                <Sidebar sidebarFunc={sidebarFunc} />
            </div>
            {isSidebar && <div className='admin-sidebar-small'>
                <Sidebar sidebarFunc={sidebarFunc} />
            </div>}
            <div className='admin-right-main'>
                <RightMain />
            </div>


        </div>
    )
}

export default TeacherPanel