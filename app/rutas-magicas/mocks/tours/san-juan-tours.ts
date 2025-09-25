import { Tour } from './types';

const tours: Tour[] = [
  {
    id: 'tour-sj-001',
    title: 'Tour de Café Orgánico y Textiles',
    slug: 'tour-cafe-textiles',
    summary: 'Descubre el proceso del café de altura y las técnicas de teñido natural en este tour completo por San Juan La Laguna.',
    description: 'Este tour te lleva a través de la hermosa campiña de San Juan La Laguna para explorar dos de sus industrias más importantes: el café orgánico y los textiles. Comenzarás con una visita a una cooperativa de café, donde aprenderás sobre el cultivo, cosecha y tostado del café. Luego, visitarás un taller de teñido natural donde las mujeres locales utilizan plantas, frutas y minerales para crear colores vibrantes en sus tejidos.',
    duration: '5 horas',
    difficulty: 'Fácil',
    price: {
      adult: 130,
      child: 90,
      privateGroup: 1000
    },
    includes: [
      'Guía local bilingüe',
      'Tour por la finca de café',
      'Demostración de tostado',
      'Cata de diferentes tipos de café',
      'Taller de teñido natural',
      'Agua purificada',
      'Pequeño souvenir'
    ],
    notIncludes: [
      'Transporte al punto de encuentro',
      'Compras personales',
      'Propinas'
    ],
    meetingPoint: 'Plaza central de San Juan La Laguna',
    whatToBring: [
      'Zapatos cómodos para caminar',
      'Cámara fotográfica',
      'Dinero en efectivo para compras',
      'Bloqueador solar',
      'Sombrero o gorra',
      'Chaqueta ligera (puede hacer fresco)'
    ],
    images: [
      '/images/tours/san-juan/coffee-tour-1.jpg',
      '/images/tours/san-juan/coffee-tour-2.jpg',
      '/images/tours/san-juan/dye-workshop-1.jpg'
    ],
    highlights: [
      'Visita a finca de café orgánico',
      'Demostración de tostado artesanal',
      'Cata de diferentes variedades de café',
      'Taller de teñido natural con plantas locales',
      'Apoyo directo a cooperativas locales',
      'Vistas panorámicas del lago desde los cafetales'
    ],
    itinerary: [
      {
        time: '08:00 AM',
        title: 'Encuentro en la plaza central',
        description: 'Presentación del guía y breve introducción al tour.'
      },
      {
        time: '08:30 AM',
        title: 'Caminata a la finca de café',
        description: 'Paseo por senderos con hermosas vistas del lago.'
      },
      {
        time: '09:30 AM',
        title: 'Tour por la plantación',
        description: 'Aprende sobre el cultivo orgánico del café.'
      },
      {
        time: '10:30 AM',
        title: 'Demostración de tostado',
        description: 'Proceso artesanal del café.'
      },
      {
        time: '11:30 AM',
        title: 'Cata de café',
        description: 'Prueba diferentes variedades y métodos de preparación.'
      },
      {
        time: '12:30 PM',
        title: 'Almuerzo local',
        description: 'Comida típica en un restaurante comunitario.'
      },
      {
        time: '01:30 PM',
        title: 'Taller de teñido natural',
        description: 'Aprende sobre los colores naturales y sus usos.'
      },
      {
        time: '03:00 PM',
        title: 'Regreso al pueblo',
        description: 'Tiempo libre para explorar las galerías de arte locales.'
      }
    ],
    faqs: [
      {
        question: '¿Es apto para personas con movilidad reducida?',
        answer: 'Los senderos pueden ser difíciles para sillas de ruedas, pero podemos adaptar el recorrido.'
      },
      {
        question: '¿Puedo comprar café para llevar?',
        answer: '¡Sí! Hay opciones para comprar café recién tostado y otros productos locales.'
      }
    ],
    recommendations: [
      'Usar calzado cómodo y antideslizante',
      'Llevar protección solar y sombrero',
      'Traer efectivo en quetzales para compras',
      'Llegar 10 minutos antes de la hora programada'
    ],
    capacity: {
      min: 2,
      max: 12
    },
    availableDays: ['Martes', 'Jueves', 'Sábado'],
    startTimes: ['08:00 AM']
  },
  {
    id: 'tour-sj-002',
    title: 'Tour de Murales y Galerías de Arte',
    slug: 'murales-arte-san-juan',
    summary: 'Explora el vibrante arte callejero y las galerías de artistas locales en este recorrido cultural.',
    description: 'San Juan La Laguna es conocida por su escena artística vibrante. Este tour te lleva a través de las calles llenas de color para descubrir los impresionantes murales que cuentan la historia y las tradiciones del pueblo. Visitarás también estudios de artistas locales, donde podrás ver su trabajo y aprender sobre sus técnicas e inspiraciones.',
    duration: '3 horas',
    difficulty: 'Fácil',
    price: {
      adult: 90,
      child: 60
    },
    includes: [
      'Guía local experto en arte',
      'Visita a 3-4 estudios de artistas',
      'Refresco local',
      'Pequeño taller creativo',
      'Mapa del recorrido de arte'
    ],
    notIncludes: [
      'Compras de arte',
      'Propinas',
      'Transporte al punto de encuentro'
    ],
    meetingPoint: 'Iglesia de San Juan La Laguna',
    whatToBring: [
      'Cámara fotográfica',
      'Dinero en efectivo para compras',
      'Bloqueador solar',
      'Sombrero o gorra',
      'Cuaderno para bocetos (opcional)'
    ],
    images: [
      '/images/tours/san-juan/mural-tour-1.jpg',
      '/images/tours/san-juan/mural-tour-2.jpg'
    ],
    highlights: [
      'Recorrido por los murales más impresionantes',
      'Visita a estudios de artistas locales',
      'Explicación de los símbolos y significados',
      'Pequeño taller práctico',
      'Oportunidad de comprar arte directamente a los creadores'
    ],
    itinerary: [
      {
        time: '02:00 PM',
        title: 'Encuentro en la iglesia',
        description: 'Introducción al arte de San Juan.'
      },
      {
        time: '02:30 PM',
        title: 'Recorrido por los murales',
        description: 'Exploración del arte callejero.'
      },
      {
        time: '03:30 PM',
        title: 'Visita a estudios de arte',
        description: 'Conoce a los artistas locales.'
      },
      {
        time: '04:30 PM',
        title: 'Taller creativo',
        description: 'Crea tu propia pequeña obra de arte.'
      },
      {
        time: '05:00 PM',
        title: 'Cierre del tour',
        description: 'Recomendaciones y despedida.'
      }
    ],
    capacity: {
      min: 2,
      max: 10
    },
    availableDays: ['Lunes', 'Miércoles', 'Viernes'],
    startTimes: ['10:00 AM', '02:00 PM']
  }
];

export default tours;
