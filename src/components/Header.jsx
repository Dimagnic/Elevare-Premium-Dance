import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function Header({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Cargar logo desde Supabase CMS
  useEffect(() => {
    supabase
      .from("cms_settings")
      .select("value")
      .eq("key", "logo_url")
      .single()
      .then(({ data }) => {
        if (data?.value) setLogoUrl(data.value)
      })
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const navLinks = [
    { label: "Inicio", id: "hero" },
    { label: "Estilos", id: "estilos" },
    { label: "Instructores", id: "instructores" },
    { label: "Precios", id: "precios" },
    { label: "Testimonios", id: "testimonios" },
  ]

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo">
          {logoUrl ? (
            <img src={logoUrl} alt="Clave de Tres Dance Studio" className="nav-logo-img" />
          ) : (
            <>
              <div className="nav-logo-icon">CT</div>
              <div className="nav-logo-text">
                <span>Clave de Tres</span>
                <span>Dance Studio</span>
              </div>
            </>
          )}
        </div>
        <div className="nav-links">
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-cta-desktop">
          <button className="btn btn-primary" onClick={onOpenModal}>Clase Gratis</button>
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {navLinks.slice(1).map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}>
            {l.label}
          </a>
        ))}
        <button className="btn btn-primary" style={{ marginTop: ".5rem" }} onClick={() => { setMobileOpen(false); onOpenModal() }}>
          Quiero Mi Clase Gratis
        </button>
      </div>
    </>
  )
}