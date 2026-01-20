import EditForm from './_components/edit-form'
import type { FormTemplate } from '@/app/types'

// Mock initial data - in a real app this would come from an API/DB
const INITIAL_FORM: FormTemplate = {
  id: '1',
  title: 'Untitled Form',
  description: 'Form description',
  questions: [
    {
      id: 'q1',
      title: 'Untitled Question',
      type: 'radio',
      options: ['Option 1'],
      required: false,
    },
  ],
}

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // In a real app, we would fetch the form data here using the id
  const form = { ...INITIAL_FORM, id }

  return <EditForm initialForm={form} />
}
