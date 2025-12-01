import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { sendConfirmationEmail } from '../../lib/email';

// Definir la ruta del archivo de "base de datos"
const DB_PATH = path.join(process.cwd(), 'data', 'reservations.json');

// Asegurarse de que el directorio y el archivo existan
const ensureDbExists = () => {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, '[]', 'utf-8');
    }
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validación básica
        if (!body.name || !body.email || !body.date) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios (nombre, email, fecha)' },
                { status: 400 }
            );
        }

        ensureDbExists();

        // Leer reservas existentes
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        let reservations = [];
        try {
            reservations = JSON.parse(fileContent);
        } catch (e) {
            reservations = [];
        }

        // Crear nueva reserva
        const newReservation = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            status: 'pending', // pending, confirmed, cancelled
            ...body
        };

        // Guardar
        reservations.push(newReservation);
        fs.writeFileSync(DB_PATH, JSON.stringify(reservations, null, 2), 'utf-8');

        // Enviar email de confirmación (sin bloquear la respuesta)
        await sendConfirmationEmail({
            to: newReservation.email,
            reservationId: newReservation.id,
            customerName: newReservation.name,
            tourName: newReservation.tourName || 'Tour Nómada Fantasma',
            date: newReservation.date,
            guests: newReservation.guests || 1,
            totalPrice: newReservation.totalPrice || 0,
            type: newReservation.type || 'tour'
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Reserva creada exitosamente',
                reservation: newReservation
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar la reserva' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Endpoint simple para ver reservas (solo dev)
    try {
        ensureDbExists();
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        const reservations = JSON.parse(fileContent);
        return NextResponse.json({ reservations });
    } catch (error) {
        return NextResponse.json({ reservations: [] });
    }
}
