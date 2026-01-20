import { QuestionTypeOption } from '@/app/types'
import {
  ArrowDropDownCircle,
  CheckBox,
  RadioButtonChecked,
  ShortText,
  Subject,
} from '@mui/icons-material'

export const QUESTION_TYPES: QuestionTypeOption[] = [
  { value: 'text', label: 'Short answer', icon: <ShortText /> },
  { value: 'paragraph', label: 'Paragraph', icon: <Subject /> },
  { value: 'radio', label: 'Multiple choice', icon: <RadioButtonChecked /> },
  { value: 'checkbox', label: 'Checkboxes', icon: <CheckBox /> },
  { value: 'select', label: 'Dropdown', icon: <ArrowDropDownCircle /> },
]
