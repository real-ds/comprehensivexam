import { Routes, Route } from 'react-router-dom'
import { SidePanel } from './components/SidePanel'
import { Home }      from './pages/Home'
import { Study }     from './pages/Study'
import { Test }      from './pages/Test'
import { Exam }      from './pages/Exam'
import { Progress }    from './pages/Progress'
import { Leaderboard } from './pages/Leaderboard'
import { useTheme } from './context/ThemeContext'
import { Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SidePanel sidebarOpen={sidebarOpen} />
      <main className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <header className="h-14 border-b border-border bg-bg/80 backdrop-blur-sm flex items-center justify-between px-8 z-30 sticky top-0" aria-label="Top bar">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-button border border-border text-text-muted hover:text-text hover:bg-panel transition-all duration-default"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
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