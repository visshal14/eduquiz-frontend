import React, { useState, createContext, useContext, useEffect, useReducer, useRef } from "react"
import reducer, { initialState } from './reducer';
import { Peer } from "peerjs";
import { io } from "socket.io-client";




const socket = io.connect("http://localhost:4000", {
    forceNew: true,
    transports: ["polling"],
});
// const socket = io.connect("https://eduquiz001.onrender.com", {
//     // forceNew: true,
//     // transports: ["polling"],
// });



export const DataLayerContext = createContext()



export const DataLayer = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [myStream, setMyStream] = useState();
    const [myPeer, setMyPeer] = useState()
    const [remoteStreams, setRemoteStreams] = useState([])
    const [isMeTalking, setIsMeTalking] = useState(false)
    const isMeTalking2 = useRef()


    const myVideo = useRef()
    const remotePeersRef = useRef([])
    const screenRef = useRef()
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;





    // const audioCtx = useRef()
    // const analyser = useRef()
    // const volumeDataArray = useRef()
    // const myAudio = useRef()
    // const tempStream = useRef()




    // const bufferLength = analyser.frequencyBinCount;
    // const dataArray = new Uint8Array(bufferLength);
    // analyser.getByteTimeDomainData(dataArray);




    useEffect(() => {
        const peer = new Peer(undefined, {
            path: "/peerjs",
            host: "localhost",
            port: "4000",
            // host: "eduquiz001.onrender",
            // port: "443",
            // secure: true,
            config: peerServerList
        })
        setMyPeer(peer)
        // updateMyPeer(peer)
        // socket.on("port", (e) => {
        //     console.log(e)
        // })
    }, [])





    const [answers, setAnswers] = useState([])
    useEffect(() => {
        myPeer?.on("open", (id) => {
            updateMyPeer(id)
            // console.log("My peer: ", id)
            socket.emit("join-roomF", state.roomId, id, state.userName)
        })
        if (myPeer) {
            getUserMedia({ audio: true, video: true },
                function (stream) {

                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 2048;
                    let microphone = audioCtx.createMediaStreamSource(stream);
                    microphone.connect(analyser);


                    const newTrack = black()
                    const dummyAudioTrack = silence()
                    stream.addTrack(newTrack)
                    stream.addTrack(dummyAudioTrack)
                    setMyStream(stream)

                    myVideo.current.srcObject = stream
                    if (myStream) myStream.getTracks()[2].enabled = false





                    // microphone.connect(audioCtx.destination)

                    setInterval(isUserTalking, 500)

                    function isUserTalking() {
                        let volumeDataArray = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteTimeDomainData(volumeDataArray);
                        analyser.getByteFrequencyData(volumeDataArray);

                        let sum = 0
                        for (const amplitude of volumeDataArray) {
                            sum += amplitude * amplitude
                        }
                        const volume = Math.sqrt(sum / volumeDataArray.length)

                        if (volume > 20) {
                            // console.log("talking  " + volume)
                            if (!isMeTalking2.current) {
                                setIsMeTalking(true)
                                isMeTalking2.current = true
                            }
                        } else {
                            if (isMeTalking2.current) {
                                setIsMeTalking(false)
                                isMeTalking2.current = false
                            }
                        }
                    }



                    myPeer?.on("call", (call) => {

                        setAnswers(answers => [...answers, call])
                        call.answer(stream)
                        let id;
                        call.on("stream", (userVideoStream) => {
                            if (id !== userVideoStream) {
                                id = userVideoStream
                                remotePeersRef.current.push(userVideoStream)
                                setRemoteStreams(remoteStreams => [...remoteStreams, { "stream": userVideoStream, "id": call.metadata.tempPeer, "name": call.metadata.tempName, "micStatus": call.metadata.myMic, isTalking: "" }])
                            }
                        })
                    })
                    myPeer?.on("close", () => {
                        socket.emit("user-disconnect", myPeer?._id)
                    })

                    socket.on("user-connectedF", (remotePeerId, remotePeerName) => {
                        setTimeout(connectToNewUser, 2000, remotePeerId, stream, state.roomId, remotePeerName, state.myPeer)
                    })

                }, function (err) {
                    console.log(err)
                })


        }
        // eslint-disable-next-line
    }, [myPeer])












    useEffect(() => {
        // console.log("change")
        socket.emit("meTalkingToSocket", isMeTalking, myPeer?._id)
        // eslint-disable-next-line
    }, [isMeTalking])

    socket.on("meTalkingToClient", (isRemoteTalking, peerId) => {
        // setSocketOtherChat(chat)
        // console.log(isRemoteTalking, "    " + id)
        setRemoteStreams(remoteStreams.map(item =>
            (item.id === peerId) ? { ...item, isTalking: isRemoteTalking } : item
        ))
    })




    const [callers, setCallers] = useState([])
    function connectToNewUser(userId, stream, roomId, remoteName) {


        const tempName = state.userName
        const tempPeer = myPeer?._id
        const myMic = state.micStatus

        console.log(state)
        let call = myPeer?.call(userId, stream, { metadata: { tempName, tempPeer, myMic } })
        setCallers(callers => [...callers, call])
        let id;
        call?.on("stream", (userVideoStream) => {

            if (id !== userVideoStream) {
                id = userVideoStream;

                remotePeersRef.current.push(userVideoStream)
                // remotePeersRef.srcObject = userVideoStream
                setRemoteStreams(remoteStreams => [...remoteStreams, { "stream": userVideoStream, "id": userId, "name": remoteName, "micStatus": "on", isTalking: "" }])

            }


        })
        call?.on("error", (error) => {
            console.log("err in call 174", error)
        })
        call?.on("close", () => {
            console.log("close")
            socket.emit("user-disconnect", userId)
            // try {
            //     if (document.getElementById(userId)) {
            //         document.getElementById(userId).remove()
            //     }

            //     video.remove()
            // } catch (e) {

            // }

        })
        // peers[userId] = call

    }

    // useEffect(() => {
    //     console.log(isMeTalking)
    // }, [isMeTalking])

    useEffect(() => {
        socket.emit("whiteboardOnOffToServer", state.isWhiteBoard)
    }, [state.isWhiteBoard])

    const updateMyPeer = (peer) => {
        dispatch({
            type: "SET_PEER",
            peer: peer
        })
    }

    const updateNameReducer = (name) => {
        dispatch({
            type: "SET_NAME",
            userName: name
        })
    }
    const updateMsgDisplayReducer = (msgDis) => {
        dispatch({
            type: "SET_MSGDIS",
            msgDis: msgDis
        })
    }
    const updateRoomIdReducer = (roomId) => {
        dispatch({
            type: "SET_ROOMID",
            roomId: roomId
        })
    }
    const updateIsScreenShare = (data) => {

        dispatch({
            type: "SET_SCREENSHARE",
            screenShare: data
        })
        socket.emit("screenShareToSocket", data, myPeer?._id)
    }

    const updateMicStatus = (data) => {
        dispatch({
            type: "SET_MICSTATUS",
            mic: data
        })
    }
    const updateCamStatus = (data) => {
        dispatch({
            type: "SET_CAMSTATUS",
            mic: data
        })
    }
    const updateMyScreenShareStatus = (data) => {
        dispatch({
            type: "SET_MYSCREEN",
            screen: data
        })
        // screenShareFunction()
    }
    const updateIsHost = (data) => {
        dispatch({
            type: "SET_HOST",
            host: data
        })
    }
    const updateWhiteBoard = (data) => {
        dispatch({
            type: "SET_WHITEBOARD",
            whiteboard: data
        })
    }
    const updateEmail = (data) => {
        dispatch({
            type: "SET_EMAIL",
            email: data
        })
    }
    const updateRoomDetail = (data) => {
        dispatch({
            type: "SET_ROOMDETAIL",
            roomDetail: data
        })
    }

    const [socketOtherChat, setSocketOtherChat] = useState()

    socket.on("msgSent", (chat) => {
        setSocketOtherChat(chat)
    })
    const msgSentThoughtSocket = (chat) => {
        socket.emit("msgThoughSocket", (chat))
    }
    useEffect(() => {

        socket.on("whiteboardOnOffToClient", (data) => {
            dispatch({
                type: "SET_WHITEBOARD",
                whiteboard: data
            })
            console.log(data)
        })
        socket.on("updateHostForWhiteboardToClient", (data) => {
            dispatch({
                type: "SET_HOST",
                host: data
            })
        })



    }, [])


    socket.on("screenShareToClient", async (data, id) => {
        try {

            const videoTrack = screenStream?.getTracks()?.find(track => track.kind === "video")
            videoTrack?.stop()
            updateMyScreenShareStatus(false)
        } catch (e) {

        }
        dispatch({
            type: "SET_SCREENSHARE",
            screenShare: data
        })
        // const screenDiv = document.getElementsByClassName("screen-share-div")[0]
        // console.log(screenDiv)
        // if (screenDiv) {
        //     screenDiv?.forEach(div => {
        //         div.remove()
        //     })
        // }


        const track = document.getElementById(id).firstChild.srcObject

        const newStream = new MediaStream([track.getTracks()[3]])
        setTimeout(() => {
            try {
                screenRef.current.srcObject = newStream
            } catch (e) { }

        }, 2000)


    })
    const btnScreenShare = () => {
        if (!state.myScreenShare) {
            screenShareFunction()
        } else {
            if (document.getElementById(myPeer?._id + "-screen")) {
                const videoTrack = screenStream?.getTracks()?.find(track => track.kind === "video")
                videoTrack.stop()
                // document.getElementById(myPeer?._id + "-screen").remove()
            }

        }
    }


    const [screenStream, setScreenStream] = useState()


    const screenShareFunction = () => {
        navigator.mediaDevices.getDisplayMedia({
            video: {
                width: { ideal: 4096 },
                height: { ideal: 2160 },
                frameRate: { ideal: 60, max: 120 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
            },
        }).then((stream) => {
            // screenShareOn = true
            setScreenStream(stream)
            let videoTrack = stream.getVideoTracks()[0];
            let audioTrack = stream.getAudioTracks()[0]
            // let allTrack = stream.getTracks()

            // myStream.getTracks()[2].enabled = true
            // console.log(myStream.getTracks()[3])
            // console.log(myStream.getTracks()[1])


            callers.forEach(call => {
                call.peerConnection.getSenders()[3].replaceTrack(videoTrack)
                call.peerConnection.getSenders()[1].replaceTrack(audioTrack)
            })
            answers.forEach(call => {
                call.peerConnection.getSenders()[3].replaceTrack(videoTrack)
                call.peerConnection.getSenders()[1].replaceTrack(audioTrack)
            })
            // call.peerConnection.getSenders()[1].replaceTrack(videoTrack)
            // document.getElementById("all-users").style.width = "20%"
            try {
                screenRef.current.srcObject = stream
            } catch (e) { }


            // const div = document.createElement("div")
            // div.id = myPeer?._id + "-screen"
            // const video = document.createElement("video")
            // video.srcObject = stream
            // video.onloadedmetadata = function (e) {
            //     video.play()
            // }
            // div.className = "screen-share-div"
            // div.append(video)
            // document.getElementById("top_div").append(div)




            // document.getElementsByClassName("video-div")[0].insertBefore(div, document.getElementsByClassName("video-div")[0].children[0])
            // videoThumbailsChange(screenShareOn = true)
            // document.getElementById("screenShareBtn").className = "call-btnOn"
            // socket.emit("screenShareOnToServer", peerIDMain)


        }).catch((e) => {
            // console.log(e)
            updateMyScreenShareStatus(false)
            updateIsScreenShare(false)

        })
    }





    const [tempRemoteStream, setTempRemoteStream] = useState()
    socket.on("user-disconnect", (userId) => {
        try {
            if (document.getElementById(userId)) {
                document.getElementById(userId).remove()
            }
            setTempRemoteStream(tempRemoteStream.filter(item => item.id !== userId))
        } catch (e) { }
    })
    useEffect(() => {
        setTempRemoteStream(remoteStreams)
    }, [remoteStreams])

    const socketMicOnOff = (position) => {
        socket.emit("userMicToServer", position, state.myPeer)
        const audioTrack = myStream?.getTracks().find(track => track.kind === "audio")
        if (audioTrack?.enabled) {
            audioTrack.enabled = false;
        } else {
            if (audioTrack) {
                audioTrack.enabled = true;
            }
        }
    }
    socket.on("userMicToClient", (position, peerId) => {
        setRemoteStreams(remoteStreams.map(item =>
            (item.id === peerId) ? { ...item, micStatus: position } : item
        ))
    })
    const newVideo = () => {
        try {
            getUserMedia({ video: true },
                function (stream) {
                    myStream?.removeTrack(myStream.getAudioTracks()[1])
                    myStream?.getTracks().forEach(track => {
                        if (track.kind === "video") {
                            myStream.removeTrack(track)
                        }
                    })
                    myStream?.addTrack(silence())
                    myStream?.addTrack(stream.getVideoTracks()[0])
                    myStream?.addTrack(black())

                    callers?.forEach(call => {

                        call.peerConnection.getSenders()[2].replaceTrack(stream.getVideoTracks()[0])
                    })
                    answers?.forEach(call => call.peerConnection.getSenders()[2].replaceTrack(stream.getVideoTracks()[0]))
                })
        } catch (e) {
            console.log(e)
        }
    }

    const camOnOffToSocket = () => {
        try {
            const videoTrack = myStream?.getTracks()?.find(track => track.kind === "video")
            if (videoTrack?.enabled) {
                videoTrack.enabled = false;
                videoTrack.stop()
                callers.forEach(call => call.peerConnection.getSenders()[2].replaceTrack(black()))
                answers.forEach(call => call.peerConnection.getSenders()[2].replaceTrack(black()))
            } else {
                // console.log("else")
                newVideo()
                if (videoTrack) {
                    videoTrack.enabled = true;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const leave_button = () => {
        socket.close();
        window.location.href = "/room-selection/id/p"
    }


    const newElementsToOther = (ele, setElements) => {
        console.log("new 17")
        socket.emit("newElementsToSocketServer", ele)

    }

    const updateElementsToOther = (ele, elementId, setElements, elementType) => {
        socket.emit("updateElementToSocketServer", ele, elementId, elementType)
    }
    const updateHostForWhiteboard = (data) => {
        socket.emit("updateHostForWhiteboardSocketServer", data)
    }





    const value = {
        remotePeersRef,
        remoteStreams,
        myStream,
        myVideo,
        screenRef,
        msgDisplay: state.msgDisplay,
        userName: state.userName,
        isScreenShare: state.isScreenShare,
        socketOtherChat,
        myPeerId: state.myPeer,
        micStatus: state.micStatus,
        camStatus: state.camStatus,
        myScreenShare: state.myScreenShare,
        myEmail: state.email,
        isHost: state.isHost,
        isWhiteBoard: state.isWhiteBoard,
        roomDetail: state.roomDetail,
        updateMsgDisplayReducer,
        updateNameReducer,
        updateRoomIdReducer,
        msgSentThoughtSocket,
        updateIsScreenShare,
        socketMicOnOff,
        updateMicStatus,
        updateCamStatus,
        camOnOffToSocket,
        updateMyScreenShareStatus,
        updateIsHost,
        updateEmail,
        updateRoomDetail,
        btnScreenShare,
        leave_button,
        updateWhiteBoard,
        updateHostForWhiteboard,
        isMeTalking,
        newElementsToOther,
        updateElementsToOther,
        socket
        // isRecording,
        // recordingStart,
        // recordingStop
    }





    return (
        <DataLayerContext.Provider value={value}>
            {children}
        </DataLayerContext.Provider>
    )
}
export const useDataLayerValue = () => useContext(DataLayerContext)


let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    // console.log(black)
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
}


let silence = () => {
    let ctx = new AudioContext(), oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
}

const peerServerList = {
    'iceServers': [
        {
            urls: "stun:openrelay.metered.ca:80"
        },
        {
            urls: "turn:numb.viagenie.ca",
            username: "vp29122002@gmail.com",
            credential: "webrtc"
        },
        {
            urls: "turn:numb.viagenie.ca:443",
            username: "fewaji8087@wodeda.com",
            credential: "Qwerty@123"
        },
        {
            urls: "turn:numb.viagenie.ca:443?transport=tcp",
            username: "fewaji8087@wodeda.com",
            credential: "Qwerty@123"
        },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ]
}