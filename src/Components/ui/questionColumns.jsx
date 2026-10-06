import React from 'react'
import { Chip, Typography } from '@mui/material'

/**
 * DataTable columns for a list of quiz questions.
 *
 * The admin, teacher and student screens all render this same shape, but the
 * number field is `serialNo` on a quiz definition and `questionNo` on a
 * submitted attempt — hence `numberKey`.
 *
 * `withChosen` adds the student's answer next to the correct one, tinted by
 * whether they got it right.
 */
const questionColumns = ({ numberKey = 'serialNo', withChosen = false } = {}) => [
    { key: numberKey, label: '#', align: 'right', width: 56 },
    { key: 'question', label: 'Question' },
    { key: 'option1', label: 'Option 1' },
    { key: 'option2', label: 'Option 2' },
    { key: 'option3', label: 'Option 3' },
    { key: 'option4', label: 'Option 4' },
    {
        key: 'answer',
        label: 'Answer',
        render: (row) => <Typography variant="body2" fontWeight={600}>{row.answer}</Typography>,
    },
    ...(withChosen
        ? [{
            key: 'chosen',
            label: 'Chosen',
            render: (row) => (
                <Chip
                    size="small"
                    variant="outlined"
                    label={row.chosen || '—'}
                    color={row.chosen === row.answer ? 'success' : 'error'}
                />
            ),
        }]
        : []),
]

export default questionColumns
