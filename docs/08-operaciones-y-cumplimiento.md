# Operaciones y cumplimiento

> Lo que hace que la estación ③ del loop sea un servicio y no un riesgo.

> ⚠️ Este documento organiza obligaciones y buenas prácticas. No sustituye al asesoramiento del servicio de prevención, de la asesoría jurídica ni del delegado de protección de datos.

---

## 1. Trabajo con menores — no negociable

El catálogo trabaja con público desde 8 años, con Primaria, con Secundaria y con eco-delegados/as. Eso activa un conjunto de obligaciones que no admiten excepción ni prisa.

| Requisito | Alcance | Control |
|---|---|---|
| **Certificación negativa del Registro Central de Delincuentes Sexuales** | **Toda** persona con contacto con menores: plantilla, colaboradores freelance, personal de refuerzo puntual | Registro con fecha de emisión y alerta de renovación. Sin certificado vigente, no se entra a un centro escolar. |
| **Protocolo de actuación con menores** | Ratios de acompañamiento, uso de baños, actuación ante lesión, ante conflicto, ante sospecha de desprotección | Documento escrito, entregado y firmado por cada dinamizador/a |
| **Seguro de RC con cobertura de actividades con menores** | Explícita en la póliza, no presunta | Revisión anual de póliza |
| **Consentimiento de imagen de tutores legales** | Cualquier fotografía o vídeo con menores identificables | Archivo por campaña; sin consentimiento, no se publica |
| **Coordinación con el centro educativo** | Persona responsable del centro presente durante la actividad | Acta o correo de confirmación |

---

## 2. Prevención de riesgos por taller

El equipamiento propio es el mayor activo de INGURA y su mayor concentración de riesgo. Cada taller necesita ficha de seguridad propia.

| Taller | Riesgos principales | Medidas mínimas |
|---|---|---|
| **Gestión de plásticos** (extrusora-inyectora) | Quemaduras por contacto y por material fundido; emisiones y humos de la fusión; atrapamiento en la trituradora; ruido | Ventilación forzada o extracción localizada; barrera física y distancia de seguridad para el público; manipulación de la máquina **exclusivamente** por personal formado; guantes térmicos y gafas; extintor accesible; no operar en espacio cerrado sin renovación de aire |
| **Aceite usado → jabón** | **Sosa caústica**: quemaduras químicas, salpicaduras, reacción exotérmica | Sosa preparada y manipulada **solo** por personal, fuera del alcance del público; EPIs (guantes, gafas, delantal); fuente de agua accesible; ficha de datos de seguridad del producto en el montaje; los/las participantes trabajan con la mezcla ya estabilizada |
| **Velas** | Quemaduras por cera caliente y llama | Cera a temperatura controlada; manipulación del calor por personal; superficie estable e ignífuga |
| **Papel reciclado** | Resbalones por agua; corte con herramientas de encuadernación | Suelo protegido y señalizado; herramientas romas para menores |
| **Textil** | Pinchazos y cortes con agujas, tijeras, máquina de coser | Herramientas adaptadas a la edad; supervisión permanente; botiquín |
| **Cocina de aprovechamiento** | Higiene alimentaria; cortes; alérgenos | Manipulación de alimentos con formación acreditada; declaración de alérgenos visible; cadena de frío |
| **Compostaje** | Higiene; contacto con material orgánico | Guantes; lavado de manos; material en buen estado |
| **Módulo expositivo en calle** | Viento, anclaje, tropiezos, riesgo eléctrico en exterior | Anclaje y lastrado verificados; cableado protegido y diferencial; parte de montaje firmado; plan ante alerta meteorológica |

**Documentación obligatoria por campaña:** evaluación de riesgos, fichas de seguridad de productos, registro de entrega de EPIs, formación acreditada del equipo, botiquín, plan de emergencia con teléfonos y ubicación del centro sanitario más próximo.

---

## 3. Protección de datos

Tres tratamientos distintos, con obligaciones distintas:

| Tratamiento | Base y régimen | Obligación práctica |
|---|---|---|
| **Encuestas de participantes** | Consentimiento. Datos preferiblemente anónimos o anonimizados desde el origen | Cláusula informativa en la tarjeta o el formulario. Diseñar la encuesta para no necesitar identificación. |
| **Imágenes y vídeo** | Consentimiento expreso; de tutores legales si hay menores | Modelo firmado, archivado por campaña. Registro de qué imagen puede publicarse y dónde. |
| **Datos de comercios (línea 5)** | INGURA actúa como **encargada del tratamiento** por cuenta de la institución: recoge necesidades de negocios para trasladarlas a la administración | **Contrato de encargo de tratamiento** obligatorio como anexo. Medidas de seguridad, plazo de conservación y devolución/supresión al finalizar. |

