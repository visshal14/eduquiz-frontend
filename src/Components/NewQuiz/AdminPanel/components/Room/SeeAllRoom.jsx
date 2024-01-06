import React, { useEffect, useState } from 'react'
import axios from "../../../../../axios"
import { Close } from '@mui/icons-material'
const SeeAllRoom = ({ teacher }) => {

    const [room, setRoom] = useState()
    const [detailedRoom, setDetailedRoom] = useState()


    useEffect(() => {
        axios.get(`/getAllRoom/${teacher ? teacher : "all"}`).then((response) => {
            if (response.data.errMsg) return alert("Error")
            setRoom(response.data)
        })
    }, [teacher])

    const getDetails = (ele) => {
        setDetailedRoom(ele)

    }


    const closeBtn = () => {
        setDetailedRoom(null)
    }

    return (
        <div className='seeQuiz-main'>
            <table>
                <thead>
                    <tr className='editQuiz-table-head'>
                        <th>Meeting Id</th>
                        <th>Name</th>
                        <th>Teacher Name</th>

                        <th>Password</th>
                        <th>Link</th>


                    </tr>

                </thead>
                <tbody>

                    {room?.map((ele, i) =>

                        <tr key={i}>
                            <td>{ele.meeting_id}</td>
                            <td>{ele.name || "-"}</td>
                            <td>{ele.admin_details?.name}</td>




                            <td>{ele.password || "-"}</td>

                            <td><button onClick={() => { window.location.href = `/conference/${ele.meeting_id}/hello` }}>Join</button></td>
                            <td><button onClick={() => getDetails(ele)}>Details</button></td>
                        </tr>

                    )}

                </tbody>
            </table>

            {detailedRoom &&
                <div className='edit-quiz-overlay'>
                    <div><Close onClick={closeBtn} className='close-btn' /></div>

                    <div className='seeQuiz-main'>
                        <div className='see-all-students'><span>Names Of Student</span></div>
                        <table>
                            <thead>
                                <tr className='editQuiz-table-head'>
                                    <th>Id</th>
                                    <th>Name</th>


                                    <th>Email</th>



                                </tr>

                            </thead>
                            <tbody>

                                {detailedRoom?.names_of_participants?.map((ele, i) =>

                                    <tr key={i}>
                                        <td>{ele.id}</td>
                                        <td>{ele.name}</td>
                                        <td>{ele.email}</td>


                                    </tr>

                                )}

                            </tbody>
                        </table>
                    </div>

                    <div className='seeQuiz-main'>
                        <div className='see-all-students'><span>Messages</span></div>
                        <table>
                            <thead>
                                <tr className='editQuiz-table-head'>
                                    <th>Name</th>
                                    <th>Time</th>

                                    {/* <th>question</th> */}
                                    <th>Message</th>



                                </tr>

                            </thead>
                            <tbody>

                                {detailedRoom?.chat?.map((ele, i) =>

                                    <tr key={i}>
                                        <td>{ele.name}</td>
                                        <td>{ele.time}</td>
                                        <td>{ele.message}</td>


                                    </tr>

                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            }


        </div>
    )
}

export default SeeAllRoom