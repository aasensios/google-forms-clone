import { Menu } from '@mui/icons-material'
import { Box, IconButton, Drawer as MuiDrawer } from '@mui/material'
import { useState } from 'react'
import { DRAWER_SECTIONS } from '../constants/drawer-sections'
import DrawerSectionList from './drawer-section'

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
        <Menu />
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
          {DRAWER_SECTIONS.map((section) => (
            <DrawerSectionList key={JSON.stringify(section)} items={section} />
          ))}
        </Box>
      </MuiDrawer>
    </>
  )
}
