begin;

delete from public.shuttle_routes
where id in (
  'panajachel-antigua',
  'panajachel-guatemala',
  'panajachel-paredon',
  'panajachel-lanquin',
  'panajachel-xela',
  'panajachel-rio-dulce',
  'san-marcos-antigua'
);

commit;
