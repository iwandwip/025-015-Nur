import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Monitoring } from '@/pages/Monitoring'
import { Profile } from '@/pages/Profile'
import { Toaster } from 'sonner'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Monitoring />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  )
}

export default App