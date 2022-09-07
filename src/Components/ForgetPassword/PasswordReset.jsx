import React from 'react'
import "./ForgetPassword.css"
import Button from '../Button'
import { useParams } from 'react-router-dom'
import axios from '../../axios';

function PasswordReset() {
    const { id } = useParams()
    const submit = () => {
        axios.post(`/passwordRes`, {
            id: id,
            password: document.getElementsByName("password")[0].value
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then((response) => {
                if (response.data === "success") {
                    alert(response.data)

                    window.location.href = "/login/-4"
                }
            })
    }


    return (
        <div className="forget_main">
            <div className="forget_content">
                <p>Change Your Password<br />
                </p>
                <input type="password" id="password" name="password" />
                <Button name="Submit" link={submit} bgcolor="burlywood" />


            </div>
        </div>
    )
}

export default PasswordReset