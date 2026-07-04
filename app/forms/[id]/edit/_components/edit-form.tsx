'use client'

import EditFormHeader from './edit-form-header'
import FormTitleCard from './form-title-card'
import QuestionsList from './questions-list'
import type { FormTemplate, Question, QuestionType } from '@/app/types'
import { arrayMove } from '@dnd-kit/sortable'
import { Add } from '@mui/icons-material'
import { Box, Container, Fab, Stack, useTheme } from '@mui/material'
import { useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'

export default function EditForm({
  initialForm,
}: {
  initialForm: FormTemplate
}) {
  const theme = useTheme()

  const [form, setForm] = useState<FormTemplate>(initialForm)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    initialForm.questions[0]?.id || null,
  )
  const [activeTab, setActiveTab] = useState(0)

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({ ...prev, title: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setForm((prev) => ({ ...prev, description: value }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      title: 'Question',
      type: 'radio',
      options: ['Option 1'],
      required: false,
    }
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
    setActiveQuestionId(newQuestion.id)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q,
      ),
    }))
  }

  const duplicateQuestion = (id: string) => {
    const questionIndex = form.questions.findIndex((q) => q.id === id)
    if (questionIndex === -1) return

    const questionToDuplicate = form.questions[questionIndex]
    const newQuestion = {
      ...questionToDuplicate,
      id: crypto.randomUUID(),
    }

    const newQuestions = [...form.questions]
    newQuestions.splice(questionIndex + 1, 0, newQuestion)

    setForm((prev) => ({ ...prev, questions: newQuestions }))
    setActiveQuestionId(newQuestion.id)
  }

  const deleteQuestion = (id: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }))
    if (activeQuestionId === id) {
      setActiveQuestionId(null)
    }
  }

  const OTHER_LABEL = 'Other…'

  const handleOptionChange = (qId: string, optIndex: number, value: string) => {
    const question = form.questions.find((q) => q.id === qId)
    if (!question || !question.options) return

    const newOptions = [...question.options]
    newOptions[optIndex] = value
    updateQuestion(qId, { options: newOptions })
  }

  const addOption = (qId: string) => {
    const question = form.questions.find((q) => q.id === qId)
    if (!question) return
    const options = question.options || []
    const otherIndex = options.findIndex((opt) => opt === OTHER_LABEL)
    const newOptions = [...options]
    const maxNum = options.reduce((max, opt) => {
      const match = opt.match(/^Option (\d+)$/)
      return match ? Math.max(max, parseInt(match[1])) : max
    }, 0)
    const newOption = `Option ${maxNum + 1}`
    if (otherIndex !== -1) {
      newOptions.splice(otherIndex, 0, newOption)
    } else {
      newOptions.push(newOption)
    }
    updateQuestion(qId, { options: newOptions })
  }
  const addOtherOption = (qId: string) => {
    const question = form.questions.find((q) => q.id === qId)
    if (!question) return
    if (question.options?.some((opt) => opt === OTHER_LABEL)) return
    updateQuestion(qId, { options: [...(question.options || []), OTHER_LABEL] })
  }

  const removeOption = (qId: string, optIndex: number) => {
    const question = form.questions.find((q) => q.id === qId)
    if (!question || !question.options) return
    const newOptions = question.options.filter((_, i) => i !== optIndex)
    updateQuestion(qId, { options: newOptions })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setForm((prev) => {
        const oldIndex = prev.questions.findIndex((q) => q.id === active.id)
        const newIndex = prev.questions.findIndex((q) => q.id === over.id)

        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex),
        }
      })
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      <EditFormHeader
        title={form.title}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Container maxWidth="md" sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Stack spacing={2}>
            <FormTitleCard
              title={form.title}
              description={form.description}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
            />
            <QuestionsList
              questions={form.questions}
              activeQuestionId={activeQuestionId}
              setActiveQuestionId={(id) => setActiveQuestionId(id as string)}
              updateQuestion={updateQuestion}
              deleteQuestion={deleteQuestion}
              duplicateQuestion={duplicateQuestion}
              handleOptionChange={handleOptionChange}
              addOption={addOption}
              addOtherOption={addOtherOption}
              removeOption={removeOption}
              onDragEnd={handleDragEnd}
            />
          </Stack>
        )}
      </Container>
      <Fab
        color="primary"
        aria-label="add question"
        sx={{
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(3),
        }}
        onClick={addQuestion}
      >
        <Add />
      </Fab>
    </Box>
  )
}
