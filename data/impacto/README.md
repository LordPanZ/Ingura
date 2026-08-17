# Base de impacto

Aquí se vuelca la evidencia de cada campaña (estación ④ del loop maestro), una carpeta por campaña:

```
data/impacto/{{año}}-{{municipio}}-{{linea}}/
    sesiones.csv      una fila por sesión (desde plantillas/ficha-sesion-evidencia.md)
    encuestas.csv     una fila por tarjeta recogida
    nivel4.csv        datos de recogida facilitados por la mancomunidad, 3-6 meses después
    notas.md          registro cualitativo, citas y aprendizajes
```

**Los `.csv` de esta carpeta están excluidos por `.gitignore`.** Aunque las encuestas se diseñan
anónimas, los datos de campo no deben viajar en un repositorio de código. Se guardan en el
almacenamiento interno de la empresa; aquí sólo vive la estructura y los resultados agregados.

Columnas de `encuestas.csv`:

```
campana,fecha,sesion,taller,conoce_pre,habito_pre,canal,primera_vez,conoce_post,compromiso,nps,comentario
```
