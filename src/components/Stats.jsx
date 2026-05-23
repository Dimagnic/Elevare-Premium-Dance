import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useFadeUp } from "../hooks/useFadeUp"

const DEFAULTS = [
  { key: "stat_1", number: "+2,800", label: "Alumnos formados",        color: "orange" },
  { key: "stat_2", number: "12",     label: "Instructores certificados", color: "gold"   },
  { key: "stat_3", number: "8",      label: "Estilos de baile",         color: "orange" },
  { key: "stat_4", number: "97%",    label: "Satisfacción de alumnos",  color: "gold"   },
]

export default function Stats() {
  const ref = useFadeUp()
  const [stats, setStats] = useState(DEFAULTS)

  useEffect(() => {
    supabase
      .from("cms_settings")
      .select("key,value")
      .in("key", ["stat_1", "stat_2", "stat_3", "stat_4"])
      .then(({ data }) => {
        if (!data?.length) return
        const map = {}
        data.forEach(r => { if (r.value) map[r.key] = JSON.parse(r.value) })
        setStats(DEFAULTS.map(d => map[d.key] ? { ...d, ...map[d.key] } : d))
      })
  }, [])

  return (
    <section id="stats" ref={ref}>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={s.key} className="stat-item fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className={`stat-number ${s.color}`}>{s.number}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
