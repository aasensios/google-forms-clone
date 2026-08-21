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
        data-focused={focused || undefined}
        sx={(theme) => ({
          borderRadius: 7,
          padding: 0.5,
          alignItems: 'center',
          width: '720px',
          transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          bgcolor: 'grey.100',
          ...theme.applyStyles('dark', { bgcolor: 'grey.800' }),
          '&[data-focused]': {
            bgcolor: 'background.paper',
          },
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
            data-empty={value.length === 0 || undefined}
            sx={{
              visibility: 'visible',
              '&[data-empty]': {
                visibility: 'hidden',
              },
            }}
            onClick={() => setValue('')}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Stack>
    </ClickAwayListener>
  )
}
