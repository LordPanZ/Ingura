# Plantilla · Encuesta a participantes (pre/post)

> Nivel 3 del marco de impacto. **Restricción de diseño: 60 segundos de la persona participante.** Ni uno más.
> Formato: tarjeta física A6 a doble cara, o QR a formulario móvil. Siempre bilingüe, euskera primero.
> Sin datos identificativos: la encuesta se diseña para ser anónima desde el origen y así evitar todo tratamiento de datos personales.

---

## Principios

1. **Tres preguntas antes, tres después.** Nunca más.
2. **El "antes" se hace al entrar**, mientras la persona espera. El "después", al recibir la plántula o la pieza fabricada — el momento en el que ya tiene algo en la mano y está dispuesta a colaborar.
3. **Preguntas cerradas.** Las abiertas no se rellenan y no se pueden agregar.
4. **La tarjeta es también un recuerdo**: con el claim, el logo de la institución y una información útil al dorso. Así se guarda en lugar de tirarse.
5. **Objetivo de tasa de respuesta: ≥ 30 %** de las personas atendidas.

---

## Cara A · ANTES (al entrar)

**HASI AURRETIK · ANTES DE EMPEZAR**

**1.** {{Pregunta de conocimiento específica del taller}}
*Adib. · Ej.: ¿Badakizu erabilitako olioa nora eraman behar den? · ¿Sabes dónde hay que llevar el aceite usado?*

☐ Bai / Sí ☐ Ez / No ☐ Ez nago ziur / No estoy seguro/a

**2.** {{Pregunta de hábito actual}}
*Ej.: ¿Separas actualmente esta fracción en casa?*

☐ Beti / Siempre ☐ Batzuetan / A veces ☐ Inoiz ez / Nunca

**3.** Nola izan duzu ekitaldi honen berri? · ¿Cómo te has enterado de esta actividad?

☐ Kartela / Cartel ☐ Udalaren webgunea edo sare sozialak / Web o redes del ayuntamiento
☐ Ikastetxea / La escuela ☐ Norbaitek gomendatu dit / Me lo ha recomendado alguien
☐ Prentsa / Prensa ☐ Hemendik pasatzen / Pasaba por aquí

**Lehen aldia da? · ¿Es tu primera vez en una actividad como esta?**  ☐ Bai / Sí ☐ Ez / No

---

## Cara B · DESPUÉS (al recibir la plántula o la pieza)

**ORAIN · AHORA**

**4.** {{Misma pregunta de conocimiento que la nº 1}}

☐ Bai / Sí ☐ Ez / No ☐ Ez nago ziur / No estoy seguro/a

**5.** Zer egingo duzu hemendik aurrera? · ¿Qué vas a hacer a partir de ahora? *(elige una)*

☐ {{Compromiso concreto 1 — p. ej. separar el aceite y llevarlo al punto de recogida}}
☐ {{Compromiso concreto 2 — p. ej. hablar de esto en casa}}
☐ {{Compromiso concreto 3 — p. ej. empezar a compostar}}
☐ Ez dut aldaketarik egingo / No voy a cambiar nada

**6.** Gomendatuko zenuke ekitaldi hau? · ¿Recomendarías esta actividad?

`0 1 2 3 4 5 6 7 8 9 10`  ☐☐☐☐☐☐☐☐☐☐☐

**Zerbait gehitu nahi duzu? · ¿Quieres añadir algo?** *(opcional, una línea)*
`_____________________________________________`

---

## Al dorso · el motivo para guardarla

Espacio con:
- El claim de la campaña
- El logo de la institución
- **Una información realmente útil**: qué va en cada contenedor del municipio, dónde está el garbigune más cercano y su horario, o el calendario de recogida
- Web municipal + web de INGURA

> Una tarjeta con información útil se pega en la nevera. Una tarjeta con publicidad se tira en la papelera de la esquina. Es la diferencia entre un impacto de un día y uno de un año.

---

## Variantes por taller

Cada taller sustituye las preguntas 1/4 y los compromisos de la 5:

| Taller | Pregunta de conocimiento | Compromisos ofrecidos |
|---|---|---|
| **Aceite usado** | ¿Sabes dónde llevar el aceite doméstico usado? | Guardar y llevar el aceite al punto de recogida / No tirarlo por el fregadero / Contarlo en casa |
| **Papel y cartón** | ¿Sabes qué papel NO se puede reciclar? | Separar mejor / Reutilizar antes de reciclar / Reducir impresión |
| **Plásticos** | ¿Sabrías distinguir dos tipos de plástico? | Fijarme en el símbolo antes de comprar / Separar mejor los envases / Reducir el plástico de un solo uso |
| **Orgánico y compostaje** | ¿Sabes qué pasa con los restos de comida de tu municipio? | Usar el contenedor marrón / Solicitar compostadora / Reducir el desperdicio |
| **Textil** | ¿Sabes cuánta ropa se tira al año por persona? | Reparar antes de tirar / Llevar al contenedor textil / Comprar menos y mejor |
| **Cocina de aprovechamiento** | ¿Cuánta comida se desperdicia en los hogares? | Planificar la compra / Aprovechar sobras / Interpretar bien las fechas de caducidad |
| **Juegos reciclados** | ¿Qué se puede fabricar con lo que tiramos? | Reutilizar antes de comprar / Reparar juguetes / Hacer un juego en casa |

---

## Versión escolar (línea 4)

Adaptaciones para grupos de Primaria y Secundaria:

- Se pasa **al grupo completo** por levantar la mano, con recuento del dinamizador/a: mucho más rápido y con tasa de respuesta del 100 %.
- Lenguaje adaptado al ciclo.
- Se añade una pregunta de **transferencia al hogar**: *«¿Vas a contar esto en casa?»* — el indicador que más interesa a la institución, porque cada niño o niña es una vía de entrada a una familia.
- En programas con acompañamiento, se repite la misma encuesta en la sesión de evaluación meses después: es la única forma de medir persistencia.

---

## Vaciado y agregación

1. Recuento de tarjetas el mismo día de la sesión.
2. Volcado a `data/impacto/{{campaña}}/encuestas.csv` con una fila por tarjeta.
3. Cálculo automático de: variación de conocimiento (pp), % con compromiso concreto, NPS, distribución de canal de difusión, % de repetición.
4. Los resultados agregados alimentan el informe final (apartado 4) y la base histórica de impacto.

**Columnas del CSV:**

```
campana,fecha,sesion,taller,conoce_pre,habito_pre,canal,primera_vez,conoce_post,compromiso,nps,comentario
```
