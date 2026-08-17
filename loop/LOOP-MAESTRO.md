# EL LOOP MAESTRO DE INGURA

> El sistema que convierte cada campaña ejecutada en la razón por la que llega la siguiente.

---

## 0. Por qué un loop y no un plan

Un plan comercial clásico funciona así: prospectar → vender → ejecutar → volver a prospectar desde cero. Cada campaña es un evento aislado y el coste de conseguir la siguiente es siempre el mismo.

El sector en el que opera INGURA —ayuntamientos, mancomunidades y cuadrillas de la CAPV— tiene tres características que hacen que ese modelo sea el peor posible:

1. **Es un mercado cerrado y finito.** 251 municipios, ~40 mancomunidades y consorcios, 3 diputaciones, 7 cuadrillas alavesas, Ihobe y las redes que coordina. No se puede crecer captando "más mercado": hay que crecer profundizando.
2. **Los compradores se conocen entre sí.** El personal técnico de medio ambiente municipal se encuentra en Udalsarea 2030, en jornadas de Ihobe, en las comisiones de mancomunidad y en los grupos de EUDEL. Lo que se dice de un proveedor circula sin fricción.
3. **La compra es defendible, no impulsiva.** Un técnico municipal no compra lo que le gusta: compra lo que puede justificar ante su concejalía, ante intervención y, si hay subvención, ante Ihobe o la diputación. **La justificación es el producto.**

De esas tres características se deduce el motor: **si cada campaña genera evidencia que el cliente puede usar para justificarse, y esa evidencia es pública y circula entre personas que se conocen, la siguiente campaña llega sola.** Eso es un loop, no un embudo.

---

## 1. El loop en una imagen

```
                       ┌──────────────────────────────────────────────────┐
                       │                                                  │
                       ▼                                                  │
        ┌───────────────────────────┐                                     │
        │  ①  ESCUCHA               │   Radar institucional:              │
        │     Entzun                │   plan de legislatura, presupuesto, │
        │                           │   convocatoria, dato de reciclaje   │
        └────────────┬──────────────┘                                     │
                     ▼                                                    │
        ┌───────────────────────────┐                                     │
        │  ②  PROPUESTA             │   Oferta modular precalificada +    │
        │     Proposamena           │   memoria técnica reutilizable +    │
        │                           │   encaje con la convocatoria        │
        └────────────┬──────────────┘                                     │
                     ▼                                                    │
        ┌───────────────────────────┐                                     │
        │  ③  EJECUCIÓN             │   Metodología de 6 fases.           │
        │     Egikaritzea           │   Calidad constante, no heroica.    │
        └────────────┬──────────────┘                                     │
                     ▼                                                    │
        ┌───────────────────────────┐                                     │
        │  ④  EVIDENCIA             │   La sesión se mide mientras        │
        │     Frogak                │   ocurre. Nunca a posteriori.       │
        └────────────┬──────────────┘                                     │
                     ▼                                                    │
        ┌───────────────────────────┐                                     │
        │  ⑤  DEVOLUCIÓN            │   Informe que el técnico puede      │
        │     Itzulketa             │   presentar SIN retocar: a pleno,   │
        │                           │   a intervención, a Ihobe.          │
        └────────────┬──────────────┘                                     │
                     ▼                                                    │
        ┌───────────────────────────┐                                     │
        │  ⑥  PRESCRIPCIÓN          │   Caso publicado + el técnico lo    │
        │     Gomendioa             │   cuenta en Udalsarea / mancomunidad │
        └────────────┬──────────────┘                                     │
                     │                                                    │
                     └────────────────────────────────────────────────────┘
                            vuelve a ① con más autoridad y menos coste
```

**La regla del loop:** ninguna estación se salta. Una campaña ejecutada de la que no se extrae evidencia (④) y no se devuelve informe presentable (⑤) no es media campaña: es una campaña que **rompe el loop** y obliga a empezar el ciclo siguiente desde cero.

---

## 2. Los cuatro activos que acumula cada vuelta

El loop no gira en el vacío: cada vuelta deposita algo que la vuelta siguiente puede gastar. Estos cuatro activos son los que ningún competidor puede comprar ni improvisar, y son la definición operativa de "empresa de referencia".

