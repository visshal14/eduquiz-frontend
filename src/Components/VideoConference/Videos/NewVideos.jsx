import React, { useEffect, useState, useRef } from 'react'
import "./Videos.css"
import { MicNoneOutlined, MicOffOutlined, GraphicEq } from "@mui/icons-material"
import { useDataLayerValue } from "../DataLayer"
import WhiteBoard from '../WhiteBoard/WhiteBoard'
// import WhiteBoard from "../../Whiteboard/NewWhiteboard"
function NewVideos({ micStatus, camStatus }) {
    const { msgDisplay, userName, myPeerId, whiteboardRef, myVideo, topDivElement, setTopDivElement, remoteStreams, remotePeersRef, isScreenShare, screenRef, isMeTalking, isWhiteBoard, socket, currentScreenShareId } = useDataLayerValue()

    // order for when message box open , screenshare or whiteboard open close.
    const [topDivStyle, setTopDivStyle] = useState({
        order: "",
        width: "",
        height: "",
    })
    const [bottomDivStyle, setBottomDivStyle] = useState({
        order: "",
        width: "",
        height: "",
        display: "",
    })

    //css
    const top_div = {
        order: topDivStyle.order,
        width: topDivStyle.width,
        height: topDivStyle.height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
    //css
    const bottom_div = {
        order: bottomDivStyle.order,
        width: bottomDivStyle.width,
        height: bottomDivStyle.height,
        display: bottomDivStyle.display,
        overflow: "scroll"
    }

    // to show whiteboard from main window to secondary window
    function whiteScreenDiv(who, where) {

        let div = document.getElementById(who)
        document.getElementsByClassName(who)[0].remove()
        document.getElementById(where).append(div)
    }
    useEffect(() => {
        if (isWhiteBoard) {
            if (isScreenShare) {
                whiteScreenDiv("whiteboardComp", "top_div")
                setTopDivElement("whiteboard")
                whiteScreenDiv("screenshareComp", "bottom_div")
            } else {
                setTopDivElement("whiteboard")
                whiteScreenDiv("whiteboardComp", "top_div")
            }
        } else {
            if (isScreenShare) {
                setTopDivElement("screenshare")
                whiteScreenDiv("screenshareComp", "top_div")
            }
        }



        // eslint-disable-next-line
    }, [isWhiteBoard])




    useEffect(() => {
        if (isScreenShare) {
            if (isWhiteBoard) {
                setTopDivElement("screenshare")
                whiteScreenDiv("screenshareComp", "top_div")
                whiteScreenDiv("whiteboardComp", "bottom_div")
            } else {
                setTopDivElement("screenshare")
                whiteScreenDiv("screenshareComp", "top_div")
            }
        } else {
            if (isWhiteBoard) {
                setTopDivElement("whiteboard")
                whiteScreenDiv("whiteboardComp", "top_div")
            }
        }



        // eslint-disable-next-line
    }, [isScreenShare])



    const [whiteboardInner, setWhiteboardInner] = useState(false)
    const [screenshareInner, setScreenshareInner] = useState(false)


    useEffect(() => {



        if (msgDisplay === "none") {
            if (isScreenShare || isWhiteBoard) {
                setTopDivStyle({
                    order: "1",
                    width: "80%",
                    height: "100%",
                })
                setBottomDivStyle({
                    order: "2",
                    width: "19%",
                    height: "100%",
                    display: "block"
                })
                for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                    document.getElementsByClassName("videoThumbnail")[i].style.height = "fit-content"

                }
            } else {
                setTopDivStyle({
                    order: "1",
                    width: "100%",
                    height: "100%",
                })
                setBottomDivStyle({
                    order: "2",
                    width: "0%",
                    height: "100%",
                    display: "none"
                })
                document.getElementById("all_usersDiv").style.height = "fit-content"
            }

        } else {
            if (isScreenShare || isWhiteBoard) {
                setTopDivStyle({
                    order: "2",
                    width: "100%",
                    height: "80%",
                })
                setBottomDivStyle({
                    order: "1",
                    width: "100%",
                    height: "20%",
                    display: "block"
                })
                // console.log(isScreenShare, " isscreen")
                document.getElementById("all_usersDiv").style.height = "100%"
                for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                    document.getElementsByClassName("videoThumbnail")[i].style.width = "auto"
                    document.getElementsByClassName("videoThumbnail")[i].style.maxHeight = "100%"
                    document.getElementsByClassName("videoThumbnail")[i].children[0].style.height = "100%"
                }



            } else {
                document.getElementById("all_usersDiv").style.height = "initial"
                setTopDivStyle({
                    order: "2",
                    width: "100%",
                    height: "100%",
                })
                setBottomDivStyle({
                    order: "1",
                    width: "100%",
                    height: "20%",
                    display: "none"
                })
            }
        }


        if (document.getElementById("screenshareComp").parentNode.id === "bottom_div" && document.getElementsByClassName("screen-share-div")[0]) {
            document.getElementById("screenshareComp").style.height = "auto"
            document.getElementsByClassName("screen-share-div")[0].style.width = "100%"
        } else {
            if (isScreenShare) {

                document.getElementById("screenshareComp").style.height = "100%"
                if (document.getElementsByClassName("screen-share-div")[0]) {
                    document.getElementsByClassName("screen-share-div")[0].style.width = "fit-content"
                }
            }
        }






    }, [msgDisplay, isScreenShare, isWhiteBoard])




    useEffect(() => {


        let myVideoDiv = document.getElementsByClassName("videoThumbnail")
        if (!myVideoDiv) return
        if (remoteStreams.length === 0 && (!isScreenShare && !isWhiteBoard)) {
            myVideoDiv[0].style.width = "100%"
            myVideoDiv[0].style.height = "100%"
            // 70% 70%

        } else if (remoteStreams.length === 1 && (!isScreenShare && !isWhiteBoard)) {
            for (let i = 0; i < myVideoDiv.length; i++) {

                myVideoDiv[i].style.width = "50%"
                myVideoDiv[i].style.height = "50%"
            }

            //50% 50%
        } else if (remoteStreams.length === 2 && (!isScreenShare && !isWhiteBoard)) {
            for (let i = 0; i < myVideoDiv.length; i++) {

                myVideoDiv[i].style.width = "30%"
                myVideoDiv[i].style.height = "30%"
            }
            // console.log("103 3")
            //30% 30%
        } else {
            if (!isScreenShare && !isWhiteBoard) {
                for (let i = 0; i < myVideoDiv.length; i++) {
                    myVideoDiv[i].style.width = "25%"
                    myVideoDiv[i].style.height = "25%"
                }
            } else {
                if (msgDisplay === "none") {
                    for (let i = 0; i < myVideoDiv.length; i++) {
                        myVideoDiv[i].style.width = "100%"
                        myVideoDiv[i].style.height = "fit-content"
                    }
                } else {
                    for (let i = 0; i < myVideoDiv.length; i++) {
                        // myVideoDiv[i].style.width = "100%"
                        myVideoDiv[i].style.height = "100%"
                    }
                }
            }

            // 25%
        }



        // eslint-disable-next-line
    }, [remoteStreams, isScreenShare, isWhiteBoard, msgDisplay, topDivElement])



    useEffect(() => {

        if (!isScreenShare && !isWhiteBoard) {

            let allusers = document.getElementById("all_usersDiv")
            document.getElementsByClassName("all-users")[0].remove()
            document.getElementById("top_div").append(allusers)
            for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                document.getElementsByClassName("videoThumbnail")[i].style.maxWidth = "100%"
            }
        } else {
            let allusers = document.getElementById("all_usersDiv")
            document.getElementsByClassName("all-users")[0].remove()
            document.getElementById("bottom_div").append(allusers)
        }


        if (document.getElementById("all_usersDiv").parentNode.id === "top_div") {
            setTopDivElement("users")
        }
        // eslint-disable-next-line
    }, [remoteStreams, isWhiteBoard, isScreenShare])


    useEffect(() => {
        if (document.getElementById("whiteboardComp").parentNode.id === "bottom_div") {
            setWhiteboardInner(true)
        } else {
            setWhiteboardInner(false)
        }
        if (document.getElementById("screenshareComp").parentNode.id === "bottom_div") {
            setScreenshareInner(true)
        } else {
            setScreenshareInner(false)
        }
    }, [topDivElement])


    //function to switch element from main to secondary window or vice versa
    const thumbnailClicked = (type) => () => {


        if (topDivElement === "whiteboard") {
            whiteScreenDiv("whiteboardComp", "bottom_div")
            whiteScreenDiv("screenshareComp", "top_div")
        } else if (topDivElement === "screenshare") {
            whiteScreenDiv("whiteboardComp", "top_div")
            whiteScreenDiv("screenshareComp", "bottom_div")
        } else if (topDivElement === "users") {
            whiteScreenDiv(type, "top_div")
            whiteScreenDiv("all_usersDiv", "bottom_div")
        }
        setTopDivElement(type.replace("Comp", ""))


    }

    //function to switch element from main to secondary window or vice versa

    const usersThumbnailClicked = () => {


        if (topDivElement === "whiteboard") {
            // console.log("331")
            whiteScreenDiv("whiteboardComp", "bottom_div")
            whiteScreenDiv("all_usersDiv", "top_div")
            setTopDivElement("users")

        } else if (topDivElement === "screenshare") {
            whiteScreenDiv("screenshareComp", "bottom_div")
            whiteScreenDiv("all_usersDiv", "top_div")
            setTopDivElement("users")
        } else if (document.getElementById("all_usersDiv").parentNode.id === "bottom_div") {
            whiteScreenDiv("all_usersDiv", "top_div")
            setTopDivElement("users")
        }

    }


    useEffect(() => {
        window.addEventListener('beforeunload', function () {
            // number of miliseconds to hold before unloading page
            socket.close()
        }, false)
        // eslint-disable-next-line
    }, [])


    return (
        <div className='videos_main'>
            <div id="top_div" style={top_div}
            // className="bor-r"
            >

                <div style={{ width: isWhiteBoard ? "100%" : "0%", height: isWhiteBoard ? "100%" : "0%" }} className='whiteboardComp' id="whiteboardComp">
                    <div className='whiteboardInner' style={{ pointerEvents: !whiteboardInner ? "none" : "auto" }} onClick={thumbnailClicked("whiteboardComp")}></div>
                    {isWhiteBoard && <WhiteBoard topElement={topDivElement} />}
                </div>


                <div style={{ width: isScreenShare ? "100%" : "0%", height: isScreenShare ? "100%" : "0%" }} className='screenshareComp' id="screenshareComp">
                    <div className='screenshareInner' style={{ pointerEvents: !screenshareInner ? "none" : "auto" }} onClick={thumbnailClicked("screenshareComp")}></div>
                    {isScreenShare && <ScreenShareThumbnail srcRef={screenRef} id={currentScreenShareId} />}
                </div>



                <div id="all_usersDiv" className='all_usersDiv all-users' onClick={usersThumbnailClicked}>
                    <VideoThumbnail videoRef={myVideo} name={userName} id={myPeerId} micStatus={micStatus} camStatus={camStatus} isMeTalking={isMeTalking} />
                    {remoteStreams.map((peer, i) => (
                        <RemoteVideoThumbnail id={peer} remotePeer={remotePeersRef.current[i]} key={i} />
                    ))}
                    <video ref={whiteboardRef} playsInline muted autoPlay style={{ width: "0px ", height: "0px ", visibility: "hidden" }} />
                    {/* <video ref={tempRemotePeerRef} playsInline muted autoPlay style={{ width: "0px !important", height: "0px !important", visibility: "hidden" }} /> */}
                </div>
            </div>
            <div id="bottom_div" style={bottom_div}
            // className="bor-y"
            >






            </div>
        </div>
    )
}



