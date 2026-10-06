import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import axios from '../../../../axios'
import { PageHeader, DataTable, EmptyState, useFeedback } from '../../../ui'

const endpoints = {
    teacher: { list: '/getAllTeacher', remove: '/deleteTeacher' },
    student: { list: '/getAllStudent', remove: '/deleteStudent' },
}

const DeletePeople = ({ kind }) => {
    const config = endpoints[kind]
    const notify = useFeedback()
    const [people, setPeople] = useState([])
    const [loading, setLoading] = useState(true)

    const getAll = useCallback(() => {
        axios.get(config.list).then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify(`Could not load ${kind}s.`, 'error')
            setPeople(response.data)
        })
        // eslint-disable-next-line
    }, [config.list, kind])

    useEffect(() => {
        getAll()
    }, [getAll])

    const remove = (id) => {
        axios.post(config.remove, { id }).then((response) => {
            if (response.data.errMsg) return notify('Could not delete.', 'error')
            notify(`${kind === 'teacher' ? 'Teacher' : 'Student'} deleted.`, 'success')
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
                <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => remove(row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader
                title={`Delete ${kind}`}
                subtitle={`Removing a ${kind} account cannot be undone.`}
            />
            <DataTable
                columns={columns}
                rows={people}
                loading={loading}
                getRowKey={(row) => row.id}
                empty={<EmptyState title={`No ${kind}s yet`} />}
            />
        </Box>
    )
}

export default DeletePeople
