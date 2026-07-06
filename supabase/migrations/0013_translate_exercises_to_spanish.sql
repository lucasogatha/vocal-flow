-- Traduz a Biblioteca de Exercícios para espanhol neutro (LATAM).
-- Atualiza as linhas EXISTENTES (por título antigo em português) em vez
-- de apagar e recriar, para não quebrar referências em homework_exercises
-- de homeworks já criados por professores/alunos reais.

-- 1) Remove as constraints antigas (valores em português) antes de
--    atualizar os dados.
alter table exercises drop constraint if exists exercises_category_check;
alter table exercises drop constraint if exists exercises_level_check;

-- 2) Atualiza cada exercício, casando pelo título antigo em português.

update exercises set
  title = $$Respiración Diafragmática Básica$$,
  category = 'Respiración',
  objective = $$Enseñar al alumno a dirigir el aire hacia el diafragma en vez del pecho, base de toda técnica vocal saludable.$$,
  description = $$Siéntate o ponte de pie con la columna alargada. Coloca una mano en el abdomen y otra en el pecho. Inspira por la nariz contando hasta 4, sintiendo el abdomen expandirse mientras el pecho permanece casi inmóvil. Exhala lentamente por la boca contando hasta 6, sintiendo el abdomen volver a la posición inicial. Repite manteniendo el ritmo constante y sin tensar los hombros.$$,
  level = 'Principiante',
  tags = array['respiración','diafragma','principiante','relajación']
where title = $$Respiração Diafragmática Básica$$;

update exercises set
  title = $$Respiración en 4 Tiempos (Box Breathing)$$,
  category = 'Respiración',
  objective = $$Desarrollar control y conciencia del ciclo respiratorio a través de conteos iguales.$$,
  description = $$Inspira contando 4 tiempos, sostén el aire por 4 tiempos, exhala en 4 tiempos y sostén los pulmones vacíos por 4 tiempos más antes de reiniciar el ciclo. Mantén los hombros relajados durante toda la secuencia. Este ejercicio también ayuda a reducir la ansiedad antes de presentaciones.$$,
  level = 'Principiante',
  tags = array['respiración','control','box-breathing','principiante']
where title = $$Respiração em 4 Tempos (Box Breathing)$$;

update exercises set
  title = $$Respiración Costal-Diafragmática con Resistencia$$,
  category = 'Respiración',
  objective = $$Fortalecer la musculatura respiratoria y prolongar la capacidad de sostener el aire durante el canto.$$,
  description = $$Inspira profundamente activando la respiración costal-diafragmática. Al exhalar, emite un sonido de "sss" continuo y uniforme, intentando sostenerlo por al menos 20 segundos sin que el sonido varíe en intensidad. Aumenta gradualmente el tiempo de sostenimiento a lo largo de la práctica, priorizando siempre la calidad y constancia del flujo de aire sobre la duración.$$,
  level = 'Intermedio',
  tags = array['respiración','resistencia','apoyo','intermedio']
where title = $$Respiração Costal-Diafragmática com Resistência$$;

update exercises set
  title = $$Vibración de Labios (Lip Trill) en Glissando$$,
  category = 'Calentamiento Vocal',
  objective = $$Calentar las cuerdas vocales con baja presión subglótica, liberando tensión en labios y mandíbula.$$,
  description = $$Vibra los labios como un motor de auto (lip trill) mientras dejas que la voz se deslice suavemente del grave al agudo y de vuelta al grave, en glissandos continuos. Mantén el flujo de aire constante y evita presionar los labios con fuerza excesiva. Repite explorando toda la extensión cómoda de la voz.$$,
  level = 'Principiante',
  tags = array['calentamiento','lip-trill','glissando','principiante']
where title = $$Vibração de Lábios (Lip Trill) em Glissando$$;

update exercises set
  title = $$Escala de 5 Notas en Staccato$$,
  category = 'Calentamiento Vocal',
  objective = $$Activar la musculatura vocal de forma leve y progresiva al inicio del calentamiento.$$,
  description = $$Canta una escala de 5 notas ascendente y descendente (do-re-mi-fa-sol-fa-mi-re-do) usando la sílaba "Ha" en staccato, con notas cortas y bien articuladas. Sube un semitono en cada repetición, avanzando según lo permita la comodidad vocal, sin forzar la región aguda.$$,
  level = 'Principiante',
  tags = array['calentamiento','escala','staccato','principiante']
where title = $$Escala de 5 Notas em Staccato$$;

