import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useFadeUp } from "../hooks/useFadeUp"
import { PLANS } from "../data/content"

const CheckIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>)

export default function Precios({ onOpenModal }) {
  const ref = useFadeUp()
  const [plans, setPlans] = useState(PLANS)

  useEffect(() => {
    supabase.from("cms_settings").select("key,value").eq("key","planes_items")
      .then(({ data }) => {
        if (data?.[0]?.value) { try { setPlans(JSON.parse(data[0].value)) } catch {} }
      })
  }, [])

  return (
    <section id="precios" className="section-pad" ref={ref}>
      <div className="container">
        <div className="text-center fade-up" style={{ marginBottom:"3rem" }}>
          <div className="section-label">Planes</div>
          <h2 className="section-title">Invierte en tu <span className="gold">pasion</span></h2>
          <p className="section-sub">Planes diseñados para todos los niveles y objetivos. Sin contratos de permanencia.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={plan.id || i} className={`pricing-card fade-up${plan.featured ? " featured" : ""}`} style={{ transitionDelay:`${i*0.15}s` }}>
              {plan.featured && <div className="pricing-badge">Recomendado</div>}
              <h3 className="pricing-name">{plan.name}</h3>
              <div className="pricing-price">
                <strong>${plan.price}</strong>
                <span>MXN/mes</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((f, idx) => (<li key={idx}><CheckIcon />{f}</li>))}
              </ul>
              {plan.featured
                ? <button className="btn btn-primary" style={{ width:"100%", padding:".85rem", fontSize:".95rem" }} onClick={onOpenModal}>Quiero este plan</button>
                : <button className="btn btn-outline" style={{ width:"100%", padding:".85rem", fontSize:".95rem" }} onClick={onOpenModal}>Elegir plan</button>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