| # | Activo | Qué es en la práctica | Dónde vive | Efecto en la vuelta siguiente |
|---|---|---|---|---|
| **A1** | **Datos** | Base propia de impacto: participantes, perfiles, procedencia, cambio declarado de hábito, coste por persona alcanzada — por municipio y por taller | `data/impacto/` | Permite **prometer cifras** en la propuesta en vez de adjetivos. Sube la tasa de adjudicación. |
| **A2** | **Casos** | Biblioteca de referencias documentadas: contexto, intervención, resultado, cita del técnico, fotos con consentimiento | `docs/casos/` | Es la prueba social que el técnico enseña a su concejalía. Acorta el ciclo de decisión. |
| **A3** | **Prescriptores** | Personas técnicas municipales que recomiendan a INGURA sin que se les pida | CRM, campo `prescriptor` | Genera entrada en municipios donde INGURA no tiene puerta. Coste de captación ≈ 0. |
| **A4** | **Encaje** | Memoria técnica, certificados de buena ejecución, solvencia acreditada, mapeo con ODS y convocatorias | `plantillas/` + `docs/06` | Reduce de días a horas el coste de preparar una licitación. Permite competir donde otros no llegan. |

> **Test de salud del loop:** si al terminar una campaña no ha crecido ninguno de los cuatro activos, el loop ha girado en falso. Esa campaña ha sido facturación, no construcción.

---

## 3. Las seis estaciones, en detalle

### ① ESCUCHA · *Entzun*

**Objetivo:** saber antes que nadie qué necesita cada institución y cuándo va a poder pagarlo.

No es prospección. Es inteligencia institucional sostenida sobre un mercado finito y público, cuyos datos son abiertos por obligación legal.

**Qué se vigila, y dónde:**

| Señal | Dónde se encuentra | Qué anticipa |
|---|---|---|
| Plan de legislatura / plan de mandato | Web municipal, actas de pleno | Prioridades a 4 años |
| Presupuesto municipal anual | Perfil de contratante, BOB/BOG/BOTHA | Partida disponible en medio ambiente |
| Adhesión a Udalsarea 2030 y Agenda 2030 Local | Ihobe / Udalsarea | Obligación de programar acciones |
| Convocatorias de subvención (Gobierno Vasco, Ihobe, diputaciones) | Boletines oficiales, `euskadi.eus` | Ventana de contratación con financiación |
| Datos de recogida selectiva del municipio | Open Data Euskadi, Udalmap, memorias de mancomunidad | El argumento del diagnóstico |
| Licitaciones y contratos menores publicados | Plataforma de Contratación, Kontratazio Publikoa Euskadi | Quién compra qué, a quién y por cuánto |
| Rotación del personal técnico | Boletines, LinkedIn | Momento de reintroducirse |

**Salida de la estación:** una ficha viva por institución objetivo (ver `data/municipios-objetivo.csv`) con: estado, persona de contacto, última interacción, señal detectada, próxima ventana.

**Automatizable:** sí, en gran parte. Ver §6.

---

### ② PROPUESTA · *Proposamena*

**Objetivo:** que preparar una propuesta cueste horas, no días, y que la propuesta esté escrita en el idioma de quien tiene que aprobarla.

**Las tres capas de toda propuesta INGURA:**

1. **Capa ciudadana** — qué va a vivir la persona que se acerque al módulo. Es lo que emociona a la parte política.
2. **Capa técnica** — metodología, aforos, materiales, equipo, calendario, medición. Es lo que tranquiliza a la parte técnica.
3. **Capa justificativa** — encaje con ODS, con la Agenda 2030 Local, con la convocatoria de subvención concreta y con los criterios de adjudicación del pliego. **Es la capa que cierra la venta y la que casi nadie escribe.**

**Regla de oro:** la propuesta se construye **ensamblando módulos existentes**, nunca escribiendo desde cero. Las siete líneas de servicio son piezas; cada propuesta es una combinación. Si una propuesta requiere inventar un servicio nuevo, o bien es una oportunidad de producto (y entonces se añade al catálogo) o bien es una distracción (y entonces se declina).

**Salida:** propuesta técnica + económica desde `plantillas/propuesta-tecnica.md`, y si es licitación, memoria desde `plantillas/memoria-tecnica-licitacion.md`.

---

### ③ EJECUCIÓN · *Egikaritzea*

**Objetivo:** que la calidad no dependa de quién dinamice.

Se ejecuta la metodología de 6 fases que ya está en el catálogo (contacto → contenidos → validación → difusión → desarrollo → cierre). El loop añade una sola exigencia sobre lo que ya se hace: **cada sesión tiene una hoja de sesión** (`plantillas/ficha-sesion-evidencia.md`) que se rellena *durante* la sesión, no después.

Esa hoja es la bisagra entre ejecutar y construir activo. Sin ella, la estación ④ es imposible.

---

### ④ EVIDENCIA · *Frogak*

**Objetivo:** convertir una actividad en un dato defendible.

