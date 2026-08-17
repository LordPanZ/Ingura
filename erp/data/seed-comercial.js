/* ============================================================================
   INGURA ERP · datos semilla del circuito comercial y financiero
   ----------------------------------------------------------------------------
   Cadena documental:

     Propuesta técnica  →  OFERTA  →  PEDIDO / ENCARGO  →  FACTURA  →  COBRO
        (estación ②)      económica    contrato o           por        con su
                          con IVA      expediente           hitos      vencimiento

   El eslabón que casi siempre falla en este sector no es el pago: es el
   REGISTRO. Una factura no registrada en el punto electrónico correcto de cada
   administración no existe, y el reloj de los 30 + 30 días no empieza a correr.

   ⚠️ Este fichero organiza obligaciones y plazos de uso corriente. No sustituye
   al asesoramiento fiscal ni jurídico. Los tipos y umbrales se revisan: están
   en `legal` para poder cambiarlos en un solo sitio.
   ========================================================================== */

(function (S) {
  'use strict';

  /* -------------------------------------------------- marco legal y fiscal */
  S.legal = {
    ivaGeneral: 21,
    ivaTipos: [0, 4, 10, 21],
    // Ley 9/2017 art. 118 — contrato menor de servicios, IVA excluido
    contratoMenor: 15000,
    // Ley 9/2017 art. 198.4 — 30 días para conformar + 30 para pagar
    plazoConformidad: 30,
    plazoPago: 30,
    // Ley 3/2004 art. 7 — interés de demora = tipo BCE + 8 puntos.
    // El tipo BCE se publica semestralmente: ajustar en Ajustes.
    interesDemoraPuntos: 8,
    tipoBCE: 3.0,
    // Ley 25/2013 — factura electrónica a las AAPP. Muchas entidades excluyen
    // las de importe igual o inferior a este umbral.
    umbralFacturaElectronica: 5000,
    formato: 'Facturae 3.2.2',
    puntosRegistro: [
      'FACe — Punto General de Entrada del Estado',
      'e-Factura Euskadi (Ef4ktur)',
      'Punto propio de la entidad',
      'Registro presencial / en papel'
    ],
    tiposContrato: [
      'Contrato menor',
      'Contrato basado en acuerdo marco',
      'Procedimiento abierto simplificado',
      'Procedimiento abierto',
      'Encargo directo / convenio',
      'Subvención'
    ]
  };

  /* ---------------------------------------------------- categorías de gasto
     Alineadas con los siete componentes de coste de docs/09 §2, más la
     estructura que no se imputa a campaña. */
  S.categoriasGasto = [
    { id: 'colaboradores', nombre: 'Dinamización externa', imputable: true },
    { id: 'consumibles',   nombre: 'Materiales consumibles', imputable: true },
    { id: 'imprenta',      nombre: 'Producción gráfica e imprenta', imputable: true },
    { id: 'logistica',     nombre: 'Transporte, combustible y dietas', imputable: true },
    { id: 'equipo',        nombre: 'Equipamiento y mantenimiento', imputable: false },
    { id: 'seguros',       nombre: 'Seguros y cumplimiento', imputable: false },
    { id: 'estructura',    nombre: 'Estructura (asesoría, telefonía, local)', imputable: false },
    { id: 'formacion',     nombre: 'Formación y certificaciones', imputable: false }
  ];

  /* ------------------------------------------- estados de la cadena documental */
  S.estadosOferta  = ['borrador', 'enviada', 'aceptada', 'rechazada', 'caducada'];
  S.estadosPedido  = ['abierto', 'en-ejecucion', 'completado', 'anulado'];
  /* El estado de una factura ante una administración es un camino, no una
     etiqueta: emitida → registrada → conformada → cobrada. */
  S.estadosFactura = ['emitida', 'registrada', 'conformada', 'cobrada', 'rechazada'];

  /* =========================================================================
     BLOQUE DEMO — coherente con las campañas de seed.js.
     Se borra desde Ajustes → «Vaciar datos de demostración».
     ======================================================================= */
  S.demo.ofertas = [
    { id: 'of-1', numero: '2025/004', institucion: 'Sopela', propuesta: 'pr-3',
      fecha: '2025-09-05', validez: '2025-11-05', estado: 'aceptada', demo: true,
      lineas: [
        { concepto: 'L2 · Módulo expositivo y charlas escolares (1 semana)', cant: 1, precio: 6500, iva: 21 },
        { concepto: 'L4 · Programa en centros escolares, 4 sesiones', cant: 4, precio: 750, iva: 21 },
        { concepto: 'L7 · Cartelería, tríptico y señalética bilingüe', cant: 1, precio: 2000, iva: 21 }
      ] },
    { id: 'of-2', numero: '2025/002', institucion: 'Urduliz', propuesta: 'pr-4',
      fecha: '2025-05-12', validez: '2025-07-12', estado: 'aceptada', demo: true,
      lineas: [{ concepto: 'L3 · Taller de aceite usado, 3 h, en fiestas', cant: 1, precio: 800, iva: 21 }] },
    { id: 'of-3', numero: '2026/001', institucion: 'Berango', propuesta: null,
      fecha: '2026-01-08', validez: '2026-03-08', estado: 'aceptada', demo: true,
      lineas: [{ concepto: 'L4 · Programa escolar de curso, 6 sesiones', cant: 6, precio: 800, iva: 21 }] },
    { id: 'of-4', numero: '2026/003', institucion: 'Mancomunidad de Uribe Kosta', propuesta: 'pr-2',
      fecha: '2026-02-20', validez: '2026-04-20', estado: 'enviada', demo: true,
      lineas: [
        { concepto: 'L1 · Estrategia comarcal de residuo orgánico', cant: 1, precio: 12000, iva: 21 },
        { concepto: 'L5 · Campaña de comercio y hostelería, 60 establecimientos', cant: 1, precio: 12000, iva: 21 }
      ] },
    { id: 'of-5', numero: '2025/006', institucion: 'Getxo', propuesta: 'pr-5',
      fecha: '2025-11-02', validez: '2026-01-02', estado: 'rechazada', demo: true,
      lineas: [{ concepto: 'L5 · Campaña de comercio y hostelería, 75 establecimientos', cant: 1, precio: 13500, iva: 21 }] }
  ];

  S.demo.pedidos = [
    { id: 'pd-1', numero: 'P-2025/004', oferta: 'of-1', campana: 'cp-1', institucion: 'Sopela',
      fecha: '2025-09-22', tipo: 'Contrato menor', expediente: '2025/EX-0417', recurrente: false,
      dir3: { oc: 'L01489121', og: 'L01489121', ut: 'L01489121' }, estado: 'completado', demo: true,
      hitos: [
        { nombre: 'Validación de contenidos (fase 3)', pct: 30, factura: 'fa-1' },
        { nombre: 'Mitad de ejecución (fase 5)',       pct: 40, factura: 'fa-2' },
        { nombre: 'Cierre y devolución (fase 6)',      pct: 30, factura: 'fa-3' }
      ] },
    { id: 'pd-2', numero: 'P-2025/002', oferta: 'of-2', campana: 'cp-2', institucion: 'Urduliz',
      fecha: '2025-05-28', tipo: 'Contrato menor', expediente: '2025/EX-0208', recurrente: false,
      dir3: { oc: '', og: '', ut: '' }, estado: 'completado', demo: true,
      hitos: [{ nombre: 'Ejecución completa', pct: 100, factura: 'fa-4' }] },
    { id: 'pd-3', numero: 'P-2026/001', oferta: 'of-3', campana: 'cp-3', institucion: 'Berango',
      fecha: '2026-01-12', tipo: 'Contrato menor', expediente: '2026/EX-0031', recurrente: true,
      dir3: { oc: 'L01480189', og: 'L01480189', ut: 'L01480189' }, estado: 'en-ejecucion', demo: true,
      hitos: [
        { nombre: 'Inicio de curso',   pct: 50, factura: 'fa-5' },
        { nombre: 'Cierre de curso',   pct: 50, factura: null }
      ] }
  ];

  /* base = importe sin IVA · los estados llevan la fecha de cada paso */
  S.demo.facturas = [
    { id: 'fa-1', serie: 'A', numero: '2025/012', pedido: 'pd-1', institucion: 'Sopela',
      concepto: 'Semana climática municipal · hito 1 de 3 (validación de contenidos)',
      fecha: '2025-10-06', base: 3450, iva: 21, estado: 'cobrada', demo: true,
      punto: 'e-Factura Euskadi (Ef4ktur)', registro: 'REG-2025-8841',
      fechaRegistro: '2025-10-06', fechaConformidad: '2025-10-20', fechaCobro: '2025-11-14' },
    { id: 'fa-2', serie: 'A', numero: '2025/015', pedido: 'pd-1', institucion: 'Sopela',
      concepto: 'Semana climática municipal · hito 2 de 3 (mitad de ejecución)',
      fecha: '2025-11-24', base: 4600, iva: 21, estado: 'cobrada', demo: true,
      punto: 'e-Factura Euskadi (Ef4ktur)', registro: 'REG-2025-9903',
      fechaRegistro: '2025-11-24', fechaConformidad: '2025-12-11', fechaCobro: '2026-01-09' },
    { id: 'fa-3', serie: 'A', numero: '2025/018', pedido: 'pd-1', institucion: 'Sopela',
      concepto: 'Semana climática municipal · hito 3 de 3 (cierre y devolución)',
      fecha: '2025-12-05', base: 3450, iva: 21, estado: 'conformada', demo: true,
      punto: 'e-Factura Euskadi (Ef4ktur)', registro: 'REG-2025-0142',
      fechaRegistro: '2025-12-05', fechaConformidad: '2025-12-29', fechaCobro: '' },
    /* Caso de manual: emitida el mismo día del cierre pero NUNCA registrada.
       Lleva más de un año sin cobrar y el reloj legal ni siquiera ha arrancado. */
    { id: 'fa-4', serie: 'A', numero: '2025/007', pedido: 'pd-2', institucion: 'Urduliz',
      concepto: 'Taller de aceite usado en fiestas',
      fecha: '2025-06-21', base: 800, iva: 21, estado: 'emitida', demo: true,
      punto: '', registro: '', fechaRegistro: '', fechaConformidad: '', fechaCobro: '' },
    { id: 'fa-5', serie: 'A', numero: '2026/002', pedido: 'pd-3', institucion: 'Berango',
      concepto: 'Programa escolar de curso · hito 1 de 2 (inicio de curso)',
      fecha: '2026-02-02', base: 2400, iva: 21, estado: 'registrada', demo: true,
      punto: 'FACe — Punto General de Entrada del Estado', registro: 'FACe-2026-114577',
      fechaRegistro: '2026-02-03', fechaConformidad: '', fechaCobro: '' }
  ];

  S.demo.gastos = [
    { id: 'ga-1', fecha: '2025-10-14', proveedor: 'Imprenta de proximidad', categoria: 'imprenta',
      concepto: 'Cartelería, trípticos y vinilos bilingües', base: 1850, iva: 21, campana: 'cp-1', pagado: true, demo: true },
    { id: 'ga-2', fecha: '2025-11-10', proveedor: 'Dinamizadora colaboradora', categoria: 'colaboradores',
      concepto: 'Refuerzo de dinamización, 6 sesiones', base: 1440, iva: 21, campana: 'cp-1', pagado: true, demo: true },
    { id: 'ga-3', fecha: '2025-11-03', proveedor: 'Suministros didácticos', categoria: 'consumibles',
      concepto: 'Plántulas, sustrato, sosa, ceras y kits', base: 620, iva: 21, campana: 'cp-1', pagado: true, demo: true },
    { id: 'ga-4', fecha: '2025-11-18', proveedor: 'Combustible y dietas', categoria: 'logistica',
      concepto: 'Desplazamiento del módulo, semana de campaña', base: 310, iva: 21, campana: 'cp-1', pagado: true, demo: true },
    { id: 'ga-5', fecha: '2025-06-19', proveedor: 'Suministros didácticos', categoria: 'consumibles',
      concepto: 'Material del taller de aceite', base: 95, iva: 21, campana: 'cp-2', pagado: true, demo: true },
    { id: 'ga-6', fecha: '2026-01-20', proveedor: 'Correduría de seguros', categoria: 'seguros',
      concepto: 'Póliza de responsabilidad civil, anualidad', base: 780, iva: 0, campana: null, pagado: true, demo: true },
    { id: 'ga-7', fecha: '2026-02-05', proveedor: 'Asesoría', categoria: 'estructura',
      concepto: 'Asesoría contable y fiscal, primer trimestre', base: 450, iva: 21, campana: null, pagado: true, demo: true },
    { id: 'ga-8', fecha: '2026-02-16', proveedor: 'Taller de maquinaria', categoria: 'equipo',
      concepto: 'Mantenimiento de extrusora-inyectora', base: 340, iva: 21, campana: null, pagado: false, demo: true },
    { id: 'ga-9', fecha: '2026-02-24', proveedor: 'Dinamizadora colaboradora', categoria: 'colaboradores',
      concepto: 'Sesiones del programa escolar', base: 960, iva: 21, campana: 'cp-3', pagado: false, demo: true }
  ];

})(window.INGURA.seed);
