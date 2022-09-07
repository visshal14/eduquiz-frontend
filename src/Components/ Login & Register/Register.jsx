import axios from '../../axios';
import React, { useEffect, useState } from 'react'

import "./Login.css"
function Register() {

    const NAME_REGEX = /^[A-z][A-z0-9-_ ]{2,23}$/;
    const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/  //eslint-disable-line
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


    useEffect(() => {
        document.getElementsByName("name")[0].focus()
    }, [])

    const [securityQ, setSecurityQ] = useState("Your First Car")

    const registerBtn = (e) => {
        axios.post('/react-register', {
            name: name,
            email: email,
            password: pwd,
            securityQuestion: securityQ,
            securityAnswer: security,
        })
            .then(function (response) {
                if (response.data === "succesfull") {
                    alert("registration done")
                    window.location.href = "/login/0"
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(true);
    const [pwdFocus, setPwdFocus] = useState(false);
    /* eslint-disable no-unused-vars */
    const [confirmPwd, setConfirmPwd] = useState('');
    const [validConfirm, setValidConfirm] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const [security, setSecurity] = useState('');
    const [validSecurity, setValidSecurity] = useState(false);
    const [securityFocus, setSecurityFocus] = useState(false);
    /* eslint-enable no-unused-vars */

    const selectChange = (event) => {
        setSecurityQ(event.target.value);
    }

    const nameChange = (e) => {
        setName(e.target.value)
    }
    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    const emailChange = (e) => {
        setEmail(e.target.value)
    }
    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email])




    const passwordChange = (e) => {
        setPwd(e.target.value)
    }
    const confirmPasswordChange = (e) => {
        setConfirmPwd(e.target.value)
    }
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd))
        setValidConfirm(pwd === confirmPwd)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pwd, confirmPwd])

    const securityChange = (e) => {
        setSecurity(e.target.value)
    }
    useEffect(() => {
        setValidSecurity(NAME_REGEX.test(security))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [security])



    return (
        <div className='login_main'>
            <div className='login_content'>
                <div className='login_header'>
                    Enter Login Details
                </div>
                <div className='login_input_div'>
                    <label htmlFor='name'>Enter Name</label>
                    <input onChange={nameChange}
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                        name="name" type="text" required />
                    <p id="confirmpasswordpara" className={nameFocus && name && !validName ? "confirmpasswordpara" : "hide"}>4 to 24 characters.<br />
                        Must begin with a letter.<br />
                    </p>

                    <label htmlFor='email'>Enter Email</label>
                    <input value={email} onChange={emailChange}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        name="email" type="text" required />
                    <p id="confirmpasswordpara" className={emailFocus && email && !validEmail ? "confirmpasswordpara" : "hide"}>Please Enter correct form of email</p>

                    <label htmlFor="password">Enter Password</label>
                    <input onChange={passwordChange}
                        value={pwd}
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)} name="password" type="password" required />
                    <p id="confirmpasswordpara" className={pwdFocus && !validPwd ? "confirmpasswordpara" : "hide"}> 8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters:</p>


                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input onChange={confirmPasswordChange}
                        value={confirmPwd}
                        onFocus={() => setConfirmFocus(true)}
                        onBlur={() => setConfirmFocus(false)} name="confirmPassword" type="password" required />
                    <p id="confirmpasswordpara" className={confirmPwd && !validConfirm ? "confirmpasswordpara" : "hide"}>Password and confirm password is not same</p>

                    <select onChange={selectChange} htmlFor="security" name="securityQuestion">
                        <option value="Your First Car">Your First Car</option>
                        <option value="Your First Pet Name">Your First Pet Name</option>
                        <option value="Enter Special Date">Enter Special Date</option>
                    </select>
                    <input type="text" onChange={securityChange}
                        onFocus={() => setSecurityFocus(true)}
                        onBlur={() => setSecurityFocus(false)}
                        name="securityAnswer" required />
                    <p id="confirmpasswordpara" className={security && !validSecurity ? "confirmpasswordpara" : "hide"}>3 to 24 characters</p>

                    {/* <Button disabled={!validName || !validEmail || !validPwd || !validConfirm || !validSecurity ? true : false} name="Login" link={registerBtn} bgcolor="burlywood" /> */}
                    <button className="registerBtn" disabled={!validName || !validEmail || !validPwd || !validConfirm || !validSecurity ? true : false} onClick={registerBtn}>Register</button>
                </div>
                <div className='login_new_div'>
                    <a href="/login">Already Registered</a>
                </div>
            </div>
        </div>
    )
}

export default Register