import {
  AddToDrive,
  Article,
  Description,
  Google,
  GridOn,
  HelpOutline,
  Settings,
  ViewComfy,
} from '@mui/icons-material'
import type { DrawerSection } from '@/app/types'

export const DRAWER_SECTIONS: DrawerSection[] = [
  [{ name: 'Google Forms', icon: <Google color="info" /> }],
  [
    { name: 'Docs', icon: <Article color="primary" /> },
    { name: 'Sheets', icon: <GridOn color="success" /> },
    { name: 'Slides', icon: <ViewComfy color="warning" /> },
    { name: 'Forms', icon: <Description color="secondary" /> },
  ],
  [
    { name: 'Settings', icon: <Settings /> },
    { name: 'Help & Feedback', icon: <HelpOutline /> },
  ],
  [{ name: 'Drive', icon: <AddToDrive /> }],
]
