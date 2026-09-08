/**
 * As afirmações do slide de heurísticas são conferidas EXECUTANDO gulosa,
 * Dijkstra e A* na rede desenhada. Sem isto, os números no telão seriam
 * apenas o que eu acreditei ao escrever.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { heuristicas } from '../public/slides/seminario/heuristicas.js';

/** Lê a rede a partir do próprio diagrama exibido, não de uma cópia. */
const rede = heuristicas.columns[0].graph;
const arcos = rede.edges.map(e => ({ de: e.from, para: e.to, peso: e.weight }));
const vizinhos = de => arcos.filter(a => a.de === de);

/** h declarado no diagrama da coluna da gulosa, na forma "h=3". */
const H = Object.fromEntries(
  heuristicas.columns[0].graph.nodes.map(n => [n.id, Number(String(n.note).split('=')[1])])
);

/** Busca gulosa: em cada vértice segue o vizinho de menor h. Não soma g. */
function gulosa(origem, destino) {
  let atual = origem;
  const caminho = [origem];
  let custo = 0;
  for (let passo = 0; passo < 10 && atual !== destino; passo += 1) {
    const opcoes = vizinhos(atual);
    if (!opcoes.length) return { caminho, custo: Infinity };
    const melhor = opcoes.reduce((a, b) => (H[b.para] < H[a.para] ? b : a));
    custo += melhor.peso;
    atual = melhor.para;
    caminho.push(atual);
  }
  return { caminho, custo };
}

/** Dijkstra e A* diferem só na prioridade: g, ou g + h. */
function buscaPorPrioridade(origem, destino, usarH) {
  const g = { [origem]: 0 };
  const abertos = new Set([origem]);
  const fechados = new Set();
  const ordemFechados = [];
  while (abertos.size) {
    const u = [...abertos].reduce((a, b) => {
      const fa = g[a] + (usarH ? H[a] : 0);
      const fb = g[b] + (usarH ? H[b] : 0);
      return fb < fa ? b : a;
    });
    abertos.delete(u);
    fechados.add(u);
    ordemFechados.push(u);
    if (u === destino) break;
    for (const arco of vizinhos(u)) {
      const candidato = g[u] + arco.peso;
      if (!(arco.para in g) || candidato < g[arco.para]) {
        g[arco.para] = candidato;
        if (!fechados.has(arco.para)) abertos.add(arco.para);
      }
    }
  }
  return { custo: g[destino], ordemFechados };
}

test('a heurística declarada é admissível — condição para A* ser ótimo', () => {
  // Custo real até T, calculado sem heurística nenhuma.
  const real = no => buscaPorPrioridade(no, 'T', false).custo;
  for (const no of Object.keys(H)) {
    assert.ok(H[no] <= real(no),
      `h(${no}) = ${H[no]} supera o custo real ${real(no)}: heurística inadmissível`);
  }
});

test('a gulosa erra nesta rede, e erra exatamente por 11', () => {
  const resultado = gulosa('S', 'T');
  assert.deepEqual(resultado.caminho, ['S', 'B', 'T'], 'a gulosa não seguiu S–B–T');
  assert.equal(resultado.custo, 11);
  // A coluna promete esse número no texto e na legenda.
  assert.match(heuristicas.columns[0].items.join(' '), /custo 11/);
  assert.match(heuristicas.columns[0].graph.caption, /11/);
});

test('Dijkstra e A* devolvem o ótimo 4, e A* fecha menos vértices', () => {
  const dij = buscaPorPrioridade('S', 'T', false);
  const estrela = buscaPorPrioridade('S', 'T', true);
  assert.equal(dij.custo, 4);
  assert.equal(estrela.custo, 4);
  for (const coluna of heuristicas.columns.slice(1)) {
    assert.match(coluna.items.join(' '), /custo 4/, `${coluna.title} não promete custo 4`);
  }
  // A afirmação "visitando menos que Dijkstra" precisa ser verdade aqui.
  assert.ok(estrela.ordemFechados.length <= dij.ordemFechados.length,
    `A* fechou ${estrela.ordemFechados.length} e Dijkstra ${dij.ordemFechados.length}`);
});

test('cada coluna destaca o caminho que seu algoritmo realmente devolve', () => {
  const destacado = coluna => coluna.graph.edges
    .filter(e => e.state !== 'dim')
    .map(e => `${e.from}${e.to}`).sort().join(' ');
  assert.equal(destacado(heuristicas.columns[0]), 'BT SB', 'gulosa deveria destacar S–B–T');
  assert.equal(destacado(heuristicas.columns[1]), 'AT SA', 'Dijkstra deveria destacar S–A–T');
  assert.equal(destacado(heuristicas.columns[2]), 'AT SA', 'A* deveria destacar S–A–T');
  // O caminho subótimo não pode aparecer em verde.
  assert.ok(heuristicas.columns[0].graph.edges.some(e => e.state === 'warn'),
    'o caminho errado da gulosa não está marcado como tal');
});
