import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useFadeUp } from "../hooks/useFadeUp"
import { INSTRUCTORS } from "../data/content"

const IgIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>)
const TkIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.06a8.23 8.23 0 004.83 1.56V7.18a4.85 4.85 0 01-1.06-.49z" /></svg>)
const YtIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>)
const FbIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>)

export default function Instructores() {
  const ref = useFadeUp()
  const [instructors, setInstructors] = useState(INSTRUCTORS)

  useEffect(() => {
    supabase.from("cms_settings").select("key,value").eq("key","instructores_items")
      .then(({ data }) => {
        if (data?.[0]?.value) { try { setInstructors(JSON.parse(data[0].value)) } catch {} }
      })
  }, [])

  return (
    <section id="instructores" className="section-pad" ref={ref}>
      <div className="container">
        <div className="text-center fade-up" style={{ marginBottom:"3rem" }}>
          <div className="section-label">✦ Nuestro equipo</div>
          <h2 className="section-title">Instructores de <span className="orange">élite</span></h2>
          <p className="section-sub">Cada uno con trayectoria internacional y la pasión de transformar vidas a través del movimiento.</p>
        </div>
        <div className="grid-3">
          {instructors.map((inst, i) => (
            <div key={inst.id || i} className="instructor-card fade-up" style={{ transitionDelay:`${i*0.15}s` }}>
              <div className="instructor-photo"><img src={inst.photo} alt={inst.name} loading="lazy" /></div>
              <h3 className="instructor-name">{inst.name}</h3>
              <p className="instructor-spec">{inst.specialty}</p>
              <p className="instructor-exp">{inst.experience}</p>
              <p className="instructor-bio">{inst.bio}</p>
              {inst.achievements?.length > 0 && (
                <div className="instructor-achievements">
                  <span className="achieve-label">Logros destacados</span>
                  <ul>{inst.achievements.map((a,idx) => <li key={idx}>{a}</li>)}</ul>
                </div>
              )}
              <div className="social-links">
                {inst.social?.instagram && <a href={inst.social.instagram} className="social-link" title="Instagram"><IgIcon /></a>}
                {inst.social?.tiktok    && <a href={inst.social.tiktok}    className="social-link" title="TikTok"><TkIcon /></a>}
                {inst.social?.youtube   && <a href={inst.social.youtube}   className="social-link" title="YouTube"><YtIcon /></a>}
                {inst.social?.facebook  && <a href={inst.social.facebook}  className="social-link" title="Facebook"><FbIcon /></a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