const ScreenShareThumbnail = ({ srcRef, id }) => {
    // console.log(scrRef)
    // console.log(id)
    const { remoteStreams, socket, myScreenShare, userName, remoteAccess, remoteRequestAllowCancel, requestRemoteControl, currentRemoteAccessUser, isPendingRequest, remoteMouseControl } = useDataLayerValue()


    const [name, setName] = useState("")
    const [canRequestRemote, setCanRequestRemote] = useState(false)
    const [tempId, setTempId] = useState("")
    useEffect(() => {

        if (myScreenShare) {
            setName(userName)
            setCanRequestRemote(false)
        } else {
            setCanRequestRemote(true)
            remoteStreams.every((ele) => {
                if (ele.id === id || ele.screenshare) {
                    setName(ele.name)
                    setTempId(ele.id)
                    return false
                }
                return true

            }
            )
        }
        // eslint-disable-next-line
    }, [id])

    //beta for screen control
    const [isVideoFocused, setIsVideoFocused] = useState(false)
    const mouseMove = (e) => {
        if (!remoteAccess) return
        if (isVideoFocused) {
            socket.emit("remoteAccessMousePositionToServer", e.nativeEvent.offsetX, e.nativeEvent.offsetY, srcRef.current.clientWidth, srcRef.current.clientHeight)

        }
    }

    const remoteClicked = (e) => {
        if (!remoteAccess) return
        if (isVideoFocused) {
            socket.emit("remoteAccessMouseClickedToServer", e.nativeEvent.offsetX, e.nativeEvent.offsetY, srcRef.current.clientWidth, srcRef.current.clientHeight)
        }

    }



    return (
        <>
            <div

                onMouseOver={() => setIsVideoFocused(true)}
                onMouseMove={mouseMove}
                onClick={remoteClicked}
                onMouseLeave={() => setIsVideoFocused(false)}

                className='screen-share-div' id={(id || tempId) + "-screen"}>
                <video playsInline muted ref={srcRef} autoPlay />

                {currentRemoteAccessUser.name && <p className='screen-share-remote-access'>{currentRemoteAccessUser.name} has remote access</p>}
                {remoteAccess && <p className='screen-share-remote-access'>You have remote access</p>}
                <p className='screen-share-name'>{myScreenShare ? "You are" : `${name} is`}  presenting...</p>
                {canRequestRemote && !remoteAccess && <button onClick={requestRemoteControl} className='request-remote'>Request Remote Control</button>}
                {isPendingRequest?.name && <div className='request-div'>
                    <p> {isPendingRequest?.name} wants to request for remote control</p>
                    <div>
                        <button onClick={() => remoteRequestAllowCancel("allow")}>Allow</button>
                        <button onClick={() => remoteRequestAllowCancel("cancel")}>Cancel</button>
                    </div>
                </div>}

                {currentRemoteAccessUser.id && <div className='tempMouse' style={{ top: `${remoteMouseControl.y * remoteMouseControl.height}px`, left: `${remoteMouseControl.x * remoteMouseControl.width}px` }}>

                </div>}

            </div>

        </>
    )
}

