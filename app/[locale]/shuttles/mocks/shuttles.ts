import { ShuttleRoute } from '@/types/shuttle';

export const shuttles: ShuttleRoute[] = [
    {
        id: 'panajachel-antigua',
        origin: 'Panajachel (Atitlán)',
        destination: 'Antigua Guatemala',
        price: 150,
        schedule: ['05:00', '09:00', '12:00', '16:00'],
        duration: '3.5 horas',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1519451241324-20b628ec131e?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1494510619736-21827750ff88?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1433086395562-12f5a6b0c679?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1563897539633-7374c276c212?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=1000&auto=format&fit=crop',
        type: 'shared',
        description: 'Servicio exclusivo directo a la playa de El Paredón. Vagonetas con AC y paradas estratégicas para mayor comodidad durante el trayecto.'
    }
];
