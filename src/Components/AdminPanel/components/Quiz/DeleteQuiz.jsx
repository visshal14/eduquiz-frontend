import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import axios from "../../../../axios"
import { PageHeader, DataTable, EmptyState, useFeedback } from '../../../ui'

const DeleteQuiz = ({ teacher }) => {
    const notify = useFeedback()
    const [quizes, setQuizes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`/getAllQuiz/${teacher ? teacher : "all"}`).then((response) => {
            setLoading(false)
            if (response.data.errMsg) return notify('Could not load quizzes.', 'error')
            setQuizes(response.data)
        })
        // eslint-disable-next-line
    }, [teacher])

    const deleteQuiz = (id) => {
        axios.post(`/deleteQuiz`, { id }).then((response) => {
            if (response.data.errMsg) return notify('Could not delete the quiz.', 'error')
            setQuizes(response.data)
            notify('Quiz deleted.', 'success')
        })
            .catch(function (error) {
                console.log(error);
                notify('Could not reach the server.', 'error')
            });
    }

    const columns = [
        { key: 'quizId', label: 'Quiz ID', nowrap: true },
        { key: 'name', label: 'Name' },
        { key: 'owner', label: 'Teacher', render: (row) => row.owner?.name },
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
                    onClick={() => deleteQuiz(row.quizId)}
                >
                    Delete
                </Button>
            ),
        },
    ]

    return (
        <Box>
            <PageHeader title="Delete quiz" subtitle="Removing a quiz also removes its results." />
            <DataTable
                columns={columns}
                rows={quizes}
                loading={loading}
                getRowKey={(row) => row.quizId}
                empty={<EmptyState title="No quizzes yet" />}
            />
        </Box>
    )
}

export default DeleteQuiz