Además: registro de actividades de tratamiento, política de privacidad publicada en la web y procedimiento de atención a derechos de las personas interesadas.

---

## 4. Compromiso lingüístico operativo

La prioridad al euskera no es un valor declarado: es un procedimiento.

- **Redacción primaria en euskera** y adaptación al castellano. No traducción automática de un original castellano.
- **Atención directa iniciada en euskera**, con cambio natural si la persona lo prefiere. Se **registra** el idioma de cada interacción (dato de nivel 2 del marco de impacto).
- **Perfil lingüístico acreditado** de cada persona del equipo, documentado en el kit de licitación.
- **Control de versiones bilingüe** de todo material: ninguna pieza sale a producción sin las dos versiones cerradas y revisadas por persona con competencia acreditada.
- Terminología ambiental coherente en euskera entre campañas: mantener un glosario propio.

---

## 5. Accesibilidad e inclusión

Puntúa en pliegos y es lo correcto:

- Módulo y talleres accesibles en silla de ruedas (alturas de mesa, rampa, espacio de giro).
- Materiales con contraste suficiente y tipografía legible; versión en lectura fácil de los mensajes clave.
- Adaptación de talleres para personas con diversidad funcional (herramientas adaptadas, ritmos, apoyo individual).
- Actividades sin coste para la persona participante y en horarios compatibles con la conciliación (mañana y tarde, como ya hace el catálogo).

---

## 6. Kits de taller: la clave de la escalabilidad

Para que la calidad no dependa de quién dinamice (riesgo R del diagnóstico), cada taller necesita un **kit cerrado**:

```
plantillas/kits/<taller>/
   guion-eus.md            Guion de dinamización en euskera (versión primaria)
   guion-es.md             Adaptación al castellano
   lista-materiales.md     Con cantidades por participante y punto de reposición
   ficha-seguridad.md      Riesgos, EPIs, procedimiento
   checklist-montaje.md    Montaje y desmontaje, con tiempos
   encuesta.md             Preguntas pre/post específicas del taller
   piezas-graficas/        Cartelería y material de apoyo, bilingüe
```

**Regla:** un taller no entra en el catálogo comercial hasta que su kit está completo. Vender lo que no está sistematizado es lo que convierte una campaña en una noche sin dormir.

---

## 7. Checklist de campaña

### Antes (fase 1–4 de la metodología)
- [ ] Contrato o encargo firmado, con cláusula de acceso a datos de impacto (nivel 4)
- [ ] Anexo de encargo de tratamiento firmado, si aplica
- [ ] Certificaciones de menores vigentes de todo el equipo asignado
- [ ] Evaluación de riesgos revisada para los talleres concretos de esta campaña
- [ ] Materiales bilingües validados por la institución (fase 3)
- [ ] Permisos de ocupación de vía pública y suministro eléctrico gestionados
- [ ] Calendario cerrado con centros, comercios o colectivos
- [ ] Difusión lanzada por los canales municipales
- [ ] Logística de módulo y maquinaria confirmada (transporte, montaje, seguro)
- [ ] Hojas de sesión, tarjetas de encuesta y consentimientos impresos y en el vehículo

### Durante (fase 5)
- [ ] Hoja de sesión rellenada **en cada sesión**, no al final de la semana
- [ ] Registro de idioma de atención
- [ ] Fotografías con consentimiento recogido en el momento
- [ ] Incidencias anotadas el mismo día
- [ ] Parte de montaje/desmontaje firmado

### Después (fase 6)
- [ ] Datos volcados a `data/impacto/`
- [ ] Informe final entregado en euskera y castellano
- [ ] Reunión de cierre presencial celebrada
- [ ] **Certificado de buena ejecución solicitado en esa reunión**
- [ ] Página de recomendaciones para el año siguiente entregada
- [ ] Permiso de publicación del caso solicitado
- [ ] Facturación emitida y registrada en el sistema de la administración
- [ ] Solicitud de datos de nivel 4 agendada (3–6 meses)
- [ ] Contacto de reactivación agendado (10 meses)
- [ ] Maquinaria revisada y kit repuesto

---

## 8. Coherencia ambiental propia

Una empresa que sensibiliza sobre huella ambiental está obligada a medir la suya, y no sólo por coherencia: puntúa.

- Cálculo de la **huella de carbono** propia, con foco en el desplazamiento del módulo y la maquinaria (que es el grueso).
- Criterios de compra: materiales reutilizados y reutilizables, impresión de proximidad y con criterios ambientales, eliminación progresiva de material promocional de un solo uso.
- Gestión de los residuos generados por los propios talleres.
- Valorar **Ekoscan** (esquema de Ihobe, accesible para empresa pequeña) como paso previo a ISO 14001.
- Publicar los resultados. Una empresa ambiental que publica su propia huella es creíble; una que no lo hace, no.
