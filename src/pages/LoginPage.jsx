import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError("Credenciales incorrectas"); setLoading(false) }
    else navigate("/admin")
  }

  const s = {
    page: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#050505", padding:"1rem" },
    card: { background:"#111", border:"1px solid rgba(212,175,55,.15)", borderRadius:12, padding:"2.5rem", width:"100%", maxWidth:420 },
    logo: { width:52, height:52, borderRadius:10, background:"linear-gradient(135deg,#ff7a00,#d4af37)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"1.3rem", color:"#0a0a0a", margin:"0 auto 1rem" },
    label: { display:"block", fontSize:".72rem", fontWeight:600, textTransform:"uppercase", color:"#d4af37", marginBottom:".4rem" },
    input: { width:"100%", background:"rgba(0,0,0,.4)", border:"1px solid rgba(212,175,55,.25)", borderRadius:8, padding:".7rem 1rem", color:"#f5f5f5", fontFamily:"DM Sans,sans-serif", fontSize:".9rem", outline:"none" },
    btn: { width:"100%", background:"#ff7a00", color:"#fff", fontFamily:"DM Sans,sans-serif", fontWeight:700, fontSize:".95rem", padding:".85rem", borderRadius:8, border:"none", cursor:"pointer" },
    back: { display:"block", width:"100%", marginTop:"1rem", background:"none", border:"none", color:"#999", fontSize:".82rem", cursor:"pointer", textAlign:"center" },
    err: { background:"rgba(255,0,0,.1)", border:"1px solid rgba(255,0,0,.3)", borderRadius:8, padding:".75rem", color:"#ff6b6b", fontSize:".82rem", marginBottom:"1rem" },
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={s.logo}>EV</div>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.8rem", color:"#f5f5f5", marginBottom:".25rem" }}>Panel Admin</h1>
          <p style={{ color:"#999", fontSize:".85rem" }}>Elevare Premium Dance</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:"1rem" }}>
            <label style={s.label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" style={s.input} />
          </div>
          <div style={{ marginBottom:"1.5rem" }}>
            <label style={s.label}>Contrasena</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={s.input} />
          </div>
          {error && <div style={s.err}>{error}</div>}
          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <button onClick={() => navigate("/")} style={s.back}>Volver al sitio</button>
      </div>
    </div>
  )
}