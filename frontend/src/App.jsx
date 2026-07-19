import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import VolunteerPage from './pages/VolunteerPage'
import OrganizerPage from './pages/OrganizerPage'
import EmergencyPage from './pages/EmergencyPage'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/organizer" element={<OrganizerPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
