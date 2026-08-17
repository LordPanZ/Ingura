# Mapa institucional de Euskadi

> El mercado de INGURA es finito, público y trazable. Este documento lo describe para que la estación ① del loop maestro (Escucha) tenga a qué apuntar.

> ⚠️ **Nota de uso:** las estructuras institucionales son estables, pero las denominaciones de departamentos, los programas activos y las convocatorias cambian con cada legislatura y cada ejercicio. Verificar en fuente oficial antes de citar en una propuesta. Este documento es el mapa, no la fuente.

---

## 1. Los cuatro niveles de decisión

```
   GOBIERNO VASCO  ──►  Departamento con competencia ambiental
        │                   └── IHOBE (sociedad pública de gestión ambiental)
        │                          ├── Udalsarea 2030 (red de municipios)
        │                          ├── Eskolako Agenda 2030 / Agenda Escolar 2030
        │                          ├── Asteklima
        │                          └── Convocatorias de ayudas a entidades locales
        │
   DIPUTACIONES FORALES  ──►  Araba/Álava · Bizkaia · Gipuzkoa
        │                      ├── Competencia foral en residuos
        │                      ├── Consorcios/sociedades de residuos
        │                      └── Convocatorias propias a municipios
        │
   MANCOMUNIDADES, CUADRILLAS Y CONSORCIOS
        │                      └── Gestionan la recogida: tienen el DATO y el presupuesto
        │
   AYUNTAMIENTOS (251 en la CAPV)
                               └── Cliente final, cara a la ciudadanía
```

**Consecuencia comercial clave:** el ayuntamiento tiene la ciudadanía y la voluntad política; **la mancomunidad tiene los datos de recogida y, a menudo, el presupuesto de sensibilización**. Las mejores campañas se venden a los dos a la vez. Y una campaña vendida a una mancomunidad se ejecuta en todos sus municipios: es el multiplicador más eficiente del catálogo.

---

## 2. El territorio en cifras

| Territorio | Municipios | Notas para INGURA |
|---|---|---|
| **Bizkaia** | 112 | Sede de INGURA (Sopela). Mercado natural de arranque. Alta densidad, muchos municipios pequeños y medianos agrupados en mancomunidades. |
| **Gipuzkoa** | 88 | Alta cultura de gestión de residuos y de participación; euskera muy presente. Exigente y receptivo. |
| **Araba/Álava** | 51 | Concentración fuerte en Vitoria-Gasteiz; el resto es rural y se agrupa en **cuadrillas**, que funcionan como interlocutor comarcal. |
| **Total CAPV** | **251** | Mercado direccionable completo, más ~40 entes supramunicipales. |

---

## 3. Entes supramunicipales (lista semilla, a completar y verificar)

Las mancomunidades y consorcios son el atajo del catálogo: un contrato, varios municipios.

**Bizkaia** — Uribe Kosta, Mungialdea, Durangaldea / Merindad de Durango, Lea Artibai, Busturialdea, Enkarterri, Arratia, Txorierri, Lea-Ibarra, Aiaraldea; consorcio foral de residuos.

**Gipuzkoa** — Debagoiena, Debabarrena, Urola Kosta, Tolosaldea, Sasieta, Txingudi, Urola Garaia, Goierri; consorcio foral de residuos.

**Araba/Álava** — las **cuadrillas** (Añana, Aiara/Ayala, Kanpezu-Montaña Alavesa, Laguardia-Rioja Alavesa, Agurain/Salvatierra, Zuia, Vitoria-Gasteiz) actúan como agrupación comarcal.

> Tarea de la estación ①: convertir esta lista en fichas completas en `data/municipios-objetivo.csv` con persona de contacto, presupuesto conocido, datos de recogida y proveedor actual.

---

## 4. Ihobe y las redes: el amplificador

**Ihobe** es la sociedad pública de gestión ambiental del Gobierno Vasco. Para INGURA no es un cliente típico: es **el amplificador del loop**. Sus programas definen qué se considera buena práctica en Euskadi, y sus convocatorias determinan qué pueden pagar los ayuntamientos.

