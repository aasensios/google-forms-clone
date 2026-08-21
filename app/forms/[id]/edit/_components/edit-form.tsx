'use client'

import EditFormHeader from './edit-form-header'
import FormTitleCard from './form-title-card'
import QuestionsList from './questions-list'
import type { FormTemplate, Question, QuestionType } from '@/app/types'
import { arrayMove } from '@dnd-kit/sortable'
import { Add } from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  Container,
  Fab,
  Stack,
} from '@mui/material'
import { notFound } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { getFormsSnapshot, saveForm, subscribeForms } from '@/app/lib/forms-store'

const OTHER_LABEL = 'Other…'

export default function EditForm({ formId }: { formId: string }) {
  const forms = useSyncExternalStore(
    subscribeForms,
    getFormsSnapshot,
    () => null as FormTemplate[] | null,
  )

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const loading = forms === null
  const form = loading ? null : (forms.find((f) => f.id === formId) ?? null)

  const handleTitleChange = (value: string) => {
    if (!form) return
    saveForm({ ...form, title: value })
  }

  const handleDescriptionChange = (value: string) => {
    if (!form) return
    saveForm({ ...form, description: value })
  }

  const addQuestion = () => {
    if (!form) return
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      title: 'Question',
      type: 'radio',
      options: ['Option 1'],
      required: false,
    }
    saveForm({
      ...form,
      questions: [...form.questions, newQuestion],
    })
    setActiveQuestionId(newQuestion.id)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    if (!form) return
    saveForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q,
      ),
    })
  }

  const duplicateQuestion = (id: string) => {
    if (!form) return
    const questionIndex = form.questions.findIndex((q) => q.id === id)
    if (questionIndex === -1) return
    const newQuestion = { ...form.questions[questionIndex], id: crypto.randomUUID() }
    const questions = [...form.questions]
    questions.splice(questionIndex + 1, 0, newQuestion)
    saveForm({ ...form, questions })
    setActiveQuestionId(newQuestion.id)
  }

  const deleteQuestion = (id: string) => {
    if (!form) return
    saveForm({
      ...form,
      questions: form.questions.filter((q) => q.id !== id),
    })
    if (activeQuestionId === id) {
      setActiveQuestionId(null)
    }
  }

  const handleOptionChange = (
    qId: string,
    optIndex: number,
    value: string,
  ) => {
    if (!form) return
    saveForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === qId && q.options
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optIndex ? value : opt,
              ),
            }
          : q,
      ),
    })
  }

  const addOption = (qId: string) => {
    if (!form) return
    saveForm({
      ...form,
      questions: form.questions.map((q) => {
        if (q.id !== qId) return q
        const options = q.options || []
        const otherIndex = options.findIndex((opt) => opt === OTHER_LABEL)
        const maxNum = options.reduce((max, opt) => {
          const match = opt.match(/^Option (\d+)$/)
          return match ? Math.max(max, parseInt(match[1])) : max
        }, 0)
        const newOption = `Option ${maxNum + 1}`
        const newOptions = [...options]
        if (otherIndex !== -1) {
          newOptions.splice(otherIndex, 0, newOption)
        } else {
          newOptions.push(newOption)
        }
        return { ...q, options: newOptions }
      }),
    })
  }

  const addOtherOption = (qId: string) => {
    if (!form) return
    saveForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === qId && !q.options?.some((opt) => opt === OTHER_LABEL)
          ? { ...q, options: [...(q.options || []), OTHER_LABEL] }
          : q,
      ),
    })
  }

  const removeOption = (qId: string, optIndex: number) => {
    if (!form) return
    saveForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === qId && q.options
          ? { ...q, options: q.options.filter((_, i) => i !== optIndex) }
          : q,
      ),
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      if (!form) return
      const oldIndex = form.questions.findIndex((q) => q.id === active.id)
      const newIndex = form.questions.findIndex((q) => q.id === over.id)

      saveForm({
        ...form,
        questions: arrayMove(form.questions, oldIndex, newIndex),
      })
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!form) notFound()

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
        sx={(theme) => ({
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(3),
        })}
        onClick={addQuestion}
      >
        <Add />
      </Fab>
    </Box>
  )
}
