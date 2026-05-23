import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useFadeUp } from "../hooks/useFadeUp"
import { TESTIMONIALS } from "../data/content"

const StarIcon = () => (<svg className="star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)

export default function Testimonios() {
  const ref = useFadeUp()
  const [testimonials, setTestimonials] = useState(TESTIMONIALS)

  useEffect(() => {
    supabase.from("cms_settings").select("key,value").eq("key","testimonios_items")
      .then(({ data }) => {
        if (data?.[0]?.value) { try { setTestimonials(JSON.parse(data[0].value)) } catch {} }
      })
  }, [])

  return (
    <section id="testimonios" className="section-pad" ref={ref}>
      <div className="container">
        <div className="text-center fade-up" style={{ marginBottom:"3rem" }}>
          <div className="section-label">✦ Testimonios</div>
          <h2 className="section-title">Lo que dicen <span className="orange">nuestros alumnos</span></h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div key={t.id || i} className="testimonial-card fade-up" style={{ transitionDelay:`${i*0.15}s` }}>
              <div className="testimonial-head">
                <div className="testimonial-avatar"><img src={t.photo} alt={t.name} loading="lazy" /></div>
                <div>
                  <p className="testimonial-name">{t.name}</p>
                  <div className="stars">{Array.from({ length: t.rating }).map((_,idx) => <StarIcon key={idx} />)}</div>
                </div>
              </div>
              <p className="testimonial-text">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
