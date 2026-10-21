import { useEffect, useState } from 'react'
import { CadastroAgrarioPage } from './agrario/pages/CadastroAgrarioPage'
import { CadastroFlorestaPage } from './floresta/pages/CadastroFlorestaPage'
import { HubHomePage } from './pages/HubHomePage'

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
    return <CadastroFlorestaPage onBackToHome={() => navigateTo('hub')} />
  }

  if (activeView === 'agrario') {
    return <CadastroAgrarioPage onBackToHome={() => navigateTo('hub')} />
  }

  return (
    <HubHomePage
      onSelectForm={(form) => navigateTo(form)}
    />
  )
}

export default App
