import React from 'react'
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material'
import EmptyState from './EmptyState'

/**
 * The single table used across every list screen.
 *
 * columns: [{ key, label, align?, width?, nowrap?, render?(row, index) }]
 * A column without `render` reads `row[key]`.
 */
const DataTable = ({
    columns,
    rows,
    getRowKey,
    caption,
    empty,
    loading = false,
    dense = false,
    maxHeight,
}) => {
    const list = rows || []

    return (
        <Box>
            {caption && (
                <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>{caption}</Typography>
            )}
            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 2, maxHeight, overflowX: 'auto' }}
            >
                <Table size={dense ? 'small' : 'medium'} stickyHeader={Boolean(maxHeight)}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.key}
                                    align={col.align || 'left'}
                                    sx={{ width: col.width }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row, i) => (
                            <TableRow
                                key={getRowKey ? getRowKey(row, i) : i}
                                hover
                                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        align={col.align || 'left'}
                                        sx={col.nowrap ? { whiteSpace: 'nowrap' } : undefined}
                                    >
                                        {col.render ? col.render(row, i) : row[col.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {list.length === 0 && (
                            <TableRow hover={false}>
                                <TableCell colSpan={columns.length} sx={{ border: 0, p: 0 }}>
                                    {loading
                                        ? <EmptyState title="Loading…" description="Fetching the latest data." />
                                        : (empty || <EmptyState />)}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default DataTable
