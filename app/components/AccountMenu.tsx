import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import LogoutIcon from '@mui/icons-material/Logout'

export default function AccountMenu() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <>
      <Tooltip title="TrustMe Account">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Avatar" src="/some-image.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          marginTop: 1,
          marginRight: 1,
          '& .MuiPaper-root': {
            borderRadius: 6,
            width: '361px',
            backgroundColor: '#f3f6fc',
            padding: 1,
            // border: '0.5rem solid transparent',
          },
          '& .MuiList-root': {
            padding: 0,
          },
        }}
        id="account-menu"
        anchorEl={anchorElUser}
        keepMounted
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Stack spacing={0.5}>
          <Box
            sx={{
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
              backgroundColor: 'common.white',
              display: 'flex',
              gap: 2,
              padding: 2,
            }}
          >
            <Avatar
              alt="Avatar"
              src="/some-image.jpg"
              sx={{
                height: (theme) => theme.spacing(8),
                width: (theme) => theme.spacing(8),
              }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                My Name
              </Typography>
              <Typography variant="caption">myemail@company.com</Typography>
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                sx={{ marginBlockStart: 3 }}
              >
                Manage your account
              </Button>
            </Box>
          </Box>
          <MenuItem
            sx={{
              paddingBlock: 1.5,
              paddingInline: 5,
              backgroundColor: 'background.default',
              borderBottomLeftRadius: '1rem',
              borderBottomRightRadius: '1rem',
            }}
          >
            <ListItemIcon>
              <PersonAddAltIcon />
            </ListItemIcon>
            <ListItemText>Add another account</ListItemText>
          </MenuItem>
        </Stack>
        <MenuItem
          sx={{ paddingBlock: 1.5, paddingInline: 5, marginInline: -1 }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Sign out</ListItemText>
        </MenuItem>
        <Divider sx={{ margin: -1 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Button
            color="inherit"
            size="small"
            sx={{ fontSize: '12px', fontWeight: 400 }}
          >
            Privacy Policy
          </Button>
          <span>•</span>
          <Button
            color="inherit"
            size="small"
            sx={{ fontSize: '12px', fontWeight: 400 }}
          >
            Terms of Service
          </Button>
        </Box>
      </Menu>
    </>
  )
}
