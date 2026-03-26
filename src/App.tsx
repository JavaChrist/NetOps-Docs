import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EdfDocumentsProvider } from './features/edf-documents/EdfDocumentsProvider'
import { EdfDashboard } from './pages/EdfDashboard'
import { NewEdfDocumentPage } from './pages/NewEdfDocumentPage'
import { EdfDocumentEditPage } from './pages/EdfDocumentEditPage'

export default function App() {
  return (
    <EdfDocumentsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EdfDashboard />} />
          <Route path="/documents/new" element={<NewEdfDocumentPage />} />
          <Route path="/documents/:id" element={<EdfDocumentEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EdfDocumentsProvider>
  )
}
