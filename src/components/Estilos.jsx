import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useFadeUp } from "../hooks/useFadeUp"
import { DANCE_STYLES } from "../data/content"

function EstiloModal({ style, onClose }) {
  if (!style) return null
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,.8)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#111", border:"1px solid rgba(212,175,55,.15)", borderRadius:16, width:"100%", maxWidth:520, overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,.7)" }}>
        <div style={{ position:"relative", height:260 }}>
          <img src={style.image} alt={style.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #111 0%, transparent 60%)" }} />
          <button onClick={onClose} style={{ position:"absolute", top:"1rem", right:"1rem", background:"rgba(0,0,0,.5)", border:"1px solid rgba(255,255,255,.2)", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>x</button>
          <h2 style={{ position:"absolute", bottom:"1.25rem", left:"1.5rem", fontFamily:"Cormorant Garamond,serif", fontSize:"2rem", fontWeight:700, color:"#f5f5f5", margin:0 }}>{style.name}</h2>
        </div>
        <div style={{ padding:"1.5rem 1.75rem 2rem" }}>
          <p style={{ color:"#ccc", lineHeight:1.7, fontSize:".95rem", marginBottom:"1.5rem" }}>{style.description}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
            {[["Niveles","Principiante, Intermedio, Avanzado"],["Duración","60 min por clase"],["Modalidad","Grupal e individual"],["Horarios","Lun a Sab, 7am - 10pm"]].map(([label,value])=>(
              <div key={label} style={{ background:"rgba(212,175,55,.05)", border:"1px solid rgba(212,175,55,.1)", borderRadius:10, padding:".75rem 1rem" }}>
                <div style={{ fontSize:".65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#d4af37", marginBottom:".25rem" }}>{label}</div>
                <div style={{ fontSize:".82rem", color:"#ccc" }}>{value}</div>
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ width:"100%", background:"linear-gradient(135deg,#ff7a00,#d4af37)", color:"#fff", fontFamily:"DM Sans,sans-serif", fontWeight:700, fontSize:".95rem", padding:".85rem", borderRadius:8, border:"none", cursor:"pointer" }}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

export default function Estilos() {
  const ref = useFadeUp()
  const [selected, setSelected] = useState(null)
  const [styles, setStyles] = useState(DANCE_STYLES)
  const [header, setHeader] = useState({ titulo: "El baile en su <gold>maxima expresion</gold>", subtitulo: "Desde la elegancia del ballet hasta la energia explosiva del hip-hop. Encontraras tu estilo." })

  useEffect(() => {
    supabase.from("cms_settings").select("key,value")
      .in("key", ["estilos_header", "estilos_items"])
      .then(({ data }) => {
        if (!data?.length) return
        const map = {}
        data.forEach(r => { if (r.value) map[r.key] = r.value })
        if (map.estilos_header) { try { setHeader(JSON.parse(map.estilos_header)) } catch {} }
        if (map.estilos_items) { try { setStyles(JSON.parse(map.estilos_items)) } catch {} }
      })
  }, [])

  const tituloWords = header.titulo.split("<gold>")
  const beforeGold = tituloWords[0]
  const afterGold = tituloWords[1]?.split("</gold>")
  const goldText = afterGold?.[0] || ""
  const afterText = afterGold?.[1] || ""

  return (
    <section id="estilos" className="section-pad" ref={ref}>
      <EstiloModal style={selected} onClose={() => setSelected(null)} />
      <div className="container">
        <div className="fade-up" style={{ marginBottom:"3rem" }}>
          <div className="section-label">Nuestros estilos</div>
          <h2 className="section-title">{beforeGold}<span className="gold">{goldText}</span>{afterText}</h2>
          <p className="section-sub">{header.subtitulo}</p>
        </div>
        <div className="grid-3">
          {styles.map((style, i) => (
            <div key={style.id || i} className="style-card fade-up" style={{ transitionDelay:`${i*0.1}s`, cursor:"pointer" }} onClick={() => setSelected(style)}>
              <img src={style.image} alt={style.name} loading="lazy" />
              <div className="style-card-overlay" />
              <div className="style-card-body">
                <h3>{style.name}</h3>
                <p>{style.description}</p>
                <span className="style-card-btn">Mas informacion &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
