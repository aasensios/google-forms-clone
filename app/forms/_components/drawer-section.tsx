import type { DrawerSection } from '@/app/types'
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material'

export default function DrawerSectionList({ items }: { items: DrawerSection }) {
  const theme = useTheme()

  return (
    <>
      <List disablePadding>
        {items.map((item, index) => (
          <ListItem key={item.name} disablePadding sx={{ paddingRight: 1 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: theme.spacing(7),
                borderBottomRightRadius: theme.spacing(7),
                paddingBlock: 0.5,
                paddingInlineStart: 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: '2.5rem' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                slotProps={{
                  primary: {
                    fontSize: '14px',
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ marginBlock: 1 }} />
    </>
  )
}
