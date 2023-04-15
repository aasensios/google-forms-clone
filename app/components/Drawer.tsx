import { useState } from 'react'
import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import type { DrawerSection } from '@/app/types'
import { drawerSections } from '@/app/data/drawer'

export default function Drawer() {
  const [open, setOpen] = useState(false)

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setOpen(open)
    }

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ marginInlineEnd: 1 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <MuiDrawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ '& .MuiBackdrop-root': { opacity: '0 !important' } }}
      >
        <Box
          sx={{ width: 280, paddingBlock: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {drawerSections.map((section, index) => (
            <DrawerSection key={index} items={section} />
          ))}
        </Box>
      </MuiDrawer>
    </>
  )
}

function DrawerSection({ items }: { items: DrawerSection }) {
  return (
    <>
      <List disablePadding>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ paddingRight: 1 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
                paddingBlock: 0.5,
                paddingInlineStart: 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: '2.5rem' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ marginBlock: 2 }} />
    </>
  )
}
