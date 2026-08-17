/* ============================================================================
   INGURA ERP · núcleo
   Estado + persistencia + i18n + helpers de render + métricas derivadas.
   Sin dependencias, sin build. Funciona desde file:// y desde Netlify.
   ========================================================================== */

window.INGURA = window.INGURA || {};
(function (NS) {
  'use strict';

  var KEY = 'ingura.erp.v1';

  /* ======================================================================
     1 · ESTADO
     ==================================================================== */

  function estadoInicial() {
    var s = NS.seed;
    return {
      lang: 'es',
      ejercicio: new Date().getFullYear(),
      demo: true,
      instituciones: s.instituciones.map(function (i, n) {
        return {
          id: 'in-' + n,
          nombre: i.nombre, tipo: i.tipo, territorio: i.territorio,
          comarca: i.comarca || '', mancomunidad: i.mancomunidad || '',
          prioridad: i.prioridad, notas: i.notas || '',
          // campos a rellenar desde fuente oficial — vacíos a propósito
          poblacion: '', udalsarea: '', contacto_tecnico: '', contacto_politico: '',
          email: '', telefono: '', kg_hab_organico: '', kg_hab_envases: '',
          proveedor_actual: '', ultima_interaccion: '', proxima_ventana: '',
          estado: 'sin-contacto', escalon: 0, prescriptor: false
        };
      }),
      oportunidades: s.demo.oportunidades.slice(),
      propuestas:    s.demo.propuestas.slice(),
      campanas:      s.demo.campanas.slice(),
      casos:         s.demo.casos.slice(),
      prescriptores: s.demo.prescriptores.slice(),
      // circuito comercial y financiero
      ofertas:       s.demo.ofertas.slice(),
      pedidos:       s.demo.pedidos.slice(),
      facturas:      s.demo.facturas.slice(),
      gastos:        s.demo.gastos.slice(),
      cumplimiento:  s.cumplimiento.map(function (c) { return Object.assign({}, c); }),
      checklists: {},
      presupuestos: {},
      tipoBCE: s.legal.tipoBCE,
      tesoreriaInicial: 0
    };
  }

  /** Colecciones que deben existir siempre, aunque el estado guardado sea
      anterior a que se añadiera el circuito comercial. */
  var COLECCIONES = ['instituciones', 'oportunidades', 'propuestas', 'campanas', 'casos',
                     'prescriptores', 'ofertas', 'pedidos', 'facturas', 'gastos', 'cumplimiento'];

  function normalizar(st) {
    var base = null;
    COLECCIONES.forEach(function (k) {
      if (Array.isArray(st[k])) return;
      base = base || estadoInicial();
      st[k] = base[k];
    });
    if (!st.checklists) st.checklists = {};
    if (!st.presupuestos) st.presupuestos = {};
    if (st.tipoBCE === undefined) st.tipoBCE = NS.seed.legal.tipoBCE;
    if (st.tesoreriaInicial === undefined) st.tesoreriaInicial = 0;
    return st;
  }

  var state = null;

  NS.store = {
    get: function () {
      if (state) return state;
      try {
        var raw = localStorage.getItem(KEY);
        state = normalizar(raw ? JSON.parse(raw) : estadoInicial());
      } catch (e) { state = estadoInicial(); }
      return state;
    },
    save: function () {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
      return state;
    },
    reset: function () { state = estadoInicial(); NS.store.save(); },
    /** Borra sólo lo marcado como demo; conserva cartera y cumplimiento. */
    vaciarDemo: function () {
      var st = NS.store.get();
      var noDemo = function (x) { return !x.demo; };
      st.oportunidades = st.oportunidades.filter(noDemo);
      st.propuestas    = st.propuestas.filter(noDemo);
      st.campanas      = st.campanas.filter(noDemo);
      st.casos         = st.casos.filter(noDemo);
      st.prescriptores = st.prescriptores.filter(noDemo);
      st.ofertas       = st.ofertas.filter(noDemo);
      st.pedidos       = st.pedidos.filter(noDemo);
      st.facturas      = st.facturas.filter(noDemo);
      st.gastos        = st.gastos.filter(noDemo);
      st.demo = false;
      NS.store.save();
    },
    hayDemo: function () {
      var st = NS.store.get();
      return [].concat(st.oportunidades, st.propuestas, st.campanas, st.casos, st.prescriptores,
                       st.ofertas, st.pedidos, st.facturas, st.gastos)
               .some(function (x) { return x && x.demo; });
    }
  };

  /* ======================================================================
     2 · I18N — sólo el cromado de la interfaz.
     Los datos (nombres de institución, notas, catálogo) van en su idioma
     original. Prioridad al euskera, como manda docs/08 §4.
     ==================================================================== */

  var DICT = {
    eu: {
      panel: 'Panela', cartera: 'Zorroa', radar: 'Radarra', propuestas: 'Proposamenak',
      campanas: 'Kanpainak', evidencia: 'Frogak', devolucion: 'Itzulketa', casos: 'Kasuak',
      catalogo: 'Katalogoa', economico: 'Marjinak', cumplimiento: 'Betetzea',
      calendario: 'Egutegia', ajustes: 'Ezarpenak',
      ofertas: 'Eskaintzak', pedidos: 'Enkarguak', facturas: 'Fakturak',
      tesoreria: 'Diruzaintza', gastos: 'Gastuak', balance: 'Balantzea',
      g_general: 'Orokorra', g_loop: 'Loop nagusia', g_comercial: 'Merkataritza',
      g_finanzas: 'Finantzak', g_base: 'Oinarria', g_control: 'Kontrola',
      buscar: 'Bilatu', todos: 'Denak', nuevo: 'Berria', guardar: 'Gorde', cerrar: 'Itxi',
      institucion: 'Erakundea', estado: 'Egoera', prioridad: 'Lehentasuna', escalon: 'Maila',
      importe: 'Zenbatekoa', fecha: 'Data', total: 'Guztira', ninguno: 'Bat ere ez',
      avisos: 'Abisuak', deuda: 'Loop-zorra', activos: 'Aktiboak', umbral: 'Atalasea'
    },
    es: {
      panel: 'Panel', cartera: 'Cartera', radar: 'Radar', propuestas: 'Propuestas',
      campanas: 'Campañas', evidencia: 'Evidencia', devolucion: 'Devolución', casos: 'Casos',
      catalogo: 'Catálogo', economico: 'Márgenes', cumplimiento: 'Cumplimiento',
      calendario: 'Calendario', ajustes: 'Ajustes',
      ofertas: 'Ofertas', pedidos: 'Pedidos', facturas: 'Facturas',
      tesoreria: 'Tesorería', gastos: 'Gastos', balance: 'Balance',
      g_general: 'General', g_loop: 'El loop maestro', g_comercial: 'Comercial',
      g_finanzas: 'Finanzas', g_base: 'Base', g_control: 'Control',
      buscar: 'Buscar', todos: 'Todos', nuevo: 'Nuevo', guardar: 'Guardar', cerrar: 'Cerrar',
      institucion: 'Institución', estado: 'Estado', prioridad: 'Prioridad', escalon: 'Escalón',
      importe: 'Importe', fecha: 'Fecha', total: 'Total', ninguno: 'Ninguno',
      avisos: 'Avisos', deuda: 'Deuda de loop', activos: 'Activos', umbral: 'Umbral'
    }
  };

  NS.t = function (k) {
    var l = NS.store.get().lang;
    return (DICT[l] && DICT[l][k]) || DICT.es[k] || k;
  };

  /* ======================================================================
     3 · HELPERS DE RENDER
     ==================================================================== */

  /** h('div.card', {onclick:fn}, [hijos|texto]) */
  function h(sel, attrs, kids) {
    var parts = sel.split(/(?=[.#])/);
    var el = document.createElement(parts.shift() || 'div');
    parts.forEach(function (p) {
      var v = p.slice(1);
      if (!v) return;                       // tolera '.sem.' cuando el tono va vacío
      if (p[0] === '.') el.classList.add(v);
      else el.id = v;
    });
    // el 2º argumento son hijos salvo que sea un objeto plano de atributos
    if (attrs !== null && attrs !== undefined &&
        (typeof attrs !== 'object' || Array.isArray(attrs) || attrs.nodeType)) {
      kids = attrs; attrs = null;
    }
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'class') el.className += ' ' + v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    añadir(el, kids);
    return el;
  }

  /** Añade hijos aplanando arrays anidados y saltando null/false. */
  function añadir(el, kids) {
    if (kids === null || kids === undefined || kids === false) return;
    if (Array.isArray(kids)) { kids.forEach(function (k) { añadir(el, k); }); return; }
    el.appendChild(kids.nodeType ? kids : document.createTextNode(String(kids)));
  }
  NS.h = h;

  NS.fmt = {
    eur: function (n) {
      if (n === null || n === undefined || n === '') return '—';
      return Number(n).toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' €';
    },
    pct: function (n, dec) {
      if (n === null || n === undefined || isNaN(n)) return '—';
      return Number(n).toFixed(dec === undefined ? 0 : dec) + ' %';
    },
    fecha: function (s) {
      if (!s) return '—';
      var d = new Date(s + 'T00:00:00');
      if (isNaN(d)) return s;
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    dias: function (n) { return (n > 0 ? '+' : '') + n + ' d'; }
  };

  var DIA = 86400000;
  NS.hoy = function () { var d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  NS.dias = function (desde, hasta) {
    if (!desde) return null;
    var a = new Date(desde + 'T00:00:00');
    if (isNaN(a)) return null;
    return Math.round(((hasta || NS.hoy()) - a) / DIA);
  };

  /** Semáforo con etiqueta obligatoria — el color nunca va solo. */
  NS.sem = function (nivel, texto) { return h('span.sem.' + nivel, texto); };

  NS.chip = function (texto, tono) { return h('span.chip' + (tono ? '.' + tono : ''), texto); };

  NS.vacio = function (titulo, detalle) {
    return h('div.empty', [h('b', titulo), detalle || '']);
  };

  /** Barra de magnitud contra umbral. `dir`: 'mayor' (más es mejor) o 'menor'. */
  NS.meter = function (valor, umbral, max, dir, capIzq, capDer) {
    var m = max || Math.max(umbral * 1.6, valor * 1.15, 1);
    var pct = Math.max(0, Math.min(100, (valor / m) * 100));
    var bien = dir === 'menor' ? valor <= umbral : valor >= umbral;
    var cerca = dir === 'menor' ? valor <= umbral * 1.2 : valor >= umbral * 0.8;
    var tono = bien ? 'ok' : (cerca ? 'ambar' : 'mal');
    return h('div.meter', [
      h('div.track', [
        h('div.fill.' + tono, { style: 'width:' + pct + '%' }),
        h('div.mark', { style: 'left:' + Math.min(100, (umbral / m) * 100) + '%',
                        title: 'Umbral ' + umbral })
      ]),
      h('div.cap', [h('span', capIzq || ''), h('span', capDer || ('umbral ' + umbral))])
    ]);
  };

  /** Stat tile. Sin gráfico: es un titular, no un chart. */
  NS.tile = function (opts) {
    return h('div.tile' + (opts.flag ? '.flag' : ''), [
      h('div.lbl', opts.lbl),
      h('div.num', [String(opts.num), opts.unidad ? h('span.u', opts.unidad) : null]),
      opts.meter || null,
      opts.foot ? h('div.foot', opts.foot) : null
    ]);
  };

  /* ======================================================================
     4 · MÉTRICAS DERIVADAS DEL LOOP
     ==================================================================== */

  var M = {};
  NS.metricas = M;

  M.campanasCerradas = function () {
    return NS.store.get().campanas.filter(function (c) { return c.estado === 'cerrada' && c.cierre; });
  };

  /** Deuda de loop: campaña cerrada a la que le falta algo. Tablero §7. */
  M.deuda = function () {
    return M.campanasCerradas().map(function (c) {
      var falta = [];
      if (!c.informe)     falta.push('informe');
      if (!c.certificado) falta.push('certificado');
      if (!c.caso)        falta.push('caso');
      if (!c.nivel4)      falta.push('nivel 4');
      return { campana: c, falta: falta, dias: NS.dias(c.cierre) };
    }).filter(function (d) { return d.falta.length; })
      .sort(function (a, b) { return b.dias - a.dias; });
  };

  /**
   * Avisos: recordatorios automáticos de cadencias.md, vigencias de
   * cumplimiento en ámbar/vencidas y alertas fijas de calendario.
   */
  M.avisos = function () {
    var st = NS.store.get(), out = [];
    var campo = { cert: 'certificado', caso: 'caso', nivel4: 'nivel4', react: 'reactivada' };

    M.campanasCerradas().forEach(function (c) {
      var transcurridos = NS.dias(c.cierre);
      NS.seed.recordatorios.forEach(function (r) {
        if (transcurridos < r.dias) return;
        if (c[campo[r.id]]) return;
        out.push({
          gravedad: r.gravedad, titulo: r.titulo,
          detalle: c.institucion + ' · ' + c.titulo + ' — cerrada hace ' + transcurridos + ' días. ' + r.detalle,
          vista: 'devolucion', orden: transcurridos - r.dias
        });
      });
    });

    st.cumplimiento.forEach(function (v) {
      var restan = v.vence ? -NS.dias(v.vence) : null;
      if (restan === null) {
        if (v.bloqueante) out.push({
          gravedad: 'alta', titulo: 'Sin fecha de vigencia: ' + v.nombre,
          detalle: 'Elemento bloqueante del arranque del loop. Sin él la estación ③ es un riesgo legal, no un servicio.',
          vista: 'cumplimiento', orden: 9999
        });
      } else if (restan < 0) {
        out.push({ gravedad: 'alta', titulo: 'VENCIDO: ' + v.nombre,
          detalle: 'Caducó hace ' + (-restan) + ' días.', vista: 'cumplimiento', orden: 9000 - restan });
      } else if (restan < 60) {
        out.push({ gravedad: 'media', titulo: 'Vence en ' + restan + ' días: ' + v.nombre,
          detalle: 'Regla del tablero: toda vigencia en ámbar sube a la reunión del lunes como acción con fecha.',
          vista: 'cumplimiento', orden: 60 - restan });
      }
    });

    var mes = new Date().getMonth() + 1;
    NS.seed.alertasFijas.forEach(function (a) {
      if (a.mes !== mes) return;
      out.push({ gravedad: 'media', titulo: a.titulo, detalle: a.detalle, vista: 'calendario', orden: 500 });
    });

    return out.sort(function (a, b) {
      var g = { alta: 0, media: 1, baja: 2 };
      return (g[a.gravedad] - g[b.gravedad]) || (b.orden - a.orden);
    });
  };

  /** Los tres indicadores maestros (LOOP-MAESTRO §8). */
  M.maestros = function () {
    var st = NS.store.get();
    var porInst = {};
    st.campanas.forEach(function (c) {
      (porInst[c.institucion] = porInst[c.institucion] || []).push(c);
    });
    var conCampana = Object.keys(porInst);
    var repiten = conCampana.filter(function (k) {
      var anios = {};
      porInst[k].forEach(function (c) { if (c.inicio) anios[c.inicio.slice(0, 4)] = 1; });
      return Object.keys(anios).length >= 2;
    });

    var ops = st.oportunidades;
    var noFrias = ops.filter(function (o) {
      return ['prescripcion', 'convocatoria', 'entrante'].indexOf(o.origen) >= 0;
    });

    var publicables = st.casos.filter(function (c) { return c.nivel >= 3 && c.permiso; });

    return {
      repeticion: conCampana.length ? (repiten.length / conCampana.length) * 100 : 0,
      repeticionBase: conCampana.length,
      nofria: ops.length ? (noFrias.length / ops.length) * 100 : 0,
      nofriaBase: ops.length,
      casos: publicables.length
    };
  };

  /** Los cuatro activos (LOOP-MAESTRO §2). Nunca deben bajar. */
  M.activos = function () {
    var st = NS.store.get();
    return {
      A1:  st.campanas.filter(function (c) { return c.nivelEvidencia >= 3; }).length,
      A1b: st.campanas.filter(function (c) { return c.nivel4; }).length,
      A2:  st.casos.filter(function (c) { return c.publicado; }).length,
      A3:  st.prescriptores.filter(function (p) { return p.activo; }).length,
      A4:  st.campanas.filter(function (c) { return c.certificado; }).length,
      A4base: M.campanasCerradas().length
    };
  };

  /** Salud comercial y económica (docs/09 §7). */
  M.economia = function () {
    var st = NS.store.get();
    var adj = st.propuestas.filter(function (p) { return p.estado === 'adjudicada'; });
    var per = st.propuestas.filter(function (p) { return p.estado === 'perdida'; });
    var resueltas = adj.length + per.length;

    var porCliente = {}, total = 0;
    st.campanas.forEach(function (c) {
      var imp = Number(c.importe) || 0;
      porCliente[c.institucion] = (porCliente[c.institucion] || 0) + imp;
      total += imp;
    });
    var mayor = Object.keys(porCliente).reduce(function (m, k) {
      return porCliente[k] > (porCliente[m] || 0) ? k : m;
    }, Object.keys(porCliente)[0]);

    var horas = st.propuestas.filter(function (p) { return p.horas; });
    var cerradas = M.campanasCerradas();

    return {
      adjudicacion: resueltas ? (adj.length / resueltas) * 100 : 0,
      adjudicacionBase: resueltas,
      facturacion: total,
      mayorCliente: mayor || '—',
      concentracion: total ? ((porCliente[mayor] || 0) / total) * 100 : 0,
      horasMedias: horas.length ? horas.reduce(function (s, p) { return s + p.horas; }, 0) / horas.length : 0,
      ticket: st.campanas.length ? total / st.campanas.length : 0,
      nivel3: cerradas.length
        ? (cerradas.filter(function (c) { return c.nivelEvidencia >= 3; }).length / cerradas.length) * 100
        : 0,
      pipeline: st.propuestas.filter(function (p) { return p.estado === 'enviada'; })
                  .reduce(function (s, p) { return s + (Number(p.importe) || 0); }, 0)
    };
  };

  /** Salud por estación — alimenta el rail y el diagnóstico de fallo. */
  M.estaciones = function () {
    var st = NS.store.get(), a = M.activos(), e = M.economia();
    var cerradas = M.campanasCerradas();
    var pc = function (n, d) { return d ? (n / d) * 100 : null; };
    return {
      radar:      { valor: st.oportunidades.filter(function (o) { return o.estado === 'abierta'; }).length,
                    txt: 'oportunidades abiertas' },
      propuestas: { valor: e.adjudicacion, pct: true, txt: 'ratio adjudicación' },
      campanas:   { valor: st.campanas.filter(function (c) { return c.estado === 'en-curso'; }).length,
                    txt: 'campañas en curso' },
      evidencia:  { valor: e.nivel3, pct: true, txt: 'cerradas con nivel 3' },
      devolucion: { valor: pc(a.A4, a.A4base), pct: true, txt: 'con certificado' },
      casos:      { valor: a.A2, txt: 'casos publicados' }
    };
  };

  /* ======================================================================
     4b · CIRCUITO COMERCIAL Y FINANCIERO
     ==================================================================== */

  /** Base, IVA y total de un documento con líneas o con base directa. */
  M.importes = function (doc) {
    if (doc.lineas && doc.lineas.length) {
      var base = 0, iva = 0;
      doc.lineas.forEach(function (l) {
        var b = (Number(l.cant) || 0) * (Number(l.precio) || 0);
        base += b; iva += b * (Number(l.iva) || 0) / 100;
      });
      return { base: base, iva: iva, total: base + iva };
    }
    var b2 = Number(doc.base) || 0;
    var i2 = b2 * (Number(doc.iva) || 0) / 100;
    return { base: b2, iva: i2, total: b2 + i2 };
  };

  /**
   * Estado real de una factura ante una administración.
   * El reloj legal (Ley 9/2017 art. 198.4: 30 días para conformar + 30 para
   * pagar) sólo arranca con el REGISTRO. Una factura emitida pero no
   * registrada no está «pendiente de cobro»: está parada, y es culpa nuestra.
   */
  M.factura = function (f) {
    var L = NS.seed.legal, imp = M.importes(f);
    var venc = null, arrancado = !!f.fechaRegistro;

    if (f.fechaConformidad) venc = sumarDias(f.fechaConformidad, L.plazoPago);
    else if (f.fechaRegistro) venc = sumarDias(f.fechaRegistro, L.plazoConformidad + L.plazoPago);

    var cobrada = f.estado === 'cobrada' && f.fechaCobro;
    var retraso = 0, interes = 0;
    if (venc && !cobrada) {
      retraso = Math.max(0, NS.dias(venc));
    } else if (venc && cobrada) {
      retraso = Math.max(0, Math.round((new Date(f.fechaCobro + 'T00:00:00') - new Date(venc + 'T00:00:00')) / 86400000));
    }
    if (retraso > 0) {
      var tipo = (Number(NS.store.get().tipoBCE) || 0) + L.interesDemoraPuntos;
      interes = imp.total * (tipo / 100) * (retraso / 365);
    }

    var diasCobro = cobrada
      ? Math.round((new Date(f.fechaCobro + 'T00:00:00') - new Date(f.fecha + 'T00:00:00')) / 86400000)
      : null;

    return {
      base: imp.base, iva: imp.iva, total: imp.total,
      vencimiento: venc, arrancado: arrancado, cobrada: !!cobrada,
      retraso: retraso, interes: interes, diasCobro: diasCobro,
      // el fallo característico: emitida hace tiempo y nunca registrada
      atascada: !arrancado && f.estado !== 'cobrada' && NS.dias(f.fecha) > 15,
      diasSinRegistrar: !arrancado ? NS.dias(f.fecha) : 0
    };
  };

  function sumarDias(fecha, n) {
    var d = new Date(fecha + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  NS.sumarDias = sumarDias;

  /** Trimestre natural (1-4) de una fecha ISO. */
  function trimestre(f) { return Math.floor(new Date(f + 'T00:00:00').getMonth() / 3) + 1; }
  NS.trimestre = trimestre;

  /**
   * Dos naturalezas distintas, y confundirlas es lo que hace mentir a un
   * cuadro de mando:
   *   · FLUJOS  (ingresos, gastos, IVA, estacionalidad) → del ejercicio.
   *   · SALDOS  (pendiente, vencido, sin registrar)     → a fecha de hoy,
   *     vengan del año que vengan. Una factura de hace dos años sin cobrar
   *     sigue siendo dinero que falta.
   */
  M.finanzas = function (ejercicio) {
    var st = NS.store.get();
    var anio = String(ejercicio || st.ejercicio);
    var delAnio = function (x) { return x.fecha && x.fecha.slice(0, 4) === anio; };
    var vigente = function (f) { return f.estado !== 'rechazada'; };

    var facturas = st.facturas.filter(delAnio);
    var gastos   = st.gastos.filter(delAnio);

    /* --- flujos del ejercicio --- */
    var ingresos = 0, ivaRep = 0;
    var porCliente = {}, porTrim = [0, 0, 0, 0], recurrente = 0;

    facturas.filter(vigente).forEach(function (f) {
      var d = M.factura(f);
      ingresos += d.base; ivaRep += d.iva;
      porCliente[f.institucion] = (porCliente[f.institucion] || 0) + d.base;
      porTrim[trimestre(f.fecha) - 1] += d.base;
      var ped = st.pedidos.find(function (p) { return p.id === f.pedido; });
      if (ped && ped.recurrente) recurrente += d.base;
    });

    /* --- saldos a fecha, sobre TODAS las facturas --- */
    var cobrado = 0, pendiente = 0, interesTotal = 0, diasCobro = [];
    var atascadas = [], sinConformar = [], vencidas = [];
    var aging = { d0: 0, d30: 0, d60: 0, d90: 0 };   // en plazo / 1-30 / 31-60 / +60

    st.facturas.filter(vigente).forEach(function (f) {
      var d = M.factura(f);
      if (d.cobrada) {
        cobrado += d.total;
        if (d.diasCobro !== null) diasCobro.push(d.diasCobro);
        return;
      }
      pendiente += d.total;
      interesTotal += d.interes;
      if (d.atascada) atascadas.push(f);
      else if (d.arrancado && !f.fechaConformidad) sinConformar.push(f);
      if (d.retraso > 0) {
        vencidas.push(f);
        if (d.retraso <= 30) aging.d30 += d.total;
        else if (d.retraso <= 60) aging.d60 += d.total;
        else aging.d90 += d.total;
      } else aging.d0 += d.total;
    });

    /* --- gastos: flujo del ejercicio + saldo pendiente global --- */
    var gastoTotal = 0, ivaSop = 0, porCategoria = {};
    gastos.forEach(function (g) {
      var d = M.importes(g);
      gastoTotal += d.base; ivaSop += d.iva;
      porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + d.base;
    });
    var gastoPendiente = st.gastos.filter(function (g) { return !g.pagado; })
      .reduce(function (s, g) { return s + M.importes(g).total; }, 0);
    var pagadoTotal = st.gastos.filter(function (g) { return g.pagado; })
      .reduce(function (s, g) { return s + M.importes(g).total; }, 0);

    var picos = porTrim.filter(function (v) { return v > 0; });
    var mayor = Object.keys(porCliente).reduce(function (m, k) {
      return porCliente[k] > (porCliente[m] || 0) ? k : m;
    }, Object.keys(porCliente)[0]);

    return {
      anio: anio,
      ingresos: ingresos, gastos: gastoTotal, resultado: ingresos - gastoTotal,
      margen: ingresos ? ((ingresos - gastoTotal) / ingresos) * 100 : 0,
      ivaRepercutido: ivaRep, ivaSoportado: ivaSop, ivaLiquidar: ivaRep - ivaSop,
      cobrado: cobrado, pendiente: pendiente, gastoPendiente: gastoPendiente,
      interesDemora: interesTotal,
      atascadas: atascadas, sinConformar: sinConformar, vencidas: vencidas,
      aging: aging,
      porCliente: porCliente, porCategoria: porCategoria, porTrimestre: porTrim,
      mayorCliente: mayor || '—',
      concentracion: ingresos ? ((porCliente[mayor] || 0) / ingresos) * 100 : 0,
      recurrente: ingresos ? (recurrente / ingresos) * 100 : 0,
      diasMediosCobro: diasCobro.length
        ? diasCobro.reduce(function (a, b) { return a + b; }, 0) / diasCobro.length : null,
      estacionalidad: picos.length > 1 ? Math.max.apply(null, picos) / Math.min.apply(null, picos) : null,
      tesoreria: (Number(st.tesoreriaInicial) || 0) + cobrado - pagadoTotal
    };
  };

  /* ======================================================================
     5 · ROUTER
     ==================================================================== */

  NS.vistas = {};
  var actual = null;

  NS.ir = function (vista, param) {
    location.hash = '#/' + vista + (param ? '/' + encodeURIComponent(param) : '');
  };

  function pintar() {
    var partes = (location.hash || '#/panel').replace(/^#\/?/, '').split('/');
    var vista = partes[0] || 'panel';
    var param = partes[1] ? decodeURIComponent(partes[1]) : null;
    if (!NS.vistas[vista]) vista = 'panel';
    actual = vista;

    document.querySelectorAll('.navlink').forEach(function (b) {
      b.classList.toggle('on', b.dataset.vista === vista);
    });

    var def = NS.vistas[vista];
    var head = document.getElementById('cabecera');
    head.innerHTML = '';
    head.appendChild(h('div', [
      def.eyebrow ? h('div.eyebrow', def.eyebrow) : null,
      h('h1', typeof def.titulo === 'function' ? def.titulo(param) : def.titulo)
    ]));

    var cont = document.getElementById('contenido');
    cont.innerHTML = '';
    cont.scrollTop = 0;
    window.scrollTo(0, 0);
    if (NS.store.hayDemo()) cont.appendChild(barraDemo());
    def.render(cont, param);
    NS.refrescarContadores();
  }

  function barraDemo() {
    return h('div.demobar', [
      NS.chip('demo', 'demo'),
      h('span', 'Hay datos de demostración cargados (oportunidades, propuestas, campañas y casos de ejemplo). ' +
                'La cartera institucional NO es demo: los nombres son reales y los campos vacíos se rellenan desde fuente oficial.'),
      h('span.sp', h('button.btn.sm', {
        onclick: function () {
          if (confirm('Se borrarán todas las filas marcadas como demo. La cartera y el cumplimiento se conservan. ¿Continuar?')) {
            NS.store.vaciarDemo(); pintar();
          }
        }
      }, 'Vaciar datos de demostración'))
    ]);
  }

  NS.repintar = pintar;

  NS.refrescarContadores = function () {
    var avisos = M.avisos().length, deuda = M.deuda().length;
    var set = function (v, n, warn) {
      var el = document.querySelector('.navlink[data-vista="' + v + '"] .cnt');
      if (!el) return;
      el.textContent = n || '';
      el.style.display = n ? '' : 'none';
      el.classList.toggle('warn', !!warn);
    };
    set('panel', avisos, avisos > 0);
    set('devolucion', deuda, deuda > 0);
  };

  /* ---------------------------------------------------------------- drawer
     `alCerrar` se dispara al cerrar: lo usan las fichas que editan en vivo
     (cartera, checklist de campaña) para que la tabla de debajo no quede
     mostrando datos viejos. */
  var alCerrarDrawer = null;

  NS.drawer = function (titulo, contenido, subtitulo, alCerrar) {
    NS.cerrarDrawer();
    alCerrarDrawer = alCerrar || null;
    var scrim = h('div.scrim', { onclick: NS.cerrarDrawer });
    var d = h('aside.drawer', { role: 'dialog', 'aria-label': titulo }, [
      h('div.drawer-head', [
        h('div', [h('h2', titulo), subtitulo ? h('div.hint', subtitulo) : null]),
        h('button.btn.gh', { style: 'margin-left:auto', onclick: NS.cerrarDrawer, 'aria-label': 'Cerrar' }, '✕')
      ]),
      h('div.drawer-body', contenido)
    ]);
    document.body.appendChild(scrim);
    document.body.appendChild(d);
  };
  NS.cerrarDrawer = function () {
    var habia = document.querySelector('.drawer');
    document.querySelectorAll('.scrim,.drawer').forEach(function (n) { n.remove(); });
    var cb = alCerrarDrawer;
    alCerrarDrawer = null;
    if (habia && cb) cb();
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') NS.cerrarDrawer(); });

  /* ---------------------------------------------------------------- arranque */
  NS.arrancar = function () {
    var st = NS.store.get();
    document.documentElement.setAttribute('data-lang', st.lang);
    construirNav();
    window.addEventListener('hashchange', pintar);
    pintar();
  };

  var GRUPOS = [
    { t: 'g_general',  items: [['panel', ''], ['calendario', '']] },
    { t: 'g_loop',     items: [['radar', '①'], ['propuestas', '②'], ['campanas', '③'],
                               ['evidencia', '④'], ['devolucion', '⑤'], ['casos', '⑥']] },
    { t: 'g_comercial',items: [['ofertas', ''], ['pedidos', ''], ['facturas', ''], ['tesoreria', '']] },
    { t: 'g_finanzas', items: [['gastos', ''], ['balance', ''], ['economico', '']] },
    { t: 'g_base',     items: [['cartera', ''], ['catalogo', '']] },
    { t: 'g_control',  items: [['cumplimiento', ''], ['ajustes', '']] }
  ];

  function construirNav() {
    var nav = document.getElementById('nav');
    nav.innerHTML = '';
    GRUPOS.forEach(function (g) {
      nav.appendChild(h('div.navgroup', NS.t(g.t)));
      g.items.forEach(function (it) {
        nav.appendChild(h('button.navlink', {
          'data-vista': it[0],
          onclick: function () { NS.ir(it[0]); }
        }, [
          h('span.st', it[1]),
          h('span', NS.t(it[0])),
          h('span.cnt', { style: 'display:none' })
        ]));
      });
    });
  }

  NS.cambiarIdioma = function (l) {
    var st = NS.store.get();
    st.lang = l; NS.store.save();
    document.documentElement.setAttribute('data-lang', l);
    document.querySelectorAll('.seg button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === l);
    });
    construirNav();
    pintar();
  };

})(window.INGURA);
