import { Tour } from './types';

// Función auxiliar para generar fechas disponibles (solo miércoles, viernes y domingos)
const generateAvailableDays = (daysAhead: number): string[] => {
  const result: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();
    
    // 0 = Domingo, 3 = Miércoles, 5 = Viernes
    if ([0, 3, 5].includes(dayOfWeek)) {
      result.push(date.toISOString().split('T')[0]);
    }
  }
  
  return result;
};

const tours: Tour[] = [
  {
    id: 'tour-sp-001',
    title: 'Ascenso al Volcán San Pedro',
    slug: 'ascenso-volcan-san-pedro',
    summary: 'Una caminata desafiante hasta la cima del volcán con vistas panorámicas del Lago de Atitlán.',
    description: 'Comienza tu aventura antes del amanecer para llegar a la cima justo a tiempo para ver el amanecer sobre el lago. Este tour te lleva a través de diferentes ecosistemas, desde bosques nubosos hasta paisajes volcánicos.',
    duration: '6-7 horas',
    difficulty: 'Difícil',
    price: {
      adult: 150,
      child: 100,
      privateGroup: 1200
    },
    includes: [
      'Guía local certificado',
      'Entrada al parque',
      'Refrigerio ligero',
      'Bastones de senderismo',
      'Botella de agua',
      'Botiquín de primeros auxilios'
    ],
    notIncludes: [
      'Transporte al punto de encuentro',
      'Propinas',
      'Almuerzo',
      'Seguro de viaje'
    ],
    meetingPoint: 'Oficina de turismo de San Pedro La Laguna',
    whatToBring: [
      'Zapatos para caminar',
      'Bloqueador solar',
      'Gorra o sombrero',
      'Suficiente agua (2L mínimo)',
      'Cámara fotográfica',
      'Chaqueta ligera',
      'Dinero extra para gastos personales'
    ],
    images: [
      '/images/tours/san-pedro/volcan-san-pedro-1.jpg',
      '/images/tours/san-pedro/volcan-san-pedro-2.jpg'
    ],
    highlights: [
      'Vistas panorámicas del Lago de Atitlán',
      'Avistamiento de aves endémicas',
      'Explicación de la flora y fauna local',
      'Fotos en la cima con los tres volcanes de fondo',
      'Experiencia de senderismo en un volcán activo'
    ],
    itinerary: [
      {
        time: '04:30 AM',
        title: 'Encuentro en el punto de partida',
        description: 'Breve introducción y verificación de equipo.'
      },
      {
        time: '05:00 AM',
        title: 'Inicio del ascenso',
        description: 'Comienzo de la caminata por el sendero principal.'
      },
      {
        time: '07:30 AM',
        title: 'Descanso y refrigerio',
        description: 'Parada para descansar y reponer energías.'
      },
      {
        time: '09:30 AM',
        title: 'Llegada a la cima',
        description: 'Tiempo para disfrutar de las vistas y tomar fotografías.'
      },
      {
        time: '10:30 AM',
        title: 'Descenso',
        description: 'Regreso por un sendero alternativo con diferentes vistas.'
      },
      {
        time: '12:30 PM',
        title: 'Fin del tour',
        description: 'Llegada al punto de partida y despedida.'
      }
    ],
    faqs: [
      {
        question: '¿Es necesario tener experiencia previa en senderismo?',
        answer: 'No es necesario ser un experto, pero se recomienda tener un nivel de condición física moderado.'
      },
      {
        question: '¿Qué pasa si llueve?',
        answer: 'El tour puede ser cancelado o reprogramado en caso de mal tiempo severo.'
      }
    ],
    recommendations: [
      'Hidratarse bien el día anterior',
      'Llevar ropa cómoda y en capas',
      'Usar protector solar antes de comenzar',
      'Llevar snacks energéticos'
    ],
    // Configuración de capacidad, días y horarios
    capacity: {
      min: 2,
      max: 10
    },
    availableDays: generateAvailableDays(60), // Próximos 60 días
    startTimes: ['04:30', '05:00'] // Horarios de inicio en formato 24h
  },
  {
    id: 'tour-sp-002',
    title: 'Tour de Café por Fincas Locales',
    slug: 'tour-cafe-san-pedro',
    summary: 'Descubre el proceso del café desde la planta hasta tu taza en las montañas de San Pedro.',
    description: 'Visita fincas familiares donde aprenderás sobre el cultivo, cosecha y procesamiento del café. Incluye cata y degustación de diferentes variedades.',
    duration: '4 horas',
    difficulty: 'Fácil',
    price: {
      adult: 80,
      child: 50,
      privateGroup: 600
    },
    includes: [
      'Guía local',
      'Tour por la finca',
      'Demostración del proceso',
      'Degustación de diferentes tipos de café',
      'Agua purificada'
    ],
    notIncludes: [
      'Transporte',
      'Propinas',
      'Compras adicionales'
    ],
    meetingPoint: 'Plaza central de San Pedro La Laguna',
    whatToBring: [
      'Zapatos cómodos',
      'Cámara',
      'Dinero para compras',
      'Sombrero o gorra'
    ],
    images: [
      '/images/tours/san-pedro/cafe-tour-1.jpg',
      '/images/tours/san-pedro/cafe-tour-2.jpg'
    ],
    highlights: [
      'Recorrido por plantaciones de café',
      'Proceso de tostado artesanal',
      'Cata guiada de diferentes variedades',
      'Apoyo a la economía local',
      'Vistas panorámicas del lago'
    ],
    itinerary: [
      {
        time: '08:00 AM',
        title: 'Encuentro en la plaza central',
        description: 'Presentación del guía y breve introducción.'
      },
      {
        time: '08:30 AM',
        title: 'Traslado a la finca',
        description: 'Caminata corta hasta la finca de café.'
      },
      {
        time: '09:00 AM',
        title: 'Recorrido por la plantación',
        description: 'Aprende sobre el cultivo del café.'
      },
      {
        time: '10:30 AM',
        title: 'Procesamiento del café',
        description: 'Demostración del secado y tostado.'
      },
      {
        time: '11:30 AM',
        title: 'Cata y degustación',
        description: 'Prueba diferentes variedades de café.'
      },
      {
        time: '12:00 PM',
        title: 'Fin del tour',
        description: 'Regreso al punto de encuentro.'
      }
    ],
    capacity: {
      min: 2,
      max: 15
    },
    availableDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    startTimes: ['08:00 AM', '01:00 PM']
  }
];

export default tours;
