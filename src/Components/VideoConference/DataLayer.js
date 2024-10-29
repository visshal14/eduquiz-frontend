import React, { useState, createContext, useContext, useEffect, useReducer, useRef } from "react"
import reducer, { initialState } from './reducer';
import { Peer } from "peerjs";
import { io } from "socket.io-client";
import { backendUrl, peerPort, peerSecure } from "../../frontendUrl"
// import soundPng from "./pngimg.com - sound_PNG36.png"



//socket connection to backend
// const socket = io.connect("http://localhost:4000", {
//     forceNew: true,
//     transports: ["polling"],
// });
const socket = io.connect(backendUrl, {
    // forceNew: true,
    // transports: ["polling"],
});



export const DataLayerContext = createContext()



export const DataLayer = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState) // reducer state
    const [myStream, setMyStream] = useState();// my videa and audio stream
    const [myPeer, setMyPeer] = useState() // my peer 
    const [remoteStreams, setRemoteStreams] = useState([]) // remote users stream
    const [isMeTalking, setIsMeTalking] = useState(false) // toggle when speaking
    const isMeTalking2 = useRef() // ref for talking
    const [whiteboardElements, setWhiteboardElements] = useState([]) // whiteboard element (line,rectangle, circle,etc)
    const [imageArray, setImageArray] = useState([]) // image on whiteboard


    const myVideo = useRef() // to show my video on NewVideo.jsx
    const remotePeersRef = useRef([]) // to show remote video on NewVideo.jsx
    const [whiteboardHostOther, setWhiteboardHostOther] = useState(false) // permission to give remote user to use whiteboard
    const screenRef = useRef()// screenshare video
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    const stateRef = useRef(null)
    const whiteboardElementsRef = useRef(null)

    const micRef = useRef(null)
    const camRef = useRef(null)


    const [topDivElement, setTopDivElement] = useState() // either users,screenshare or whiteboard
    const canvasRef = useRef()
    const whiteboardRef = useRef()

    const recordAudioStream = useRef() // for recording



    const talkingRemoteRef = useRef([])
    // const audioCtx = useRef()
    // const analyser = useRef()
    // const volumeDataArray = useRef()
    // const myAudio = useRef()
    // const tempStream = useRef()




    // const bufferLength = analyser.frequencyBinCount;
    // const dataArray = new Uint8Array(bufferLength);
    // analyser.getByteTimeDomainData(dataArray);




    useEffect(() => {
        whiteboardElementsRef.current = whiteboardElements
    }, [whiteboardElements])

    useEffect(() => {
        // to switch on or off whiteboard
        socket.emit("whiteboardOnOffToServer", state.isWhiteBoard)
    }, [state.isWhiteBoard])

    useEffect(() => {
        //current state ref
        stateRef.current = {
            whiteboard: state.isWhiteBoard,
            whiteboardHost: whiteboardHostOther,
            screenshare: state.myScreenShare,
            mic: state.micStatus
        }
        // eslint-disable-next-line
    }, [state.isWhiteBoard, state.isScreenShare, state.micStatus, whiteboardHostOther])



    useEffect(() => {
        // initiate peer https://peerjs.com/docs/
        const peer = new Peer(undefined, {
            path: "/peerjs",
            // host: "localhost",
            // port: "4000",
            // host: backendUrl.replace("https://", ""),
            host: backendUrl.includes("localhost") ? backendUrl.replace("http://", "").replace(":4000", "") : backendUrl.replace("https://", ""),

            port: peerPort,
            secure: peerSecure,
            config: peerServerList
        })
        setMyPeer(peer)
        // updateMyPeer(peer)
        // socket.on("port", (e) => {
        //     console.log(e)
        // })
    }, [])


    // useEffect(() => {

    // }, [whiteboardElements])






    const [answers, setAnswers] = useState([])

    const recordAudioContext = useRef(null)
    const recordingAudioDest = useRef(null)
    useEffect(() => {
        myPeer?.on("open", (id) => {
            updateMyPeer(id)
            // console.log("My peer: ", id)
            //join room when peer open
            socket.emit("join-roomF", state.roomId, id, state.userName)
        })
        if (myPeer) {
            getUserMedia({ audio: true, video: true },
                function (stream) {

                    socket.emit("mediaStreamIdToSocket", stream.id)

                    //start - for mic visualizer
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 2048;
                    let microphone = audioCtx.createMediaStreamSource(stream);
                    microphone.connect(analyser);

                    //end 


                    //start - for recording audio
                    let x = new MediaStream(stream.getAudioTracks())
                    recordAudioStream.current = x

                    // console.log(x.getTracks())
                    // console.log("-----------------------")


                    recordAudioStream.current.addTrack(stream.getAudioTracks()[0])

                    const recordingAudioContext = new AudioContext();


                    let audioIn_02 = recordingAudioContext.createMediaStreamSource(recordAudioStream.current);
                    let tempDest = recordingAudioContext.createMediaStreamDestination();

                    recordAudioContext.current = recordingAudioContext
                    recordingAudioDest.current = tempDest
                    audioIn_02.connect(recordingAudioDest.current);
                    //end 


                    //start - additional mediatrack for screenshare
                    const newTrack = black()
                    const dummyAudioTrack = silence()
                    stream.addTrack(newTrack)
                    stream.addTrack(dummyAudioTrack)
                    setMyStream(stream)

                    myVideo.current.srcObject = stream
                    if (myStream) myStream.getTracks()[2].enabled = false





                    // microphone.connect(audioCtx.destination)

                    setInterval(isUserTalking, 500)


                    //function for audio frequency if frequency is more then threshold than isMeTalking true
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


                    //refer to peer.js docs
                    myPeer?.on("call", (call) => {

                        setAnswers(answers => [...answers, call])
                        call.answer(stream)
                        //update mic and cam status after answer a call because answer doesnt contain metadata
                        setTimeout(micCamUpdateServer, 2000)
                        let id;
                        call.on("stream", (userVideoStream) => {
                            if (id !== userVideoStream) {
                                id = userVideoStream
                                remotePeersRef.current.push(userVideoStream)
                                // console.log(call.metadata)

                                setRemoteStreams(remoteStreams => [...remoteStreams, { "stream": userVideoStream, "id": call.metadata.tempPeer, "name": call.metadata.tempName, "micStatus": call.metadata.myMic, "camStatus": call.metadata.myCam, isTalking: "", "screenshare": call.metadata.myScreenshare, "whiteboard": call.metadata.myWhiteboard.isWhiteBoard }])
                                if (call.metadata.myWhiteboard.isWhiteboard) {
                                    // console.log("call")
                                    updateWhiteBoard(call.metadata.myWhiteboard.isWhiteboard)
                                    setTimeout(setWhiteboardElements, 1000, call.metadata.myWhiteboard.elements)
                                    updateIsHost(call.metadata.myWhiteboard.isHost)
                                }
                                if (call.metadata.myScreenshare) {



                                    // const track = document.getElementById(id).firstChild.srcObject

                                    const newStream = new MediaStream([userVideoStream.getTracks()[3]])
                                    // console.log(newStream)
                                    setTimeout(() => {
                                        try {
                                            // console.log(screenRef.current.srcObject)
                                            screenRef.current.srcObject = newStream
                                            // console.log(screenRef.current.srcObject)
                                        } catch (e) { }

                                    }, 2000)

                                    // console.log(call.metadata.myScreenshare + "   screen  call")
                                    dispatch({
                                        type: "SET_SCREENSHARE",
                                        screenShare: call.metadata.myScreenshare
                                    })



                                }
                            }
                        })
                    })
                    myPeer?.on("close", () => {
                        socket.emit("user-disconnect", myPeer?._id)
                    })
                    //when new user connected
                    socket.on("user-connectedF", (remotePeerId, remotePeerName) => {



                        // console.log("new user")
                        setTimeout(connectToNewUser, 2000, remotePeerId, stream, state.roomId, remotePeerName, state.myPeer)
                        setTimeout(micCamUpdateServer, 4000)
                    })

                }, function (err) {
                    console.log(err)
                })


        }
        // eslint-disable-next-line
    }, [myPeer])

    useEffect(() => {
        micRef.current = state.micStatus
        camRef.current = state.camStatus
    }, [state.micStatus, state.camStatus])

    function micCamUpdateServer() {
        socket.emit("userCamMicUpdateToServer", micRef.current, camRef.current)
    }


    socket.on("userCamMicUpdateToClient", (userId, mic, cam) => {
        // setSocketOtherChat(chat)
        // console.log(isRemoteTalking, "    " + id)
        setRemoteStreams(remoteStreams.map(item =>
            (item.id === userId) ? { ...item, micStatus: mic, camStatus: cam } : item
        ))



    })








    useEffect(() => {


        socket.emit("meTalkingToSocket", isMeTalking, myPeer?._id, state.userName)

        // eslint-disable-next-line
    }, [isMeTalking])




    // let remoteStreamsRef = useRef()
    useEffect(() => {
        socket.on("meTalkingToClient", (isRemoteTalking, peerId, name) => {
            // setSocketOtherChat(chat)
            // console.log("change   " + peerId)
            // console.log(isRemoteTalking, "    " + peerId)
            if (talkingRemoteRef.current.length < 1) {
                talkingRemoteRef.current.push({ peerId, name })
            } else {

                talkingRemoteRef.current.forEach((ele, i) => {
                    if (ele.peerId === peerId && !isRemoteTalking) {
                        talkingRemoteRef.current.splice(i, 1)
                    } else if ((i === talkingRemoteRef.current.length - 1) && ele.peerId !== peerId && isRemoteTalking) {
                        talkingRemoteRef.current.push({ peerId, name })
                    }
                })
            }

            setRemoteStreams(x => x.map(item =>
                (item.id === peerId) ? { ...item, isTalking: isRemoteTalking } : item
            ))
            // console.log("remote streams :- " + remoteStreamsRef.current.length)
            console.log(talkingRemoteRef.current)


        })

    }, [])

    // useEffect(() => {
    //     remoteStreamsRef.current = remoteStreams
    // }, [remoteStreams])



    // socket.on("meTalkingToClient", (isRemoteTalking, peerId) => {
    //     // setSocketOtherChat(chat)
    //     console.log("change   " + peerId)
    //     // console.log(isRemoteTalking, "    " + id)
    //     // if (talkingRemoteRef.current.length < 1) {
    //     //     talkingRemoteRef.current.push(peerId)
    //     // } else {

    //     //     talkingRemoteRef.current.forEach((ele, i) => {
    //     //         if (ele === peerId && !isRemoteTalking) {
    //     //             talkingRemoteRef.current.splice(i, 1)
    //     //         } else if ((i === talkingRemoteRef.current.length - 1) && ele !== peerId && isRemoteTalking) {
    //     //             talkingRemoteRef.current.push(peerId)
    //     //         }
    //     //     })
    //     // }

    //     setRemoteStreams(remoteStreams.map(item =>
    //         (item.id === peerId) ? { ...item, isTalking: isRemoteTalking } : item
    //     ))

    //     // console.log(talkingRemoteRef.current)

    // })





    const [callers, setCallers] = useState([])

    function connectToNewUser(userId, stream, roomId, remoteName) {


        const tempName = state.userName
        const tempPeer = myPeer?._id
        const myMic = state.micStatus
        const myCam = state.camStatus
        // console.log(stateRef.current)
        const myWhiteboard = { isWhiteboard: stateRef.current.whiteboard, elements: whiteboardElementsRef.current, isHost: stateRef.current.whiteboardHost }
        // const myScreenshare = stateRef.current.screenshare
        // const tempState = state.isWhiteBoard

        let myScreenshare = stateRef.current.screenshare

        // console.log(myWhiteboard)
        // console.log(tempPeer)

        //call to new user
        let call = myPeer?.call(userId, myVideo.current.srcObject, { metadata: { tempName, tempPeer, myMic, myWhiteboard, myScreenshare, myCam } })
        setCallers(callers => [...callers, call])
        let id;

        call?.on("stream", (userVideoStream) => {

            if (id !== userVideoStream) {
                id = userVideoStream;

                remotePeersRef.current.push(userVideoStream)


                //connect remote audio to recordAudioStream for recording
                const tempAudioMediaStream = new MediaStream([userVideoStream.getAudioTracks()[0]])
                let audioIn_01 = recordAudioContext.current.createMediaStreamSource(tempAudioMediaStream);


                // recordingAudioDest.current = recordAudioContext.current.createMediaStreamDestination();

                audioIn_01.connect(recordingAudioDest.current);


                // console.log(recordAudioStream.current.getTracks())
                // remotePeersRef.srcObject = userVideoStream
                setRemoteStreams(remoteStreams => [...remoteStreams, { "stream": userVideoStream, "id": userId, "name": remoteName, "micStatus": "on", isTalking: "", "screenshare": myScreenshare, "whiteboard": myWhiteboard, "camStatus": "on" }])

            }


        })
        call?.on("error", (error) => {
            console.log("err in call 174", error)
        })
        call?.on("close", () => {
            // console.log("close")
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
    const updateRemoteAccess = (data) => {
        dispatch({
            type: "SET_REMOTEACCESS",
            remoteAccess: data
        })
    }

    const updateCurrentRemoteAccessUser = (data) => {
        dispatch({
            type: "SET_CURRENTREMOTEACCESSUSER",
            remoteAccess: data
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
            // console.log(data)
        })
        socket.on("updateHostForWhiteboardToClient", (data) => {
            dispatch({
                type: "SET_HOST",
                host: data
            })
        })



    }, [])

    const [currentScreenShareId, setCurrentScreenShareId] = useState("")
    socket.on("screenShareToClient", async (data, id) => {
        updateRemoteAccess(false)
        try {

            const videoTrack = screenStream?.getTracks()?.find(track => track.kind === "video")
            videoTrack?.stop()
            updateMyScreenShareStatus(false)
            setCurrentScreenShareId("")
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
        setCurrentScreenShareId(id)
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
            // let tempStream = myStream


            // myVideo.current.srcObject.getVideoTracks()[1].replaceTrack(videoTrack)
            // console.log(myVideo.current.srcObject.getVideoTracks()[1])


            // replace track on mediaStream
            myVideo.current.srcObject.removeTrack(myVideo.current.srcObject.getVideoTracks()[1])
            myVideo.current.srcObject.addTrack(videoTrack)

            let tempStream = myStream

            tempStream.removeTrack(myStream.getVideoTracks()[1])
            tempStream.addTrack(videoTrack)

            setMyStream(tempStream)


            // replace track on mediaStream of caller and answer
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
                setCurrentScreenShareId(state.myPeer)
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
    const [totalParticipant, setTotalParticipant] = useState([])
    useEffect(() => {


        socket.on("user-disconnect", (userId, mediaStreamId) => {
            try {
                if (document.getElementById(userId)) {
                    // console.log(document.getElementById(userId))
                    document.getElementById(userId)?.remove()


                    if (document.getElementById(userId + "-screen")) {
                        updateIsScreenShare(false)

                        screenRef.current = null
                    }
                }

                // console.log(mediaStreamId)
                // console.log(remotePeersRef.current[0].id + "    " + mediaStreamId)
                let tempRemotePeerIndex = false
                // eslint-disable-next-line 
                remotePeersRef.current.map((ele, i) => {
                    if (ele.id === mediaStreamId) {
                        tempRemotePeerIndex = i
                    }
                })
                if (!tempRemotePeerIndex) {
                    remotePeersRef.current.splice(tempRemotePeerIndex, 1)
                }

                // remotePeersRef.current.filter(item => item.id !== mediaStreamId)

                // setRemoteStreams(remoteStreams.filter(item => item.id !== userId))
                // console.log(remotePeersRef.current)
                // remotePeersRef.current.filter(item => item.id !== mediaStreamId)
                // console.log(userId)
                // talkingRemoteRef.current.filter(item => item !== userId)
                setTotalParticipant(totalParticipant.filter(item => item.id !== userId))
                setTempRemoteStream(tempRemoteStream.filter(item => item.id !== userId))
            } catch (e) { }
        })
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        setTempRemoteStream(remoteStreams)
        setTotalParticipant(remoteStreams)

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

    useEffect(() => {
        socket.emit("userCamToServer", state.camStatus, state.myPeer)
        // console.log("change  " + state.camStatus)
        // eslint-disable-next-line
    }, [state.camStatus])

    socket.on("userCamToClient", (position, peerId) => {
        setRemoteStreams(remoteStreams.map(item =>
            (item.id === peerId) ? { ...item, camStatus: position } : item
        ))
    })

    socket.on("userMicToClient", (position, peerId) => {
        setRemoteStreams(remoteStreams.map(item =>
            (item.id === peerId) ? { ...item, micStatus: position } : item
        ))
    })

    //function to get new video stream after off beacuse 
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
        window.location.href = "/"
    }


    const newElementsToOther = (ele, setElements) => {

        socket.emit("newElementsToSocketServer", ele)

    }

    const newImageToserver = (data, id) => {
        // console.log(data)

        socket.emit("newImageToServer", data.src, id)
    }

    const updateElementsToOther = (ele, elementId, setElements, elementType) => {
        socket.emit("updateElementToSocketServer", ele, elementId, elementType)
    }
    const updateHostForWhiteboard = (data) => {
        setWhiteboardHostOther(data)
        socket.emit("updateHostForWhiteboardSocketServer", data)
    }

    const [remotePermission, setRemotePermission] = useState(false)


    const requestRemoteControl = () => {
        socket.emit("requestRemoteControlToServer")
    }
    const [isPendingRequest, setIsPendingRequest] = useState()

    useEffect(() => {
        //beta - request control
        socket.on("requestRemoteControlToClient", (id) => {
            // console.log(id)
            // console.log(remoteStreams)
            totalParticipant?.every((ele) => {
                // console.log(ele.id + "   " + id)
                if (ele.id === id) {
                    setIsPendingRequest({
                        id: ele.id,
                        name: ele.name
                    })
                    return false
                }
                return true

            })

            setTimeout(() => {
                setIsPendingRequest()
            }, 5000)
        })
        // eslint-disable-next-line
    }, [totalParticipant])

    //start - remote control
    const remoteRequestAllowCancel = (action) => {
        console.log(action)
        if (action === "cancel") return setIsPendingRequest()

        if (action === "allow") {
            socket.emit("AllowRemoteControlToServer", isPendingRequest)
            updateCurrentRemoteAccessUser(isPendingRequest)
            setIsPendingRequest()
        }
    }


    useEffect(() => {
        socket.on("AllowRemoteControlToClient", (request) => {
            // console.log(totalParticipant)
            if (request.id === state.myPeer) {

                updateRemoteAccess(true)
                setRemotePermission(true)
            }


        })
        // eslint-disable-next-line
    }, [state.myPeer])

    useEffect(() => {
        updateRemoteAccess(false)
    }, [currentScreenShareId])

    const [remoteMouseControl, setRemoteMouseControl] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    })
    useEffect(() => {
        socket.on("remoteAccessMousePositionToClient", (x, y, w, h) => {

            if (state.myPeer === currentScreenShareId) {
                setRemoteMouseControl({
                    x: x,
                    y: y,
                    width: w,
                    height: h,
                })
            }
        })
    }, [state.myPeer, currentScreenShareId])

    useEffect(() => {
        socket.on("remoteAccessMouseClickedToClient", (x, y, w, h) => {


            if (state.myPeer === currentScreenShareId) {



                const simulateClick = (x, y) => {
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        screenX: x,
                        screenY: y
                    })

                    const element = document.elementFromPoint(x, y)
                    console.log(element)
                    element.dispatchEvent(event)
                }

                simulateClick(x, y)

            }


            // console.log((e.nativeEvent.offsetX * (window.screen.width / w)) + "  " + (e.nativeEvent.offsetY * (window.screen.height / h)))

        })
    }, [state.myPeer, currentScreenShareId])
    // end


    //recording start
    const tempCanvasRef = useRef(null)
    const tempCtx = useRef(null)
    const recorderRef = useRef(null)

    const [chunks, setAudioChunks] = useState([]);
    const topDivRef = useRef("")

    useEffect(() => {
        topDivRef.current = topDivElement

    }, [topDivElement])

    useEffect(() => {
        if (state.isWhiteBoard) {
            const whiteboardStream = canvasRef.current.captureStream(30)
            // console.log(whiteboardStream)
            if (whiteboardRef.current) {

                whiteboardRef.current.srcObject = whiteboardStream
            }
        }
    }, [state.isWhiteBoard])

    const draw = () => {

        const { width, height } = tempCanvasRef.current;
        let ctx = tempCtx.current

        ctx.clearRect(0, 0, width, height);

        if ((topDivRef.current === "screenshare" || topDivRef.current === "users") && screenRef.current) {
            ctx.drawImage(screenRef.current, 0, 0, 1000, 700);
        }
        if (topDivRef.current === "whiteboard" && whiteboardRef.current) {
            // console.log(topDivRef.current)
            //     video.srcObject = whiteboardStream
            ctx.drawImage(whiteboardRef.current, 0, 0, 1000, 700)
        }
        if (camRef.current === "on") {
            ctx.drawImage(myVideo.current, 0, 0, 200, 200);
        }
        ctx.font = "10px serif"
        talkingRemoteRef?.current?.forEach((ele, i) => {
            // soundPng.onload = () => ctx.drawImage(soundPng, 10, ((camRef.current === "on" ? 220 : 40) + (60 * i)), 20, 20)
            // ctx.drawImage(soundPng, 10, ((camRef.current === "on" ? 220 : 0) + (60 * i)), 20, 20);
            ctx.fillText(`${ele.name} talking...`, 20, ((camRef.current === "on" ? 220 : 40) + (30 * i)))
        })

        //For RemotePeer Recording--------------------------------------------------------------------------->





        // if (!screenRef.current && !whiteboardRef.current.srcObject) {

        //     // const video = document.createElement("video")
        //     // video.srcObject = remotePeersRef.current[0]
        //     // // let tempHeight = remotePeersRef.current.length / 4

        //     // ctx.drawImage(video, 200, 0, 200, 100);
        //     // video.loadedmetadata = function () {
        //     //     console.log("loaded")
        //     //     // alert("Browser has loaded the current frame");
        //     // };
        //     // video.remove()


        //     for (let i = 0; i < remotePeersRef.current.length; i++) {
        //         const video = document.createElement("video")
        //         video.srcObject = remotePeersRef.current[i]
        //         // let tempHeight = remotePeersRef.current.length / 4


        //         video.loadedmetadata = function () {
        //             console.log("loaded")
        //             // alert("Browser has loaded the current frame");
        //             ctx.drawImage(video, 0, 0, 200, 100);
        //             video.remove()
        //             requestAnimationFrame(loop);
        //         };
        //     }
        // }





        //For RemotePeer Recording--------------------------------------------------------------------------->
    }

    const loop = () => {
        draw();
        requestAnimationFrame(loop);
    }
    const recordingStart = () => {
        tempCanvasRef.current = document.getElementById("canvas1")
        if (tempCanvasRef.current === null) return
        tempCtx.current = tempCanvasRef.current.getContext("2d");

        tempCanvasRef.current.width = 1000
        tempCanvasRef.current.height = 700



        const startDrawing = () => {
            requestAnimationFrame(loop);
        }

        startDrawing()
        // requestAnimationFrame loop. Each frame, we draw to the canvas.

        const canvasStream = tempCanvasRef.current.captureStream(30);
        // console.log(recordAudioStream.current.getTracks())

        // console.log(recordingAudioDest.current.stream.getTracks())
        // combine the canvas stream and mic stream (from above) by collecting
        //  tracks from each.
        // const finalAudio = recordingAudioDest.current.stream
        // const combinedStream = new MediaStream([
        //     ...canvasStream.getTracks(),
        //     recordingAudioDest.current.stream.getTracks()
        // ]);
        const combinedStream = new MediaStream(

            recordingAudioDest.current.stream.getTracks()
        );
        // console.log(canvasStream.getTracks())
        combinedStream.addTrack(canvasStream.getTracks()[0])


        // console.log(combinedStream.getTracks())

        //set the MediaRecorder instance to the mediaRecorder ref

        //invokes the start method to start the recording process



        // create a recorder


        const media = new MediaRecorder(combinedStream, {
            // requested media type, basically limited to webm 🤦‍♂️
            mimeType: "video/webm;codecs=vp9",
            // mimeType: "'video/mp4;codecs=h264,aac',"
        });

        recorderRef.current = media;
        recorderRef.current.start(500);
        let localAudioChunks = [];
        // collect blobs when available
        recorderRef.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        }
        setAudioChunks(localAudioChunks);
        // const patchBlob = (blob, duration) => {
        //     return new Promise(resolve => {
        //         fixWebmDuration(blob, duration, newBlob => resolve(newBlob));
        //     });
        // }
        // when recorder stops (via recorder.stop()), handle blobs



    }

    const recordingStop = () => {
        if (!recorderRef.current) return
        //  console.log("top")

        recorderRef.current.stop();
        recorderRef.current.onstop = async () => {
            console.log("stop")
            // 

            const recordedBlob = new Blob(chunks, { type: chunks[0].type });
            // const duration = performance.now() - startTime;
            // const patchedBlob = patchBlob(recordedBlob, duration);

            // 💡 turn the blob into a data URL
            const data = URL.createObjectURL(recordedBlob);
            // 💡 generate a link, simulate a click on it
            // console.log("file size: " + recordedBlob.size);
            const link = document.createElement("a");
            link.href = data;
            // console.log(link)
            link.download = "recording.webm";
            link.target = '_blank'; // 👈 give the file a name
            link.click()
            // link.dispatchEvent(
            //   new MouseEvent("click", { view: window });
            // )

            // 💡 don't forget to clean up!
            setTimeout(() => {
                URL.revokeObjectURL(data);
                link.remove();
            }, 500);
        };



    }

    //end




    const value = {
        remotePeersRef,  // remote users
        remoteStreams, //remote streams
        myStream, // my mediaStream
        myVideo,
        screenRef, //screenShareRef
        msgDisplay: state.msgDisplay, // is message display show or hide
        userName: state.userName,// 
        isScreenShare: state.isScreenShare,//screenshare is on or off
        socketOtherChat,//chat post to other socket/peer 
        myPeerId: state.myPeer, //my peer id
        micStatus: state.micStatus, // my mic status on or off
        camStatus: state.camStatus, // my camera status on or off
        myScreenShare: state.myScreenShare, // my mic status on or off
        myEmail: state.email, //email
        isHost: state.isHost, //is whiteboard host or not
        isWhiteBoard: state.isWhiteBoard, // is there whiteboard or not
        roomDetail: state.roomDetail, //meeting room details
        elements: whiteboardElements, // whiteboard elements (line,circle,etc)
        isMeTalking,// toggle when i am talking
        setElements: setWhiteboardElements, //state to store whiteboard elements
        imageArray, //whiteboard image
        setImageArray,//store whiteboard image
        updateMsgDisplayReducer, // msg display update on reducer
        updateNameReducer, // name update on reducer
        updateRoomIdReducer, //meeting room id update on reducer
        msgSentThoughtSocket,// sent msg to socket (backend)
        updateIsScreenShare, //isScreenShare update on reducer
        socketMicOnOff,//update socket for mic on or off
        updateMicStatus, //micStatus update on reducer
        updateCamStatus,//camera status update on reducer
        camOnOffToSocket, //update socket for camera on or off
        updateMyScreenShareStatus,//myScreenShare update on reducer
        updateIsHost,//whiteboard host update on reducer
        updateEmail,//email update on reducer
        updateRoomDetail,//meeting room detail update on reducer
        btnScreenShare, //screen share button function
        leave_button, // leave button function
        updateWhiteBoard, //whiteboard update on reducer
        updateHostForWhiteboard,//host for whiteboard for remote users update on reducer
        newElementsToOther,// whiteboard element for socket update
        newImageToserver, // image for socket
        updateElementsToOther, // socket to remote users whiteboard elements update
        currentScreenShareId, // current screen share user id
        socket,
        totalParticipant,// total participant in meeting room

        whiteboardRef, // whiteboard ref
        recordingStop, // recording stop function
        recordingStart,// recording start function
        topDivElement, // whiteboard ,screenshare or users on main window
        setTopDivElement,//set main window element
        canvasRef, // whiteboard canvas ref
        //beta--------------
        remoteAccess: state.remoteAccess, // beta - remote control access
        currentRemoteAccessUser: state.currentRemoteAccessUser,// beta - remote control access
        isPendingRequest, // is anyone requested remote control access
        remoteRequestAllowCancel,  // allow the remote remote for access
        setRemotePermission, // permission to set a user to control access
        requestRemoteControl, // socket update for request remote control
        remotePermission,//is there remote permission
        remoteMouseControl, // mouse position for remote access control
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

// black screen for initial mediastream (when screen share is not there)
let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    // console.log(black)
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
}

// blank audio for initial mediastream (when screen share is not there)

let silence = () => {
    let ctx = new AudioContext(), oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
}
//STUN /TURN server list
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