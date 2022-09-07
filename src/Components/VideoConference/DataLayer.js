import React, { useState, createContext, useContext, useEffect, useReducer, useRef } from "react"
import reducer, { initialState } from './reducer';
import { Peer } from "peerjs";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3001", {
    forceNew: true,
    transports: ["polling"],
});



export const DataLayerContext = createContext()




export const DataLayer = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [myStream, setMyStream] = useState();
    const [myPeer, setMyPeer] = useState()
    const [remotePeers, setRemotePeers] = useState([])

    const myVideo = useRef()
    const remotePeersRef = useRef()
    // const remoteRef = useRef([])
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


    useEffect(() => {
        myPeer?.on("open", (id) => {
            console.log("My peer: ", id)
            socket.emit("join-roomF", state.roomId, id)
        })
        if (myPeer) {
            getUserMedia({ audio: true, video: true },
                function (stream) {
                    const newTrack = black()
                    const dummyAudioTrack = silence()
                    stream.addTrack(newTrack)
                    stream.addTrack(dummyAudioTrack)
                    setMyStream(stream)
                    console.log("myStream: ", stream)
                    myVideo.current.srcObject = stream
                    if (myStream) myStream.getTracks()[2].enabled = false



                    myPeer?.on("call", (call) => {

                        call.answer(stream)
                        let id;
                        call.on("stream", (userVideoStream) => {

                            if (id !== userVideoStream) {
                                id = userVideoStream
                                console.log("53 call  ", userVideoStream)
                                // remotePeersRef.current.srcObject = userVideoStream


                                setRemotePeers(remotePeers => [...remotePeers, userVideoStream])

                            }
                        })
                    })



                    socket.on("user-connectedF", (remotePeerId,) => {
                        setTimeout(connectToNewUser, 1000, remotePeerId, stream, state.roomId)
                    })




                }, function (err) {
                    console.log(err)
                })


        }

    }, [myPeer])

    useEffect(() => {
        const peer = new Peer(undefined, {
            path: "/peerjs",
            host: "localhost",
            port: "3001",
            // port: "443",
            // secure: true,
            config: peerServerList
        })
        setMyPeer(peer)
        socket.on("port", (e) => {
            console.log(e)
        })
        // getUserMedia({ audio: true, video: true },
        //     function (stream) {
        //         // console.log(black())
        //         const newTrack = black()
        //         const dummyAudioTrack = silence()
        //         // const newTrack = stream.getTracks()[0].clone()
        //         // console.log(newTrack)
        //         // newTrack.kind = "video"
        //         // console.log(newTrack)
        //         stream.addTrack(newTrack)
        //         stream.addTrack(dummyAudioTrack)
        //         setMyStream(stream)
        //         myVideo.current.srcObject = stream
        //         // console.log(myVideo)
        //         // myStream.getTracks()[2].enabled = false
        //         // checkPeerId(myVideo, myStream, myName, micStatus)


        //         myPeer.on("call", (call) => {

        //             // revCall.push(call)

        //             // call.answer(stream)


        //             // const video = document.createElement("video")
        //             let id;
        //             call.on("stream", (userVideoStream) => {



        //                 if (id !== userVideoStream) {
        //                     id = userVideoStream


        //                     // addUserStream(video, userVideoStream, call.metadata.id, call.metadata.name, call.metadata.micStatus, call.metadata.screenShareOn)

        //                 }

        //                 // addUserStream(video, userVideoStream)
        //             })
        //         })



        //         socket.on("user-connectedF", (remotePeerId,) => {
        //             // console.log("user Connected  ", remotePeerId)
        //             setTimeout(connectToNewUser, 1000, remotePeerId, stream)
        //         })


        //     }, function (err) {
        //         console.log(err)
        //     })
        // eslint-disable-next-line 
    }, [])

    function connectToNewUser(userId, stream, roomId) {
        console.log("in connectToNewUser", stream)
        console.log(roomId, "     ", userId)
        // let call = myPeer.call(userId, stream, { metadata: { "name": myName, "id": peerIDMain, micStatus, screenShareOn } })
        let call = myPeer?.call(userId, stream)
        // const call = myPeer?.call(userId, stream
        //     , { metadata: { "name": myName, "id": peerIDMain, micStatus, screenShareOn } }
        // )
        let id;
        call?.on("stream", (userVideoStream) => {

            if (id !== userVideoStream) {
                id = userVideoStream;
                console.log("uservideoStream 168")
                // remotePeersRef.srcObject = userVideoStream
                setRemotePeers(remotePeers => [...remotePeers, userVideoStream])
                // setRemotePeers(remotePeers => [...remotePeers, stream])
                // addUserStream(video, userVideoStream, userId, userName, micStatus = true, screenShareOnS)
            }


        })
        call?.on("error", (error) => {
            console.log("err in call 174", error)
        })
        call?.on("close", () => {
            console.log("close")
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


    const value = {
        remotePeersRef,
        remotePeers,
        myStream,
        myVideo,
        msgDisplay: state.msgDisplay,
        userName: state.userName,
        socketOtherChat,
        updateMsgDisplayReducer,
        updateNameReducer,
        updateRoomIdReducer,
        msgSentThoughtSocket
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