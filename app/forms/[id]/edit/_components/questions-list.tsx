'use client'

import type { Question } from '@/app/types'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableQuestion from './sortable-question'

export default function QuestionsList({
  questions,
  activeQuestionId,
  setActiveQuestionId,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  handleOptionChange,
  addOption,
  addOtherOption,
  removeOption,
  onDragEnd,
}: {
  questions: Question[]
  activeQuestionId: string | null
  setActiveQuestionId: (id: string | null) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  duplicateQuestion: (id: string) => void
  handleOptionChange: (qId: string, optIndex: number, value: string) => void
  addOption: (qId: string) => void
  addOtherOption: (qId: string) => void
  removeOption: (qId: string, optIndex: number) => void
  onDragEnd: (event: DragEndEvent) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <DndContext
      id="edit-form-questions"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={questions} strategy={verticalListSortingStrategy}>
        {questions.map((question, index) => (
          <SortableQuestion
            key={question.id}
            question={question}
            index={index}
            isActive={activeQuestionId === question.id}
            setActiveQuestionId={setActiveQuestionId}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            duplicateQuestion={duplicateQuestion}
            handleOptionChange={handleOptionChange}
            addOption={addOption}
            addOtherOption={addOtherOption}
            removeOption={removeOption}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
