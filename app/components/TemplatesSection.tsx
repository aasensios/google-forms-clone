import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { templates } from '@/app/data/templates'
import TemplateCard from '@/app/components/TemplateCard'

export default function TemplatesSection() {
  return (
    <Box sx={{ backgroundColor: 'grey.200' }}>
      <Container sx={{ width: { xs: '100%', sm: '90%', md: '80%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBlock: 2,
          }}
        >
          <Typography component="h2">Start a new form</Typography>
          <Box sx={{ display: 'flex' }}>
            <Button
              color="inherit"
              endIcon={<UnfoldMoreIcon />}
              sx={{ paddingInline: 2 }}
            >
              Template gallery
            </Button>
            <Divider orientation="vertical" flexItem sx={{ marginInline: 1 }} />
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        <Stack
          direction="row"
          sx={{ paddingBlockEnd: 6, flexWrap: 'wrap', gap: 2 }}
        >
          {templates.map((template, index) => (
            <TemplateCard key={index} template={template} />
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
