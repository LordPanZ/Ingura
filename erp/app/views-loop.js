/* ============================================================================
   INGURA ERP · las seis estaciones del loop maestro
   ① Radar · ② Propuestas · ③ Campañas · ④ Evidencia · ⑤ Devolución · ⑥ Casos
   ========================================================================== */

(function (NS) {
  'use strict';
  var h = NS.h, fmt = NS.fmt, M = NS.metricas, S = NS.seed, F = NS.form;

  function uid(p) { return p + '-' + Math.random().toString(36).slice(2, 8); }
  function instituciones() {
    return NS.store.get().instituciones.map(function (i) { return i.nombre; }).sort();
  }
  function guardar() { NS.store.save(); NS.repintar(); }

  /* ======================================================================
     ① RADAR · Entzun
     ==================================================================== */
  var SENALES = [
    ['Plan de legislatura / plan de mandato', 'Web municipal, actas de pleno', 'Prioridades a 4 años'],
    ['Presupuesto municipal anual', 'Perfil de contratante, BOB/BOG/BOTHA', 'Partida disponible en medio ambiente'],
    ['Adhesión a Udalsarea 2030 y Agenda 2030 Local', 'Ihobe / Udalsarea', 'Obligación de programar acciones'],
    ['Convocatorias de subvención', 'Boletines oficiales, euskadi.eus', 'Ventana de contratación con financiación'],
    ['Datos de recogida selectiva', 'Open Data Euskadi, Udalmap, mancomunidad', 'El argumento del diagnóstico'],
    ['Licitaciones y contratos menores', 'Plataforma de Contratación, Kontratazio Publikoa', 'Quién compra qué, a quién y por cuánto'],
    ['Rotación del personal técnico', 'Boletines, LinkedIn', 'Momento de reintroducirse']
  ];
  var ORIGENES = ['radar', 'convocatoria', 'prescripcion', 'entrante', 'fria'];
  var NO_FRIA = ['prescripcion', 'convocatoria', 'entrante'];

  NS.vistas.radar = {
    eyebrow: 'Estación ① · Entzun',
    titulo: 'Radar institucional',
    render: function (c) {
      var st = NS.store.get();
      var abiertas = st.oportunidades.filter(function (o) { return o.estado === 'abierta'; });
      var noFrias = st.oportunidades.filter(function (o) { return NO_FRIA.indexOf(o.origen) >= 0; });
      var pctNoFria = st.oportunidades.length ? (noFrias.length / st.oportunidades.length) * 100 : 0;

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Oportunidades abiertas', num: abiertas.length,
                  meter: NS.meter(abiertas.length, 4, 12, 'mayor', '', 'umbral 4 / mes'),
                  foot: 'el radar debe detectar ≥ 4 al mes' }),
        NS.tile({ lbl: 'Demanda no fría', num: Math.round(pctNoFria), unidad: '%',
                  meter: NS.meter(pctNoFria, 50, 100, 'mayor', '', 'umbral 50 %'),
                  foot: 'prescripción, convocatoria o entrada espontánea' }),
        NS.tile({ lbl: 'Cartera con ficha', num: st.instituciones.filter(function (i) { return i.contacto_tecnico; }).length,
                  foot: 'de ' + st.instituciones.length + ' instituciones · umbral 80 % actualizadas' }),
        NS.tile({ lbl: 'Prescriptores activos', num: st.prescriptores.filter(function (p) { return p.activo; }).length,
                  foot: 'coste de captación ≈ 0' })
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [
            h('h2', 'Oportunidades detectadas'),
            h('div.hint', 'No es prospección: es inteligencia institucional sobre un mercado finito y público, ' +
                          'cuyos datos son abiertos por obligación legal.')
          ]),
          h('span.sp', h('button.btn.pri', { onclick: nueva }, '+ Oportunidad'))
        ]),
        st.oportunidades.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Institución'), h('th', 'Señal'), h('th', 'Fuente'),
                h('th', 'Origen'), h('th', 'Ventana'), h('th', 'Estado'), h('th', '')
              ])),
              h('tbody', st.oportunidades.map(function (o) {
                var dias = o.ventana ? -NS.dias(o.ventana) : null;
                return h('tr', [
                  h('td.t-strong', o.institucion),
                  h('td', [o.señal, o.demo ? NS.chip('demo', 'demo') : null]),
                  h('td.t-mut', o.fuente),
                  h('td', NS.chip(o.origen, NO_FRIA.indexOf(o.origen) >= 0 ? 'verde' : '')),
                  h('td', o.ventana
                    ? h('div', [fmt.fecha(o.ventana),
                        h('div.t-mut', { style: 'font-size:.7rem' }, dias >= 0 ? 'quedan ' + dias + ' d' : 'cerrada')])
                    : h('span.t-empty', '—')),
                  h('td', NS.chip(o.estado, o.estado === 'abierta' ? 'naranja' : '')),
                  h('td', [
                    h('button.btn.sm', { onclick: function () { aPropuesta(o); } }, '→ ②'),
                    ' ',
                    h('button.btn.sm', { onclick: function () {
                      st.oportunidades = st.oportunidades.filter(function (x) { return x !== o; }); guardar();
                    } }, '✕')
                  ])
                ]);
              }))
            ]))
          : NS.vacio('Radar vacío', 'Sin oportunidades registradas. El bloque Radar de la reunión del lunes dura 10 minutos.')
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Qué se vigila, y dónde'),
        h('div.hint', 'La lista de señales del loop maestro. Automatizable en gran parte: alertas sobre BOPV, BOB, BOG, ' +
                      'BOTHA y perfiles de contratante con las palabras clave del sector.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Señal'), h('th', 'Dónde se encuentra'), h('th', 'Qué anticipa')])),
          h('tbody', SENALES.map(function (s) {
            return h('tr', [h('td.t-strong', s[0]), h('td.t-mut', s[1]), h('td', s[2])]);
          }))
        ])),
        h('div.note', [
          h('strong', 'Palabras clave del radar: '),
          'sentsibilizazio · hezkuntza ambiental · hondakinak · educación ambiental · economía circular · Agenda 2030'
        ])
      ]));

      function nueva() {
        var o = { id: uid('op'), institucion: instituciones()[0], señal: '', fuente: '',
                  tipo: '', origen: 'radar', ventana: '', estado: 'abierta' };
        NS.drawer('Nueva oportunidad', [
          h('div.card', [
            F.campo('Institución', F.select(instituciones(), o.institucion, function (v) { o.institucion = v; })),
            F.campo('Señal detectada', F.input('text', '', function (v) { o.señal = v; })),
            F.campo('Fuente', F.input('text', '', function (v) { o.fuente = v; })),
            F.campo('Origen', F.select(ORIGENES, o.origen, function (v) { o.origen = v; })),
            F.campo('Ventana (fecha límite)', F.input('date', '', function (v) { o.ventana = v; })),
            h('button.btn.pri', { onclick: function () {
              if (!o.señal) return alert('Describe la señal detectada.');
              NS.store.get().oportunidades.unshift(o); NS.cerrarDrawer(); guardar();
            } }, 'Guardar oportunidad')
          ])
        ], 'Estación ① · alimenta el pipeline de la estación ②');
      }

      function aPropuesta(o) {
        o.estado = 'convertida';
        NS.store.get().propuestas.unshift({
          id: uid('pr'), institucion: o.institucion, titulo: o.señal.slice(0, 70),
          lineas: [], importe: 0, estado: 'borrador', fecha: new Date().toISOString().slice(0, 10),
          horas: 0, capas: { ciudadana: false, tecnica: false, justificativa: false }
        });
        NS.store.save();
        NS.ir('propuestas');
      }
    }
  };

  /* ======================================================================
     ② PROPUESTAS · Proposamena
     ==================================================================== */
  var EST_PROP = ['borrador', 'enviada', 'adjudicada', 'perdida'];

  NS.vistas.propuestas = {
    eyebrow: 'Estación ② · Proposamena',
    titulo: 'Propuestas',
    render: function (c) {
      var st = NS.store.get(), e = M.economia();
      var sinJustificativa = st.propuestas.filter(function (p) { return p.capas && !p.capas.justificativa; });

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Ratio adjudicación', num: Math.round(e.adjudicacion), unidad: '%',
                  meter: NS.meter(e.adjudicacion, 40, 100, 'mayor', '', 'umbral 40 %'),
                  foot: 'sobre ' + e.adjudicacionBase + ' propuestas resueltas' }),
        NS.tile({ lbl: 'Pipeline enviado', num: fmt.eur(e.pipeline).replace(' €', ''), unidad: '€',
                  foot: 'propuestas enviadas sin resolver' }),
        NS.tile({ lbl: 'Horas medias por propuesta', num: e.horasMedias.toFixed(1), unidad: 'h',
                  foot: 'debe ser decreciente: es la prueba del activo A4' }),
        NS.tile({ lbl: 'Sin capa justificativa', num: sinJustificativa.length, flag: sinJustificativa.length > 0,
                  foot: 'la capa que cierra la venta y casi nadie escribe' })
      ]));

      c.appendChild(h('div.note.verde', [
        h('strong', 'Las tres capas de toda propuesta INGURA. '),
        h('b', 'Ciudadana'), ': qué va a vivir la persona que se acerque al módulo — emociona a la parte política. ',
        h('b', 'Técnica'), ': metodología, aforos, materiales, medición — tranquiliza a la parte técnica. ',
        h('b', 'Justificativa'), ': encaje con ODS, Agenda 2030 Local, la convocatoria concreta y los criterios del pliego.'
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [h('h2', 'Pipeline'), h('div.hint', 'Se revisa cada lunes: enviadas sin respuesta, por enviar, seguimientos vencidos.')]),
          h('span.sp', h('button.btn.pri', { onclick: function () { ensamblador(null); } }, '+ Propuesta'))
        ]),
        st.propuestas.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Institución'), h('th', 'Título'), h('th', 'Líneas'),
                h('th.num', 'Importe'), h('th.num', 'Horas'), h('th', 'Capas'), h('th', 'Estado'), h('th', '')
              ])),
              h('tbody', st.propuestas.map(function (p) {
                var tono = { borrador: '', enviada: 'naranja', adjudicada: 'verde', perdida: 'rojo' }[p.estado];
                return h('tr.clic', { onclick: function () { ensamblador(p); } }, [
                  h('td.t-strong', p.institucion),
                  h('td', [p.titulo, p.demo ? NS.chip('demo', 'demo') : null,
                           p.motivo ? h('div.t-mut', { style: 'font-size:.72rem' }, p.motivo) : null]),
                  h('td', (p.lineas || []).map(function (id) { return NS.chip(id.replace('linea-', 'L'), 'verde'); })),
                  h('td.num', fmt.eur(p.importe)),
                  h('td.num', p.horas || '—'),
                  h('td', capasChips(p)),
                  h('td', NS.chip(p.estado, tono)),
                  h('td', p.estado === 'adjudicada' && !yaEsCampana(p)
                    ? h('button.btn.sm', { onclick: function (ev) { ev.stopPropagation(); aCampana(p); } }, '→ ③')
                    : null)
                ]);
              }))
            ]))
          : NS.vacio('Sin propuestas', 'Enero y febrero se protegen para esto.')
      ]));

      function capasChips(p) {
        var k = p.capas || {};
        return [
          NS.chip('C', k.ciudadana ? 'verde' : 'rojo'),
          NS.chip('T', k.tecnica ? 'verde' : 'rojo'),
          NS.chip('J', k.justificativa ? 'verde' : 'rojo')
        ];
      }
      function yaEsCampana(p) {
        return NS.store.get().campanas.some(function (x) { return x.desdePropuesta === p.id; });
      }
      function aCampana(p) {
        NS.store.get().campanas.unshift({
          id: uid('cp'), desdePropuesta: p.id, institucion: p.institucion, titulo: p.titulo,
          lineas: (p.lineas || []).slice(), importe: p.importe,
          inicio: new Date().toISOString().slice(0, 10), cierre: '', estado: 'en-curso', fase: 1,
          nivelEvidencia: 0, informe: false, certificado: false, caso: false, reunionCierre: false,
          nivel4: false, alcance: 0, encuestas: 0, euskera: 0, kmIda: 0
        });
        NS.store.save(); NS.ir('campanas');
      }

      /* --- ensamblador modular ------------------------------------------- */
      function ensamblador(p) {
        var nuevo = !p;
        p = p || { id: uid('pr'), institucion: instituciones()[0], titulo: '', lineas: [], importe: 0,
                   estado: 'borrador', fecha: new Date().toISOString().slice(0, 10), horas: 0,
                   capas: { ciudadana: false, tecnica: false, justificativa: false } };
        p.capas = p.capas || { ciudadana: false, tecnica: false, justificativa: false };

        var salida = h('div');

        function encaje() {
          salida.innerHTML = '';
          var sel = p.lineas.slice().sort();
          var match = S.combinaciones.find(function (k) {
            return k.lineas.length === sel.length && k.lineas.slice().sort().every(function (x, i) { return x === sel[i]; });
          });
          var suma = p.lineas.reduce(function (s, id) {
            var l = S.lineas.find(function (x) { return x.id === id; });
            return s + (l && l.desde ? l.desde : 0);
          }, 0);
          var escalon = p.lineas.reduce(function (m, id) {
            var l = S.lineas.find(function (x) { return x.id === id; });
            return Math.max(m, l ? l.escalon : 0);
          }, 0);

          if (!p.lineas.length) {
            salida.appendChild(h('div.hint', 'Selecciona líneas para ver el encaje y el rango orientativo.'));
            return;
          }
          salida.appendChild(h('dl.kv', [
            h('dt', 'Combinación'), h('dd', match ? h('span.t-strong', match.nombre) : 'Combinación libre (no está en las reglas del catálogo)'),
            h('dt', 'Rango'), h('dd', match ? fmt.eur(match.min) + (match.max ? ' – ' + fmt.eur(match.max) : ' +')
                                             : 'suma de mínimos: ' + fmt.eur(suma)),
            h('dt', 'Escalón'), h('dd', String(escalon) + ' de 5'),
            h('dt', 'ODS'), h('dd', ods(p.lineas).join(' · ') || '—')
          ]));
          if (match && p.importe && p.importe < match.min) {
            salida.appendChild(h('div.note', [
              h('strong', 'Por debajo del rango. '),
              'El descuento se gana ampliando alcance, nunca recortando margen sobre el mismo alcance.'
            ]));
          }
          if (p.lineas.indexOf('linea-5') >= 0) {
            salida.appendChild(h('div.note', [
              h('strong', 'Línea 5. '),
              'INGURA actúa como encargada del tratamiento: el contrato de encargo es un anexo obligatorio.'
            ]));
          }
        }
        function ods(ids) {
          var v = {};
          ids.forEach(function (id) {
            var l = S.lineas.find(function (x) { return x.id === id; });
            if (l) l.ods.forEach(function (o) { v[o] = 1; });
          });
          return Object.keys(v).sort(function (a, b) { return a - b; });
        }

        var checkLineas = h('div', S.lineas.map(function (l) {
          return h('label', { style: 'display:flex;gap:.5rem;align-items:flex-start;font-size:.82rem;padding:.18rem 0' }, [
            h('input', { type: 'checkbox', style: 'width:auto;margin-top:.3rem', checked: p.lineas.indexOf(l.id) >= 0,
              onchange: function (ev) {
                if (ev.target.checked) p.lineas.push(l.id);
                else p.lineas = p.lineas.filter(function (x) { return x !== l.id; });
                encaje();
              } }),
            h('span', [h('b', 'L' + l.n + ' · '), l.resumen])
          ]);
        }));
        encaje();

        NS.drawer(nuevo ? 'Nueva propuesta' : p.titulo || 'Propuesta', [
          h('div.card', [
            F.campo('Institución', F.select(instituciones(), p.institucion, function (v) { p.institucion = v; })),
            F.campo('Título', F.input('text', p.titulo, function (v) { p.titulo = v; })),
            F.campo('Fecha', F.input('date', p.fecha, function (v) { p.fecha = v; })),
            F.campo('Importe (€, sin IVA)', F.input('number', p.importe, function (v) { p.importe = Number(v) || 0; encaje(); })),
            F.campo('Horas de elaboración', F.input('number', p.horas, function (v) { p.horas = Number(v) || 0; })),
            F.campo('Estado', F.select(EST_PROP, p.estado, function (v) { p.estado = v; }))
          ]),
          h('div.card', [
            h('h2', 'Ensamblado modular'),
            h('div.hint', 'La propuesta se construye combinando módulos existentes, nunca escribiendo desde cero.'),
            checkLineas,
            h('hr', { style: 'border:0;border-top:var(--rule-soft);margin:.8rem 0' }),
            salida
          ]),
          h('div.card', [
            h('h2', 'Las tres capas'),
            F.checkbox(p.capas.ciudadana, 'Capa ciudadana — qué va a vivir la persona', function (v) { p.capas.ciudadana = v; }),
            F.checkbox(p.capas.tecnica, 'Capa técnica — metodología, aforos, materiales, medición', function (v) { p.capas.tecnica = v; }),
            F.checkbox(p.capas.justificativa, 'Capa justificativa — ODS, convocatoria, criterios del pliego', function (v) { p.capas.justificativa = v; })
          ]),
          h('div.note', [
            h('strong', 'Cláusula obligatoria. '),
            'Toda propuesta incluye el acceso a los datos de recogida de la mancomunidad. Se pacta al firmar, no al final: ' +
            'es la única forma de alcanzar evidencia de nivel 4.'
          ]),
          h('div', { style: 'display:flex;gap:.5rem' }, [
            h('button.btn.pri', { onclick: function () {
              if (!p.titulo) return alert('Pon un título a la propuesta.');
              var st2 = NS.store.get();
              if (nuevo) st2.propuestas.unshift(p);
              NS.cerrarDrawer(); guardar();
            } }, 'Guardar'),
            !nuevo ? h('button.btn', { onclick: function () {
              if (!confirm('¿Eliminar esta propuesta?')) return;
              var st2 = NS.store.get();
              st2.propuestas = st2.propuestas.filter(function (x) { return x.id !== p.id; });
              NS.cerrarDrawer(); guardar();
            } }, 'Eliminar') : null
          ])
        ], 'Estación ② · ensamblar, no escribir desde cero');
      }
    }
  };

  /* ======================================================================
     ③ CAMPAÑAS · Egikaritzea
     ==================================================================== */
  NS.vistas.campanas = {
    eyebrow: 'Estación ③ · Egikaritzea',
    titulo: 'Campañas',
    render: function (c) {
      var st = NS.store.get();
      var enCurso = st.campanas.filter(function (x) { return x.estado === 'en-curso'; });

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'En curso', num: enCurso.length, foot: 'campañas activas' }),
        NS.tile({ lbl: 'Cerradas', num: M.campanasCerradas().length, foot: 'con fecha de cierre' }),
        NS.tile({ lbl: 'Facturación registrada', num: fmt.eur(M.economia().facturacion).replace(' €', ''), unidad: '€',
                  foot: 'suma de importes de campaña' }),
        NS.tile({ lbl: 'Con checklist completo', num: st.campanas.filter(checklistCompleto).length,
                  foot: 'umbral 100 % · docs/08 §7' })
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [
            h('h2', 'Campañas'),
            h('div.hint', 'La calidad no debe depender de quién dinamice. Metodología de 6 fases + hoja de sesión rellenada ' +
                          'durante la sesión, nunca después.')
          ]),
          h('span.sp', h('button.btn.pri', { onclick: function () { ficha(null); } }, '+ Campaña'))
        ]),
        st.campanas.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Institución'), h('th', 'Campaña'), h('th', 'Fase'), h('th', 'Inicio'),
                h('th', 'Cierre'), h('th.num', 'Importe'), h('th', 'Estado'), h('th', 'Checklist')
              ])),
              h('tbody', st.campanas.map(function (x) {
                return h('tr.clic', { onclick: function () { ficha(x); } }, [
                  h('td.t-strong', x.institucion),
                  h('td', [x.titulo, x.demo ? NS.chip('demo', 'demo') : null,
                           h('div', (x.lineas || []).map(function (id) { return NS.chip(id.replace('linea-', 'L'), 'verde'); }))]),
                  h('td', faseBarra(x.fase)),
                  h('td.t-mut', fmt.fecha(x.inicio)),
                  h('td.t-mut', x.cierre ? fmt.fecha(x.cierre) : h('span.t-empty', '—')),
                  h('td.num', fmt.eur(x.importe)),
                  h('td', NS.chip(x.estado, x.estado === 'en-curso' ? 'naranja' : 'verde')),
                  h('td', progresoChecklist(x))
                ]);
              }))
            ]))
          : NS.vacio('Sin campañas', 'Las campañas nacen de una propuesta adjudicada.')
      ]));

      function faseBarra(f) {
        var w = h('div', { style: 'display:flex;gap:2px' });
        for (var i = 1; i <= 6; i++) {
          w.appendChild(h('span', {
            title: 'Fase ' + i + ' · ' + S.metodologia[i - 1].nombre,
            style: 'width:11px;height:6px;border-radius:2px;background:' +
                   (i <= f ? 'var(--verde)' : 'color-mix(in srgb,var(--tierra) 15%,transparent)')
          }));
        }
        return h('div', [w, h('div.t-mut', { style: 'font-size:.68rem;margin-top:.15rem' }, f + '/6')]);
      }

      function listaChecklist(x) {
        var st2 = NS.store.get();
        return st2.checklists[x.id] || (st2.checklists[x.id] = { antes: [], durante: [], despues: [] });
      }
      function progresoChecklist(x) {
        var cl = NS.store.get().checklists[x.id];
        var total = S.checklist.antes.length + S.checklist.durante.length + S.checklist.despues.length;
        var n = 0;
        if (cl) ['antes', 'durante', 'despues'].forEach(function (k) { n += (cl[k] || []).filter(Boolean).length; });
        var pct = Math.round((n / total) * 100);
        return NS.sem(pct === 100 ? 'ok' : (pct >= 50 ? 'ambar' : 'mal'), pct + ' %');
      }
      function checklistCompleto(x) {
        var cl = NS.store.get().checklists[x.id];
        if (!cl) return false;
        return ['antes', 'durante', 'despues'].every(function (k) {
          return S.checklist[k].every(function (_, i) { return (cl[k] || [])[i]; });
        });
      }

      function ficha(x) {
        var nuevo = !x;
        x = x || { id: uid('cp'), institucion: instituciones()[0], titulo: '', lineas: [], importe: 0,
                   inicio: new Date().toISOString().slice(0, 10), cierre: '', estado: 'en-curso', fase: 1,
                   nivelEvidencia: 0, informe: false, certificado: false, caso: false, reunionCierre: false,
                   nivel4: false, alcance: 0, encuestas: 0, euskera: 0, kmIda: 0 };

        var cl = nuevo ? { antes: [], durante: [], despues: [] } : listaChecklist(x);

        function bloque(k, titulo) {
          return h('div.card', [
            h('h2', titulo),
            h('ul.chk', S.checklist[k].map(function (txt, i) {
              var li = h('li' + (cl[k][i] ? '.done' : ''), [
                h('input', { type: 'checkbox', checked: !!cl[k][i], onchange: function (ev) {
                  cl[k][i] = ev.target.checked;
                  li.classList.toggle('done', ev.target.checked);
                  NS.store.save();
                } }),
                h('span', txt)
              ]);
              return li;
            }))
          ]);
        }

        NS.drawer(nuevo ? 'Nueva campaña' : x.titulo, [
          h('div.card', [
            F.campo('Institución', F.select(instituciones(), x.institucion, function (v) { x.institucion = v; })),
            F.campo('Título', F.input('text', x.titulo, function (v) { x.titulo = v; })),
            F.campo('Fase de la metodología (1-6)', F.select(['1', '2', '3', '4', '5', '6'], String(x.fase), function (v) { x.fase = Number(v); })),
            F.campo('Inicio', F.input('date', x.inicio, function (v) { x.inicio = v; })),
            F.campo('Cierre', F.input('date', x.cierre, function (v) { x.cierre = v; if (v) x.estado = 'cerrada'; })),
            F.campo('Importe (€)', F.input('number', x.importe, function (v) { x.importe = Number(v) || 0; })),
            F.campo('Distancia ida (km)', F.input('number', x.kmIda, function (v) { x.kmIda = Number(v) || 0; })),
            F.campo('Estado', F.select(['en-curso', 'cerrada'], x.estado, function (v) { x.estado = v; }))
          ]),
          h('div.card', [
            h('h2', 'Metodología'),
            h('div.tw', h('table', [
              h('tbody', S.metodologia.map(function (f) {
                return h('tr', [
                  h('td', { style: 'width:1.6rem' }, NS.sem(f.fase < x.fase ? 'ok' : (f.fase === x.fase ? 'ambar' : ''), '')),
                  h('td', [h('div.t-strong', f.fase + ' · ' + f.nombre), h('div.t-mut', f.salida),
                           f.loop ? h('div', NS.chip(f.loop, 'naranja')) : null])
                ]);
              }))
            ]))
          ]),
          bloque('antes', 'Checklist · antes (fases 1-4)'),
          bloque('durante', 'Checklist · durante (fase 5)'),
          bloque('despues', 'Checklist · después (fase 6)'),
          h('div', { style: 'display:flex;gap:.5rem' }, [
            h('button.btn.pri', { onclick: function () {
              if (!x.titulo) return alert('Pon un título a la campaña.');
              var st2 = NS.store.get();
              if (nuevo) { st2.campanas.unshift(x); st2.checklists[x.id] = cl; }
              NS.cerrarDrawer(); guardar();
            } }, 'Guardar'),
            !nuevo ? h('button.btn', { onclick: function () {
              if (!confirm('¿Eliminar esta campaña?')) return;
              var st2 = NS.store.get();
              st2.campanas = st2.campanas.filter(function (y) { return y.id !== x.id; });
              NS.cerrarDrawer(); guardar();
            } }, 'Eliminar') : null
          ])
        ], x.institucion, nuevo ? null : NS.repintar);
      }
    }
  };

  /* ======================================================================
     ④ EVIDENCIA · Frogak
     ==================================================================== */
  NS.vistas.evidencia = {
    eyebrow: 'Estación ④ · Frogak',
    titulo: 'Evidencia de impacto',
    render: function (c) {
      var st = NS.store.get();
      var cerradas = M.campanasCerradas();
      var e = M.economia();
      var totalAlcance = st.campanas.reduce(function (s, x) { return s + (x.alcance || 0); }, 0);
      var totalEnc = st.campanas.reduce(function (s, x) { return s + (x.encuestas || 0); }, 0);
      var tasaEnc = totalAlcance ? (totalEnc / totalAlcance) * 100 : 0;
      var eusk = st.campanas.filter(function (x) { return x.alcance; });
      var pctEusk = eusk.length ? eusk.reduce(function (s, x) { return s + (x.euskera || 0); }, 0) / eusk.length : 0;

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Personas alcanzadas', num: totalAlcance.toLocaleString('es-ES'), foot: 'nivel 1 acumulado' }),
        NS.tile({ lbl: 'Cerradas con nivel 3', num: Math.round(e.nivel3), unidad: '%',
                  meter: NS.meter(e.nivel3, 100, 100, 'mayor', '', 'umbral 100 %'),
                  foot: 'cada campaña sin evidencia es margen futuro perdido' }),
        NS.tile({ lbl: 'Tasa de encuesta', num: Math.round(tasaEnc), unidad: '%',
                  meter: NS.meter(tasaEnc, 30, 100, 'mayor', '', 'umbral 30 %'),
                  foot: 'encuestas recogidas / personas atendidas' }),
        NS.tile({ lbl: 'Atención en euskera', num: Math.round(pctEusk), unidad: '%',
                  foot: 'dato de nivel 2 · se registra en cada interacción' })
      ]));

      c.appendChild(h('div.note.verde', [
        h('strong', 'Aquí es donde INGURA se separa del sector. '),
        'La mayoría de proveedores entregan una memoria con fotos y número de asistentes. Eso no es evidencia: es un parte ' +
        'de actividad. Cada campaña debe alcanzar al menos el nivel 3.'
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Los cuatro niveles'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th.num', 'Nivel'), h('th', 'Qué mide'), h('th', 'Cómo se captura'), h('th.num', 'Campañas')])),
          h('tbody', S.nivelesEvidencia.map(function (n) {
            var cuenta = st.campanas.filter(function (x) {
              return n.n === 4 ? x.nivel4 : (x.nivelEvidencia >= n.n);
            }).length;
            return h('tr', [
              h('td.num.t-strong', n.n),
              h('td', [h('div.t-strong', n.nombre), h('div.t-mut', n.mide)]),
              h('td.t-mut', n.captura),
              h('td.num', cuenta)
            ]);
          }))
        ])),
        h('div.note', [
          h('strong', 'El nivel 4 es el que crea un caso irrebatible. '),
          'Requiere pactar con la mancomunidad el acceso al dato en el momento de firmar el contrato, no al final. ' +
          'Debe ser cláusula estándar de toda propuesta.'
        ])
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Registro por campaña'),
        h('div.hint', 'Volcado de las hojas de sesión. La evidencia se captura mientras ocurre: reconstruida a posteriori ' +
                      'no es evidencia, es memoria.'),
        st.campanas.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Campaña'), h('th.num', 'Alcance'), h('th.num', 'Encuestas'),
                h('th.num', '% euskera'), h('th', 'Nivel'), h('th', 'Nivel 4')
              ])),
              h('tbody', st.campanas.map(function (x) {
                return h('tr', [
                  h('td', [h('div.t-strong', x.institucion), h('div.t-mut', x.titulo)]),
                  h('td.num', numIn(x, 'alcance')),
                  h('td.num', numIn(x, 'encuestas')),
                  h('td.num', numIn(x, 'euskera')),
                  h('td', nivelSelect(x)),
                  h('td', F.checkbox(x.nivel4, '', function (v) { x.nivel4 = v; guardar(); }))
                ]);
              }))
            ]))
          : NS.vacio('Sin campañas', 'La evidencia se registra sobre campañas.')
      ]));

      function numIn(x, campo) {
        return h('input', { type: 'number', value: x[campo] || 0, style: 'width:5.5rem;text-align:right',
          onchange: function (ev) { x[campo] = Number(ev.target.value) || 0; NS.store.save(); } });
      }
      function nivelSelect(x) {
        var s = h('select', { style: 'width:4.5rem', onchange: function (ev) {
          x.nivelEvidencia = Number(ev.target.value); guardar();
        } });
        [0, 1, 2, 3, 4].forEach(function (n) {
          s.appendChild(h('option', { value: n, selected: x.nivelEvidencia === n }, n || '—'));
        });
        return s;
      }
    }
  };

  /* ======================================================================
     ⑤ DEVOLUCIÓN · Itzulketa — donde se salda la deuda de loop
     ==================================================================== */
  NS.vistas.devolucion = {
    eyebrow: 'Estación ⑤ · Itzulketa',
    titulo: 'Devolución y certificados',
    render: function (c) {
      var st = NS.store.get(), a = M.activos(), deuda = M.deuda();
      var cerradas = M.campanasCerradas();
      var pc = function (n, d) { return d ? Math.round((n / d) * 100) : 0; };
      var conInforme = cerradas.filter(function (x) { return x.informe; }).length;
      var conReunion = cerradas.filter(function (x) { return x.reunionCierre; }).length;

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Con informe entregado', num: pc(conInforme, cerradas.length), unidad: '%',
                  meter: NS.meter(pc(conInforme, cerradas.length), 100, 100, 'mayor', '', 'umbral 100 %'),
                  foot: 'ninguna campaña se cierra sin informe presentable' }),
        NS.tile({ lbl: 'Con certificado', num: pc(a.A4, a.A4base), unidad: '%',
                  meter: NS.meter(pc(a.A4, a.A4base), 80, 100, 'mayor', '', 'umbral 80 %'),
                  foot: 'activo A4 · el documento más valioso' }),
        NS.tile({ lbl: 'Con reunión de cierre', num: pc(conReunion, cerradas.length), unidad: '%',
                  foot: 'presencial · no se automatiza nunca' }),
        NS.tile({ lbl: 'Deuda de loop', num: deuda.length, flag: deuda.length > 0,
                  foot: 'campañas cerradas con algo pendiente' })
      ]));

      c.appendChild(h('div.note', [
        h('strong', 'Regla de diseño del informe. '),
        'El técnico que lo recibe no debería tener que trabajar sobre él: debe poder reenviarlo a su concejalía y que se ' +
        'entienda en 2 minutos, copiar dos gráficos a la memoria anual, adjuntarlo como justificación a Ihobe y llevarlo a ' +
        'Udalsarea 2030 sin pasar vergüenza. Y una página de recomendaciones para el año siguiente: ahí nace, sin venderla, ' +
        'la campaña siguiente.'
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Cierre de campañas'),
        h('div.hint', 'Marca cada hito en el momento en que ocurre. El certificado se pide en la reunión de cierre, mientras ' +
                      'la satisfacción está caliente: pedirlo seis meses después es perderlo.'),
        cerradas.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Campaña'), h('th', 'Cerrada'), h('th', 'Reunión'), h('th', 'Informe'),
                h('th', 'Certificado'), h('th', 'Caso'), h('th', 'Nivel 4'), h('th', 'Reactivación'), h('th', 'Deuda')
              ])),
              h('tbody', cerradas.map(function (x) {
                var d = deuda.find(function (y) { return y.campana.id === x.id; });
                return h('tr', [
                  h('td', [h('div.t-strong', x.institucion), h('div.t-mut', x.titulo)]),
                  h('td.t-mut', [fmt.fecha(x.cierre), h('div', { style: 'font-size:.7rem' }, 'hace ' + NS.dias(x.cierre) + ' d')]),
                  h('td', tog(x, 'reunionCierre')),
                  h('td', tog(x, 'informe')),
                  h('td', tog(x, 'certificado')),
                  h('td', tog(x, 'caso')),
                  h('td', tog(x, 'nivel4')),
                  h('td', tog(x, 'reactivada')),
                  h('td', d ? NS.sem('mal', d.falta.length + ' pdte.') : NS.sem('ok', 'saldada'))
                ]);
              }))
            ]))
          : NS.vacio('Sin campañas cerradas', 'La devolución empieza cuando una campaña se cierra.')
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Qué contiene el informe final'),
        h('ul', { style: 'margin:0;padding-left:1.2rem;font-size:.85rem;line-height:1.8' }, [
          h('li', 'Resumen ejecutivo de 1 página, bilingüe, comprensible en 2 minutos.'),
          h('li', 'Dos gráficos y tres cifras copiables a la memoria anual del área.'),
          h('li', 'Anexo justificativo para la subvención de Ihobe o de la diputación.'),
          h('li', 'Página de recomendaciones para el año siguiente con lo detectado en la calle.'),
          h('li', 'Evidencia de los cuatro niveles alcanzados, con metodología explicada.')
        ])
      ]));

      function tog(x, campo) {
        return h('input', { type: 'checkbox', checked: !!x[campo], style: 'width:auto;accent-color:var(--verde)',
          'aria-label': campo,
          onchange: function (ev) { x[campo] = ev.target.checked; guardar(); } });
      }
    }
  };

  /* ======================================================================
     ⑥ CASOS · Gomendioa
     ==================================================================== */
  NS.vistas.casos = {
    eyebrow: 'Estación ⑥ · Gomendioa',
    titulo: 'Casos y prescripción',
    render: function (c) {
      var st = NS.store.get();
      var publicados = st.casos.filter(function (x) { return x.publicado; });
      var enRed = st.casos.filter(function (x) { return x.presentadoEnRed; });

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Casos publicados', num: publicados.length,
                  meter: NS.meter(publicados.length, 4, 8, 'mayor', '', 'umbral 4 / año'),
                  foot: 'activo A2 · 1 página web + PDF bilingüe' }),
        NS.tile({ lbl: 'Presentados en red', num: enRed.length,
                  meter: NS.meter(enRed.length, 1, 4, 'mayor', '', 'umbral 1 / año'),
                  foot: 'por un técnico municipal en Udalsarea o su mancomunidad' }),
        NS.tile({ lbl: 'Prescriptores activos', num: st.prescriptores.filter(function (p) { return p.activo; }).length,
                  foot: 'activo A3' }),
        NS.tile({ lbl: 'Campañas publicables', num: st.campanas.filter(function (x) {
                    return x.nivelEvidencia >= 3 && !st.casos.some(function (k) { return k.campana === x.id; });
                  }).length, foot: 'nivel 3+ y todavía sin caso redactado' })
      ]));

      c.appendChild(h('div.note.verde', [
        h('strong', 'Que lo cuente él o ella, no INGURA. '),
        'Un proveedor que se elogia a sí mismo vale cero; un técnico que elogia a su proveedor ante quince colegas vale ' +
        'una campaña. Cada caso publicado alimenta la estación ①: el municipio vecino que lo lee es la próxima señal del radar.'
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [h('h2', 'Biblioteca de casos'), h('div.hint', 'Contexto, intervención, resultado, cita del técnico, fotos con consentimiento.')]),
          h('span.sp', h('button.btn.pri', { onclick: nuevoCaso }, '+ Caso'))
        ]),
        st.casos.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [
                h('th', 'Institución'), h('th', 'Título'), h('th.num', 'Nivel'),
                h('th', 'Permiso'), h('th', 'Publicado'), h('th', 'Presentado en red'), h('th', '')
              ])),
              h('tbody', st.casos.map(function (k) {
                return h('tr', [
                  h('td.t-strong', k.institucion),
                  h('td', [k.titulo, k.demo ? NS.chip('demo', 'demo') : null]),
                  h('td.num', k.nivel),
                  h('td', chk(k, 'permiso')),
                  h('td', chk(k, 'publicado')),
                  h('td', chk(k, 'presentadoEnRed')),
                  h('td', h('button.btn.sm', { onclick: function () {
                    st.casos = st.casos.filter(function (y) { return y !== k; }); guardar();
                  } }, '✕'))
                ]);
              }))
            ]))
          : NS.vacio('Sin casos', 'Un caso se redacta a los 14 días del cierre. Después, la memoria se enfría.')
      ]));

      c.appendChild(h('div.card', [
        h('div.card-head', [
          h('div', [h('h2', 'Prescriptores'), h('div.hint', 'Personas técnicas que recomiendan INGURA sin que se les pida. Coste de captación ≈ 0.')]),
          h('span.sp', h('button.btn.pri', { onclick: nuevoPrescriptor }, '+ Prescriptor'))
        ]),
        st.prescriptores.length
          ? h('div.tw', h('table', [
              h('thead', h('tr', [h('th', 'Institución'), h('th', 'Rol'), h('th', 'Nota'), h('th', 'Activo'), h('th', '')])),
              h('tbody', st.prescriptores.map(function (p) {
                return h('tr', [
                  h('td.t-strong', p.institucion), h('td.t-mut', p.rol), h('td', p.nota),
                  h('td', chk(p, 'activo')),
                  h('td', h('button.btn.sm', { onclick: function () {
                    st.prescriptores = st.prescriptores.filter(function (y) { return y !== p; }); guardar();
                  } }, '✕'))
                ]);
              }))
            ]))
          : NS.vacio('Sin prescriptores', 'Se piden en la reunión de cierre. Nunca se automatiza.')
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Los tres movimientos de la prescripción'),
        h('ol', { style: 'margin:0;padding-left:1.2rem;font-size:.85rem;line-height:1.85' }, [
          h('li', [h('b', 'Caso publicado'), ' con permiso expreso: 1 página web + PDF bilingüe.']),
          h('li', [h('b', 'Circulación institucional'), ': proponer al técnico presentar la experiencia en un grupo de trabajo de Udalsarea 2030, una jornada de Ihobe o la comisión de la mancomunidad.']),
          h('li', [h('b', 'Contenido propio'), ': una publicación mensual con un aprendizaje real de campo, no promocional. Umbral: 10 al año.'])
        ])
      ]));

      function chk(o, campo) {
        return h('input', { type: 'checkbox', checked: !!o[campo], style: 'width:auto;accent-color:var(--verde)',
          'aria-label': campo, onchange: function (ev) { o[campo] = ev.target.checked; guardar(); } });
      }

      function nuevoCaso() {
        var candidatas = st.campanas.filter(function (x) { return x.nivelEvidencia >= 3; });
        var k = { id: uid('cs'), campana: candidatas[0] ? candidatas[0].id : '',
                  institucion: candidatas[0] ? candidatas[0].institucion : instituciones()[0],
                  titulo: '', nivel: 3, permiso: false, publicado: false, presentadoEnRed: false };
        NS.drawer('Nuevo caso', [
          h('div.card', [
            candidatas.length
              ? F.campo('Campaña de origen', (function () {
                  var s = h('select', { onchange: function (ev) {
                    k.campana = ev.target.value;
                    var cp = candidatas.find(function (x) { return x.id === k.campana; });
                    if (cp) { k.institucion = cp.institucion; k.nivel = cp.nivelEvidencia; }
                  } });
                  candidatas.forEach(function (x) {
                    s.appendChild(h('option', { value: x.id }, x.institucion + ' · ' + x.titulo));
                  });
                  return s;
                })())
              : h('div.note', 'No hay campañas con evidencia de nivel 3 o superior. Un caso sin evidencia no es un caso.'),
            F.campo('Título del caso', F.input('text', '', function (v) { k.titulo = v; })),
            F.checkbox(false, 'Permiso de publicación de la institución', function (v) { k.permiso = v; }),
            h('button.btn.pri', { onclick: function () {
              if (!k.titulo) return alert('Pon un título al caso.');
              st.casos.unshift(k); NS.cerrarDrawer(); guardar();
            } }, 'Guardar caso')
          ])
        ], 'Activo A2 · la prueba social que el técnico enseña a su concejalía');
      }

      function nuevoPrescriptor() {
        var p = { id: uid('ps'), institucion: instituciones()[0], rol: '', nota: '', activo: true };
        NS.drawer('Nuevo prescriptor', [
          h('div.card', [
            F.campo('Institución', F.select(instituciones(), p.institucion, function (v) { p.institucion = v; })),
            F.campo('Rol', F.input('text', '', function (v) { p.rol = v; })),
            F.campo('Nota', F.input('text', '', function (v) { p.nota = v; })),
            h('button.btn.pri', { onclick: function () {
              st.prescriptores.unshift(p); NS.cerrarDrawer(); guardar();
            } }, 'Guardar')
          ])
        ], 'Activo A3');
      }
    }
  };

})(window.INGURA);
