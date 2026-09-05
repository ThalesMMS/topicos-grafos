/**
 * Simulações didáticas para grafos pequenos, não uma biblioteca otimizada.
 * As tabelas vêm da execução; testes independentes verificam os resultados.
 */
const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export const mostrar = x => x === Infinity ? '∞' : x === null ? '—' : String(x);

export function adjacencia(g) {
  const adj = new Map(g.nodes.map(n => [n.id, []]));
  if (adj.size !== g.nodes.length) throw new Error('Vértice duplicado');
  for (const e of g.edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) throw new Error('Extremo inexistente');
    if (!Number.isFinite(e.weight ?? 1)) throw new Error('Peso não finito');
    adj.get(e.from).push({ to: e.to, weight: e.weight ?? 1 });
    if (!g.directed) adj.get(e.to).push({ to: e.from, weight: e.weight ?? 1 });
  }
  for (const list of adj.values()) list.sort((a, b) => cmp(a.to, b.to));
  return adj;
}
function origemValida(adj, source) {
  if (!adj.has(source)) throw new Error('Origem inexistente');
}

export function bfs(g, source) {
  const adj = adjacencia(g); origemValida(adj, source);
  const distance = Object.fromEntries(g.nodes.map(n => [n.id, Infinity]));
  const parent = Object.fromEntries(g.nodes.map(n => [n.id, null]));
  const queue = [source], order = [], frames = [];
  distance[source] = 0;
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head], discovered = [];
    order.push(u);
    for (const { to: v } of adj.get(u)) {
      if (distance[v] !== Infinity) continue;
      distance[v] = distance[u] + 1; parent[v] = u;
      queue.push(v); discovered.push(v);
    }
    frames.push({ u, queue: queue.slice(head + 1), discovered, distance: { ...distance } });
  }
  return { distance, parent, order, frames };
}

export function dfs(g, source) {
  const adj = adjacencia(g); origemValida(adj, source);
  const discovery = {}, finish = {}, parent = {}, order = [];
  let clock = 0;
  function visit(u) {
    discovery[u] = ++clock; order.push(u);
    for (const { to: v } of adj.get(u)) if (discovery[v] === undefined) {
      parent[v] = u; visit(v);
    }
    finish[u] = ++clock;
  }
  // Uma floresta completa; a origem escolhida é a primeira raiz.
  for (const u of [source, ...g.nodes.map(n => n.id).filter(id => id !== source)]) {
    if (discovery[u] !== undefined) continue;
    parent[u] = null; visit(u);
  }
  return { discovery, finish, parent, order };
}

export function dijkstra(g, source) {
  const adj = adjacencia(g); origemValida(adj, source);
  if (g.edges.some(e => (e.weight ?? 1) < 0)) throw new Error('Dijkstra exige pesos não negativos');
  const ids = g.nodes.map(n => n.id);
  const distance = Object.fromEntries(ids.map(id => [id, id === source ? 0 : Infinity]));
  const parent = Object.fromEntries(ids.map(id => [id, null]));
  const settled = new Set(), frames = [];
  // Seleção por varredura: O(n² + m), diferente da versão com heap descrita no curso.
  while (settled.size < ids.length) {
    let u = null;
    for (const id of ids) if (!settled.has(id) && distance[id] < Infinity && (u === null || distance[id] < distance[u])) u = id;
    if (u === null) break;
    settled.add(u);
    for (const { to: v, weight } of adj.get(u)) {
      if (!settled.has(v) && distance[u] + weight < distance[v]) {
        distance[v] = distance[u] + weight; parent[v] = u;
      }
    }
    frames.push({ u, distance: { ...distance }, parent: { ...parent } });
  }
  return { distance, parent, frames };
}

