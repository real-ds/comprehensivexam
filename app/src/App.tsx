import { Routes, Route } from 'react-router-dom'
import { SidePanel } from './components/SidePanel'
import { Home }      from './pages/Home'
import { Study }     from './pages/Study'
import { Test }      from './pages/Test'
import { Exam }      from './pages/Exam'
import { Progress }  from './pages/Progress'

function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SidePanel />
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile top-bar spacer */}
        <div className="lg:hidden h-16" aria-hidden="true" />
        <div className="flex-1 w-full max-w-[800px] mx-auto px-8 py-8 max-lg:px-6">
          <Routes>
            <Route path="/"         element={<Home />}     />
            <Route path="/study"    element={<Study />}    />
            <Route path="/test"     element={<Test />}     />
            <Route path="/exam"     element={<Exam />}     />
            <Route path="/progress" element={<Progress />} />
            <Route path="*"         element={<Home />}     />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App