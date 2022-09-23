import React, { useState, createContext, useContext, useEffect, useReducer, useRef } from "react"
import reducer, { initialState } from './reducer';
import { Peer } from "peerjs";
import { io } from "socket.io-client";
const socket = io.connect("https://eduquiz001.herokuapp.com", {
    forceNew: true,
    transports: ["polling"],
});



export const DataLayerContext = createContext()


export const DataLayer = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [myStream, setMyStream] = useState();
    const [myPeer, setMyPeer] = useState()
    const [remoteStreams, setRemoteStreams] = useState([])

    const myVideo = useRef()
    const remotePeersRef = useRef([])

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    useEffect(() => {
        const peer = new Peer(undefined, {
            path: "/peerjs",
            host: "https://eduquiz001.herokuapp.com",
            // port: "3001",
            port: "443",
            secure: true,
            config: peerServerList
        })
        setMyPeer(peer)
        // updateMyPeer(peer)
        // socket.on("port", (e) => {
        //     console.log(e)
        // })
    }, [])
    useEffect(() => {
        myPeer?.on("open", (id) => {
            updateMyPeer(id)
            console.log("My peer: ", id)
            socket.emit("join-roomF", state.roomId, id, state.userName)
        })
        if (myPeer) {
            getUserMedia({ audio: true, video: true },
                function (stream) {
                    const newTrack = black()
                    const dummyAudioTrack = silence()
                    stream.addTrack(newTrack)
                    stream.addTrack(dummyAudioTrack)
                    setMyStream(stream)
                    myVideo.current.srcObject = stream
                    if (myStream) myStream.getTracks()[2].enabled = false


                    myPeer?.on("call", (call) => {
                        call.answer(stream)
                        let id;
                        call.on("stream", (userVideoStream) => {
                            if (id !== userVideoStream) {
                                id = userVideoStream
                                remotePeersRef.current.push(userVideoStream)

                                setRemoteStreams(remoteStreams => [...remoteStreams, { "stream": userVideoStream, "id": call.metadata.tempPeer, "name": call.metadata.tempName, "micStatus": call.metadata.myMic }])
                            }
                        })
                    })
                    myPeer?.on("close", () => {

                        socket.emit("user-disconnect", myPeer?._id)
                    })

                    socket.on("user-connectedF", (remotePeerId, remotePeerName) => {
                        setTimeout(connectToNewUser, 3000, remotePeerId, stream, state.roomId, remotePeerName, state.myPeer)
                    })

                }, function (err) {
                    console.log(err)
                })


        }

    }, [myPeer])


    function connectToNewUser(userId, stream, roomId, remoteName) {


        const tempName = state.userName
        const tempPeer = myPeer?._id
        const myMic = state.micStatus
        let call = myPeer?.call(userId, stream, { metadata: { tempName, tempPeer, myMic } })
        let id;
        call?.on("stream", (userVideoStream) => {

            if (id !== userVideoStream) {
                id = userVideoStream;

                remotePeersRef.current.push(userVideoStream)
                // remotePeersRef.srcObject = userVideoStream
                setRemoteStreams(remoteStreams => [...remoteStreams, { "stream": userVideoStream, "id": userId, "name": remoteName, "micStatus": "on" }])

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
    const [socketOtherChat, setSocketOtherChat] = useState()

    socket.on("msgSent", (chat) => {

        setSocketOtherChat(chat)
    })
    const msgSentThoughtSocket = (chat) => {

        socket.emit("msgThoughSocket", (chat))
    }
    const updateIsScreenShare = (data) => {

        dispatch({
            type: "SET_SCREENSHARE",
            screenShare: data
        })
    }
    const updateMicStatus = (data) => {
        dispatch({
            type: "SET_MICSTATUS",
            mic: data
        })
    }

    socket.on("user-disconnect", (id) => {
        console.log(id)
    })
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

    const value = {
        remotePeersRef,
        remoteStreams,
        myStream,
        myVideo,
        msgDisplay: state.msgDisplay,
        userName: state.userName,
        isScreenShare: state.isScreenShare,
        socketOtherChat,
        myPeerId: state.myPeer,
        micStatus: state.micStatus,
        updateMsgDisplayReducer,
        updateNameReducer,
        updateRoomIdReducer,
        msgSentThoughtSocket,
        updateIsScreenShare,
        socketMicOnOff,
        updateMicStatus
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