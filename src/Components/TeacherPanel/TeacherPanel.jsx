import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import RightMain from './RightMain'
import PanelLayout from '../Layout/PanelLayout'
import axios from "../../axios"
import { useParams } from 'react-router-dom'

const TeacherPanel = () => {
    const { teacherId } = useParams()

    useEffect(() => {
        axios.get("/isTeacher", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
            if (response.data.errMsg) {
                return window.location.href = "/teacher/login/0"
            }

            // Landing on /teacher with no id: bounce to this teacher's first screen.
            if (!teacherId) {
                window.location.href = `/teacher/${response.data}/CreateQuiz`
            }
        })
    }, [teacherId])

    return (
        <PanelLayout sidebar={<Sidebar />}>
            <RightMain />
        </PanelLayout>
    )
}

export default TeacherPanel
