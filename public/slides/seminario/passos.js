/**
 * Passo a passo de cada algoritmo — um slide por passo.
 *
 * A regra do seminário passa a ser: toda vez que um algoritmo é apresentado,
 * ele é EXECUTADO na frente da turma, um passo por slide. São slides rápidos
 * de passar; o custo em tempo é baixo e o ganho didático é ver o estado mudar.
 *
 * Nada aqui é digitado à mão: os passos vêm de rodar o algoritmo de verdade
 * (lib/trace.js e equilibrada/simulacoes.js). Se o algoritmo mudar, os slides
 * mudam junto — não existe divergência possível entre a tela e o código.
 */

import { tracoBfs, tracoDfs, tracoDijkstra, tracoKruskal, tracoKahn, tracoColoracao } from '../lib/trace.js';
import { adjacencia } from '../equilibrada/simulacoes.js';
import * as G from '../equilibrada/modelos.js';
import { destacar, negativo } from './modelos.js';

/** Duração de um slide de passo. São rápidos: 24 segundos cada. */
const POR_PASSO = 0.4;

/** Carimba id único e duração nos slides que o gerador devolveu. */
const numerar = (slides, prefixo) => slides.map((slide, i) => ({
  ...slide,
  id: `${prefixo}-${i + 1}`,
  minutes: POR_PASSO,
  eyebrow: `${slide.eyebrow || prefixo} · passo ${i + 1}/${slides.length}`
}));

// ---------------------------------------------------------------------------
// Geradores que faltavam. Prim e Bellman-Ford não tinham trace no repositório.
// ---------------------------------------------------------------------------

/**
 * Prim passo a passo: uma extração por slide.
 * Mostra a chave de cada vértice e qual aresta cruzou o corte.
 */
export function tracoPrim({ base, origem, eyebrow = 'Prim' }) {
  const adj = adjacencia(base);
  const ids = base.nodes.map(n => n.id);
  const chave = new Map(ids.map(id => [id, Infinity]));
  const pai = new Map(ids.map(id => [id, null]));
  chave.set(origem, 0);
  const dentro = new Set();
  const arvore = [];
  const slides = [];

  while (dentro.size < ids.length) {
    const abertos = ids.filter(id => !dentro.has(id));
    const u = abertos.reduce((a, b) => (chave.get(a) <= chave.get(b) ? a : b));
    if (chave.get(u) === Infinity) break;
    dentro.add(u);
    if (pai.get(u)) arvore.push([pai.get(u), u]);

    const melhoras = [];
    for (const { to, weight } of adj.get(u) || []) {
      const peso = weight ?? 1;
      if (!dentro.has(to) && peso < chave.get(to)) {
        chave.set(to, peso);
        pai.set(to, u);
        melhoras.push(`${to} → ${peso}`);
      }
    }

    const custo = arvore.reduce((soma, [a, b]) => {
      const aresta = (adj.get(a) || []).find(x => x.to === b);
      return soma + (aresta?.weight ?? 1);
    }, 0);

    slides.push({
      type: 'trace',
      eyebrow,
      title: pai.get(u)
        ? `Entra ${u} pela aresta ${pai.get(u)}–${u} (chave ${chave.get(u)})`
        : `Começa em ${u}`,
      description: melhoras.length
        ? `Depois de incluir ${u}, o corte muda e estas chaves baixam: ${melhoras.join(' · ')}.`
        : `Nenhuma chave melhorou com a entrada de ${u}.`,
      graph: destacar(base, {
        nodes: Object.fromEntries([...dentro].map(id => [id, 'done'])),
        edges: arvore,
        notes: Object.fromEntries(ids.map(id => [id, dentro.has(id) ? '✓' : (chave.get(id) === Infinity ? '∞' : String(chave.get(id)))])),
        caption: `Dentro: {${[...dentro].join(', ')}} · custo acumulado ${custo}`
      }),
      headers: ['vértice', 'chave', 'ligado por'],
      rows: ids.map(id => [
        id,
        dentro.has(id) ? 'na árvore' : (chave.get(id) === Infinity ? '∞' : String(chave.get(id))),
        pai.get(id) || '—'
      ])
    });
  }
  return slides;
}

