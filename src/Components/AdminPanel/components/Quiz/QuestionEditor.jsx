import React from 'react'
import { Box, Card, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const optionKeys = ['option1', 'option2', 'option3', 'option4']

/**
 * One question row — the question, its four options and the answer.
 * Shared by CreateQuiz and EditQuiz so the two stay in step.
 *
 * `value` may be undefined while CreateQuiz is mid-way through growing its
 * array, so every field reads through a `?? ''` guard to stay controlled.
 */
const QuestionEditor = ({ value, index, onChange, onDelete }) => {
    const field = (key) => ({
        value: value?.[key] ?? '',
        onChange: (event) => onChange(index, key, event.target.value),
    })

    return (
        <Card sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box
                    sx={{
                        mt: 0.5, width: 28, height: 28, flexShrink: 0,
                        display: 'grid', placeItems: 'center',
                        borderRadius: 1.5, bgcolor: 'action.hover',
                    }}
                >
                    <Typography variant="subtitle2" color="text.secondary">
                        {value?.serialNo ?? index + 1}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <TextField placeholder="Question" {...field('question')} />

                    <Box
                        sx={{
                            mt: 1.5,
                            display: 'grid',
                            gap: 1.5,
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                        }}
                    >
                        {optionKeys.map((key, i) => (
                            <TextField key={key} placeholder={`Option ${i + 1}`} {...field(key)} />
                        ))}
                    </Box>

                    <TextField
                        sx={{ mt: 1.5, maxWidth: { sm: '50%' } }}
                        placeholder="Correct answer"
                        helperText="Must match one of the options exactly"
                        {...field('answer')}
                    />
                </Box>

                {onDelete && (
                    <Tooltip title="Remove question">
                        <IconButton
                            onClick={() => onDelete(value?.serialNo ?? index + 1)}
                            sx={{ mt: 0.25, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
        </Card>
    )
}

export default QuestionEditor
