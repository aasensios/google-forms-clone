'use client'

import { Paper, TextField } from '@mui/material'

export default function FormTitleCard({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}) {
  return (
    <Paper
      sx={{
        p: 3,
        borderTop: '8px solid',
        borderTopColor: 'primary.main',
        borderRadius: 2,
      }}
    >
      <TextField
        fullWidth
        variant="standard"
        placeholder="Form title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '2rem' } }}
      />
      <TextField
        fullWidth
        variant="standard"
        placeholder="Form description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        multiline
      />
    </Paper>
  )
}
