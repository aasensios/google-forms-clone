'use client'

import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export default function NewFormSection() {
  return (
    <Box sx={{ backgroundColor: 'grey.200' }}>
      <Container
        maxWidth="lg"
        sx={{ display: 'flex', alignItems: 'center', paddingBlock: 2 }}
      >
        <Typography component="span">Start a new form</Typography>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Button color="inherit" endIcon={<UnfoldMoreIcon />}>
          Template gallery
        </Button>
        <Divider orientation="vertical" flexItem sx={{ marginInline: 1 }} />
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Container>
    </Box>
  )
}
