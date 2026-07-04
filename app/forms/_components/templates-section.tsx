import { MoreVert, UnfoldMore } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import { TEMPLATES } from '../constants/templates'
import TemplateCard from './template-card'

export default function TemplatesSection() {
  return (
    <Box sx={(theme) => ({
      backgroundColor: 'grey.200',
      ...theme.applyStyles('dark', { backgroundColor: 'grey.900' }),
    })}>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              endIcon={<UnfoldMore />}
              sx={{ paddingInline: 2 }}
            >
              Template gallery
            </Button>
            <Divider orientation="vertical" flexItem sx={{ marginInline: 1 }} />
            <IconButton size="small" sx={{ borderRadius: '50%' }}>
              <MoreVert />
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
          {TEMPLATES.map((template) => (
            <TemplateCard key={template.name} template={template} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}
