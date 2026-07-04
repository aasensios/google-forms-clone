import {
  AddToDrive,
  Article,
  Description,
  GridOn,
  HelpOutlined,
  Settings,
  Videocam,
  ViewComfy,
} from '@mui/icons-material'
import type { DrawerSection } from '@/app/types'

export const DRAWER_SECTIONS: DrawerSection[] = [
  [
    { name: 'Docs', icon: <Article color="info" /> },
    { name: 'Sheets', icon: <GridOn color="success" /> },
    { name: 'Slides', icon: <ViewComfy color="warning" /> },
    { name: 'Vids', icon: <Videocam color="info" /> },
    { name: 'Forms', icon: <Description color="primary" /> },
  ],
  [
    { name: 'Settings', icon: <Settings /> },
    { name: 'Help & Feedback', icon: <HelpOutlined /> },
  ],
  [{ name: 'Drive', icon: <AddToDrive color="warning" /> }],
]
