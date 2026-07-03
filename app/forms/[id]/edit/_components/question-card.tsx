'use client'

import { QUESTION_TYPES } from '@/app/forms/constants/question-types'
import type { Question, QuestionType } from '@/app/types'
import {
  ArrowDownward,
  ArrowUpward,
  CheckBox,
  ContentCopy,
  DeleteOutlined,
  DragHandle,
  MoreVert,
  RadioButtonChecked,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'

export default function QuestionCard({
  question,
  index,
  isActive,
  questionsLength,
  dragHandleProps,
  onClick,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: {
  question: Question
  index: number
  isActive: boolean
  questionsLength: number
  dragHandleProps?: object
  onClick: () => void
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMove: (index: number, direction: 'up' | 'down') => void
  onOptionChange: (qId: string, optIndex: number, value: string) => void
  onAddOption: (qId: string) => void
  onRemoveOption: (qId: string, optIndex: number) => void
}) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 3,
        borderLeft: isActive ? '6px solid' : '1px solid',
        borderLeftColor: isActive ? 'primary.main' : 'transparent',
        position: 'relative',
      }}
    >
      {/* Reorder Controls (Handle) */}
      <Box
        {...dragHandleProps}
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: isActive ? 1 : 0,
          cursor: 'grab',
          '&:hover': {
            opacity: 1,
          },
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DragHandle
          sx={{
            color: 'action.active',
          }}
        />
      </Box>

      {isActive ? (
        // Edit Mode
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              variant="filled"
              label="Question"
              value={question.title}
              onChange={(e) =>
                onUpdate(question.id, {
                  title: e.target.value,
                })
              }
            />
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={question.type}
                onChange={(e) =>
                  onUpdate(question.id, {
                    type: e.target.value as QuestionType,
                  })
                }
                displayEmpty
              >
                {QUESTION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Options Area based on Type */}
          {(question.type === 'radio' ||
            question.type === 'checkbox' ||
            question.type === 'select') && (
            <Box sx={{ pl: 1 }}>
              {question.options?.map((opt: string, i: number) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    gap: 1,
                  }}
                >
                  {question.type === 'radio' && (
                    <RadioButtonChecked color="disabled" />
                  )}
                  {question.type === 'checkbox' && (
                    <CheckBox color="disabled" />
                  )}
                  {question.type === 'select' && (
                    <Typography sx={{ width: 24, textAlign: 'center' }}>
                      {i + 1}.
                    </Typography>
                  )}

                  <TextField
                    variant="standard"
                    fullWidth
                    value={opt}
                    onChange={(e) =>
                      onOptionChange(question.id, i, e.target.value)
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => onRemoveOption(question.id, i)}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Box>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1,
                  gap: 1,
                }}
              >
                {(question.type === 'radio' ||
                  question.type === 'checkbox') && <Box sx={{ width: 24 }} />}
                {question.type === 'select' && <Box sx={{ width: 24 }} />}
                <Button
                  color="primary"
                  onClick={() => onAddOption(question.id)}
                >
                  Add option
                </Button>
              </Box>
            </Box>
          )}

          {/* Footer Actions */}
          <Divider sx={{ my: 2 }} />
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <IconButton
              onClick={() => onMove(index, 'up')}
              disabled={index === 0}
            >
              <ArrowUpward />
            </IconButton>
            <IconButton
              onClick={() => onMove(index, 'down')}
              disabled={index === questionsLength - 1}
            >
              <ArrowDownward />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton onClick={() => onDuplicate(question.id)}>
              <ContentCopy />
            </IconButton>
            <IconButton onClick={() => onDelete(question.id)}>
              <DeleteOutlined />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <FormControlLabel
              control={
                <Switch
                  checked={question.required}
                  onChange={(e) =>
                    onUpdate(question.id, {
                      required: e.target.checked,
                    })
                  }
                />
              }
              label="Required"
            />
            <IconButton>
              <MoreVert />
            </IconButton>
          </Stack>
        </Stack>
      ) : (
        // View Mode
        <Box onClick={onClick} sx={{ cursor: 'pointer' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {question.title || 'Question'}{' '}
            {question.required && <span style={{ color: 'red' }}>*</span>}
          </Typography>

          {question.type === 'text' && (
            <TextField
              disabled
              variant="standard"
              fullWidth
              placeholder="Short answer text"
            />
          )}

          {question.type === 'paragraph' && (
            <TextField
              disabled
              variant="standard"
              fullWidth
              multiline
              rows={2}
              placeholder="Long answer text"
            />
          )}

          {(question.type === 'radio' ||
            question.type === 'checkbox' ||
            question.type === 'select') && (
            <Box>
              {question.options?.map((opt: string, i: number) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    gap: 1,
                  }}
                >
                  {question.type === 'radio' && (
                    <RadioButtonChecked color="disabled" />
                  )}
                  {question.type === 'checkbox' && (
                    <CheckBox color="disabled" />
                  )}
                  {question.type === 'select' && (
                    <Typography sx={{ width: 24 }}>{i + 1}.</Typography>
                  )}
                  <Typography color="text.secondary">{opt}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  )
}
