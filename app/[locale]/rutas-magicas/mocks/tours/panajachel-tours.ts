import { Tour } from './types';

const panajachelTours: Tour[] = [
  {
    id: 'pana-market-tour',
    title: 'Tour del Mercado Local y Calle Santander',
    slug: 'tour-mercado-santander',
    summary: 'Explora el bullicioso mercado local y la famosa Calle Santander de Panajachel.',
    description: 'Sumérgete en la vida local con este tour que te llevará por el auténtico mercado de Panajachel, donde podrás encontrar desde frutas exóticas hasta artesanías tradicionales. Luego, recorre la icónica Calle Santander, llena de tiendas, galerías y restaurantes con vista al lago.',
    duration: '3 horas',
    difficulty: 'Fácil',
    price: {
      adult: 150,
      privateGroup: 1200
    },
    includes: [
      'Guía local bilingüe',
      'Degustación de frutas locales',
      'Muestra de artesanías',
      'Mapa de la zona'
    ],
    meetingPoint: 'Parque Central de Panajachel',
    whatToBring: [
      'Zapatos cómodos para caminar',
      'Dinero en efectivo para compras',
      'Cámara fotográfica',
      'Bloqueador solar',
      'Sombrero o gorra'
    ],
    images: [
      '/images/tours/panajachel/mercado-1.jpg',
      '/images/tours/panajachel/santander-1.jpg'
    ],
    notIncludes: [
      'Transporte al punto de encuentro',
      'Comidas no especificadas',
      'Propinas',
      'Gastos personales'
    ],
    capacity: {
      min: 2,
      max: 12
    },
    availableDays: ['Lunes', 'Miércoles', 'Viernes', 'Sábado'],
    startTimes: ['9:00 AM', '2:00 PM'],
    highlights: [
      'Recorrido por el mercado local',
      'Calle Santander y sus tiendas',
      'Degustación de frutas locales',
      'Artesanías típicas',
      'Vistas al Lago de Atitlán'
    ],
    itinerary: [
      {
        time: '9:00 AM',
        title: 'Encuentro en el Parque Central',
        description: 'Breve introducción sobre la historia de Panajachel.'
      },
      {
        time: '9:30 AM',
        title: 'Mercado Local',
        description: 'Recorrido por los puestos de frutas, verduras y artesanías.'
      },
      {
        time: '11:00 AM',
        title: 'Calle Santander',
        description: 'Paseo por la calle principal de tiendas y restaurantes.'
      },
      {
        time: '12:00 PM',
        title: 'Tiempo libre',
        description: 'Tiempo para compras o exploración por cuenta propia.'
      }
    ]
  },
  {
    id: 'pana-kayak-sunset',
    title: 'Kayak al Atardecer en el Lago',
    slug: 'kayak-atardecer',
    summary: 'Una experiencia única navegando las aguas del Lago de Atitlán al atardecer.',
    description: 'Disfruta de las impresionantes vistas de los volcanes mientras navegas en kayak por las tranquilas aguas del lago. Esta experiencia incluye una parada en una playa privada para disfrutar de un snack y bebidas mientras el sol se oculta detrás de los volcanes.',
    duration: '2.5 horas',
    difficulty: 'Moderado',
    price: {
      adult: 250,
      privateGroup: 2000
    },
    includes: [
      'Equipo de kayak y chaleco salvavidas',
      'Guía instructor certificado',
      'Snack y bebidas',
      'Toalla y bolsa seca',
      'Seguro de responsabilidad civil'
    ],
    meetingPoint: 'Playa Pública de Panajachel',
    whatToBring: [
      'Traje de baño',
      'Toalla',
      'Bloqueador solar',
      'Gorra o sombrero',
      'Cámara a prueba de agua'
    ],
    images: [
      '/images/tours/panajachel/kayak-1.jpg',
      '/images/tours/panajachel/sunset-1.jpg'
    ],
    notIncludes: [
      'Transporte al punto de encuentro',
      'Comidas no especificadas',
      'Propinas',
      'Seguro de viaje',
      'Gastos personales'
    ],
    capacity: {
      min: 1,
      max: 8
    },
    availableDays: ['Martes', 'Jueves', 'Sábado', 'Domingo'],
    startTimes: ['4:00 PM'],
    highlights: [
      'Vistas panorámicas de los volcanes',
      'Atardecer en el lago',
      'Guía experto',
      'Equipo de calidad',
      'Experiencia segura y divertida'
    ],
    itinerary: [
      {
        time: '4:00 PM',
        title: 'Encuentro en la playa',
        description: 'Breve instrucción sobre seguridad y técnicas de remo.'
      },
      {
        time: '4:30 PM',
        title: 'Navegación',
        description: 'Recorrido por la costa con paradas para fotos.'
      },
      {
        time: '5:30 PM',
        title: 'Puesta de sol',
        description: 'Parada en playa privada para disfrutar del atardecer.'
      },
      {
        time: '6:30 PM',
        title: 'Regreso',
        description: 'Retorno a la playa de Panajachel.'
      }
    ]
  },
  {
    id: 'pana-culinary-tour',
    title: 'Tour Culinario por Panajachel',
    slug: 'tour-culinario',
    summary: 'Descubre los sabores auténticos de la cocina guatemalteca en un recorrido gastronómico.',
    description: 'Este tour te llevará a probar los platillos más representativos de la gastronomía guatemalteca en los restaurantes y puestos locales de Panajachel. Desde los típicos chuchitos y tamales hasta los postres tradicionales, acompañados de bebidas locales como el atol de elote y el café guatemalteco.',
    duration: '4 horas',
    difficulty: 'Fácil',
    price: {
      adult: 300,
      privateGroup: 2500
    },
    includes: [
      'Degustación en 5-6 establecimientos',
      'Guía gastronómico local',
      'Agua purificada',
      'Recetario digital',
      'Descuentos en compras locales'
    ],
    meetingPoint: 'Parque Central de Panajachel',
    whatToBring: [
      'Ropa cómoda',
      'Zapatos para caminar',
      'Cámara',
      'Dinero extra para compras',
      'Apetito'
    ],
    images: [
      '/images/tours/panajachel/comida-1.jpg',
      '/images/tours/panajachel/comida-2.jpg'
    ],
    notIncludes: [
      'Bebidas alcohólicas',
      'Propinas',
      'Compras personales',
      'Transporte al punto de encuentro'
    ],
    capacity: {
      min: 2,
      max: 10
    },
    availableDays: ['Lunes', 'Miércoles', 'Viernes', 'Sábado', 'Domingo'],
    startTimes: ['10:00 AM'],
    highlights: [
      'Degustación de platos típicos',
      'Visita a restaurantes locales',
      'Cocina en vivo',
      'Historia de la gastronomía local',
      'Recomendaciones culinarias'
    ],
    itinerary: [
      {
        time: '10:00 AM',
        title: 'Encuentro',
        description: 'Presentación del tour y breve introducción a la gastronomía guatemalteca.'
      },
      {
        time: '10:30 AM',
        title: 'Desayuno típico',
        description: 'Degustación de desayunos tradicionales.'
      },
      {
        time: '12:00 PM',
        title: 'Comida callejera',
        description: 'Prueba de antojitos y comida rápida local.'
      },
      {
        time: '1:30 PM',
        title: 'Postres y café',
        description: 'Cierre con postres tradicionales y degustación de café.'
      }
    ]
  }
];

export default panajachelTours;
