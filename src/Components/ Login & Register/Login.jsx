import React, { useEffect } from 'react'
import Button from '../Button'
import "./Login.css"
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

function Login() {
    const navigate = useNavigate();
    const { navigateNo } = useParams()

    useEffect(() => {
        document.getElementsByName("email")[0].focus()
    }, [])
    const loginBtn = () => {
        const email = document.getElementsByName("email")[0].value
        const password = document.getElementsByName("password")[0].value
        axios.post('/react-login', {
            email: email,
            password: password,
        })
            .then(async function (response) {
                if (response.data.errMsg) {
                    return alert(response.data.errMsg)
                }
                window.localStorage.setItem("accessToken", response.data.accessToken)
                navigate((navigateNo !== "0") ? parseInt(navigateNo) : "/");

                // window.location.href = "/quizpage/c"
            })
            .catch(function (error) {
                console.log(error);
            });
    }



    return (
        <div className='login_main'>
            <div className='login_content'>
                <div className='login_header'>
                    Enter Login Details
                </div>
                <div className='login_input_div'>
                    <label htmlFor='email'>Enter Email</label>
                    <input name="email" type="text" required />
                    <label htmlFor="password">Enter Password</label>
                    <input name="password" type="password" required />

                    <Button name="Login" link={loginBtn} bgcolor="burlywood" />
                </div>
                <div className='login_new_div'>
                    <a href="/register">New User?</a> ||  <a href="/forget-password">Forget Password</a>
                </div>
            </div>
        </div>
    )
}

export default Login