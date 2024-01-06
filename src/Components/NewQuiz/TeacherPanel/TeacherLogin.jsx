import React, { useEffect } from 'react'
// import Button from '../../Button'
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import { Person, School } from '@mui/icons-material';
function TeacherLogin() {
    const navigate = useNavigate();

    useEffect(() => {
        document.getElementsByName("email")[0].focus()
    }, [])
    const loginBtn = () => {
        const email = document.getElementsByName("email")[0].value
        const password = document.getElementsByName("password")[0].value
        axios.post('/teacherLogin', {
            email: email,
            password: password,
        })
            .then(async function (response) {
                if (response.data.errMsg) {
                    return alert(response.data.errMsg)
                }
                window.localStorage.setItem("accessToken", response.data.accessToken)
                navigate(`/teacher/${response.data.id}/CreateQuiz`)
            })
            .catch(function (error) {
                console.log(error);
            });
    }



    return (
        <div className='login_main'>
            {/* <div className='login_content'>
                <div className='login_header'>
                    Enter Student  Details
                </div>
                <div className='login_input_div'>
                    <label htmlFor='email'>Enter Email</label>
                    <input name="email" type="text" required />
                    <label htmlFor="password">Enter Password</label>
                    <input name="password" type="password" required />
                    <Button name="Login" link={loginBtn} bgcolor="burlywood" />
                </div>
                <div className='login_new_div'>

                </div>
            </div> */}

            <div>
                <h1>Log in to your account </h1>
                <h3>Welcome back</h3>
                <div className='types'>
                    <div className='type_div ' onClick={() => navigate("/student/login/0")}>
                        <Person />
                        <p>Student</p>
                    </div>
                    <div className='type_div isActive ' onClick={() => navigate("/teacher/login/0")}>
                        <School />
                        <p>Teacher</p>
                    </div>
                    <div className='type_div' onClick={() => navigate("/admin/login/0")}>
                        <Person />
                        <p>Admin</p>
                    </div>
                </div>
                <div className='input-div'>
                    <h4>Email</h4>
                    <input name="email" type="text" required />
                </div>
                <div className='input-div'>
                    <h4>Password</h4>
                    <input name="password" type="password" required />
                </div>

                <button className='login-btn' onClick={loginBtn}>
                    Login
                </button>
                {/* <div>
                    <p>Don’t have an account ? <a href="/register">Create an account</a></p>
                </div> */}
            </div>
            <div>

            </div>

        </div>
    )
}

export default TeacherLogin