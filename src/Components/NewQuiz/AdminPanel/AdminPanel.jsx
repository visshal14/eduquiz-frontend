import React, { useEffect } from 'react'
import "./AdminPanel.css"
import Sidebar from './Sidebar/Sidebar'
import RightMain from './components/RightMain'
import axios from "../../../axios"
const AdminPanel = ({ isSidebar, sidebarFunc }) => {



    useEffect(() => {
        axios.get("/isAdmin", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } }).then((response) => {
            if (response.data.errMsg) {
                window.location.href = "/admin/login/0"

            }
        })
    }, [])



    return (
        <div className='admin-main'>
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

export default AdminPanel