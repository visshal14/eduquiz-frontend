import React, { useEffect } from 'react'
import Sidebar from './Sidebar/Sidebar'
import RightMain from './components/RightMain'
import PanelLayout from '../Layout/PanelLayout'
import axios from "../../axios"

const AdminPanel = () => {

    useEffect(() => {
        axios.get("/isAdmin", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
            if (response.data.errMsg) {
                window.location.href = "/admin/login/0"

            }
        })
    }, [])

    return (
        <PanelLayout sidebar={<Sidebar />}>
            <RightMain />
        </PanelLayout>
    )
}

export default AdminPanel
