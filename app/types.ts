type DrawerSectionItem = {
  name: string
  icon: React.ReactNode
}

export type DrawerSection = DrawerSectionItem[]

export type Template = {
  thumbnailUrl: string
  name: string
}

export type Form = {
  id: string
  thumbnailUrl: string
  name: string
  shared: boolean
  lastOpen: string
}

export type QuestionType =
  | 'text'
  | 'paragraph'
  | 'radio'
  | 'checkbox'
  | 'select'

export type QuestionTypeOption = {
  value: QuestionType
  label: string
  icon: React.ReactNode
}

export interface Question {
  id: string
  title: string
  description?: string
  type: QuestionType
  options?: string[]
  required: boolean
  shuffle?: boolean
}

export interface FormTemplate {
  id: string
  title: string
  description: string
  questions: Question[]
}
