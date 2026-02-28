#!/usr/bin/env tsx
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Force load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertTour() {
    console.log('🚀 Starting Indian Nose tour migration to Supabase...\n');

    // 1. Data gathered from es.json and our generated images
    const indianNoseTour = {
        title: 'Amanecer Indian Nose (Rostro Maya)',
        title_en: 'Indian Nose Sunrise (Mayan Face)',
        slug: 'amanecer-indian-nose-rostro-maya',
        description: 'La vista más espectacular del Lago de Atitlán al amanecer. Una caminata corta pero gratificante para ver el sol salir sobre los volcanes.',
        description_en: 'A short pre-dawn hike to watch the sun rise over Lake Atitlan.',
        full_description: 'Disfruta de una experiencia inolvidable ascendiendo al famoso "Rostro Maya" o Indian Nose. Desde la cima (2,200m), presenciarás cómo el sol ilumina el lago y los volcanes San Pedro, Tolimán y Atitlán. Incluye transporte desde tu hostal y un café caliente en la cima para disfrutar del espectáculo.',
        full_description_en: 'Climb the iconic Indian Nose viewpoint for a memorable sunrise over Lake Atitlan and the volcanoes of San Pedro, Toliman, and Atitlan. The tour includes early pickup, a local guide, park access, and a hot drink at the summit.',
        price_min: 150,
        price_max: 1000, // Private group price
        currency: 'GTQ',
        duration_hours: 4.0,
        difficulty: 'FÁCIL',
        category: 'adventure',
        min_guests: 2,
        max_guests: 20,
        pueblo_slug: 'san-pedro',
        cover_image: '/images/tours/san-pedro/indian-nose-sunrise.png',
        images: [
            '/images/tours/san-pedro/indian-nose-sunrise.png',
            '/images/tours/san-pedro/cafe-tour-1.jpg'
        ],
        highlights: [
            'Vistas panorámicas de todo el lago',
            'Amanecer sobre los volcanes',
            'Caminata de nivel fácil-moderado',
            'Fotografías espectaculares',
            'Guía local experto'
        ],
        included: [
            'Transporte ida y vuelta',
            'Guía local',
            'Entrada al parque',
            'Bebida caliente'
        ],
        not_included: [
            'Comidas no mencionadas',
            'Propinas',
            'Gastos personales'
        ],
        is_active: true,
        is_featured: true
    };

    // 2. Check if it already exists
    const { data: existing } = await supabase
        .from('tours')
        .select('id')
        .eq('slug', indianNoseTour.slug)
        .single();

    if (existing) {
        console.log(`⚠️ Tour with slug "${indianNoseTour.slug}" already exists. Updating...`);
        const { error } = await supabase
            .from('tours')
            .update(indianNoseTour)
            .eq('slug', indianNoseTour.slug);

        if (error) {
            console.error('❌ Error updating tour:', error);
        } else {
            console.log('✅ Tour updated successfully!');
        }
    } else {
        // 3. Insert new tour
        const { error } = await supabase
            .from('tours')
            .insert(indianNoseTour);

        if (error) {
            console.error('❌ Error inserting tour:', error);
        } else {
            console.log('✅ Tour inserted successfully!');
        }
    }

    console.log('\n✨ Migration complete!');
}

insertTour().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
