# data/

## pipeline.csv

CRM de arranque. Impórtalo en Airtable, Notion o HubSpot Free y empieza a
trabajar con él el primer día. Las 8 primeras filas son el arranque real
(Operación Retorno + plantillas de cada segmento); el resto se rellena
construyendo las 300 cuentas del [mapa](../docs/05-mapa-de-cuentas.md).

### Campos

| Campo | Valores |
|---|---|
| `tipo` | ayuntamiento · mancomunidad · consorcio residuos · centro escolar · asociacion comercio · empresa · otro |
| `producto` | P1 Eskola · P2 Herria · P3 Merkataritza · P4 Lantegia · P5 Jolas |
| `prioridad` | A · B · C |
| `estacion_loop` | 1-Radar · 2-Lista · 3-Toque · 4-Diagnostico · 5-Propuesta · 6-Entrega · 7-Memoria |
| `estado` | Nueva · Reactivacion · En conversacion · Propuesta viva · Ganada · Perdida · Nutricion |
| `probabilidad` | 10 (contactada) · 30 (diagnóstico hecho) · 50 (propuesta enviada) · 80 (verbal) · 100 (firmada) |

### Las dos reglas

1. **Si no está aquí, no ha pasado.**
2. **Ninguna cuenta activa puede quedarse sin `proxima_accion` y sin
   `fecha_proxima_accion`.** Una cuenta sin fecha es una cuenta perdida.

### Fórmula del pipeline

`€ en propuestas vivas = Σ (importe_estimado × probabilidad/100)` para todo lo
que no esté en Ganada / Perdida / Nutricion. Es la métrica 5 del
[cuadro de mando](../docs/07-cuadro-de-mando.md).
