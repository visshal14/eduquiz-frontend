import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./VideoConference.css"
import { MicNoneOutlined, MicOffOutlined, CropSquareRounded, FiberManualRecord, VideocamOutlined, VideocamOffOutlined, ContentCopy, ScreenShareOutlined, StopScreenShareOutlined, ChatOutlined } from "@mui/icons-material"
import MessageBox from './MessageBox/MessageBox';
import axios from "../../axios"
import Videos from './Videos/NewVideos';
import { useDataLayerValue } from "./DataLayer"
import { LoginChecker } from "../../LoginChecker"
import { UserVerificationRoom } from "./UserVerificationRoom"
import { FormControlLabel, Switch } from '@mui/material';
function VideoConference() {
    LoginChecker(-1)
    const { id, status } = useParams()

    const { myEmail, roomDetail, updateRoomDetail, recordingStop, updateEmail, recordingStart, updateMsgDisplayReducer, updateNameReducer, updateRoomIdReducer, updateIsHost, updateIsScreenShare, socketMicOnOff, micStatus, updateMicStatus, camStatus, updateCamStatus, camOnOffToSocket, updateHostForWhiteboard, updateMyScreenShareStatus, btnScreenShare, myScreenShare, leave_button, isMeTalking, isHost, isWhiteBoard, updateWhiteBoard } = useDataLayerValue()

    const [copyToolTipDis, setCopyToolTipDis] = useState("none")
    const [screenShareOnOff, setScreenShareOnOff] = useState("off")
    const [msgDis, setMsgDis] = useState("none")





    useEffect(() => {
        axios.get(`/getUserName`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(function (response) {
                updateNameReducer(response.data)
                window.localStorage.setItem("userName", response.data)
            });
        updateNameReducer(window.localStorage.getItem("userName"))
        UserVerificationRoom(id, status)
        updateRoomIdReducer(id)

        axios.post(`/getRoomHost`, {
            roomId: id
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(function (response) {

                updateEmail(response.data.email)
                updateIsHost(response.data.isHost)
                let detail = {
                    meeting_id: response.data.roomDetailId,
                    host_email: response.data.roomDetailHost
                }
                updateRoomDetail(detail)

            });


        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        updateMsgDisplayReducer(msgDis)
        // eslint-disable-next-line
    }, [msgDis])

    //css for left videoconference
    const vc_left = {
        width: (msgDis === "none") ? "100%" : "75%",
        position: "relative",
        padding: "80px 30px",
        boxSizing: "border-box"
    }

    useEffect(() => {
        socketMicOnOff(micStatus)
        // eslint-disable-next-line
    }, [micStatus])
    useEffect(() => {
        camOnOffToSocket()
        // eslint-disable-next-line
    }, [camStatus])
    useEffect(() => {

        if (screenShareOnOff === "off") {
            updateIsScreenShare(false)
            updateMyScreenShareStatus(false)
        } else {
            updateIsScreenShare(true)
            updateMyScreenShareStatus(true)
            // eslint-disable-next-line
        }
        // eslint-disable-next-line
    }, [screenShareOnOff])

    const screenShareBtnMain = () => {
        screenShareOnOff === "off" ? setScreenShareOnOff("on") : setScreenShareOnOff("off")
        btnScreenShare()
    }
    // const camOnOffFunction = () => {
    //     camOnOff === "off" ? setCamOnOff("on") : setCamOnOff("off")
    // }

    useEffect(() => {
        for (let i = 0; i < document.getElementsByClassName("nav_content_col").length; i++) {
            document.getElementsByClassName("nav_content_col")[i].style.color = "white"
        }
        return () => {
            for (let i = 0; i < document.getElementsByClassName("nav_content_col").length; i++) {
                document.getElementsByClassName("nav_content_col")[i].style.color = "black"
            }

        }
    }, [])
    const leaveBtn = () => {
        leave_button()
    }

    const [switchLabel, setSwitchLabel] = useState(false)
    const whiteboardHost = () => {
        if (switchLabel) {
            updateHostForWhiteboard(false)
            setSwitchLabel(false)
        } else {
            updateHostForWhiteboard(true)
            setSwitchLabel(true)
        }
        // console.log("kf")
    }


    const [isRecording, setIsRecording] = useState(false)
    const recordOn = () => {
        // console.log("recordOn")
        setIsRecording(!isRecording)


    }


    useEffect(() => {
        if (isRecording) {
            recordingStart()
        } else {
            recordingStop()
        }
        // eslint-disable-next-line
    }, [isRecording])
    return (
        <div className='vc_main'>
            <div style={vc_left}>
                <div className='videos_div'>
                    <Videos micStatus={micStatus} camStatus={camStatus} isMeTalking={isMeTalking} />
                    <canvas id="canvas1" style={{ display: "none" }}>

                    </canvas>
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
                        <button style={{ backgroundColor: (micStatus === "off") ? "#d95240" : "#27292b" }}
                            onClick={() => (micStatus === "off") ? updateMicStatus("on") : updateMicStatus("off")} type="button">
                            {(micStatus === "on") ? <MicNoneOutlined /> : <MicOffOutlined />}
                        </button>
                        <button style={{ backgroundColor: (camStatus === "off") ? "#d95240" : "#27292b" }}
                            onClick={() => (camStatus === "off") ? updateCamStatus("on") : updateCamStatus("off")} type="button">
                            {(camStatus === "on") ? <VideocamOutlined /> : <VideocamOffOutlined />}
                        </button>
                        <button style={{ backgroundColor: (myScreenShare === false && screenShareOnOff === "off") ? "#d95240" : "#27292b" }}
                            onClick={screenShareBtnMain} type="button">
                            {(myScreenShare === false && screenShareOnOff === "on") ? <ScreenShareOutlined /> : <StopScreenShareOutlined />}
                        </button>

                        {myEmail === roomDetail.host_email && <button style={{ backgroundColor: (isRecording) ? "#d95240" : "#27292b" }}
                            onClick={recordOn} type="button">
                            <FiberManualRecord />
                        </button>}


                        {/* <button style={{ backgroundColor: (isRecording === true) ? "#d95240" : "#27292b" }}
                            onClick={isRecording ? recordingStop : recordingStart}
                            type="button">
                            <FiberManualRecord />
                        </button> */}
                        {isHost && myEmail === roomDetail.host_email && <button style={{ backgroundColor: isWhiteBoard ? "#d95240" : "#27292b" }}
                            onClick={() => isWhiteBoard ? updateWhiteBoard(false) : updateWhiteBoard(true)}
                            type="button">
                            <CropSquareRounded />
                        </button>}
                        {isWhiteBoard && myEmail === roomDetail.host_email && <FormControlLabel
                            control={<Switch onChange={whiteboardHost} />}
                            label={switchLabel ? "Everyone" : "Only Host"}
                        />

                        }




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
                    {/* <div className='leave_btn'> */}
                    <button className='leave_btn'
                        onClick={leaveBtn}
                        type="button">
                        Leave Meeting
                    </button>
                    {/* </div> */}
                </div>
            </div>
            <div style={{ display: msgDis }} className='vc_Right'>
                <MessageBox />
            </div>
        </div >


    )
}

export default VideoConference