import assert from 'node:assert/strict';
import test from 'node:test';

import { CONFIG } from '../public/presentation.config.js';
import { graphSvg, nodeShape } from '../public/assets/graph-draw.js';

/** Todos os specs de grafo declarados no deck, com o número do slide. */
const diagramas = CONFIG.slides
  .map((slide, index) => ({ slide: index + 1, titulo: slide.title || slide.question, spec: slide.graph }))
  .filter(item => item.spec);

test('o rótulo cabe dentro da forma do vértice', () => {
  for (const { slide, spec } of diagramas) {
    for (const node of spec.nodes) {
      const texto = String(node.label ?? node.id);
      const { rx } = nodeShape(node);
      const largura = texto.length * 21 * 0.6;
      assert.ok(
        largura <= rx * 2 - 8,
        `slide ${slide}: o rótulo "${texto}" (${largura.toFixed(0)}px) não cabe na forma de ${(rx * 2).toFixed(0)}px`
      );
    }
  }
});

test('dois vértices nunca se sobrepõem', () => {
  for (const { slide, titulo, spec } of diagramas) {
    const nodes = spec.nodes;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const formaA = nodeShape(a);
        const formaB = nodeShape(b);
        // Sobreposição de retângulos envolventes, com folga mínima de 12px.
        const folgaX = Math.abs(a.x - b.x) - (formaA.rx + formaB.rx);
        const folgaY = Math.abs(a.y - b.y) - (formaA.ry + formaB.ry);
        assert.ok(
          folgaX >= 12 || folgaY >= 12,
          `slide ${slide} (${titulo}): "${a.id}" e "${b.id}" se sobrepõem `
          + `(folga x ${folgaX.toFixed(0)}px, y ${folgaY.toFixed(0)}px)`
        );
      }
    }
  }
});

test('a nota de um vértice não invade o vértice de baixo', () => {
  for (const { slide, spec } of diagramas) {
    for (const a of spec.nodes) {
      if (!a.note) continue;
      const formaA = nodeShape(a);
      const notaBase = a.y + formaA.ry + 28;
      const notaMeia = String(a.note).length * 17 * 0.6 / 2;
      for (const b of spec.nodes) {
        if (b === a) continue;
        const formaB = nodeShape(b);
        const colideVertical = b.y - formaB.ry < notaBase && b.y + formaB.ry > a.y + formaA.ry;
        const colideHorizontal = Math.abs(a.x - b.x) < notaMeia + formaB.rx;
        assert.ok(
          !(colideVertical && colideHorizontal),
          `slide ${slide}: a nota de "${a.id}" ("${a.note}") colide com o vértice "${b.id}"`
        );
      }
    }
  }
});

test('vértices com rótulo longo viram cápsula, curtos ficam círculo', () => {
  const curto = graphSvg({ nodes: [{ id: 'A', x: 100, y: 100 }] });
  assert.ok(curto.includes('<circle'), 'rótulo curto deveria ser círculo');

  const longo = graphSvg({ nodes: [{ id: 'Porto Velho', x: 100, y: 100 }] });
  assert.ok(longo.includes('<rect'), 'rótulo longo deveria virar cápsula');
  assert.ok(!longo.includes('<circle'), 'rótulo longo não deveria usar círculo');
});

test('o viewBox contém todos os vértices e suas notas', () => {
  for (const { slide, spec } of diagramas) {
    const svg = graphSvg(spec);
    const [minX, minY, largura, altura] = svg
      .match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    for (const node of spec.nodes) {
      const { rx, ry } = nodeShape(node);
      assert.ok(node.x - rx >= minX, `slide ${slide}: "${node.id}" sai pela esquerda`);
      assert.ok(node.x + rx <= minX + largura, `slide ${slide}: "${node.id}" sai pela direita`);
      assert.ok(node.y - ry >= minY, `slide ${slide}: "${node.id}" sai por cima`);
      assert.ok(node.y + ry <= minY + altura, `slide ${slide}: "${node.id}" sai por baixo`);
    }
  }
});
