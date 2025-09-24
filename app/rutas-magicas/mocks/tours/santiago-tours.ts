import { Tour } from './types';

const tours: Tour[] = [
  {
    id: 'tour-st-001',
    title: 'Tour Cultural por Santiago Atitlán',
    slug: 'tour-cultural-santiago',
    summary: 'Sumérgete en la rica cultura tz\'utujil y descubre las tradiciones ancestrales de este pueblo maya.',
    description: 'Este tour te lleva a través de los lugares más significativos de Santiago Atitlán, incluyendo su impresionante iglesia colonial, el mercado local lleno de colores y las cofradías mayas donde se mantienen vivas las tradiciones ancestrales. Aprenderás sobre la historia, religión y costumbres del pueblo tz\'utujil de la mano de guías locales.',
    duration: '4 horas',
    difficulty: 'Fácil',
    price: {
      adult: 120,
      child: 80,
      privateGroup: 900
    },
    includes: [
      'Guía local bilingüe (español/inglés)',
      'Entrada al museo local',
      'Visita a taller de artesanías',
      'Degustación de comida típica',
      'Agua purificada'
    ],
    notIncludes: [
      'Compras personales',
      'Propinas',
      'Transporte al punto de encuentro'
    ],
    meetingPoint: 'Parque central de Santiago Atitlán',
    whatToBring: [
      'Zapatos cómodos para caminar',
      'Cámara fotográfica',
      'Dinero en efectivo para compras',
      'Bloqueador solar',
      'Sombrero o gorra'
    ],
    images: [
      '/images/tours/santiago-cultural-1.jpg',
      '/images/tours/santiago-cultural-2.jpg'
    ],
    highlights: [
      'Visita a la iglesia de Santiago Apóstol',
      'Recorrido por el mercado indígena',
      'Encuentro con artistas locales',
      'Demostración de tejido tradicional',
      'Historia viva de la cultura tz\'utujil'
    ],
    itinerary: [
      {
        time: '09:00 AM',
        title: 'Encuentro en el parque central',
        description: 'Presentación del guía y breve introducción a la cultura tz\'utujil.'
      },
      {
        time: '09:30 AM',
        title: 'Iglesia de Santiago Apóstol',
        description: 'Visita guiada a la iglesia colonial y su historia.'
      },
      {
        time: '10:30 AM',
        title: 'Mercado local',
        description: 'Recorrido por el colorido mercado indígena.'
      },
      {
        time: '11:30 AM',
        title: 'Taller de artesanías',
        description: 'Demostración de tejido tradicional.'
      },
      {
        time: '12:30 PM',
        title: 'Degustación de comida típica',
        description: 'Prueba de platillos tradicionales.'
      },
      {
        time: '01:00 PM',
        title: 'Fin del tour',
        description: 'Despedida y recomendaciones para el resto del día.'
      }
    ],
    faqs: [
      {
        question: '¿Es apropiado para niños?',
        answer: 'Sí, es un tour familiar adecuado para todas las edades.'
      },
      {
        question: '¿Hay opciones vegetarianas en la degustación?',
        answer: 'Sí, por favor infórmanos con anticipación sobre restricciones dietéticas.'
      }
    ],
    recommendations: [
      'Llegar 10 minutos antes de la hora programada',
      'Llevar efectivo en quetzales para compras',
      'Respetar las costumbres locales al tomar fotografías',
      'Usar ropa cómoda y apropiada para visitar lugares sagrados'
    ],
    capacity: {
      min: 2,
      max: 15
    },
    availableDays: ['Lunes', 'Miércoles', 'Viernes', 'Domingo'],
    startTimes: ['09:00 AM', '02:00 PM']
  },
  {
    id: 'tour-st-002',
    title: 'Taller de Tejido Tradicional Tz\'utujil',
    slug: 'taller-tejido-tzutujil',
    summary: 'Aprende las técnicas ancestrales de tejido en telar de cintura con artesanas locales.',
    description: 'En este taller íntimo, serás recibido por mujeres tz\'utujiles que te enseñarán los secretos del tejido en telar de cintura, una técnica que ha sido transmitida de generación en generación. Aprenderás sobre los significados de los colores y diseños tradicionales mientras creas tu propia pieza bajo la guía experta de las tejedoras.',
    duration: '3 horas',
    difficulty: 'Moderado',
    price: {
      adult: 150,
      privateGroup: 1000
    },
    includes: [
      'Materiales para el taller',
      'Instructora local experta',
      'Refrigerio tradicional',
      'Toma de tu creación',
      'Agua y bebidas locales'
    ],
    notIncludes: [
      'Transporte',
      'Propinas',
      'Compras adicionales'
    ],
    meetingPoint: 'Casa de las Tejedoras, Santiago Atitlán',
    whatToBring: [
      'Ropa cómoda',
      'Cámara (solo en áreas permitidas)',
      'Dinero para compras adicionales',
      'Una sonrisa y ganas de aprender'
    ],
    images: [
      '/images/tours/weaving-workshop-1.jpg',
      '/images/tours/weaving-workshop-2.jpg'
    ],
    highlights: [
      'Experiencia auténtica con artesanas locales',
      'Aprende sobre los símbolos y significados en los tejidos',
      'Apoya directamente a la comunidad de tejedoras',
      'Crea tu propia pieza para llevar a casa',
      'Inmersión cultural profunda'
    ],
    itinerary: [
      {
        time: '10:00 AM',
        title: 'Bienvenida e introducción',
        description: 'Presentación y contexto cultural.'
      },
      {
        time: '10:30 AM',
        title: 'Demostración de tejido',
        description: 'Las artesanas muestran sus técnicas.'
      },
      {
        time: '11:00 AM',
        title: 'Taller práctico',
        description: 'Aprende a tejer tu propia pieza.'
      },
      {
        time: '12:30 PM',
        title: 'Refrigerio tradicional',
        description: 'Descanso con alimentos locales.'
      },
      {
        time: '01:00 PM',
        title: 'Finalización del taller',
        description: 'Cierre y despedida.'
      }
    ],
    capacity: {
      min: 2,
      max: 6
    },
    availableDays: ['Martes', 'Jueves', 'Sábado'],
    startTimes: ['10:00 AM']
  }
];

export default tours;
