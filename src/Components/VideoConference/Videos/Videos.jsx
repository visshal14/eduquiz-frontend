import React, { useEffect, useState, useRef } from 'react'
import "./Videos.css"
import { MicNoneOutlined, MicOffOutlined, GraphicEq } from "@mui/icons-material"
import { useDataLayerValue } from "../DataLayer"
import WhiteBoard from "../../Whiteboard/Whiteboard"
function Videos({ micStatus, camStatus }) {
    const { msgDisplay, userName, myPeerId, myVideo, remoteStreams, remotePeersRef, isScreenShare, screenRef, isMeTalking, isWhiteBoard } = useDataLayerValue()
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
                    width: "19%",
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




    }, [msgDisplay, isScreenShare, remoteStreams, isWhiteBoard])

    const top_div = {
        order: topDivStyle.order,
        width: topDivStyle.width,
        height: topDivStyle.height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
    const bottom_div = {
        order: bottomDivStyle.order,
        width: bottomDivStyle.width,
        height: bottomDivStyle.height,
        display: bottomDivStyle.display,
        overflow: "scroll"
    }
    useEffect(() => {
        try {


            // console.log("113")
            if ((isScreenShare && !isWhiteBoard) || (!isScreenShare && isWhiteBoard)) {
                console.log("115")

                let alluser = document.getElementById("all_usersDiv")
                document.getElementById("all_usersDiv").remove()
                document.getElementById("bottom_div").appendChild(alluser)
                // document.getElementById("top_div").innerHTML = ""

                if (document.getElementsByClassName("screen-share-div")[0]) {

                    let screen = document.getElementsByClassName("screen-share-div")[0]
                    document.getElementsByClassName("screen-share-div")[0].remove()
                    document.getElementById("top_div").appendChild(screen)

                    document.getElementsByClassName("screen-share-div")[0].style.width = ""
                }
                console.log(document.getElementsByClassName("videoThumbnail").length + "  133")
                for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                    document.getElementsByClassName("videoThumbnail")[i].style.maxWidth = "100%"
                }

            } else if (isScreenShare && isWhiteBoard) {
                console.log("135")
                if (document.getElementsByClassName("screen-share-div")[0]) {
                    console.log("138")
                    let screen = document.getElementsByClassName("screen-share-div")[0]
                    document.getElementsByClassName("screen-share-div")[0].remove()
                    document.getElementById("bottom_div").appendChild(screen)
                    document.getElementsByClassName("screen-share-div")[0].style.width = "100%"
                }
                // if (document.getElementsByClassName("whiteboard-home")[0]) {
                //     let whiteboard = document.getElementsByClassName("whiteboard-home")[0]
                //     document.getElementsByClassName("whiteboard-home")[0].remove()
                //     document.getElementById("bottom_div").appendChild(whiteboard)
                //     // document.getElementsByClassName("screen-share-div")[0].style.width = "100%"

                // }
                console.log(document.getElementsByClassName("videoThumbnail").length + "  154")
                for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                    document.getElementsByClassName("videoThumbnail")[i].style.maxWidth = "100%"
                }
            } else {
                console.log("144")
                let alluser = document.getElementById("all_usersDiv")
                console.log(alluser + "   161")
                document.getElementById("bottom_div").innerHTML = ""
                document.getElementById("top_div").appendChild(alluser)
                console.log(document.getElementsByClassName("videoThumbnail").length + "   161")
                for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                    document.getElementsByClassName("videoThumbnail")[i].style.maxWidth = "100%"
                }
            }
        } catch (e) {
            console.log(e)
        }

    }, [isScreenShare, remoteStreams, isWhiteBoard])

    useEffect(() => {
        let myVideoDiv = document.getElementsByClassName("videoThumbnail")
        console.log("169")
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
                        myVideoDiv[i].style.height = "100%"
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
    }, [remoteStreams, isScreenShare, isWhiteBoard])




    return (
        <div className='videos_main'>
            <div id="top_div" style={top_div}
            // className="bor-r"
            >


                {isWhiteBoard ? <WhiteBoard /> : ""}

                {(isScreenShare === true) ? <ScreenShareThumbnail srcRef={screenRef} id={myPeerId} /> : ""}
                {/* <ScreenShareThumbnail scrRef={screenRef} id={myPeerId} /> */}

                <div id="all_usersDiv" className='all-users'>
                    <VideoThumbnail videoRef={myVideo} name={userName} id={myPeerId} micStatus={micStatus} camStatus={camStatus} isMeTalking={isMeTalking} />
                    {remoteStreams.map((peer, i) => (
                        <RemoteVideoThumbnail id={peer} remotePeer={remotePeersRef.current[i]} key={i} />
                    ))}
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
    return (
        <div className='screen-share-div' id={id + "-screen"}>
            <video playsInline muted ref={srcRef} autoPlay />
            {/* <p>{name}</p> */}
            {/* <span className='myMicSpan'>{(micStatus === "on") ? <MicNoneOutlined /> : <MicOffOutlined />}</span> */}
        </div>
    )
}

const remotePeerClick = () => {
    console.log("remote click")
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

const VideoThumbnail = ({ videoRef, name, micStatus, camStatus, id, isMeTalking }) => {
    return (
        <div className='videoThumbnail' id={id}>
            <video playsInline muted ref={videoRef} autoPlay />
            <p>{name}</p>
            <span className='myMicSpan' style={{ backgroundColor: isMeTalking ? "blue" : "black" }}>{(micStatus === "on") ? isMeTalking ? <GraphicEq /> : <MicNoneOutlined /> : <MicOffOutlined />}</span>
        </div>
    )
}

export default Videos