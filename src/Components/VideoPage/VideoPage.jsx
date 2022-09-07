import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../Button'
import { LoginChecker } from "../../LoginChecker"
import "./VideoPage.css"
import { videoBack } from "../../Assets/src"
import axios from '../../axios';


function VideoPage() {
    LoginChecker(-1)
    const { id, course } = useParams()
    const [videoData, setVideoData] = useState()
    const [userLevel, setUserLevel] = useState()

    useEffect(() => {
        axios.get(`/videopagedata/${course}`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(function (response) {
                const data = JSON.parse(response.data.data2)
                data.sort(function (a, b) {
                    return a.btn_Id - b.btn_Id;
                });
                let finalData = data
                if (id === "0") return {
                    video: setVideoData(finalData),
                    hideResult: hideResultDiv()
                }
                if (id === "2") hideResultDiv()

                setUserLevel(response.data.user_level)
                if (response.data.user_level > 10) {
                    finalData = []
                    for (let i = 15; i < data.length; i++) {
                        finalData.push(data[i])
                    }
                } else if (response.data.user_level > 5 && response.data.user_level < 11) {
                    finalData = []
                    for (let i = 7; i < data.length; i++) {
                        finalData.push(data[i])
                    }
                }
                setVideoData(finalData)
            });
        // eslint-disable-next-line
    }, [])


    const [videoLink, setVideoLink] = useState()
    const [title, setTitle] = useState()
    const [videoDisplay, setvideoDisplay] = useState("none")

    const btnClick = (link, name) => {
        setvideoDisplay("block")
        setVideoLink(link)
        setTitle(name)
    }

    const [quiz_result_display, setQuiz_result_display] = useState("flex")
    const hideResultDiv = () => {
        document.getElementById("result_div").style.zIndex = "-3"
        setQuiz_result_display("none")
    }

    const quiz_result = {
        position: "fixed",
        top: "40%",
        left: "30%",
        backgroundColor: "antiquewhite",
        width: "400px",
        padding: "30px",
        borderRadius: "25px",
        border: "1px solid black",
        display: quiz_result_display,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }
    const videopage_main = {
        width: "100%",
        height: "100%",
        background: `url(${videoBack})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        display: "flex",
        alignOtems: "center",
    }
    return (
        <div style={videopage_main}>
            <div style={{ padding: "100px 50px 50px 50px", overflowY: "scroll" }}>
                <div className='videopage_videoplayer' style={{ textAlign: "center", display: videoDisplay }}>
                    <iframe src={videoLink} title={title} width="560px" height="315px" ></iframe>
                </div>
                <div className='videopage_btn'>
                    {videoData?.map(video => (
                        <Button padding={"10"} key={video.btn_Id} id={video.btn_Id} value={video.link} name={video.topic_name} link={() => btnClick(video.link, video.topic_name)} />
                    ))}
                </div>
            </div>
            <div id="result_div" style={{ height: "100vh", width: "100vw", position: "fixed" }}>
                <div style={quiz_result}>
                    <span style={{ fontSize: "25px" }}>Your Result:{userLevel} out of 15 </span>
                    <Button name={"OK"} font={"20"} link={hideResultDiv} padding={"60"} />
                </div>
            </div>
        </div>
    )
}

export default VideoPage