const remotePeerClick = () => {
    // console.log("remote click")
}
const RemoteVideoThumbnail = ({ id, remotePeer }) => {

    const tempRef = useRef(null)
    useEffect(() => {
        if (tempRef) tempRef.current.srcObject = remotePeer

        // eslint-disable-next-line
    }, [])
    return (
        <div className='videoThumbnail' id={id.id}>
            <video playsInline onClick={remotePeerClick} ref={tempRef} autoPlay />
            <p>{id.name}</p>
            <span className='myMicSpan' style={{ backgroundColor: id.isTalking ? "blue" : "black" }}>{(id.micStatus === "on") ? id.isTalking ? <GraphicEq /> : <MicNoneOutlined /> : <MicOffOutlined />}</span>
        </div>

    )
}

const VideoThumbnail = ({ videoRef, name, micStatus, id, isMeTalking }) => {
    return (
        <div className='videoThumbnail' id={id}>
            <video playsInline muted ref={videoRef} autoPlay />
            <p>{name}</p>
            <span className='myMicSpan' style={{ backgroundColor: isMeTalking ? "blue" : "black" }}>{(micStatus === "on") ? isMeTalking ? <GraphicEq /> : <MicNoneOutlined /> : <MicOffOutlined />}</span>
        </div>
    )
}

export default NewVideos