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
import TemplateCard from '@/app/components/template-card'

export default function TemplatesSection() {
  return (
    <Box sx={{ backgroundColor: 'grey.200' }}>
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
            display: 'grid',
            gridTemplateColumns: '1fr auto',
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(164px, 1fr))',
            paddingBlockEnd: 6,
            gap: 2,
          }}
        >
          {templates.map((template) => (
            <TemplateCard key={template.name} template={template} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}
