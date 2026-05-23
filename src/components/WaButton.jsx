// FIX: Componente unificado (se eliminó WhatsAppButton.jsx duplicado)
// Actualiza el número de teléfono con el real de tu academia
const PHONE = "522212636042" // ← Cambia este número al real
const MESSAGE = encodeURIComponent("Hola! Me interesa una clase gratis en Elevare Dance Academy")

export default function WaButton() {
  const link = `https://wa.me/${PHONE}?text=${MESSAGE}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      style={{
        position: "fixed", bottom: "4.5rem", right: "1.75rem", zIndex: 999,
        width: 60, height: 60, borderRadius: "50%",
        background: "linear-gradient(145deg,#2ecc71,#25d366)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 24px rgba(37,211,102,.5)",
        animation: "waPulse 2s ease-in-out infinite",
        transition: "transform .2s",
        textDecoration: "none",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <style>{`
        @keyframes waPulse {
          0%,100% { box-shadow: 0 4px 24px rgba(37,211,102,.5); }
          50% { box-shadow: 0 4px 40px rgba(37,211,102,.8); }
        }
      `}</style>
      <svg width="32" height="32" fill="#fff" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.549 4.103 1.51 5.831L.055 23.454a.75.75 0 00.918.918l5.623-1.455A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.181-1.433l-.371-.22-3.843.994.994-3.843-.22-.371A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  )
}