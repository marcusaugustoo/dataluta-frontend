import { lazy, Suspense, useEffect, useState } from 'react'
import { HubHomePage } from './pages/HubHomePage'

const CadastroAgrarioPage = lazy(() =>
  import('./agrario/pages/CadastroAgrarioPage').then((m) => ({ default: m.CadastroAgrarioPage })),
)
const CadastroFlorestaPage = lazy(() =>
  import('./floresta/pages/CadastroFlorestaPage').then((m) => ({
    default: m.CadastroFlorestaPage,
  })),
)

type ViewMode = 'hub' | 'floresta' | 'agrario'

function getInitialView(): ViewMode {
  const hash = window.location.hash.toLowerCase()
  if (hash.includes('floresta')) return 'floresta'
  if (hash.includes('agrario')) return 'agrario'
  return 'hub'
}

export function App() {
  const [activeView, setActiveView] = useState<ViewMode>(getInitialView)

  useEffect(() => {
    const handleHashChange = () => {
      setActiveView(getInitialView())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (view: ViewMode) => {
    setActiveView(view)
    if (view === 'hub') {
      window.history.pushState(null, '', window.location.pathname)
    } else {
      window.location.hash = view
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (activeView === 'floresta') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#17301D]" />}>
        <CadastroFlorestaPage onBackToHome={() => navigateTo('hub')} />
      </Suspense>
    )
  }

  if (activeView === 'agrario') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-[#1C1108] via-[#2B1B10] to-[#140C07]" />
        }
      >
        <CadastroAgrarioPage onBackToHome={() => navigateTo('hub')} />
      </Suspense>
    )
  }

  return (
    <HubHomePage
      onSelectForm={(form) => navigateTo(form)}
    />
  )
}

export default App
