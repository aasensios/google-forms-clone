'use client'

import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import { forms } from '@/app/data/forms'
import FormCard from '@/app/components/FormCard'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

export default function RecentFormsSection() {
  return (
    <Box>
      <Container maxWidth="lg">
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
          <Button size="small" color="inherit" endIcon={<ArrowDropDownIcon />}>
            Owned by anyone
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small">
              <ViewListOutlinedIcon />
            </IconButton>
            <IconButton size="small">
              <SortByAlphaIcon />
            </IconButton>
            <IconButton size="small">
              <FolderOpenOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ paddingBlockEnd: 6 }}>
          {forms.map((form, index) => (
            <Grid key={index} xs={4} md={3}>
              <FormCard form={form} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
