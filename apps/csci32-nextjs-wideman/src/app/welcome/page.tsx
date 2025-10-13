import Auth from '@/components/Auth'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-stone-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-700 mb-8">Welcome to My App</h1>
        <Auth />
      </div>
    </div>
  )
}
