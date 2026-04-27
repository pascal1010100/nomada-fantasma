update public.agencies
set
  email = 'urbancircusinternational@gmail.com',
  updated_at = now(),
  notes = 'Proveedor operativo para la cabalgata panoramica en San Pedro. Confirmaciones operativas enviadas al correo validado de la proveedora.'
where slug = 'free-riders-rancho-moises';
