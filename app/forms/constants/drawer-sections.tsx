import {
  AddToDrive,
  Article,
  Description,
  Google,
  GridOn,
  HelpOutlined,
  Settings,
  Videocam,
  ViewComfy,
} from '@mui/icons-material'
import type { DrawerSection } from '@/app/types'

export const DRAWER_SECTIONS: DrawerSection[] = [
  [{ name: 'Google Forms', icon: <Google color="info" /> }],
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
