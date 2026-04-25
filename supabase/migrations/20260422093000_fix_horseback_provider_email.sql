update public.agencies
set
  email = 'josemanu0885@gmail.com',
  updated_at = now(),
  notes = 'Proveedor operativo temporal para la cabalgata panoramica en San Pedro. Correo corregido al contacto operativo validado.'
where slug = 'free-riders-rancho-moises';
