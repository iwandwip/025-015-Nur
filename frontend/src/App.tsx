import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Monitoring } from '@/pages/Monitoring'
import { Profile } from '@/pages/Profile'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <div className="flex min-h-screen bg-background">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Monitoring />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App