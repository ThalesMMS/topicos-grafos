import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../public/presentation.config.js';
import { tracoBellmanFord, passosPrim, passosFluxo, passosWelsh } from '../public/slides/seminario/passos.js';
import { negativo } from '../public/slides/seminario/modelos.js';
import { dag, ponderado } from '../public/slides/equilibrada/modelos.js';

test('Bellman–Ford propaga atualizações imediatas e distingue ciclo alcançável', () => {
  const normal = tracoBellmanFord({ base: negativo, origem: 'S' });
  assert.equal(normal[0].rows.find(r => r[0] === 'A')[2], '1');
  assert.deepEqual(normal[1].rows.map(r => r.slice(1, 3)), [['0','0'], ['1','1'], ['5','5']]);
  assert.equal(normal.at(-1).note.kind, 'check');

  const ciclo = { ...negativo, edges: [...negativo.edges, { from: 'A', to: 'B', weight: 1 }] };
  assert.equal(tracoBellmanFord({ base: ciclo, origem: 'S' }).at(-1).note.kind, 'warn');

  const isolado = { ...ciclo, edges: ciclo.edges.filter(e => e.from !== 'S') };
  const passos = tracoBellmanFord({ base: isolado, origem: 'S' });
  assert.equal(passos.length, 1);
  assert.ok(passos[0].rows.filter(r => r[0] !== 'S').every(r => r[2] === '∞'));
  assert.notEqual(passos[0].note?.kind, 'warn');
});

test('a questão de associação cobra só algoritmos já apresentados; Kahn vem como extensão', () => {
  const pos = id => CONFIG.slides.findIndex(s => s.id === id);
  const questao = pos('poscomp_familias-pergunta');
  for (const id of ['p-kruskal-6', 'p-prim-5', 'topologica', 'kosaraju', 'fila-nao-e-bfs']) {
    assert.ok(pos(id) >= 0 && pos(id) < questao, id);
  }
  assert.ok(pos('p-kahn-1') > pos('poscomp_familias-resposta'));
  const dfs = CONFIG.slides[pos('topologica')].rows.at(-1)[1].split(', ');
  const kahn = CONFIG.slides[pos('p-kahn-6')].rows
    .slice().sort((a, b) => Number(a[2].match(/\d+/)[0]) - Number(b[2].match(/\d+/)[0])).map(r => r[0]);
  for (const ordem of [dfs, kahn]) {
    assert.equal(new Set(ordem).size, dag.nodes.length);
    for (const e of dag.edges) assert.ok(ordem.indexOf(e.from) < ordem.indexOf(e.to));
  }
});

test('referências por número aparecem apenas nos slides das próprias questões', () => {
  for (const slide of CONFIG.slides.filter(s => s.type !== 'question')) {
    assert.doesNotMatch(JSON.stringify(slide), /\bQ\s*\d+\b/i, slide.id);
  }
});

test('conceitos vêm antes de mecanismos e execuções', () => {
  const pos = id => CONFIG.slides.findIndex(s => s.id === id);
  const antes = (a, b) => assert.ok(pos(a) < pos(b), `${a} deveria vir antes de ${b}`);
  antes('alg-familias', 'alg-incidencia');
  antes('alg-adjacencia', 'representacao');
  antes('alg-percursos-basicos', 'bfs-regra');
  antes('dfs-regra', 'alg-dfs-regra');
  antes('union-find', 'p-kruskal-1');
  antes('topologica', 'poscomp_familias-pergunta');
  antes('kosaraju', 'poscomp_familias-pergunta');
  antes('alg-coloracao', 'p-cores-1');
  antes('alg-ordem-cores', 'p-welsh-1');
});

test('Welsh–Powell substitui o slide formal de A* e é executado por classes de cor', () => {
  const ids = new Set(CONFIG.slides.map(s => s.id));
  assert.ok(!ids.has('astar-adicional'));
  assert.equal(passosWelsh.length, 5);
  assert.match(passosWelsh[0].title, /D, A, B, C, E/);
  assert.deepEqual(passosWelsh.slice(1, 4).map(s => s.rows.filter(r => r[2].startsWith('entra')).map(r => r[0])), [
    ['D'], ['A', 'E'], ['B', 'C']
  ]);
  assert.match(passosWelsh.at(-1).description, /A, B e D formam uma clique/);
  assert.equal(CONFIG.slides.filter(s => /^p-welsh-/.test(s.id)).length, 5);
});

test('passos de Prim formam uma árvore conectada de custo 13', () => {
  const escolhidas = passosPrim.at(-1).graph.edges.filter(e => e.state === 'tree');
  assert.equal(escolhidas.length, ponderado.nodes.length - 1);
  assert.equal(escolhidas.reduce((s, e) => s + e.weight, 0), 13);
  const alcancados = new Set(['A']);
  for (let i = 0; i < ponderado.nodes.length; i++) {
    for (const e of escolhidas) {
      if (alcancados.has(e.from)) alcancados.add(e.to);
      if (alcancados.has(e.to)) alcancados.add(e.from);
    }
  }
  assert.equal(alcancados.size, ponderado.nodes.length);
});

test('Ford–Fulkerson mostra cada aumento e torna o cancelamento visível', () => {
  assert.equal(passosFluxo.length, 4);
  assert.match(passosFluxo[0].description, /começa em zero/i);
  assert.deepEqual(passosFluxo.map(s => s.rows.find(r => r[0] === 'A→B')[2]), ['2', '2', '2', '1']);
  assert.match(passosFluxo.at(-1).title, /corrige o fluxo anterior/i);
  assert.ok(passosFluxo.at(-1).graph.edges.some(e => e.from === 'A' && e.to === 'B' && e.state === 'warn'));
  assert.match(passosFluxo.at(-1).graph.caption, /fluxo\/capacidade/i);
});
