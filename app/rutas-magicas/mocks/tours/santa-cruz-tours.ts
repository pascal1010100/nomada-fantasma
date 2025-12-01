import { Tour } from './types';

const santaCruzTours: Tour[] = [
    {
        id: 'santa-cruz-hike-san-marcos',
        title: 'Caminata Escénica: Santa Cruz a San Marcos',
        slug: 'caminata-santa-cruz-san-marcos',
        summary: 'Una caminata espectacular bordeando el lago, pasando por pueblos mayas y terminando con un chapuzón en la reserva natural.',
        description: 'Esta es considerada una de las caminatas más hermosas del Lago de Atitlán. Comenzaremos en Santa Cruz La Laguna, recorriendo antiguos senderos mayas que serpentean por los acantilados con vistas ininterrumpidas de los volcanes. Pasaremos por el pequeño pueblo de Jaibalito, disfrutaremos de un desayuno típico con vista al lago, y continuaremos hasta la Reserva Natural del Cerro Tzankujil en San Marcos, donde podrás saltar desde el trampolín de 7 metros o simplemente nadar en las aguas cristalinas.',
        duration: '4-5 horas',
        difficulty: 'Moderado',
        price: {
            adult: 250,
            child: 150,
            privateGroup: 1800
        },
        includes: [
            'Guía local experto',
            'Desayuno completo con café/té',
            'Entrada a la Reserva Natural Cerro Tzankujil',
            'Transporte en lancha de regreso (opcional)',
            'Agua purificada'
        ],
        meetingPoint: 'Muelle Principal de Santa Cruz',
        whatToBring: [
            'Zapatos cómodos para caminar (tenis o botas)',
            'Traje de baño y toalla',
            'Protector solar y gorra',
            'Cámara',
            '1 litro de agua extra'
        ],
        images: [
            '/images/tours/santa-cruz/hike-1.jpg',
            '/images/tours/santa-cruz/reserva-san-marcos.jpg'
        ],
        notIncludes: [
            'Propinas',
            'Bebidas alcohólicas',
            'Transporte al punto de encuentro'
        ],
        capacity: {
            min: 2,
            max: 10
        },
        availableDays: ['Lunes', 'Miércoles', 'Viernes', 'Domingo'],
        startTimes: ['8:00 AM'],
        highlights: [
            'Vistas panorámicas de los 3 volcanes',
            'Visita a la aldea aislada de Jaibalito',
            'Nado en aguas cristalinas',
            'Salto desde el trampolín (opcional)',
            'Desayuno con vista al lago'
        ],
        itinerary: [
            {
                time: '8:00 AM',
                title: 'Encuentro e Inicio',
                description: 'Reunión en el muelle y comienzo del ascenso suave hacia el sendero.'
            },
            {
                time: '9:30 AM',
                title: 'Parada en Jaibalito',
                description: 'Breve descanso y visita a este pueblo accesible solo por lancha o a pie.'
            },
            {
                time: '10:30 AM',
                title: 'Desayuno con Vista',
                description: 'Disfruta de un desayuno chapín en un restaurante local con terraza.'
            },
            {
                time: '12:00 PM',
                title: 'Llegada a San Marcos',
                description: 'Entrada a la Reserva Natural para nadar y relajarse.'
            },
            {
                time: '1:00 PM',
                title: 'Fin del Tour',
                description: 'Tiempo libre en San Marcos o regreso en lancha.'
            }
        ]
    },
    {
        id: 'santa-cruz-diving',
        title: 'Buceo de Altura en Agua Dulce',
        slug: 'buceo-santa-cruz',
        summary: 'Descubre el mundo subacuático del lago más bello del mundo. Una experiencia única de buceo en altitud.',
        description: 'Santa Cruz es el hogar de la única escuela de buceo profesional en el lago. Sumérgete en las aguas volcánicas de Atitlán y explora formaciones geológicas únicas, paredes volcánicas sumergidas y experimenta la sensación de bucear en un lago de cráter a 1,500 metros de altura. Ideal para principiantes (Discovery Dive) o buzos certificados.',
        duration: '3 horas',
        difficulty: 'Difícil',
        price: {
            adult: 650,
            privateGroup: 0 // No aplica grupo privado estándar
        },
        includes: [
            'Equipo completo de buceo (traje, tanque, etc.)',
            'Instructor certificado PADI',
            'Teoría y práctica en aguas confinadas',
            '1 inmersión en aguas abiertas',
            'Fotos subacuáticas'
        ],
        meetingPoint: 'Centro de Buceo Santa Cruz (cerca del muelle)',
        whatToBring: [
            'Traje de baño',
            'Toalla',
            'Ropa seca para después',
            'Certificación PADI (si ya eres buzo)'
        ],
        images: [
            '/images/tours/santa-cruz/diving-1.jpg',
            '/images/tours/santa-cruz/diving-2.jpg'
        ],
        notIncludes: [
            'Almuerzo',
            'Transporte al punto de encuentro'
        ],
        capacity: {
            min: 1,
            max: 4
        },
        availableDays: ['Todos los días'],
        startTimes: ['9:00 AM', '1:00 PM'],
        highlights: [
            'Buceo en un lago volcánico activo',
            'Formaciones de lava sumergidas',
            'Agua termal subacuática (en ciertos puntos)',
            'Experiencia de buceo de altura'
        ],
        itinerary: [
            {
                time: '9:00 AM',
                title: 'Clase Teórica',
                description: 'Instrucciones de seguridad y uso del equipo.'
            },
            {
                time: '10:00 AM',
                title: 'Práctica',
                description: 'Ejercicios básicos en agua poco profunda.'
            },
            {
                time: '11:00 AM',
                title: 'Inmersión',
                description: 'Exploración del mundo subacuático del lago.'
            }
        ]
    }
];

export default santaCruzTours;
