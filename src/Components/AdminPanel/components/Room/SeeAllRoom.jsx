import React, { useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import axios from "../../../../axios"
import { PageHeader, DataTable, DetailDialog, EmptyState, useFeedback } from '../../../ui'

const SeeAllRoom = ({ teacher }) => {
    const notify = useFeedback()

    const [room, setRoom] = useState()
    const [loading, setLoading] = useState(true)
    const [detailedRoom, setDetailedRoom] = useState(null)

    useEffect(() => {
        axios.get(`/getAllRoom/${teacher ? teacher : "all"}`).then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify('Could not load rooms.', 'error')
            setRoom(response.data)
        })
        // eslint-disable-next-line
    }, [teacher])

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
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<VideocamOutlinedIcon />}
                        onClick={() => { window.location.href = `/conference/${row.meeting_id}/hello` }}
                    >
                        Join
                    </Button>
                    <Button size="small" variant="outlined" color="inherit" onClick={() => setDetailedRoom(row)}>
                        Details
                    </Button>
                </Stack>
            ),
        },
    ]

    const participantColumns = [
        { key: 'id', label: 'ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
    ]

    const chatColumns = [
        { key: 'name', label: 'Name', nowrap: true },
        { key: 'time', label: 'Time', nowrap: true },
        { key: 'message', label: 'Message' },
    ]

    return (
        <Box>
            <PageHeader title="All rooms" subtitle="Every meeting room, who was invited and what was said." />

            <DataTable
                columns={columns}
                rows={room}
                loading={loading}
                getRowKey={(row) => row.meeting_id}
                empty={<EmptyState title="No rooms yet" description="Create one from the Create room screen." />}
            />

            <DetailDialog
                open={Boolean(detailedRoom)}
                onClose={() => setDetailedRoom(null)}
                title={detailedRoom?.name || 'Room'}
                subtitle={detailedRoom?.meeting_id ? `Meeting ID ${detailedRoom.meeting_id}` : undefined}
            >
                <Stack spacing={3}>
                    <DataTable
                        caption="Participants"
                        columns={participantColumns}
                        rows={detailedRoom?.names_of_participants}
                        getRowKey={(row, i) => row.id ?? i}
                        empty={<EmptyState title="Nobody invited yet" />}
                    />
                    <DataTable
                        caption="Messages"
                        columns={chatColumns}
                        rows={detailedRoom?.chat}
                        getRowKey={(row, i) => i}
                        empty={<EmptyState title="No messages" description="Nothing was sent in this room's chat." />}
                    />
                </Stack>
            </DetailDialog>
        </Box>
    )
}

export default SeeAllRoom
