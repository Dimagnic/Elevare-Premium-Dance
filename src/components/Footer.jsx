import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ceroLogo from "../assets/cero-logo.png"
import LoginModal from "./LoginModal"

const IgIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>)
const YtIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>)
const TkIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.06a8.23 8.23 0 004.83 1.56V7.18a4.85 4.85 0 01-1.06-.49z" /></svg>)
const FbIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>)
const ICON_MAP = { instagram: IgIcon, youtube: YtIcon, tiktok: TkIcon, facebook: FbIcon }

const FOOTER_DEFAULTS = {
  descripcion: "El estudio de baile más exclusivo de la ciudad. Más de 2,800 alumnos transformados a través del movimiento, la disciplina y la pasión.",
  redes: [{ tipo: "instagram", url: "#" }, { tipo: "youtube", url: "#" }],
  contacto: [
    { texto: "info@clavedtres.mx", url: "mailto:info@clavedtres.mx" },
    { texto: "+52 221 263 6042",   url: "tel:+522212636042" },
    { texto: "Av. Reforma 123, CDMX", url: "#" },
    { texto: "Lun-Sab 7am-10pm",   url: "#" },
  ]
}

export default function Footer() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [footer, setFooter] = useState(FOOTER_DEFAULTS)
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" })

  useEffect(() => {
    supabase.from("cms_settings").select("key,value").eq("key","footer_data")
      .then(({ data }) => {
        if (data?.[0]?.value) { try { setFooter(JSON.parse(data[0].value)) } catch {} }
      })
  }, [])

  return (
    <footer style={{ position:"relative" }}>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-icon">CT</div>
            <p className="footer-desc">{footer.descripcion}</p>
            <div style={{ display:"flex", gap:".5rem" }}>
              {footer.redes.map((r, i) => {
                const Icon = ICON_MAP[r.tipo]
                return Icon ? (
                  <a key={i} href={r.url} className="social-link" title={r.tipo} target="_blank" rel="noopener noreferrer"><Icon /></a>
                ) : null
              })}
            </div>
          </div>
          <div className="footer-col">
            <h4>Estudio</h4>
            <ul>
              {[["estilos","Estilos de baile"],["instructores","Instructores"],["precios","Precios y planes"],["testimonios","Testimonios"]].map(([id,label])=>(
                <li key={id}><a href={`#${id}`} onClick={e=>{e.preventDefault();scrollTo(id)}}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              {footer.contacto.map((c, i) => (
                <li key={i}><a href={c.url}>{c.texto}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Clave de Tres Dance Studio. Todos los derechos reservados.</p>
          <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
            <img src={ceroLogo} alt="Cero+" style={{ height:22, opacity:.7, filter:"brightness(1.2)" }} />
            <span style={{ color:"rgba(153,153,153,.5)", fontSize:".8rem" }}>Digital Innovation</span>
          </div>
        </div>
      </div>
      <button onClick={() => setLoginOpen(true)} title="Admin"
        style={{ position:"absolute", bottom:"1.25rem", right:"1.5rem", background:"none", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, color:"rgba(255,255,255,.15)", cursor:"pointer", fontSize:".7rem", padding:".3rem .5rem", letterSpacing:".05em", transition:"all .2s", fontFamily:"DM Sans,sans-serif" }}
        onMouseEnter={e=>{e.currentTarget.style.color="rgba(212,175,55,.6)";e.currentTarget.style.borderColor="rgba(212,175,55,.3)"}}
        onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.15)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}}>ADM</button>
    </footer>
  )
}
