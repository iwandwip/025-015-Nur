import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Monitoring } from '@/pages/Monitoring'
import { Control } from '@/pages/Control'
import { Profile } from '@/pages/Profile'
import { DeveloperSettings } from '@/pages/DeveloperSettings'
import { ThemeProvider } from '@/components/theme-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { Toaster } from 'sonner'

function App() {
  return (
    <ErrorBoundary showErrorDetails={import.meta.env.DEV}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <ErrorBoundary>
                <Sidebar />
              </ErrorBoundary>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Monitoring />} />
                  <Route path="/control" element={<Control />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/developer" element={<DeveloperSettings />} />
                </Routes>
              </ErrorBoundary>
            </div>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App