import forms from '@/app/data/forms.json'

export async function GET(request: Request) {
  return new Response(JSON.stringify(forms), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name } = body

  const newForm = { id: crypto.randomUUID(), name }

  return new Response(JSON.stringify(newForm), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
