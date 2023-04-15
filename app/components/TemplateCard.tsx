import { CardMedia, Card as MuiCard, Stack, Typography } from '@mui/material'
import type { Template } from '@/app/data/templates'

export default function TemplateCard({ template }: { template: Template }) {
  return (
    <Stack spacing={1}>
      <MuiCard
        variant="outlined"
        elevation={0}
        sx={{
          '&:hover': {
            cursor: 'pointer',
            border: (theme) => `1px solid ${theme.palette.secondary.main}`,
          },
        }}
      >
        <CardMedia
          sx={{
            width: (theme) => theme.spacing(19),
            height: (theme) => theme.spacing(14.25),
          }}
          image={template.thumbnailUrl}
          title={template.name}
        />
      </MuiCard>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {template.name}
      </Typography>
    </Stack>
  )
}
