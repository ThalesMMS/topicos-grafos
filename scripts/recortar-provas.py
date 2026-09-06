"""Recortes rasterizados dos PDFs, sem redesenhar enunciados ou alternativas.
Executar na raiz: python scripts/recortar-provas.py (requer pymupdf).
Coordenadas em pontos PDF; páginas abaixo são numeradas a partir de 1.
"""
from pathlib import Path
import json
import pymupdf

ROOT = Path(__file__).resolve().parents[1] / 'public' / 'provas'
CROPS = [
    ('enade-2021-q34', 'enade-2021-computacao-prova.pdf', 43, [25, 73, 542, 478]),
    ('enade-2023-q11', 'enade-2023-engenharia-prova.pdf', 15, [25, 73, 542, 525]),
    ('enade-2023-q32-grafo', 'enade-2023-engenharia-prova.pdf', 34, [25, 398, 542, 725]),
    ('enade-2023-q32-alternativas', 'enade-2023-engenharia-prova.pdf', 35, [25, 76, 542, 201]),
    ('poscomp-2012-q35', 'poscomp-2012-prova-sem-marcacoes.pdf', 14, [65, 443, 550, 732]),
    ('poscomp-2014-q37', 'poscomp-2014-prova-sem-marcacoes.pdf', 12, [65, 637, 540, 730]),
]
for name, filename, page, box in CROPS:
    with pymupdf.open(ROOT / filename) as doc:
        doc[page-1].get_pixmap(matrix=pymupdf.Matrix(3, 3), clip=pymupdf.Rect(box), alpha=False).save(ROOT / 'recortes' / (name + '.png'))
(ROOT / 'recortes' / 'manifesto.json').write_text(json.dumps([
    dict(image=name+'.png', pdf=filename, page=page, crop=box, dpi=216)
    for name, filename, page, box in CROPS
], ensure_ascii=False, indent=2), encoding='utf-8')
