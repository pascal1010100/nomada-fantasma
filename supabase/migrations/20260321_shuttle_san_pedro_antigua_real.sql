-- Update San Pedro -> Antigua shuttle with real schedule from catalog
INSERT INTO public.shuttle_routes (
    id,
    origin,
    destination,
    price,
    schedule,
    duration,
    image,
    type,
    description
)
VALUES (
    'san-pedro-antigua',
    'San Pedro La Laguna',
    'Antigua Guatemala',
    175,
    ARRAY[
        '5:00 AM → 8:30 AM',
        '7:00 AM → 10:30 AM',
        '9:30 AM → 1:00 PM',
        '2:30 PM → 6:00 PM'
    ],
    '3.5 horas',
    NULL,
    'shared',
    'Todos los días. Recogemos en hoteles; llegada frente al parque o en hoteles cercanos al parque en Antigua. Si hay tráfico, puede tardar 30 minutos más.'
)
ON CONFLICT (id) DO UPDATE
SET
    origin = EXCLUDED.origin,
    destination = EXCLUDED.destination,
    schedule = EXCLUDED.schedule,
    duration = EXCLUDED.duration,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    image = COALESCE(shuttle_routes.image, EXCLUDED.image),
    price = COALESCE(shuttle_routes.price, EXCLUDED.price);
