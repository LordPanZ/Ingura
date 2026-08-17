/* ============================================================================
   INGURA ERP · circuito comercial y financiero
   Ofertas · Pedidos · Facturas · Tesorería · Gastos · Balance

   La cadena: OFERTA → PEDIDO → FACTURA(s) por hitos → COBRO.
   Cada documento nace del anterior; ninguno se teclea dos veces.
   ========================================================================== */

(function (NS) {
  'use strict';
  var h = NS.h, fmt = NS.fmt, M = NS.metricas, S = NS.seed, F = NS.form, L = NS.seed.legal;

  function uid(p) { return p + '-' + Math.random().toString(36).slice(2, 8); }
  function guardar() { NS.store.save(); NS.repintar(); }
  function instituciones() {
    return NS.store.get().instituciones.map(function (i) { return i.nombre; }).sort();
  }
  function hoy() { return new Date().toISOString().slice(0, 10); }

  /** Siguiente número correlativo del ejercicio: 2026/007 */
  function siguienteNumero(coleccion, prefijo) {
    var anio = String(new Date().getFullYear());
    var n = NS.store.get()[coleccion].reduce(function (max, x) {
      var m = /(\d{4})\/(\d+)/.exec(x.numero || '');
      return (m && m[1] === anio) ? Math.max(max, Number(m[2])) : max;
    }, 0);
    return (prefijo || '') + anio + '/' + String(n + 1).padStart(3, '0');
  }

  /* ---------------------------------------------------- editor de líneas */
  function editorLineas(doc, alCambiar) {
    var caja = h('div');

    function pintar() {
      caja.innerHTML = '';
      doc.lineas.forEach(function (l, i) {
        caja.appendChild(h('div', {
          style: 'display:grid;grid-template-columns:1fr 4rem 6rem 4.5rem 1.8rem;gap:.35rem;align-items:center;margin-bottom:.35rem'
        }, [
          h('input', { type: 'text', value: l.concepto, placeholder: 'Concepto',
            onchange: function (e) { l.concepto = e.target.value; alCambiar(); } }),
          h('input', { type: 'number', value: l.cant, style: 'text-align:right', 'aria-label': 'Cantidad',
            onchange: function (e) { l.cant = Number(e.target.value) || 0; pintar(); alCambiar(); } }),
          h('input', { type: 'number', value: l.precio, style: 'text-align:right', 'aria-label': 'Precio unitario',
            onchange: function (e) { l.precio = Number(e.target.value) || 0; pintar(); alCambiar(); } }),
          (function () {
            var s = h('select', { 'aria-label': 'IVA', onchange: function (e) {
              l.iva = Number(e.target.value); pintar(); alCambiar();
            } });
            L.ivaTipos.forEach(function (t) {
              s.appendChild(h('option', { value: t, selected: t === l.iva }, t + ' %'));
            });
            return s;
          })(),
          h('button.btn.sm.gh', { title: 'Eliminar línea', onclick: function () {
            doc.lineas.splice(i, 1); pintar(); alCambiar();
          } }, '✕')
        ]));
      });
      caja.appendChild(h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-top:.5rem' }, [
        h('button.btn.sm', { onclick: function () {
          doc.lineas.push({ concepto: '', cant: 1, precio: 0, iva: L.ivaGeneral });
          pintar(); alCambiar();
        } }, '+ Línea'),
        (function () {
          var t = M.importes(doc);
          return h('div', { style: 'text-align:right;font-size:.8rem' }, [
            h('div', ['Base: ', h('b', fmt.eur(t.base))]),
            h('div.t-mut', ['IVA: ', fmt.eur(t.iva)]),
            h('div', { style: 'font-size:1rem;font-family:var(--display);color:var(--tierra-900)' },
              'Total ' + fmt.eur(t.total))
          ]);
        })()
      ]));
    }
    pintar();
    return caja;
  }

  /* ---------------------------------- aviso de umbral de contrato menor */
  function avisoContratoMenor(base) {
    if (base <= L.contratoMenor) return null;
    return h('div.note', [
      h('strong', 'Supera el contrato menor. '),
      'Con base imponible de ' + fmt.eur(base) + ' se pasa del límite de ' + fmt.eur(L.contratoMenor) +
      ' para servicios (Ley 9/2017, art. 118). Esta institución no puede adjudicarlo directamente: ' +
      'necesita procedimiento con publicidad, y INGURA necesita solvencia acreditada y el kit de licitación cerrado.'
    ]);
  }

  /* ======================================================================
     OFERTAS
     ==================================================================== */
  NS.vistas.ofertas = {
    eyebrow: 'La propuesta técnica, puesta en euros',
    titulo: 'Ofertas',
    render: function (c) {
      var st = NS.store.get();
      var abiertas = st.ofertas.filter(function (o) { return o.estado === 'enviada'; });
      var suma = function (arr) {
        return arr.reduce(function (s, o) { return s + M.importes(o).base; }, 0);
      };
      var aceptadas = st.ofertas.filter(function (o) { return o.estado === 'aceptada'; });
      var rechazadas = st.ofertas.filter(function (o) { return o.estado === 'rechazada'; });
      var resueltas = aceptadas.length + rechazadas.length;

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Ofertas vivas', num: abiertas.length,
                  foot: fmt.eur(suma(abiertas)) + ' de base imponible en juego' }),
        NS.tile({ lbl: 'Tasa de aceptación', num: resueltas ? Math.round((aceptadas.length / resueltas) * 100) : 0, unidad: '%',
                  meter: NS.meter(resueltas ? (aceptadas.length / resueltas) * 100 : 0, 40, 100, 'mayor', '', 'umbral 40 %'),
                  foot: 'sobre ' + resueltas + ' ofertas resueltas' }),
        NS.tile({ lbl: 'Importe medio', num: st.ofertas.length ? fmt.eur(Math.round(suma(st.ofertas) / st.ofertas.length)).replace(' €', '') : 0,
                  unidad: '€', foot: 'base imponible media' }),
        NS.tile({ lbl: 'Por encima del contrato menor', num: st.ofertas.filter(function (o) { return M.importes(o).base > L.contratoMenor; }).length,
                  foot: 'exigen licitación, no adjudicación directa' })
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [
            h('h2', 'Ofertas'),
            h('div.hint', 'El documento económico que recibe la institución. Nace de una propuesta técnica y, si se acepta, ' +
                          'se convierte en pedido sin volver a teclear nada.')
          ]),
          h('span.sp', h('button.btn.pri', { onclick: function () { editor(null); } }, '+ Oferta'))
        ]),
        st.ofertas.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Nº'), h('th', 'Institución'), h('th', 'Fecha'), h('th', 'Validez'),
                h('th.num', 'Base'), h('th.num', 'IVA'), h('th.num', 'Total'), h('th', 'Estado'), h('th', '')
              ])),
              h('tbody', st.ofertas.slice().sort(function (a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); })
                .map(function (o) {
                  var t = M.importes(o);
                  var caduca = o.estado === 'enviada' && o.validez && NS.dias(o.validez) > 0;
                  var tono = { borrador: '', enviada: 'naranja', aceptada: 'verde', rechazada: 'rojo', caducada: '' }[o.estado];
                  return h('tr.clic', { onclick: function () { editor(o); } }, [
                    h('td.t-strong', o.numero),
                    h('td', [o.institucion, o.demo ? NS.chip('demo', 'demo') : null]),
                    h('td.t-mut', fmt.fecha(o.fecha)),
                    h('td', caduca ? NS.sem('mal', 'caducada') : h('span.t-mut', fmt.fecha(o.validez))),
                    h('td.num', fmt.eur(t.base)),
                    h('td.num.t-mut', fmt.eur(t.iva)),
                    h('td.num.t-strong', fmt.eur(t.total)),
                    h('td', NS.chip(o.estado, tono)),
                    h('td', o.estado === 'aceptada' && !tienePedido(o)
                      ? h('button.btn.sm', { onclick: function (e) { e.stopPropagation(); aPedido(o); } }, '→ Pedido')
                      : null)
                  ]);
                }))
            ]))
          : NS.vacio('Sin ofertas', 'Una oferta es una propuesta técnica con precio, IVA y fecha de validez.')
      ]));

      function tienePedido(o) {
        return NS.store.get().pedidos.some(function (p) { return p.oferta === o.id; });
      }

      function aPedido(o) {
        var t = M.importes(o);
        NS.store.get().pedidos.unshift({
          id: uid('pd'), numero: siguienteNumero('pedidos', 'P-'), oferta: o.id, campana: null,
          institucion: o.institucion, fecha: hoy(),
          tipo: t.base > L.contratoMenor ? 'Procedimiento abierto simplificado' : 'Contrato menor',
          expediente: '', recurrente: false, dir3: { oc: '', og: '', ut: '' }, estado: 'abierto',
          hitos: [
            { nombre: 'Validación de contenidos (fase 3)', pct: 30, factura: null },
            { nombre: 'Mitad de ejecución (fase 5)',       pct: 40, factura: null },
            { nombre: 'Cierre y devolución (fase 6)',      pct: 30, factura: null }
          ]
        });
        NS.store.save(); NS.ir('pedidos');
      }

      function editor(o) {
        var nuevo = !o;
        o = o || { id: uid('of'), numero: siguienteNumero('ofertas'), institucion: instituciones()[0],
                   propuesta: null, fecha: hoy(), validez: NS.sumarDias(hoy(), 60), estado: 'borrador',
                   lineas: [{ concepto: '', cant: 1, precio: 0, iva: L.ivaGeneral }] };
        var aviso = h('div');
        var refrescar = function () {
          aviso.innerHTML = '';
          var n = avisoContratoMenor(M.importes(o).base);
          if (n) aviso.appendChild(n);
        };
        refrescar();

        var props = NS.store.get().propuestas.filter(function (p) { return p.institucion === o.institucion; });

        NS.drawer(nuevo ? 'Nueva oferta' : 'Oferta ' + o.numero, [
          h('div.card', [
            F.campo('Número', F.input('text', o.numero, function (v) { o.numero = v; })),
            F.campo('Institución', F.select(instituciones(), o.institucion, function (v) { o.institucion = v; })),
            F.campo('Fecha', F.input('date', o.fecha, function (v) { o.fecha = v; })),
            F.campo('Válida hasta', F.input('date', o.validez, function (v) { o.validez = v; })),
            F.campo('Estado', F.select(S.estadosOferta, o.estado, function (v) { o.estado = v; })),
            props.length ? F.campo('Propuesta técnica de origen', (function () {
              var s = h('select', { onchange: function (e) { o.propuesta = e.target.value || null; } });
              s.appendChild(h('option', { value: '' }, '—'));
              props.forEach(function (p) {
                s.appendChild(h('option', { value: p.id, selected: o.propuesta === p.id }, p.titulo));
              });
              return s;
            })()) : null
          ]),
          h('div.card', [
            h('h2', 'Líneas'),
            h('div.hint', 'Concepto · cantidad · precio unitario · IVA. Importes sin IVA en la columna de precio.'),
            editorLineas(o, refrescar)
          ]),
          aviso,
          h('div', { style: 'display:flex;gap:.5rem' }, [
            h('button.btn.pri', { onclick: function () {
              if (nuevo) NS.store.get().ofertas.unshift(o);
              NS.cerrarDrawer(); guardar();
            } }, 'Guardar'),
            !nuevo ? h('button.btn', { onclick: function () {
              if (!confirm('¿Eliminar esta oferta?')) return;
              var st2 = NS.store.get();
              st2.ofertas = st2.ofertas.filter(function (x) { return x.id !== o.id; });
              NS.cerrarDrawer(); guardar();
            } }, 'Eliminar') : null
          ])
        ], o.institucion);
      }
    }
  };

  /* ======================================================================
     PEDIDOS · el encargo o contrato adjudicado
     ==================================================================== */
  NS.vistas.pedidos = {
    eyebrow: 'Encargos, contratos y expedientes',
    titulo: 'Pedidos',
    render: function (c) {
      var st = NS.store.get();
      var vivos = st.pedidos.filter(function (p) { return p.estado !== 'anulado' && p.estado !== 'completado'; });
      var importe = function (p) {
        var o = st.ofertas.find(function (x) { return x.id === p.oferta; });
        return o ? M.importes(o).base : 0;
      };
      var cartera = vivos.reduce(function (s, p) { return s + importe(p); }, 0);
      var sinDir3 = st.pedidos.filter(function (p) { return !p.dir3 || !p.dir3.oc; });

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Pedidos vivos', num: vivos.length, foot: 'abiertos o en ejecución' }),
        NS.tile({ lbl: 'Cartera contratada', num: fmt.eur(Math.round(cartera)).replace(' €', ''), unidad: '€',
                  foot: 'base imponible pendiente de ejecutar' }),
        NS.tile({ lbl: 'Recurrentes', num: st.pedidos.filter(function (p) { return p.recurrente; }).length,
                  foot: 'bonos, acuerdos anuales y plurianuales' }),
        NS.tile({ lbl: 'Sin códigos DIR3', num: sinDir3.length, flag: sinDir3.length > 0,
                  foot: 'sin ellos la factura electrónica se rechaza' })
      ]));

      c.appendChild(h('div.note', [
        h('strong', 'Los códigos DIR3 se piden al firmar, no al facturar. '),
        'Oficina contable, órgano gestor y unidad tramitadora son obligatorios en la factura electrónica: si faltan, ' +
        'el punto de entrada la rechaza y el reloj de pago no arranca. Pedirlos cuando ya has emitido cuesta semanas.'
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [h('h2', 'Pedidos'), h('div.hint', 'Un pedido nace de una oferta aceptada y agrupa los hitos de facturación.')]),
          h('span.sp', h('button.btn.pri', { onclick: function () { editor(null); } }, '+ Pedido'))
        ]),
        st.pedidos.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Nº'), h('th', 'Institución'), h('th', 'Tipo'), h('th', 'Expediente'),
                h('th', 'DIR3'), h('th.num', 'Base'), h('th', 'Hitos facturados'), h('th', 'Estado')
              ])),
              h('tbody', st.pedidos.slice().sort(function (a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); })
                .map(function (p) {
                  var fact = (p.hitos || []).filter(function (x) { return x.factura; }).length;
                  var tot = (p.hitos || []).length;
                  return h('tr.clic', { onclick: function () { editor(p); } }, [
                    h('td.t-strong', p.numero),
                    h('td', [p.institucion, p.demo ? NS.chip('demo', 'demo') : null,
                             p.recurrente ? NS.chip('recurrente', 'verde') : null]),
                    h('td.t-mut', p.tipo),
                    h('td.t-mut', p.expediente || h('span.t-empty', '—')),
                    h('td', p.dir3 && p.dir3.oc ? NS.sem('ok', 'completos') : NS.sem('mal', 'faltan')),
                    h('td.num', fmt.eur(importe(p))),
                    h('td', fact + ' / ' + tot),
                    h('td', NS.chip(p.estado, p.estado === 'completado' ? 'verde' : 'naranja'))
                  ]);
                }))
            ]))
          : NS.vacio('Sin pedidos', 'Se generan desde una oferta aceptada.')
      ]));

      function editor(p) {
        var nuevo = !p;
        p = p || { id: uid('pd'), numero: siguienteNumero('pedidos', 'P-'), oferta: null, campana: null,
                   institucion: instituciones()[0], fecha: hoy(), tipo: 'Contrato menor', expediente: '',
                   recurrente: false, dir3: { oc: '', og: '', ut: '' }, estado: 'abierto',
                   hitos: [{ nombre: 'Ejecución completa', pct: 100, factura: null }] };
        p.dir3 = p.dir3 || { oc: '', og: '', ut: '' };
        var base = (function () {
          var o = st.ofertas.find(function (x) { return x.id === p.oferta; });
          return o ? M.importes(o).base : 0;
        })();

        var hitosCaja = h('div');
        function pintarHitos() {
          hitosCaja.innerHTML = '';
          var suma = 0;
          p.hitos.forEach(function (hi, i) {
            suma += Number(hi.pct) || 0;
            var f = st.facturas.find(function (x) { return x.id === hi.factura; });
            hitosCaja.appendChild(h('div', {
              style: 'display:grid;grid-template-columns:1fr 4rem 6rem auto;gap:.4rem;align-items:center;margin-bottom:.4rem'
            }, [
              h('input', { type: 'text', value: hi.nombre, onchange: function (e) { hi.nombre = e.target.value; } }),
              h('input', { type: 'number', value: hi.pct, style: 'text-align:right', 'aria-label': '% del hito',
                onchange: function (e) { hi.pct = Number(e.target.value) || 0; pintarHitos(); } }),
              h('span.t-mut', { style: 'font-size:.78rem;text-align:right' }, fmt.eur(base * (Number(hi.pct) || 0) / 100)),
              f ? NS.chip(f.numero, 'verde')
                : h('button.btn.sm', { onclick: function () { facturarHito(p, hi, base); } }, 'Facturar')
            ]));
          });
          hitosCaja.appendChild(h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-top:.4rem' }, [
            h('button.btn.sm', { onclick: function () {
              p.hitos.push({ nombre: '', pct: 0, factura: null }); pintarHitos();
            } }, '+ Hito'),
            suma === 100 ? NS.sem('ok', 'suman 100 %') : NS.sem('mal', 'suman ' + suma + ' %')
          ]));
        }
        pintarHitos();

        NS.drawer(nuevo ? 'Nuevo pedido' : 'Pedido ' + p.numero, [
          h('div.card', [
            F.campo('Número', F.input('text', p.numero, function (v) { p.numero = v; })),
            F.campo('Institución', F.select(instituciones(), p.institucion, function (v) { p.institucion = v; })),
            F.campo('Fecha de adjudicación', F.input('date', p.fecha, function (v) { p.fecha = v; })),
            F.campo('Tipo de contrato', F.select(L.tiposContrato, p.tipo, function (v) { p.tipo = v; })),
            F.campo('Nº de expediente', F.input('text', p.expediente, function (v) { p.expediente = v; })),
            F.campo('Estado', F.select(S.estadosPedido, p.estado, function (v) { p.estado = v; })),
            F.campo('Ingreso recurrente', F.checkbox(p.recurrente,
              'Bono, acuerdo anual o plurianual (cuenta para el umbral del 30 %)',
              function (v) { p.recurrente = v; }))
          ]),
          h('div.card', [
            h('h2', 'Códigos DIR3'),
            h('div.hint', 'Obligatorios en la factura electrónica. Se piden a la persona técnica al firmar el encargo.'),
            F.campo('Oficina contable (OC)', F.input('text', p.dir3.oc, function (v) { p.dir3.oc = v; })),
            F.campo('Órgano gestor (OG)', F.input('text', p.dir3.og, function (v) { p.dir3.og = v; })),
            F.campo('Unidad tramitadora (UT)', F.input('text', p.dir3.ut, function (v) { p.dir3.ut = v; }))
          ]),
          h('div.card', [
            h('h2', 'Hitos de facturación'),
            h('div.hint', 'Base del pedido: ' + fmt.eur(base) + '. La medida más eficaz contra el riesgo de tesorería, ' +
                          'y la más olvidada: 30 % a la validación, 40 % a mitad de ejecución, 30 % al cierre.'),
            hitosCaja
          ]),
          base > L.contratoMenor && p.tipo === 'Contrato menor' ? avisoContratoMenor(base) : null,
          h('div', { style: 'display:flex;gap:.5rem' }, [
            h('button.btn.pri', { onclick: function () {
              if (nuevo) NS.store.get().pedidos.unshift(p);
              NS.cerrarDrawer(); guardar();
            } }, 'Guardar'),
            !nuevo ? h('button.btn', { onclick: function () {
              if (!confirm('¿Eliminar este pedido?')) return;
              var st2 = NS.store.get();
              st2.pedidos = st2.pedidos.filter(function (x) { return x.id !== p.id; });
              NS.cerrarDrawer(); guardar();
            } }, 'Eliminar') : null
          ])
        ], p.institucion + ' · ' + p.tipo);
      }

      function facturarHito(p, hi, base) {
        var f = {
          id: uid('fa'), serie: 'A', numero: siguienteNumero('facturas'), pedido: p.id,
          institucion: p.institucion, concepto: hi.nombre, fecha: hoy(),
          base: Math.round(base * (Number(hi.pct) || 0) / 100 * 100) / 100, iva: L.ivaGeneral,
          estado: 'emitida', punto: '', registro: '', fechaRegistro: '', fechaConformidad: '', fechaCobro: ''
        };
        NS.store.get().facturas.unshift(f);
        hi.factura = f.id;
        NS.store.save(); NS.cerrarDrawer(); NS.ir('facturas');
      }
    }
  };

  /* ======================================================================
     FACTURAS
     ==================================================================== */
  NS.vistas.facturas = {
    eyebrow: 'El reloj legal arranca con el registro, no con la emisión',
    titulo: 'Facturas',
    render: function (c) {
      var st = NS.store.get(), fin = M.finanzas();

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Facturado ' + fin.anio, num: fmt.eur(Math.round(fin.ingresos)).replace(' €', ''), unidad: '€',
                  foot: 'base imponible del ejercicio' }),
        NS.tile({ lbl: 'Pendiente de cobro', num: fmt.eur(Math.round(fin.pendiente)).replace(' €', ''), unidad: '€',
                  flag: fin.pendiente > 0, foot: 'IVA incluido' }),
        NS.tile({ lbl: 'Sin registrar', num: fin.atascadas.length, flag: fin.atascadas.length > 0,
                  foot: 'emitidas hace más de 15 días y nunca registradas' }),
        NS.tile({ lbl: 'Días medios de cobro', num: fin.diasMediosCobro === null ? '—' : Math.round(fin.diasMediosCobro),
                  unidad: fin.diasMediosCobro === null ? '' : ' d',
                  meter: fin.diasMediosCobro === null ? null : NS.meter(fin.diasMediosCobro, 60, 150, 'menor', '', 'umbral < 60 d'),
                  foot: 'de emisión a cobro efectivo' })
      ]));

      if (fin.atascadas.length) {
        c.appendChild(h('div.note', [
          h('strong', 'El retraso más habitual no es de pago, es de registro. '),
          fin.atascadas.length + (fin.atascadas.length === 1 ? ' factura emitida sigue' : ' facturas emitidas siguen') +
          ' sin registrar en ningún punto electrónico. Mientras no se registren, la administración no las ha recibido, ' +
          'el plazo legal no corre y no se pueden reclamar intereses.'
        ]));
      }

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [
            h('h2', 'Facturas emitidas'),
            h('div.hint', 'El camino completo: emitida → registrada → conformada → cobrada. ' +
                          L.formato + ' · plazo legal ' + L.plazoConformidad + ' + ' + L.plazoPago + ' días.')
          ]),
          h('span.sp', h('button.btn.pri', { onclick: function () { editor(null); } }, '+ Factura'))
        ]),
        st.facturas.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Nº'), h('th', 'Institución'), h('th', 'Concepto'), h('th', 'Fecha'),
                h('th.num', 'Base'), h('th.num', 'Total'), h('th', 'Camino'), h('th', 'Vence'), h('th', 'Situación')
              ])),
              h('tbody', st.facturas.slice().sort(function (a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); })
                .map(function (f) {
                  var d = M.factura(f);
                  return h('tr.clic', { onclick: function () { editor(f); } }, [
                    h('td.t-strong', f.serie + ' ' + f.numero),
                    h('td', [f.institucion, f.demo ? NS.chip('demo', 'demo') : null]),
                    h('td.t-mut', { style: 'max-width:22ch' }, f.concepto),
                    h('td.t-mut', fmt.fecha(f.fecha)),
                    h('td.num', fmt.eur(d.base)),
                    h('td.num.t-strong', fmt.eur(d.total)),
                    h('td', camino(f)),
                    h('td.t-mut', d.vencimiento ? fmt.fecha(d.vencimiento) : h('span.t-empty', 'sin arrancar')),
                    h('td', situacion(f, d))
                  ]);
                }))
            ]))
          : NS.vacio('Sin facturas', 'Se generan desde los hitos de un pedido.')
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Cómo se factura a una administración vasca'),
        h('div.hint', 'Resumen operativo. No sustituye al asesoramiento fiscal.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Paso'), h('th', 'Qué hay que tener'), h('th', 'Plazo')])),
          h('tbody', [
            ['1 · Emitir', 'Serie y número correlativo, base, IVA, datos del pedido y expediente', 'El mismo día del cierre'],
            ['2 · Registrar', 'Formato ' + L.formato + ' firmado, códigos DIR3 (OC, OG, UT) y punto de entrada correcto', 'Inmediato: aquí arranca el reloj'],
            ['3 · Conformidad', 'La unidad tramitadora da el visto bueno a la prestación', L.plazoConformidad + ' días desde el registro'],
            ['4 · Pago', 'Transferencia', L.plazoPago + ' días desde la conformidad'],
            ['5 · Demora', 'Interés = tipo BCE + ' + L.interesDemoraPuntos + ' puntos (Ley 3/2004)', 'Automático, sin necesidad de reclamar']
          ].map(function (r) { return h('tr', [h('td.t-strong', r[0]), h('td.t-mut', r[1]), h('td', r[2])]); }))
        ])),
        h('div.note', [
          'Obligación de factura electrónica a las AAPP (Ley 25/2013). Muchas entidades excluyen las de importe igual o ' +
          'inferior a ' + fmt.eur(L.umbralFacturaElectronica) + ', pero el criterio lo fija cada entidad: confirmarlo por escrito ' +
          'al firmar el encargo, junto con los DIR3 y el punto de entrada.'
        ])
      ]));

      function camino(f) {
        var pasos = [['emitida', 'E'], ['registrada', 'R'], ['conformada', 'C'], ['cobrada', '€']];
        var idx = S.estadosFactura.indexOf(f.estado);
        if (f.estado === 'rechazada') return NS.chip('rechazada', 'rojo');
        return h('div', { style: 'display:flex;gap:2px' }, pasos.map(function (p, i) {
          return h('span', {
            title: p[0],
            style: 'width:17px;height:17px;border-radius:4px;display:grid;place-items:center;font-size:.62rem;font-weight:700;' +
                   (i <= idx ? 'background:var(--verde);color:#fff' : 'background:color-mix(in srgb,var(--tierra) 12%,transparent);color:var(--gris)')
          }, p[1]);
        }));
      }
      function situacion(f, d) {
        if (d.cobrada) return NS.sem('ok', 'cobrada' + (d.diasCobro !== null ? ' · ' + d.diasCobro + ' d' : ''));
        if (d.atascada) return NS.sem('mal', 'sin registrar · ' + d.diasSinRegistrar + ' d');
        if (d.retraso > 0) return NS.sem('mal', 'vencida ' + d.retraso + ' d');
        if (!d.arrancado) return NS.sem('ambar', 'sin registrar');
        return NS.sem('ok', 'en plazo');
      }

      function editor(f) {
        var nuevo = !f;
        f = f || { id: uid('fa'), serie: 'A', numero: siguienteNumero('facturas'), pedido: null,
                   institucion: instituciones()[0], concepto: '', fecha: hoy(), base: 0, iva: L.ivaGeneral,
                   estado: 'emitida', punto: '', registro: '', fechaRegistro: '', fechaConformidad: '', fechaCobro: '' };

        var resumen = h('div');
        function refrescar() {
          var d = M.factura(f);
          resumen.innerHTML = '';
          resumen.appendChild(h('dl.kv', [
            h('dt', 'Base'), h('dd', fmt.eur(d.base)),
            h('dt', 'IVA ' + f.iva + ' %'), h('dd', fmt.eur(d.iva)),
            h('dt', 'Total'), h('dd', h('b', fmt.eur(d.total))),
            h('dt', 'Vencimiento legal'), h('dd', d.vencimiento
              ? fmt.fecha(d.vencimiento) + (d.retraso > 0 ? ' · vencida hace ' + d.retraso + ' días' : '')
              : 'no ha arrancado: falta el registro'),
            d.interes > 0 ? h('dt', 'Interés de demora') : null,
            d.interes > 0 ? h('dd', fmt.eur(Math.round(d.interes * 100) / 100) +
              ' (tipo BCE ' + NS.store.get().tipoBCE + ' % + ' + L.interesDemoraPuntos + ' puntos)') : null
          ]));
          if (d.atascada) {
            resumen.appendChild(h('div.note', [
              h('strong', 'Sin registrar desde hace ' + d.diasSinRegistrar + ' días. '),
              'Para la administración esta factura no existe. Registrarla hoy en el punto de entrada correcto.'
            ]));
          }
        }
        refrescar();

        NS.drawer(nuevo ? 'Nueva factura' : 'Factura ' + f.serie + ' ' + f.numero, [
          h('div.card', [
            h('div', { style: 'display:grid;grid-template-columns:4rem 1fr;gap:.5rem' }, [
              F.campo('Serie', F.input('text', f.serie, function (v) { f.serie = v; })),
              F.campo('Número', F.input('text', f.numero, function (v) { f.numero = v; }))
            ]),
            F.campo('Institución', F.select(instituciones(), f.institucion, function (v) { f.institucion = v; })),
            F.campo('Concepto', F.input('text', f.concepto, function (v) { f.concepto = v; })),
            F.campo('Fecha de emisión', F.input('date', f.fecha, function (v) { f.fecha = v; refrescar(); })),
            F.campo('Base imponible (€)', F.input('number', f.base, function (v) { f.base = Number(v) || 0; refrescar(); })),
            F.campo('IVA (%)', F.select(L.ivaTipos.map(String), String(f.iva), function (v) { f.iva = Number(v); refrescar(); })),
            F.campo('Estado', F.select(S.estadosFactura, f.estado, function (v) { f.estado = v; refrescar(); }))
          ]),
          h('div.card', [
            h('h2', 'Registro electrónico'),
            h('div.hint', 'Sin esto, el plazo legal no corre.'),
            F.campo('Punto de entrada', F.select([''].concat(L.puntosRegistro), f.punto, function (v) { f.punto = v; })),
            F.campo('Nº de registro', F.input('text', f.registro, function (v) { f.registro = v; })),
            F.campo('Fecha de registro', F.input('date', f.fechaRegistro, function (v) { f.fechaRegistro = v; refrescar(); })),
            F.campo('Fecha de conformidad', F.input('date', f.fechaConformidad, function (v) { f.fechaConformidad = v; refrescar(); })),
            F.campo('Fecha de cobro', F.input('date', f.fechaCobro, function (v) {
              f.fechaCobro = v; if (v) f.estado = 'cobrada'; refrescar();
            }))
          ]),
          h('div.card', [h('h2', 'Situación'), resumen]),
          h('div', { style: 'display:flex;gap:.5rem' }, [
            h('button.btn.pri', { onclick: function () {
              if (nuevo) NS.store.get().facturas.unshift(f);
              NS.cerrarDrawer(); guardar();
            } }, 'Guardar'),
            !nuevo ? h('button.btn', { onclick: function () {
              if (!confirm('¿Eliminar esta factura?')) return;
              var st2 = NS.store.get();
              st2.facturas = st2.facturas.filter(function (x) { return x.id !== f.id; });
              st2.pedidos.forEach(function (p) {
                (p.hitos || []).forEach(function (hi) { if (hi.factura === f.id) hi.factura = null; });
              });
              NS.cerrarDrawer(); guardar();
            } }, 'Eliminar') : null
          ])
        ], f.institucion);
      }
    }
  };

  /* ======================================================================
     TESORERÍA
     ==================================================================== */
  NS.vistas.tesoreria = {
    eyebrow: 'El riesgo que mata empresas con buena cartera',
    titulo: 'Tesorería',
    render: function (c) {
      var st = NS.store.get(), fin = M.finanzas();
      var pendientes = st.facturas.filter(function (f) {
        return f.estado !== 'cobrada' && f.estado !== 'rechazada';
      });

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Pendiente de cobro', num: fmt.eur(Math.round(fin.pendiente)).replace(' €', ''), unidad: '€',
                  foot: pendientes.length + ' facturas · IVA incluido' }),
        NS.tile({ lbl: 'Vencido', num: fmt.eur(Math.round(fin.aging.d30 + fin.aging.d60 + fin.aging.d90)).replace(' €', ''),
                  unidad: '€', flag: fin.vencidas.length > 0, foot: fin.vencidas.length + ' facturas fuera de plazo legal' }),
        NS.tile({ lbl: 'Interés de demora devengado', num: fmt.eur(Math.round(fin.interesDemora)).replace(' €', ''), unidad: '€',
                  foot: 'es un derecho; reclamarlo con corrección no daña la relación técnica' }),
        NS.tile({ lbl: 'Pendiente de pagar', num: fmt.eur(Math.round(fin.gastoPendiente)).replace(' €', ''), unidad: '€',
                  foot: 'facturas de proveedor sin pagar' })
      ]));

      /* --- aging: serie única, rampa secuencial de un solo tono ---------- */
      var tramos = [
        { k: 'd0',  nom: 'En plazo',        v: fin.aging.d0,  tono: 'var(--seq-2)' },
        { k: 'd30', nom: 'Vencido 1-30 d',  v: fin.aging.d30, tono: 'var(--seq-3)' },
        { k: 'd60', nom: 'Vencido 31-60 d', v: fin.aging.d60, tono: 'var(--seq-4)' },
        { k: 'd90', nom: 'Vencido +60 d',   v: fin.aging.d90, tono: 'var(--seq-5)' }
      ];
      var maxT = Math.max.apply(null, tramos.map(function (t) { return t.v; }).concat([1]));

      c.appendChild(h('div.grid.g2', [
        h('div.card', [
          h('h2', 'Antigüedad de la deuda'),
          h('div.hint', 'Importe pendiente por tramos de retraso sobre el vencimiento legal.'),
          h('div', { style: 'display:flex;flex-direction:column;gap:.55rem;margin-top:.6rem' },
            tramos.map(function (t) {
              return h('div', [
                h('div', { style: 'display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.2rem' }, [
                  h('span', t.nom),
                  h('b', { style: 'font-variant-numeric:tabular-nums' }, fmt.eur(Math.round(t.v)))
                ]),
                h('div', { style: 'height:8px;border-radius:99px;background:color-mix(in srgb,var(--tierra) 10%,transparent)' },
                  h('div', { style: 'height:100%;border-radius:99px;width:' + ((t.v / maxT) * 100) + '%;background:' + t.tono }))
              ]);
            }))
        ]),
        h('div.card', [
          h('h2', 'Facturación por trimestre'),
          h('div.hint', 'Estacionalidad real del ejercicio ' + fin.anio + '. Umbral: pico / valle por debajo de 2,5.'),
          (function () {
            var max = Math.max.apply(null, fin.porTrimestre.concat([1]));
            return h('div.bars', fin.porTrimestre.map(function (v, i) {
              return h('div.b', [
                h('div.tip', 'T' + (i + 1) + ' · ' + fmt.eur(Math.round(v))),
                h('i', { style: 'height:' + Math.round((v / max) * 100) + '%' }),
                h('em', 'T' + (i + 1))
              ]);
            }));
          })(),
          h('div', { style: 'margin-top:.6rem;font-size:.8rem' },
            fin.estacionalidad === null
              ? h('span.t-mut', 'Hacen falta al menos dos trimestres con facturación.')
              : NS.sem(fin.estacionalidad <= 2.5 ? 'ok' : 'mal',
                       'ratio pico / valle: ' + fin.estacionalidad.toFixed(1) + '×'))
        ])
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Cobros pendientes'),
        pendientes.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Factura'), h('th', 'Institución'), h('th', 'Emitida'), h('th', 'Registrada'),
                h('th', 'Vence'), h('th.num', 'Total'), h('th.num', 'Demora'), h('th', 'Situación')
              ])),
              h('tbody', pendientes.map(function (f) {
                var d = M.factura(f);
                return h('tr.clic', { onclick: function () { NS.ir('facturas'); } }, [
                  h('td.t-strong', f.serie + ' ' + f.numero),
                  h('td', f.institucion),
                  h('td.t-mut', fmt.fecha(f.fecha)),
                  h('td', f.fechaRegistro ? h('span.t-mut', fmt.fecha(f.fechaRegistro)) : NS.sem('mal', 'nunca')),
                  h('td.t-mut', d.vencimiento ? fmt.fecha(d.vencimiento) : '—'),
                  h('td.num.t-strong', fmt.eur(d.total)),
                  h('td.num', d.interes > 0 ? fmt.eur(Math.round(d.interes * 100) / 100) : h('span.t-empty', '—')),
                  h('td', d.atascada ? NS.sem('mal', 'sin registrar')
                        : d.retraso > 0 ? NS.sem('mal', d.retraso + ' d')
                        : NS.sem('ok', 'en plazo'))
                ]);
              }))
            ]))
          : NS.vacio('Nada pendiente', 'Todo lo emitido está cobrado.')
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Medidas, por orden de eficacia'),
        h('ol', { style: 'margin:0;padding-left:1.2rem;font-size:.85rem;line-height:1.8' }, [
          h('li', [h('b', 'Hitos de facturación en la propuesta.'), ' Se configuran en cada pedido.']),
          h('li', 'Colchón de tesorería equivalente a la campaña más grande en curso.'),
          h('li', 'Facturar el mismo día del cierre, con la documentación completa.'),
          h('li', [h('b', 'Registrar en el punto electrónico correcto.'), ' El retraso más habitual no es de pago, es de registro.']),
          h('li', 'Póliza de crédito preventiva, aunque no se use.'),
          h('li', 'Confirming de la diputación cuando esté disponible.'),
          h('li', 'Reclamar intereses de demora cuando proceda.')
        ])
      ]));
    }
  };

  /* ======================================================================
     GASTOS
     ==================================================================== */
  NS.vistas.gastos = {
    eyebrow: 'Lo que se paga antes de cobrar',
    titulo: 'Gastos',
    render: function (c) {
      var st = NS.store.get(), fin = M.finanzas();
      var cats = S.categoriasGasto;

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Gasto ' + fin.anio, num: fmt.eur(Math.round(fin.gastos)).replace(' €', ''), unidad: '€',
                  foot: 'base imponible' }),
        NS.tile({ lbl: 'Imputado a campañas', num: fmt.eur(Math.round(
                    st.gastos.filter(function (g) { return g.campana; })
                      .reduce(function (s, g) { return s + M.importes(g).base; }, 0))).replace(' €', ''), unidad: '€',
                  foot: 'coste directo de campaña' }),
        NS.tile({ lbl: 'Estructura', num: fmt.eur(Math.round(
                    st.gastos.filter(function (g) { return !g.campana; })
                      .reduce(function (s, g) { return s + M.importes(g).base; }, 0))).replace(' €', ''), unidad: '€',
                  foot: 'no imputable a una campaña concreta' }),
        NS.tile({ lbl: 'Sin pagar', num: fmt.eur(Math.round(fin.gastoPendiente)).replace(' €', ''), unidad: '€',
                  foot: 'facturas de proveedor pendientes' })
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [h('h2', 'Gastos'), h('div.hint', 'Categorías alineadas con los siete componentes de coste. ' +
                    'Imputar a campaña es lo que permite conocer el margen real de cada una.')]),
          h('span.sp', h('button.btn.pri', { onclick: function () { editor(null); } }, '+ Gasto'))
        ]),
        st.gastos.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Fecha'), h('th', 'Proveedor'), h('th', 'Concepto'), h('th', 'Categoría'),
                h('th', 'Campaña'), h('th.num', 'Base'), h('th.num', 'Total'), h('th', 'Pagado')
              ])),
              h('tbody', st.gastos.slice().sort(function (a, b) { return (b.fecha || '').localeCompare(a.fecha || ''); })
                .map(function (g) {
                  var d = M.importes(g);
                  var cat = cats.find(function (x) { return x.id === g.categoria; });
                  var cp = st.campanas.find(function (x) { return x.id === g.campana; });
                  return h('tr.clic', { onclick: function () { editor(g); } }, [
                    h('td.t-mut', fmt.fecha(g.fecha)),
                    h('td.t-strong', [g.proveedor, g.demo ? NS.chip('demo', 'demo') : null]),
                    h('td.t-mut', g.concepto),
                    h('td', NS.chip(cat ? cat.nombre : g.categoria, cat && cat.imputable ? 'verde' : '')),
                    h('td.t-mut', cp ? cp.institucion + ' · ' + cp.titulo : h('span.t-empty', 'estructura')),
                    h('td.num', fmt.eur(d.base)),
                    h('td.num.t-strong', fmt.eur(d.total)),
                    h('td', g.pagado ? NS.sem('ok', 'sí') : NS.sem('ambar', 'no'))
                  ]);
                }))
            ]))
          : NS.vacio('Sin gastos', 'Sin gastos registrados no hay margen real ni resultado.')
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Gasto por categoría'),
        (function () {
          var max = Math.max.apply(null, cats.map(function (k) { return fin.porCategoria[k.id] || 0; }).concat([1]));
          return h('div', { style: 'display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem' },
            cats.map(function (k) {
              var v = fin.porCategoria[k.id] || 0;
              return h('div', [
                h('div', { style: 'display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.2rem' }, [
                  h('span', [k.nombre, ' ', k.imputable ? NS.chip('imputable', 'verde') : null]),
                  h('b', { style: 'font-variant-numeric:tabular-nums' }, fmt.eur(Math.round(v)))
                ]),
                h('div', { style: 'height:8px;border-radius:99px;background:color-mix(in srgb,var(--tierra) 10%,transparent)' },
                  h('div', { style: 'height:100%;border-radius:99px;width:' + ((v / max) * 100) + '%;background:var(--seq-4)' }))
              ]);
            }));
        })()
      ]));

      function editor(g) {
        var nuevo = !g;
        g = g || { id: uid('ga'), fecha: hoy(), proveedor: '', categoria: cats[0].id, concepto: '',
                   base: 0, iva: L.ivaGeneral, campana: null, pagado: false };
        var campanas = st.campanas;

        NS.drawer(nuevo ? 'Nuevo gasto' : g.proveedor, [
          h('div.card', [
            F.campo('Fecha', F.input('date', g.fecha, function (v) { g.fecha = v; })),
            F.campo('Proveedor', F.input('text', g.proveedor, function (v) { g.proveedor = v; })),
            F.campo('Concepto', F.input('text', g.concepto, function (v) { g.concepto = v; })),
            F.campo('Categoría', (function () {
              var s = h('select', { onchange: function (e) { g.categoria = e.target.value; } });
              cats.forEach(function (k) {
                s.appendChild(h('option', { value: k.id, selected: k.id === g.categoria }, k.nombre));
              });
              return s;
            })()),
            F.campo('Base imponible (€)', F.input('number', g.base, function (v) { g.base = Number(v) || 0; })),
            F.campo('IVA (%)', F.select(L.ivaTipos.map(String), String(g.iva), function (v) { g.iva = Number(v); })),
            F.campo('Imputar a campaña', (function () {
              var s = h('select', { onchange: function (e) { g.campana = e.target.value || null; } });
              s.appendChild(h('option', { value: '' }, 'Estructura (no imputable)'));
              campanas.forEach(function (x) {
                s.appendChild(h('option', { value: x.id, selected: g.campana === x.id }, x.institucion + ' · ' + x.titulo));
              });
              return s;
            })()),
            F.campo('Pagado', F.checkbox(g.pagado, 'La factura del proveedor está pagada', function (v) { g.pagado = v; }))
          ]),
          h('div', { style: 'display:flex;gap:.5rem' }, [
            h('button.btn.pri', { onclick: function () {
              if (nuevo) NS.store.get().gastos.unshift(g);
              NS.cerrarDrawer(); guardar();
            } }, 'Guardar'),
            !nuevo ? h('button.btn', { onclick: function () {
              if (!confirm('¿Eliminar este gasto?')) return;
              var st2 = NS.store.get();
              st2.gastos = st2.gastos.filter(function (x) { return x.id !== g.id; });
              NS.cerrarDrawer(); guardar();
            } }, 'Eliminar') : null
          ])
        ]);
      }
    }
  };

  /* ======================================================================
     BALANCE · resultado, IVA y situación
     ==================================================================== */
  NS.vistas.balance = {
    eyebrow: 'Resultado, IVA y situación patrimonial',
    titulo: 'Balance',
    render: function (c) {
      var st = NS.store.get(), fin = M.finanzas();

      c.appendChild(h('div.note', [
        h('strong', 'Cifras de gestión, no cuentas anuales. '),
        'Se calculan sobre las facturas y los gastos introducidos aquí, por fecha de emisión. No sustituyen a la ' +
        'contabilidad de la asesoría: sirven para decidir precios, capacidad y tesorería sin esperar al cierre.'
      ]));

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Ingresos ' + fin.anio, num: fmt.eur(Math.round(fin.ingresos)).replace(' €', ''), unidad: '€',
                  foot: 'base imponible facturada' }),
        NS.tile({ lbl: 'Gastos', num: fmt.eur(Math.round(fin.gastos)).replace(' €', ''), unidad: '€',
                  foot: 'base imponible' }),
        NS.tile({ lbl: 'Resultado', num: fmt.eur(Math.round(fin.resultado)).replace(' €', ''), unidad: '€',
                  flag: fin.resultado < 0, foot: 'antes de impuestos' }),
        NS.tile({ lbl: 'Margen', num: Math.round(fin.margen), unidad: '%',
                  meter: NS.meter(fin.margen, 35, 100, 'mayor', '', 'suelo 35 %'),
                  foot: 'resultado sobre ingresos' })
      ]));

      /* --- cuenta de resultados ----------------------------------------- */
      c.appendChild(h('div.grid.g2', [
        h('div.card', [
          h('h2', 'Cuenta de resultados'),
          h('div.tw', h('table', [
            h('tbody', [].concat(
              [h('tr', [h('td.t-strong', 'Ingresos por prestación de servicios'), h('td.num.t-strong', fmt.eur(Math.round(fin.ingresos)))])],
              S.categoriasGasto.map(function (k) {
                var v = fin.porCategoria[k.id] || 0;
                if (!v) return null;
                return h('tr', [h('td.t-mut', { style: 'padding-left:1rem' }, '− ' + k.nombre), h('td.num.t-mut', fmt.eur(Math.round(v)))]);
              }).filter(Boolean),
              [h('tr', { style: 'border-top:2px solid var(--tierra-900)' }, [
                h('td.t-strong', 'Resultado antes de impuestos'),
                h('td.num.t-strong', { style: 'color:' + (fin.resultado < 0 ? 'var(--st-mal)' : 'var(--verde-900)') },
                  fmt.eur(Math.round(fin.resultado)))
              ])]
            ))
          ]))
        ]),
        h('div.card', [
          h('h2', 'IVA del ejercicio'),
          h('div.hint', 'Repercutido menos soportado. Por fecha de emisión, criterio de devengo.'),
          h('div.tw', h('table', [
            h('tbody', [
              h('tr', [h('td', 'IVA repercutido (facturas emitidas)'), h('td.num', fmt.eur(Math.round(fin.ivaRepercutido)))]),
              h('tr', [h('td', 'IVA soportado (gastos)'), h('td.num', fmt.eur(Math.round(fin.ivaSoportado)))]),
              h('tr', { style: 'border-top:2px solid var(--tierra-900)' }, [
                h('td.t-strong', fin.ivaLiquidar >= 0 ? 'A ingresar' : 'A compensar'),
                h('td.num.t-strong', fmt.eur(Math.round(Math.abs(fin.ivaLiquidar))))
              ])
            ]
          )])),
          h('div.note', 'El IVA cobrado no es dinero de INGURA: se ingresa cada trimestre. Descontarlo mentalmente ' +
                        'de la tesorería disponible evita el error de tesorería más común en empresa pequeña.')
        ])
      ]));

      /* --- situación ----------------------------------------------------- */
      var clientes = fin.pendiente, proveedores = fin.gastoPendiente;
      c.appendChild(h('div.grid.g2', [
        h('div.card', [
          h('h2', 'Situación'),
          h('div.hint', 'Saldos calculados a partir de lo introducido. La tesorería inicial se fija en Ajustes.'),
          h('div.tw', h('table', [
            h('thead', h('tr', [h('th', 'Concepto'), h('th.num', 'Importe')])),
            h('tbody', [
              h('tr', [h('td.t-strong', 'Clientes (facturas pendientes de cobro)'), h('td.num', fmt.eur(Math.round(clientes)))]),
              h('tr', [h('td.t-strong', 'Tesorería estimada'), h('td.num', fmt.eur(Math.round(fin.tesoreria)))]),
              h('tr', [h('td.t-strong', 'Proveedores (pendientes de pago)'), h('td.num', fmt.eur(Math.round(proveedores)))]),
              h('tr', [h('td.t-strong', 'Hacienda por IVA'), h('td.num', fmt.eur(Math.round(Math.max(0, fin.ivaLiquidar))))]),
              h('tr', { style: 'border-top:2px solid var(--tierra-900)' }, [
                h('td.t-strong', 'Posición neta'),
                h('td.num.t-strong', fmt.eur(Math.round(clientes + fin.tesoreria - proveedores - Math.max(0, fin.ivaLiquidar))))
              ])
            ])
          ]))
        ]),
        h('div.card', [
          h('h2', 'Concentración de clientes'),
          h('div.hint', 'Ningún cliente debería pasar del 25 % de la facturación: un cambio de corporación no puede poner ' +
                        'en riesgo el año.'),
          (function () {
            var ks = Object.keys(fin.porCliente).sort(function (a, b) { return fin.porCliente[b] - fin.porCliente[a]; });
            if (!ks.length) return NS.vacio('Sin facturación', 'Todavía no hay facturas en el ejercicio.');
            return h('div', { style: 'display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem' },
              ks.map(function (k) {
                var pct = (fin.porCliente[k] / fin.ingresos) * 100;
                return h('div', [
                  h('div', { style: 'display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:.2rem' }, [
                    h('span', k),
                    h('b', { style: 'font-variant-numeric:tabular-nums' }, Math.round(pct) + ' % · ' + fmt.eur(Math.round(fin.porCliente[k])))
                  ]),
                  h('div', { style: 'height:8px;border-radius:99px;background:color-mix(in srgb,var(--tierra) 10%,transparent)' },
                    h('div', { style: 'height:100%;border-radius:99px;width:' + pct + '%;background:' +
                                      (pct > 25 ? 'var(--st-mal)' : 'var(--seq-4)') }))
                ]);
              }));
          })()
        ])
      ]));

      /* --- margen real por campaña --------------------------------------- */
      c.appendChild(h('div.card', [
        h('h2', 'Margen real por campaña'),
        h('div.hint', 'Facturado menos gasto imputado. Sólo aparecen las campañas con gasto imputado: sin imputar, ' +
                      'el margen es una suposición.'),
        (function () {
          var filas = st.campanas.map(function (cp) {
            var facturado = st.facturas.filter(function (f) {
              var p = st.pedidos.find(function (x) { return x.id === f.pedido; });
              return p && p.campana === cp.id && f.estado !== 'rechazada';
            }).reduce(function (s, f) { return s + M.importes(f).base; }, 0);
            var coste = st.gastos.filter(function (g) { return g.campana === cp.id; })
                          .reduce(function (s, g) { return s + M.importes(g).base; }, 0);
            return { cp: cp, facturado: facturado, coste: coste, margen: facturado - coste,
                     pct: facturado ? ((facturado - coste) / facturado) * 100 : null };
          }).filter(function (r) { return r.coste > 0 || r.facturado > 0; });

          if (!filas.length) return NS.vacio('Sin datos', 'Imputa gastos a una campaña para ver su margen real.');
          return h('div.tw', h('table', [
            h('thead', h('tr', [
              h('th', 'Campaña'), h('th.num', 'Facturado'), h('th.num', 'Coste imputado'),
              h('th.num', 'Margen'), h('th', 'Sobre suelo 35 %')
            ])),
            h('tbody', filas.map(function (r) {
              return h('tr', [
                h('td', [h('div.t-strong', r.cp.institucion), h('div.t-mut', r.cp.titulo)]),
                h('td.num', fmt.eur(Math.round(r.facturado))),
                h('td.num.t-mut', fmt.eur(Math.round(r.coste))),
                h('td.num.t-strong', fmt.eur(Math.round(r.margen))),
                h('td', r.pct === null ? NS.sem('', 'sin facturar')
                      : NS.sem(r.pct >= 35 ? 'ok' : 'mal', Math.round(r.pct) + ' %'))
              ]);
            }))
          ]));
        })()
      ]));
    }
  };

})(window.INGURA);