| Programa / red | Qué es | Cómo lo usa INGURA |
|---|---|---|
| **Udalsarea 2030** | Red vasca de municipios hacia la sostenibilidad | Los municipios adheridos **tienen que programar acciones**: demanda estructural. Sus grupos de trabajo son el foro de prescripción (estación ⑥). |
| **Eskolako Agenda 2030 / Agenda Escolar 2030** | Programa de sostenibilidad en centros educativos | Encaje directo con la línea de servicio 4 y con la figura de eco-delegados/as. |
| **Asteklima** | Semana vasca de acción climática (otoño) | Marco natural de la línea 2. Concentra presupuesto y visibilidad. |
| **Convocatorias de ayudas a entidades locales** | Financiación para acciones de sostenibilidad | Determina la ventana de contratación: ver `docs/04-calendario-institucional.md`. |
| **Ingurugela / CEIDA** | Centros de educación e investigación ambiental del sistema educativo vasco | Puerta a los centros escolares y validador pedagógico. |

**EUDEL** (asociación de municipios vascos) es el otro foro transversal: sus grupos de trabajo y jornadas reúnen a personal técnico y político de toda la CAPV.

---

## 5. Priorización de la cartera

No todos los 251 municipios valen lo mismo. Criterios de puntuación para ordenar el esfuerzo comercial:

| Criterio | Peso | Por qué |
|---|---|---|
| Adhesión a Udalsarea 2030 / Agenda 2030 Local | Alto | Tienen obligación de programar y presupuesto asignado |
| Población entre 5.000 y 50.000 hab. | Alto | Presupuesto suficiente para una campaña real, estructura pequeña que valora el llave en mano |
| Proximidad a Sopela / Bizkaia costa e interior | Alto | Coste logístico del módulo y de la maquinaria |
| Pertenencia a mancomunidad activa en sensibilización | Alto | Multiplicador: un contrato, varios municipios |
| Indicadores de recogida selectiva mejorables | Medio | Argumento de diagnóstico y urgencia |
| Antecedente de contratación de servicios similares | Medio | Mercado probado; se sabe qué se paga |
| Relación previa o prescriptor identificado | Máximo | Es el activo A3 del loop; corta el ciclo de venta |
| Municipio > 50.000 hab. (capitales, grandes) | Medio-bajo al inicio | Presupuesto alto pero licitación compleja: entrar cuando esté resuelto el bloque E2 del diagnóstico |
| Municipio < 1.000 hab. | Bajo individualmente | Abordar **agrupados vía cuadrilla o mancomunidad**, nunca de uno en uno |

**Regla de foco del primer año:** concentrarse en **una comarca** hasta tener tres casos documentados en ella, en lugar de dispersar por toda la CAPV. La prescripción es geográfica y comarcal: los técnicos de una mancomunidad hablan entre sí mucho más que con los de la otra punta de Euskadi.

---

## 6. Fuentes de datos abiertas para la estación ①

| Fuente | Qué aporta |
|---|---|
| **Open Data Euskadi** | Datos ambientales, residuos, indicadores municipales |
| **Udalmap** | Indicadores municipales de sostenibilidad comparados |
| **Eustat** | Población, estructura socioeconómica, series |
| **Memorias de mancomunidades y consorcios** | Toneladas por fracción y por municipio: el dato más potente para el diagnóstico |
| **Perfiles de contratante y Kontratazio Publikoa Euskadi** | Qué se ha contratado, a quién y por cuánto |
| **BOPV, BOB, BOG, BOTHA** | Convocatorias, presupuestos, bases de subvención |
| **Webs municipales: plan de mandato, actas de pleno, presupuesto** | Prioridades políticas y dinero disponible |
| **Ihobe / Udalsarea 2030** | Municipios adheridos, buenas prácticas, programación |

Estas fuentes son públicas y estables: son la materia prima del radar automatizado descrito en `loop/LOOP-MAESTRO.md` §6.
