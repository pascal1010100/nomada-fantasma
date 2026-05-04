import { ShuttleRoute } from '@/types/shuttle';
import { getDestinationImage } from '../utils/destinationImages';

export const shuttles: ShuttleRoute[] = [
    {
        id: 'san-pedro-antigua',
        origin: 'San Pedro La Laguna',
        destination: 'Antigua Guatemala',
        price: 175,
        schedule: ['5:00 AM → 8:30 AM', '7:00 AM → 10:30 AM', '9:30 AM → 1:00 PM', '2:30 PM → 6:00 PM'],
        duration: '3.5 horas',
        image: getDestinationImage('Antigua Guatemala'),
        type: 'shared',
        description: 'Todos los días. Recogemos en hoteles; llegada frente al parque o en hoteles cercanos al parque en Antigua. Si hay tráfico, puede tardar 30 minutos más.'
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
