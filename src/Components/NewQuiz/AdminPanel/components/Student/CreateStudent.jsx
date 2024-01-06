import React, { useState } from 'react'
import axios from "../../../../../axios"
const CreateStudent = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")




    const submit = (e) => {
        e.preventDefault()
        if (name === "" || email === "" || password === "") return


        axios.post(`/addNewStudent`, {
            name, email, password

        }).then((response) => {
            if (response.data.errMsg) return alert("Error")
            // console.log(response.data)
            alert("success")
            setName("")
            setEmail("")
            setPassword("")
        })
            .catch(function (error) {
                console.log(error);
            });


    }


    return (
        <div className='form-main'>

            <div className='top-div'>

                <div>

                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>

                    <label htmlFor="lname">Email:</label>
                    <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="lname">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                </div>

            </div>
            <button onClick={submit} className='submitBtn'>submit</button>
        </div>
    )
}

export default CreateStudent