import React from 'react'
import "./Navbar.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {


    return (

        <div className='nav_main_div'>
            <div className='nav_logo'>
                <a href="/">Eduquiz</a>
            </div>
            <div className='nav_list_main'>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/courseSelection">Courses</a></li>
                    <li><a href="/room-selection/id/p">Room</a></li>
                    <li><a href="/">Contact Us</a></li>
                    <li><a href="/login/0"><AccountCircleIcon /></a></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar