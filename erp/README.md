# ERP de INGURA

> El repositorio define el loop maestro. Este ERP lo hace girar: convierte los
> documentos en pantallas donde se registra, se mide y se reclama.

Aplicación web estática, sin build y sin servidor. Se abre haciendo doble clic en
`index.html` o se despliega en Netlify arrastrando la carpeta.

---

## Qué es y qué no es

**Es** el cuadro de mando operativo del loop: dice en qué estación está cada
campaña, qué activo ha crecido este mes, qué vigencia caduca en 40 días y qué
campaña cerrada sigue sin certificado de buena ejecución.

**No es** un ERP genérico. Se ha construido copiando la estructura habitual de un
ERP y adaptándola a la realidad de INGURA: se ha descartado todo lo que una
empresa de siete líneas de servicio al sector público no necesita, y se ha
añadido lo que ningún ERP de catálogo trae.

| Descartado de un ERP genérico | Por qué |
|---|---|
| Inventario y almacén | El equipamiento son cuatro elementos: módulo, extrusora, trituradora y compostadoras. Van en Cumplimiento, con su ficha de riesgo. |
| Nóminas y RRHH | Plantilla mínima + red de colaboradores. Lo que importa de una persona aquí es su certificación de menores y su perfil lingüístico: eso está en Cumplimiento. |
| Fabricación y compras | No hay producción seriada. Los consumibles son una línea del presupuestador. |
| Contabilidad general | La lleva la asesoría. El ERP se queda con lo que decide precios: márgenes, tesorería y concentración. |
| Multi-empresa y multi-divisa | Una empresa, un territorio, un idioma prioritario. |

| Añadido, propio de INGURA | Dónde |
|---|---|
| Las seis estaciones como columna vertebral de la navegación | Menú lateral |
| Deuda de loop calculada sola | Panel · Devolución |
| Recordatorios automáticos desde la fecha de cierre (+7, +14, +90, +300 días) | Panel · Calendario |
| Evidencia de cuatro niveles, con el nivel 4 como campo propio | Evidencia |
| Los cuatro activos (datos, casos, prescriptores, encaje) como contadores que nunca deben bajar | Panel |
| Ensamblador modular de propuestas con las reglas de combinación del catálogo | Propuestas |
| Presupuestador de los siete componentes de coste, con tarifa de distancia y suelo de margen | Económico |
| Semáforo de vigencias con la regla de los 60 días | Cumplimiento |
| Calendario institucional sep–jul con la ventana crítica de enero protegida | Calendario |
| Diagnóstico de fallo: del síntoma a la estación que lo causa | Panel |
| Conmutación euskera / castellano | Cabecera |

---

## Módulos

```
GENERAL
  Panel          ¿está girando el loop? · 3 indicadores maestros · avisos · deuda · diagnóstico
  Calendario     loop largo sep–jul · cadencias · recordatorios automáticos

EL LOOP MAESTRO
  ① Radar        oportunidades, señales vigiladas y su fuente
  ② Propuestas   pipeline · ensamblador modular · las tres capas · ratio de adjudicación
  ③ Campañas     metodología de 6 fases · checklist de 25 puntos por campaña
  ④ Evidencia    los cuatro niveles · alcance, encuestas e idioma de atención
  ⑤ Devolución   informes, reuniones de cierre y certificados de buena ejecución
  ⑥ Casos        biblioteca publicable y prescriptores

BASE
  Cartera        56 instituciones · estado · escalón · prescriptor · diagnóstico municipal
  Catálogo       7 líneas · 7 talleres · reglas de combinación · escalera comercial

CONTROL
  Económico      salud económica · presupuestador · palancas de margen · tesorería
  Cumplimiento   semáforo de vigencias · riesgos por taller · RGPD · euskera
  Ajustes        exportar / importar JSON · vaciar demo · restaurar semilla
```

---

## Datos

- **Todo se guarda en el navegador** (`localStorage`, clave `ingura.erp.v1`). No
  sale nada a ningún servidor. Cambiar de ordenador o de navegador significa
  empezar de cero: para mover el estado, **Ajustes → Exportar JSON**.
- **La cartera institucional no es demo.** Los 56 nombres son reales y vienen de
  `data/municipios-objetivo.csv`. Contacto, población y datos de recogida están
  **vacíos a propósito**: se rellenan desde fuente oficial (perfil de contratante,
  Open Data Euskadi, Udalmap, memorias de mancomunidad). No inventar datos.
- **Oportunidades, propuestas, campañas, casos y prescriptores vienen con datos de
  demostración**, marcados con la etiqueta `demo` y con un aviso permanente en
  cabecera. Se borran de una vez desde **Ajustes → Vaciar datos de demostración**.
- Los catálogos fijos (líneas, talleres, calendario, vigencias, umbrales) están en
  `data/seed.js` y son trazables documento a documento: `docs/05`, `docs/07`,
  `docs/08`, `docs/09`, `loop/LOOP-MAESTRO.md` y `loop/cadencias.md`.

---

## Estructura de ficheros

```
erp/
  index.html            esqueleto y carga de scripts
  assets/erp.css        paleta y tipografía heredadas de la landing
  data/seed.js          catálogos fijos + cartera + bloque demo
  app/core.js           estado, persistencia, i18n, helpers, router, métricas
  app/views-base.js     Panel · Calendario · Cartera · Catálogo · Ajustes
  app/views-loop.js     las seis estaciones
  app/views-control.js  Económico · Cumplimiento
```

Sin dependencias, sin `npm install`, sin paso de compilación. Los scripts se
cargan en orden y se cuelgan del espacio de nombres `window.INGURA`.

---

## Diseño

Paleta y tipografía idénticas a `web/index.html`: papel crema con grano, Fraunces
para titulares, Karla para texto, y los tres colores de marca (tierra, verde,
naranja). Tema único claro, deliberado: la identidad de INGURA es papel, y un modo
oscuro rompería la continuidad con la web pública.

La paleta de estado (verde / ámbar / rojo) está validada sobre la superficie
`#FBF9F4`: banda de luminosidad, croma, separación bajo daltonismo y separación en
visión normal pasan las comprobaciones. El ámbar queda por debajo de 3:1 de
contraste, así que **el punto de color nunca aparece solo**: siempre lleva
etiqueta de texto al lado. Ese es el motivo de que el semáforo diga
«vence en 42 d» y no sólo pinte un círculo.

---

## Despliegue

```
# local
abrir erp/index.html en el navegador

# Netlify (arrastrar y soltar)
subir la carpeta erp/ completa a app.netlify.com/drop
```

La página lleva `noindex, nofollow`: es una herramienta interna, no una página
pública. Si se despliega en Netlify, conviene además protegerla con contraseña de
sitio.
