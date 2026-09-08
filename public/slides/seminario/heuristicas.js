/**
 * Gulosa, Dijkstra e A* na MESMA rede.
 *
 * A rede foi construída para separar as três: cada uma escolhe um vizinho
 * diferente na primeira decisão, e a gulosa termina com o caminho errado.
 *
 *   S→A = 1    A→T = 3     caminho S–A–T custa 4   (ótimo)
 *   S→B = 2    B→T = 9     caminho S–B–T custa 11
 *
 * A heurística h é ADMISSÍVEL — nunca superestima o custo restante:
 *   h(A)=3 = custo real de A até T      h(B)=1 ≤ 9      h(S)=4 = custo real
 * Isso importa: sem admissibilidade, A* perderia a garantia de ótimo e o
 * exemplo estaria ensinando errado.
 */

/** Posições compartilhadas: os três diagramas são a mesma rede. */
const rede = {
  view: [340, 260],
  directed: true,
  nodes: [
    { id: 'S', x: 55, y: 130 },
    { id: 'A', x: 170, y: 55 },
    { id: 'B', x: 170, y: 205 },
    { id: 'T', x: 295, y: 130 }
  ],
  edges: [
    { from: 'S', to: 'A', weight: 1 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'T', weight: 3 },
    { from: 'B', to: 'T', weight: 9 }
  ]
};

/**
 * Monta uma variação da rede: anota cada vértice e destaca um caminho.
 * @param {Record<string,string>} notas rótulo sob cada vértice
 * @param {Array<[string,string]>} caminho arestas a destacar
 * @param {'tree'|'warn'} tom verde para ótimo, vermelho para subótimo
 * @param {string} caption legenda sob o desenho
 */
const variacao = (notas, caminho, tom, caption) => ({
  ...rede,
  caption,
  nodes: rede.nodes.map(n => ({ ...n, note: notas[n.id] })),
  edges: rede.edges.map(e => ({
    ...e,
    state: caminho.some(([de, para]) => e.from === de && e.to === para) ? tom : 'dim'
  }))
});

export const heuristicas = {
  id: 'heuristicas-prioridade',
  type: 'compare',
  minutes: 2,
  title: 'Gulosa, Dijkstra e A* usam prioridades diferentes',
  description: 'A mesma rede, três critérios. S–A–T custa 1 + 3 = 4; S–B–T custa 2 + 9 = 11. O vizinho escolhido na primeira decisão difere nos três, e é isso que separa o resultado.',
  columns: [
    {
      title: 'Gulosa · prioriza h',
      description: 'só a estimativa restante',
      graph: variacao(
        { S: 'h=4', A: 'h=3', B: 'h=1', T: 'h=0' },
        [['S', 'B'], ['B', 'T']],
        'warn',
        'h(B)=1 < h(A)=3 → vai por B. Custo 11.'
      ),
      items: [
        'Em S, compara h(A)=3 com h(B)=1 e escolhe **B**.',
        'Nunca soma o que já percorreu, nem volta atrás.',
        '**Devolve custo 11** — não é o menor.'
      ]
    },
    {
      title: 'Dijkstra · prioriza g',
      description: 'só o custo acumulado',
      graph: variacao(
        { S: 'g=0', A: 'g=1', B: 'g=2', T: 'g=4' },
        [['S', 'A'], ['A', 'T']],
        'tree',
        'g(A)=1 < g(B)=2 → fecha A antes. Custo 4.'
      ),
      items: [
        'Fecha o menor aberto: **A** (1) antes de B (2).',
        'Por A chega a T com 4; depois B ofereceria 11 e é descartado.',
        '**Devolve custo 4** — o mínimo.'
      ]
    },
    {
      title: 'A* · prioriza g + h',
      description: 'os dois somados',
      graph: variacao(
        { S: 'f=4', A: 'f=4', B: 'f=3', T: 'f=4' },
        [['S', 'A'], ['A', 'T']],
        'tree',
        'expande B primeiro (f=3), corrige e fecha em 4.'
      ),
      items: [
        'f(B)=2+1=3 é o menor: **B** é expandido primeiro, como na gulosa.',
        'Mas f(T) por B dá 11, e A ainda tem f=4 — então A entra e corrige.',
        '**Devolve custo 4**, visitando menos que Dijkstra.'
      ]
    }
  ],
  note: {
    kind: 'key',
    title: 'Por que A* não repete o erro da gulosa',
    text: 'A gulosa descarta o caminho já percorrido e não reconsidera. A* mantém g na conta, então um desvio caro é penalizado assim que aparece. A garantia de ótimo exige h admissível — nunca superestimar o restante, como aqui, onde h(A)=3 é exatamente o custo real de A até T.'
  }
};
