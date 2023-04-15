import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import type { DrawerSection } from '@/app/types'
import { drawerSections } from '@/app/data'

export default function Drawer({
  open,
  toggleDrawer,
}: {
  open: boolean
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void
}) {
  return (
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
