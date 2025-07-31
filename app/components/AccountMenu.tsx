import { AddCircleRounded, Close, Logout } from '@mui/icons-material'
import {
  Avatar,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'

export default function AccountMenu() {
  const theme = useTheme()

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
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{
            padding: 0.5,
            [`&:focus`]: {
              outline: `1px solid ${theme.palette.primary.main}`,
              outlineOffset: 1,
            },
          }}
        >
          <Avatar
            sx={{
              backgroundColor: theme.palette.primary.main,
              width: 32,
              height: 32,
            }}
          >
            A
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          marginTop: 1,
          marginRight: 1,
          '& .MuiPaper-root': {
            backgroundColor: '#E9EEF6',
            borderRadius: 7,
            width: theme.spacing(50),
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
        <Stack spacing={2} sx={{ alignItems: 'center', padding: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              position: 'relative',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBlock: 1,
              margin: -2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', fontWeight: 500 }}
            >
              myemail@company.com
            </Typography>
            <IconButton
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            >
              <Close onClick={handleCloseUserMenu} />
            </IconButton>
          </Stack>
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ height: '4.5rem', width: '4.5rem' }}>A</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 400 }}>
              Hi, FirstName!
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ borderRadius: 7, fontSize: '14px', fontWeight: 500 }}
            >
              Manage your Google Account
            </Button>
          </Stack>
          <ButtonGroup
            variant="contained"
            color="inherit"
            disableElevation
            fullWidth
            sx={{
              gap: 0.5,
              [`& .MuiButton-root`]: {
                borderRight: 'none',
                paddingBlock: 2,
                justifyContent: 'start',
                backgroundColor: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.grey[300],
                },
              },
              [`& .MuiButton-root:first-of-type`]: {
                borderTopLeftRadius: theme.spacing(7),
                borderBottomLeftRadius: theme.spacing(7),
                borderTopRightRadius: theme.spacing(1),
                borderBottomRightRadius: theme.spacing(1),
              },
              [`& .MuiButton-root:last-of-type`]: {
                borderTopLeftRadius: theme.spacing(1),
                borderBottomLeftRadius: theme.spacing(1),
                borderTopRightRadius: theme.spacing(7),
                borderBottomRightRadius: theme.spacing(7),
              },
              [`& .MuiButton-startIcon`]: {
                paddingInlineStart: theme.spacing(1),
              },
              [`& .MuiButton-startIcon > svg`]: {
                height: '1.5rem',
                width: '1.5rem',
              },
            }}
          >
            <Button startIcon={<AddCircleRounded />}>Add account</Button>
            <Button startIcon={<Logout />}>Sign out</Button>
          </ButtonGroup>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
              [`& .MuiButton-root`]: {
                fontSize: '12px',
                fontWeight: 300,
              },
            }}
          >
            <Button color="inherit" size="small">
              Privacy Policy
            </Button>
            <Typography sx={{ fontSize: '8px' }}>•</Typography>
            <Button color="inherit" size="small">
              Terms of Service
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </>
  )
}
