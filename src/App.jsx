import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./contexts/AuthContext"
import { useModal } from "./hooks/useModal"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Stats from "./components/Stats"
import Estilos from "./components/Estilos"
import Instructores from "./components/Instructores"
import Precios from "./components/Precios"
import Testimonios from "./components/Testimonios"
import Footer from "./components/Footer"
import FreeClassModal from "./components/FreeClassModal"
import WaButton from "./components/WaButton"
import PrivateRoute from "./components/PrivateRoute"
import LoginPage from "./pages/LoginPage"
import AdminPage from "./pages/AdminPage"
import "./index.css"

function HomePage() {
  const { isOpen, open, close } = useModal()
  return (
    <>
      <Header onOpenModal={open} />
      <main>
        <Hero onOpenModal={open} />
        <Stats />
        <Estilos />
        <Instructores />
        <Precios onOpenModal={open} />
        <Testimonios />
      </main>
      <Footer />
      <FreeClassModal isOpen={isOpen} onClose={close} />
      <WaButton />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* FIX: /admin ahora está protegido con PrivateRoute */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "DM Sans,sans-serif",
              borderRadius: "10px",
              background: "#111",
              color: "#f5f5f5",
              border: "1px solid rgba(212,175,55,.2)",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
