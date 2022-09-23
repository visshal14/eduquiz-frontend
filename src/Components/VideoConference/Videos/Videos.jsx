import React, { useEffect, useState, useRef } from 'react'
import "./Videos.css"
import { MicNoneOutlined, MicOffOutlined } from "@mui/icons-material"
import { useDataLayerValue } from "../DataLayer"
function Videos({ micStatus, camStatus }) {
    const { msgDisplay, userName, myPeerId, myVideo, remoteStreams, remotePeersRef, isScreenShare } = useDataLayerValue()
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
            if (isScreenShare) {
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
            if (isScreenShare) {
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




    }, [msgDisplay, isScreenShare, remoteStreams])

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

    // const { myVideo, remoteStreams, remotePeersRef } = useDataLayerValue()
    // useEffect(() => {
    //     console.log(remotePeersRef)
    // }, [remotePeersRef])
    useEffect(() => {

        if (isScreenShare) {
            let alluser = document.getElementById("all_usersDiv")
            document.getElementById("bottom_div").appendChild(alluser)
            document.getElementById("top_div").innerHTML = ""
            for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                document.getElementsByClassName("videoThumbnail")[i].style.maxWidth = "100%"
            }

        } else {
            let alluser = document.getElementById("all_usersDiv")
            document.getElementById("top_div").appendChild(alluser)
            document.getElementById("bottom_div").innerHTML = ""
            for (let i = 0; i < document.getElementsByClassName("videoThumbnail").length; i++) {
                document.getElementsByClassName("videoThumbnail")[i].style.maxWidth = "70%"
            }
        }
    }, [isScreenShare, remoteStreams])

    useEffect(() => {
        let myVideoDiv = document.getElementsByClassName("videoThumbnail")
        if (!myVideoDiv) return
        if (remoteStreams.length === 0 && !isScreenShare) {
            myVideoDiv[0].style.width = "100%"
            myVideoDiv[0].style.height = "100%"
            // 70% 70%

        } else if (remoteStreams.length === 1 && !isScreenShare) {
            for (let i = 0; i < myVideoDiv.length; i++) {

                myVideoDiv[i].style.width = "50%"
                myVideoDiv[i].style.height = "50%"
            }

            //50% 50%
        } else if (remoteStreams.length === 2 && !isScreenShare) {
            for (let i = 0; i < myVideoDiv.length; i++) {

                myVideoDiv[i].style.width = "30%"
                myVideoDiv[i].style.height = "30%"
            }
            console.log("103 3")
            //30% 30%
        } else {
            if (!isScreenShare) {
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
                // else{
                //     for (let i = 0; i < myVideoDiv.length; i++) {
                //         // myVideoDiv[i].style.width = "100%"
                //         myVideoDiv[i].style.height = "100%"
                //     }
                // }

            }

            // 25%
        }
    }, [remoteStreams, isScreenShare])




    return (
        <div className='videos_main'>
            <div id="top_div" style={top_div} className="bor-r">
                <div id="all_usersDiv" className='all-users'>
                    <VideoThumbnail videoRef={myVideo} name={userName} id={myPeerId} micStatus={micStatus} camStatus={camStatus} />
                    {remoteStreams.map((peer, i) => (
                        <RemoteVideoThumbnail id={peer} remotePeer={remotePeersRef.current[i]} key={i} />
                    ))}
                </div>
            </div>
            <div id="bottom_div" style={bottom_div} className="bor-y">

            </div>
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
        //comment
        // eslint-disable-next-line
    }, [])
    return (
        <div className='videoThumbnail' id={id.id}>
            <video playsInline onClick={remotePeerClick} ref={tempRef} autoPlay />
            <p>{id.name}</p>
            <span className='myMicSpan'>{(id.micStatus === "on") ? <MicNoneOutlined /> : <MicOffOutlined />}</span>
        </div>

    )
}

const VideoThumbnail = ({ videoRef, name, micStatus, camStatus, id }) => {
    return (
        <div className='videoThumbnail' id={id}>
            <video playsInline muted ref={videoRef} autoPlay />
            <p>{name}</p>
            <span className='myMicSpan'>{(micStatus === "on") ? <MicNoneOutlined /> : <MicOffOutlined />}</span>
        </div>
    )
}

export default Videos