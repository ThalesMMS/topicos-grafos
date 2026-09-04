import assert from 'node:assert/strict';
import test from 'node:test';

import { CONFIG } from '../public/presentation.config.js';
import { slideMarkup } from '../public/assets/render.js';

const KNOWN_TYPES = new Set([
  'cover', 'section', 'statement', 'concept', 'graph', 'definition', 'question', 'trace',
  'table', 'code', 'compare', 'steps', 'exercise', 'list', 'quote', 'poll', 'closing'
]);

test('todo slide declara um tipo conhecido', () => {
  for (const [index, slide] of CONFIG.slides.entries()) {
    assert.ok(KNOWN_TYPES.has(slide.type), `slide ${index + 1}: tipo desconhecido "${slide.type}"`);
  }
});

test('todo diagrama referencia vértices existentes', () => {
  for (const [index, slide] of CONFIG.slides.entries()) {
    if (!slide.graph) continue;
    const ids = new Set(slide.graph.nodes.map(node => node.id));
    assert.equal(ids.size, slide.graph.nodes.length, `slide ${index + 1}: vértice duplicado`);
    for (const edge of slide.graph.edges || []) {
      assert.ok(ids.has(edge.from), `slide ${index + 1}: aresta parte de "${edge.from}", que não existe`);
      assert.ok(ids.has(edge.to), `slide ${index + 1}: aresta chega em "${edge.to}", que não existe`);
    }
  }
});

test('todo slide gera markup sem buraco de conteúdo', () => {
  for (const [index, slide] of CONFIG.slides.entries()) {
    const markup = slideMarkup(slide, { polls: CONFIG.polls, participantUrl: 'https://exemplo/participar/' });
    assert.ok(markup.includes('slide-content'), `slide ${index + 1}: markup vazio`);
    assert.ok(!markup.includes('undefined'), `slide ${index + 1}: campo ausente vazou como "undefined"`);
    assert.ok(!markup.includes('Enquete não encontrada'), `slide ${index + 1}: enquete inexistente`);
  }
});

test('todo slide que declara um diagrama de fato o desenha', () => {
  for (const [index, slide] of CONFIG.slides.entries()) {
    if (!slide.graph) continue;
    const markup = slideMarkup(slide, { polls: CONFIG.polls });
    assert.ok(markup.includes('<svg'), `slide ${index + 1} (${slide.type}): o diagrama declarado não foi renderizado`);
  }
});

test('o texto dos slides não injeta HTML cru', () => {
  const markup = slideMarkup(
    { type: 'statement', title: '<img src=x onerror=alert(1)>', description: '**ok**' },
    {}
  );
  assert.ok(!markup.includes('<img'));
  assert.ok(markup.includes('<strong>ok</strong>'));
});
