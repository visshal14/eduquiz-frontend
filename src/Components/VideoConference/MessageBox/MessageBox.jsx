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

    // Composer text is deliberately NOT `newMessage` — that one is a dependency
    // of the fetch below, and typing into it would refetch and duplicate the
    // whole history on every keystroke.
    const [draft, setDraft] = useState("")

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
        const text = draft.trim()
        if (!text) return

        var d = new Date();
        d.getHours();
        d.getMinutes();

        const chat = {
            name: userName,
            message: text,
            time: `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
        }
        msgSentThoughtSocket(chat)
        setMessages(messages => [...messages, chat])
        setDraft("")


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
    const participantCount = (totalParticipant?.length || 0) + 1

    return (
        <div className='msg_main'>
            <div className='parti-main'>
                <button
                    type="button"
                    className='total-parti-main'
                    onClick={() => setSeeAllParti(!seeAllParti)}
                    aria-expanded={seeAllParti}
                >
                    <p>{participantCount} participant{participantCount === 1 ? '' : 's'}</p>
                    {seeAllParti && totalParticipant?.length > 0 ? <ExpandLess /> : <ExpandMore />}
                </button>

                {seeAllParti && (
                    <div className='list-parti'>
                        <div className='single-parti'>
                            <p>{userName} <span className='parti-you'>You</span></p>
                            <div>
                                {micStatus === "on" ? <Mic /> : <MicOff className='is-off' />}
                                {camStatus === "on" ? <Videocam /> : <VideocamOff className='is-off' />}
                            </div>
                        </div>

                        {totalParticipant?.map((ele, i) =>
                            <div key={i} className='single-parti'>
                                <p>{ele.name}</p>
                                <div>
                                    {ele.micStatus === "on" ? <Mic /> : <MicOff className='is-off' />}
                                    {ele?.camStatus === "on" ? <Videocam /> : <VideocamOff className='is-off' />}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className='msgs_box' id="msgs_box">
                {messages?.length === 0 && (
                    <p className='msgs_empty'>No messages yet. Say something.</p>
                )}
                {messages?.map((arr, i) => (
                    <SingleMessage key={i} userName={userName} name={arr.name} msg={arr.message} time={arr.time} />
                ))}
            </div>

            <div className='writeMsg_box'>
                <input
                    placeholder="Write a message…"
                    type="text"
                    name="messageByUser"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') messageSent() }}
                />
                <button onClick={messageSent} aria-label="Send message" disabled={!draft.trim()}>
                    <SendOutlinedIcon />
                </button>
            </div>
        </div>
    )
}


const SingleMessage = ({ userName, name, msg, time }) => {
    const isMine = userName === name
    return (
        <div className={`msg_box${isMine ? ' is-mine' : ''}`}>
            <div className='nameTime'>
                <span>{isMine ? 'You' : name}</span>
                <span>{time}</span>
            </div>
            <div className='msgUser_div'>
                {msg}
            </div>
        </div>
    )
}



export default MessageBox
