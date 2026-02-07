import { LucideIcon } from 'lucide-react';

export interface Guide {
    id: string;
    name: string;
    photo: string;
    bio: string;
    specialties: string[];
    languages: string[];
    contact: string; // WhatsApp link or number
    rating: number;
    reviews: number;
}

export interface MicroRoutePoint {
    id: string;
    title: string;
    description: string;
    lat: number;
    lng: number;
    type: 'viewpoint' | 'activity' | 'food' | 'culture';
}

export interface MicroRoute {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: MicroRoutePoint[];
}

export interface Town {
    id: string;
    slug: string;
    title: string;
    summary: string;
    fullDescription: string;
    coverImage: string;
    vibe: string; // e.g., "Zen & Yoga", "Party & Backpackers"
    location: {
        lat: number;
        lng: number;
    };
    highlights: string[];
    activities: string[];
    guides: Guide[];
    microRoutes: MicroRoute[];
    weather: {
        temp: number;
        condition: string;
    };
}

export const atitlanTowns: Town[] = [
    {
        id: 'san-marcos',
        slug: 'san-marcos',
        title: 'San Marcos La Laguna',
        summary: 'El corazón espiritual y zen del lago.',
        fullDescription: 'San Marcos es conocido como el centro holístico de Atitlán. Aquí encontrarás yoga, meditación, cacao ceremonies y una vibra relajada única. Sus callejones estrechos están llenos de murales, jardines y pequeños cafés conscientes.',
        coverImage: '/images/rutas/san-marcos.jpg',
        vibe: 'Zen & Espiritual',
        location: { lat: 14.7258, lng: -91.2619 },
        highlights: ['Cerro Tzankujil', 'Yoga & Meditación', 'Ceremonias de Cacao'],
        activities: ['Saltar del trampolín en la reserva', 'Clase de Yoga al amanecer', 'Masaje holístico'],
        weather: { temp: 24, condition: 'Soleado' },
        guides: [
            {
                id: 'g1',
                name: 'María "Luna" Pérez',
                photo: '/images/guides/maria.jpg',
                bio: 'Guía espiritual y experta en flora local. Nací en San Marcos y conozco cada sendero sagrado.',
                specialties: ['Flora Medicinal', 'Caminatas Meditativas', 'Historia Maya'],
                languages: ['Español', 'Inglés', 'Kaqchikel'],
                contact: 'https://wa.me/50212345678',
                rating: 4.9,
                reviews: 42
            },
            {
                id: 'g2',
                name: 'Juan Carlos',
                photo: '/images/guides/juan.jpg',
                bio: 'Aventurero y kayakista. Te llevo a los mejores spots secretos para nadar.',
                specialties: ['Kayak', 'Senderismo', 'Fotografía'],
                languages: ['Español', 'Inglés'],
                contact: 'https://wa.me/50287654321',
                rating: 4.8,
                reviews: 28
            }
        ],
        microRoutes: [
            {
                id: 'ruta-zen',
                title: 'Ruta del Despertar',
                description: 'Un recorrido por los puntos más energéticos del pueblo.',
                duration: '2 horas',
                difficulty: 'easy',
                points: [
                    { id: 'p1', title: 'Muelle Principal', description: 'Punto de partida con vista a los volcanes.', lat: 14.7250, lng: -91.2620, type: 'viewpoint' },
                    { id: 'p2', title: 'El Bosque de Yoga', description: 'Centro de retiro y paz.', lat: 14.7265, lng: -91.2615, type: 'activity' },
                    { id: 'p3', title: 'Reserva Cerro Tzankujil', description: 'Naturaleza sagrada y altar maya.', lat: 14.7260, lng: -91.2640, type: 'viewpoint' }
                ]
            }
        ]
    },
    {
        id: 'san-pedro',
        slug: 'san-pedro',
        title: 'San Pedro La Laguna',
        summary: 'Fiesta, mochileros y aventura al pie del volcán.',
        fullDescription: 'San Pedro es vibrante y lleno de vida. Famoso por su vida nocturna, escuelas de español y ser el punto de partida para escalar el Volcán San Pedro. Es el lugar ideal para conocer viajeros de todo el mundo.',
        coverImage: '/images/rutas/san-pedro.jpg',
        vibe: 'Fiesta & Aventura',
        location: { lat: 14.6936, lng: -91.2725 },
        highlights: ['Volcán San Pedro', 'Vida Nocturna', 'Indian Nose (Amanecer)'],
        activities: ['Escalar el volcán', 'Clases de Español', 'Fiesta en la orilla del lago'],
        weather: { temp: 26, condition: 'Parcialmente nublado' },
        guides: [
            {
                id: 'g3',
                name: 'Pedro "El Jaguar"',
                photo: '/images/guides/pedro.jpg',
                bio: 'Guía certificado de montaña. He subido el volcán más de 500 veces.',
                specialties: ['Volcán San Pedro', 'Indian Nose', 'Camping'],
                languages: ['Español', 'Inglés', 'Tz\'utujil'],
                contact: 'https://wa.me/50211223344',
                rating: 5.0,
                reviews: 150
            }
        ],
        microRoutes: [
            {
                id: 'ruta-cafe',
                title: 'Ruta del Café y Arte',
                description: 'Descubre el proceso del café y los murales locales.',
                duration: '3 horas',
                difficulty: 'medium',
                points: [
                    { id: 'sp1', title: 'Cooperativa de Café', description: 'Degustación y tour.', lat: 14.6940, lng: -91.2730, type: 'culture' },
                    { id: 'sp2', title: 'Calle de los Murales', description: 'Arte urbano local.', lat: 14.6950, lng: -91.2720, type: 'viewpoint' }
                ]
            }
        ]
    },
    {
        id: 'panajachel',
        slug: 'panajachel',
        title: 'Panajachel',
        summary: 'La puerta de entrada al lago y centro comercial.',
        fullDescription: 'Pana es el centro logístico y comercial. La Calle Santander ofrece artesanías de todo el país. Es el mejor lugar para conectar con cualquier otro pueblo y disfrutar de atardeceres increíbles.',
        coverImage: '/images/rutas/panajachel.jpg',
        vibe: 'Comercial & Conectividad',
        location: { lat: 14.7414, lng: -91.1583 },
        highlights: ['Calle Santander', 'Reserva Natural Atitlán', 'Atardeceres'],
        activities: ['Compras de artesanías', 'Canopy en la reserva', 'Paseo en lancha privada'],
        weather: { temp: 25, condition: 'Viento suave' },
        guides: [
            {
                id: 'g4',
                name: 'Ana Lucía',
                photo: '/images/guides/ana.jpg',
                bio: 'Experta en textiles y cultura. Te ayudo a encontrar las mejores artesanías sin precios de turista.',
                specialties: ['Textiles', 'Compras', 'Historia'],
                languages: ['Español', 'Inglés'],
                contact: 'https://wa.me/50299887766',
                rating: 4.7,
                reviews: 35
            }
        ],
        microRoutes: [
            {
                id: 'ruta-santander',
                title: 'Ruta de la Calle Santander',
                description: 'Explora el corazón comercial y cultural de Panajachel, desde artesanías hasta gastronomía local.',
                duration: '1.5 horas',
                difficulty: 'easy',
                points: [
                    { id: 'ps1', title: 'Inicio Calle Santander', description: 'Punto de partida con tiendas de artesanías.', lat: 14.7414, lng: -91.1583, type: 'culture' },
                    { id: 'ps2', title: 'Mercado de Artesanías', description: 'Textiles y productos locales.', lat: 14.7420, lng: -91.1590, type: 'culture' },
                    { id: 'ps3', title: 'Malecón del Lago', description: 'Vista panorámica del lago.', lat: 14.7425, lng: -91.1595, type: 'viewpoint' }
                ]
            }
        ]
    },
    {
        id: 'san-juan',
        slug: 'san-juan',
        title: 'San Juan La Laguna',
        summary: 'Arte, textiles y cultura maya auténtica.',
        fullDescription: 'San Juan es el pueblo más colorido y artístico del lago. Famoso por sus cooperativas de mujeres tejedoras que usan tintes naturales, galerías de arte naif y plantaciones de café orgánico. Es un ejemplo de turismo comunitario bien organizado.',
        coverImage: '/images/rutas/san-juan.jpg',
        vibe: 'Arte & Cultura',
        location: { lat: 14.6923, lng: -91.2880 },
        highlights: ['Cooperativas de Textiles', 'Mirador Kaqasiiwaan', 'Galerías de Arte'],
        activities: ['Tour de tintes naturales', 'Caminata al mirador', 'Degustación de café'],
        weather: { temp: 25, condition: 'Soleado' },
        guides: [
            {
                id: 'g5',
                name: 'Elena "La Artista"',
                photo: '/images/guides/elena.jpg',
                bio: 'Tejedora y pintora. Te enseñaré el proceso ancestral de crear colores con plantas.',
                specialties: ['Textiles Mayas', 'Arte Naif', 'Cultura Tz\'utujil'],
                languages: ['Español', 'Tz\'utujil'],
                contact: 'https://wa.me/50211122233',
                rating: 4.9,
                reviews: 50
            }
        ],
        microRoutes: [
            {
                id: 'ruta-arte',
                title: 'Ruta de los Colores',
                description: 'Un recorrido por las galerías y murales más impresionantes.',
                duration: '2 horas',
                difficulty: 'easy',
                points: [
                    { id: 'sj1', title: 'Calle de los Sombreros', description: 'Decoración colorida y tiendas.', lat: 14.6930, lng: -91.2870, type: 'viewpoint' },
                    { id: 'sj2', title: 'Cooperativa Casa Flor', description: 'Demostración de tejido.', lat: 14.6940, lng: -91.2860, type: 'culture' },
                    { id: 'sj3', title: 'Mirador Kaqasiiwaan', description: 'Vista panorámica del pueblo y el lago.', lat: 14.6910, lng: -91.2890, type: 'viewpoint' }
                ]
            }
        ]
    },
    {
        id: 'santiago',
        slug: 'santiago',
        title: 'Santiago Atitlán',
        summary: 'Tradición profunda y hogar de Maximón.',
        fullDescription: 'El pueblo más grande y con mayor identidad indígena. Aquí los hombres aún visten sus trajes tradicionales a diario. Es el hogar de Maximón, una deidad sincrética fascinante, y ofrece una inmersión cultural profunda.',
        coverImage: '/images/rutas/santiago.jpg',
        vibe: 'Tradición & Misticismo',
        location: { lat: 14.6390, lng: -91.2290 },
        highlights: ['Cofradía de Maximón', 'Iglesia Colonial', 'Parque de la Paz'],
        activities: ['Visita a Maximón', 'Tour de historia', 'Observación de aves'],
        weather: { temp: 27, condition: 'Húmedo' },
        guides: [
            {
                id: 'g6',
                name: 'Diego',
                photo: '/images/guides/diego.jpg',
                bio: 'Historiador local. Te explicaré el sincretismo religioso y la historia del conflicto armado.',
                specialties: ['Historia', 'Religión Maya', 'Maximón'],
                languages: ['Español', 'Inglés', 'Tz\'utujil'],
                contact: 'https://wa.me/50233344455',
                rating: 4.8,
                reviews: 40
            }
        ],
        microRoutes: [
            {
                id: 'ruta-maximon',
                title: 'Ruta de Maximón y Tradición',
                description: 'Descubre la historia y misticismo de Santiago, visitando la cofradía de Maximón y sitios sagrados.',
                duration: '2.5 horas',
                difficulty: 'easy',
                points: [
                    { id: 'sa1', title: 'Iglesia de Santiago', description: 'Iglesia colonial con historia maya.', lat: 14.6390, lng: -91.2290, type: 'culture' },
                    { id: 'sa2', title: 'Cofradía de Maximón', description: 'Visita al santo sincrético.', lat: 14.6395, lng: -91.2295, type: 'culture' },
                    { id: 'sa3', title: 'Mercado Municipal', description: 'Mercado tradicional tz\'utujil.', lat: 14.6385, lng: -91.2285, type: 'culture' }
                ]
            }
        ]
    }
];
