import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, MenuItem, Stack, TextField, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import axios from "../../../../axios"
import { PageHeader, DataTable, DetailDialog, EmptyState, useFeedback } from '../../../ui'

const EditRoom = ({ teacher }) => {
    const notify = useFeedback()

    const [room, setRoom] = useState()
    const [loading, setLoading] = useState(true)
    const [isEditTrue, setIsEditTrue] = useState(false)
    const [editRoom, setEditRoom] = useState()
    const [newName, setNewName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [studentEmails, setStudentEmails] = useState(" ")
    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")

    useEffect(() => {
        if (teacher) {
            setTeacherId(teacher)
        } else {
            axios.get("/getAllTeacher").then((response) => {
                if (response.data.errMsg) {
                    return notify('Could not load teachers. Try again.', 'error')
                }
                setTeachers(response.data)
            })
        }
        axios.get(`/getAllRoom/${teacher ? teacher : "all"}`).then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify('Could not load rooms.', 'error')
            setRoom(response.data)
        })
        // eslint-disable-next-line
    }, [teacher])

    const editClick = (id) => {
        room.forEach((ele) =>
            ele.meeting_id === id ? setEditRoom(ele) : ""
        )
        setIsEditTrue(true)
    }

    useEffect(() => {
        setNewName(editRoom?.name || "")
        setNewPassword(editRoom?.password || "")
        setTeacherId(editRoom?.admin_details?.id)
        let tempStudent = []
        editRoom?.names_of_participants.map((ele, i) =>
            tempStudent.push(ele.email)
        )

        setStudentEmails(tempStudent.toString())
        // eslint-disable-next-line
    }, [editRoom])

    const submit = () => {
        axios.post(`/editRoom`, {
            meetId: editRoom.meeting_id,
            password: newPassword,
            name: newName,
            teacherId,
            studentEmails
        }).then((response) => {
            if (response.data.errMsg) return notify('Could not save the room.', 'error')
            setNewName("")
            setNewPassword("")
            notify('Room saved.', 'success')
            setIsEditTrue(false)
        })
            .catch(function (error) {
                console.log(error);
                notify('Could not reach the server.', 'error')
            });
    }

    const closeBtn = () => {
        setIsEditTrue(false)
    }

    const columns = [
        { key: 'meeting_id', label: 'Meeting ID', nowrap: true },
        { key: 'name', label: 'Name', render: (row) => row.name || '—' },
        { key: 'teacher', label: 'Teacher', render: (row) => row.admin_details?.name || '—' },
        { key: 'password', label: 'Password', render: (row) => row.password || '—' },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => editClick(row.meeting_id)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader title="Edit room" subtitle="Rename a room, change its password or update who is invited." />

            <DataTable
                columns={columns}
                rows={room}
                loading={loading}
                getRowKey={(row) => row.meeting_id}
                empty={<EmptyState title="No rooms yet" description="Create one from the Create room screen." />}
            />

            <DetailDialog
                open={isEditTrue}
                onClose={closeBtn}
                title={editRoom?.name || 'Edit room'}
                subtitle={editRoom?.meeting_id ? `Meeting ID ${editRoom.meeting_id}` : undefined}
                maxWidth="sm"
                actions={
                    <>
                        <Button color="inherit" onClick={closeBtn}>Cancel</Button>
                        <Button variant="contained" onClick={submit}>Save changes</Button>
                    </>
                }
            >
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                    <TextField
                        label="Room name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        helperText="Leave blank for an open room"
                    />
                    <TextField
                        label="Student emails"
                        value={studentEmails}
                        onChange={(e) => setStudentEmails(e.target.value)}
                        helperText="Separated by commas"
                    />
                    {!teacher && (
                        <TextField
                            select
                            label="Teacher"
                            value={teacherId || ''}
                            onChange={(e) => setTeacherId(e.target.value)}
                        >
                            {teachers?.map((ele) => (
                                <MenuItem key={ele.id} value={ele.id}>{ele.name}</MenuItem>
                            ))}
                        </TextField>
                    )}
                </Stack>
            </DetailDialog>
        </Box>
    )
}

export default EditRoom
