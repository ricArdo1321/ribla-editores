// Brand Colors
export const COLORS = {
  desertSand: '#F2E2C4',      // Top border accent
  ashGray: '#4A4A48',         // Primary text
  terracotta: '#D96B27',      // Hover / CTA
  araucariaGreen: '#6C8A3D',  // Labels
  offWhite: '#FAFAFA',        // Subtle backgrounds
};

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  year: number;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  imageUrl: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  detail: string;
}

export const CATALOG: Book[] = [
  {
    id: 1,
    title: "El Silencio de los Algoritmos",
    author: "Elena Varela",
    genre: "Ensayo Digital",
    year: 2025,
    coverUrl: "https://picsum.photos/seed/book1/600/900"
  },
  {
    id: 2,
    title: "Cartografía del Olvido",
    author: "Javier M. Sola",
    genre: "Poesía",
    year: 2025,
    coverUrl: "https://picsum.photos/seed/book2/600/900"
  },
  {
    id: 3,
    title: "Frecuencia Modular",
    author: "Anaís Nin (Edición Crítica)",
    genre: "Clásicos Revisitados",
    year: 2025,
    coverUrl: "https://picsum.photos/seed/book3/600/900"
  },
  {
    id: 4,
    title: "Arquitecturas Invisibles",
    author: "Dr. L. K. Chen",
    genre: "Ciencia y Sociedad",
    year: 2024,
    coverUrl: "https://picsum.photos/seed/book4/600/900"
  },
  {
    id: 5,
    title: "Bajo el Cemento",
    author: "Sofía R. Costa",
    genre: "Narrativa Contemporánea",
    year: 2025,
    coverUrl: "https://picsum.photos/seed/book5/600/900"
  },
  {
    id: 6,
    title: "La Ética del Glitch",
    author: "Markus O'Neil",
    genre: "Tecnología",
    year: 2025,
    coverUrl: "https://picsum.photos/seed/book6/600/900"
  }
];

export const JOURNAL_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "El papel en la era de la pantalla infinita",
    category: "Reflexiones",
    date: "OCT 2025",
    excerpt: "¿Tiene sentido seguir imprimiendo cuando todo está en la nube? Una defensa de la materialidad del libro.",
    imageUrl: "https://picsum.photos/seed/journal1/800/500"
  },
  {
    id: 2,
    title: "Conversación con Elena Varela",
    category: "Entrevistas",
    date: "SEP 2025",
    excerpt: "La autora de 'El Silencio de los Algoritmos' nos habla sobre la ética en la inteligencia artificial.",
    imageUrl: "https://picsum.photos/seed/journal2/800/500"
  }
];

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Corrección Profesional",
    description: "Ortotipografía y estilo para pulir el texto respetando la voz del autor.",
    detail: "Desde manuscritos académicos hasta narrativa experimental."
  },
  {
    id: 2,
    title: "Diseño Editorial",
    description: "Maquetación interior y diseño de cubiertas con sensibilidad tipográfica.",
    detail: "Cuidamos el blanco de la página tanto como la tinta."
  },
  {
    id: 3,
    title: "Mentoring Literario",
    description: "Acompañamiento creativo y estructural para obras en desarrollo.",
    detail: "Informes de lectura profundos y honestos."
  }
];

export const NAV_LINKS = [
  { name: 'Inicio', href: '/' },
  { name: 'Sobre nosotros', href: '/#about' },
  { name: 'Catálogo', href: '/#catalog' },
  { name: 'Journal', href: '/journal' },
  { name: 'Servicios', href: '/#services' },
  { name: 'Tienda', href: '/' },
  { name: 'Contacto', href: '/#footer' },
];