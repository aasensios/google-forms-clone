import BusinessIcon from '@mui/icons-material/Business'
import ArticleIcon from '@mui/icons-material/Article'
import GridOnIcon from '@mui/icons-material/GridOn'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'
import DescriptionIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import type { DrawerSection } from '@/app/types'

export const drawerSections: DrawerSection[] = [
  [
    {
      icon: <BusinessIcon color="info" />,
      name: 'Home',
    },
  ],
  [
    {
      icon: <ArticleIcon color="primary" />,
      name: 'Docs',
    },
    {
      icon: <GridOnIcon color="success" />,
      name: 'Sheets',
    },
    {
      icon: <ViewComfyIcon color="warning" />,
      name: 'Slides',
    },
    {
      icon: <DescriptionIcon color="secondary" />,
      name: 'Forms',
    },
  ],
  [
    {
      icon: <SettingsIcon />,
      name: 'Settings',
    },
    {
      icon: <HelpOutlineIcon />,
      name: 'Help & Feedback',
    },
  ],
  [
    {
      icon: <AddToDriveIcon />,
      name: 'Drive',
    },
  ],
]
