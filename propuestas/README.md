# Propuestas

Propuestas enviadas y en preparación. Una por institución y ejercicio:

```
propuestas/{{año}}-{{municipio}}-{{objeto}}.md
```

## Propuesta tipo

[`2026-sopela-propuesta-tipo.md`](2026-sopela-propuesta-tipo.md) es la **propuesta de referencia**: está construida con los datos públicos reales de Sopela y sirve de modelo para cualquier otro municipio. Su Anexo B explica qué se mantiene y qué se sustituye al reutilizarla.

## Cómo se construye una propuesta

1. Partir de `plantillas/propuesta-tecnica.md`, no de una propuesta anterior en bruto.
2. Cargar los datos del municipio desde las fuentes abiertas de `docs/03-mapa-institucional-euskadi.md` §6.
3. Escribir el apartado 1 (**punto de partida**) desde cero, con los datos de ese municipio. Es el único apartado que nunca se copia.
4. Ensamblar los apartados de programa con los módulos de `docs/05-catalogo-servicios.md`. Si hace falta inventar un servicio nuevo, o es una oportunidad de producto —y entonces entra en el catálogo— o es una distracción —y entonces se declina.
5. Comprobar que están las tres capas: ciudadana, técnica y **justificativa**. La tercera cierra la venta.
6. Tarifar los siete componentes de coste de `docs/09-modelo-economico.md` §2, la distancia incluida.
7. Pasar el checklist final de la plantilla y registrar el envío en el CRM.

**Objetivo de tiempo de elaboración:** 3 horas para una propuesta estándar. Si cuesta más, falta memoria base reutilizable.

## Regla sobre los datos

Toda cifra de un municipio va con **fuente y fecha**, y las que no se hayan confirmado en fuente primaria van marcadas hasta que se confirmen. Un dato antiguo o inventado en una propuesta resta credibilidad en lugar de sumarla — y en un mercado donde el personal técnico conoce sus propios números mejor que nadie, se detecta de inmediato.

## Formatos de la propuesta de Sopela

| Fichero | Qué es | Cuándo se usa |
|---|---|---|
| `2026-sopela-propuesta-tipo.md` | Propuesta completa en markdown, con anexo de fuentes | Documento de trabajo y modelo para otros municipios |
| `2026-sopela-propuesta-tipo.html` | La misma, maquetada como dossier con aparato marginal de fuentes | Lo que se envía al expediente: lleva la justificación completa |
| `2026-sopela-dossier-breve.html` | Versión corta y visual, con fotografía de campaña | Primera reunión y *leave-behind*. Se enseña, no se lee |
| `2026-sopela-dossier-breve.tpl.html` | Plantilla del anterior, con marcadores `__IMG_*__` | Para regenerar el breve con otras fotos |

**Regenerar el dossier breve** (incrusta las fotos como data URI, necesario porque la página tiene que ser autónoma):

```bash
python3 - <<'PY'
import base64, os
IMG = 'web/img'
m = {'__IMG_MODULO__':'modulo-calle.jpg', '__IMG_BOLSA__':'bolsa-organico.jpg',
     '__IMG_ESCOLARES__':'escolares-modulo.jpg', '__IMG_CENTRO__':'centro-residuos.jpg',
     '__IMG_DEMO__':'demostracion-clima.jpg', '__IMG_COMERCIO__':'comercio-local.jpg',
     '__IMG_HOSTELERIA__':'hosteleria.jpg'}
s = open('propuestas/2026-sopela-dossier-breve.tpl.html').read()
for k, f in m.items():
    b = base64.b64encode(open(os.path.join(IMG, f), 'rb').read()).decode()
    s = s.replace(k, 'data:image/jpeg;base64,' + b)
assert '__IMG_' not in s, 'quedan marcadores sin sustituir'
open('propuestas/2026-sopela-dossier-breve.html', 'w').write(s)
PY
```

> **Nota sobre las fotos.** Los originales del catálogo son pequeños (el mayor, 435 px de ancho). Por eso en el dossier breve sólo la del módulo va a sangre, con velo oscuro que disimula el reescalado, y el resto van en tarjetas a tamaño cercano al original. Si se consiguen versiones de más resolución, se pueden usar más grandes.
