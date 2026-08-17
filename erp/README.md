# ERP de INGURA

Copia literal del ERP de **Arima** (`Arima · Sistema de Gestión Integral`),
rebautizada a INGURA. Un único fichero, `index.html`, sin build ni servidor.

Origen: `arima gestión 1` (152 KB, 7 de junio de 2026), tomado del Drive de
`arimacooltour@gmail.com`. El sitio de Netlify no era accesible desde este
entorno, así que la fuente es el fichero original.

---

## Las diez pestañas

| | Pestaña | Qué hace |
|---|---|---|
| 📋 | **Oferta** | Alta y edición de ofertas con nº correlativo `EVT-####`. Campos: fecha, pueblo, actividad, contacto y vía, fecha de entrega, presupuesto sin IVA, estado, días propuestos, horarios, nº de participantes (limitado o libre), edad, nº de turnos y duración. Buscador sobre todos los campos. |
| 📦 | **Pedido** | Se crea **automáticamente** al confirmar una oferta. Los campos heredados quedan bloqueados. Añade monitores, nº de monitores, tipo de pago (A/B), sueldo por monitor, coche y sueldo de coche. |
| 🛠️ | **Producción** | Se sube una lista de materiales en `.docx` y se convierte en checklist de compras pendientes. |
| 💶 | **Facturación** | Pedidos convertidos en factura: tipo de cliente, referencia, IVA, base, cuota, total, fecha de envío, fecha de cobro y días transcurridos. |
| 📊 | **Resumen** | Tabla analítica unificada con filtros por rango de fechas y de nº EVT, y exportación a Excel. |
| 📈 | **Datos** | KPIs (pendiente de cobrar, facturación total, factura mayor y menor), facturación por meses, top 5 y bottom 5 de clientes, y comparativa año contra año. |
| 👥 | **Pago Monitores** | Deuda por monitor, importe saldado y pendiente, detalle de trabajos, gráfico mensual A vs B y envío del resumen por WhatsApp. |
| 📅 | **Calendario** | Rejilla mensual con los pedidos confirmados, panel lateral con facturación del mes, pueblos más visitados, monitores más activos. Modal de detalle editable y sincronización con Google Calendar. |
| 🧑‍💼 | **Agentes** | Agenda de interlocutores: quién es quién en cada institución. Nombre, cargo, email, teléfono, idioma de trato, marca de prescriptor y notas. Ficha por persona con todas las ofertas en las que aparece, aviso a los 10 meses sin contacto e importación de los contactos que ya viven sueltos dentro de las ofertas. |
| 🔒 | **Backup** | Copia diaria automática en JSON, descarga manual y envío por email vía EmailJS. |

**Flujo:** Oferta → (confirmar) → Pedido → Factura, con el nº `EVT-####` como
hilo conductor.

**Menú lateral.** Las pestañas van en un lateral fijo de 256 px. Por debajo de
1024 px se retira y se abre con el botón ☰ de la barra superior.

> La pestaña **Agentes** es lo único que no viene de Arima. Se añadió porque en
> el original los contactos viven sueltos dentro de cada oferta y no había forma
> de ver el histórico de una persona ni de saber a quién hace un año que no se
> llama.

---

## Qué cambié respecto al original

Tres cosas, en este orden: identidad y credenciales, la unificación de las
divisiones, y después el menú lateral y la pestaña de Agentes. El resto de la
lógica está intacta.

**Identidad**

| Cambio | Dónde |
|---|---|
| `Arima · Sistema de Gestión` → `INGURA · Sistema de Gestión` | título y cabecera |
| Letra del logotipo `A` → `I` | cabecera |
| `Resumen Arima` / `Arima_Resumen_…xlsx` → `Resumen Ingura` / `Ingura_Resumen_…xlsx` | exportación a Excel |
| `_Generado por Arima_` → `_Generado por INGURA_` | pie del Word generado |
| `backup_arima_…json`, `Backup Arima …` | nombre y asunto del backup |
| `arima_*` → `ingura_*` | claves de localStorage |

