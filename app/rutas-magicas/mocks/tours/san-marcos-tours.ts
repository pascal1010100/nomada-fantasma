import { Tour } from './types';

const tours: Tour[] = [
  {
    id: 'tour-sm-001',
    title: 'Retiro de Yoga y Meditación',
    slug: 'retiro-yoga-meditacion',
    summary: 'Una experiencia transformadora de conexión mente-cuerpo en un entorno natural único.',
    description: 'Sumérgete en la práctica del yoga y la meditación en uno de los lugares más energéticos del Lago de Atitlán. Este retiro incluye sesiones de yoga al amanecer, meditaciones guiadas, talleres de autoconocimiento y tiempo para la reflexión personal.',
    duration: '1 día completo',
    difficulty: 'Fácil',
    price: {
      adult: 200,
      privateGroup: 1500
    },
    includes: [
      '3 sesiones de yoga',
      '2 meditaciones guiadas',
      'Taller de respiración',
      'Almuerzo vegetariano',
      'Tés e infusiones',
      'Material didáctico',
      'Acceso a las instalaciones'
    ],
    notIncludes: [
      'Hospedaje',
      'Cena',
      'Masajes o terapias adicionales',
      'Propinas'
    ],
    meetingPoint: 'Centro Holístico San Marcos',
    whatToBring: [
      'Ropa cómoda para yoga',
      'Toalla',
      'Bloqueador solar',
      'Cuaderno para notas',
      'Botella de agua reutilizable'
    ],
    images: [
      '/images/tours/yoga-retreat-1.jpg',
      '/images/tours/yoga-retreat-2.jpg'
    ],
    highlights: [
      'Clases con instructores certificados',
      'Ubicación privilegiada con vista al lago',
      'Comida saludable y orgánica',
      'Grupos reducidos para atención personalizada',
      'Técnicas para reducir el estrés'
    ],
    itinerary: [
      {
        time: '07:00 AM',
        title: 'Yoga al amanecer',
        description: 'Sesión de Hatha Yoga para despertar el cuerpo y la mente.'
      },
      {
        time: '09:00 AM',
        title: 'Desayuno saludable',
        description: 'Alimentos orgánicos y locales.'
      },
      {
        time: '10:30 AM',
        title: 'Taller de respiración',
        description: 'Técnicas de Pranayama.'
      },
      {
        time: '12:30 PM',
        title: 'Almuerzo vegetariano',
        description: 'Comida nutritiva y balanceada.'
      },
      {
        time: '03:00 PM',
        title: 'Meditación guiada',
        description: 'Práctica de mindfulness.'
      },
      {
        time: '05:00 PM',
        title: 'Sesión de cierre',
        description: 'Reflexión y preguntas.'
      }
    ],
    faqs: [
      {
        question: '¿Necesito experiencia previa en yoga?',
        answer: 'No, las clases se adaptan a todos los niveles.'
      },
      {
        question: '¿Puedo asistir a una sola clase?',
        answer: 'El retiro está diseñado como una experiencia completa de un día.'
      }
    ],
    recommendations: [
      'Llegar 15 minutos antes',
      'Evitar comer pesado antes de las clases',
      'Traer ropa abrigada para las noches',
      'Informar de lesiones o condiciones médicas'
    ],
    capacity: {
      min: 3,
      max: 12
    },
    availableDays: ['Lunes', 'Miércoles', 'Viernes', 'Domingo'],
    startTimes: ['07:00 AM']
  },
  {
    id: 'tour-sm-002',
    title: 'Tour de Sanación con Sonido',
    slug: 'sanacion-con-sonido',
    summary: 'Experimenta la vibración curativa de los cuencos tibetanos y otros instrumentos ancestrales.',
    description: 'Este taller terapéutico utiliza las frecuencias de sonido para armonizar el cuerpo y la mente. A través de baños de sonido con cuencos tibetanos, tambores chamánicos y otros instrumentos, lograrás un estado profundo de relajación y sanación.',
    duration: '2 horas',
    difficulty: 'Fácil',
    price: {
      adult: 120,
      child: 80
    },
    includes: [
      'Sesión de sonido de 90 minutos',
      'Colchoneta y manta',
      'Té de hierbas locales',
      'Guía de meditación'
    ],
    notIncludes: [
      'Transporte',
      'Propinas',
      'Comidas'
    ],
    meetingPoint: 'Templo del Sonido, San Marcos La Laguna',
    whatToBring: [
      'Ropa cómoda',
      'Una manta adicional si lo deseas',
      'Agua',
      'Un objeto personal para energizar (opcional)'
    ],
    images: [
      '/images/tours/sound-healing-1.jpg',
      '/images/tours/sound-healing-2.jpg'
    ],
    highlights: [
      'Terapia de sonido con instrumentos auténticos',
      'Guía experto en sanación con sonido',
      'Ambiente relajante y seguro',
      'Técnicas para reducir el estrés y la ansiedad',
      'Pequeños grupos para una experiencia más personalizada'
    ],
    itinerary: [
      {
        time: '04:00 PM',
        title: 'Introducción',
        description: 'Breve explicación sobre la terapia de sonido.'
      },
      {
        time: '04:15 PM',
        title: 'Meditación guiada',
        description: 'Preparación para la sesión de sonido.'
      },
      {
        time: '04:45 PM',
        title: 'Baño de sonido',
        description: 'Sesión con instrumentos de sanación.'
      },
      {
        time: '05:45 PM',
        title: 'Regreso a la conciencia',
        description: 'Integración de la experiencia.'
      },
      {
        time: '06:00 PM',
        title: 'Círculo de cierre',
        description: 'Compartir experiencias y preguntas.'
      }
    ],
    capacity: {
      min: 2,
      max: 8
    },
    availableDays: ['Martes', 'Jueves', 'Sábado'],
    startTimes: ['04:00 PM', '06:30 PM']
  }
];

export default tours;
