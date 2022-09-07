import React, { useEffect, useState, useRef } from 'react'
import "./Videos.css"
import { useDataLayerValue } from "../DataLayer"
function Videos() {
    const { msgDisplay } = useDataLayerValue()



    const [topDivStyle, setTopDivStyle] = useState({
        order: "",
        width: "",
        height: "",
    })
    const [bottomDivStyle, setBottomDivStyle] = useState({
        order: "",
        width: "",
        height: "",
    })
    useEffect(() => {
        if (msgDisplay === "none") {
            setTopDivStyle({
                order: "1",
                width: "80%",
                height: "100%",
            })
            setBottomDivStyle({
                order: "2",
                width: "19%",
                height: "100%",
            })
        } else {
            setTopDivStyle({
                order: "2",
                width: "100%",
                height: "80%",
            })
            setBottomDivStyle({
                order: "1",
                width: "100%",
                height: "20%",
            })
        }
    }, [msgDisplay])

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
    }

    const { myVideo, mediaStream, remotePeers } = useDataLayerValue()

    const remotePeerRef = useRef([])
    useEffect(() => {

        console.log(remotePeerRef)

    }, [remotePeerRef])
    return (
        <div className='videos_main'>
            <div id="top_div" style={top_div} className="bor-r">
                <VideoThumbnail videoRef={myVideo} />
                {remotePeers.map((peer, i) => (
                    <RemoteVideoThumbnail remotePeer={peer} key={i} />
                ))}

            </div>
            <div id="bottom_div" style={bottom_div} className="bor-y">

                {/* <video playsInline muted ref={remotePeerRef} autoPlay className="myVideo" /> */}


                {/* {remotePeers.map((peer, i) => (
                    <RemoteVideoThumbnail remotePeer={() => remotePeerRef.current[i].srcObject = peer} key={i} />
                ))} */}
            </div>
        </div>
    )
}
const RemoteVideoThumbnail = ({ remotePeer }) => {
    console.log(remotePeer)

    // refName = React.createRef()
    // refName.current.srcObject = remotePeer


    return (
        <video playsInline muted ref={videoRef} autoPlay className="myVideo" />
    )
}
const VideoThumbnail = ({ videoRef }) => {
    return (

        <video playsInline muted ref={videoRef} autoPlay className="myVideo" />
    )
}

export default Videos