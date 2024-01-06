
import React,{useEffect} from 'react'
import "./Home.css"
import { frontBack } from '../../Assets/src'
import Button from "../Button"

function Home() {
    const home_main = {
        width: "100%",
        height: "100%",
        background: `url(${frontBack})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        padding: "0 50px",
    }
useEffect(() => {
        setTimeout(() => {
            window.top.postMessage('hello', '*')
        }, 5000)
    }, [])
    return (
        <div style={home_main}>
            <div className='home_content'>
                <div className='home_name' style={{ fontSize: "50px", color: "white" }}>
                    Quiz
                </div>
                <div className='home_description' style={{ fontSize: "25px", color: "white" }}>
                    Best platform to test your ability and learn according to them
                    <br />
                    <Button name={"Get Started"} font={"30"} link={"/student/login/0"} padding={"60"} />
                </div>
            </div>
        </div>
    )
}

export default Home
