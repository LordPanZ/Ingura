# CLAUDE.md

Guía para asistentes de IA que trabajen en este repositorio. Está escrita en castellano
porque **todo el repositorio lo está**: documentación, comentarios de código, mensajes de
commit e interfaz. Mantén ese idioma en cualquier contribución.

---

## 1. Qué es este repositorio

INGURA es una empresa de formación y sensibilización ambiental para ayuntamientos e
instituciones vascas (Sopela, Bizkaia; CIF J098128850; desde 2022).

Este repositorio **no es un producto de software**: es el sistema operativo de la empresa.
Contiene (a) la estrategia y el marco de trabajo en markdown y (b) un ERP web estático que
convierte esos documentos en pantallas de uso diario.

El concepto central es el **loop maestro**, y casi todo el repositorio se organiza a su
alrededor:

```
① ESCUCHA → ② PROPUESTA → ③ EJECUCIÓN → ④ EVIDENCIA → ⑤ DEVOLUCIÓN → ⑥ PRESCRIPCIÓN ─┐
     ▲                                                                                │
     └──────────────────────────────────────────────────────────────────────────────┘
```

Cada vuelta acumula cuatro activos: **datos (A1)**, **casos (A2)**, **prescriptores (A3)** y
**encaje (A4)**. Cuando veas referencias a «estación ④» o «activo A2» en código o docs, se
refieren a esto. La fuente canónica es [`loop/LOOP-MAESTRO.md`](loop/LOOP-MAESTRO.md).

---

## 2. Estructura

```
docs/          10 documentos numerados: diagnóstico, marca, mapa institucional, calendario,
               catálogo, contratación pública, KPIs, cumplimiento, economía, plan 90 días
docs/casos/    casos de referencia publicables (activo A2) — sólo con autorización escrita
loop/          LOOP-MAESTRO.md (el motor) · cadencias.md (rutinas) · tablero-loop.md (KPIs)
               loop-maestro.html (versión visual del loop)
data/          servicios.yaml (catálogo legible por máquina) · municipios-objetivo.csv
               (cartera semilla) · impacto/ (evidencia por campaña, CSV ignorados por git)
plantillas/    7 plantillas markdown, una por punto del loop donde se produce un documento
propuestas/    propuestas reales + dossieres HTML autónomos y sus plantillas .tpl.html
erp/           la aplicación web estática — la capa ejecutable del repositorio
web/           landing pública bilingüe + fotografía de campaña
fuentes/       Catalogo_Servicios_INGURA.docx — el documento comercial original
```

No hay `package.json`, ni gestor de paquetes, ni build, ni tests automatizados, ni CI.
No los introduzcas sin que te lo pidan explícitamente.

---

## 3. El ERP (`erp/`)

Aplicación web estática: **sin dependencias, sin build, sin servidor**. Se abre con doble
clic en `erp/index.html` (funciona desde `file://`) o se despliega arrastrando la carpeta
`erp/` a Netlify. Lleva `noindex, nofollow`: es interna.

### Arquitectura

Todo cuelga del espacio de nombres global `window.INGURA` (`NS` dentro de cada módulo).
Los scripts se cargan **en orden** desde `index.html` y el orden importa:

```
data/seed.js            catálogos fijos + cartera institucional + bloque demo
data/seed-comercial.js  marco legal y fiscal (S.legal) + demo del circuito comercial
app/core.js             estado, persistencia, i18n, helpers de render, métricas, router
app/views-base.js       Panel · Calendario · Cartera · Catálogo · Ajustes + NS.form
app/views-loop.js       las seis estaciones
app/views-comercial.js  Ofertas · Pedidos · Facturas · Tesorería · Gastos · Balance
app/views-control.js    Márgenes · Cumplimiento
```

> `NS.form` (helpers de formulario) se define al final de **views-base.js** y lo consumen
> los otros tres módulos de vistas. Si alteras el orden de carga, rompes las vistas.

Piezas de `core.js` que conviene conocer antes de tocar nada:

| Pieza | Qué hace |
|---|---|
| `NS.store` | `get` / `save` / `reset` / `vaciarDemo` / `hayDemo`. Persiste en `localStorage`, clave `ingura.erp.v1` |
| `normalizar(st)` | **Migración de estado.** Crea las colecciones que falten al abrir un estado guardado por una versión anterior |
| `NS.t(k)` | i18n del *cromado* de interfaz (`DICT` eu/es). Los datos NO se traducen |
| `NS.h(sel, attrs, kids)` | Hiperscript mínimo: `h('div.card', {onclick:fn}, [hijos])`. Es el único constructor de DOM que se usa |
| `NS.fmt` | `eur` · `pct` · `fecha` · `dias`, todos con `—` para valor ausente |
| `NS.sem` / `NS.chip` / `NS.meter` / `NS.tile` / `NS.vacio` | Componentes visuales compartidos |
| `NS.metricas` (`M`) | Métricas derivadas: `deuda`, `avisos`, `maestros`, `activos`, `economia`, `estaciones`, `factura`, `importes`, `finanzas` |
| Router | Hash `#/vista/param`. `NS.ir(vista, param)`, `NS.repintar()`. Vista desconocida → `panel` |
| `GRUPOS` | La navegación lateral. **Una vista nueva sólo aparece en el menú si se añade aquí** |
| `NS.drawer` | Panel lateral para fichas de edición, con callback `alCerrar` para refrescar la tabla de debajo |

### Añadir una vista

```js
NS.vistas.mivista = {
  eyebrow: 'Contexto corto · docs/NN',
  titulo: 'Título',
  render: function (c, param) { c.appendChild(h('div.card', [ /* ... */ ])); }
};
```

Y añadir `['mivista', '']` al grupo correspondiente de `GRUPOS` en `core.js`. Tras mutar el
estado: `NS.store.save(); NS.repintar();` (los módulos de vistas ya definen un helper
`guardar()` local para eso).

### Estilo de código JavaScript

- ES5 deliberado: `var`, `function`, sin módulos ES, sin *arrow functions*, sin `class`.
  Debe funcionar abierto directamente desde el sistema de ficheros, sin transpilar.
- Cada fichero es un IIFE `(function (NS) { 'use strict'; … })(window.INGURA);`.
- Comillas simples, punto y coma, indentación de 2 espacios.
- Cabecera de fichero y separadores de sección con banner de comentario `/* ==== */`.
- **Identificadores y claves de datos en ASCII sin tildes ni eñes** (`campanas`,
  `devolucion`, `economico`); los textos visibles van con ortografía completa
  («Campañas», «Devolución»). Alguna función interna sí lleva eñe (`añadir`): es la
  excepción, no la norma.
- Los comentarios explican **por qué**, no qué. Ese es el registro del repositorio: mantenlo.

### Diseño

Paleta y tipografía compartidas entre `web/index.html` (CSS embebido) y
`erp/assets/erp.css`: crema `#FBF9F4`, tierra, verde, naranja; Fraunces para titulares,
Karla para texto. **Tema único claro, decisión deliberada** — no añadas modo oscuro.

La paleta de estado (verde / ámbar / rojo) está validada sobre `#FBF9F4`. El ámbar no llega
a 3:1 de contraste, así que **el color nunca aparece solo**: siempre con etiqueta de texto
(«vence en 42 d», no sólo un círculo). Respétalo en cualquier indicador nuevo.

Si cambias un color de marca, cámbialo en **los dos sitios** (landing y `erp.css`): están
duplicados a propósito para que cada pieza sea autónoma.

---

## 4. Reglas de datos — las más importantes

1. **No inventar datos.** En `data/municipios-objetivo.csv` y en `seed.js` los nombres de
   institución son reales; contacto, población y datos de recogida están **vacíos a
   propósito** y se rellenan desde fuente oficial (perfil de contratante, Open Data Euskadi,
   Udalmap, memorias de mancomunidad). Un campo vacío es información correcta; un campo
   inventado es un error grave.
2. **Lo demo va marcado.** Oportunidades, propuestas, campañas, casos, prescriptores,
   ofertas, pedidos, facturas y gastos de ejemplo llevan `demo: true` y se borran desde
   Ajustes. Cualquier dato de ejemplo que añadas debe llevar esa marca.
3. **Datos personales fuera del repositorio.** `.gitignore` excluye
   `data/impacto/**/*.csv`, `*.xlsx` y `consentimientos/`. Nunca commitees datos de campo.
4. **Umbrales legales en un solo sitio.** IVA, contrato menor (15.000 €), plazos 30 + 30,
   interés de demora, puntos de registro y tipos de contrato viven en el bloque `S.legal`
   de `erp/data/seed-comercial.js`. Cámbialos ahí, nunca inline en una vista.
5. **Normativa = mapa operativo, no asesoramiento.** Umbrales, convocatorias y programas
   cambian con cada ejercicio y legislatura. Se verifican en fuente oficial antes de citarse
   en una propuesta, y así debe seguir diciéndolo la documentación.

### Detalles del circuito comercial que no son genéricos

