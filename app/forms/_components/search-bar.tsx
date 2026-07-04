import { useState } from 'react'
import { Close, Search } from '@mui/icons-material'
import {
  ClickAwayListener,
  IconButton,
  InputBase,
  Stack,
  Tooltip,
} from '@mui/material'

export default function SearchBar() {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <Stack
        direction="row"
        spacing={1}
        sx={(theme) => ({
          borderRadius: 7,
          padding: 0.5,
          alignItems: 'center',
          width: '720px',
          transition: theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
          bgcolor: focused ? 'background.paper' : 'grey.100',
          ...(!focused
            ? theme.applyStyles('dark', { bgcolor: 'grey.800' })
            : {}),
        })}
      >
        <Tooltip title="Search">
          <IconButton>
            <Search />
          </IconButton>
        </Tooltip>
        <InputBase
          value={value}
          placeholder="Search"
          inputProps={{ 'aria-label': 'Search bar' }}
          fullWidth
          onChange={(event) => setValue(event.target.value)}
          onClick={() => setFocused(true)}
        />
        <Tooltip title="Clear search">
          <IconButton
            sx={{ visibility: value.length === 0 ? 'hidden' : 'visible' }}
            onClick={() => setValue('')}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Stack>
    </ClickAwayListener>
  )
}
