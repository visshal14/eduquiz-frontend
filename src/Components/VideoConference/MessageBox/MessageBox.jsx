import React from 'react'
import "./MessageBox.css"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import axios from '../../../axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDataLayerValue } from "../DataLayer"
import { ExpandMore, ExpandLess, MicOff, Mic, Videocam, VideocamOff } from '@mui/icons-material';


function MessageBox() {


    const { id } = useParams()

    const userName = window.localStorage.getItem("userName")
    // eslint-disable-next-line
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])

    useEffect(() => {
        axios.get(`/getChat/${id}`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(async function (response) {
                response.data.map((chat) => (
                    setMessages(messages => [...messages, chat])
                ))

            });

    }, [newMessage, id])

    useEffect(() => {
        //when new message auto scroll down
        document.getElementById("msgs_box").scrollTo(0, document.getElementById("msgs_box").scrollHeight);
    }, [messages])


    const { msgSentThoughtSocket, socketOtherChat, totalParticipant, micStatus, camStatus } = useDataLayerValue()
    useEffect(() => {
        if (socketOtherChat) setMessages(messages => [...messages, socketOtherChat])
    }, [socketOtherChat])
    const messageSent = () => {
        var d = new Date();
        d.getHours();
        d.getMinutes();

        const chat = {
            name: userName,
            message: document.getElementsByName("messageByUser")[0].value,
            time: `${d.getHours()}:${d.getMinutes()}`
        }
        msgSentThoughtSocket(chat)
        setMessages(messages => [...messages, chat])
        document.getElementsByName("messageByUser")[0].value = ""


        axios.post(`/chatPosted`, {
            roomId: id,
            time: chat.time,
            name: userName,
            message: chat.message
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then((response) => {
                // console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [seeAllParti, setSeeAllParti] = useState(false)


    return (
        <div className='msg_main'>
            <div className='parti-main'>
                <div className='total-parti-main' onClick={() => setSeeAllParti(!seeAllParti)}>
                    <p>Total {totalParticipant?.length + 1} participant</p>
                    {seeAllParti && totalParticipant?.length > 0 ? <ExpandLess /> : <ExpandMore />}
                </div>
                {seeAllParti && <div className='list-parti'>
                    <div className='single-parti'><p>{userName}</p>  <div> {micStatus === "on" ? <Mic /> : <MicOff />} {camStatus === "on" ? <Videocam /> : <VideocamOff />} </div> </div>

                    {totalParticipant?.map((ele, i) =>
                        <div key={i} className='single-parti'><p>{ele.name}</p> <div> {ele.micStatus === "on" ? <Mic /> : <MicOff />} {ele?.camStatus === "on" ? <Videocam /> : <VideocamOff />} </div> </div>
                    )}
                </div>}

            </div>

            <div className='msgs_box' id="msgs_box">
                {messages?.map((arr, i) => (
                    <SingleMessage key={i} userName={userName} name={arr.name} msg={arr.message} time={arr.time} />
                ))}
            </div>
            <div className='writeMsg_box'>
                <input placeholder="Write a message ...." type="text" name="messageByUser" />
                <button onClick={messageSent}><SendOutlinedIcon /></button>
            </div>
        </div>
    )
}


const SingleMessage = ({ userName, name, msg, time }) => {
    return (
        <div style={{ backgroundColor: (userName === name) ? " rgb(61, 63, 65) " : "", marginLeft: (userName === name) ? " calc(20% )" : "", width: (userName === name) ? "inherit" : "", borderRadius: (userName === name) ? "10px 10px 0px 10px" : "" }} className='msg_box' >
            <div className='nameTime'>
                <span>{name}</span>
                <span>{time}</span>
            </div>
            <div className='msgUser_div'>
                {msg}
            </div>
        </div>
    )
}



export default MessageBox