/**
 * Bellman-Ford passo a passo: uma passagem completa por slide.
 * Mostra quais arestas relaxaram e o que ainda pode melhorar.
 */
export function tracoBellmanFord({ base, origem, eyebrow = 'Bellman-Ford' }) {
  const ids = base.nodes.map(n => n.id);
  // Sem esta checagem, uma origem errada produz NaN em silêncio e o trace sai
  // vazio dizendo "nada mudou" — exatamente o que aconteceu com 's' vs 'S'.
  if (!ids.includes(origem)) {
    throw new Error(`origem "${origem}" não existe no grafo. Vértices: ${ids.join(', ')}`);
  }
  const d = new Map(ids.map(id => [id, id === origem ? 0 : Infinity]));
  const pai = new Map(ids.map(id => [id, null]));
  const slides = [];
  const arestas = base.edges.map(e => ({ ...e, peso: e.weight ?? 1 }));

  for (let passagem = 1; passagem <= ids.length - 1; passagem += 1) {
    const antes = new Map(d);
    const relaxadas = [];
    for (const { from, to, peso } of arestas) {
      if (d.get(from) + peso < d.get(to)) {
        d.set(to, d.get(from) + peso);
        pai.set(to, from);
        relaxadas.push([from, to]);
      }
    }

    slides.push({
      type: 'trace',
      eyebrow,
      title: relaxadas.length
        ? `Passagem ${passagem}: ${relaxadas.length} aresta(s) relaxaram`
        : `Passagem ${passagem}: nada mudou — pode parar`,
      description: relaxadas.length
        ? `Toda aresta é testada, na mesma ordem, toda passagem. Melhoraram: ${relaxadas.map(([a, b]) => `${a}→${b}`).join(' · ')}.`
        : 'Uma passagem sem nenhuma melhora prova que as distâncias já são finais. As passagens restantes seriam desperdício.',
      graph: destacar(base, {
        edges: relaxadas,
        notes: Object.fromEntries(ids.map(id => [id, d.get(id) === Infinity ? '∞' : String(d.get(id))])),
        caption: `Estimativas após a passagem ${passagem}`
      }),
      headers: ['vértice', 'antes', 'depois', 'veio de'],
      rows: ids.map(id => [
        id,
        antes.get(id) === Infinity ? '∞' : String(antes.get(id)),
        d.get(id) === Infinity ? '∞' : String(d.get(id)),
        pai.get(id) || '—'
      ])
    });

    if (!relaxadas.length) break;
  }
  return slides;
}

// ---------------------------------------------------------------------------
// Os passo a passo do seminário.
// ---------------------------------------------------------------------------

export const passosBfs = numerar(tracoBfs({ base: G.rede, origem: 'A', eyebrow: 'BFS de A' }), 'p-bfs');
export const passosDfs = numerar(tracoDfs({ base: G.rede, origem: 'A', eyebrow: 'DFS de A' }), 'p-dfs');
export const passosKruskal = numerar(tracoKruskal({ base: G.ponderado, eyebrow: 'Kruskal' }), 'p-kruskal');
export const passosPrim = numerar(tracoPrim({ base: G.ponderado, origem: 'A', eyebrow: 'Prim de A' }), 'p-prim');
export const passosKahn = numerar(tracoKahn({ base: G.dag, eyebrow: 'Ordenação topológica' }), 'p-kahn');
export const passosCores = numerar(
  tracoColoracao({ base: G.rede, ordem: G.rede.nodes.map(n => n.id), eyebrow: 'Coloração gulosa' }),
  'p-cores'
);
export const passosBellman = numerar(
  tracoBellmanFord({ base: negativo, origem: 'S', eyebrow: 'Bellman-Ford de s' }),
  'p-bellman'
);
/** Dijkstra completo no grafo da rede — o da prova já tem trace próprio. */
export const passosDijkstra = numerar(
  tracoDijkstra({ base: G.rotas, origem: 'S', eyebrow: 'Dijkstra de S' }),
  'p-dijkstra'
);
