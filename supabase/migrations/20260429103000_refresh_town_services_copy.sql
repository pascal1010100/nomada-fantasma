begin;

update public.towns
set services = jsonb_set(
  services,
  '{atms}',
  '["Cajeros limitados","Retirar efectivo antes en San Pedro o Panajachel","Llevar efectivo recomendado"]'::jsonb,
  true
)
where slug = 'san-marcos';

update public.towns
set services = jsonb_set(
  services,
  '{atms}',
  '["Cajeros limitados","Banrural o servicios locales según disponibilidad","Llevar efectivo recomendado"]'::jsonb,
  true
)
where slug = 'san-juan';

update public.towns
set services = jsonb_set(
  services,
  '{atms}',
  '["Banrural","Cajeros locales según disponibilidad","Llevar efectivo recomendado"]'::jsonb,
  true
)
where slug = 'santiago';

update public.towns
set services = jsonb_set(
  services,
  '{atms}',
  '["Banco Industrial","Banrural","BAC","Banco G&T","Mejor punto para retirar efectivo antes de pueblos pequeños"]'::jsonb,
  true
)
where slug = 'panajachel';

commit;