Este es el punto donde INGURA se separa del resto del sector. La mayoría de proveedores de educación ambiental entregan una memoria con fotos y número de asistentes. Eso no es evidencia: es un parte de actividad.

**Los cuatro niveles de evidencia** (cada campaña debe alcanzar al menos el nivel 3):

| Nivel | Qué mide | Cómo se captura | Ejemplo |
|---|---|---|---|
| 1 · Alcance | Cuánta gente | Conteo por franja horaria | 330 personas en una semana |
| 2 · Perfil | Quién | Muestreo rápido: edad, barrio, euskera/castellano, primera vez o repite | 41 % repetidores; 58 % atención en euskera |
| 3 · Cambio declarado | Qué dicen que van a cambiar | 3 preguntas antes / 3 después, en tarjeta o QR | 7 de cada 10 dicen que separarán el aceite |
| 4 · Cambio observado | Qué cambió de verdad | Cruce con datos de recogida de la mancomunidad, 3-6 meses después | +X kg/hab de aceite recogido en el trimestre posterior |

El nivel 4 es el que crea un caso irrebatible. Requiere pactar con la mancomunidad el acceso al dato **en el momento de firmar el contrato**, no al final. Debe ser una cláusula estándar de toda propuesta.

**Salida:** registro estructurado en `data/impacto/` + material gráfico con consentimiento firmado.

---

### ⑤ DEVOLUCIÓN · *Itzulketa*

**Objetivo:** entregar al técnico municipal un documento que pueda reenviar sin tocar una coma.

Regla de diseño del informe final: **el técnico que lo recibe no debería tener que trabajar sobre él.** Debe poder:

- reenviarlo a su concejal/a y que se entienda en 2 minutos (resumen ejecutivo de 1 página, bilingüe);
- copiar dos gráficos y tres cifras a la memoria anual del área;
- adjuntarlo como justificación técnica a la subvención de Ihobe o de la diputación;
- llevarlo a una sesión de Udalsarea 2030 y no pasar vergüenza.

Y una pieza más, que casi nunca se pide y siempre se agradece: **una página de recomendaciones para el año siguiente**, con lo que se ha detectado en la calle. Ahí es donde nace, sin venderla, la campaña siguiente.

**Salida:** `plantillas/informe-final-campana.md` + reunión de cierre presencial + solicitud del **certificado de buena ejecución** (ver `plantillas/certificado-buena-ejecucion.md`). Este certificado se pide **siempre, en la reunión de cierre, mientras la satisfacción está caliente**. Pedirlo seis meses después es perderlo.

---

### ⑥ PRESCRIPCIÓN · *Gomendioa*

**Objetivo:** que el resultado circule por los canales donde se toman las decisiones del año siguiente.

Tres movimientos, en este orden:

1. **Caso publicado** (con permiso expreso de la institución): 1 página web + versión PDF bilingüe. Publicado en `docs/casos/` y en la web.
2. **Circulación institucional**: proponer al técnico presentar la experiencia en un grupo de trabajo de Udalsarea 2030, en una jornada de Ihobe o en la comisión de la mancomunidad. **Que lo cuente él o ella, no INGURA.** Un proveedor que se elogia a sí mismo vale cero; un técnico que elogia a su proveedor ante quince colegas vale una campaña.
3. **Contenido propio**: una publicación mensual (LinkedIn + web) con un aprendizaje real de campo, no promocional. El objetivo no es alcance: es que cuando alguien busque "sentsibilizazio kanpaina hondakinak" o "educación ambiental ayuntamiento Bizkaia", INGURA aparezca con contenido con criterio.

**Y el cierre del bucle:** cada caso publicado alimenta la estación ① — porque el municipio vecino que lo lee es la próxima señal del radar.

---

## 4. Las tres velocidades del loop

El loop maestro no gira a una sola velocidad. Gira a tres a la vez, y confundirlas es el error clásico.

```
  LOOP RÁPIDO      ── por campaña ──────  6-14 semanas   ── ejecuta y aprende
  LOOP MEDIO       ── por temporada ────  trimestral     ── ajusta oferta y precios
  LOOP LARGO       ── por curso/año ─────  anual          ── construye posición institucional
```

| | Loop rápido | Loop medio | Loop largo |
|---|---|---|---|
| **Unidad** | Una campaña | Un trimestre | Un curso institucional (sep–jul) |
| **Pregunta** | ¿Ha funcionado esta campaña? | ¿Está bien dimensionada la oferta? | ¿Es INGURA más referencia que hace un año? |
| **Salida** | Informe final + certificado | Ajuste de catálogo y tarifas | Memoria de impacto pública |
| **Riesgo si falla** | Cliente insatisfecho | Márgenes erosionados | Irrelevancia lenta |

