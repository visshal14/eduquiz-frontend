import React from 'react'
import "./Navbar.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {


    return (

        <div className='nav_main_div'>
            <div className='nav_logo'>
                <a className="nav_content_col" href="/">Eduquiz</a>
            </div>
            <div className='nav_list_main'>
                <ul>
                    <li><a className="nav_content_col" href="/">Home</a></li>
                    <li><a className="nav_content_col" href="/courseSelection">Courses</a></li>
                    <li><a className="nav_content_col" href="/room-selection/id/p">Room</a></li>
                    <li><a className="nav_content_col" href="/">Contact Us</a></li>
                    <li><a className="nav_content_col" href="/login/0"><AccountCircleIcon /></a></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar