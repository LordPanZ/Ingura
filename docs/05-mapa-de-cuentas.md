# 05 · Mapa de cuentas

**Universo objetivo: 300 cuentas**, todas a menos de 90 minutos. No se sale de
Euskadi (+ Navarra occidental) hasta que el Loop funcione.

| Segmento | Nº cuentas | Producto principal | Prioridad |
|---|---|---|---|
| Ayuntamientos | 100 | P2 Herria, P1 Eskola | A |
| Mancomunidades, cuadrillas y consorcios de residuos | 20 | P2 Herria | A |
| Centros escolares (Infantil/Primaria/ESO) | 120 | P1 Eskola | B |
| Asociaciones de comercio y hostelería | 25 | P3 Merkataritza | B |
| Empresas y cooperativas | 30 | P4 Lantegia | B |
| Otros (fundaciones, entidades sociales, colegios profesionales, museos) | 5 | P4, P5 | C |

---

## 🔴 Grupo 0 · Clientes dormidos — **Operación Retorno** (semana 1)

**Muskiz, Barrika, Berango** y cualquier otro municipio o centro donde Ingura
haya trabajado entre 2022 y 2025.

Es la acción con mejor retorno de todo el plan y cuesta tres llamadas:

1. **Reconstruir la lista completa** de todo lo facturado desde 2022: entidad,
   persona, qué se hizo, cuándo, cuánto.
2. **Memoria retrospectiva** de una página por cliente: "esto hicimos con
   vosotros, estos datos salieron". Aunque hayan pasado dos años. Aunque no se
   recogieran datos entonces: se reconstruye con lo que haya (fechas, centros,
   participantes aproximados, fotos).
3. **Llamada honesta**: *"Hola X, soy de Ingura. Estamos preparando la
   programación del curso y me acordé del taller que hicimos en 2023. Te mando
   un resumen de aquello y la ficha del proyecto que podéis meter en la orden de
   subvenciones que se abre a finales de septiembre. ¿Te viene bien que te llame
   el martes 10 minutos?"*

**Objetivo: 3 de estos clientes reactivados antes del 31 de octubre.** Ahí hay
entre 10.000 y 20.000 € que ya están casi ganados.

---

## 🟠 Grupo A · Cuentas prioritarias (120)

### Criterios para que una cuenta sea A
- Municipio de **más de 3.000 habitantes** (por debajo, rara vez hay partida
  propia suficiente) **o** mancomunidad/consorcio.
- Señal reciente: ha contratado educación ambiental, ha pedido la subvención, ha
  publicado una campaña, tiene Agenda 2030 Escolar activa en sus centros.
- Persona identificada con nombre y cargo.

### Dónde concentrarse geográficamente
1. **Uribe Kosta y margen derecha (Bizkaia)** — donde ya se ha trabajado
   (Barrika, Berango). Entrar por el vecino de un cliente satisfecho es el
   camino más corto. La mancomunidad de la comarca es una sola venta que cubre
   varios municipios.
2. **Margen izquierda / Zona Minera (Bizkaia)** — Muskiz como referencia; alta
   densidad de población y tradición de programas ambientales.
3. **Donostialdea y comarcas de Gipuzkoa** — sede de la empresa; hay que estar
   presente en el propio territorio, que hoy está desatendido.
4. Consorcios y entes de residuos de ambos territorios: una sola cuenta que
   programa acciones en muchos municipios a la vez. **Máxima prioridad por
   euro de esfuerzo.**

### Los cargos a los que hay que llegar
| Cargo | Qué le importa | Producto |
|---|---|---|
| Técnico/a de Medio Ambiente | Cumplir el plan, justificar la subvención, no tener marrones | P2, P1 |
| Técnico/a de Educación | Que los centros estén contentos | P1 |
| Agente de desarrollo local / comercio | Dinamizar el comercio, tener algo que enseñar | P3 |
| Técnico/a de Juventud y Cultura | Llenar el programa de fiestas y vacaciones | P5 |
| Concejal/a del área | Salir en la foto con un dato bueno | Todos |
| Dirección / coordinación de Agenda 2030 en el centro | Tener el programa del curso resuelto | P1 |
| Responsable de calidad/medio ambiente o RRHH en empresa | Contenido para la memoria de sostenibilidad | P4 |

**Regla:** en un ayuntamiento hay que tener **dos contactos**, no uno. Un técnico
y un cargo político, o dos áreas distintas. Los técnicos cambian de puesto y con
ellos se va el cliente.

---

## 🟡 Grupo B · Cuentas de volumen (150)

Centros escolares y comercio. Ciclo corto, ticket menor, se trabajan por
**campañas de email masivo segmentado** en las ventanas V1 y V3, no una a una.

Atajo importante: **no vendas a un centro, vende el municipio entero**. Una
propuesta al ayuntamiento para cubrir sus 4 centros vale lo mismo de esfuerzo
comercial que una propuesta a un colegio y factura 4 veces más.

---

## 🟢 Grupo C · Diversificación (30)

Empresas y entidades privadas. Objetivo estratégico: **llegar al 25 % de
facturación privada en el año 2** para dejar de depender del calendario
presupuestario público, que es lo que ha dejado a Ingura a cero.

Vías de entrada:
- Empresas con **ISO 14001 / Ekoscan / memoria de sostenibilidad** publicada: ya
  han demostrado que gastan dinero en esto.
- Cooperativas y grupos con políticas de RSC y presupuesto de formación interna.
- **Días de equipo**: el escape room es un producto de team building ambiental
  que se vende sin ninguna justificación técnica, solo por ser bueno.
- Polígonos y asociaciones empresariales: una charla a la asociación = 20 leads.

---

## Cómo se construye la lista (semana 1, 6 horas)

1. Listado oficial de municipios de Bizkaia y Gipuzkoa → filtrar por población.
2. Web de cada ayuntamiento → área de Medio Ambiente → nombre, email, teléfono.
3. Consulta de **contratos menores adjudicados** en la Plataforma de Contratación
   del Sector Público y en KontratazioA: revela quién ha comprado educación
   ambiental, a quién y por cuánto. Es la fuente más infravalorada que existe.
4. Resoluciones de concesión de las subvenciones a entidades locales de años
   anteriores: **la lista de los ayuntamientos que ya piden dinero para esto**.
5. Centros adheridos a Agenda 2030 Escolar por municipio.
6. Volcar todo a [data/pipeline.csv](../data/pipeline.csv) e importarlo al CRM.

No hace falta que las 300 estén el primer día. Hacen falta **40 cuentas A el
viernes de la semana 1** para poder empezar a llamar el lunes siguiente.
