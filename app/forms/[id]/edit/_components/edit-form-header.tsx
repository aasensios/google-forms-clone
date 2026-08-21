'use client'

import {
  AppBar,
  Box,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import { ArrowBack, VisibilityOutlined } from '@mui/icons-material'
import { useParams, useRouter } from 'next/navigation'

export default function EditFormHeader({
  title,
  activeTab,
  onTabChange,
}: {
  title: string
  activeTab: number
  onTabChange: (newValue: number) => void
}) {
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  return (
    <AppBar position="sticky" color="default" sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton aria-label="Back to forms" onClick={() => router.push('/forms')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            {title || 'Untitled Form'}
          </Typography>
        </Box>
        <IconButton
          aria-label="preview"
          onClick={() => window.open(`/forms/${formId}/preview`, '_blank')}
        >
          <VisibilityOutlined />
        </IconButton>
      </Toolbar>
      <Tabs
        value={activeTab}
        onChange={(_, v) => onTabChange(v)}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Questions" />
        <Tab label="Responses" />
        <Tab label="Settings" />
      </Tabs>
    </AppBar>
  )
}
