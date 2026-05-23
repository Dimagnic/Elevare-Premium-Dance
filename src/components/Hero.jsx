import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const DEFAULTS = {
  hero_badge: "✦ Descubre el estándar Clave de Tres",
  hero_titulo: "Domina tu arte.",
  hero_parrafo: "El estudio de baile más exclusivo de la ciudad. Instructores de élite, instalaciones de primer nivel y un método que transforma.",
  hero_img_url: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1600&q=80",
}

export default function Hero({ onOpenModal }) {
  const [cms, setCms] = useState(DEFAULTS)
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => {
    supabase
      .from("cms_settings")
      .select("key,value")
      .in("key", ["hero_badge", "hero_titulo", "hero_parrafo", "hero_img_url"])
      .then(({ data }) => {
        if (data?.length) {
          const map = {}
          data.forEach(r => { if (r.value) map[r.key] = r.value })
          setCms(prev => ({ ...prev, ...map }))
        }
      })
  }, [])

  const tituloWords = cms.hero_titulo.trim().split(" ")
  const tituloNormal = tituloWords.slice(0, -1).join(" ")
  const tituloGold = tituloWords[tituloWords.length - 1]

  return (
    <section id="hero">
      <div className="hero-bg">
        <img src={cms.hero_img_url} alt="Bailarines en estudio premium" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">{cms.hero_badge}</div>
        <h1 className="hero-title">
          {tituloNormal && <>{tituloNormal} </>}
          <span className="gold">{tituloGold}</span>
        </h1>
        <p className="hero-sub">{cms.hero_parrafo}</p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={onOpenModal}>
            ✦ Quiero Mi Clase Gratis
          </button>
          <a href="#estilos" className="btn btn-outline btn-lg" onClick={(e) => { e.preventDefault(); scrollTo("estilos") }}>
            Ver estilos
          </a>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
