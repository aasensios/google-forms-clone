import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
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
        sx={{
          borderRadius: 7,
          backgroundColor: '#F0F4F9',
          padding: 0.5,
          alignItems: 'center',
          width: '720px',
          transition: (theme) =>
            theme.transitions.create('all', {
              duration: theme.transitions.duration.shortest,
            }),
          ...(focused && {
            backgroundColor: 'common.white',
            boxShadow: 2,
          }),
        }}
      >
        <Tooltip title="Search">
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <InputBase
          value={value}
          placeholder="Search"
          inputProps={{ 'aria-label': 'Search bar' }}
          fullWidth
          onChange={(event) => setValue(event.target.value)}
          onClick={() => setFocused((focused) => !focused)}
        />
        <Tooltip title="Clear search">
          <IconButton
            sx={{ visibility: value.length === 0 ? 'hidden' : 'visible' }}
            onClick={() => setValue('')}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </ClickAwayListener>
  )
}