**Credenciales — vaciadas a propósito**

El fichero original lleva credenciales activas de Arima. Copiarlas habría hecho
que el ERP de INGURA escribiera **en la base de datos de Arima**, y habría metido
sus claves en este repositorio. Están en blanco, listas para las de INGURA:

- `firebaseConfig` — proyecto Firestore (era `arima-programa-gestion`)
- `EMAILJS_CONFIG.destinatario` — correo del backup (era `arimacooltour@gmail.com`)
- `GOOGLE_CALENDAR_CONFIG` — `apiKey`, `clientId` y `calendarId`

Con `firebaseConfig` vacío la aplicación arranca sola en **modo demo local**:
guarda en el navegador y avisa con un banner ámbar. Todo funciona menos la
sincronización en tiempo real entre varios usuarios.

---

## Unificación en INGURA

Arima repartía el negocio en tres divisiones —`ARI` (talleres), `KOP` · Ateki
(escape rooms) y `DIS` · Diskofesta.eus— y esa dimensión atravesaba toda la
aplicación. INGURA es una sola cosa, así que la dimensión se ha eliminado
entera:

| Fuera | Dónde estaba |
|---|---|
| Selector «División» | formulario de oferta |
| Columna «Div.» | tablas de Ofertas, Pedidos, Facturación, Resumen (y el Excel) y trabajos del monitor |
| Badges de color `ARI` / `KOP` / `DIS` | CSS y las cinco tablas |
| Tarjeta «🎯 Facturación por división» | pestaña Datos |
| Tarjeta «🎯 Por división» | panel lateral del calendario |
| Leyenda de tres colores | calendario |
| Segmento de división en la referencia de factura | `F-2026-ARI-001` → `F-2026-001` |

Y en su lugar:

- La **comparativa año por año** pasa de tres series apiladas a una sola, `INGURA`.
- El **calendario** usa un color único para todos los trabajos.
- El campo `division` sigue existiendo en los registros, siempre con el valor
  `INGURA`, para que la numeración de facturas y los datos ya guardados no se
  rompan.

---

## Lo que sigue siendo de Arima

1. **El campo «Pueblo»** hace de cliente. En INGURA el cliente suele ser un
   ayuntamiento o una mancomunidad, que no siempre coincide con un pueblo.
2. **«Pago Monitores»** asume la figura del monitor con tipo de pago A o B.

---

## Puesta en marcha

1. Abre `index.html` en el navegador. Funciona ya, en modo demo local.
2. Para trabajar entre varias personas: crea un proyecto en
   [Firebase](https://console.firebase.google.com), activa Firestore y pega la
   configuración en `firebaseConfig`, al principio del `<script>`.
3. Para el backup por correo: claves de [EmailJS](https://dashboard.emailjs.com)
   en `EMAILJS_CONFIG`.
4. Para el calendario: proyecto en Google Cloud con la Calendar API activada,
   API key y client ID OAuth en `GOOGLE_CALENDAR_CONFIG`. Google OAuth **no**
   admite `file://`: hay que servirlo desde un dominio o `http://localhost`.

**Funciona sin conexión.** Tailwind, Chart.js, SheetJS, Mammoth, docx y
FileSaver van empotrados en el propio fichero, en las mismas versiones que
servían los CDN. Firebase, EmailJS y las librerías de Google siguen siendo
externas porque sólo entran en juego si configuras credenciales, y eso exige red
por definición.

**Si tocas el marcado**, hay que recompilar el CSS: el de Tailwind va
precompilado dentro del fichero y una clase nueva no existe hasta regenerarlo.

```
python3 erp/rebuild-tw.py
```

---

## Historial

La versión anterior del ERP —construida sobre el loop maestro, con cartera
institucional, evidencia de impacto y cumplimiento— está en el historial de git
y se recupera con:

```
git checkout e1b3bf2 -- erp/
```
