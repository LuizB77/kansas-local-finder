import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import BusinessDetail from './pages/BusinessDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Home />}           />
        <Route path="/results"      element={<Results />}        />
        <Route path="/business/:id" element={<BusinessDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
