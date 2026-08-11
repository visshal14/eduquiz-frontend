import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, IconButton, Stack, TextField, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import axios from '../../../../axios'
import personConfig from './personConfig'
import { PageHeader, DataTable, DetailDialog, EmptyState, useFeedback } from '../../../ui'

const EditPeople = ({ kind }) => {
    const config = personConfig[kind]
    const notify = useFeedback()

    const [people, setPeople] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(null)
    const [newName, setNewName] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const getAll = useCallback(() => {
        axios.get(config.list).then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify(`Could not load ${config.singular}s.`, 'error')
            setPeople(response.data)
        })
        // eslint-disable-next-line
    }, [config.list])

    useEffect(() => {
        getAll()
    }, [getAll])

    const editClick = (person) => {
        setEditing(person)
        setNewName(person.name || "")
        setNewPassword("")
    }

    const submit = () => {
        axios.post(config.edit, {
            id: editing.id,
            name: newName,
            password: newPassword
        }).then((response) => {
            if (response.data.errMsg) return notify('Could not save the changes.', 'error')
            setNewName("")
            setNewPassword("")
            notify('Changes saved.', 'success')
            setEditing(null)
            getAll()
        })
            .catch(function (error) {
                console.log(error);
                notify('Could not reach the server.', 'error')
            });
    }

    const deleteClick = (id) => {
        axios.post(config.remove, { id }).then((response) => {
            if (response.data.errMsg) return notify('Could not delete.', 'error')
            notify(`${config.singular === 'teacher' ? 'Teacher' : 'Student'} deleted.`, 'success')
            getAll()
        })
            .catch(function (error) {
                console.log(error);
                notify('Could not reach the server.', 'error')
            });
    }

    const columns = [
        { key: 'id', label: 'ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (row) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => editClick(row)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {config.remove && (
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                onClick={() => deleteClick(row.id)}
                                sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader
                title={`Edit ${config.singular}`}
                subtitle={`Change a ${config.singular}'s name or reset their password.`}
            />

            <DataTable
                columns={columns}
                rows={people}
                loading={loading}
                getRowKey={(row) => row.id}
                empty={<EmptyState title={`No ${config.singular}s yet`} />}
            />

            <DetailDialog
                open={Boolean(editing)}
                onClose={() => setEditing(null)}
                title={editing?.name || `Edit ${config.singular}`}
                subtitle={editing?.email}
                maxWidth="xs"
                actions={
                    <>
                        <Button color="inherit" onClick={() => setEditing(null)}>Cancel</Button>
                        <Button variant="contained" onClick={submit}>Save</Button>
                    </>
                }
            >
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                    <TextField
                        label="Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <TextField
                        label="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Stack>
            </DetailDialog>
        </Box>
    )
}

export default EditPeople
