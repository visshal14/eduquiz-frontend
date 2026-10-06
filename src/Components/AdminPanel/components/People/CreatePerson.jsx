import React, { useState } from 'react'
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import axios from '../../../../axios'
import personConfig from './personConfig'
import { PageHeader, FormCard, FullWidth, useFeedback } from '../../../ui'

const CreatePerson = ({ kind }) => {
    const config = personConfig[kind]
    const notify = useFeedback()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        if (name === "" || email === "" || password === "") {
            return notify('Fill in every field.', 'warning')
        }

        setSubmitting(true)
        axios.post(config.create, { name, email, password })
            .then((response) => {
                setSubmitting(false)
                if (response.data.errMsg) return notify(`Could not create the ${config.singular}.`, 'error')
                notify(`${config.singular === 'teacher' ? 'Teacher' : 'Student'} created.`, 'success')
                setName("")
                setEmail("")
                setPassword("")
            })
            .catch(function (error) {
                console.log(error);
                setSubmitting(false)
                notify('Could not reach the server.', 'error')
            });
    }

    return (
        <Box component="form" onSubmit={submit} noValidate>
            <PageHeader
                title={`Create ${config.singular}`}
                subtitle={`Add a new ${config.singular} account and set its first password.`}
            />

            <FormCard
                maxWidth={640}
                footer={
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Creating…' : `Create ${config.singular}`}
                    </Button>
                }
            >
                <FullWidth>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                    />
                </FullWidth>

                <FullWidth>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </FullWidth>

                <FullWidth>
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
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
                </FullWidth>
            </FormCard>
        </Box>
    )
}

export default CreatePerson
