import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./VideoConference.css"
import { MicNoneOutlined, MicOffOutlined, VideocamOutlined, VideocamOffOutlined, ContentCopy, ScreenShareOutlined, StopScreenShareOutlined, ChatOutlined } from "@mui/icons-material"
import MessageBox from './MessageBox/MessageBox';
import axios from "../../axios"
import Videos from './Videos/Videos';
import { useDataLayerValue } from "./DataLayer"
import { LoginChecker } from "../../LoginChecker"
import { UserVerificationRoom } from "./UserVerificationRoom"
function VideoConference() {
    LoginChecker(-1)
    const { id, status } = useParams()

    const { updateMsgDisplayReducer, updateNameReducer, updateRoomIdReducer } = useDataLayerValue()

    const [copyToolTipDis, setCopyToolTipDis] = useState("none")
    const [micOnOff, setMicOff] = useState("off")
    const [camOnOff, setCamOnOff] = useState("off")
    const [screenShareOnOff, setScreenShareOnOff] = useState("off")
    const [msgDis, setMsgDis] = useState("none")

    useEffect(() => {
        axios.get(`/getUserName`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(function (response) {
                updateNameReducer(response.data)
                window.localStorage.setItem("userName", response.data)
            });

        UserVerificationRoom(id, status)
        updateRoomIdReducer(id)
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        updateMsgDisplayReducer(msgDis)
        // eslint-disable-next-line
    }, [msgDis])


    const vc_left = {
        width: (msgDis === "none") ? "100%" : "75%",
        position: "relative",
        padding: "80px 30px",
    }

    return (
        <div className='vc_main'>
            <div style={vc_left}>
                <div className='videos_div'>
                    <Videos />
                </div>
                <div className='navigation_div'>
                    <div className='room_id'>
                        {id}
                        <ContentCopy className='room_idCopy' onClick={() => {
                            setCopyToolTipDis("initial")
                            setTimeout(() => {
                                setCopyToolTipDis("none")
                            }, 1000)
                            navigator.clipboard.writeText(id)
                        }} />
                        <div style={{ display: copyToolTipDis }} className='copyToolTip'>
                            Room Id Copied!
                            <div className='copyToolTipArrow'></div>
                        </div>

                    </div>
                    <div className='navigation_btn'>
                        <button style={{ backgroundColor: (micOnOff === "off") ? "#d95240" : "#27292b" }}
                            onClick={() => (micOnOff === "off") ? setMicOff("on") : setMicOff("off")} type="button">
                            {(micOnOff === "on") ? <MicNoneOutlined /> : <MicOffOutlined />}
                        </button>
                        <button style={{ backgroundColor: (camOnOff === "off") ? "#d95240" : "#27292b" }}
                            onClick={() => (camOnOff === "off") ? setCamOnOff("on") : setCamOnOff("off")} type="button">
                            {(camOnOff === "on") ? <VideocamOutlined /> : <VideocamOffOutlined />}
                        </button>
                        <button style={{ backgroundColor: (screenShareOnOff === "off") ? "#d95240" : "#27292b" }}
                            onClick={() => (screenShareOnOff === "off") ? setScreenShareOnOff("on") : setScreenShareOnOff("off")} type="button">
                            {(screenShareOnOff === "on") ? <ScreenShareOutlined /> : <StopScreenShareOutlined />}
                        </button>
                        <button style={{ backgroundColor: (msgDis === "none") ? "#27292b" : "#3f8dfd" }}
                            onClick={() => {
                                setTimeout(() => {
                                    (msgDis === "none") ? setMsgDis("initial") : setMsgDis("none")
                                }, 200)
                                document.getElementById("msgs_box").scrollTo(0, document.getElementById("msgs_box").scrollHeight);
                            }
                            } type="button">
                            <ChatOutlined />
                        </button>
                    </div>
                    <div className='leave_btn'>
                        Leave Meeting
                    </div>
                </div>
            </div>
            <div style={{ display: msgDis }} className='vc_Right'>
                <MessageBox />
            </div>
        </div >


    )
}

export default VideoConference