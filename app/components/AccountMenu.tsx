import React, { ReactNode, useState } from 'react'
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

function SmallButton({ children }: { children: ReactNode }) {
  return (
    <Button
      color="inherit"
      size="small"
      sx={{ fontSize: '12px', fontWeight: 400 }}
    >
      {children}
    </Button>
  )
}

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
      <Tooltip title="Account">
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
          <Stack
            spacing={1}
            sx={{
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
              backgroundColor: 'common.white',
              padding: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                alt="Avatar"
                src="/some-image.jpg"
                sx={{ height: '3.5rem', width: '3.5rem' }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  My Name
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  myemail@company.com
                </Typography>
              </Box>
            </Box>
            <Box sx={{ alignSelf: 'start', paddingInline: 9 }}>
              <Button variant="outlined" size="small" color="inherit">
                Manage your account
              </Button>
            </Box>
          </Stack>
          <MenuItem
            sx={{
              paddingBlock: 1.5,
              paddingInline: 4,
              backgroundColor: 'background.default',
              borderBottomLeftRadius: '1rem',
              borderBottomRightRadius: '1rem',
            }}
          >
            <ListItemIcon>
              <PersonAddAltIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ sx: { fontSize: 'smaller' } }}
            >
              Add another account
            </ListItemText>
          </MenuItem>
        </Stack>
        <MenuItem
          sx={{ paddingBlock: 1.5, paddingInline: 5, marginInline: -1 }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ sx: { fontSize: 'smaller' } }}
          >
            Sign out
          </ListItemText>
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
          <SmallButton>Privacy Policy</SmallButton>
          <Typography variant="caption">•</Typography>
          <SmallButton>Terms of Service</SmallButton>
        </Box>
      </Menu>
    </>
  )
}
