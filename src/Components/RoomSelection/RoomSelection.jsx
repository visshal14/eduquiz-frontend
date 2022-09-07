import React, { useEffect, useState } from 'react'
import "./RoomSelection.css"
import Button from '../Button'
import { roomJoiningLeft } from "../../Assets/src"
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import axios from "../../axios";
import { LoginChecker } from "../../LoginChecker"
import { useParams } from 'react-router-dom';
function RoomSelection() {
    LoginChecker(-1)
    const { id, status } = useParams()

    const [leftBackDis, setLeftBackDis] = useState("initial")
    const [createDis, setCreateDis] = useState("none")
    const [joinDis, setJoinDis] = useState("none")
    const [createPasswordDis, setCreatePasswordDis] = useState("none")
    const [uniqueId, setUniqueId] = useState("")
    const [roomPasswordDis, setRoomPasswordDis] = useState("none")

    useEffect(() => {
        if (status === "hello") {
            document.getElementById("join-room-id").value = id
            joinBtn()
            joinRoomOld()
        }
        // eslint-disable-next-line
    }, [])
    const createBtn = () => {
        setLeftBackDis("none")
        setCreateDis("initial")
        setJoinDis("none")
        axios.get("/uniqueIdMeet", { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then((response) => {
                setUniqueId(response.data)
            })
    }
    const joinBtn = () => {
        setLeftBackDis("none")
        setCreateDis("none")
        setJoinDis("initial")
    }
    const passwordCheckbox = (e) => {
        if (e.target.checked === true) return setCreatePasswordDis("block")
        setCreatePasswordDis("none")
    }

    const createRoom = () => {
        let createPassword = document.getElementsByName("createPassword")[0].value
        axios.post('/createRoom', {
            roomId: uniqueId,
            roomPassword: createPassword,
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(async function (response) {
                if (response.data.msg) {
                    alert("done")
                    window.location.href = `/conference/${uniqueId}/p`
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [joinRoomOldDis, setJoinRoomOldDis] = useState("")
    const [joinRoomNewDis, setJoinRoomNewDis] = useState("none")


    const joinRoomOld = () => {

        axios.post('/joinRoomContinue', {
            roomId: document.getElementsByName("joinRoom_id")[0].value
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(async function (response) {
                if (response.data.passwordMsg) return {
                    temp: setRoomPasswordDis("initial"),
                    temp1: setJoinRoomOldDis("none"),
                    temp2: setJoinRoomNewDis("initial")
                }
                if (response.data.err) return alert(response.data.err)
                await axios.get(`/joinRoomPassword`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
                    .then(function (response) {
                        if (response.data.continueMsg) {
                            window.location.href = `/conference/${document.getElementsByName("joinRoom_id")[0].value}/p`

                        }
                    });

            })
            .catch(function (error) {
                console.log(error);
            });


    }
    const joinRoomNew = () => {
        axios.post('/joinRoomPassword', {
            roomId: document.getElementsByName("joinRoom_id")[0].value,
            roomPassword: document.getElementsByName("joinRoom_pasword")[0].value
        }, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
            .then(async function (response) {
                if (response.data.errMsg) return alert(response.data.errMsg)
                console.log(document.getElementsByName("joinRoom_id")[0].value)
                window.location.href = `/conference/${document.getElementsByName("joinRoom_id")[0].value}/p`
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className='room_main'>
            <div className='room-partition'>
                <div style={{ width: "100%", padding: "30px", textAlign: "center" }}>
                    <div style={{ marginBottom: "100px" }}>
                        <Button name=" Room" padding="200" font="40" link={"loginBtn"} bgcolor="alicewhite" />
                    </div>
                    <br />
                    <Button name="Create Room" font={"30"} link={createBtn} bgcolor="alicewhite" />
                    <Button name="Join Room" font={"30"} link={joinBtn} bgcolor="alicewhite" />
                </div>
            </div>
            <div className='room-partition'>
                <img style={{ display: leftBackDis }} src={roomJoiningLeft} alt="roomJoiningBack" id="roomJoiningBack" />

                <div style={{ display: createDis }} className='createJoinRoom-div'>
                    <div className="createJoinRoom-heading">
                        Create Room
                    </div>
                    <div className="createJoinRoom-id">
                        Here is your Room ID:
                        <span className="createJoinRoom-unique-id">{uniqueId}<ContentPasteIcon style={{ float: "right" }} onClick={() => navigator.clipboard.writeText(uniqueId)} /></span>
                        <label >Do you want to add password <input type="checkbox" id="createPasswordCheckbox" onChange={(e) => { passwordCheckbox(e) }} /></label>
                        <br />
                        <input style={{ display: createPasswordDis }} type="password" name="createPassword" />
                        <Button name="Continue" link={createRoom} bgcolor="#E9DBFF" />
                    </div>
                </div>
                <div style={{ display: joinDis }} className='createJoinRoom-div'>
                    <div className="createJoinRoom-heading">
                        Join Room
                    </div>
                    <div className="createJoinRoom-id">
                        Enter Room Id:
                        <input type="text" id="join-room-id" name="joinRoom_id" />
                        <div style={{ display: roomPasswordDis }} className="createJoinRoom-joinPass">
                            Room Password
                            <br />
                            <input type="password" name="joinRoom_pasword" />
                        </div>
                        <button style={{ display: joinRoomOldDis }} className="continueBtn" onClick={joinRoomOld} >Continue</button >
                        <button style={{ display: joinRoomNewDis }} className="continueBtn" onClick={joinRoomNew} >Continue</button >
                    </div>
                </div>


            </div>
        </div >
    )
}

export default RoomSelection