update exercises set
  title = $$Sirena Vocal Completa$$,
  category = 'Calentamiento Vocal',
  objective = $$Conectar todos los registros vocales en un único movimiento continuo, preparando la voz para ejercicios más técnicos.$$,
  description = $$Partiendo de la nota más grave cómoda, desliza la voz suavemente hasta la nota más aguda posible y regresa, como una sirena, usando la vocal "U" o la consonante "V". Mantén el sonido continuo, sin quiebres perceptibles entre los registros. Ejecuta de 8 a 10 repeticiones, respirando profundamente entre ellas.$$,
  level = 'Intermedio',
  tags = array['calentamiento','sirena','registros','intermedio']
where title = $$Sirene Vocal Completa$$;

update exercises set
  title = $$Sostenimiento de Nota con Conteo$$,
  category = 'Apoyo Respiratorio',
  objective = $$Entrenar el sostenimiento de una nota única con apoyo constante del diafragma.$$,
  description = $$Elige una nota cómoda en la región media de la voz y sostenla en la vocal "A" por 10 segundos, contando mentalmente. Mantén la intensidad y la afinación estables de principio a fin, sin dejar que el volumen caiga. Aumenta la duración gradualmente conforme mejore la resistencia respiratoria.$$,
  level = 'Principiante',
  tags = array['apoyo','sostenimiento','respiración','principiante']
where title = $$Sustentação de Nota com Contagem$$;

update exercises set
  title = $$Messa di Voce (Crescendo-Decrescendo)$$,
  category = 'Apoyo Respiratorio',
  objective = $$Desarrollar control fino de la presión de aire para variar la dinámica sin perder la afinación o el apoyo.$$,
  description = $$Sostén una nota cómoda comenzando en volumen muy bajo (piano), crece gradualmente hasta el volumen máximo controlado (forte) y luego decrece de vuelta al piano, todo en una sola respiración. Mantén la afinación constante durante toda la variación dinámica. Este es un ejercicio clásico del repertorio clásico y pop para control de apoyo.$$,
  level = 'Intermedio',
  tags = array['apoyo','dinámica','messa-di-voce','intermedio']
where title = $$Messa di Voce (Crescendo-Decrescendo)$$;

update exercises set
  title = $$Staccato Rápido con Apoyo Abdominal$$,
  category = 'Apoyo Respiratorio',
  objective = $$Refinar la respuesta rápida del apoyo abdominal en pasajes rítmicos ágiles.$$,
  description = $$Canta una secuencia de notas cortas y repetidas en staccato rápido (por ejemplo, 8 repeticiones de la misma nota en ritmo de corchea) sintiendo un pequeño impulso del abdomen en cada nota, como pequeños "golpes" de aire controlados. Aumenta la velocidad progresivamente, manteniendo la precisión rítmica y evitando tensión en la garganta.$$,
  level = 'Avanzado',
  tags = array['apoyo','staccato','agilidad','avanzado']
where title = $$Staccato Rápido com Apoio Abdominal$$;

update exercises set
  title = $$Intervalos de Tercera Ascendentes y Descendentes$$,
  category = 'Afinación',
  objective = $$Desarrollar la percepción auditiva y la precisión para cantar intervalos pequeños con afinación exacta.$$,
  description = $$Con apoyo de un instrumento o app de afinación, canta intervalos de tercera (do-mi, re-fa, mi-sol...) subiendo y bajando por toda la extensión cómoda de la voz. Escucha atentamente la nota de referencia antes de cantar y confirma la afinación con el instrumento después de cada intervalo.$$,
  level = 'Principiante',
  tags = array['afinación','intervalos','oído','principiante']
where title = $$Intervalos de Terça Ascendentes e Descendentes$$;

update exercises set
  title = $$Escala Mayor Completa con Referencia de Piano$$,
  category = 'Afinación',
  objective = $$Consolidar la afinación en escalas mayores completas, identificando y corrigiendo desvíos de forma inmediata.$$,
  description = $$Canta la escala mayor completa (do-re-mi-fa-sol-la-si-do) ascendente y descendente acompañado de un piano o teclado, nota por nota. Detente de inmediato si percibes un desvío de afinación, identifica la nota problemática y repite el fragmento hasta corregirlo. Sube de tonalidad gradualmente.$$,
  level = 'Intermedio',
  tags = array['afinación','escala','piano','intermedio']
where title = $$Escala Maior Completa com Referência de Piano$$;

update exercises set
  title = $$Arpegios con Salto de Octava$$,
  category = 'Afinación',
  objective = $$Mejorar la precisión de afinación en saltos melódicos amplios, comunes en repertorio avanzado.$$,
  description = $$Canta arpegios mayores que incluyan un salto de octava (do-mi-sol-do agudo) y el camino inverso, garantizando que la nota del salto sea alcanzada con precisión inmediata, sin "resbalar" hasta la afinación correcta. Usa un teclado para verificar cada salto antes de avanzar a la siguiente tonalidad.$$,
  level = 'Avanzado',
  tags = array['afinación','arpegio','saltos','avanzado']
where title = $$Arpejos com Salto de Oitava$$;

update exercises set
  title = $$Notas Habladas en la Región de Pecho$$,
  category = 'Voz de Pecho',
  objective = $$Conectar el habla natural al canto en la región grave y media, identificando la sensación de la voz de pecho.$$,
  description = $$Habla frases cortas en tono de conversación normal y observa la vibración sentida en el pecho y la caja torácica. Luego, canta las mismas frases en la misma región de altura, manteniendo esa sensación de vibración torácica y la naturalidad del habla.$$,
  level = 'Principiante',
  tags = array['voz-de-pecho','registro','principiante','habla']
where title = $$Notas Faladas na Região de Peito$$;

update exercises set
  title = $$Escala Descendente en Voz de Pecho con "Ga"$$,
  category = 'Voz de Pecho',
  objective = $$Fortalecer la voz de pecho en la región media-grave, manteniendo claridad y potencia sin tensión excesiva.$$,
  description = $$Partiendo de una nota cómoda en la región media, canta una escala descendente de 5 notas usando la sílaba "Ga", manteniendo el sonido pleno y la sensación de vibración en el pecho hasta la nota más grave de la secuencia. Evita empujar el sonido con la garganta; la potencia debe venir del apoyo respiratorio.$$,
  level = 'Intermedio',
  tags = array['voz-de-pecho','escala','potencia','intermedio']
where title = $$Escala Descendente em Voz de Peito com "Ga"$$;

update exercises set
  title = $$Extensión de la Voz de Pecho con Vocales Abiertas$$,
  category = 'Voz de Pecho',
  objective = $$Ampliar con seguridad el límite superior cómodo de la voz de pecho, posponiendo el paso a la voz de cabeza.$$,
  description = $$Usando las vocales "A" y "E" (abiertas), canta escalas ascendentes intentando mantener la calidad de pecho el máximo posible antes de la región de pasaje, sin forzar ni gritar. Detén el ejercicio ante la primera señal de tensión en la garganta y retómalo al día siguiente con un semitono más. Este ejercicio requiere acompañamiento y retroalimentación constante del profesor.$$,
  level = 'Avanzado',
  tags = array['voz-de-pecho','extensión','avanzado','pasaje']
where title = $$Extensão da Voz de Peito com Vogais Abertas$$;

update exercises set
  title = $$Deslizamiento Suave hacia el Registro de Cabeza$$,
  category = 'Voz de Cabeza',
  objective = $$Familiarizar al alumno con la sensación ligera y "flotante" de la voz de cabeza.$$,
  description = $$Partiendo de una nota aguda cómoda, desliza suavemente hacia arriba usando la vocal "U", permitiendo que la voz "afine" naturalmente hacia un sonido más ligero y resonante en la cabeza. Evita cualquier esfuerzo en la garganta — la sensación debe ser de ligereza, casi como un silbido vocal.$$,
  level = 'Principiante',
  tags = array['voz-de-cabeza','ligereza','principiante','falsete']
where title = $$Deslizamento Suave para o Registro de Cabeça$$;

update exercises set
  title = $$Escalas en Falsete Controlado$$,
  category = 'Voz de Cabeza',
  objective = $$Desarrollar control y estabilidad en el registro de cabeza a través de escalas melódicas.$$,
  description = $$Canta escalas de 5 notas enteramente en la voz de cabeza/falsete, con la vocal "U" o "O", manteniendo volumen y timbre constantes en todas las notas. Presta atención especial para que la transición entre las notas sea suave, sin quiebres de aire ni variaciones abruptas de intensidad.$$,
  level = 'Intermedio',
  tags = array['voz-de-cabeza','falsete','control','intermedio']
where title = $$Escalas em Falsete Controlado$$;

update exercises set
  title = $$Pasaje Pecho-Cabeza en Vocal "U"$$,
  category = 'Voz de Cabeza',
  objective = $$Suavizar la transición entre voz de pecho y voz de cabeza, reduciendo el quiebre perceptible en la región de pasaje.$$,
  description = $$Canta un glissando lento subiendo de la voz de pecho hasta la voz de cabeza en la vocal "U", intentando minimizar cualquier quiebre o cambio abrupto de timbre en la transición. Grábate y escucha atentamente dónde ocurre el quiebre, repitiendo el fragmento específico del pasaje de forma aislada hasta suavizarlo.$$,
  level = 'Avanzado',
  tags = array['voz-de-cabeza','pasaje','avanzado','transición']
where title = $$Passagem Peito-Cabeça em Vogal "U"$$;

update exercises set
  title = $$Notas de Pasaje con "Nay"$$,
  category = 'Voz Mixta',
  objective = $$Explorar la zona de mezcla entre pecho y cabeza usando una sílaba que favorece el equilibrio entre los registros.$$,
  description = $$Canta la sílaba "Nay" (como en inglés "neigh", el sonido de un caballo) en notas cercanas a la región de pasaje de la voz, sintiendo que el sonido se apoya tanto en la resonancia nasal como en la potencia del pecho. Esta sílaba es ampliamente usada por profesores de canto justamente por facilitar el acceso a la voz mixta.$$,
  level = 'Intermedio',
  tags = array['voz-mixta','pasaje','nay','intermedio']
where title = $$Notas de Passagem com "Nay"$$;

update exercises set
  title = $$Sirena con Foco en la Zona de Mezcla$$,
  category = 'Voz Mixta',
  objective = $$Mantener la mezcla de registros estable al atravesar repetidamente la región de pasaje.$$,
  description = $$Ejecuta el ejercicio de sirena (deslizamiento continuo del grave al agudo) concentrando la atención específicamente en la región de pasaje, intentando mantener el mismo timbre "mixto" al atravesarla repetidamente, en vez de alternar bruscamente entre pecho puro y cabeza pura.$$,
  level = 'Intermedio',
  tags = array['voz-mixta','sirena','pasaje','intermedio']
where title = $$Sirene com Foco na Zona de Mixagem$$;

update exercises set
  title = $$Escala Completa en Voz Mixta$$,
  category = 'Voz Mixta',
  objective = $$Cantar una escala completa de una octava manteniendo la mezcla de registros de principio a fin, sin quiebres perceptibles.$$,
  description = $$Canta una escala mayor completa (una octava) del grave al agudo y de vuelta, manteniendo consistentemente la sensación de voz mixta — ni puramente de pecho, ni puramente de cabeza — en toda la extensión. Usa la vocal "E" cerrada o "I" para facilitar el equilibrio. Este ejercicio es exigente y debe interrumpirse ante la primera señal de fatiga vocal.$$,
  level = 'Avanzado',
  tags = array['voz-mixta','escala','avanzado','equilibrio']
where title = $$Escala Completa em Voz Mista$$;

update exercises set
  title = $$Escala Cromática Ascendente$$,
  category = 'Extensión Vocal',
  objective = $$Ampliar la extensión vocal de forma gradual y segura, trabajando semitono a semitono.$$,
  description = $$Canta una escala cromática (subiendo semitono a semitono) partiendo de una nota cómoda, usando la vocal "A". Avanza solo hasta donde la voz permanezca cómoda y sin esfuerzo perceptible, marcando mentalmente el punto de parada de cada sesión para acompañar la evolución de la extensión a lo largo de las semanas.$$,
  level = 'Intermedio',
  tags = array['extensión','cromática','gradual','intermedio']
where title = $$Escala Cromática Ascendente$$;

update exercises set
  title = $$Alargamiento de Extensión con Glissando Amplio$$,
  category = 'Extensión Vocal',
  objective = $$Alargar suavemente los límites de la extensión vocal sin forzar la voz.$$,
  description = $$Ejecuta glissandos amplios, del grave más cómodo al agudo más cómodo y viceversa, en la vocal "U", intentando ganar un poco más de amplitud en cada repetición — pero siempre respetando el límite de comodidad del día. La extensión vocal se expande con consistencia a lo largo del tiempo, no con fuerza en una sola sesión.$$,
  level = 'Intermedio',
  tags = array['extensión','glissando','alargamiento','intermedio']
where title = $$Alongamento de Extensão com Glissando Amplo$$;

update exercises set
  title = $$Exploración de Notas Límite (Agudos y Graves)$$,
  category = 'Extensión Vocal',
  objective = $$Mapear y expandir con seguridad los extremos actuales de la extensión vocal del alumno.$$,
  description = $$Con supervisión del profesor, explora cuidadosamente las notas más agudas y más graves que la voz consigue producir con calidad (sin forzar ni "quebrarse"), documentando los límites actuales. Repite periódicamente para acompañar la evolución. Interrumpe de inmediato ante cualquier incomodidad en la garganta.$$,
  level = 'Avanzado',
  tags = array['extensión','límites','avanzado','mapeo']
where title = $$Exploração de Notas-Limite (Agudos e Graves)$$;

