import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Drawer from '@/app/components/Drawer'
import SearchBar from '@/app/components/SearchBar'
import AccountMenu from '@/app/components/AccountMenu'
import { Apps, Description } from '@mui/icons-material'

export default function AppBar() {
  return (
    <>
      <MuiAppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Drawer />
            <Description
              color="secondary"
              fontSize="large"
              sx={{ marginInlineEnd: 1 }}
            />
            <Typography
              component="h1"
              variant="h6"
              noWrap
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Forms
            </Typography>
          </Box>
          <SearchBar />
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex', alignItems: 'center' },
              gap: 1,
            }}
          >
            <IconButton aria-label="apps" color="inherit">
              <Apps />
            </IconButton>
            <AccountMenu />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </>
  )
}
