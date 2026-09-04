/** Exemplos pequenos e reproduzíveis; coordenadas no mesmo contrato SVG do deck. */
const node = (id, x, y) => ({ id, x, y });
const edge = (from, to, weight) => ({ from, to, ...(weight === undefined ? {} : { weight }) });
const graph = (nodes, edges, directed = false) => ({ view: [760, 400], nodes, edges, directed });

export const quadrado = graph(
  [node('A', 190, 100), node('B', 550, 100), node('C', 550, 300), node('D', 190, 300)],
  [edge('A', 'B'), edge('B', 'C'), edge('C', 'D'), edge('D', 'A')].map((e, i) => ({ ...e, label: `e${i + 1}` }))
);
export const rede = graph(
  [node('A', 100, 200), node('B', 290, 100), node('C', 290, 300), node('D', 490, 200), node('E', 680, 200)],
  [edge('A', 'B'), edge('A', 'C'), edge('B', 'D'), edge('C', 'D'), edge('D', 'E')]
);
export const ponderado = graph(
  [node('A', 120, 100), node('B', 370, 80), node('C', 640, 140), node('D', 230, 320), node('E', 540, 320)],
  [edge('A', 'B', 2), edge('A', 'D', 3), edge('B', 'D', 4), edge('B', 'E', 5), edge('B', 'C', 6), edge('C', 'E', 3), edge('D', 'E', 7)]
);
export const rotas = graph(
  [node('S', 110, 200), node('A', 350, 90), node('B', 350, 310), node('T', 630, 200)],
  [edge('S', 'A', 2), edge('S', 'B', 5), edge('A', 'B', 1), edge('A', 'T', 7), edge('B', 'T', 3)], true
);
export const dirigido = graph(
  [node('a', 100, 200), node('b', 290, 100), node('c', 490, 100), node('d', 680, 200)],
  [edge('a', 'b'), { ...edge('b', 'c'), curve: 35 }, { ...edge('c', 'b'), curve: 35 }, edge('c', 'd')], true
);
export const dag = graph(
  [node('1', 100, 200), node('2', 290, 90), node('3', 290, 310), node('4', 500, 200), node('5', 680, 200)],
  [edge('1', '2'), edge('1', '3'), edge('2', '4'), edge('3', '4'), edge('4', '5')], true
);
export const euler = graph(
  [node('a', 100, 90), node('b', 100, 310), node('c', 290, 200), node('d', 470, 200), node('e', 660, 90), node('f', 660, 310)],
  [edge('a', 'b'), edge('a', 'c'), edge('b', 'c'), edge('c', 'd'), edge('d', 'e'), edge('d', 'f'), edge('e', 'f')]
);
export const ciclo5 = graph(
  [node('1', 380, 60), node('2', 610, 180), node('3', 530, 340), node('4', 230, 340), node('5', 150, 180)],
  [edge('1', '2'), edge('2', '3'), edge('3', '4'), edge('4', '5'), edge('5', '1')]
);
export const k33 = graph(
  [node('u1', 200, 80), node('u2', 200, 200), node('u3', 200, 320), node('v1', 560, 80), node('v2', 560, 200), node('v3', 560, 320)],
  ['u1', 'u2', 'u3'].flatMap(u => ['v1', 'v2', 'v3'].map(v => edge(u, v)))
);
export const k4 = graph(
  [node('A', 380, 60), node('B', 160, 330), node('C', 600, 330), node('D', 380, 220)],
  [edge('A', 'B'), edge('A', 'C'), edge('A', 'D'), edge('B', 'C'), edge('B', 'D'), edge('C', 'D')]
);
export const cores = graph(
  [node('A', 200, 100), node('B', 430, 80), node('C', 110, 300), node('D', 420, 300), node('E', 650, 190)],
  [edge('A', 'B'), edge('A', 'D'), edge('B', 'D'), edge('A', 'C'), edge('C', 'D'), edge('B', 'E'), edge('D', 'E')]
);
export const fluxo = graph(
  [node('S', 110, 200), node('A', 350, 90), node('B', 350, 310), node('T', 640, 200)],
  [edge('S', 'A', 3), edge('S', 'B', 2), edge('A', 'B', 2), edge('A', 'T', 2), edge('B', 'T', 3)], true
);
export const aumentantes = [['S', 'A', 'B', 'T'], ['S', 'A', 'T'], ['S', 'B', 'T'], ['S', 'B', 'A', 'T']];

/** Destaques sem mutar o grafo compartilhado por outros slides. */
export function destacar(base, { nodes = {}, edges = [], notes = {}, caption = '' } = {}) {
  return {
    ...base, caption,
    nodes: base.nodes.map(n => ({ ...n, ...(nodes[n.id] ? { state: nodes[n.id] } : {}), ...(notes[n.id] !== undefined ? { note: String(notes[n.id]) } : {}) })),
    edges: base.edges.map(e => ({ ...e, ...(edges.some(([u, v]) => e.from === u && e.to === v || !base.directed && e.from === v && e.to === u) ? { state: 'tree' } : {}) }))
  };
}

// Mesma estrutura com dois desenhos e uma bijeção explícita.
export const isomorfos = graph(
  [node('1', 90, 100), node('2', 260, 100), node('3', 90, 300), node('4', 260, 300),
   node('a', 480, 90), node('b', 680, 90), node('c', 680, 310), node('d', 480, 310)],
  [edge('1', '2'), edge('1', '3'), edge('1', '4'), edge('3', '4'),
   edge('d', 'a'), edge('d', 'b'), edge('d', 'c'), edge('b', 'c')]
);
isomorfos.caption = 'Bijeção: 1↦d, 2↦a, 3↦b, 4↦c.';

export const componentes = {
  ...rede, nodes: [...rede.nodes, node('F', 680, 350)],
  caption: 'Componentes: {A,B,C,D,E} e {F}. F é isolado.'
};

// Grafo coroa K3,3 menos os três pares correspondentes (é um C6).
export const coroa = graph(
  [node('u1', 200, 80), node('u2', 200, 200), node('u3', 200, 320),
   node('v1', 560, 80), node('v2', 560, 200), node('v3', 560, 320)],
  ['u1', 'u2', 'u3'].flatMap((u, i) => ['v1', 'v2', 'v3'].filter((v, j) => i !== j).map(v => edge(u, v)))
);
