import React, { useState } from 'react'
import "./ForgetPassword.css"
import Button from '../Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../../axios';

function ForgetPassword() {
    const [mainDis, setMainDis] = useState("block")
    const [emailDis, setEmailDis] = useState("none")
    const [securityDis, setSecurityDis] = useState("none")
    const [securityAnswerDis, setSecurityAnswerDis] = useState("none")
    const [securityQuestion, setSecurityQuestion] = useState("")

    const chooseEmail = () => {
        setMainDis("none")
        setEmailDis("block")
        setSecurityDis("none")
        setSecurityAnswerDis("none")
    }
    const chooseSecurityQues = () => {
        setMainDis("none")
        setEmailDis("none")
        setSecurityDis("block")
        setSecurityAnswerDis("none")
    }


    const emailSecurityBack = () => {
        setMainDis("block")
        setEmailDis("none")
        setSecurityDis("none")
        setSecurityAnswerDis("none")
    }


    const getSecurityQues = () => {
        axios.post(`/forgetPasswordSecurity`, {
            Email: document.getElementsByName("securityEmail")[0].value
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then((response) => {
                if (response.data === "User Not Found") return alert(response.data)
                setMainDis("none")
                setEmailDis("none")
                setSecurityDis("none")
                setSecurityAnswerDis("block")
                setSecurityQuestion(response.data)
            })


    }

    const emailSent = () => {
        axios.post(`/forgetPasswordLink`, {
            Email: document.getElementsByName("emailSent")[0].value
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then((response) => {

                alert(response.data)
                window.location.href = "/login/-1"
            })
    }
    const securitySent = () => {
        axios.post(`/forgetPasswordSecurityPassword`, {
            securityQues: securityQuestion,
            answer: document.getElementsByName("securityPassword")[0].value,
            Email: document.getElementsByName("securityEmail")[0].value
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then((response) => {
                window.location.href = "/password-reset/" + response.data
            })
    }



    return (
        <div className='forget_main'>
            <div style={{ display: mainDis }} className="forget_content" id="forget_content">
                <p>Choose method for forget password</p>
                <Button name="E-Mail" link={chooseEmail} bgcolor="burlywood" />
                <Button name="Security Question" link={chooseSecurityQues} bgcolor="burlywood" />
            </div>
            <div style={{ display: emailDis }} className="forget_content" id="for-email-div">
                <p><ArrowBackIcon onClick={emailSecurityBack} className='backArrow' />Confirm Your E-Mail Id<br />
                    Reset Password Mail will be sent on your registered Mail
                </p>
                <input name="emailSent" placeholder="Enter Your E-Mail" required />
                <Button name="Confirm" link={emailSent} bgcolor="burlywood" />
            </div>
            <div style={{ display: securityDis }} className="forget_content" id="for-sec-div">
                <p><ArrowBackIcon onClick={emailSecurityBack} className='backArrow' />Confirm Your E-Mail Id<br /></p>
                <input name="securityEmail" placeholder="Enter Your E-Mail" required />
                <Button name="Confirm" link={getSecurityQues} bgcolor="burlywood" />
            </div>
            <div style={{ display: securityAnswerDis }} className="forget_content" id="sec-ques-div">
                <p><ArrowBackIcon onClick={chooseSecurityQues} className='backArrow' />{securityQuestion}<br />
                </p>
                <input name="securityPassword" type="password" placeholder="Enter Your E-Mail" required />
                <Button name="Confirm" link={securitySent} bgcolor="burlywood" />

            </div>

        </div >
    )
}

export default ForgetPassword