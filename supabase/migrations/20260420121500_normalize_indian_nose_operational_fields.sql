update public.tours
set
  meeting_point = 'Recogida en tu hospedaje en San Pedro La Laguna',
  pickup_time = '3:40 AM',
  start_times = array[]::text[],
  available_days = case
    when available_days is null or cardinality(available_days) = 0 then array['Todos los días']
    else available_days
  end
where slug = 'amanecer-indian-nose-rostro-maya';
