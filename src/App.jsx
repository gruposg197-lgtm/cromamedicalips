import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Programas from './pages/Programas'
import Sedes from './pages/Sedes'
import Contacto from './pages/Contacto'
import Portal from './pages/Portal'
import SeguridadPaciente from './pages/SeguridadPaciente'
import Pqrsf from './pages/Pqrsf'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/programas" element={<Programas />} />
          <Route path="/sedes" element={<Sedes />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/seguridad-del-paciente" element={<SeguridadPaciente />} />
          <Route path="/pqrsf" element={<Pqrsf />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </BrowserRouter>
  )
}
