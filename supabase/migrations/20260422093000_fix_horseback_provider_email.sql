update public.agencies
set
  email = 'operaciones@nomadafantasma.com',
  updated_at = now(),
  notes = 'Proveedor operativo temporal para la cabalgata panoramica en San Pedro. Correo operativo centralizado.'
where slug = 'free-riders-rancho-moises';
