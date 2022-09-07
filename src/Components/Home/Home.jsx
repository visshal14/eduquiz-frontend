
import React from 'react'
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



    // const home_start_btn = {
    //     fontSize: "25px",
    //     padding: " 20px 60px",
    //     borderRadius: "505px",
    //     border: "1px solid black",
    //     backgroundColor: "white",
    //     marginTop: "20px",
    // }
    return (
        <div style={home_main}>
            <div className='home_content'>
                <div className='home_name' style={{ fontSize: "50px", color: "white" }}>
                    Eduquiz
                </div>
                <div className='home_description' style={{ fontSize: "25px", color: "white" }}>
                    Best platform to test your ability and learn according to them
                    <br />
                    <Button name={"Get Started"} font={"30"} link={"/courseSelection"} padding={"60"} />
                </div>
            </div>
        </div>
    )
}

export default Home