import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface DuplicateResult {
  field: string;
  count: number;
  duplicates: any[];
}

async function checkDuplicates() {
  console.log('🔍 Iniciando verificación de duplicados...\n');

  try {
    // 1. Tours duplicados por slug
    console.log('📍 Verificando tours duplicados (por slug)...');
    const { data: tourDups, error: tourError } = await supabase.rpc(
      'get_duplicate_tours'
    );

    if (tourError) {
      // Fallback a query manual
      const { data: tours } = await supabase
        .from('tours')
        .select('id, slug, name_es');

      if (tours) {
        const slugGroups: { [key: string]: any[] } = {};
        tours.forEach((tour) => {
          if (!slugGroups[tour.slug]) {
            slugGroups[tour.slug] = [];
          }
          slugGroups[tour.slug].push(tour);
        });

        const tourDuplicates = Object.entries(slugGroups)
          .filter(([, group]) => group.length > 1)
          .map(([slug, group]) => ({
            slug,
            count: group.length,
            ids: group.map((t) => t.id),
          }));

        if (tourDuplicates.length > 0) {
          console.log(`❌ ${tourDuplicates.length} grupos de tours duplicados encontrados:`);
          tourDuplicates.forEach((dup) => {
            console.log(
              `   - Slug: "${dup.slug}" (${dup.count} tours) - IDs: ${dup.ids.join(', ')}`
            );
          });
        } else {
          console.log('✅ Sin duplicados en tours\n');
        }
      }
    } else {
      console.log('✅ Sin duplicados en tours\n');
    }

    // 2. Reservaciones duplicadas (mismo email + fecha + tour)
    console.log('📍 Verificando reservaciones duplicadas...');
    const { data: reservations } = await supabase
      .from('reservations')
      .select('id, email, date, tour_id, full_name')
      .not('tour_id', 'is', null);

    if (reservations && reservations.length > 0) {
      const resGroups: { [key: string]: any[] } = {};
      reservations.forEach((res) => {
        const key = `${res.email}-${res.date}-${res.tour_id}`;
        if (!resGroups[key]) {
          resGroups[key] = [];
        }
        resGroups[key].push(res);
      });

      const resDuplicates = Object.entries(resGroups)
        .filter(([, group]) => group.length > 1)
        .map(([key, group]) => ({
          key,
          count: group.length,
          ids: group.map((r) => r.id),
        }));

      if (resDuplicates.length > 0) {
        console.log(
          `❌ ${resDuplicates.length} grupos de reservaciones duplicadas encontradas:`
        );
        resDuplicates.forEach((dup) => {
          console.log(`   - ${dup.key} (${dup.count} reservas) - IDs: ${dup.ids.join(', ')}`);
        });
      } else {
        console.log('✅ Sin duplicados en reservaciones\n');
      }
    }

    // 3. Shuttle bookings duplicados
    console.log('📍 Verificando shuttle bookings duplicados...');
    const { data: shuttles } = await supabase
      .from('shuttle_bookings')
      .select('id, customer_email, travel_date, route_origin, route_destination');

    if (shuttles && shuttles.length > 0) {
      const shuttleGroups: { [key: string]: any[] } = {};
      shuttles.forEach((shuttle) => {
        const key = `${shuttle.customer_email}-${shuttle.travel_date}-${shuttle.route_origin}-${shuttle.route_destination}`;
        if (!shuttleGroups[key]) {
          shuttleGroups[key] = [];
        }
        shuttleGroups[key].push(shuttle);
      });

      const shuttleDuplicates = Object.entries(shuttleGroups)
        .filter(([, group]) => group.length > 1)
        .map(([key, group]) => ({
          key,
          count: group.length,
          ids: group.map((s) => s.id),
        }));

      if (shuttleDuplicates.length > 0) {
        console.log(
          `❌ ${shuttleDuplicates.length} grupos de shuttles duplicados encontrados:`
        );
        shuttleDuplicates.forEach((dup) => {
          console.log(
            `   - ${dup.key} (${dup.count} bookings) - IDs: ${dup.ids.join(', ')}`
          );
        });
      } else {
        console.log('✅ Sin duplicados en shuttle bookings\n');
      }
    }

    // 4. Alojamientos duplicados
    console.log('📍 Verificando alojamientos duplicados...');
    const { data: accommodations } = await supabase
      .from('accommodations')
      .select('id, slug, pueblo_slug, name');

    if (accommodations && accommodations.length > 0) {
      const accGroups: { [key: string]: any[] } = {};
      accommodations.forEach((acc) => {
        const key = `${acc.slug}-${acc.pueblo_slug}`;
        if (!accGroups[key]) {
          accGroups[key] = [];
        }
        accGroups[key].push(acc);
      });

      const accDuplicates = Object.entries(accGroups)
        .filter(([, group]) => group.length > 1)
        .map(([key, group]) => ({
          key,
          count: group.length,
          ids: group.map((a) => a.id),
        }));

      if (accDuplicates.length > 0) {
        console.log(
          `❌ ${accDuplicates.length} grupos de alojamientos duplicados encontrados:`
        );
        accDuplicates.forEach((dup) => {
          console.log(`   - ${dup.key} (${dup.count} alojamientos) - IDs: ${dup.ids.join(', ')}`);
        });
      } else {
        console.log('✅ Sin duplicados en alojamientos\n');
      }
    }

    console.log('✨ Verificación completada');
  } catch (error) {
    console.error('Error durante verificación:', error);
    process.exit(1);
  }
}

checkDuplicates();
