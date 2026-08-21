import { CardMedia, Card as MuiCard, Stack, Typography } from '@mui/material'
import type { Template } from '@/app/types'
import { useRouter } from 'next/navigation'
import { createForm } from '@/app/lib/forms-store'

export default function TemplateCard({ template }: { template: Template }) {
  const router = useRouter()
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.target === event.currentTarget &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      router.push(`/forms/${crypto.randomUUID()}/edit`)
    }
  }
  return (
    <Stack spacing={1}>
      <MuiCard
        variant="outlined"
        elevation={0}
        role="button"
        tabIndex={0}
        aria-label={`Create form from template ${template.name}`}
        onClick={() => {
          const form = createForm(template.name)
          router.push(`/forms/${form.id}/edit`)
        }}
        onKeyDown={handleKeyDown}
        sx={{
          '&:hover': {
            cursor: 'pointer',
            border: (theme) => `1px solid ${theme.palette.primary.main}`,
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '-2px',
          },
        }}
      >
        <CardMedia
          sx={{
            height: 123,
            width: 'auto',
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
