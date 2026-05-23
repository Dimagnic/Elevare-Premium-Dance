import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { DANCE_STYLES, INSTRUCTORS, PLANS, TESTIMONIALS } from "../data/content"

const STATUS_COLORS = { nuevo:"#b02240", contactado:"#60a5fa", inscrito:"#22c55e", descartado:"#666" }
const STATS_DEFAULTS = [
  { key:"stat_1", number:"+2,800", label:"Alumnos formados",         color:"orange" },
  { key:"stat_2", number:"12",     label:"Instructores certificados", color:"gold"   },
  { key:"stat_3", number:"8",      label:"Estilos de baile",          color:"orange" },
  { key:"stat_4", number:"97%",    label:"Satisfacción de alumnos",   color:"gold"   },
]
const FOOTER_DEFAULTS = {
  descripcion:"El estudio de baile más exclusivo de la ciudad. Más de 2,800 alumnos transformados a través del movimiento, la disciplina y la pasión.",
  redes:[{tipo:"instagram",url:"#"},{tipo:"youtube",url:"#"}],
  contacto:[{texto:"info@clavedtres.mx",url:"mailto:info@clavedtres.mx"},{texto:"+52 221 263 6042",url:"tel:+522212636042"},{texto:"Av. Reforma 123, CDMX",url:"#"},{texto:"Lun-Sab 7am-10pm",url:"#"}]
}

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // CRM
  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [filter, setFilter] = useState("todos")
  const [deletingId, setDeletingId] = useState(null)
  const [activeTab, setActiveTab] = useState("crm")

  // Logo
  const [currentLogoUrl, setCurrentLogoUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [logoMsg, setLogoMsg] = useState(null)

  // Hero
  const [hero, setHero] = useState({ hero_badge:"", hero_titulo:"", hero_parrafo:"" })
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroMsg, setHeroMsg] = useState(null)
  const [heroImgUrl, setHeroImgUrl] = useState("")
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false)
  const [heroImgMsg, setHeroImgMsg] = useState(null)

  // Stats
  const [stats, setStats] = useState(STATS_DEFAULTS)
  const [statsSaving, setStatsSaving] = useState(false)
  const [statsMsg, setStatsMsg] = useState(null)

  // Estilos
  const [estilosHeader, setEstilosHeader] = useState({ titulo:"El baile en su <gold>maxima expresion</gold>", subtitulo:"Desde la elegancia del ballet hasta la energia explosiva del hip-hop. Encontraras tu estilo." })
  const [estilosItems, setEstilosItems] = useState(DANCE_STYLES.map(s=>({...s})))
  const [estilosSaving, setEstilosSaving] = useState(false)
  const [estilosMsg, setEstilosMsg] = useState(null)
  const [uploadingEstiloIdx, setUploadingEstiloIdx] = useState(null)

  // Instructores
  const [instructores, setInstructores] = useState(INSTRUCTORS.map(i=>({...i, achievements:[...i.achievements], social:{...i.social}})))
  const [instSaving, setInstSaving] = useState(false)
  const [instMsg, setInstMsg] = useState(null)
  const [uploadingInstIdx, setUploadingInstIdx] = useState(null)

  // Planes
  const [planes, setPlanes] = useState(PLANS.map(p=>({...p, features:[...p.features]})))
  const [planesSaving, setPlanesSaving] = useState(false)
  const [planesMsg, setPlanesMsg] = useState(null)

  // Testimonios
  const [testimonios, setTestimonios] = useState(TESTIMONIALS.map(t=>({...t})))
  const [testiSaving, setTestiSaving] = useState(false)
  const [testiMsg, setTestiMsg] = useState(null)
  const [uploadingTestiIdx, setUploadingTestiIdx] = useState(null)

  // Footer
  const [footerData, setFooterData] = useState(FOOTER_DEFAULTS)
  const [footerSaving, setFooterSaving] = useState(false)
  const [footerMsg, setFooterMsg] = useState(null)

  useEffect(() => { fetchLeads(); fetchCmsSettings() }, [])

  const fetchLeads = async () => {
    setLoadingLeads(true)
    const { data, error } = await supabase.from("free_leads").select("*").order("created_at",{ascending:false})
    if (error) console.error(error)
    setLeads(data||[])
    setLoadingLeads(false)
  }

  const fetchCmsSettings = async () => {
    const { data } = await supabase.from("cms_settings").select("key,value")
    if (!data) return
    const map = {}
    data.forEach(r => { map[r.key] = r.value })
    if (map.logo_url) setCurrentLogoUrl(map.logo_url)
    if (map.hero_img_url) setHeroImgUrl(map.hero_img_url)
    setHero({ hero_badge: map.hero_badge||"✦ Descubre el estándar Clave de Tres", hero_titulo: map.hero_titulo||"Domina tu arte.", hero_parrafo: map.hero_parrafo||"El estudio de baile más exclusivo de la ciudad." })
    setStats(STATS_DEFAULTS.map(d => { try { return map[d.key] ? {...d,...JSON.parse(map[d.key])} : d } catch { return d } }))
    if (map.estilos_header) { try { setEstilosHeader(JSON.parse(map.estilos_header)) } catch {} }
    if (map.estilos_items)  { try { setEstilosItems(JSON.parse(map.estilos_items))   } catch {} }
    if (map.instructores_items) { try { setInstructores(JSON.parse(map.instructores_items)) } catch {} }
    if (map.planes_items)       { try { setPlanes(JSON.parse(map.planes_items))             } catch {} }
    if (map.testimonios_items)  { try { setTestimonios(JSON.parse(map.testimonios_items))   } catch {} }
    if (map.footer_data)        { try { setFooterData(JSON.parse(map.footer_data))           } catch {} }
  }

  const upsert = async (key, value) => supabase.from("cms_settings").upsert({ key, value, updated_at: new Date().toISOString() })

  const uploadImage = async (file, prefix, maxMB = 5) => {
    if (!file.type.startsWith("image/")) throw new Error("Solo imágenes")
    if (file.size > maxMB * 1024 * 1024) throw new Error(`Máx ${maxMB}MB`)
    const ext = file.name.split(".").pop()
    const fileName = `${prefix}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("cms-assets").upload(fileName, file, { upsert:true })
    if (error) throw error
    const { data } = supabase.storage.from("cms-assets").getPublicUrl(fileName)
    return data.publicUrl
  }

  // Logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true); setLogoMsg(null)
    try {
      const url = await uploadImage(file, "logo", 2)
      await upsert("logo_url", url)
      setCurrentLogoUrl(url); setLogoMsg({ type:"success", text:"✓ Logo actualizado." })
    } catch(err) { setLogoMsg({ type:"error", text: err.message }) }
    setUploading(false)
  }

  // Hero img
  const handleHeroImgUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploadingHeroImg(true); setHeroImgMsg(null)
    try {
      const url = await uploadImage(file, "hero")
      await upsert("hero_img_url", url)
      setHeroImgUrl(url); setHeroImgMsg({ type:"success", text:"✓ Imagen del Hero actualizada." })
    } catch(err) { setHeroImgMsg({ type:"error", text: err.message }) }
    setUploadingHeroImg(false)
  }

  const saveHero = async () => {
    setHeroSaving(true); setHeroMsg(null)
    const entries = Object.entries(hero).map(([key,value]) => ({ key, value, updated_at: new Date().toISOString() }))
    const { error } = await supabase.from("cms_settings").upsert(entries)
    if (error) setHeroMsg({ type:"error", text:"Error: "+error.message })
    else setHeroMsg({ type:"success", text:"✓ Hero actualizado." })
    setHeroSaving(false)
  }

  const saveStats = async () => {
    setStatsSaving(true); setStatsMsg(null)
    const entries = stats.map(s => ({ key:s.key, value:JSON.stringify({number:s.number,label:s.label}), updated_at:new Date().toISOString() }))
    const { error } = await supabase.from("cms_settings").upsert(entries)
    if (error) setStatsMsg({ type:"error", text:"Error: "+error.message })
    else setStatsMsg({ type:"success", text:"✓ Estadísticas actualizadas." })
    setStatsSaving(false)
  }

  // Estilos
  const handleEstiloImgUpload = async (e, idx) => {
    const file = e.target.files[0]; if (!file) return
    setUploadingEstiloIdx(idx)
    try {
      const url = await uploadImage(file, `estilo-${idx}`)
      setEstilosItems(items => items.map((it,i) => i===idx ? {...it,image:url} : it))
    } catch(err) { alert(err.message) }
    setUploadingEstiloIdx(null)
  }
  const saveEstilos = async () => {
    setEstilosSaving(true); setEstilosMsg(null)
    const { error } = await supabase.from("cms_settings").upsert([
      { key:"estilos_header", value:JSON.stringify(estilosHeader), updated_at:new Date().toISOString() },
      { key:"estilos_items",  value:JSON.stringify(estilosItems),  updated_at:new Date().toISOString() },
    ])
    if (error) setEstilosMsg({ type:"error", text:"Error: "+error.message })
    else setEstilosMsg({ type:"success", text:"✓ Estilos actualizados." })
    setEstilosSaving(false)
  }
  const addEstilo = () => setEstilosItems(items => [...items, { id:Date.now(), name:"", description:"", image:"" }])
  const removeEstilo = (idx) => setEstilosItems(items => items.filter((_,i)=>i!==idx))

  // Instructores
  const handleInstImgUpload = async (e, idx) => {
    const file = e.target.files[0]; if (!file) return
    setUploadingInstIdx(idx)
    try {
      const url = await uploadImage(file, `instructor-${idx}`)
      setInstructores(items => items.map((it,i) => i===idx ? {...it,photo:url} : it))
    } catch(err) { alert(err.message) }
    setUploadingInstIdx(null)
  }
  const saveInstructores = async () => {
    setInstSaving(true); setInstMsg(null)
    const { error } = await upsert("instructores_items", JSON.stringify(instructores))
    if (error) setInstMsg({ type:"error", text:"Error: "+error.message })
    else setInstMsg({ type:"success", text:"✓ Instructores actualizados." })
    setInstSaving(false)
  }
  const addInstructor = () => setInstructores(items => [...items, { id:Date.now(), name:"", specialty:"", experience:"", bio:"", photo:"", achievements:[""], social:{instagram:"",tiktok:"",youtube:"",facebook:""} }])
  const removeInstructor = (idx) => setInstructores(items => items.filter((_,i)=>i!==idx))

  // Planes
  const savePlanes = async () => {
    setPlanesSaving(true); setPlanesMsg(null)
    const { error } = await upsert("planes_items", JSON.stringify(planes))
    if (error) setPlanesMsg({ type:"error", text:"Error: "+error.message })
    else setPlanesMsg({ type:"success", text:"✓ Planes actualizados." })
    setPlanesSaving(false)
  }
  const addPlan = () => setPlanes(items => [...items, { id:Date.now(), name:"", price:"", featured:false, features:[""] }])
  const removePlan = (idx) => setPlanes(items => items.filter((_,i)=>i!==idx))

  // Testimonios
  const handleTestiImgUpload = async (e, idx) => {
    const file = e.target.files[0]; if (!file) return
    setUploadingTestiIdx(idx)
    try {
      const url = await uploadImage(file, `testi-${idx}`, 2)
      setTestimonios(items => items.map((it,i) => i===idx ? {...it,photo:url} : it))
    } catch(err) { alert(err.message) }
    setUploadingTestiIdx(null)
  }
  const saveTestimonios = async () => {
    setTestiSaving(true); setTestiMsg(null)
    const { error } = await upsert("testimonios_items", JSON.stringify(testimonios))
    if (error) setTestiMsg({ type:"error", text:"Error: "+error.message })
    else setTestiMsg({ type:"success", text:"✓ Testimonios actualizados." })
    setTestiSaving(false)
  }
  const addTestimonio = () => setTestimonios(items => [...items, { id:Date.now(), name:"", photo:"", rating:5, text:"" }])
  const removeTestimonio = (idx) => setTestimonios(items => items.filter((_,i)=>i!==idx))

  // Footer
  const saveFooter = async () => {
    setFooterSaving(true); setFooterMsg(null)
    const { error } = await upsert("footer_data", JSON.stringify(footerData))
    if (error) setFooterMsg({ type:"error", text:"Error: "+error.message })
    else setFooterMsg({ type:"success", text:"✓ Footer actualizado." })
    setFooterSaving(false)
  }

  const handleSignOut = async () => { await signOut(); navigate("/") }

  const filtered = filter==="todos" ? leads : leads.filter(l=>(l.status||"nuevo")===filter)
  const counts = { todos:leads.length, nuevo:leads.filter(l=>(l.status||"nuevo")==="nuevo").length, contactado:leads.filter(l=>l.status==="contactado").length, inscrito:leads.filter(l=>l.status==="inscrito").length }

  // Styles
  const sH    = { background:"#130508", borderBottom:"1px solid rgba(212,175,55,.1)", padding:"1rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between" }
  const sLB   = { width:40, height:40, borderRadius:8, background:"linear-gradient(135deg,#8b1a2e,#d4af37)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cormorant Garamond,serif", fontWeight:700, color:"#fff", fontSize:"1rem" }
  const sCard = { background:"#130508", border:"1px solid rgba(212,175,55,.08)", borderRadius:12, padding:"1.25rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto auto", gap:"1rem", alignItems:"center" }
  const sTab  = (a) => ({ padding:".6rem 1.5rem", borderRadius:999, border:"1px solid", borderColor:a?"#8b1a2e":"rgba(212,175,55,.2)", background:a?"#8b1a2e":"transparent", color:a?"#fff":"#999", fontSize:".85rem", cursor:"pointer", fontWeight:a?600:400 })
  const sSec  = { background:"#130508", border:"1px solid rgba(212,175,55,.08)", borderRadius:12, padding:"2rem", marginBottom:"1.5rem" }
  const sLbl  = { display:"block", fontSize:".75rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color:"#d4af37", marginBottom:".4rem" }
  const sInp  = { width:"100%", background:"rgba(0,0,0,.4)", border:"1px solid rgba(212,175,55,.2)", borderRadius:8, padding:".7rem 1rem", color:"#f5f0f0", fontFamily:"DM Sans,sans-serif", fontSize:".9rem", outline:"none", marginBottom:"1.25rem", boxSizing:"border-box" }
  const sMsg  = (t) => ({ marginTop:"1rem", padding:".75rem 1rem", borderRadius:8, background:t==="success"?"rgba(34,197,94,.1)":"rgba(255,0,0,.1)", border:`1px solid ${t==="success"?"rgba(34,197,94,.3)":"rgba(255,0,0,.3)"}`, color:t==="success"?"#22c55e":"#ff6b6b", fontSize:".85rem" })
  const sUpB  = (l) => ({ display:"inline-flex", alignItems:"center", gap:".6rem", padding:".65rem 1.5rem", background:l?"#333":"#8b1a2e", borderRadius:8, cursor:l?"not-allowed":"pointer", fontSize:".875rem", fontWeight:600, color:"#fff" })
  const sRow  = { background:"rgba(0,0,0,.25)", border:"1px solid rgba(212,175,55,.06)", borderRadius:10, padding:"1.25rem", marginBottom:"1rem" }
  const sBtnAdd = { display:"inline-flex", alignItems:"center", gap:".5rem", padding:".55rem 1.25rem", background:"rgba(212,175,55,.08)", border:"1px solid rgba(212,175,55,.2)", borderRadius:8, color:"#d4af37", cursor:"pointer", fontSize:".85rem", fontWeight:600, marginBottom:"1rem" }
  const sBtnDel = { background:"rgba(255,0,0,.08)", border:"1px solid rgba(255,0,0,.2)", borderRadius:6, padding:".3rem .6rem", color:"#ff6b6b", cursor:"pointer", fontSize:".75rem" }
  const sBtnSave = (l) => ({ padding:".65rem 1.75rem", background:l?"#333":"#8b1a2e", border:"none", borderRadius:8, color:"#fff", fontWeight:600, fontSize:".875rem", cursor:l?"not-allowed":"pointer" })
  const UpIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>)

  return (
    <div style={{ minHeight:"100vh", background:"#0a0205", color:"#f5f0f0", fontFamily:"DM Sans,sans-serif" }}>
      <div style={sH}>
        <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
          <div style={sLB}>CT</div>
          <div>
            <div style={{ fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"1.1rem" }}>Clave de Tres Admin</div>
            <div style={{ fontSize:".7rem", color:"#999" }}>Panel de Administración</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
          <span style={{ fontSize:".8rem", color:"#999" }}>{user?.email}</span>
          <button onClick={()=>navigate("/")} style={{ background:"none", border:"1px solid rgba(212,175,55,.2)", borderRadius:6, padding:".4rem .9rem", color:"#d4af37", cursor:"pointer", fontSize:".8rem" }}>Ver sitio</button>
          <button onClick={handleSignOut} style={{ background:"none", border:"1px solid rgba(255,0,0,.2)", borderRadius:6, padding:".4rem .9rem", color:"#ff6b6b", cursor:"pointer", fontSize:".8rem" }}>Salir</button>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem" }}>
        <div style={{ display:"flex", gap:".75rem", marginBottom:"2rem", flexWrap:"wrap" }}>
          <button style={sTab(activeTab==="crm")} onClick={()=>setActiveTab("crm")}>📋 CRM</button>
          <button style={sTab(activeTab==="cms")} onClick={()=>setActiveTab("cms")}>🎨 CMS</button>
        </div>

        {/* ── CRM ── */}
        {activeTab==="crm" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
              {[["Total",counts.todos,"#d4af37"],["Nuevos",counts.nuevo,"#b02240"],["Contactados",counts.contactado,"#60a5fa"],["Inscritos",counts.inscrito,"#22c55e"]].map(([label,count,color])=>(
                <div key={label} style={{ background:"#130508", border:"1px solid rgba(212,175,55,.08)", borderRadius:12, padding:"1.25rem", textAlign:"center" }}>
                  <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.5rem", fontWeight:700, color }}>{count}</div>
                  <div style={{ fontSize:".75rem", color:"#999", textTransform:"uppercase", letterSpacing:".08em" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:".5rem", marginBottom:"1.5rem", flexWrap:"wrap", alignItems:"center" }}>
              {["todos","nuevo","contactado","inscrito","descartado"].map(s=>(
                <button key={s} onClick={()=>setFilter(s)} style={{ padding:".4rem 1rem", borderRadius:999, border:"1px solid", borderColor:filter===s?"#8b1a2e":"rgba(212,175,55,.2)", background:filter===s?"#8b1a2e":"transparent", color:filter===s?"#fff":"#999", fontSize:".8rem", cursor:"pointer", textTransform:"capitalize" }}>
                  {s==="todos"?`Todos (${counts.todos})`:s}
                </button>
              ))}
              <button onClick={fetchLeads} style={{ marginLeft:"auto", padding:".4rem 1rem", borderRadius:999, border:"1px solid rgba(212,175,55,.2)", background:"transparent", color:"#d4af37", fontSize:".8rem", cursor:"pointer" }}>Actualizar</button>
            </div>
            {loadingLeads ? <div style={{ textAlign:"center", padding:"3rem", color:"#999" }}>Cargando...</div>
            : filtered.length===0 ? <div style={{ textAlign:"center", padding:"3rem", color:"#999" }}>No hay leads</div>
            : <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                {filtered.map(lead=>(
                  <div key={lead.id} style={sCard}>
                    <div>
                      <div style={{ fontWeight:600, marginBottom:".2rem" }}>{lead.nombre} {lead.apellido}</div>
                      <div style={{ fontSize:".82rem", color:"#999" }}>{lead.email}</div>
                      <div style={{ fontSize:".82rem", color:"#999" }}>{lead.telefono}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:".8rem", color:"#d4af37", marginBottom:".2rem" }}>{lead.estilo}</div>
                      <div style={{ fontSize:".75rem", color:"#999" }}>{lead.nivel}</div>
                      <div style={{ fontSize:".75rem", color:"#999" }}>{lead.objetivo}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:".8rem", color:"#999" }}>{lead.dia_preferido} - {lead.horario_preferido}</div>
                      <div style={{ fontSize:".72rem", color:"#666", marginTop:".25rem" }}>{new Date(lead.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:".35rem" }}>
                      <div style={{ fontSize:".65rem", fontWeight:700, color:STATUS_COLORS[lead.status||"nuevo"], textTransform:"uppercase", letterSpacing:".08em" }}>{lead.status||"nuevo"}</div>
                      <select value={lead.status||"nuevo"} onChange={e=>{ supabase.from("free_leads").update({status:e.target.value}).eq("id",lead.id).then(({error})=>{ if(!error) setLeads(leads.map(l=>l.id===lead.id?{...l,status:e.target.value}:l)) }) }}
                        style={{ background:"#1a0810", border:"1px solid rgba(212,175,55,.2)", borderRadius:6, padding:".35rem .5rem", color:"#f5f0f0", fontSize:".75rem", cursor:"pointer" }}>
                        <option value="nuevo">Nuevo</option><option value="contactado">Contactado</option><option value="inscrito">Inscrito</option><option value="descartado">Descartado</option>
                      </select>
                    </div>
                    <button onClick={async()=>{ if(!window.confirm("¿Eliminar?")) return; setDeletingId(lead.id); const {error}=await supabase.from("free_leads").delete().eq("id",lead.id); if(!error) setLeads(leads.filter(l=>l.id!==lead.id)); setDeletingId(null) }} disabled={deletingId===lead.id}
                      style={{ background:"none", border:"1px solid rgba(255,0,0,.2)", borderRadius:6, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            }
          </>
        )}

        {/* ── CMS ── */}
        {activeTab==="cms" && (
          <div>

            {/* LOGO */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Logo del sitio</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>PNG transparente, máx. 2MB.</p>
              {currentLogoUrl && <div style={{ marginBottom:"1rem" }}><img src={currentLogoUrl} alt="logo" style={{ height:50, objectFit:"contain" }} /></div>}
              <label style={sUpB(uploading)}><UpIcon />{uploading?"Subiendo...":"Subir logo"}<input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} style={{ display:"none" }} /></label>
              {logoMsg && <div style={sMsg(logoMsg.type)}>{logoMsg.text}</div>}
            </div>

            {/* HERO */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Sección Hero</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>Imagen, badge, título y párrafo.</p>
              <label style={sLbl}>Imagen de fondo</label>
              <div style={{ marginBottom:"1.25rem" }}>
                {heroImgUrl && <div style={{ marginBottom:".75rem", borderRadius:8, overflow:"hidden", maxHeight:160, border:"1px solid rgba(212,175,55,.15)" }}><img src={heroImgUrl} alt="hero" style={{ width:"100%", height:160, objectFit:"cover" }} /></div>}
                <label style={sUpB(uploadingHeroImg)}><UpIcon />{uploadingHeroImg?"Subiendo...":heroImgUrl?"Cambiar imagen":"Subir imagen"}<input type="file" accept="image/*" onChange={handleHeroImgUpload} disabled={uploadingHeroImg} style={{ display:"none" }} /></label>
                <span style={{ fontSize:".72rem", color:"#666", marginLeft:".75rem" }}>Recomendado: 1600×900px, máx. 5MB.</span>
                {heroImgMsg && <div style={sMsg(heroImgMsg.type)}>{heroImgMsg.text}</div>}
              </div>
              <label style={sLbl}>Badge</label>
              <input style={sInp} value={hero.hero_badge} onChange={e=>setHero(h=>({...h,hero_badge:e.target.value}))} placeholder="✦ Descubre el estándar..." />
              <label style={sLbl}>Título (última palabra en dorado)</label>
              <input style={sInp} value={hero.hero_titulo} onChange={e=>setHero(h=>({...h,hero_titulo:e.target.value}))} placeholder="Domina tu arte." />
              <label style={sLbl}>Párrafo</label>
              <textarea style={{...sInp,minHeight:80,resize:"vertical"}} value={hero.hero_parrafo} onChange={e=>setHero(h=>({...h,hero_parrafo:e.target.value}))} />
              <button onClick={saveHero} disabled={heroSaving} style={sBtnSave(heroSaving)}>{heroSaving?"Guardando...":"✦ Guardar Hero"}</button>
              {heroMsg && <div style={sMsg(heroMsg.type)}>{heroMsg.text}</div>}
            </div>

            {/* STATS */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Estadísticas</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>Los 4 números debajo del Hero.</p>
              <div style={{ display:"grid", gap:"1rem", marginBottom:"1.5rem" }}>
                {stats.map((s,i)=>(
                  <div key={s.key} style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"1rem", ...sRow, marginBottom:0 }}>
                    <div><label style={sLbl}>Número {i+1}</label><input style={{...sInp,marginBottom:0}} value={s.number} onChange={e=>setStats(st=>st.map(x=>x.key===s.key?{...x,number:e.target.value}:x))} /></div>
                    <div><label style={sLbl}>Etiqueta {i+1}</label><input style={{...sInp,marginBottom:0}} value={s.label} onChange={e=>setStats(st=>st.map(x=>x.key===s.key?{...x,label:e.target.value}:x))} /></div>
                  </div>
                ))}
              </div>
              <button onClick={saveStats} disabled={statsSaving} style={sBtnSave(statsSaving)}>{statsSaving?"Guardando...":"✦ Guardar estadísticas"}</button>
              {statsMsg && <div style={sMsg(statsMsg.type)}>{statsMsg.text}</div>}
            </div>

            {/* ESTILOS */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Estilos de baile</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>Título, subtítulo y tarjetas de estilos.</p>
              <label style={sLbl}>Título (usa &lt;gold&gt;texto&lt;/gold&gt; para dorado)</label>
              <input style={sInp} value={estilosHeader.titulo} onChange={e=>setEstilosHeader(h=>({...h,titulo:e.target.value}))} placeholder="El baile en su <gold>maxima expresion</gold>" />
              <label style={sLbl}>Subtítulo</label>
              <input style={sInp} value={estilosHeader.subtitulo} onChange={e=>setEstilosHeader(h=>({...h,subtitulo:e.target.value}))} />
              <div style={{ marginBottom:"1rem" }}>
                {estilosItems.map((item,idx)=>(
                  <div key={item.id||idx} style={sRow}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".75rem" }}>
                      <span style={{ fontSize:".8rem", color:"#d4af37", fontWeight:600 }}>Estilo {idx+1}</span>
                      <button onClick={()=>removeEstilo(idx)} style={sBtnDel}>✕ Eliminar</button>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                      <div>
                        <label style={sLbl}>Nombre</label>
                        <input style={{...sInp,marginBottom:0}} value={item.name} onChange={e=>setEstilosItems(items=>items.map((it,i)=>i===idx?{...it,name:e.target.value}:it))} placeholder="Salsa & Bachata" />
                      </div>
                      <div>
                        <label style={sLbl}>Imagen</label>
                        <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                          {item.image && <img src={item.image} alt="" style={{ width:48, height:48, objectFit:"cover", borderRadius:6 }} />}
                          <label style={{...sUpB(uploadingEstiloIdx===idx), padding:".45rem .9rem", fontSize:".78rem"}}>
                            <UpIcon />{uploadingEstiloIdx===idx?"...":"Subir"}
                            <input type="file" accept="image/*" onChange={e=>handleEstiloImgUpload(e,idx)} disabled={uploadingEstiloIdx===idx} style={{ display:"none" }} />
                          </label>
                          <span style={{ fontSize:".68rem", color:"#666" }}>o pega URL:</span>
                        </div>
                        <input style={{...sInp,marginTop:".5rem",marginBottom:0,fontSize:".78rem"}} value={item.image} onChange={e=>setEstilosItems(items=>items.map((it,i)=>i===idx?{...it,image:e.target.value}:it))} placeholder="https://..." />
                      </div>
                    </div>
                    <label style={{...sLbl,marginTop:".75rem"}}>Descripción</label>
                    <textarea style={{...sInp,minHeight:70,resize:"vertical",marginBottom:0}} value={item.description} onChange={e=>setEstilosItems(items=>items.map((it,i)=>i===idx?{...it,description:e.target.value}:it))} />
                  </div>
                ))}
              </div>
              <button onClick={addEstilo} style={sBtnAdd}>+ Agregar estilo</button>
              <br/>
              <button onClick={saveEstilos} disabled={estilosSaving} style={sBtnSave(estilosSaving)}>{estilosSaving?"Guardando...":"✦ Guardar estilos"}</button>
              {estilosMsg && <div style={sMsg(estilosMsg.type)}>{estilosMsg.text}</div>}
            </div>

            {/* INSTRUCTORES */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Instructores</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>Agrega, edita o elimina instructores.</p>
              {instructores.map((inst,idx)=>(
                <div key={inst.id||idx} style={sRow}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".75rem" }}>
                    <span style={{ fontSize:".8rem", color:"#d4af37", fontWeight:600 }}>Instructor {idx+1}</span>
                    <button onClick={()=>removeInstructor(idx)} style={sBtnDel}>✕ Eliminar</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"1.25rem", alignItems:"start", marginBottom:".75rem" }}>
                    <div style={{ textAlign:"center" }}>
                      {inst.photo && <img src={inst.photo} alt="" style={{ width:72, height:72, objectFit:"cover", borderRadius:"50%", display:"block", marginBottom:".5rem" }} />}
                      <label style={{...sUpB(uploadingInstIdx===idx), padding:".4rem .8rem", fontSize:".75rem"}}>
                        <UpIcon />{uploadingInstIdx===idx?"...":"Foto"}
                        <input type="file" accept="image/*" onChange={e=>handleInstImgUpload(e,idx)} disabled={uploadingInstIdx===idx} style={{ display:"none" }} />
                      </label>
                      <input style={{...sInp,marginTop:".4rem",marginBottom:0,fontSize:".72rem"}} value={inst.photo} onChange={e=>setInstructores(items=>items.map((it,i)=>i===idx?{...it,photo:e.target.value}:it))} placeholder="URL foto" />
                    </div>
                    <div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
                        <div><label style={sLbl}>Nombre</label><input style={{...sInp,marginBottom:0}} value={inst.name} onChange={e=>setInstructores(items=>items.map((it,i)=>i===idx?{...it,name:e.target.value}:it))} /></div>
                        <div><label style={sLbl}>Especialidad</label><input style={{...sInp,marginBottom:0}} value={inst.specialty} onChange={e=>setInstructores(items=>items.map((it,i)=>i===idx?{...it,specialty:e.target.value}:it))} /></div>
                        <div><label style={sLbl}>Experiencia</label><input style={{...sInp,marginBottom:0}} value={inst.experience} onChange={e=>setInstructores(items=>items.map((it,i)=>i===idx?{...it,experience:e.target.value}:it))} /></div>
                      </div>
                      <label style={{...sLbl,marginTop:".75rem"}}>Biografía</label>
                      <textarea style={{...sInp,minHeight:70,resize:"vertical",marginBottom:0}} value={inst.bio} onChange={e=>setInstructores(items=>items.map((it,i)=>i===idx?{...it,bio:e.target.value}:it))} />
                    </div>
                  </div>
                  <label style={sLbl}>Logros (uno por línea)</label>
                  <textarea style={{...sInp,minHeight:60,resize:"vertical"}} value={(inst.achievements||[]).join("\n")} onChange={e=>setInstructores(items=>items.map((it,i)=>i===idx?{...it,achievements:e.target.value.split("\n")}:it))} placeholder="Premio X 2023&#10;Campeón Y" />
                  <label style={sLbl}>Redes sociales</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
                    {["instagram","tiktok","youtube","facebook"].map(red=>(
                      <div key={red}>
                        <label style={{...sLbl,color:"#999",textTransform:"capitalize"}}>{red}</label>
                        <input style={{...sInp,marginBottom:0}} value={inst.social?.[red]||""} onChange={e=>setInstructores(items=>items.map((it,i)=>i===idx?{...it,social:{...it.social,[red]:e.target.value}}:it))} placeholder={`URL ${red}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={addInstructor} style={sBtnAdd}>+ Agregar instructor</button>
              <br/>
              <button onClick={saveInstructores} disabled={instSaving} style={sBtnSave(instSaving)}>{instSaving?"Guardando...":"✦ Guardar instructores"}</button>
              {instMsg && <div style={sMsg(instMsg.type)}>{instMsg.text}</div>}
            </div>

            {/* PLANES */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Planes de precios</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>Agrega, edita o elimina planes.</p>
              {planes.map((plan,idx)=>(
                <div key={plan.id||idx} style={sRow}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".75rem" }}>
                    <span style={{ fontSize:".8rem", color:"#d4af37", fontWeight:600 }}>Plan {idx+1}{plan.featured?" ⭐ Destacado":""}</span>
                    <div style={{ display:"flex", gap:".5rem", alignItems:"center" }}>
                      <label style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".78rem", color:"#999", cursor:"pointer" }}>
                        <input type="checkbox" checked={!!plan.featured} onChange={e=>setPlanes(items=>items.map((it,i)=>i===idx?{...it,featured:e.target.checked}:it))} />
                        Destacado
                      </label>
                      <button onClick={()=>removePlan(idx)} style={sBtnDel}>✕ Eliminar</button>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem", marginBottom:".75rem" }}>
                    <div><label style={sLbl}>Nombre del plan</label><input style={{...sInp,marginBottom:0}} value={plan.name} onChange={e=>setPlanes(items=>items.map((it,i)=>i===idx?{...it,name:e.target.value}:it))} placeholder="Premium" /></div>
                    <div><label style={sLbl}>Precio (MXN/mes)</label><input style={{...sInp,marginBottom:0}} value={plan.price} onChange={e=>setPlanes(items=>items.map((it,i)=>i===idx?{...it,price:e.target.value}:it))} placeholder="999" /></div>
                  </div>
                  <label style={sLbl}>Características (una por línea)</label>
                  <textarea style={{...sInp,minHeight:90,resize:"vertical",marginBottom:0}} value={(plan.features||[]).join("\n")} onChange={e=>setPlanes(items=>items.map((it,i)=>i===idx?{...it,features:e.target.value.split("\n")}:it))} placeholder="Clases ilimitadas&#10;Todos los estilos" />
                </div>
              ))}
              <button onClick={addPlan} style={sBtnAdd}>+ Agregar plan</button>
              <br/>
              <button onClick={savePlanes} disabled={planesSaving} style={sBtnSave(planesSaving)}>{planesSaving?"Guardando...":"✦ Guardar planes"}</button>
              {planesMsg && <div style={sMsg(planesMsg.type)}>{planesMsg.text}</div>}
            </div>

            {/* TESTIMONIOS */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Testimonios</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>Agrega, edita o elimina testimonios.</p>
              {testimonios.map((t,idx)=>(
                <div key={t.id||idx} style={sRow}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".75rem" }}>
                    <span style={{ fontSize:".8rem", color:"#d4af37", fontWeight:600 }}>Testimonio {idx+1}</span>
                    <button onClick={()=>removeTestimonio(idx)} style={sBtnDel}>✕ Eliminar</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"1rem", alignItems:"start", marginBottom:".75rem" }}>
                    <div style={{ textAlign:"center" }}>
                      {t.photo && <img src={t.photo} alt="" style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", display:"block", marginBottom:".5rem" }} />}
                      <label style={{...sUpB(uploadingTestiIdx===idx), padding:".4rem .8rem", fontSize:".75rem"}}>
                        <UpIcon />{uploadingTestiIdx===idx?"...":"Foto"}
                        <input type="file" accept="image/*" onChange={e=>handleTestiImgUpload(e,idx)} disabled={uploadingTestiIdx===idx} style={{ display:"none" }} />
                      </label>
                    </div>
                    <div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
                        <div><label style={sLbl}>Nombre</label><input style={{...sInp,marginBottom:0}} value={t.name} onChange={e=>setTestimonios(items=>items.map((it,i)=>i===idx?{...it,name:e.target.value}:it))} /></div>
                        <div>
                          <label style={sLbl}>Estrellas (1-5)</label>
                          <select style={{...sInp,marginBottom:0}} value={t.rating} onChange={e=>setTestimonios(items=>items.map((it,i)=>i===idx?{...it,rating:Number(e.target.value)}:it))}>
                            {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} ★</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <label style={sLbl}>Testimonio</label>
                  <textarea style={{...sInp,minHeight:80,resize:"vertical",marginBottom:0}} value={t.text} onChange={e=>setTestimonios(items=>items.map((it,i)=>i===idx?{...it,text:e.target.value}:it))} />
                </div>
              ))}
              <button onClick={addTestimonio} style={sBtnAdd}>+ Agregar testimonio</button>
              <br/>
              <button onClick={saveTestimonios} disabled={testiSaving} style={sBtnSave(testiSaving)}>{testiSaving?"Guardando...":"✦ Guardar testimonios"}</button>
              {testiMsg && <div style={sMsg(testiMsg.type)}>{testiMsg.text}</div>}
            </div>

            {/* FOOTER */}
            <div style={sSec}>
              <h3 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", marginBottom:".4rem", color:"#d4af37" }}>Footer</h3>
              <p style={{ fontSize:".82rem", color:"#999", marginBottom:"1.5rem" }}>Descripción, redes sociales y datos de contacto.</p>
              <label style={sLbl}>Descripción</label>
              <textarea style={{...sInp,minHeight:80,resize:"vertical"}} value={footerData.descripcion} onChange={e=>setFooterData(f=>({...f,descripcion:e.target.value}))} />

              <label style={sLbl}>Redes sociales</label>
              {footerData.redes.map((r,idx)=>(
                <div key={idx} style={{ display:"grid", gridTemplateColumns:"1fr 2fr auto", gap:".75rem", marginBottom:".5rem", alignItems:"center" }}>
                  <select style={{...sInp,marginBottom:0}} value={r.tipo} onChange={e=>setFooterData(f=>({...f,redes:f.redes.map((x,i)=>i===idx?{...x,tipo:e.target.value}:x)}))}>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                  <input style={{...sInp,marginBottom:0}} value={r.url} onChange={e=>setFooterData(f=>({...f,redes:f.redes.map((x,i)=>i===idx?{...x,url:e.target.value}:x)}))} placeholder="https://..." />
                  <button onClick={()=>setFooterData(f=>({...f,redes:f.redes.filter((_,i)=>i!==idx)}))} style={sBtnDel}>✕</button>
                </div>
              ))}
              <button onClick={()=>setFooterData(f=>({...f,redes:[...f.redes,{tipo:"instagram",url:""}]}))} style={{...sBtnAdd,marginBottom:"1.5rem"}}>+ Red social</button>

              <label style={sLbl}>Datos de contacto</label>
              {footerData.contacto.map((c,idx)=>(
                <div key={idx} style={{ display:"grid", gridTemplateColumns:"1fr 2fr auto", gap:".75rem", marginBottom:".5rem", alignItems:"center" }}>
                  <input style={{...sInp,marginBottom:0}} value={c.texto} onChange={e=>setFooterData(f=>({...f,contacto:f.contacto.map((x,i)=>i===idx?{...x,texto:e.target.value}:x)}))} placeholder="Texto visible" />
                  <input style={{...sInp,marginBottom:0}} value={c.url} onChange={e=>setFooterData(f=>({...f,contacto:f.contacto.map((x,i)=>i===idx?{...x,url:e.target.value}:x)}))} placeholder="mailto: / tel: / https:" />
                  <button onClick={()=>setFooterData(f=>({...f,contacto:f.contacto.filter((_,i)=>i!==idx)}))} style={sBtnDel}>✕</button>
                </div>
              ))}
              <button onClick={()=>setFooterData(f=>({...f,contacto:[...f.contacto,{texto:"",url:""}]}))} style={{...sBtnAdd,marginBottom:"1.5rem"}}>+ Dato de contacto</button>
              <br/>
              <button onClick={saveFooter} disabled={footerSaving} style={sBtnSave(footerSaving)}>{footerSaving?"Guardando...":"✦ Guardar footer"}</button>
              {footerMsg && <div style={sMsg(footerMsg.type)}>{footerMsg.text}</div>}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
