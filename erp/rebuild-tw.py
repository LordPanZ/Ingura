#!/usr/bin/env python3
"""
Recompila el bloque de Tailwind empotrado en erp/index.html.

Necesario cada vez que se toca el marcado: el CSS va precompilado dentro del
fichero, así que una clase nueva no existe hasta que se vuelve a generar.

Para escanear se usa una copia sin las librerías empotradas (2,6 MB de JS
minificado dispararían miles de clases fantasma).
"""
import re, subprocess, sys, os

ERP = '/home/user/Ingura/erp/index.html'
AQUI = os.path.dirname(os.path.abspath(__file__))
MARCA = '<style>/* Tailwind CSS compilado para este fichero */'

s = open(ERP, encoding='utf-8').read()

# 1 · copia para escanear: fuera las librerías empotradas y el propio CSS
scan = s
for lib in ['xlsx.full.min.js', 'mammoth.browser.min.js', 'index.umd.js',
            'FileSaver.min.js', 'chart.umd.js']:
    ini = scan.find('<script>/* %s */' % lib)
    if ini == -1:
        continue
    fin = scan.index('</script>', ini) + len('</script>')
    scan = scan[:ini] + scan[fin:]

ini = scan.find(MARCA)
if ini != -1:
    fin = scan.index('</style>', ini) + len('</style>')
    scan = scan[:ini] + scan[fin:]

open(AQUI + '/scan.html', 'w', encoding='utf-8').write(scan)
print('copia de escaneo: %.0f KB (de %.1f MB)' % (len(scan) / 1024, len(s) / 1048576))

# 2 · compilar
open(AQUI + '/tw.config.js', 'w').write(
    "module.exports = { content: ['%s/scan.html'], theme: { extend: {} } };\n" % AQUI)
r = subprocess.run(['npx', 'tailwindcss', '-c', AQUI + '/tw.config.js',
                    '-i', AQUI + '/tw.in.css', '-o', AQUI + '/tw.css', '--minify'],
                   cwd=AQUI, capture_output=True, text=True)
if r.returncode:
    sys.exit('tailwind falló:\n' + r.stderr)
css = open(AQUI + '/tw.css', encoding='utf-8').read()
print('CSS generado: %.0f KB' % (len(css) / 1024))

# 3 · sustituir el bloque dentro del fichero real
ini = s.index(MARCA)
fin = s.index('</style>', ini) + len('</style>')
s = s[:ini] + MARCA + '\n' + css + '\n</style>' + s[fin:]
open(ERP, 'w', encoding='utf-8').write(s)
print('bloque de Tailwind actualizado · fichero: %.2f MB' % (len(s.encode()) / 1048576))
