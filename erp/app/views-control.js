/* ============================================================================
   INGURA ERP · control
   Económico (presupuestador de 7 componentes + salud) · Cumplimiento (semáforo)
   ========================================================================== */

(function (NS) {
  'use strict';
  var h = NS.h, fmt = NS.fmt, M = NS.metricas, S = NS.seed, F = NS.form;

  /* ======================================================================
     ECONÓMICO
     ==================================================================== */
  NS.vistas.economico = {
    eyebrow: 'Modelo económico · docs/09',
    titulo: 'Económico',
    render: function (c) {
      var st = NS.store.get(), e = M.economia();

      /* --- salud económica ------------------------------------------------ */
      var valores = {
        concentracion: e.concentracion, recurrente: null, adjudicacion: e.adjudicacion,
        cobro: null, estacional: null, nivel3: e.nivel3
      };

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Facturación registrada', num: fmt.eur(e.facturacion).replace(' €', ''), unidad: '€',
                  foot: 'suma de campañas' }),
        NS.tile({ lbl: 'Ticket medio', num: fmt.eur(Math.round(e.ticket)).replace(' €', ''), unidad: '€',
                  foot: 'debe ser creciente' }),
        NS.tile({ lbl: 'Concentración del mayor cliente', num: Math.round(e.concentracion), unidad: '%',
                  meter: NS.meter(e.concentracion, 25, 100, 'menor', '', 'umbral < 25 %'),
                  flag: e.concentracion > 25,
                  foot: e.mayorCliente }),
        NS.tile({ lbl: 'Pipeline enviado', num: fmt.eur(e.pipeline).replace(' €', ''), unidad: '€',
                  foot: 'propuestas sin resolver' })
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Objetivos de salud económica'),
        h('div.hint', 'Marco para calibrar con la contabilidad real. Los indicadores sin dato requieren instrumentación ' +
                      'contable: no es que el dato no exista, es que no se está capturando.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Indicador'), h('th', 'Umbral'), h('th.num', 'Actual'), h('th', 'Estado')])),
          h('tbody', S.saludEconomica.map(function (k) {
            var v = valores[k.id];
            var bien = v === null ? null : (k.dir === 'menor' ? v <= k.umbral : v >= k.umbral);
            return h('tr', [
              h('td.t-strong', k.nombre),
              h('td.t-mut', (k.dir === 'menor' ? '< ' : '≥ ') + k.umbral + k.sufijo),
              h('td.num', v === null ? h('span.t-empty', 'sin dato') : Math.round(v * 10) / 10 + k.sufijo),
              h('td', v === null ? NS.sem('', 'falta instrumentación') : NS.sem(bien ? 'ok' : 'mal', bien ? 'en umbral' : 'fuera de umbral'))
            ]);
          }))
        ])),
        h('div.note.verde', [
          h('strong', 'El indicador que más importa: '),
          'el coste de captación por cliente nuevo, en horas. Si baja año contra año, el loop está girando y cada vuelta ' +
          'está pagando la siguiente. Hoy el ERP lo aproxima con las horas medias por propuesta: ',
          h('b', e.horasMedias.toFixed(1) + ' h'), '.'
        ])
      ]));

      /* --- presupuestador -------------------------------------------------- */
      c.appendChild(presupuestador());

      c.appendChild(h('div.card', [
        h('h2', 'Palancas de margen'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Palanca'), h('th', 'Efecto')])),
          h('tbody', S.palancas.map(function (p) {
            return h('tr', [h('td.t-strong', p.nombre), h('td.t-mut', p.efecto)]);
          }))
        ]))
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Tesorería: el riesgo real'),
        h('div.hint', 'INGURA produce, imprime, compra consumibles y paga dinamización ANTES de ejecutar. La administración ' +
                      'paga DESPUÉS de ejecutar, conformar y tramitar. Medidas por orden de eficacia:'),
        h('ol', { style: 'margin:0;padding-left:1.2rem;font-size:.85rem;line-height:1.8' }, [
          h('li', [h('b', 'Hitos de facturación en la propuesta.'), ' El más eficaz y el más olvidado: 30 % a la validación de contenidos, 40 % a mitad de ejecución, 30 % al cierre.']),
          h('li', 'Colchón de tesorería equivalente a la campaña más grande en curso.'),
          h('li', 'Facturar el mismo día del cierre, con la documentación completa.'),
          h('li', 'Registrar la factura en el sistema electrónico correcto de cada administración — el retraso más habitual no es de pago, es de registro.'),
          h('li', 'Póliza de crédito preventiva, aunque no se use.'),
          h('li', 'Confirming de la diputación cuando esté disponible.'),
          h('li', 'Reclamar intereses de demora cuando proceda.')
        ])
      ]));

      /* ------------------------------------------------------------------ */
      function presupuestador() {
        var p = st.presupuestos.actual || (st.presupuestos.actual = {
          nombre: '', importe: 0, km: 0, tarifaKm: 0.35, viajes: 2, margenSuelo: 35,
          costes: { dinamizacion: 0, preparacion: 0, consumibles: 0, grafica: 0, logistica: 0, coordinacion: 0, amortizacion: 0 }
        });

        var salida = h('div');

        function calcular() {
          var directo = S.costeComponentes.reduce(function (s, k) { return s + (Number(p.costes[k.id]) || 0); }, 0);
          var distancia = (Number(p.km) || 0) * 2 * (Number(p.viajes) || 0) * (Number(p.tarifaKm) || 0);
          var coste = directo + distancia;
          var importe = Number(p.importe) || 0;
          var margen = importe - coste;
          var pct = importe ? (margen / importe) * 100 : 0;
          var suelo = Number(p.margenSuelo) || 0;
          var sinCuantificar = S.costeComponentes.filter(function (k) { return !Number(p.costes[k.id]); });

          salida.innerHTML = '';
          salida.appendChild(h('div.grid.g4', [
            NS.tile({ lbl: 'Coste directo', num: fmt.eur(Math.round(directo)).replace(' €', ''), unidad: '€',
                      foot: 'los siete componentes' }),
            NS.tile({ lbl: 'Coste de distancia', num: fmt.eur(Math.round(distancia)).replace(' €', ''), unidad: '€',
                      foot: p.km + ' km × 2 × ' + p.viajes + ' viajes × ' + p.tarifaKm + ' €/km' }),
            NS.tile({ lbl: 'Margen bruto', num: importe ? fmt.eur(Math.round(margen)).replace(' €', '') : '—',
                      unidad: importe ? '€' : '', flag: importe && pct < suelo, foot: 'importe − coste total' }),
            NS.tile({ lbl: 'Margen', num: importe ? Math.round(pct) : '—', unidad: importe ? '%' : '',
                      meter: importe ? NS.meter(pct, suelo, 100, 'mayor', '', 'suelo ' + suelo + ' %') : null,
                      flag: importe && pct < suelo,
                      foot: !importe ? 'introduce el importe ofertado'
                            : (pct < suelo ? 'POR DEBAJO DEL SUELO' : 'sobre el suelo definido') })
          ]));

          if (sinCuantificar.length) {
            salida.appendChild(h('div.note', [
              h('strong', 'Regla de presupuestación: '),
              'ninguna propuesta se cierra sin haber cuantificado los siete componentes. Sin cuantificar: ',
              sinCuantificar.map(function (k) { return NS.chip(k.nombre, 'rojo'); })
            ]));
          }
          if (!Number(p.km)) {
            salida.appendChild(h('div.note', [
              h('strong', 'La distancia se tarifa siempre. '),
              'Un municipio a 90 km puede convertir un buen margen en ninguno.'
            ]));
          }
          if (importe) {
            salida.appendChild(h('div.card', { style: 'margin:.9rem 0 0' }, [
              h('h2', 'Hitos de facturación propuestos'),
              h('div.hint', 'La medida más eficaz contra el riesgo de tesorería, y la más olvidada.'),
              h('div.tw', h('table', [
                h('thead', h('tr', [h('th', 'Hito'), h('th.num', '%'), h('th.num', 'Importe')])),
                h('tbody', [
                  ['Validación de contenidos (fase 3)', 30],
                  ['Mitad de ejecución (fase 5)', 40],
                  ['Cierre y devolución (fase 6)', 30]
                ].map(function (r) {
                  return h('tr', [h('td', r[0]), h('td.num', r[1] + ' %'), h('td.num', fmt.eur(Math.round(importe * r[1] / 100)))]);
                }))
              ]))
            ]));
          }
        }

        var campos = h('div.grid.g3', S.costeComponentes.map(function (k) {
          return h('div', [
            h('label.fld', [
              h('span', k.nombre),
              h('input', { type: 'number', value: p.costes[k.id] || 0, onchange: function (ev) {
                p.costes[k.id] = Number(ev.target.value) || 0; NS.store.save(); calcular();
              } })
            ]),
            h('div.hint', { style: 'margin:-.4rem 0 0;font-size:.7rem' },
              k.naturaleza + (k.aviso ? ' · ' + k.aviso : ''))
          ]);
        }));

        calcular();

        return h('div.card', [
          h('h2', 'Presupuestador de campaña'),
          h('div.hint', 'Todo presupuesto tiene los mismos siete componentes. El error clásico es presupuestar sólo los tres primeros.'),
          h('div.grid.g4', [
            h('label.fld', [h('span', 'Nombre'), h('input', { type: 'text', value: p.nombre, onchange: function (ev) { p.nombre = ev.target.value; NS.store.save(); } })]),
            h('label.fld', [h('span', 'Importe ofertado (€)'), h('input', { type: 'number', value: p.importe, onchange: function (ev) { p.importe = Number(ev.target.value) || 0; NS.store.save(); calcular(); } })]),
            h('label.fld', [h('span', 'Distancia ida (km)'), h('input', { type: 'number', value: p.km, onchange: function (ev) { p.km = Number(ev.target.value) || 0; NS.store.save(); calcular(); } })]),
            h('label.fld', [h('span', 'Viajes (ida y vuelta)'), h('input', { type: 'number', value: p.viajes, onchange: function (ev) { p.viajes = Number(ev.target.value) || 0; NS.store.save(); calcular(); } })]),
            h('label.fld', [h('span', 'Tarifa €/km'), h('input', { type: 'number', step: '0.01', value: p.tarifaKm, onchange: function (ev) { p.tarifaKm = Number(ev.target.value) || 0; NS.store.save(); calcular(); } })]),
            h('label.fld', [h('span', 'Suelo de margen (%)'), h('input', { type: 'number', value: p.margenSuelo, onchange: function (ev) { p.margenSuelo = Number(ev.target.value) || 0; NS.store.save(); calcular(); } })])
          ]),
          h('h2', { style: 'font-size:.92rem;margin-top:.5rem' }, 'Los siete componentes'),
          campos,
          salida
        ]);
      }
    }
  };

  /* ======================================================================
     CUMPLIMIENTO
     ==================================================================== */
  NS.vistas.cumplimiento = {
    eyebrow: 'Lo que hace que la estación ③ sea un servicio y no un riesgo',
    titulo: 'Cumplimiento',
    render: function (c) {
      var st = NS.store.get();

      function nivel(v) {
        if (!v.vence) return { n: v.bloqueante ? 'mal' : '', txt: v.bloqueante ? 'sin fecha · bloqueante' : 'sin fecha' };
        var restan = -NS.dias(v.vence);
        if (restan < 0) return { n: 'mal', txt: 'vencido hace ' + (-restan) + ' d' };
        if (restan < 60) return { n: 'ambar', txt: 'vence en ' + restan + ' d' };
        return { n: 'ok', txt: 'vigente · ' + restan + ' d' };
      }

      var estados = st.cumplimiento.map(nivel);
      var mal = estados.filter(function (e) { return e.n === 'mal'; }).length;
      var ambar = estados.filter(function (e) { return e.n === 'ambar'; }).length;
      var ok = estados.filter(function (e) { return e.n === 'ok'; }).length;

      c.appendChild(h('div.grid.g4', [
        NS.tile({ lbl: 'Vigentes', num: ok, foot: 'más de 60 días por delante' }),
        NS.tile({ lbl: 'En ámbar', num: ambar, flag: ambar > 0,
                  foot: 'suben a la reunión del lunes como acción con fecha' }),
        NS.tile({ lbl: 'Vencidos o sin fecha', num: mal, flag: mal > 0,
                  foot: 'bloquean el arranque del loop' }),
        (function () {
          var bloq = st.cumplimiento.filter(function (v) { return v.bloqueante; });
          // resuelto = tiene fecha y no está vencido (semáforo en verde o ámbar)
          var ok = bloq.filter(function (v) { return nivel(v).n !== 'mal'; }).length;
          return NS.tile({ lbl: 'Bloqueantes resueltos', num: ok + ' / ' + bloq.length,
                           flag: ok < bloq.length, foot: 'condiciones de arranque del loop' });
        })()
      ]));

      c.appendChild(h('div.note', [
        h('strong', 'Regla del tablero. '),
        'Cualquier vigencia en ámbar (menos de 60 días) sube a la reunión semanal como acción con fecha. ' +
        'Sin certificado del Registro Central vigente, no se entra a un centro escolar. Sin excepción y sin prisa.'
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Semáforo de vigencias'),
        h('div.hint', 'Pon la fecha de vencimiento de cada elemento. El ERP calcula el semáforo y publica los avisos en el Panel.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Elemento'), h('th', 'Alcance'), h('th', 'Vence'), h('th', 'Estado')])),
          h('tbody', st.cumplimiento.map(function (v, i) {
            return h('tr', [
              h('td', [h('div.t-strong', v.nombre), v.bloqueante ? NS.chip('bloqueante', 'rojo') : null]),
              h('td.t-mut', v.alcance),
              h('td', h('input', { type: 'date', value: v.vence || '', style: 'width:9.5rem',
                onchange: function (ev) { v.vence = ev.target.value; NS.store.save(); NS.repintar(); } })),
              h('td', NS.sem(estados[i].n, estados[i].txt))
            ]);
          }))
        ]))
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Prevención de riesgos por taller'),
        h('div.hint', 'El equipamiento propio es el mayor activo de INGURA y su mayor concentración de riesgo. ' +
                      'Cada taller necesita ficha de seguridad propia.'),
        h('div.tw', h('table', [
          h('thead', h('tr', [h('th', 'Taller'), h('th', 'Riesgo'), h('th', 'Riesgos principales'), h('th', 'Medidas mínimas')])),
          h('tbody', S.talleres.slice().sort(function (a, b) {
            var o = { alto: 0, medio: 1, bajo: 2 };
            return o[a.riesgo] - o[b.riesgo];
          }).map(function (t) {
            var tono = t.riesgo === 'alto' ? 'mal' : (t.riesgo === 'medio' ? 'ambar' : 'ok');
            return h('tr', [
              h('td.t-strong', t.nombre),
              h('td', NS.sem(tono, t.riesgo)),
              h('td.t-mut', t.riesgos),
              h('td.t-mut', t.medidas)
            ]);
          }))
        ])),
        h('div.note', [
          h('strong', 'Documentación obligatoria por campaña: '),
          'evaluación de riesgos, fichas de seguridad de productos, registro de entrega de EPIs, formación acreditada del ' +
          'equipo, botiquín y plan de emergencia con teléfonos y ubicación del centro sanitario más próximo.'
        ])
      ]));

      c.appendChild(h('div.grid.g2', [
        h('div.card', [
          h('h2', 'Protección de datos'),
          h('div.tw', h('table', [
            h('thead', h('tr', [h('th', 'Tratamiento'), h('th', 'Obligación práctica')])),
            h('tbody', [
              ['Encuestas de participantes', 'Cláusula informativa en tarjeta o formulario. Diseñar la encuesta para no necesitar identificación.'],
              ['Imágenes y vídeo', 'Consentimiento expreso; de tutores legales si hay menores. Archivado por campaña.'],
              ['Datos de comercios (línea 5)', 'INGURA es encargada del tratamiento: contrato de encargo obligatorio como anexo.']
            ].map(function (r) { return h('tr', [h('td.t-strong', r[0]), h('td.t-mut', r[1])]); }))
          ]))
        ]),
        h('div.card', [
          h('h2', 'Compromiso lingüístico operativo'),
          h('div.hint', 'La prioridad al euskera no es un valor declarado: es un procedimiento.'),
          h('ul', { style: 'margin:0;padding-left:1.15rem;font-size:.84rem;line-height:1.75' }, [
            h('li', 'Redacción primaria en euskera y adaptación al castellano. No traducción automática de un original castellano.'),
            h('li', 'Atención directa iniciada en euskera, con cambio natural si la persona lo prefiere. Se registra el idioma (dato de nivel 2).'),
            h('li', 'Perfil lingüístico acreditado de cada persona del equipo, documentado en el kit de licitación.'),
            h('li', 'Ninguna pieza sale a producción sin las dos versiones cerradas y revisadas.'),
            h('li', 'Glosario ambiental propio en euskera, coherente entre campañas.')
          ])
        ])
      ]));

      c.appendChild(h('div.card', [
        h('h2', 'Condiciones de arranque del loop'),
        h('div.hint', 'Sin estos cuatro elementos el loop se rompe en su primera vuelta.'),
        h('ol', { style: 'margin:0;padding-left:1.2rem;font-size:.85rem;line-height:1.85' }, [
          h('li', [h('b', 'Canal de contacto operativo'), ' (dominio, correo profesional, teléfono, web) — sin esto no hay estación ①.']),
          h('li', [h('b', 'Solvencia acreditable'), ' (certificados de buena ejecución + registro de licitadores) — sin esto no hay estación ②.']),
          h('li', [h('b', 'Cumplimiento con menores y PRL'), ' — sin esto la estación ③ es un riesgo legal, no un servicio.']),
          h('li', [h('b', 'Sistema de captura de evidencia'), ' (hoja de sesión + consentimientos) — sin esto no hay ④⑤⑥, y por tanto no hay loop.'])
        ])
      ]));
    }
  };

})(window.INGURA);
