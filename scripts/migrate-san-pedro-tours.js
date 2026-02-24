
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno del root
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('127.0.0.1')) {
    console.error('❌ Error: Las variables de entorno en .env.local no están configuradas correctamente.');
    console.error('Asegúrate de que NEXT_PUBLIC_SUPABASE_URL sea tu URL de producción (https://...)');
    console.error('y SUPABASE_SERVICE_ROLE_KEY sea tu clave secreta.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tours = [
    {
        title: 'Ascenso al Volcán San Pedro',
        slug: 'ascenso-volcan-san-pedro',
        pueblo_slug: 'san-pedro',
        description: 'Una caminata desafiante hasta la cima del volcán con vistas panorámicas del Lago de Atitlán.',
        full_description: 'Comienza tu aventura antes del amanecer para llegar a la cima justo a tiempo para ver el amanecer sobre el lago. Este tour te lleva a través de diferentes ecosistemas, desde bosques nubosos hasta paisajes volcánicos.',
        price: 150,
        child_price: 100,
        currency: 'GTQ',
        duration_text: '7 horas',
        pickup_time: '04:30:00',
        min_guests: 2,
        max_guests: 10,
        cover_image_url: '/images/tours/san-pedro/volcan-san-pedro-1.jpg',
        images: ['/images/tours/san-pedro/volcan-san-pedro-1.jpg'],
        highlights: [
            'Vistas panorámicas del Lago de Atitlán',
            'Avistamiento de aves endémicas',
            'Explicación de la flora y fauna local',
            'Fotos en la cima con los tres volcanes de fondo',
            'Experiencia de senderismo en un volcán activo'
        ],
        included: [
            'Guía local certificado',
            'Entrada al parque',
            'Refrigerio ligero',
            'Bastones de senderismo',
            'Botella de agua',
            'Botiquín de primeros auxilios'
        ],
        not_included: [
            'Transporte al punto de encuentro',
            'Propinas',
            'Almuerzo',
            'Seguro de viaje'
        ],
        is_active: true,
        is_featured: true,
        itinerary: [
            { time: "04:30 AM", title: "Encuentro", description: "Breve introducción y verificación de equipo." },
            { time: "05:00 AM", title: "Inicio", description: "Comienzo de la caminata." },
            { time: "07:30 AM", title: "Descanso", description: "Parada para reponer energías." },
            { time: "09:30 AM", title: "Cima", description: "Tiempo para fotos." }
        ]
    },
    {
        title: 'Tour de Café por Fincas Locales',
        slug: 'tour-cafe-san-pedro',
        pueblo_slug: 'san-pedro',
        description: 'Descubre el proceso del café desde la planta hasta tu taza en las montañas de San Pedro.',
        full_description: 'Visita fincas familiares donde aprenderás sobre el cultivo, cosecha y procesamiento del café. Incluye cata y degustación de diferentes variedades.',
        price: 80,
        child_price: 50,
        currency: 'GTQ',
        duration_text: '4 horas',
        pickup_time: '08:00:00',
        min_guests: 2,
        max_guests: 15,
        cover_image_url: '/images/tours/san-pedro/cafe-tour-1.jpg',
        images: ['/images/tours/san-pedro/cafe-tour-1.jpg'],
        highlights: [
            'Recorrido por plantaciones de café',
            'Proceso de tostado artesanal',
            'Cata guiada de diferentes variedades',
            'Apoyo a la economía local',
            'Vistas panorámicas del lago'
        ],
        included: [
            'Guía local',
            'Tour por la finca',
            'Demostración del proceso',
            'Degustación de diferentes tipos de café',
            'Agua purificada'
        ],
        not_included: [
            'Transporte',
            'Propinas',
            'Compras adicionales'
        ],
        is_active: true,
        is_featured: false,
        itinerary: [
            { time: "08:00 AM", title: "Encuentro", description: "Presentación del guía." },
            { time: "09:00 AM", title: "Recorrido", description: "Aprende sobre el cultivo." },
            { time: "11:30 AM", title: "Cata", description: "Prueba variedades." }
        ]
    }
];

async function migrate() {
    console.log('🚀 Iniciando migración de tours de San Pedro (Esquema Pro)...');

    for (const tour of tours) {
        console.log(`⌛ Migrando: ${tour.title}...`);
        const { error } = await supabase
            .from('tours')
            .upsert(tour, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error(`❌ Error al migrar "${tour.title}":`, error.message);
        } else {
            console.log(`✅ Éxito: "${tour.title}" migrado correctamente.`);
        }
    }

    console.log('🏁 Proceso finalizado.');
}

migrate();
