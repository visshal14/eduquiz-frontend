import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./VideoConference.css"
import {
    MicNoneOutlined, MicOffOutlined, CropSquareRounded, FiberManualRecord, VideocamOutlined,
    VideocamOffOutlined, ContentCopy, ScreenShareOutlined, StopScreenShareOutlined, ChatOutlined,
} from "@mui/icons-material"
import MessageBox from './MessageBox/MessageBox';
import axios from "../../axios"
import Videos from './Videos/NewVideos';
import { useDataLayerValue } from "./DataLayer"
import { LoginChecker } from "../../LoginChecker"
import { UserVerificationRoom } from "./UserVerificationRoom"
import { FormControlLabel, Switch, Tooltip } from '@mui/material';
import Logo from '../Layout/Logo';

/**
 * A single control-bar button. `danger` paints the "off"/active-recording
 * state red, matching the previous inline background switch.
 */
const ControlButton = ({ label, danger, active, onClick, children }) => (
    <Tooltip title={label}>
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`vc_control${danger ? ' is-danger' : ''}${active ? ' is-active' : ''}`}
        >
            {children}
        </button>
    </Tooltip>
)

function VideoConference() {
    LoginChecker(-1)
    const { id, status } = useParams()

    const { myEmail, roomDetail, updateRoomDetail, recordingStop, updateEmail, recordingStart, updateMsgDisplayReducer, updateNameReducer, updateRoomIdReducer, updateIsHost, updateIsScreenShare, socketMicOnOff, micStatus, updateMicStatus, camStatus, updateCamStatus, camOnOffToSocket, updateHostForWhiteboard, updateMyScreenShareStatus, btnScreenShare, myScreenShare, leave_button, isMeTalking, isHost, isWhiteBoard, updateWhiteBoard } = useDataLayerValue()

    const [copied, setCopied] = useState(false)
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

    const leaveBtn = () => {
        leave_button()
    }

    const copyRoomId = () => {
        navigator.clipboard.writeText(id)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
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
    }

    const [isRecording, setIsRecording] = useState(false)
    const recordOn = () => {
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

    const isChatOpen = msgDis !== "none"

    return (
        <div className='vc_main'>
            <div className='vc_left' style={{ width: isChatOpen ? "75%" : "100%" }}>

                <header className='vc_topbar'>
                    <Logo to={null} invert size={26} />

                    <Tooltip title={copied ? "Copied" : "Copy room ID"} open={copied || undefined}>
                        <button type="button" className='room_id' onClick={copyRoomId}>
                            <span className='room_id_label'>Room</span>
                            {id}
                            <ContentCopy className='room_idCopy' />
                        </button>
                    </Tooltip>
                </header>

                <div className='videos_div'>
                    <Videos micStatus={micStatus} camStatus={camStatus} isMeTalking={isMeTalking} />
                    <canvas id="canvas1" style={{ display: "none" }}></canvas>
                </div>

                <div className='navigation_div'>
                    <div className='navigation_btn'>
                        <ControlButton
                            label={micStatus === "on" ? "Mute" : "Unmute"}
                            danger={micStatus === "off"}
                            onClick={() => (micStatus === "off") ? updateMicStatus("on") : updateMicStatus("off")}
                        >
                            {(micStatus === "on") ? <MicNoneOutlined /> : <MicOffOutlined />}
                        </ControlButton>

                        <ControlButton
                            label={camStatus === "on" ? "Turn camera off" : "Turn camera on"}
                            danger={camStatus === "off"}
                            onClick={() => (camStatus === "off") ? updateCamStatus("on") : updateCamStatus("off")}
                        >
                            {(camStatus === "on") ? <VideocamOutlined /> : <VideocamOffOutlined />}
                        </ControlButton>

                        <ControlButton
                            label="Share your screen"
                            danger={myScreenShare === false && screenShareOnOff === "off"}
                            onClick={screenShareBtnMain}
                        >
                            {(myScreenShare === false && screenShareOnOff === "on")
                                ? <ScreenShareOutlined />
                                : <StopScreenShareOutlined />}
                        </ControlButton>

                        {myEmail === roomDetail.host_email && (
                            <ControlButton
                                label={isRecording ? "Stop recording" : "Start recording"}
                                danger={isRecording}
                                onClick={recordOn}
                            >
                                <FiberManualRecord />
                            </ControlButton>
                        )}

                        {isHost && myEmail === roomDetail.host_email && (
                            <ControlButton
                                label={isWhiteBoard ? "Close whiteboard" : "Open whiteboard"}
                                danger={isWhiteBoard}
                                onClick={() => isWhiteBoard ? updateWhiteBoard(false) : updateWhiteBoard(true)}
                            >
                                <CropSquareRounded />
                            </ControlButton>
                        )}

                        {isWhiteBoard && myEmail === roomDetail.host_email && (
                            <FormControlLabel
                                className='vc_whiteboard_switch'
                                control={<Switch size="small" onChange={whiteboardHost} />}
                                label={switchLabel ? "Everyone" : "Only host"}
                            />
                        )}

                        <ControlButton
                            label={isChatOpen ? "Hide chat" : "Show chat"}
                            active={isChatOpen}
                            onClick={() => {
                                setTimeout(() => {
                                    (msgDis === "none") ? setMsgDis("initial") : setMsgDis("none")
                                }, 200)
                                document.getElementById("msgs_box").scrollTo(0, document.getElementById("msgs_box").scrollHeight);
                            }}
                        >
                            <ChatOutlined />
                        </ControlButton>
                    </div>

                    <button className='leave_btn' onClick={leaveBtn} type="button">
                        Leave meeting
                    </button>
                </div>
            </div>

            {/* Kept mounted while hidden — the chat toggle scrolls #msgs_box. */}
            <div style={{ display: msgDis }} className='vc_Right'>
                <MessageBox />
            </div>
        </div>
    )
}

export default VideoConference
