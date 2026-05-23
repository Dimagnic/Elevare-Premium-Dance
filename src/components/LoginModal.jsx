import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError("Credenciales incorrectas")
      setLoading(false)
    } else {
      onClose()
      navigate("/admin")
    }
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,.75)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#111", border:"1px solid rgba(212,175,55,.15)", borderRadius:14, padding:"2.5rem", width:"100%", maxWidth:400, boxShadow:"0 25px 60px rgba(0,0,0,.6)" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:48, height:48, borderRadius:10, background:"linear-gradient(135deg,#ff7a00,#d4af37)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"1.2rem", color:"#0a0a0a", margin:"0 auto .75rem" }}>EV</div>
          <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.6rem", color:"#f5f5f5", margin:0 }}>Acceso Admin</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ display:"block", fontSize:".72rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", color:"#d4af37", marginBottom:".4rem" }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus
              style={{ width:"100%", background:"rgba(0,0,0,.4)", border:"1px solid rgba(212,175,55,.25)", borderRadius:8, padding:".7rem 1rem", color:"#f5f5f5", fontFamily:"DM Sans,sans-serif", fontSize:".9rem", outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"1.5rem" }}>
            <label style={{ display:"block", fontSize:".72rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", color:"#d4af37", marginBottom:".4rem" }}>Contrasena</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="........"
              style={{ width:"100%", background:"rgba(0,0,0,.4)", border:"1px solid rgba(212,175,55,.25)", borderRadius:8, padding:".7rem 1rem", color:"#f5f5f5", fontFamily:"DM Sans,sans-serif", fontSize:".9rem", outline:"none", boxSizing:"border-box" }} />
          </div>
          {error && <div style={{ background:"rgba(255,0,0,.1)", border:"1px solid rgba(255,0,0,.3)", borderRadius:8, padding:".75rem", color:"#ff6b6b", fontSize:".82rem", marginBottom:"1rem" }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ width:"100%", background:"linear-gradient(135deg,#ff7a00,#d4af37)", color:"#fff", fontFamily:"DM Sans,sans-serif", fontWeight:700, fontSize:".95rem", padding:".85rem", borderRadius:8, border:"none", cursor:loading?"not-allowed":"pointer", opacity:loading?".7":"1" }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <button onClick={onClose} style={{ display:"block", width:"100%", marginTop:".75rem", background:"none", border:"none", color:"#666", fontSize:".82rem", cursor:"pointer", textAlign:"center" }}>Cancelar</button>
      </div>
    </div>
  )
}
