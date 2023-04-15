import {
  Box,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Card as MuiCard,
  Stack,
  Typography,
} from '@mui/material'
import ViewListIcon from '@mui/icons-material/ViewList'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import type { Form } from '@/app/data/forms'

export default function FormCard({ form }: { form: Form }) {
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
            width: (theme) => theme.spacing(26),
            height: (theme) => theme.spacing(21),
          }}
          image={form.thumbnailUrl}
          title={form.name}
        />
        <CardContent sx={{ ':last-child': { padding: 2 } }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {form.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'space-between',
              gap: 0.5,
            }}
          >
            <ViewListIcon color="secondary" fontSize="small" />
            {form.shared && (
              <PeopleAltOutlinedIcon color="inherit" fontSize="small" />
            )}
            <Typography variant="caption" color="text.secondary">
              Opened {form.lastOpen}
            </Typography>
            <IconButton
              aria-label="Form actions"
              size="small"
              sx={{ alignSelf: 'end' }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </CardContent>
      </MuiCard>
    </Stack>
  )
}
