import { Box, Button, Container, IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import { forms } from '@/app/data/forms'
import FormCard from '@/app/components/FormCard'
import Grid from '@mui/material/Grid'

export default function RecentFormsSection() {
  return (
    <Container sx={{ width: { xs: '100%', sm: '90%', md: '80%' } }}>
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
      <Grid
        container
        sx={{ paddingBlockEnd: 6, gap: 2 }}
        columns={{ xs: 3, sm: 4, lg: 5 }}
      >
        {forms.map((form, index) => (
          <Grid key={index}>
            <FormCard form={form} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
