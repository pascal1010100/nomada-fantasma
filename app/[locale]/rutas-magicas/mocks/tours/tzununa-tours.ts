import { Tour } from './types';

const tzununaTours: Tour[] = [
    {
        id: 'tzununa-waterfall-adventure',
        title: 'Data.tours.tzununa-waterfall-adventure.title',
        slug: 'aventura-cascada-tzununa',
        summary: 'Data.tours.tzununa-waterfall-adventure.summary',
        description: 'Data.tours.tzununa-waterfall-adventure.description',
        duration: 'Data.tours.tzununa-waterfall-adventure.duration',
        difficulty: 'Moderado',
        price: {
            adult: 200,
            child: 120,
            privateGroup: 1200
        },
        includes: [
            'Data.tours.tzununa-waterfall-adventure.includes.0',
            'Data.tours.tzununa-waterfall-adventure.includes.1',
            'Data.tours.tzununa-waterfall-adventure.includes.2'
        ],
        meetingPoint: 'Data.tours.tzununa-waterfall-adventure.meetingPoint',
        whatToBring: [
            'Data.tours.tzununa-waterfall-adventure.whatToBring.0',
            'Data.tours.tzununa-waterfall-adventure.whatToBring.1',
            'Data.tours.tzununa-waterfall-adventure.whatToBring.2'
        ],
        images: [
            '/images/tours/tzununa/waterfall-1.jpg',
            '/images/tours/tzununa/waterfall-2.jpg'
        ],
        notIncludes: [
            'Data.tours.tzununa-waterfall-adventure.notIncludes.0',
            'Data.tours.tzununa-waterfall-adventure.notIncludes.1'
        ],
        capacity: {
            min: 2,
            max: 12
        },
        availableDays: ['Todos los días'],
        startTimes: ['9:00 AM', '1:30 PM'],
        highlights: [
            'Data.tours.tzununa-waterfall-adventure.highlights.0',
            'Data.tours.tzununa-waterfall-adventure.highlights.1',
            'Data.tours.tzununa-waterfall-adventure.highlights.2'
        ],
        itinerary: [
            {
                time: '9:00 AM',
                title: 'Data.tours.tzununa-waterfall-adventure.itinerary.0.title',
                description: 'Data.tours.tzununa-waterfall-adventure.itinerary.0.description'
            },
            {
                time: '10:00 AM',
                title: 'Data.tours.tzununa-waterfall-adventure.itinerary.1.title',
                description: 'Data.tours.tzununa-waterfall-adventure.itinerary.1.description'
            },
            {
                time: '11:30 AM',
                title: 'Data.tours.tzununa-waterfall-adventure.itinerary.2.title',
                description: 'Data.tours.tzununa-waterfall-adventure.itinerary.2.description'
            }
        ]
    },
    {
        id: 'tzununa-permaculture-tour',
        title: 'Data.tours.tzununa-permaculture-tour.title',
        slug: 'tour-permacultura-tzununa',
        summary: 'Data.tours.tzununa-permaculture-tour.summary',
        description: 'Data.tours.tzununa-permaculture-tour.description',
        duration: 'Data.tours.tzununa-permaculture-tour.duration',
        difficulty: 'Fácil',
        price: {
            adult: 250,
            privateGroup: 1500
        },
        includes: [
            'Data.tours.tzununa-permaculture-tour.includes.0',
            'Data.tours.tzununa-permaculture-tour.includes.1',
            'Data.tours.tzununa-permaculture-tour.includes.2'
        ],
        meetingPoint: 'Data.tours.tzununa-permaculture-tour.meetingPoint',
        whatToBring: [
            'Data.tours.tzununa-permaculture-tour.whatToBring.0',
            'Data.tours.tzununa-permaculture-tour.whatToBring.1'
        ],
        images: [
            '/images/tours/tzununa/farm-1.jpg',
            '/images/tours/tzununa/farm-2.jpg'
        ],
        notIncludes: [
            'Data.tours.tzununa-permaculture-tour.notIncludes.0'
        ],
        capacity: {
            min: 1,
            max: 15
        },
        availableDays: ['Martes', 'Jueves', 'Sábado'],
        startTimes: ['10:00 AM'],
        highlights: [
            'Data.tours.tzununa-permaculture-tour.highlights.0',
            'Data.tours.tzununa-permaculture-tour.highlights.1',
            'Data.tours.tzununa-permaculture-tour.highlights.2'
        ],
        itinerary: [
            {
                time: '10:00 AM',
                title: 'Data.tours.tzununa-permaculture-tour.itinerary.0.title',
                description: 'Data.tours.tzununa-permaculture-tour.itinerary.0.description'
            },
            {
                time: '11:00 AM',
                title: 'Data.tours.tzununa-permaculture-tour.itinerary.1.title',
                description: 'Data.tours.tzununa-permaculture-tour.itinerary.1.description'
            },
            {
                time: '12:30 PM',
                title: 'Data.tours.tzununa-permaculture-tour.itinerary.2.title',
                description: 'Data.tours.tzununa-permaculture-tour.itinerary.2.description'
            }
        ]
    }
];

export default tzununaTours;
