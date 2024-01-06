import React, { useState } from 'react'
import "./Navbar.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Menu } from '@mui/icons-material';

function Navbar({ sidebarFunc }) {

    const [loginDis, setLoginDis] = useState(false)

    const loginIconClicked = () => {
        setLoginDis(!loginDis)
    }

    const logout = () => {
        window.localStorage.removeItem("accessToken");
        window.location.href = "/"
    }
    return (

        <div className='nav_main_div'>

            <div className='menu-sidebar'>
                <Menu onClick={sidebarFunc} />
            </div>
            <div className='nav_logo'>
                <a className="nav_content_col" href="/">Quiz</a>
            </div>
            <div className='nav_list_main'>
                <ul>
                    <li><a className="nav_content_col" href="/">Home</a></li>
                    <li className='login-icon'>
                        <button className="nav_content_col" onClick={loginIconClicked}
                        ><AccountCircleIcon /></button>
                        <div style={{ display: loginDis ? "block" : "none" }}>
                            <a className="nav_content_col" href="/student">Go To Student Panel</a><br />
                            <a className="nav_content_col" href="/admin/CreateQuiz">Go To Admin Panel</a><br />
                            <a className="nav_content_col" href="/teacher">Go To Teacher Panel</a>
                            <button className="nav_content_col" onClick={logout}>Logout</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar