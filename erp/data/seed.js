/* ============================================================================
   INGURA ERP · datos semilla
   ----------------------------------------------------------------------------
   Fuente de verdad de los catálogos fijos (líneas de servicio, estaciones del
   loop, calendario institucional, vigencias de cumplimiento) y de la cartera
   institucional.

   REGLA HEREDADA DEL REPOSITORIO (README §Notas de uso):
   los nombres de institución son reales; los datos de contacto, población y
   recogida selectiva se dejan VACÍOS a propósito. Se rellenan desde fuente
   oficial. No inventar datos.

   Lo único inventado de este fichero es el bloque `demo`, marcado como tal y
   borrable desde Ajustes → «Vaciar datos de demostración».
   ========================================================================== */

window.INGURA = window.INGURA || {};

INGURA.seed = {

  /* ---------------------------------------------------------------- empresa */
  empresa: {
    nombre: 'INGURA',
    descriptor_eu: 'Ingurumen estrategiak eta ekintzak',
    descriptor_es: 'Estrategia y acción medioambiental',
    claim_eu: 'Zure herritarrek ikusi, ukitu eta gogoratzen duten ingurumen-sentsibilizazioa',
    claim_es: 'Sensibilización ambiental que su ciudadanía ve, toca y recuerda',
    direccion: 'Palatueta bidea 25C, 48600 Sopela (Bizkaia)',
    cif: 'J098128850',
    desde: 2022,
    ambito: 'Comunidad Autónoma del País Vasco',
    contacto: { email: '', telefono: '', web: '' }   // pendiente — diagnóstico B1
  },

  /* ------------------------------------------------ las 6 estaciones del loop */
  estaciones: [
    { n: 1, id: 'radar',      es: 'Escucha',      eu: 'Entzun',       vista: 'radar',
      objetivo: 'Saber antes que nadie qué necesita cada institución y cuándo va a poder pagarlo.' },
    { n: 2, id: 'propuestas', es: 'Propuesta',    eu: 'Proposamena',  vista: 'propuestas',
      objetivo: 'Que preparar una propuesta cueste horas, no días.' },
    { n: 3, id: 'campanas',   es: 'Ejecución',    eu: 'Egikaritzea',  vista: 'campanas',
      objetivo: 'Que la calidad no dependa de quién dinamice.' },
    { n: 4, id: 'evidencia',  es: 'Evidencia',    eu: 'Frogak',       vista: 'evidencia',
      objetivo: 'Convertir una actividad en un dato defendible.' },
    { n: 5, id: 'devolucion', es: 'Devolución',   eu: 'Itzulketa',    vista: 'devolucion',
      objetivo: 'Entregar un documento que el técnico pueda reenviar sin tocar una coma.' },
    { n: 6, id: 'casos',      es: 'Prescripción', eu: 'Gomendioa',    vista: 'casos',
      objetivo: 'Que el resultado circule por donde se deciden los presupuestos del año siguiente.' }
  ],

  /* --------------------------------------------- los 4 activos que se acumulan */
  activos: [
    { id: 'A1', nombre: 'Datos',         unidad: 'campañas con evidencia nivel 3',
      donde: 'data/impacto/', efecto: 'Permite prometer cifras en la propuesta, no adjetivos.' },
    { id: 'A2', nombre: 'Casos',         unidad: 'casos publicados', objetivo: 4,
      donde: 'docs/casos/', efecto: 'Prueba social que el técnico enseña a su concejalía.' },
    { id: 'A3', nombre: 'Prescriptores', unidad: 'personas que recomiendan sin pedírselo',
      donde: 'Cartera · campo prescriptor', efecto: 'Entrada en municipios sin puerta. Coste ≈ 0.' },
    { id: 'A4', nombre: 'Encaje',        unidad: 'certificados de buena ejecución',
      donde: 'Devolución', efecto: 'Reduce de días a horas preparar una licitación.' }
  ],

  /* --------------------------------------------- los 3 indicadores maestros */
  maestros: [
    { id: 'repeticion', nombre: 'Tasa de repetición institucional', umbral: 60, sufijo: '%',
      def: '% de instituciones que contratan un segundo año o más' },
    { id: 'nofria',     nombre: 'Demanda no fría', umbral: 50, sufijo: '%',
      def: '% de oportunidades por prescripción, convocatoria o entrada espontánea' },
    { id: 'casos',      nombre: 'Casos publicables', umbral: 4, sufijo: '/año',
      def: 'Campañas con evidencia nivel 3+ y permiso de publicación' }
  ],

  /* ---------------------------------------------- los 4 niveles de evidencia */
  nivelesEvidencia: [
    { n: 1, nombre: 'Alcance',          mide: 'Cuánta gente',            captura: 'Conteo por franja horaria' },
    { n: 2, nombre: 'Perfil',           mide: 'Quién',                   captura: 'Muestreo: edad, barrio, idioma, repite' },
    { n: 3, nombre: 'Cambio declarado', mide: 'Qué dicen que cambiarán', captura: '3 preguntas antes / 3 después' },
    { n: 4, nombre: 'Cambio observado', mide: 'Qué cambió de verdad',    captura: 'Cruce con datos de recogida, 3-6 meses' }
  ],

  /* ---------------------------------------------------- metodología, 6 fases */
  metodologia: [
    { fase: 1, nombre: 'Toma de contacto',       salida: 'Equipo, objetivos y metodología' },
    { fase: 2, nombre: 'Preparación de contenidos', salida: 'Guiones, cuestionarios y materiales personalizados',
      loop: 'Pactar cláusula de acceso a datos de recogida (evidencia nivel 4)' },
    { fase: 3, nombre: 'Validación',             salida: 'Visto bueno de contenidos y materiales' },
    { fase: 4, nombre: 'Difusión y planificación', salida: 'Calendario cerrado' },
    { fase: 5, nombre: 'Desarrollo',             salida: 'Sesiones ejecutadas + hojas de sesión' },
    { fase: 6, nombre: 'Cierre y devolución',    salida: 'Informe final, valoraciones y aprendizajes',
      loop: 'Solicitar certificado de buena ejecución en la reunión de cierre' }
  ],

  /* ------------------------------------------------ catálogo · 7 líneas */
  lineas: [
    { id: 'linea-1', n: 1, nombre: 'Diseño de estrategias municipales de concienciación ambiental',
      resumen: 'Diseño integral: de la calle a los centros educativos',
      escalon: 4, desde: 11000, formato: 'Campaña completa (calle + centros educativos)',
      ods: [11, 12, 13, 17], marcos: ['Agenda 2030 Local', 'Udalsarea 2030'],
      vende: 'Municipios adheridos a Udalsarea 2030, año 1 o 2 de mandato.' },
    { id: 'linea-2', n: 2, nombre: 'Campañas de sensibilización sobre cambio climático',
      resumen: 'Módulo expositivo + charlas escolares',
      escalon: 3, desde: 6500, formato: 'Módulo + charlas escolares (≈ 1 semana)',
      ods: [4, 7, 13], marcos: ['Asteklima', 'Estrategia climática vasca'],
      vende: 'Cualquier institución que programe Asteklima. Mejor puerta de entrada media.' },
    { id: 'linea-3', n: 3, nombre: 'Talleres temáticos de residuos y economía circular',
      resumen: 'Aceite, papel, plástico, orgánico, textil, cocina, juegos',
      escalon: 1, desde: 450, formato: '1,5 h (desde 450 €) o 3 h (desde 800 €) · aforo 15-25, desde 8 años',
      ods: [11, 12], marcos: ['Semana Europea de Prevención de Residuos'],
      vende: 'Todo el mundo. Producto de entrada: que el primer taller nunca sea el último.' },
    { id: 'linea-4', n: 4, nombre: 'Programas educativos en centros escolares e institutos',
      resumen: 'Agenda Escolar 2030, eco-delegados/as',
      escalon: 2, desde: 1200, formato: 'Sesión de 90 min; programa de curso con acompañamiento',
      ods: [4, 12, 13], marcos: ['Agenda Escolar 2030', 'Ingurugela'],
      vende: 'Llegar a las familias a través de la escuela. El seguimiento es la clave del loop.' },
    { id: 'linea-5', n: 5, nombre: 'Sensibilización para comercio y hostelería',
      resumen: 'Visitas 1 a 1, distintivo y vídeo promocional',
      escalon: 4, desde: 11500, formato: 'Hasta 75 establecimientos por campaña, ampliable',
      ods: [8, 11, 12], marcos: [],
      vende: 'Municipios con comercio de proximidad y problemas de calidad del orgánico.',
      legal: 'INGURA actúa como encargada del tratamiento — contrato obligatorio.' },
    { id: 'linea-6', n: 6, nombre: 'Presencia en ferias, jornadas y eventos',
      resumen: 'Formato intensivo, varios talleres combinados',
      escalon: 2, desde: null, formato: 'Medio día o jornada completa',
      ods: [11, 12, 17], marcos: [],
      vende: 'El evento de mayor afluencia del municipio. La mejor fuente de fotografía del año.' },
    { id: 'linea-7', n: 7, nombre: 'Producción de materiales y comunicación',
      resumen: 'Cartelería, folletos, vídeo, señalética',
      escalon: 1, desde: null, formato: 'A medida',
      ods: [4, 12], marcos: [],
      vende: 'Instituciones que ya tienen la campaña diseñada. Eleva el importe de cualquier otra línea.' }
  ],

  /* ------------------------------------------------- catálogo · 7 talleres */
  talleres: [
    { id: 'aceite',   nombre: 'Gestión del aceite usado',  riesgo: 'alto',
      contenido: 'Aceite doméstico usado → jabón y velas ecológicas',
      riesgos: 'Sosa caústica: quemaduras químicas, salpicaduras, reacción exotérmica',
      medidas: 'Sosa manipulada solo por personal; EPIs; agua accesible; ficha de datos de seguridad en el montaje' },
    { id: 'papel',    nombre: 'Gestión del papel y cartón', riesgo: 'bajo',
      contenido: 'Papel reciclado artesanal, envases reutilizables, encuadernación',
      riesgos: 'Resbalones por agua; corte con herramientas de encuadernación',
      medidas: 'Suelo protegido y señalizado; herramientas romas para menores' },
    { id: 'plastico', nombre: 'Gestión de plásticos',       riesgo: 'alto', desde: 600, desde3h: 1000,
      contenido: 'Clasificación por tipología y transformación con extrusora-inyectora',
      riesgos: 'Quemaduras por material fundido; humos; atrapamiento en trituradora; ruido',
      medidas: 'Extracción localizada; barrera física; máquina solo por personal formado; guantes térmicos y gafas; extintor' },
    { id: 'organico', nombre: 'Materia orgánica y compostaje', riesgo: 'bajo',
      contenido: 'Compostaje paso a paso, con entrega de plantón o kokedama',
      riesgos: 'Higiene; contacto con material orgánico',
      medidas: 'Guantes; lavado de manos; material en buen estado' },
    { id: 'textil',   nombre: 'Reparación y transformación textil', riesgo: 'medio',
      contenido: 'Costura, remiendo y personalización para alargar vida útil',
      riesgos: 'Pinchazos y cortes con agujas, tijeras, máquina de coser',
      medidas: 'Herramientas adaptadas a la edad; supervisión permanente; botiquín' },
    { id: 'cocina',   nombre: 'Cocina de aprovechamiento «Zero Waste»', riesgo: 'medio',
      contenido: 'Recetas y técnicas para reducir el desperdicio alimentario',
      riesgos: 'Higiene alimentaria; cortes; alérgenos',
      medidas: 'Formación acreditada en manipulación; alérgenos visibles; cadena de frío' },
    { id: 'juegos',   nombre: 'Juegos con materiales reciclados', riesgo: 'bajo',
      contenido: 'Dominó, parchís, bolos, tres en raya con materiales reutilizados',
      riesgos: 'Cortes leves con herramientas',
      medidas: 'Herramientas adaptadas; supervisión' }
  ],

  /* ---------------------------------------- catálogo · reglas de combinación */
  combinaciones: [
    { lineas: ['linea-3'],                       nombre: 'Producto de entrada',                    min: 450,   max: 1000 },
    { lineas: ['linea-3', 'linea-7'],            nombre: 'Taller con materiales propios',          min: 1000,  max: 2500 },
    { lineas: ['linea-2', 'linea-4'],            nombre: 'Semana climática con recorrido escolar', min: 7000,  max: 10000 },
    { lineas: ['linea-2', 'linea-4', 'linea-7'], nombre: 'Asteklima completo con producción',      min: 9000,  max: 14000 },
    { lineas: ['linea-1'],                       nombre: 'Estrategia integral anual',              min: 11000, max: null },
    { lineas: ['linea-1', 'linea-5'],            nombre: 'Cobertura total del municipio',          min: 20000, max: null }
  ],

  /* ------------------------------------------------ escalera comercial (docs/09) */
  escalera: [
    { n: 1, nombre: 'Taller suelto',        rango: '450 – 1.000 €',    funcion: 'Puerta de entrada. Su valor no es el margen: es el acceso.' },
    { n: 2, nombre: 'Jornada escolar / evento', rango: '1.200 – 3.000 €', funcion: 'Margen medio. Prueba de capacidad.' },
    { n: 3, nombre: 'Semana temática',      rango: '6.500 – 14.000 €', funcion: 'Núcleo del negocio. Encaja en contrato menor.' },
    { n: 4, nombre: 'Estrategia integral / comercio', rango: '11.000 – 25.000 €', funcion: 'Alto valor. Requiere capacidad de licitar.' },
    { n: 5, nombre: 'Acuerdo anual o plurianual', rango: '25.000 € +',  funcion: 'Objetivo estratégico. Resuelve tesorería y estacionalidad.' }
  ],

  /* ----------------------------------- los 7 componentes del coste (docs/09 §2) */
  costeComponentes: [
    { id: 'dinamizacion',  nombre: 'Horas de dinamización',      naturaleza: 'Variable',        aviso: '' },
    { id: 'preparacion',   nombre: 'Horas de preparación',       naturaleza: 'Variable',        aviso: 'Infravalorado: en campaña nueva puede igualar la dinamización.' },
    { id: 'consumibles',   nombre: 'Materiales consumibles',     naturaleza: 'Variable',        aviso: '' },
    { id: 'grafica',       nombre: 'Producción gráfica',         naturaleza: 'Variable',        aviso: '' },
    { id: 'logistica',     nombre: 'Logística de módulo y maquinaria', naturaleza: 'Semifijo',  aviso: 'Infravalorado: crece con la distancia.' },
    { id: 'coordinacion',  nombre: 'Coordinación y gestión',     naturaleza: 'Fijo imputado',   aviso: 'En sector público es sustancial: reuniones, informes, justificación.' },
    { id: 'amortizacion',  nombre: 'Amortización de equipo',     naturaleza: 'Fijo imputado',   aviso: 'Si no se imputa, el equipo se deteriora sin fondo para reponerlo.' }
  ],

  /* --------------------------------------- objetivos de salud económica (docs/09 §7) */
  saludEconomica: [
    { id: 'concentracion', nombre: 'Concentración: % del mayor cliente', umbral: 25, dir: 'menor', sufijo: '%' },
    { id: 'recurrente',    nombre: '% de ingresos recurrentes',          umbral: 30, dir: 'mayor', sufijo: '%' },
    { id: 'adjudicacion',  nombre: 'Ratio propuesta → adjudicación',     umbral: 40, dir: 'mayor', sufijo: '%' },
    { id: 'cobro',         nombre: 'Días medios de cobro',               umbral: 60, dir: 'menor', sufijo: ' d' },
    { id: 'estacional',    nombre: 'Trimestre pico / trimestre valle',   umbral: 2.5, dir: 'menor', sufijo: '×' },
    { id: 'nivel3',        nombre: '% de campañas con evidencia nivel 3', umbral: 100, dir: 'mayor', sufijo: '%' }
  ],

  /* -------------------------------------- calendario institucional (loop largo) */
  calendario: [
    { mes: 9,  nombre: 'Septiembre', estacion: '③', carga: 3, que: 'Arranque de curso escolar. Programas educativos en marcha.' },
    { mes: 10, nombre: 'Octubre',    estacion: '③', carga: 4, que: 'Ejecución sostenida. Preparación del pico.' },
    { mes: 11, nombre: 'Noviembre',  estacion: '③', carga: 6, que: 'Asteklima y Semana Europea de Prevención de Residuos. Pico del año.' },
    { mes: 12, nombre: 'Diciembre',  estacion: '④⑤', carga: 3, que: 'Cierre de campañas de otoño, informes, certificados.' },
    { mes: 1,  nombre: 'Enero',      estacion: '①②', carga: 1, critico: true, que: 'VENTANA CRÍTICA. Presupuestos aprobados, convocatorias publicadas.' },
    { mes: 2,  nombre: 'Febrero',    estacion: '①②', carga: 1, critico: true, que: 'VENTANA CRÍTICA. Aquí se decide el año.' },
    { mes: 3,  nombre: 'Marzo',      estacion: '②③', carga: 3, que: 'Adjudicaciones y arranque de primavera.' },
    { mes: 4,  nombre: 'Abril',      estacion: '②③', carga: 4, que: 'Campañas de primavera. Comercio y hostelería.' },
    { mes: 5,  nombre: 'Mayo',       estacion: '②③', carga: 4, que: 'Primavera. Cerrar programación escolar del curso siguiente.' },
    { mes: 6,  nombre: 'Junio',      estacion: '③④', carga: 4, que: 'Cierre de curso, fiestas patronales, ferias.' },
    { mes: 7,  nombre: 'Julio',      estacion: '⑤⑥', carga: 2, que: 'Informes de curso, casos, memoria anual de impacto.' },
    { mes: 8,  nombre: 'Agosto',     estacion: '⑥',  carga: 1, que: 'Producción de materiales, revisión de catálogo, mantenimiento.' }
  ],

  /* ------------------------------------------- cadencias (rutinas con salida) */
  cadencias: [
    { id: 'sesion',    nombre: 'Por sesión',  cuando: 'Durante la ejecución', duracion: '15 + 10 + 10 min',
      salida: 'Parte de montaje · hoja de sesión · volcado a data/impacto/' },
    { id: 'semanal',   nombre: 'Astelehena',  cuando: 'Lunes', duracion: '45 min',
      salida: 'Radar · pipeline · ejecución · deuda de loop con fecha límite' },
    { id: 'mensual',   nombre: 'Cierre de mes', cuando: 'Fin de mes', duracion: '2 h',
      salida: 'Tablero · activos · un caso · una pieza de contenido · reactivaciones · cobros' },
    { id: 'trimestral',nombre: 'Loop medio',  cuando: 'Trimestral', duracion: 'Media jornada',
      salida: 'Cartera · oferta · precios y márgenes · capacidad · licitaciones · vigencias' },
    { id: 'anual',     nombre: 'Loop largo',  cuando: 'Julio', duracion: '2 jornadas',
      salida: 'Memoria de impacto · revisión de posición · catálogo · plan de cartera · inversión' }
  ],

  /* ------------------------------- disparadores de recordatorio automático */
  recordatorios: [
    { id: 'cert',    dias: 7,   base: 'cierre', titulo: 'Solicitar certificado de buena ejecución',
      detalle: 'Si no se pidió en la reunión de cierre. Pedirlo seis meses después es perderlo.', gravedad: 'alta' },
    { id: 'caso',    dias: 14,  base: 'cierre', titulo: 'Redactar el caso y pedir permiso de publicación',
      detalle: 'Activo A2. Sin caso, la estación ⑥ no existe.', gravedad: 'media' },
    { id: 'nivel4',  dias: 90,  base: 'cierre', titulo: 'Solicitar datos de recogida (evidencia nivel 4)',
      detalle: 'A la mancomunidad, según la cláusula pactada en fase 2.', gravedad: 'media' },
    { id: 'react',   dias: 300, base: 'cierre', titulo: 'Contacto de reactivación',
      detalle: '10 meses: antes de que se cierre la ventana de presupuesto.', gravedad: 'alta' }
  ],

  /* ---------------------------- alertas de calendario fijo (independientes) */
  alertasFijas: [
    { mes: 12, dia: 1, titulo: 'Arranca la ventana de presupuesto',
      detalle: 'Proteger enero y febrero para la estación ②. No llenarlos de ejecución.' },
    { mes: 9,  dia: 1, titulo: 'Cerrar programación de Asteklima y Semana de Prevención',
      detalle: 'El pico de noviembre se vende en septiembre.' },
    { mes: 5,  dia: 1, titulo: 'Cerrar programación escolar del curso siguiente',
      detalle: 'Con los centros, antes del cierre de curso.' }
  ],

  /* ---------------------------------- cumplimiento · semáforo de vigencias */
  cumplimiento: [
    { id: 'rcds',      nombre: 'Certificación negativa del Registro Central de Delincuentes Sexuales',
      alcance: 'Toda persona con contacto con menores, incluidos colaboradores puntuales', vence: '', bloqueante: true },
    { id: 'protocolo', nombre: 'Protocolo de actuación con menores',
      alcance: 'Firmado por cada dinamizador/a', vence: '', bloqueante: true },
    { id: 'rc',        nombre: 'Póliza de RC con cobertura explícita de actividades con menores',
      alcance: 'Explícita en la póliza, no presunta', vence: '', bloqueante: true },
    { id: 'riesgos',   nombre: 'Evaluación de riesgos por taller',
      alcance: 'Los 7 talleres. Prioridad: plásticos y aceite', vence: '', bloqueante: true },
    { id: 'digital',   nombre: 'Certificado digital de representante',
      alcance: 'Licitación electrónica y registro de facturas', vence: '', bloqueante: false },
    { id: 'rolece',    nombre: 'Inscripción en registro de licitadores',
      alcance: 'ROLECE / Registro Oficial de Licitadores de Euskadi', vence: '', bloqueante: false },
    { id: 'corriente', nombre: 'Certificados de estar al corriente (Hacienda, Seguridad Social)',
      alcance: 'Renovación periódica', vence: '', bloqueante: false },
    { id: 'rat',       nombre: 'Registro de actividades de tratamiento (RGPD)',
      alcance: 'Encuestas, imágenes, datos de comercios', vence: '', bloqueante: false },
    { id: 'encargo',   nombre: 'Contrato de encargo de tratamiento (línea 5)',
      alcance: 'Anexo obligatorio en toda campaña de comercio y hostelería', vence: '', bloqueante: false }
  ],

  /* --------------------------------- checklist de campaña (docs/08 §7) */
  checklist: {
    antes: [
      'Contrato o encargo firmado, con cláusula de acceso a datos de impacto (nivel 4)',
      'Anexo de encargo de tratamiento firmado, si aplica',
      'Certificaciones de menores vigentes de todo el equipo asignado',
      'Evaluación de riesgos revisada para los talleres concretos',
      'Materiales bilingües validados por la institución (fase 3)',
      'Permisos de ocupación de vía pública y suministro eléctrico',
      'Calendario cerrado con centros, comercios o colectivos',
      'Difusión lanzada por los canales municipales',
      'Logística de módulo y maquinaria confirmada',
      'Hojas de sesión, tarjetas de encuesta y consentimientos en el vehículo'
    ],
    durante: [
      'Hoja de sesión rellenada en cada sesión, no al final de la semana',
      'Registro de idioma de atención',
      'Fotografías con consentimiento recogido en el momento',
      'Incidencias anotadas el mismo día',
      'Parte de montaje/desmontaje firmado'
    ],
    despues: [
      'Datos volcados a data/impacto/',
      'Informe final entregado en euskera y castellano',
      'Reunión de cierre presencial celebrada',
      'Certificado de buena ejecución solicitado en esa reunión',
      'Página de recomendaciones para el año siguiente entregada',
      'Permiso de publicación del caso solicitado',
      'Facturación emitida y registrada en el sistema de la administración',
      'Solicitud de datos de nivel 4 agendada (3–6 meses)',
      'Contacto de reactivación agendado (10 meses)',
      'Maquinaria revisada y kit repuesto'
    ]
  },

  /* --------------------------------- diagnóstico de fallo (tablero §8) */
  diagnostico: [
    { sintoma: 'No entran oportunidades', estacion: '① Escucha',
      revisar: '¿Está el radar activo? ¿La cartera actualizada? ¿Se ha prospectado en el mes equivocado?', vista: 'radar' },
    { sintoma: 'Entran oportunidades pero no se convierten', estacion: '② Propuesta',
      revisar: '¿Falta la capa justificativa? ¿Se propone al cliente equivocado? ¿El precio está mal explicado?', vista: 'propuestas' },
    { sintoma: 'Se gana pero el cliente no queda satisfecho', estacion: '③ Ejecución',
      revisar: '¿Falta kit cerrado? ¿Exceso de improvisación? ¿Capacidad sobrepasada?', vista: 'campanas' },
    { sintoma: 'Cliente satisfecho pero no repite', estacion: '④⑤ Evidencia y Devolución',
      revisar: 'La causa más frecuente. No se le dio nada con lo que justificarse ni motivo para volver.', vista: 'devolucion' },
    { sintoma: 'Repite pero no llegan clientes nuevos', estacion: '⑥ Prescripción',
      revisar: 'No se publican casos ni se pide recomendación. El loop gira pero no se amplía.', vista: 'casos' },
    { sintoma: 'Crece la facturación y no los activos', estacion: 'Todo el loop',
      revisar: 'Se está vendiendo, no construyendo.', vista: 'panel' }
  ],

  /* ------------------------------- palancas de margen (docs/09 §3) */
  palancas: [
    { nombre: 'Reutilización de contenidos', efecto: 'La más potente. Un guion usado en diez municipios transforma el margen.' },
    { nombre: 'Densidad geográfica',         efecto: 'Tres municipios de la misma comarca en la misma semana comparten desplazamiento.' },
    { nombre: 'Venta a mancomunidad',        efecto: 'Un contrato, varios municipios, una sola coordinación.' },
    { nombre: 'Combinación de líneas',       efecto: 'Sube el ticket sin multiplicar la coordinación, que es el coste fijo.' },
    { nombre: 'Talleres en paralelo',        efecto: 'Dos o tres dinamizadores sobre una logística ya pagada.' },
    { nombre: 'Producción propia (línea 7)', efecto: 'Capta margen que hoy se va a imprenta y productora externa.' },
    { nombre: 'Precio por valor, no por hora', efecto: 'Una campaña justificable ante intervención vale más que una que no lo es.' }
  ],

  /* =========================================================================
     CARTERA INSTITUCIONAL — fichero semilla
     Nombres reales. Contacto, población y datos de recogida VACÍOS a propósito.
     estado: sin-contacto | contactado | propuesta-enviada | cliente |
             cliente-recurrente | dormido | perdido
     ======================================================================= */
  instituciones: [
    { nombre: 'Sopela', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', mancomunidad: 'Uribe Kosta', prioridad: 1, notas: 'Sede de INGURA. Municipio de casa: prioridad absoluta como primer caso documentado.' },
    { nombre: 'Berango', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', mancomunidad: 'Uribe Kosta', prioridad: 1 },
    { nombre: 'Urduliz', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', mancomunidad: 'Uribe Kosta', prioridad: 1 },
    { nombre: 'Barrika', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', mancomunidad: 'Uribe Kosta', prioridad: 3, notas: 'Pequeño: abordar vía mancomunidad' },
    { nombre: 'Gorliz', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', mancomunidad: 'Uribe Kosta', prioridad: 2 },
    { nombre: 'Plentzia', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', mancomunidad: 'Uribe Kosta', prioridad: 2 },
    { nombre: 'Lemoiz', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', mancomunidad: 'Uribe Kosta', prioridad: 3, notas: 'Pequeño: abordar vía mancomunidad' },
    { nombre: 'Mancomunidad de Uribe Kosta', tipo: 'mancomunidad', territorio: 'Bizkaia', comarca: 'Uribe Kosta', prioridad: 1, notas: 'MULTIPLICADOR PRIORITARIO: un contrato, 7 municipios. Tiene los datos de recogida.' },
    { nombre: 'Getxo', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', prioridad: 1, notas: 'Presupuesto alto. Requiere capacidad de licitar (E2).' },
    { nombre: 'Leioa', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', prioridad: 1 },
    { nombre: 'Erandio', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Uribe Kosta', prioridad: 2 },
    { nombre: 'Mungia', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Mungialdea', mancomunidad: 'Mungialdea', prioridad: 1 },
    { nombre: 'Bakio', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Mungialdea', mancomunidad: 'Mungialdea', prioridad: 2 },
    { nombre: 'Gatika', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Mungialdea', mancomunidad: 'Mungialdea', prioridad: 3 },
    { nombre: 'Maruri-Jatabe', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Mungialdea', mancomunidad: 'Mungialdea', prioridad: 4 },
    { nombre: 'Bermeo', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Busturialdea', mancomunidad: 'Busturialdea', prioridad: 1 },
    { nombre: 'Gernika-Lumo', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Busturialdea', mancomunidad: 'Busturialdea', prioridad: 1 },
    { nombre: 'Mundaka', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Busturialdea', mancomunidad: 'Busturialdea', prioridad: 3 },
    { nombre: 'Sukarrieta', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Busturialdea', mancomunidad: 'Busturialdea', prioridad: 3, notas: 'Sede de equipamiento de educación ambiental: interlocutor de alto valor pedagógico' },
    { nombre: 'Durango', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Durangaldea', mancomunidad: 'Durangaldea', prioridad: 1 },
    { nombre: 'Amorebieta-Etxano', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Durangaldea', mancomunidad: 'Durangaldea', prioridad: 1 },
    { nombre: 'Iurreta', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Durangaldea', mancomunidad: 'Durangaldea', prioridad: 2 },
    { nombre: 'Abadiño', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Durangaldea', mancomunidad: 'Durangaldea', prioridad: 2 },
    { nombre: 'Galdakao', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Txorierri-Nerbioi', prioridad: 1 },
    { nombre: 'Basauri', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Nerbioi', prioridad: 1 },
    { nombre: 'Derio', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Txorierri', mancomunidad: 'Txorierri', prioridad: 2 },
    { nombre: 'Zamudio', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Txorierri', mancomunidad: 'Txorierri', prioridad: 2 },
    { nombre: 'Loiu', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Txorierri', mancomunidad: 'Txorierri', prioridad: 3 },
    { nombre: 'Portugalete', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Ezkerraldea', prioridad: 1 },
    { nombre: 'Santurtzi', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Ezkerraldea', prioridad: 1 },
    { nombre: 'Sestao', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Ezkerraldea', prioridad: 2 },
    { nombre: 'Barakaldo', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Ezkerraldea', prioridad: 2, notas: 'Grande: licitación compleja' },
    { nombre: 'Bilbao', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Bilbao', prioridad: 3, notas: 'Máximo presupuesto y máxima competencia. Entrar cuando el kit de licitación esté cerrado.' },
    { nombre: 'Lekeitio', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Lea Artibai', mancomunidad: 'Lea Artibai', prioridad: 2 },
    { nombre: 'Markina-Xemein', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Lea Artibai', mancomunidad: 'Lea Artibai', prioridad: 2 },
    { nombre: 'Ondarroa', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Lea Artibai', mancomunidad: 'Lea Artibai', prioridad: 2 },
    { nombre: 'Balmaseda', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Enkarterri', mancomunidad: 'Enkarterri', prioridad: 2 },
    { nombre: 'Güeñes', tipo: 'ayuntamiento', territorio: 'Bizkaia', comarca: 'Enkarterri', mancomunidad: 'Enkarterri', prioridad: 3 },
    { nombre: 'Amurrio', tipo: 'ayuntamiento', territorio: 'Araba/Álava', comarca: 'Aiaraldea', prioridad: 2 },
    { nombre: 'Laudio/Llodio', tipo: 'ayuntamiento', territorio: 'Araba/Álava', comarca: 'Aiaraldea', prioridad: 2 },
    { nombre: 'Vitoria-Gasteiz', tipo: 'ayuntamiento', territorio: 'Araba/Álava', comarca: 'Vitoria-Gasteiz', prioridad: 3, notas: 'Capital. Estructura propia de educación ambiental potente. Entrar con propuesta muy diferencial.' },
    { nombre: 'Eibar', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Debabarrena', mancomunidad: 'Debabarrena', prioridad: 2 },
    { nombre: 'Arrasate/Mondragón', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Debagoiena', mancomunidad: 'Debagoiena', prioridad: 2 },
    { nombre: 'Bergara', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Debagoiena', mancomunidad: 'Debagoiena', prioridad: 2 },
    { nombre: 'Zarautz', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Urola Kosta', mancomunidad: 'Urola Kosta', prioridad: 2 },
    { nombre: 'Azpeitia', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Urola Erdia', prioridad: 2 },
    { nombre: 'Tolosa', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Tolosaldea', mancomunidad: 'Tolosaldea', prioridad: 2 },
    { nombre: 'Irun', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Bidasoa', mancomunidad: 'Txingudi', prioridad: 2 },
    { nombre: 'Hondarribia', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Bidasoa', mancomunidad: 'Txingudi', prioridad: 2 },
    { nombre: 'Donostia/San Sebastián', tipo: 'ayuntamiento', territorio: 'Gipuzkoa', comarca: 'Donostialdea', prioridad: 3, notas: 'Grande y exigente. Larga carrera.' },
    { nombre: 'Ihobe', tipo: 'agencia', territorio: 'CAPV', prioridad: 1, notas: 'NO es cliente típico: es el amplificador del loop. Coordina Udalsarea 2030 y las convocatorias.' },
    { nombre: 'Udalsarea 2030', tipo: 'red', territorio: 'CAPV', prioridad: 1, notas: 'Foro de prescripción (estación ⑥). Objetivo: que un técnico presente un caso INGURA en un grupo de trabajo.' },
    { nombre: 'EUDEL', tipo: 'asociacion', territorio: 'CAPV', prioridad: 2, notas: 'Grupos de trabajo transversales de personal técnico y político' },
    { nombre: 'Diputación Foral de Bizkaia', tipo: 'diputacion', territorio: 'Bizkaia', prioridad: 2, notas: 'Competencia foral en residuos + convocatorias propias' },
    { nombre: 'Diputación Foral de Gipuzkoa', tipo: 'diputacion', territorio: 'Gipuzkoa', prioridad: 2 },
    { nombre: 'Diputación Foral de Álava', tipo: 'diputacion', territorio: 'Araba/Álava', prioridad: 3 }
  ],

  /* =========================================================================
     BLOQUE DEMO — lo único inventado de este fichero.
     Sirve para que el ERP sea explorable antes de tener datos reales.
     Se borra entero desde Ajustes → «Vaciar datos de demostración».
     ======================================================================= */
  demo: {
    oportunidades: [
      { id: 'op-1', institucion: 'Mancomunidad de Uribe Kosta', señal: 'Presupuesto 2026 aprobado con partida de sensibilización',
        fuente: 'BOB', tipo: 'presupuesto', origen: 'radar', ventana: '2026-02-28', estado: 'abierta', demo: true },
      { id: 'op-2', institucion: 'Gernika-Lumo', señal: 'Adhesión a Udalsarea 2030: obligación de programar acciones',
        fuente: 'Ihobe', tipo: 'adhesion', origen: 'radar', ventana: '2026-03-31', estado: 'abierta', demo: true },
      { id: 'op-3', institucion: 'Durango', señal: 'Técnica de medio ambiente pregunta por Asteklima tras ver el caso de Sopela',
        fuente: 'Prescripción', tipo: 'entrante', origen: 'prescripcion', ventana: '2026-09-01', estado: 'abierta', demo: true },
      { id: 'op-4', institucion: 'Ihobe', señal: 'Convocatoria de subvención a entidades locales publicada',
        fuente: 'euskadi.eus', tipo: 'convocatoria', origen: 'convocatoria', ventana: '2026-02-15', estado: 'abierta', demo: true }
    ],
    propuestas: [
      { id: 'pr-1', institucion: 'Berango', titulo: 'Asteklima 2026 con recorrido escolar', lineas: ['linea-2', 'linea-4'],
        importe: 8200, estado: 'enviada', fecha: '2026-02-10', horas: 9,
        capas: { ciudadana: true, tecnica: true, justificativa: false }, demo: true },
      { id: 'pr-2', institucion: 'Mancomunidad de Uribe Kosta', titulo: 'Estrategia comarcal de orgánico', lineas: ['linea-1', 'linea-5'],
        importe: 24000, estado: 'enviada', fecha: '2026-02-20', horas: 22,
        capas: { ciudadana: true, tecnica: true, justificativa: true }, demo: true },
      { id: 'pr-3', institucion: 'Sopela', titulo: 'Semana climática municipal', lineas: ['linea-2', 'linea-4', 'linea-7'],
        importe: 11500, estado: 'adjudicada', fecha: '2025-09-05', horas: 14,
        capas: { ciudadana: true, tecnica: true, justificativa: true }, demo: true },
      { id: 'pr-4', institucion: 'Urduliz', titulo: 'Taller de aceite en fiestas', lineas: ['linea-3'],
        importe: 800, estado: 'adjudicada', fecha: '2025-05-12', horas: 2,
        capas: { ciudadana: true, tecnica: true, justificativa: false }, demo: true },
      { id: 'pr-5', institucion: 'Getxo', titulo: 'Campaña de comercio y hostelería', lineas: ['linea-5'],
        importe: 13500, estado: 'perdida', fecha: '2025-11-02', horas: 18,
        capas: { ciudadana: true, tecnica: true, justificativa: false },
        motivo: 'Perdida por solvencia técnica: faltaban certificados de buena ejecución.', demo: true }
    ],
    campanas: [
      { id: 'cp-1', institucion: 'Sopela', titulo: 'Semana climática municipal', lineas: ['linea-2', 'linea-4', 'linea-7'],
        importe: 11500, inicio: '2025-11-17', cierre: '2025-12-05', estado: 'cerrada', fase: 6,
        nivelEvidencia: 3, informe: true, certificado: true, caso: true, reunionCierre: true, nivel4: false,
        alcance: 330, encuestas: 118, euskera: 58, kmIda: 2, demo: true },
      { id: 'cp-2', institucion: 'Urduliz', titulo: 'Taller de aceite en fiestas', lineas: ['linea-3'],
        importe: 800, inicio: '2025-06-21', cierre: '2025-06-21', estado: 'cerrada', fase: 6,
        nivelEvidencia: 1, informe: false, certificado: false, caso: false, reunionCierre: false, nivel4: false,
        alcance: 64, encuestas: 0, euskera: 40, kmIda: 6, demo: true },
      { id: 'cp-3', institucion: 'Berango', titulo: 'Programa escolar de curso', lineas: ['linea-4'],
        importe: 4800, inicio: '2026-01-15', cierre: '', estado: 'en-curso', fase: 5,
        nivelEvidencia: 2, informe: false, certificado: false, caso: false, reunionCierre: false, nivel4: false,
        alcance: 210, encuestas: 74, euskera: 71, kmIda: 4, demo: true }
    ],
    casos: [
      { id: 'cs-1', campana: 'cp-1', institucion: 'Sopela', titulo: 'Una semana climática que se midió mientras ocurría',
        nivel: 3, permiso: true, publicado: true, presentadoEnRed: false, demo: true }
    ],
    prescriptores: [
      { id: 'ps-1', institucion: 'Sopela', rol: 'Técnica de medio ambiente', activo: true,
        nota: 'Recomendó INGURA a Durango sin que se le pidiera.', demo: true }
    ]
  }
};
