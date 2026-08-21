'use client'

import { useSyncExternalStore } from 'react'
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
import {
  deleteForm,
  getFormsSnapshot,
  getServerFormsSnapshot,
  renameForm,
  subscribeForms,
} from '@/app/lib/forms-store'
import type { Form } from '@/app/types'
import { TEMPLATES } from '../constants/templates'
import FormCard from './form-card'

export default function RecentFormsSection() {
  const templates = useSyncExternalStore(
    subscribeForms,
    getFormsSnapshot,
    getServerFormsSnapshot,
  )

  const cards: Form[] = templates.map((t, i) => ({
    id: t.id,
    name: t.title || 'Untitled Form',
    thumbnailUrl: t.thumbnailUrl || TEMPLATES[i % TEMPLATES.length].thumbnailUrl,
    shared: false,
    lastOpen: '',
  }))

  const handleRename = (id: string, newName: string) => renameForm(id, newName)
  const handleRemove = (id: string) => deleteForm(id)

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
        {cards.map((form) => (
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
