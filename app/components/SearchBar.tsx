import { useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputBase,
  Tooltip,
} from '@mui/material'

export default function SearchBar() {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <Box
        sx={{
          borderRadius: 2,
          backgroundColor: 'grey.200',
          paddingInline: 1,
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          maxWidth: '720px',
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
          sx={{ padding: 1 }}
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
      </Box>
    </ClickAwayListener>
  )
}
