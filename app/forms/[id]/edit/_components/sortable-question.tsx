'use client'

import type { Question } from '@/app/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import QuestionCard from './question-card'

export default function SortableQuestion({
  question,
  index,
  isActive,
  questionsLength,
  setActiveQuestionId,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  moveQuestion,
  handleOptionChange,
  addOption,
  removeOption,
}: {
  question: Question
  index: number
  isActive: boolean
  questionsLength: number
  setActiveQuestionId: (id: string) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  duplicateQuestion: (id: string) => void
  moveQuestion: (index: number, direction: 'up' | 'down') => void
  handleOptionChange: (qId: string, optIndex: number, value: string) => void
  addOption: (qId: string) => void
  removeOption: (qId: string, optIndex: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionCard
        question={question}
        index={index}
        isActive={isActive}
        questionsLength={questionsLength}
        dragHandleProps={{ ...attributes, ...listeners }}
        onClick={() => setActiveQuestionId(question.id)}
        onUpdate={updateQuestion}
        onDelete={deleteQuestion}
        onDuplicate={duplicateQuestion}
        onMove={moveQuestion}
        onOptionChange={handleOptionChange}
        onAddOption={addOption}
        onRemoveOption={removeOption}
      />
    </div>
  )
}
