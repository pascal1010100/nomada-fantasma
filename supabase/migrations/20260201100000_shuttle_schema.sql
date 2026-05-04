-- Create shuttle_routes table
CREATE TABLE IF NOT EXISTS public.shuttle_routes (
    id TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    schedule TEXT[] NOT NULL,
    duration TEXT NOT NULL,
    image TEXT,
    type TEXT DEFAULT 'shared',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create shuttle_bookings table
CREATE TABLE IF NOT EXISTS public.shuttle_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    route_origin TEXT NOT NULL,
    route_destination TEXT NOT NULL,
    travel_date DATE NOT NULL,
    travel_time TEXT NOT NULL,
    passengers INTEGER NOT NULL DEFAULT 1,
    pickup_location TEXT NOT NULL,
    type TEXT DEFAULT 'shared',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.shuttle_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttle_bookings ENABLE ROW LEVEL SECURITY;

-- Policies for shuttle_routes (Public Read Only)
DROP POLICY IF EXISTS "Allow public read access for routes" ON public.shuttle_routes;
CREATE POLICY "Allow public read access for routes" 
ON public.shuttle_routes FOR SELECT 
USING (true);

-- Policies for shuttle_bookings (Insert Only for Public, Read for Admin)
DROP POLICY IF EXISTS "Allow public to insert bookings" ON public.shuttle_bookings;
CREATE POLICY "Allow public to insert bookings" 
ON public.shuttle_bookings FOR INSERT 
WITH CHECK (true);

-- Seed initial routes
INSERT INTO public.shuttle_routes (id, origin, destination, price, schedule, duration, image, type, description)
VALUES 
('panajachel-antigua', 'Panajachel (Atitlán)', 'Antigua Guatemala', 150.00, ARRAY['05:00', '09:00', '12:00', '16:00'], '3.5 horas', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop', 'shared', 'Servicio de transporte compartido en vagonetas modernas con aire acondicionado. Salidas diarias puntuales desde los principales muelles de Panajachel.'),
('panajachel-guatemala', 'Panajachel (Atitlán)', 'Ciudad de Guatemala / Aeropuerto', 225.00, ARRAY['05:00', '09:00', '12:00', '16:00'], '4-5 horas', 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=1000&auto=format&fit=crop', 'shared', 'Traslado directo al Aeropuerto Internacional La Aurora y zonas principales de la Ciudad de Guatemala. Vehículos amplios con espacio para equipaje.'),
('panajachel-paredon', 'Panajachel (Atitlán)', 'El Paredón (Playa)', 250.00, ARRAY['09:00', '13:00'], '4 horas', 'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1000&auto=format&fit=crop', 'shared', 'Conexión directa entre el Lago de Atitlán y el paraíso del surf en el Pacífico. Incluye paradas breves para snacks y estiramiento en la ruta.'),
('panajachel-lanquin', 'Panajachel (Atitlán)', 'Lanquín (Semuc Champey)', 450.00, ARRAY['08:00'], '10-12 horas', 'https://images.unsplash.com/photo-1519451241324-20b628ec131e?q=80&w=1000&auto=format&fit=crop', 'shared', 'Ruta turística hacia Semuc Champey. Viaje de día completo recorriendo los paisajes de la sierra guatemalteca en vagonetas confortables.'),
('panajachel-xela', 'Panajachel (Atitlán)', 'Quetzaltenango (Xela)', 225.00, ARRAY['08:00', '14:00'], '3 horas', 'https://images.unsplash.com/photo-1494510619736-21827750ff88?q=80&w=1000&auto=format&fit=crop', 'shared', 'Servicio rápido y seguro hacia la segunda ciudad de Guatemala. Ideal para estudiantes y viajeros explorando el altiplano.'),
('panajachel-rio-dulce', 'Panajachel (Atitlán)', 'Río Dulce / Livingston', 550.00, ARRAY['07:30'], '10-11 horas', 'https://images.unsplash.com/photo-1433086395562-12f5a6b0c679?q=80&w=1000&auto=format&fit=crop', 'shared', 'Traslado hacia la costa del Caribe. Una ruta escénica que te lleva desde las montañas hasta las puertas del Atlántico.'),
('san-pedro-antigua', 'San Pedro La Laguna', 'Antigua Guatemala', 175.00, ARRAY['08:30', '13:30', '17:00'], '4 horas', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop', 'shared', 'Salidas cómodas desde San Pedro La Laguna. Evita el viaje en lancha y viaja directo por carretera hacia la Ciudad Colonial.'),
('san-pedro-guatemala', 'San Pedro La Laguna', 'Ciudad de Guatemala / Aeropuerto', 250.00, ARRAY['08:30', '13:30'], '5 horas', 'https://images.unsplash.com/photo-1563897539633-7374c276c212?q=80&w=1000&auto=format&fit=crop', 'shared', 'Tu conexión más fácil con el aeropuerto desde San Pedro. Servicio puerta a puerta en vehículos de modelo reciente.'),
('san-marcos-antigua', 'San Marcos La Laguna', 'Antigua Guatemala', 175.00, ARRAY['08:00', '13:00'], '4 horas', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop', 'shared', 'Transporte directo desde San Marcos hacia Antigua. Cómodo, seguro y con conductores profesionales con experiencia en rutas de montaña.'),
('san-pedro-paredon', 'San Pedro La Laguna', 'El Paredón (Playa)', 250.00, ARRAY['14:00'], '4.5 horas', 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=1000&auto=format&fit=crop', 'shared', 'Servicio exclusivo directo a la playa de El Paredón. Vagonetas con AC y paradas estratégicas para mayor comodidad durante el trayecto.');