export function kruskal(g) {
  if (g.directed) throw new Error('Kruskal exige grafo não dirigido');
  adjacencia(g);
  const parent = new Map(g.nodes.map(n => [n.id, n.id]));
  const rank = new Map(g.nodes.map(n => [n.id, 0]));
  function find(x) {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
    return parent.get(x);
  }
  const accepted = [], frames = [];
  let cost = 0;
  const sorted = [...g.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1) || cmp(`${a.from}:${a.to}`, `${b.from}:${b.to}`));
  for (const e of sorted) {
    let a = find(e.from), b = find(e.to);
    const take = a !== b;
    if (take) {
      if (rank.get(a) < rank.get(b)) [a, b] = [b, a];
      parent.set(b, a);
      if (rank.get(a) === rank.get(b)) rank.set(a, rank.get(a) + 1);
      accepted.push(e); cost += e.weight ?? 1;
    }
    frames.push({ edge: e, take, cost });
    if (accepted.length === g.nodes.length - 1) break;
  }
  return { accepted, cost, frames, components: g.nodes.length - accepted.length };
}

export function colorir(g, order) {
  if (g.directed || g.edges.some(e => e.from === e.to)) throw new Error('Coloração: use grafo não dirigido sem laços');
  const adj = adjacencia(g);
  if (new Set(order).size !== adj.size || order.length !== adj.size || order.some(id => !adj.has(id))) throw new Error('Ordem deve ser uma permutação de V');
  const colors = {}, frames = [];
  for (const u of order) {
    const used = new Set(adj.get(u).map(({ to }) => colors[to]).filter(c => c !== undefined));
    let color = 1; while (used.has(color)) color++;
    colors[u] = color;
    frames.push({ u, used: [...used].sort((a, b) => a - b), color });
  }
  return { colors, frames, count: Math.max(0, ...Object.values(colors)) };
}

/** Executa caminhos escolhidos, inclusive reversos, e calcula o corte residual final.
 * Contrato dos exemplos: capacidades inteiras, sem laços, paralelas ou antiparalelas.
 */
export function aumentar(g, source, sink, paths) {
  const adj = adjacencia(g); origemValida(adj, source); origemValida(adj, sink);
  if (!g.directed || source === sink) throw new Error('Rede inválida');
  const capacity = new Map(), sent = new Map();
  const key = (u, v) => JSON.stringify([u, v]);
  for (const e of g.edges) {
    const k = key(e.from, e.to), reverse = key(e.to, e.from);
    if (e.from === e.to || capacity.has(k) || capacity.has(reverse) || !Number.isSafeInteger(e.weight) || e.weight <= 0) throw new Error('Rede fora do contrato didático');
    capacity.set(k, e.weight); sent.set(k, 0);
  }
  const residual = (u, v) => (capacity.get(key(u, v)) ?? 0) - (sent.get(key(u, v)) ?? 0) + (sent.get(key(v, u)) ?? 0);
  let value = 0; const frames = [];
  for (const path of paths) {
    if (path[0] !== source || path.at(-1) !== sink || new Set(path).size !== path.length || path.some(v => !adj.has(v))) throw new Error('Caminho aumentante inválido');
    const arcs = path.slice(1).map((v, i) => [path[i], v]);
    const delta = Math.min(...arcs.map(([u, v]) => residual(u, v)));
    if (!Number.isFinite(delta) || delta <= 0) throw new Error('Caminho sem capacidade residual');
    let usedReverse = false;
    for (const [u, v] of arcs) {
      const k = key(u, v), back = key(v, u);
      if (capacity.has(k)) sent.set(k, sent.get(k) + delta);
      else { sent.set(back, sent.get(back) - delta); usedReverse = true; }
    }
    value += delta;
    frames.push({ path: [...path], delta, value, usedReverse, flows: g.edges.map(e => sent.get(key(e.from, e.to))) });
  }
  const reachable = new Set([source]), queue = [source];
  for (let i = 0; i < queue.length; i++) for (const v of adj.keys()) {
    if (!reachable.has(v) && residual(queue[i], v) > 0) { reachable.add(v); queue.push(v); }
  }
  const cut = g.edges.filter(e => reachable.has(e.from) && !reachable.has(e.to)).reduce((sum, e) => sum + e.weight, 0);
  return { frames, value, reachable: [...reachable], cut, optimal: !reachable.has(sink), flows: g.edges.map(e => sent.get(key(e.from, e.to))) };
}
