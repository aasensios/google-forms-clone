import {
  Box,
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
          position: 'relative',
          '&:hover': {
            cursor: 'pointer',
            border: (theme) => `1px solid ${theme.palette.secondary.main}`,
          },
        }}
      >
        <CardMedia
          sx={{
            height: 170,
            width: 'auto',
            objectFit: 'cover',
          }}
          image={form.thumbnailUrl}
          title={form.name}
        />
        <CardContent
          sx={{
            ':last-child': {
              padding: 1.5,
            },
          }}
        >
          <Typography
            variant="body2"
            gutterBottom
            noWrap
            sx={{ fontWeight: 500 }}
          >
            {form.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              paddingInlineEnd: 2,
            }}
          >
            <ViewListIcon color="secondary" fontSize="small" />
            {form.shared && (
              <PeopleAltOutlinedIcon color="inherit" fontSize="small" />
            )}
            <Typography variant="caption" color="text.secondary" noWrap>
              Opened {form.lastOpen}
            </Typography>
            <IconButton
              aria-label="Form actions"
              size="small"
              sx={{
                position: 'absolute',
                right: 4,
                bottom: 4,
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </CardContent>
      </MuiCard>
    </Stack>
  )
}
