'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Grid,
} from '@mui/material'
import {
  ArrowDropDown,
  FolderOpenOutlined,
  SortByAlpha,
  ViewListOutlined,
} from '@mui/icons-material'
import type { Form } from '@/app/types'
import initialForms from '@/app/data/forms.json'
import FormCard from './form-card'

export default function RecentFormsSection() {
  const [forms, setForms] = useState<Form[]>(initialForms)

  const handleRename = (id: string, newName: string) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    )
  }

  const handleRemove = (id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <Container
      sx={{
        width: {
          xs: '100%',
          md: '43rem',
          lg: '72rem',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBlock: 2,
        }}
      >
        <Typography component="h2" sx={{ fontWeight: 500 }}>
          Recent forms
        </Typography>
        <Button size="small" color="inherit" endIcon={<ArrowDropDown />}>
          Owned by anyone
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small">
            <ViewListOutlined />
          </IconButton>
          <IconButton size="small">
            <SortByAlpha />
          </IconButton>
          <IconButton size="small">
            <FolderOpenOutlined />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          paddingBlockEnd: 6,
          gap: 2.5,
        }}
      >
        {forms.map((form) => (
          <Grid key={form.id}>
            <FormCard
              form={form}
              onRename={handleRename}
              onRemove={handleRemove}
            />
          </Grid>
        ))}
      </Box>
    </Container>
  )
}
