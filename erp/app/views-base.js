/* ============================================================================
   INGURA ERP · vistas base
   Panel · Calendario · Cartera · Catálogo · Ajustes
   ========================================================================== */

(function (NS) {
  'use strict';
  var h = NS.h, fmt = NS.fmt, M = NS.metricas, S = NS.seed;

  /* ======================================================================
     PANEL — ¿está girando el loop?
     ==================================================================== */
  NS.vistas.panel = {
    eyebrow: 'Cuadro de mando único',
    titulo: 'Panel',
    render: function (c) {
      var m = M.maestros(), a = M.activos(), est = M.estaciones();
      var avisos = M.avisos(), deuda = M.deuda();

      /* --- 1 · los tres indicadores maestros ------------------------------ */
      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [
            h('h2', '¿Se está convirtiendo INGURA en referencia?'),
            h('div.hint', 'Los tres indicadores maestros del loop. Se miden año contra año, nunca mes contra mes. ' +
                          'Si la facturación sube pero estos tres no se mueven, INGURA está trabajando mucho y construyendo poco.')
          ])
        ]),
        h('div.grid.g3', [
          NS.tile({
            lbl: 'Repetición institucional', num: Math.round(m.repeticion), unidad: '%',
            meter: NS.meter(m.repeticion, 60, 100, 'mayor', '', 'umbral 60 %'),
            foot: m.repeticionBase ? 'sobre ' + m.repeticionBase + ' instituciones con campaña'
                                   : 'sin campañas registradas todavía'
          }),
          NS.tile({
            lbl: 'Demanda no fría', num: Math.round(m.nofria), unidad: '%',
            meter: NS.meter(m.nofria, 50, 100, 'mayor', '', 'umbral 50 %'),
            foot: 'prescripción, convocatoria o entrada espontánea · ' + m.nofriaBase + ' oportunidades'
          }),
          NS.tile({
            lbl: 'Casos publicables', num: m.casos, unidad: '/año',
            meter: NS.meter(m.casos, 4, 8, 'mayor', '', 'umbral 4'),
            foot: 'evidencia nivel 3+ y permiso de publicación'
          })
        ])
      ]));

      /* --- 2 · rail de estaciones ----------------------------------------- */
      var rail = h('div.rail');
      S.estaciones.forEach(function (e) {
        var d = est[e.id] || {};
        var v = d.valor === null || d.valor === undefined ? '—'
              : (d.pct ? Math.round(d.valor) + ' %' : d.valor);
        rail.appendChild(h('button', { onclick: function () { NS.ir(e.vista); }, title: e.objetivo }, [
          h('div.n', ['①②③④⑤⑥'[e.n - 1]]),
          h('div.nm', e.es),
          h('div.eu', e.eu),
          h('div.v', String(v)),
          h('div', { class: 'hint', style: 'font-size:.68rem;margin:.1rem 0 0' }, d.txt || '')
        ]));
      });
      c.appendChild(h('div.card', [
        h('h2', 'Las seis estaciones'),
        h('div.hint', 'Ninguna estación se salta. Una campaña de la que no se extrae evidencia y no se devuelve informe ' +
                      'no es media campaña: es una campaña que rompe el loop.'),
        rail
      ]));

      /* --- 3 · avisos y deuda --------------------------------------------- */
      var colAvisos = h('div.card', [
        h('div.card-head', [
          h('div', [h('h2', 'Avisos'), h('div.hint', 'Disparadores automáticos de cadencias.md y vigencias en ámbar.')]),
          h('span.sp', NS.chip(avisos.length + '', avisos.length ? 'naranja' : 'verde'))
        ]),
        avisos.length
          ? h('ul.avisos', avisos.slice(0, 12).map(function (v) {
              return h('li', { class: 'clic', style: 'cursor:pointer', onclick: function () { NS.ir(v.vista); } }, [
                h('span.bang.' + v.gravedad, v.gravedad === 'alta' ? '!' : '·'),
                h('div', [h('div.tt', v.titulo), h('div.dd', v.detalle)])
              ]);
            }))
          : NS.vacio('Sin avisos', 'Nada vencido y nada a punto de vencer.')
      ]);

      var colDeuda = h('div.card', [
        h('div.card-head', [
          h('div', [
            h('h2', 'Deuda de loop'),
            h('div.hint', 'Campañas cerradas con algo pendiente. Se revisa cada lunes. El objetivo permanente es que esté vacía.')
          ]),
          h('span.sp', NS.chip(deuda.length + '', deuda.length ? 'rojo' : 'verde'))
        ]),
        deuda.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [h('th', 'Campaña'), h('th', 'Cerrada'), h('th', 'Falta')])),
              h('tbody', deuda.map(function (d) {
                return h('tr.clic', { onclick: function () { NS.ir('devolucion'); } }, [
                  h('td', [h('div.t-strong', d.campana.institucion), h('div.t-mut', d.campana.titulo)]),
                  h('td', [fmt.fecha(d.campana.cierre), h('div.t-mut', 'hace ' + d.dias + ' d')]),
                  h('td', d.falta.map(function (f) { return NS.chip(f, 'rojo'); }))
                ]);
              }))
            ]))
          : NS.vacio('Deuda vacía', 'Todas las campañas cerradas han dado su vuelta completa.')
      ]);

      c.appendChild(h('div.grid.g2', [colAvisos, colDeuda]));

      /* --- 4 · los cuatro activos ----------------------------------------- */
      c.appendChild(h('div.card', [
        h('h2', 'Los cuatro activos'),
        h('div.hint', 'Cada vuelta del loop deposita algo que la vuelta siguiente puede gastar. Se cuentan en absolutos ' +
                      'acumulados y nunca deben bajar. Si al cerrar una campaña no ha crecido ninguno, el loop ha girado en falso.'),
        h('div.grid.g4', [
          NS.tile({ lbl: 'A1 · Datos', num: a.A1, foot: 'campañas con evidencia nivel 3 · ' + a.A1b + ' con nivel 4 (umbral 2)' }),
          NS.tile({ lbl: 'A2 · Casos', num: a.A2, foot: 'casos publicados · umbral 4 al año',
                    flag: a.A2 < 4 }),
          NS.tile({ lbl: 'A3 · Prescriptores', num: a.A3, foot: 'recomiendan sin que se les pida' }),
          NS.tile({ lbl: 'A4 · Encaje', num: a.A4,
                    foot: 'certificados de buena ejecución sobre ' + a.A4base + ' campañas cerradas',
                    flag: a.A4base > 0 && a.A4 < a.A4base })
        ])
      ]));

      /* --- 5 · diagnóstico de fallo --------------------------------------- */
      c.appendChild(h('div.card', [
        h('h2', 'Diagnóstico de fallo'),
        h('div.hint', 'Cuando el negocio no va bien, el tablero dice dónde se ha roto el loop. Pulsa un síntoma para ir a su estación.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Síntoma'), h('th', 'Estación que falla'), h('th', 'Qué revisar')])),
          h('tbody', S.diagnostico.map(function (d) {
            return h('tr.clic', { onclick: function () { NS.ir(d.vista); } }, [
              h('td.t-strong', d.sintoma),
              h('td', NS.chip(d.estacion, 'naranja')),
              h('td.t-mut', d.revisar)
            ]);
          }))
        ]))
      ]));
    }
  };

  /* ======================================================================
     CALENDARIO — el loop largo y sus cadencias
     ==================================================================== */
  NS.vistas.calendario = {
    eyebrow: 'Loop largo · sep – jul',
    titulo: 'Calendario institucional',
    render: function (c) {
      var st = NS.store.get();
      var mesActual = new Date().getMonth() + 1;
      var maxCarga = Math.max.apply(null, S.calendario.map(function (m) { return m.carga; }));

      /* Serie única (carga relativa por mes): sin leyenda, el título la nombra. */
      var barras = h('div.bars');
      S.calendario.forEach(function (m) {
        barras.appendChild(h('div.b' + (m.critico ? '.crit' : ''), [
          h('div.tip', m.nombre + ' · ' + m.estacion + ' — ' + m.que),
          h('i', { style: 'height:' + Math.round((m.carga / maxCarga) * 100) + '%' }),
          h('em', m.nombre.slice(0, 3) + (m.mes === mesActual ? ' ●' : ''))
        ]));
      });

      c.appendChild(h('div.card', [
        h('h2', 'Carga relativa de ejecución por mes'),
        h('div.hint', 'El sector no compra cuando INGURA quiere vender: compra cuando su calendario se lo permite. ' +
                      'En naranja, la ventana crítica de propuesta. El punto marca el mes en curso.'),
        barras,
        h('div.note', [
          h('strong', 'La regla de enero. '),
          'Si en enero y febrero INGURA está ejecutando en lugar de proponer, el año siguiente será peor que el actual. ' +
          'La capacidad de esos dos meses debe estar protegida para la estación ②.'
        ])
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Mes a mes'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Mes'), h('th', 'Estación dominante'), h('th', 'Qué se hace')])),
          h('tbody', S.calendario.map(function (m) {
            return h('tr', { style: m.mes === mesActual ? 'background:var(--menta)' : '' }, [
              h('td.t-strong', m.nombre + (m.mes === mesActual ? ' ●' : '')),
              h('td', NS.chip(m.estacion, m.critico ? 'naranja' : 'verde')),
              h('td', m.que)
            ]);
          }))
        ]))
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Cadencias'),
        h('div.hint', 'El loop no se ejecuta con voluntad, se ejecuta con calendario. Cada rutina tiene un entregable: ' +
                      'una reunión sin salida escrita no es una rutina, es una conversación.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Rutina'), h('th', 'Cuándo'), h('th', 'Duración'), h('th', 'Salida')])),
          h('tbody', S.cadencias.map(function (r) {
            return h('tr', [h('td.t-strong', r.nombre), h('td', r.cuando), h('td.t-mut', r.duracion), h('td', r.salida)]);
          }))
        ]))
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Recordatorios automáticos'),
        h('div.hint', 'Rutinas que no deben depender de que alguien se acuerde. El ERP los dispara desde la fecha de cierre ' +
                      'de cada campaña y los publica en el Panel.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Disparador'), h('th', 'Acción'), h('th', 'Por qué')])),
          h('tbody', S.recordatorios.map(function (r) {
            return h('tr', [
              h('td.t-strong', 'Cierre + ' + r.dias + ' días'),
              h('td', r.titulo), h('td.t-mut', r.detalle)
            ]);
          }).concat(S.alertasFijas.map(function (a) {
            return h('tr', [
              h('td.t-strong', a.dia + '/' + a.mes + ' de cada año'),
              h('td', a.titulo), h('td.t-mut', a.detalle)
            ]);
          })))
        ]))
      ]));
    }
  };

  /* ======================================================================
     CARTERA — la base institucional (CRM)
     ==================================================================== */
  var ESTADOS = ['sin-contacto', 'contactado', 'propuesta-enviada', 'cliente', 'cliente-recurrente', 'dormido', 'perdido'];
  var TONO_ESTADO = {
    'sin-contacto': '', 'contactado': 'menta', 'propuesta-enviada': 'naranja',
    'cliente': 'verde', 'cliente-recurrente': 'verde', 'dormido': '', 'perdido': 'rojo'
  };

  var filtro = { q: '', territorio: '', estado: '', prioridad: '' };

  NS.vistas.cartera = {
    eyebrow: 'Estación ① · la base del radar',
    titulo: 'Cartera institucional',
    render: function (c) {
      var st = NS.store.get();

      c.appendChild(h('div.note', [
        h('strong', 'Fichero semilla. '),
        'Los nombres de institución son reales; contacto, población y datos de recogida están vacíos a propósito y se ' +
        'rellenan desde fuente oficial (perfil de contratante, Open Data Euskadi, memorias de mancomunidad). No inventar datos.'
      ]));

      var territorios = [''].concat(unicos(st.instituciones, 'territorio'));
      var caja = h('div.card');

      function tabla() {
        var filas = st.instituciones.filter(function (i) {
          if (filtro.q && (i.nombre + ' ' + i.comarca + ' ' + (i.mancomunidad || '')).toLowerCase().indexOf(filtro.q.toLowerCase()) < 0) return false;
          if (filtro.territorio && i.territorio !== filtro.territorio) return false;
          if (filtro.estado && i.estado !== filtro.estado) return false;
          if (filtro.prioridad && String(i.prioridad) !== filtro.prioridad) return false;
          return true;
        }).sort(function (a, b) { return a.prioridad - b.prioridad || a.nombre.localeCompare(b.nombre); });

        return h('div', [
          h('div.hint', filas.length + ' de ' + st.instituciones.length + ' instituciones'),
          h('div.tw', h('table', [
            h('thead', h('tr', [
              h('th', 'Institución'), h('th', 'Tipo'), h('th', 'Comarca'), h('th', 'Mancomunidad'),
              h('th.num', 'Prio'), h('th', 'Estado'), h('th.num', 'Escalón'), h('th', 'Prescriptor')
            ])),
            h('tbody', filas.map(function (i) {
              return h('tr.clic', { onclick: function () { ficha(i); } }, [
                h('td', [h('div.t-strong', i.nombre), i.notas ? h('div.t-mut', { style: 'font-size:.72rem' }, i.notas) : null]),
                h('td.t-mut', i.tipo),
                h('td.t-mut', i.comarca || '—'),
                h('td.t-mut', i.mancomunidad || '—'),
                h('td.num', i.prioridad),
                h('td', NS.chip(i.estado, TONO_ESTADO[i.estado])),
                h('td.num', i.escalon || h('span.t-empty', '—')),
                h('td', i.prescriptor ? NS.chip('sí', 'verde') : h('span.t-empty', '—'))
              ]);
            }))
          ]))
        ]);
      }

      function repintarTabla() {
        var vieja = caja.querySelector('.tabla-cartera');
        var nueva = tabla(); nueva.classList.add('tabla-cartera');
        if (vieja) caja.replaceChild(nueva, vieja); else caja.appendChild(nueva);
      }

      caja.appendChild(h('div.filters', [
        h('input', { type: 'text', placeholder: NS.t('buscar') + '…', value: filtro.q,
          oninput: function (e) { filtro.q = e.target.value; repintarTabla(); } }),
        selector(territorios, filtro.territorio, 'Territorio', function (v) { filtro.territorio = v; repintarTabla(); }),
        selector([''].concat(ESTADOS), filtro.estado, 'Estado', function (v) { filtro.estado = v; repintarTabla(); }),
        selector(['', '1', '2', '3', '4'], filtro.prioridad, 'Prioridad', function (v) { filtro.prioridad = v; repintarTabla(); })
      ]));
      var t = tabla(); t.classList.add('tabla-cartera'); caja.appendChild(t);
      c.appendChild(caja);

      function ficha(i) {
        var campanas = st.campanas.filter(function (x) { return x.institucion === i.nombre; });
        var props = st.propuestas.filter(function (x) { return x.institucion === i.nombre; });

        var cuerpo = [
          h('div.card', [
            h('h2', 'Estado comercial'),
            campo('Estado', select(ESTADOS, i.estado, function (v) { i.estado = v; NS.store.save(); })),
            campo('Escalón (docs/09 §1)', select(['0', '1', '2', '3', '4', '5'], String(i.escalon), function (v) {
              i.escalon = Number(v); NS.store.save();
            })),
            campo('Prescriptor', checkbox(i.prescriptor, 'Recomienda INGURA sin que se le pida', function (v) {
              i.prescriptor = v; NS.store.save();
            })),
            campo('Última interacción', input('date', i.ultima_interaccion, function (v) { i.ultima_interaccion = v; NS.store.save(); })),
            campo('Próxima ventana', input('date', i.proxima_ventana, function (v) { i.proxima_ventana = v; NS.store.save(); }))
          ]),
          h('div.card', [
            h('h2', 'Contacto'),
            h('div.hint', 'Rellenar desde fuente oficial. No inventar.'),
            campo('Persona técnica', input('text', i.contacto_tecnico, function (v) { i.contacto_tecnico = v; NS.store.save(); })),
            campo('Persona política', input('text', i.contacto_politico, function (v) { i.contacto_politico = v; NS.store.save(); })),
            campo('Correo', input('text', i.email, function (v) { i.email = v; NS.store.save(); })),
            campo('Teléfono', input('text', i.telefono, function (v) { i.telefono = v; NS.store.save(); }))
          ]),
          h('div.card', [
            h('h2', 'Diagnóstico del municipio'),
            h('div.hint', 'Alimenta la capa técnica de la propuesta. Fuentes: Open Data Euskadi, Udalmap, memorias de mancomunidad.'),
            campo('Población', input('text', i.poblacion, function (v) { i.poblacion = v; NS.store.save(); })),
            campo('kg/hab orgánico', input('text', i.kg_hab_organico, function (v) { i.kg_hab_organico = v; NS.store.save(); })),
            campo('kg/hab envases', input('text', i.kg_hab_envases, function (v) { i.kg_hab_envases = v; NS.store.save(); })),
            campo('Proveedor actual', input('text', i.proveedor_actual, function (v) { i.proveedor_actual = v; NS.store.save(); }))
          ]),
          h('div.card', [
            h('h2', 'Historial'),
            props.length || campanas.length
              ? h('div.tw', h('table', [
                  h('thead', h('tr', [h('th', 'Tipo'), h('th', 'Título'), h('th.num', 'Importe'), h('th', 'Estado')])),
                  h('tbody', props.map(function (p) {
                    return h('tr', [h('td', NS.chip('propuesta')), h('td', p.titulo), h('td.num', fmt.eur(p.importe)), h('td', p.estado)]);
                  }).concat(campanas.map(function (x) {
                    return h('tr', [h('td', NS.chip('campaña', 'verde')), h('td', x.titulo), h('td.num', fmt.eur(x.importe)), h('td', x.estado)]);
                  })))
                ]))
              : NS.vacio('Sin historial', 'Todavía no hay propuestas ni campañas con esta institución.')
          ])
        ];
        if (i.notas) cuerpo.unshift(h('div.note', i.notas));
        NS.drawer(i.nombre, cuerpo, i.tipo + ' · ' + i.territorio + (i.comarca ? ' · ' + i.comarca : ''),
                  repintarTabla);
      }
    }
  };

  /* ======================================================================
     CATÁLOGO — 7 líneas, 7 talleres, reglas de combinación, escalera
     ==================================================================== */
  NS.vistas.catalogo = {
    eyebrow: 'La materia prima de la estación ②',
    titulo: 'Catálogo de servicios',
    render: function (c) {
      c.appendChild(h('div.note.verde', [
        h('strong', 'Regla de oro de la propuesta. '),
        'Se construye ensamblando módulos existentes, nunca escribiendo desde cero. Si una propuesta exige inventar un ' +
        'servicio nuevo, o es una oportunidad de producto (y se añade al catálogo) o es una distracción (y se declina).'
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Las siete líneas'),
        h('div.hint', 'Importes sin IVA, orientativos. Pulsa una línea para ver su encaje.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [
            h('th.num', 'Nº'), h('th', 'Línea'), h('th', 'En una frase'),
            h('th.num', 'Escalón'), h('th.num', 'Desde'), h('th', 'ODS')
          ])),
          h('tbody', S.lineas.map(function (l) {
            return h('tr.clic', { onclick: function () { fichaLinea(l); } }, [
              h('td.num.t-strong', l.n),
              h('td.t-strong', l.nombre),
              h('td.t-mut', l.resumen),
              h('td.num', l.escalon),
              h('td.num', l.desde ? fmt.eur(l.desde) : h('span.t-mut', 'a medida')),
              h('td', l.ods.map(function (o) { return NS.chip(String(o), 'menta'); }))
            ]);
          }))
        ]))
      ]));

      c.appendChild(h('div.grid.g2', [
        h('div.card', [
          h('h2', 'Escalera comercial'),
          h('div.hint', 'Las siete líneas no son siete productos: son una escalera. La métrica que importa no es la ' +
                        'facturación, sino cuántos clientes suben de escalón cada año.'),
          h('div.tw', h('table', [
            h('thead', h('tr', [h('th.num', '#'), h('th', 'Escalón'), h('th', 'Rango'), h('th', 'Función económica')])),
            h('tbody', S.escalera.map(function (e) {
              return h('tr', [h('td.num.t-strong', e.n), h('td.t-strong', e.nombre), h('td.t-mut', e.rango), h('td.t-mut', e.funcion)]);
            }))
          ]))
        ]),
        h('div.card', [
          h('h2', 'Reglas de combinación'),
          h('div.hint', 'Combinar líneas optimiza el presupuesto conjunto frente a contratarlas por separado. ' +
                        'El ensamblador de Propuestas usa esta misma tabla.'),
          h('div.tw', h('table', [
            h('thead', h('tr', [h('th', 'Combinación'), h('th', 'Resultado'), h('th.num', 'Rango')])),
            h('tbody', S.combinaciones.map(function (k) {
              return h('tr', [
                h('td', k.lineas.map(function (id) { return NS.chip(id.replace('linea-', 'L'), 'verde'); })),
                h('td.t-strong', k.nombre),
                h('td.num', fmt.eur(k.min) + (k.max ? ' – ' + fmt.eur(k.max) : ' +'))
              ]);
            }))
          ]))
        ])
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Los siete talleres de la línea 3'),
        h('div.hint', 'Un taller no entra en el catálogo comercial hasta que su kit está cerrado: guion bilingüe, lista de ' +
                      'materiales, ficha de seguridad, checklist de montaje, encuesta y piezas gráficas.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Taller'), h('th', 'Contenido'), h('th', 'Riesgo'), h('th', 'Medidas mínimas')])),
          h('tbody', S.talleres.map(function (t) {
            var tono = t.riesgo === 'alto' ? 'mal' : (t.riesgo === 'medio' ? 'ambar' : 'ok');
            return h('tr', [
              h('td.t-strong', t.nombre),
              h('td.t-mut', t.contenido),
              h('td', NS.sem(tono, t.riesgo)),
              h('td.t-mut', t.medidas)
            ]);
          }))
        ]))
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Metodología común de 6 fases'),
        h('div.hint', 'Toda campaña, sea de la línea que sea, sigue el mismo proceso.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th.num', 'Fase'), h('th', 'Nombre'), h('th', 'Salida'), h('th', 'Añadido del loop')])),
          h('tbody', S.metodologia.map(function (f) {
            return h('tr', [
              h('td.num.t-strong', f.fase), h('td.t-strong', f.nombre), h('td.t-mut', f.salida),
              h('td', f.loop ? NS.chip(f.loop, 'naranja') : h('span.t-empty', '—'))
            ]);
          }))
        ]))
      ]));

      function fichaLinea(l) {
        NS.drawer('Línea ' + l.n, [
          h('div.card', [
            h('h2', l.nombre),
            h('div.hint', l.resumen),
            h('dl.kv', [
              h('dt', 'Formato'), h('dd', l.formato),
              h('dt', 'Desde'), h('dd', l.desde ? fmt.eur(l.desde) : 'A medida'),
              h('dt', 'Escalón'), h('dd', String(l.escalon)),
              h('dt', 'ODS'), h('dd', l.ods.join(' · ')),
              h('dt', 'Marcos'), h('dd', l.marcos.length ? l.marcos.join(' · ') : '—')
            ])
          ]),
          h('div.card', [h('h2', 'Vende bien a'), h('p', { style: 'margin:0' }, l.vende)]),
          l.legal ? h('div.note', [h('strong', 'Nota legal. '), l.legal]) : null
        ], l.resumen);
      }
    }
  };

  /* ======================================================================
     AJUSTES
     ==================================================================== */
  NS.vistas.ajustes = {
    eyebrow: 'Configuración local',
    titulo: 'Ajustes',
    render: function (c) {
      var st = NS.store.get();
      c.appendChild(h('div.card', [
        h('h2', 'Datos'),
        h('div.hint', 'El ERP guarda todo en el navegador (localStorage). No sale nada a ningún servidor. ' +
                      'Exporta a JSON para versionarlo en el repositorio o pasarlo a otro equipo.'),
        h('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap' }, [
          h('button.btn', { onclick: exportar }, 'Exportar JSON'),
          h('label.btn', { style: 'display:inline-block' }, [
            'Importar JSON',
            h('input', { type: 'file', accept: '.json', style: 'display:none', onchange: importar })
          ]),
          h('button.btn', { onclick: function () {
            if (confirm('Se borrarán las filas marcadas como demo. ¿Continuar?')) { NS.store.vaciarDemo(); NS.repintar(); }
          } }, 'Vaciar datos de demostración'),
          h('button.btn', { onclick: function () {
            if (confirm('Se restaura el estado inicial y se PIERDE todo lo introducido. ¿Continuar?')) { NS.store.reset(); NS.repintar(); }
          } }, 'Restaurar semilla')
        ])
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Ejercicio'),
        campo('Año en curso', input('text', String(st.ejercicio), function (v) { st.ejercicio = Number(v) || st.ejercicio; NS.store.save(); }))
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Las cuatro reglas irrenunciables'),
        h('div.hint', 'Si todo lo demás se abandona por falta de tiempo, estas cuatro sostienen el loop.'),
        h('ol', { style: 'margin:0;padding-left:1.2rem;font-size:.86rem;line-height:1.9' }, [
          h('li', 'La hoja de sesión se rellena durante la sesión, no después.'),
          h('li', 'El certificado de buena ejecución se pide en la reunión de cierre, no meses más tarde.'),
          h('li', 'Enero y febrero se protegen para proponer. No se llenan de ejecución.'),
          h('li', 'Ninguna campaña se cierra sin informe presentable entregado.')
        ])
      ]));

      function exportar() {
        var blob = new Blob([JSON.stringify(NS.store.get(), null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'ingura-erp-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      }
      function importar(e) {
        var f = e.target.files[0]; if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          try {
            localStorage.setItem('ingura.erp.v1', r.result);
            location.reload();
          } catch (err) { alert('No se pudo importar: ' + err.message); }
        };
        r.readAsText(f);
      }
    }
  };

  /* ======================================================================
     HELPERS DE FORMULARIO (compartidos con views-loop / views-control)
     ==================================================================== */
  function campo(etiqueta, control) {
    return h('label.fld', [h('span', etiqueta), control]);
  }
  function input(tipo, valor, onchange) {
    return h('input', { type: tipo, value: valor || '', onchange: function (e) { onchange(e.target.value); } });
  }
  function select(opciones, valor, onchange) {
    var s = h('select', { onchange: function (e) { onchange(e.target.value); } });
    opciones.forEach(function (o) {
      s.appendChild(h('option', { value: o, selected: String(o) === String(valor) }, o === '' ? '—' : o));
    });
    return s;
  }
  function checkbox(valor, etiqueta, onchange) {
    return h('label', { style: 'display:flex;gap:.5rem;align-items:center;font-size:.83rem' }, [
      h('input', { type: 'checkbox', checked: !!valor, style: 'width:auto',
        onchange: function (e) { onchange(e.target.checked); } }),
      etiqueta
    ]);
  }
  function selector(opciones, valor, etiqueta, onchange) {
    var s = h('select', { 'aria-label': etiqueta, onchange: function (e) { onchange(e.target.value); } });
    opciones.forEach(function (o) {
      s.appendChild(h('option', { value: o, selected: o === valor }, o === '' ? etiqueta + ': ' + NS.t('todos') : o));
    });
    return s;
  }
  function unicos(arr, campo) {
    var v = {};
    arr.forEach(function (x) { if (x[campo]) v[x[campo]] = 1; });
    return Object.keys(v).sort();
  }

  NS.form = { campo: campo, input: input, select: select, checkbox: checkbox, selector: selector, unicos: unicos };

})(window.INGURA);
