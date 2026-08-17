# INGURA · Sistema operativo de la empresa

**Ingurumen estrategiak eta ekintzak** · Estrategia y acción medioambiental
Palatueta bidea 25C, 48600 Sopela (Bizkaia) · CIF J098128850

> Sensibilización ambiental que su ciudadanía ve, toca y recuerda.

---

## Qué es este repositorio

Este repositorio construye INGURA como empresa a partir de su catálogo de servicios: identifica lo que le falta para ser la referencia en formación y sensibilización ambiental para ayuntamientos e instituciones vascas, y define el **loop maestro** — el sistema que hace que cada campaña ejecutada produzca la siguiente.

No es documentación descriptiva. Es un sistema operativo: cada documento existe para que alguien haga algo con él.

---

## Empezar por aquí

| Si quieres… | Lee |
|---|---|
| **Entender el motor completo** | [`loop/LOOP-MAESTRO.md`](loop/LOOP-MAESTRO.md) ★ |
| **Saber qué le falta a INGURA hoy** | [`docs/01-diagnostico-necesidades.md`](docs/01-diagnostico-necesidades.md) ★ |
| **Hacer girar el loop en el día a día** | [`erp/index.html`](erp/index.html) ★ — el ERP |
| **Saber qué hacer el lunes que viene** | [`docs/10-plan-90-dias.md`](docs/10-plan-90-dias.md) |
| **Preparar una propuesta** | [`plantillas/propuesta-tecnica.md`](plantillas/propuesta-tecnica.md) |
| **Medir una campaña** | [`docs/07-marco-de-impacto-y-kpis.md`](docs/07-marco-de-impacto-y-kpis.md) |

---

## El loop maestro en una línea

```
① ESCUCHA → ② PROPUESTA → ③ EJECUCIÓN → ④ EVIDENCIA → ⑤ DEVOLUCIÓN → ⑥ PRESCRIPCIÓN ─┐
     ▲                                                                                   │
     └───────────────────── vuelve con más autoridad y menos coste ─────────────────────┘
```

Cada vuelta acumula cuatro activos que no se pueden comprar: **datos**, **casos**, **prescriptores** y **encaje**. Esa acumulación es la definición operativa de "empresa de referencia".

La idea central: en un mercado finito (251 municipios), público y donde los compradores se conocen entre sí, la compra tiene que ser **justificable**. Por tanto la justificación es el producto. Si cada campaña entrega evidencia que el técnico municipal puede usar para defenderse ante su corporación, y esa evidencia circula por las redes donde ese técnico se relaciona con sus colegas, la campaña siguiente llega sola.

---

## Estructura

```
docs/          Estrategia, mercado, cumplimiento, economía
  01  Diagnóstico de necesidades      ★ qué falta, por urgencia
  02  Posicionamiento y marca           el hueco que ocupa INGURA
  03  Mapa institucional de Euskadi     quién compra y cómo se organiza
  04  Calendario institucional          cuándo se puede vender
  05  Catálogo de servicios             las 7 líneas, estructuradas
  06  Contratación pública              cómo licitar sin techo
  07  Marco de impacto y KPIs         ★ el diferencial competitivo
  08  Operaciones y cumplimiento        menores, PRL, RGPD, euskera
  09  Modelo económico                  márgenes, precios, tesorería
  10  Plan de 90 días                   de aquí a la primera vuelta

loop/          El motor
  LOOP-MAESTRO.md                     ★ las 6 estaciones y los 4 activos
  cadencias.md                          rutinas con día, duración y salida
  tablero-loop.md                       cuadro de mando y diagnóstico de fallo

data/
  servicios.yaml                        catálogo legible por máquina
  municipios-objetivo.csv               cartera institucional (semilla)
  impacto/                              base de evidencia por campaña

plantillas/
  propuesta-tecnica.md                  estación ②
  ficha-sesion-evidencia.md             estación ④
  encuesta-participante.md              estación ④
  informe-final-campana.md              estación ⑤
  certificado-buena-ejecucion.md        estación ⑤ — el documento más valioso
  caso-referencia.md                    estación ⑥
  email-prospeccion.md                  estación ①→②

erp/           El sistema en pantalla — aplicación web sin servidor
  index.html                          ★ copia del ERP de Arima, rebautizada
  README.md                             las 9 pestañas y qué falta adaptar

web/           Landing bilingüe + fotografía de campaña
fuentes/       Catálogo comercial original
```

El **ERP** es una copia literal del sistema de gestión de Arima, rebautizada a
INGURA: nueve pestañas —Oferta, Pedido, Producción, Facturación, Resumen, Datos,
Pago Monitores, Calendario y Backup— con el flujo oferta → pedido → factura
hilado por el número `EVT-####`. Multiusuario en tiempo real sobre Firestore, y
modo demo local mientras no haya credenciales. Ver [`erp/README.md`](erp/README.md),
que detalla qué se cambió del original y qué sigue siendo de Arima.

---

## Las cinco cosas que deciden

Del diagnóstico completo, si sólo se pudieran hacer cinco:

1. **Completar los datos de contacto y publicar la web bilingüe.** El catálogo actual dice literalmente `[a completar]` en correo, teléfono y web: es un documento comercial que no se puede enviar.
2. **Regularizar el cumplimiento**: certificaciones del Registro Central de Delincuentes Sexuales para todo el personal en contacto con menores, evaluación de riesgos de la maquinaria de demostración, y protección de datos.
3. **Recopilar los certificados de buena ejecución desde 2022.** Sin ellos, la experiencia real de INGURA es jurídicamente inexistente en una licitación — y cada mes que pasa se pierde algo irrecuperable.
4. **Implantar la medición de impacto de cuatro niveles.** Hoy INGURA compite con adjetivos contra competidores que también usan adjetivos. Con datos, competiría sola.
5. **Hacer girar el loop maestro.** Lo que convierte a INGURA en referencia no es hacer buenas campañas, sino que cada buena campaña produzca la siguiente.

---

## Las cuatro reglas irrenunciables

Si todo lo demás se abandona por falta de tiempo, estas cuatro sostienen el loop:

1. La **hoja de sesión** se rellena durante la sesión, no después.
2. El **certificado de buena ejecución** se pide en la reunión de cierre, no meses más tarde.
3. **Enero y febrero se protegen para proponer.** No se llenan de ejecución.
4. Ninguna campaña se cierra **sin informe presentable entregado**.

---

## Notas de uso

- Los **importes** proceden del catálogo comercial y son orientativos, sin IVA.
- Las referencias a **normativa, convocatorias, umbrales de contratación y programas institucionales** son mapas operativos, no asesoramiento jurídico ni fiscal: cambian con cada ejercicio y con cada legislatura, y deben verificarse en fuente oficial antes de citarse en una propuesta.
- `data/municipios-objetivo.csv` es un **fichero semilla**: los nombres de institución son reales, el resto de campos están deliberadamente vacíos para rellenarse con fuentes oficiales. No inventar datos de contacto.
- Todo material de cara a la ciudadanía se produce en **euskera y castellano, con prioridad al euskera** en la atención directa.
