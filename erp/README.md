# ERP de INGURA

Copia literal del ERP de **Arima** (`Arima · Sistema de Gestión Integral`),
rebautizada a INGURA. Un único fichero, `index.html`, sin build ni servidor.

Origen: `arima gestión 1` (152 KB, 7 de junio de 2026), tomado del Drive de
`arimacooltour@gmail.com`. El sitio de Netlify no era accesible desde este
entorno, así que la fuente es el fichero original.

---

## Las nueve pestañas

| | Pestaña | Qué hace |
|---|---|---|
| 📋 | **Oferta** | Alta y edición de ofertas con nº correlativo `EVT-####`. Campos: fecha, pueblo, actividad, división, contacto y vía, fecha de entrega, presupuesto sin IVA, estado, días propuestos, horarios, nº de participantes (limitado o libre), edad, nº de turnos y duración. Buscador sobre todos los campos. |
| 📦 | **Pedido** | Se crea **automáticamente** al confirmar una oferta. Los campos heredados quedan bloqueados. Añade monitores, nº de monitores, tipo de pago (A/B), sueldo por monitor, coche y sueldo de coche. |
| 🛠️ | **Producción** | Se sube una lista de materiales en `.docx` y se convierte en checklist de compras pendientes. |
| 💶 | **Facturación** | Pedidos convertidos en factura: tipo de cliente, referencia, IVA, base, cuota, total, fecha de envío, fecha de cobro y días transcurridos. |
| 📊 | **Resumen** | Tabla analítica unificada con filtros por rango de fechas y de nº EVT, y exportación a Excel. |
| 📈 | **Datos** | KPIs (pendiente de cobrar, facturación total, factura mayor y menor), facturación por meses, top 5 y bottom 5 de clientes, facturación por división y comparativa año contra año. |
| 👥 | **Pago Monitores** | Deuda por monitor, importe saldado y pendiente, detalle de trabajos, gráfico mensual A vs B y envío del resumen por WhatsApp. |
| 📅 | **Calendario** | Rejilla mensual con los pedidos confirmados, panel lateral con facturación del mes, pueblos más visitados, monitores más activos y reparto por división. Modal de detalle editable y sincronización con Google Calendar. |
| 🔒 | **Backup** | Copia diaria automática en JSON, descarga manual y envío por email vía EmailJS. |

**Flujo:** Oferta → (confirmar) → Pedido → Factura, con el nº `EVT-####` como
hilo conductor.

---

## Qué cambié respecto al original

Sólo identidad y credenciales. Ni una línea de lógica, ni un campo, ni una
pestaña.

**Identidad**

| Cambio | Dónde |
|---|---|
| `Arima · Sistema de Gestión` → `INGURA · Sistema de Gestión` | título y cabecera |
| Letra del logotipo `A` → `I` | cabecera |
| `ARI · Arima (Talleres)` → `ARI · Ingura (Talleres)` | etiqueta de la división |
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

## Lo que sigue siendo de Arima

No lo he tocado porque pediste copia literal, pero es lo primero a decidir:

1. **El subtítulo** dice «Talleres · Escape Rooms · Diskofestas».
2. **Las tres divisiones** siguen siendo las de Arima:
   `ARI` (talleres), `KOP` · Ateki (escape rooms) y `DIS` · Diskofesta.eus.
   Están cableadas en los badges, en los colores del calendario y en dos
   gráficas de la pestaña Datos.
3. **El campo «Pueblo»** hace de cliente. En INGURA el cliente suele ser un
   ayuntamiento o una mancomunidad, que no siempre coincide con un pueblo.
4. **«Pago Monitores»** asume la figura del monitor con tipo de pago A o B.

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

**Necesita conexión a internet.** Carga Tailwind, Firebase, SheetJS, Mammoth,
docx, FileSaver, EmailJS, Chart.js y las librerías de Google desde sus CDN. Sin
red se ve sin estilos.

---

## Historial

La versión anterior del ERP —construida sobre el loop maestro, con cartera
institucional, evidencia de impacto y cumplimiento— está en el historial de git
y se recupera con:

```
git checkout e1b3bf2 -- erp/
```