update exercises set
  title = $$Zumbido Nasal (Humming)$$,
  category = 'Resonancia',
  objective = $$Localizar y activar la resonancia nasal y facial de forma simple y accesible.$$,
  description = $$Produce un zumbido (humming) con la boca cerrada, sintiendo la vibración en los labios, la nariz y la región de los huesos de la cara. Explora diferentes alturas, siempre buscando maximizar esa sensación de vibración facial, que indica buena resonancia.$$,
  level = 'Principiante',
  tags = array['resonancia','humming','principiante','cara']
where title = $$Zumbido Nasal (Humming)$$;

update exercises set
  title = $$Resonancia en "Ng" con Vibración Facial$$,
  category = 'Resonancia',
  objective = $$Profundizar la sensación de resonancia nasal usando el sonido "Ng" (como en inglés "sing") en frases melódicas.$$,
  description = $$Canta pequeñas melodías usando solo el sonido "Ng", manteniendo la vibración concentrada en la región nasal y en los huesos de la cara durante toda la frase melódica. Luego, transfiere esa misma sensación de vibración a una vocal abierta, como "A", cantando la misma melodía.$$,
  level = 'Intermedio',
  tags = array['resonancia','ng','vibración','intermedio']
where title = $$Ressonância em "Ng" com Vibração Facial$$;

update exercises set
  title = $$Proyección de Voz con Foco en la Máscara$$,
  category = 'Resonancia',
  objective = $$Aumentar la proyección vocal utilizando la resonancia de la "máscara" facial, sin depender de fuerza en la garganta.$$,
  description = $$Canta frases enteras dirigiendo mentalmente el sonido hacia la región de la "máscara" (nariz, mejillas y frente), buscando una sensación de proyección natural sin aumentar el esfuerzo en la garganta. Compara el volumen percibido antes y después de ajustar el foco de resonancia — la diferencia debe ser perceptible sin esfuerzo extra.$$,
  level = 'Avanzado',
  tags = array['resonancia','proyección','máscara','avanzado']
where title = $$Projeção de Voz com Foco no Masque$$;

update exercises set
  title = $$Trabalenguas Vocalizados$$,
  category = 'Dicción',
  objective = $$Mejorar la agilidad articulatoria de la lengua y los labios a través de trabalenguas cantados.$$,
  description = $$Elige un trabalenguas simple y corto y cántalo en una nota o escala corta, articulando cada consonante con claridad exagerada. Aumenta la velocidad gradualmente, sin sacrificar la claridad de la pronunciación.$$,
  level = 'Principiante',
  tags = array['dicción','trabalenguas','articulación','principiante']
where title = $$Trava-línguas Vocalizados$$;

update exercises set
  title = $$Consonantes Explosivas en Staccato$$,
  category = 'Dicción',
  objective = $$Fortalecer la precisión y la energía en la articulación de consonantes explosivas (P, T, K, B, D, G).$$,
  description = $$Canta secuencias cortas repitiendo consonantes explosivas aisladas (por ejemplo "Pa-Pa-Pa-Pa", "Ta-Ta-Ta-Ta", "Ka-Ka-Ka-Ka") en staccato rápido, en una sola nota. Siente el impulso de aire de cada consonante viniendo del apoyo abdominal, no solo de la boca.$$,
  level = 'Intermedio',
  tags = array['dicción','consonantes','staccato','intermedio']
where title = $$Consoantes Explosivas em Staccato$$;

update exercises set
  title = $$Texto Cantado con Articulación Exagerada$$,
  category = 'Dicción',
  objective = $$Aplicar la dicción trabajada en un contexto musical real, manteniendo claridad incluso en pasajes rápidos o agudos.$$,
  description = $$Elige un fragmento de una canción del repertorio del alumno y cántalo dos veces: primero exagerando a propósito cada consonante y vocal, luego normalmente — pero buscando mantener parte de esa claridad conquistada. Graba las dos versiones y compara la inteligibilidad del texto entre ellas.$$,
  level = 'Avanzado',
  tags = array['dicción','repertorio','articulación','avanzado']
where title = $$Texto Cantado com Articulação Exagerada$$;

-- 3) Recria as constraints, agora com os valores em espanhol.
alter table exercises add constraint exercises_category_check
  check (category in (
    'Respiración',
    'Calentamiento Vocal',
    'Apoyo Respiratorio',
    'Afinación',
    'Voz de Pecho',
    'Voz de Cabeza',
    'Voz Mixta',
    'Extensión Vocal',
    'Resonancia',
    'Dicción'
  ));

alter table exercises add constraint exercises_level_check
  check (level in ('Principiante', 'Intermedio', 'Avanzado'));
