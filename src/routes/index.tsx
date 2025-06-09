import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl">Hello world</h1>
    </div>
  )
}
