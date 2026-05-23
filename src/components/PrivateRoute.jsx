import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // FIX: Esperar a que Supabase confirme la sesión antes de redirigir
  // Evita el flash de redireccion al recargar /admin con sesion activa
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#d4af37",
        fontFamily: "DM Sans,sans-serif",
        fontSize: ".9rem",
      }}>
        Verificando sesión...
      </div>
    )
  }

  // FIX: Redirige a /login en lugar de / para mejor UX
  if (!user) return <Navigate to="/login" replace />

  return children
}