---

## 5. El calendario del loop largo

El sector no compra cuando INGURA quiere vender: compra cuando su calendario institucional se lo permite. El loop largo se sincroniza con él.

| Periodo | Estación dominante | Qué se hace |
|---|---|---|
| **Sep – Oct** | ③ Ejecución | Arranque de curso escolar. Programas educativos en marcha. |
| **Nov** | ③ Ejecución (pico) | **Asteklima** y **Semana Europea de Prevención de Residuos**. Máxima concentración de actividad del año. |
| **Dic** | ④⑤ Evidencia + Devolución | Cierre de campañas de otoño, informes, certificados de buena ejecución. |
| **Ene – Feb** | ① Escucha + ② Propuesta | **Ventana crítica.** Presupuestos municipales aprobados, convocatorias de subvención publicadas. Aquí se decide el año. |
| **Mar – May** | ②③ Propuesta + Ejecución | Adjudicaciones y campañas de primavera. Comercio y hostelería. |
| **Jun** | ③ Ejecución + ④ Evidencia | Cierre de curso escolar, fiestas patronales, ferias. |
| **Jul** | ⑤⑥ Devolución + Prescripción | Informes de curso, publicación de casos, memoria anual de impacto. |
| **Ago** | ⑥ + mantenimiento | Producción de materiales, revisión de catálogo, mantenimiento de equipos. |

> **La regla de enero.** Si en enero y febrero INGURA está ejecutando en lugar de proponer, el año siguiente será peor que el actual. La capacidad de esos dos meses debe estar protegida para la estación ②.

---

## 6. Qué se automatiza y qué no

El loop es sostenible sólo si las estaciones ① y ④ dejan de consumir tiempo humano.

**Se automatiza:**

- **Radar de convocatorias y licitaciones**: alertas sobre boletines oficiales (BOPV, BOB, BOG, BOTHA) y perfiles de contratante con las palabras clave del sector (`sentsibilizazio`, `hezkuntza ambiental`, `hondakinak`, `educación ambiental`, `economía circular`, `Agenda 2030`).
- **Ficha de municipio**: extracción periódica de datos de recogida selectiva desde fuentes abiertas (Open Data Euskadi, Udalmap, Eustat, memorias de mancomunidad) para alimentar el diagnóstico de cada propuesta.
- **Captura de evidencia**: formulario móvil / QR por sesión que vuelca directamente a `data/impacto/`.
- **Ensamblado de propuesta**: generación del borrador combinando módulos del catálogo + datos del municipio + textos de encaje con la convocatoria.
- **Recordatorios del loop**: certificado de buena ejecución a los 7 días del cierre; contacto de reactivación a los 10 meses; alerta de ventana presupuestaria en enero.

**No se automatiza nunca:**

- La reunión de cierre presencial.
- La petición de prescripción.
- La adaptación real del contenido a la realidad del municipio.
- La atención directa a la ciudadanía en euskera.

---

## 7. Condiciones de arranque

El loop no puede empezar a girar hasta que estén resueltos los bloqueantes del diagnóstico (`docs/01-diagnostico-necesidades.md`, bloque **B**). En concreto, sin estos cuatro elementos el loop se rompe en su primera vuelta:

1. **Canal de contacto operativo** (dominio, correo profesional, teléfono, web) — sin esto no hay estación ①.
2. **Solvencia acreditable** (certificados de buena ejecución de trabajos ya realizados + inscripción en registro de licitadores) — sin esto no hay estación ②.
3. **Cumplimiento con menores y PRL** (certificados de delitos sexuales, seguro de RC, evaluación de riesgos de la maquinaria) — sin esto la estación ③ es un riesgo legal, no un servicio.
4. **Sistema de captura de evidencia** (hoja de sesión + consentimientos) — sin esto no hay estaciones ④⑤⑥, y por tanto no hay loop, sólo trabajos sueltos.

---

## 8. Cómo se sabe que el loop está girando

Ver `loop/tablero-loop.md` para el cuadro completo. Los tres indicadores que resumen todo:

| Indicador | Significado | Umbral de "el loop gira" |
|---|---|---|
| **Tasa de repetición institucional** | % de instituciones que contratan un segundo año | ≥ 60 % |
| **Origen de la demanda entrante** | % de oportunidades que llegan por prescripción o convocatoria, no por prospección fría | ≥ 50 % |
| **Casos publicables por año** | Campañas con evidencia de nivel 3+ y permiso de publicación | ≥ 4 |

Si los tres suben año contra año, INGURA se está convirtiendo en referencia. Si crece la facturación pero estos tres no se mueven, INGURA está trabajando mucho y construyendo poco.
