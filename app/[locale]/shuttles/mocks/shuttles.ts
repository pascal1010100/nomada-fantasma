import { ShuttleRoute } from '@/types/shuttle';
import { getDestinationImage } from '../utils/destinationImages';

export const shuttles: ShuttleRoute[] = [
    {
        id: 'panajachel-antigua',
        origin: 'Panajachel (Atitlán)',
        destination: 'Antigua Guatemala',
        price: 150,
        schedule: ['05:00', '09:00', '12:00', '16:00'],
        duration: '3.5 horas',
        image: getDestinationImage('Antigua Guatemala'),
        type: 'shared',
        description: 'Servicio de transporte compartido en vagonetas modernas con aire acondicionado. Salidas diarias puntuales desde los principales muelles de Panajachel.'
    },
    {
        id: 'panajachel-guatemala',
        origin: 'Panajachel (Atitlán)',
        destination: 'Ciudad de Guatemala / Aeropuerto',
        price: 225,
        schedule: ['05:00', '09:00', '12:00', '16:00'],
        duration: '4-5 horas',
        image: getDestinationImage('Ciudad de Guatemala / Aeropuerto'),
        type: 'shared',
        description: 'Traslado directo al Aeropuerto Internacional La Aurora y zonas principales de la Ciudad de Guatemala. Vehículos amplios con espacio para equipaje.'
    },
    {
        id: 'panajachel-paredon',
        origin: 'Panajachel (Atitlán)',
        destination: 'El Paredón (Playa)',
        price: 250,
        schedule: ['09:00', '13:00'],
        duration: '4 horas',
        image: getDestinationImage('El Paredón (Playa)'),
        type: 'shared',
        description: 'Conexión directa entre el Lago de Atitlán y el paraíso del surf en el Pacífico. Incluye paradas breves para snacks y estiramiento en la ruta.'
    },
    {
        id: 'panajachel-lanquin',
        origin: 'Panajachel (Atitlán)',
        destination: 'Lanquín (Semuc Champey)',
        price: 450,
        schedule: ['08:00'],
        duration: '10-12 horas',
        image: getDestinationImage('Lanquín (Semuc Champey)'),
        type: 'shared',
        description: 'Ruta turística hacia Semuc Champey. Viaje de día completo recorriendo los paisajes de la sierra guatemalteca en vagonetas confortables.'
    },
    {
        id: 'panajachel-xela',
        origin: 'Panajachel (Atitlán)',
        destination: 'Quetzaltenango (Xela)',
        price: 225,
        schedule: ['08:00', '14:00'],
        duration: '3 horas',
        image: getDestinationImage('Quetzaltenango (Xela)'),
        type: 'shared',
        description: 'Servicio rápido y seguro hacia la segunda ciudad de Guatemala. Ideal para estudiantes y viajeros explorando el altiplano.'
    },
    {
        id: 'panajachel-rio-dulce',
        origin: 'Panajachel (Atitlán)',
        destination: 'Río Dulce / Livingston',
        price: 550,
        schedule: ['07:30'],
        duration: '10-11 horas',
        image: getDestinationImage('Río Dulce / Livingston'),
        type: 'shared',
        description: 'Traslado hacia la costa del Caribe. Una ruta escénica que te lleva desde las montañas hasta las puertas del Atlántico.'
    },
    {
        id: 'san-pedro-antigua',
        origin: 'San Pedro La Laguna',
        destination: 'Antigua Guatemala',
        price: 175,
        schedule: ['08:30', '13:30', '17:00'],
        duration: '4 horas',
        image: getDestinationImage('Antigua Guatemala'),
        type: 'shared',
        description: 'Salidas cómodas desde San Pedro La Laguna. Evita el viaje en lancha y viaja directo por carretera hacia la Ciudad Colonial.'
    },
    {
        id: 'san-pedro-guatemala',
        origin: 'San Pedro La Laguna',
        destination: 'Ciudad de Guatemala / Aeropuerto',
        price: 250,
        schedule: ['08:30', '13:30'],
        duration: '5 horas',
        image: getDestinationImage('Ciudad de Guatemala / Aeropuerto'),
        type: 'shared',
        description: 'Tu conexión más fácil con el aeropuerto desde San Pedro. Servicio puerta a puerta en vehículos de modelo reciente.'
    },
    {
        id: 'san-marcos-antigua',
        origin: 'San Marcos La Laguna',
        destination: 'Antigua Guatemala',
        price: 175,
        schedule: ['08:00', '13:00'],
        duration: '4 horas',
        image: getDestinationImage('Antigua Guatemala'),
        type: 'shared',
        description: 'Transporte directo desde San Marcos hacia Antigua. Cómodo, seguro y con conductores profesionales con experiencia en rutas de montaña.'
    },
    {
        id: 'san-pedro-paredon',
        origin: 'San Pedro La Laguna',
        destination: 'El Paredón (Playa)',
        price: 250,
        schedule: ['14:00'],
        duration: '4.5 horas',
        image: getDestinationImage('El Paredón (Playa)'),
        type: 'shared',
        description: 'Servicio exclusivo directo a la playa de El Paredón. Vagonetas con AC y paradas estratégicas para mayor comodidad durante el trayecto.'
    }
];
