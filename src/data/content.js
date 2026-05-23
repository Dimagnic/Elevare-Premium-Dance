export const DANCE_STYLES = [
  {
    id: 1,
    name: "Salsa & Bachata",
    description: "Ritmos latinos que encenderán tu alma. Técnica, pasión y conexión con tu pareja.",
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80",
  },
  {
    id: 2,
    name: "Ballet Contemporáneo",
    description: "Disciplina, gracia y expresión artística. El lenguaje universal del movimiento.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",
  },
  {
    id: 3,
    name: "Hip-Hop & Urban",
    description: "Actitud, estilo y técnica urbana. Libera tu energía con los mejores instructores.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    id: 4,
    name: "Jazz & Lírico",
    description: "La fusión perfecta de técnica clásica y libertad expresiva contemporánea.",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80",
  },
  {
    id: 5,
    name: "Zumba & Fitness",
    description: "Transforma tu cuerpo mientras disfrutas. El entrenamiento más divertido de tu vida.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  },
  {
    id: 6,
    name: "Flamenco",
    description: "Arte puro. Pasión, duende y la tradición más profunda del baile español.",
    image: "https://images.unsplash.com/photo-1528291954423-c0c71c12baeb?w=600&q=80",
  },
]

export const INSTRUCTORS = [
  {
    id: 1,
    name: "Sofía Martínez",
    specialty: "Salsa & Bachata",
    experience: "12 años de experiencia",
    bio: "Campeona latinoamericana con formación en Colombia y Cuba. Su método combina técnica pura con la esencia del ritmo caribeño.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    achievements: ["Campeona WDSF 2019 y 2021", "Formación con maestros en Cali y La Habana"],
    social: { instagram: "#" },
  },
  {
    id: 2,
    name: "Carlos Rivera",
    specialty: "Hip-Hop & Urban",
    experience: "9 años de experiencia",
    bio: "Coreógrafo para artistas internacionales y ganador de World of Dance. Lleva la calle al estudio con autenticidad total.",
    photo: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80",
    achievements: ["Top 8 World of Dance 2022", "Coreógrafo para J Balvin y Ozuna"],
    social: { tiktok: "#" },
  },
  {
    id: 3,
    name: "Ana Cecilia López",
    specialty: "Ballet Contemporáneo",
    experience: "15 años de experiencia",
    bio: "Exbailarina principal del Ballet Nacional. Su clase es un viaje entre la técnica clásica y la libertad contemporánea.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    achievements: ["Solista del Ballet Nacional 2010-2020", "Premio Revelación del año, INBA 2012"],
    social: { instagram: "#", youtube: "#" },
  },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: "María González",
    photo: "https://i.pravatar.cc/80?img=47",
    rating: 5,
    text: "Llegué sin saber bailar absolutamente nada. En 6 meses participé en mi primer show. La metodología de Clave de Tres es increíble, los instructores son pacientes y motivadores.",
  },
  {
    id: 2,
    name: "Roberto Sánchez",
    photo: "https://i.pravatar.cc/80?img=33",
    rating: 5,
    text: "Llevo 2 años en el plan Elite. Las clases privadas son un antes y un después. Carlos me preparó para una competencia nacional y quedé en el top 5. Vale cada peso.",
  },
  {
    id: 3,
    name: "Valeria Torres",
    photo: "https://i.pravatar.cc/80?img=5",
    rating: 5,
    text: "Las instalaciones son de primer nivel, limpias, con espejos de piso a techo y audio profesional. Pero lo que más me conquistó es la comunidad de Clave de Tres.",
  },
]

export const PLANS = [
  {
    id: 1,
    name: "Básico",
    price: "599",
    featured: false,
    features: ["4 clases al mes", "1 estilo a elegir", "Acceso a instalaciones", "App de progreso"],
  },
  {
    id: 2,
    name: "Premium",
    price: "999",
    featured: true,
    features: ["Clases ilimitadas", "Todos los estilos", "Sesión mensual con instructor élite", "Acceso 24/7 a videos", "Descuento en eventos"],
  },
  {
    id: 3,
    name: "Élite",
    price: "1,599",
    featured: false,
    features: ["Todo lo del plan Premium", "4 clases privadas al mes", "Coaching de competencia", "Acceso VIP a shows", "Plan nutricional deportivo"],
  },
]

export const STATS = [
  { number: "+2,800", label: "Alumnos formados", color: "orange" },
  { number: "12", label: "Instructores certificados", color: "gold" },
  { number: "8", label: "Estilos de baile", color: "orange" },
  { number: "97%", label: "Satisfacción de alumnos", color: "gold" },
]