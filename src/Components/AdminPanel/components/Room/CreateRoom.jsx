import React, { useState, useEffect } from 'react'
import {
    Box, Button, IconButton, InputAdornment, MenuItem, TextField,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import axios from '../../../../axios'
import { PageHeader, FormCard, FullWidth, useFeedback } from '../../../ui'

const CreateRoom = ({ teacher }) => {
    const notify = useFeedback()

    const [name, setName] = useState("")
    const [teachers, setTeachers] = useState([])
    const [teacherId, setTeacherId] = useState("")
    const [studentEmails, setStudentEmails] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        if (name === "" || teacherId === "") {
            return notify('Give the room a name and pick a teacher.', 'warning')
        }

        setSubmitting(true)
        axios.post(`/createRoom`, {
            name, teacherId, studentEmails, password
        }).then((response) => {
            setSubmitting(false)
            if (response.data.errMsg) return notify('Could not create the room.', 'error')

            setName("")
            setStudentEmails("")
            setPassword("")
            notify('Room created.', 'success')
        })
            .catch(function (error) {
                console.log(error);
                setSubmitting(false)
                notify('Could not reach the server.', 'error')
            });
    }

    useEffect(() => {
        if (teacher) {
            setTeacherId(teacher)
        } else {
            axios.get("/getAllTeacher").then((response) => {
                if (response.data.errMsg) return notify('Could not load teachers.', 'error')
                setTeachers(response.data)
                setTeacherId(response.data[0]?.id || "")
            })
        }
        // eslint-disable-next-line
    }, [teacher])

    return (
        <Box component="form" onSubmit={submit} noValidate>
            <PageHeader
                title="Create room"
                subtitle="Set up a live session and invite students by email."
            />

            <FormCard
                maxWidth={720}
                footer={
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Creating…' : 'Create room'}
                    </Button>
                }
            >
                <TextField
                    label="Room name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText="Optional — leave blank for an open room"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    edge="end"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword
                                        ? <VisibilityOffOutlinedIcon fontSize="small" />
                                        : <VisibilityOutlinedIcon fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <FullWidth>
                    <TextField
                        label="Student emails"
                        value={studentEmails}
                        onChange={(e) => setStudentEmails(e.target.value)}
                        placeholder="ana@school.edu, ben@school.edu"
                        helperText="Separated by commas"
                    />
                </FullWidth>

                {!teacher && (
                    <TextField
                        select
                        label="Teacher"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                    >
                        {teachers?.map((ele) => (
                            <MenuItem key={ele.id} value={ele.id}>{ele.name}</MenuItem>
                        ))}
                    </TextField>
                )}
            </FormCard>
        </Box>
    )
}

export default CreateRoom
