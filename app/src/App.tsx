import { Routes, Route } from 'react-router-dom'
import { SidePanel } from './components/SidePanel'
import { Home }      from './pages/Home'
import { Study }     from './pages/Study'
import { Test }      from './pages/Test'
import { Exam }      from './pages/Exam'
import { Progress }    from './pages/Progress'
import { Leaderboard } from './pages/Leaderboard'
import { useTheme } from './context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

function App() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SidePanel />
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <header className="hidden lg:block h-14 border-b border-border bg-bg/80 backdrop-blur-sm flex items-center justify-end px-8 z-30 sticky top-0" aria-label="Top bar">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-button border border-border text-text-muted hover:text-text hover:bg-panel transition-all duration-default flex items-center gap-2"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-label font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </header>
        <div className="flex-1 w-full max-w-[800px] mx-auto px-8 py-8 max-lg:px-6">
          <Routes>
            <Route path="/"         element={<Home />}     />
            <Route path="/study"    element={<Study />}    />
            <Route path="/test"     element={<Test />}     />
            <Route path="/exam"     element={<Exam />}     />
            <Route path="/progress"     element={<Progress />}     />
            <Route path="/leaderboard"  element={<Leaderboard />}  />
            <Route path="*"             element={<Home />}         />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App