La cadena documental es `Propuesta técnica → OFERTA → PEDIDO → FACTURA(s) por hitos → COBRO`,
y cada documento nace del anterior. Lo específico del sector público:

- El **vencimiento legal se cuenta desde el REGISTRO**, no desde la emisión (Ley 9/2017
  art. 198.4). Una factura emitida y nunca registrada se marca en rojo: para la
  administración no existe.
- Los **códigos DIR3** son campo del pedido, no de la factura.
- **Flujos y saldos no se mezclan**: ingresos, gastos, IVA y estacionalidad son del
  ejercicio; pendiente, vencido y antigüedad de la deuda son saldos a fecha e incluyen
  documentos de cualquier año. `M.finanzas()` lo implementa así a propósito.

---

## 5. Idioma y bilingüismo

Euskera y castellano, **con prioridad al euskera** en material de cara a la ciudadanía.

- La landing (`web/index.html`) y el dossier bilingüe abren **en euskera**, y el castellano
  se oculta por CSS (`[data-l="es"]{display:none}`) hasta que la raíz lleva
  `data-lang="es"`. Así no hay parpadeo ni dependencia de JavaScript para el estado inicial.
- Lo que el CSS no puede conmutar (`alt`, `aria-label`, datos de gráficos) lleva el euskera
  en el marcado y el castellano en atributos `data-*-es`.
- En el ERP se traduce sólo el cromado (`DICT` en `core.js`); los datos permanecen en su
  idioma original.
- **El euskera debe revisarlo una persona con competencia acreditada** antes de enviarlo a
  una institución. No lo des por bueno: es el riesgo E3 del diagnóstico.
- Convención tipográfica del sector: el símbolo de porcentaje va **delante** de la cifra en
  euskera (`% 49`, no `49 %`).

---

## 6. Convenciones de nombres de fichero

```
docs/NN-slug-en-castellano.md
docs/casos/{{año}}-{{municipio}}-{{linea}}.md
data/impacto/{{año}}-{{municipio}}-{{linea}}/{sesiones,encuestas,nivel4}.csv + notas.md
propuestas/{{año}}-{{municipio}}-{{objeto}}.md
propuestas/*.tpl.html   plantilla con marcadores __IMG_*__
propuestas/*.html       artefacto generado — no se edita a mano
```

Las referencias cruzadas entre documentos usan la forma `docs/09 §2`,
`loop/tablero-loop.md §7`. Mantén ese estilo y verifica que la sección citada existe.

---

## 7. Flujos de trabajo

### Ejecutar y verificar

No hay tests ni linter. La verificación es abrir el fichero en un navegador:

```
erp/index.html      el ERP (mirar la consola: cualquier error rompe el render entero)
web/index.html      la landing
loop/loop-maestro.html
```

Al probar el ERP recuerda que el estado persiste en `localStorage`. Para partir de cero:
Ajustes → **Restaurar semilla**, o borrar la clave `ingura.erp.v1`. Si has cambiado la forma
del estado, comprueba también el camino de migración (abrir con un estado guardado antiguo,
que `normalizar()` debe completar sin perder lo introducido).

### Regenerar los dossieres breves

Los `.html` de `propuestas/` son artefactos autónomos con las fotos incrustadas como data
URI. Se regeneran desde los `.tpl.html`; el procedimiento exacto está en
[`propuestas/README.md`](propuestas/README.md) §«Regenerar el dossier breve». No edites el
`.html` generado: edita la plantilla y vuelve a generar.

### Commits

Mensajes en castellano. Asunto corto y descriptivo, sin punto final
(«Circuito comercial y financiero: ofertas, pedidos, facturas, balance»). El cuerpo explica
**por qué** y qué decisiones se han tomado, con las referencias legales o documentales
pertinentes. Los commits de este repositorio son largos y razonados: sigue ese registro.

Trabaja en la rama que se te indique (`claude/...`). No abras un pull request salvo que se
te pida.

---

## 8. Antes de dar algo por terminado

- ¿Has inventado algún dato de contacto, población o cifra municipal? Si sí, quítalo.
- ¿Los datos de ejemplo llevan `demo: true`?
- ¿Un umbral o plazo legal nuevo está en `S.legal` y no incrustado en una vista?
- ¿El indicador nuevo lleva etiqueta de texto además de color?
- ¿La vista nueva está registrada en `GRUPOS`?
- ¿Abre el ERP sin errores en consola, y sigue abriendo con un estado guardado anterior?
- ¿Sigue todo en castellano, con el euskera donde corresponde?
