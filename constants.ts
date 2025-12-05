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

export const NAV_LINKS = [
  { name: 'Inicio', href: '#' },
  { name: 'Sobre nosotros', href: '#about' },
  { name: 'Catálogo', href: '#catalog' },
  { name: 'Tienda', href: '#' },
  { name: 'Autores', href: '#' },
  { name: 'Contacto', href: '#footer' },
];