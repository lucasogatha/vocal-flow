-- Traduz o conteúdo da tabela plans (nomes já eram universais, só as
-- features precisam de tradução). Atualiza por slug, preservando os
-- mesmos registros (não apaga/recria).

update plans set
  features = array[
    'Registro de alumnos',
    'Biblioteca de ejercicios',
    'Creación de Homeworks',
    'Portal del Alumno',
    'Seguimiento de progreso',
    'Dashboard del Profesor'
  ]
where slug = 'starter';

update plans set
  features = array[
    'Registro de alumnos',
    'Biblioteca de ejercicios',
    'Creación de Homeworks',
    'Portal del Alumno',
    'Seguimiento de progreso',
    'Dashboard del Profesor'
  ]
where slug = 'pro';
