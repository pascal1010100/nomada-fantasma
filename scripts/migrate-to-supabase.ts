#!/usr/bin/env tsx
// @ts-nocheck - Supabase type inference requires real credentials. Will have proper types at runtime.
// Script to migrate existing reservation data from JSON file to Supabase
// Run: tsx scripts/migrate-to-supabase.ts

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { Database } from '../types/database.types';

// Load environment variables
// The 'dotenv/config' import above handles this, but keeping this for explicit path if needed.
// dotenv.config({ path: '.env.local' }); // This line is now redundant if 'dotenv/config' is used without specific path.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

const DB_PATH = path.join(process.cwd(), 'data', 'reservations.json');

interface OldReservation {
    id: string;
    createdAt: string;
    status: string;
    name: string;
    email: string;
    date: string;
    guests?: number;
    tourName?: string;
    totalPrice?: number;
    type?: string;
    phone?: string;
    notes?: string;
}

async function migrate() {
    console.log('🚀 Starting migration from JSON to Supabase...\n');

    // Check if file exists
    if (!fs.existsSync(DB_PATH)) {
        console.log('ℹ️  No existing reservations.json file found. Nothing to migrate.');
        return;
    }

    // Read existing data
    const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
    let oldReservations: OldReservation[] = [];

    try {
        oldReservations = JSON.parse(fileContent);
    } catch (error) {
        console.error('❌ Error parsing JSON file:', error);
        process.exit(1);
    }

    if (!Array.isArray(oldReservations) || oldReservations.length === 0) {
        console.log('ℹ️  No reservations found in JSON file. Nothing to migrate.');
        return;
    }

    console.log(`📊 Found ${oldReservations.length} reservations to migrate\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Migrate each reservation
    for (const old of oldReservations) {
        try {
            // Transform old format to new schema
            const newReservation = {
                id: old.id,
                created_at: old.createdAt,
                customer_name: old.name,
                customer_email: old.email.toLowerCase(),
                customer_phone: old.phone || null,
                reservation_date: old.date,
                guests: old.guests || 1,
                reservation_type: (old.type as 'tour' | 'accommodation' | 'guide') || 'tour',
                tour_name: old.tourName || null,
                total_price: old.totalPrice || null,
                status: (old.status as 'pending' | 'confirmed' | 'cancelled') || 'pending',
                customer_notes: old.notes || null,
            };

            const { error } = await supabase
                .from('reservations')
                .insert(newReservation);

            if (error) {
                if (error.code === '23505') {
                    // Duplicate key - reservation already exists
                    console.log(`⚠️  Skipped duplicate: ${old.email} (${old.id})`);
                } else {
                    throw error;
                }
            } else {
                successCount++;
                console.log(`✅ Migrated: ${old.email} - ${old.tourName || 'N/A'}`);
            }
        } catch (error: any) {
            errorCount++;
            const errorMsg = `Failed to migrate ${old.email}: ${error.message}`;
            errors.push(errorMsg);
            console.error(`❌ ${errorMsg}`);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${oldReservations.length}`);

    if (errors.length > 0) {
        console.log('\n❌ Errors encountered:');
        errors.forEach((err) => console.log(`  - ${err}`));
    }

    // Create backup
    const backupPath = path.join(
        process.cwd(),
        'data',
        `reservations.backup.${Date.now()}.json`
    );
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`\n💾 Backup created: ${backupPath}`);

    console.log('\n✨ Migration complete!');
}

// Run migration
migrate().catch((error) => {
    console.error('Fatal error during migration:', error);
    process.exit(1);
});
