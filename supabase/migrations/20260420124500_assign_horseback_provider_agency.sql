insert into public.agencies (
  name,
  slug,
  contact_name,
  email,
  notes,
  is_active
)
values (
  'Free Riders Guild / Rancho Moises',
  'free-riders-rancho-moises',
  'Free Riders Guild / Rancho Moises',
  'josemanu08885@gmail.com',
  'Proveedor operativo temporal para la cabalgata panoramica en San Pedro. Por ahora se enruta al correo del admin hasta validar el correo final de la proveedora.',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  contact_name = excluded.contact_name,
  email = excluded.email,
  notes = excluded.notes,
  is_active = excluded.is_active;

update public.tours
set
  agency_id = (
    select id
    from public.agencies
    where slug = 'free-riders-rancho-moises'
    limit 1
  )
where slug = 'cabalgata-panoramica-san-pedro';
