/**
 * Árvores e AGM — propriedades, corte seguro, Kruskal passo a passo (gerado)
 * com união-busca, e Prim.
 */

import { tracoKruskal } from './lib/trace.js';

const ponderado = {
  view: [720, 420],
  nodes: [
    { id: 'A', x: 140, y: 110 },
    { id: 'B', x: 390, y: 80 },
    { id: 'C', x: 620, y: 160 },
    { id: 'D', x: 250, y: 330 },
    { id: 'E', x: 540, y: 340 }
  ],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'D', weight: 3 },
    { from: 'B', to: 'D', weight: 4 },
    { from: 'B', to: 'E', weight: 5 },
    { from: 'B', to: 'C', weight: 6 },
    { from: 'C', to: 'E', weight: 3 },
    { from: 'D', to: 'E', weight: 7 }
  ]
};

export const arvores = [
  {
    type: 'section',
    kicker: 'Bloco 5',
    minutes: 6,
    title: 'Árvore geradora mínima.',
    description: 'Dois algoritmos gulosos que são ótimos — e um único teorema que explica por que os dois funcionam.',
    topics: ['propriedades de árvore', 'corte seguro', 'Kruskal + união-busca', 'Prim']
  },
  {
    type: 'definition',
    eyebrow: 'Propriedades',
    title: 'Árvore: seis caracterizações equivalentes',
    formulas: [
      'T é árvore  ⟺  T é conexo e acíclico',
      '            ⟺  T é conexo e tem n − 1 arestas',
      '            ⟺  T é acíclico e tem n − 1 arestas',
      '            ⟺  existe UM ÚNICO caminho entre cada par',
      '            ⟺  remover qualquer aresta desconecta',
      '            ⟺  adicionar qualquer aresta cria UM ciclo'
    ],
    description: 'Na prova, escolha a caracterização que dá menos trabalho. Provar **duas** entre conexo / acíclico / n−1 arestas já implica a terceira.',
    points: [
      'Toda árvore com n ≥ 2 tem **pelo menos duas folhas** — senão todo grau ≥ 2 e existiria ciclo.',
      'Número de elos (arestas fora da geradora): `m − n + 1`, o número ciclomático.',
      'Cada elo fecha **exatamente um** ciclo fundamental — porque o caminho em T já era único.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'O teorema que sustenta os dois algoritmos',
    title: 'Aresta leve de um corte é segura',
    description: 'Corte é uma partição de V em (S, V∖S). Uma aresta **cruza** o corte se tem uma ponta em cada lado. A aresta de **menor peso** que cruza um corte pertence a alguma AGM.',
    points: [
      '**Prova por troca.** Se uma AGM T não contém a aresta leve `e` do corte, adicione `e` a T.',
      'Forma-se um ciclo, que precisa **cruzar o corte de volta** por outra aresta `e′`, com `w(e′) ≥ w(e)`.',
      'Trocar `e′` por `e` mantém a árvore e não piora o custo. ∎',
      '**Prim** mantém um único corte crescendo a partir de S; **Kruskal** usa o corte implícito entre os componentes atuais.'
    ],
    graph: {
      ...ponderado,
      caption: 'corte S = {A,B,D}: cruzam BE(5), BC(6), DE(7) → a leve é BE(5)',
      nodes: [
        { id: 'A', x: 140, y: 110, state: 'done' },
        { id: 'B', x: 390, y: 80, state: 'done' },
        { id: 'C', x: 620, y: 160 },
        { id: 'D', x: 250, y: 330, state: 'done' },
        { id: 'E', x: 540, y: 340 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 2 },
        { from: 'A', to: 'D', weight: 3 },
        { from: 'B', to: 'D', weight: 4 },
        { from: 'B', to: 'E', weight: 5, state: 'active' },
        { from: 'B', to: 'C', weight: 6, state: 'dim' },
        { from: 'C', to: 'E', weight: 3 },
        { from: 'D', to: 'E', weight: 7, state: 'dim' }
      ]
    }
  },
  {
    type: 'code',
    eyebrow: 'Kruskal · a estrutura que faz o teste de ciclo',
    title: 'União-busca: o ciclo em tempo quase constante',
    description: 'Aceitar a aresta {u,v} fecharia ciclo **se e somente se** u e v já estão no mesmo componente. Testar isso é comparar as raízes.',
    lines: [
      'FIND(x):                     // quem é a raiz do componente de x',
      '  enquanto pai[x] ≠ x: x ← pai[x]',
      '  devolva x',
      '',
      'UNION(u, v):',
      '  pai[FIND(u)] ← FIND(v)',
      '',
      'KRUSKAL(G):',
      '  ordene E por peso crescente        // Θ(m log m)',
      '  para cada v: pai[v] ← v            // n árvores triviais',
      '  para cada {u,v} em ordem:',
      '    se FIND(u) ≠ FIND(v):            // não fecha ciclo',
      '      aceite {u,v};  UNION(u, v)',
      '    senão: recuse',
      '    se aceitou n−1 arestas: pare'
    ],
    note: {
      kind: 'key',
      title: 'O componente aqui é a classe de equivalência do bloco 2',
      text: '"Estar no mesmo componente" é a relação de equivalência, e FIND devolve o representante da classe. A questão 12 do ENADE e o Kruskal usam a mesma estrutura matemática.'
    }
  },

  // --- Kruskal passo a passo, gerado executando o algoritmo -------------
  ...tracoKruskal({ base: ponderado, eyebrow: 'Kruskal' }),

  {
    type: 'steps',
    eyebrow: 'Prim · o mesmo resultado por outro caminho',
    title: 'Cresce UMA árvore, mantendo uma chave por vértice',
    description: 'Partindo de A. `chave[v]` = menor peso que liga v à árvore atual. A cada passo, extraia o de menor chave.',
    items: [
      { title: 'Início: A na árvore', text: 'chaves — B=2, D=3, C=∞, E=∞.' },
      { title: 'Extrai B (chave 2)', text: 'Inclui AB. Relaxa o corte: D fica em min(3, 4) = 3; C=6; E=5.' },
      { title: 'Extrai D (chave 3)', text: 'Inclui AD. Por D, E teria 7 > 5 — não melhora.' },
      { title: 'Extrai E (chave 5)', text: 'Inclui BE. Por E, C cai de 6 para **3**.' },
      { title: 'Extrai C (chave 3)', text: 'Inclui CE. Cinco vértices na árvore: pare. Custo 2+3+5+3 = **13**.' }
    ],
    note: {
      kind: 'check',
      title: 'Mesmo custo, e não é coincidência',
      text: 'Kruskal também fechou em 13, com as mesmas arestas {AB, AD, BE, CE}. Os dois são ótimos pelo teorema do corte seguro — o custo mínimo é único mesmo quando a árvore não é.'
    },
    graph: {
      ...ponderado,
      caption: 'AGM = {AB, AD, BE, CE}, custo 13',
      edges: [
        { from: 'A', to: 'B', weight: 2, state: 'tree' },
        { from: 'A', to: 'D', weight: 3, state: 'tree' },
        { from: 'B', to: 'D', weight: 4, state: 'dim' },
        { from: 'B', to: 'E', weight: 5, state: 'tree' },
        { from: 'B', to: 'C', weight: 6, state: 'dim' },
        { from: 'C', to: 'E', weight: 3, state: 'tree' },
        { from: 'D', to: 'E', weight: 7, state: 'dim' }
      ]
    }
  },
  {
    type: 'concept',
    eyebrow: 'A armadilha clássica de AGM',
    title: 'O caminho dentro da AGM NÃO é caminho mínimo',
    description: 'AGM minimiza a **soma global** das arestas. Ela não promete nada sobre distância entre pares — e a diferença aparece no menor grafo possível.',
    points: [
      'Na AGM, o caminho de D a E é **D–A–B–E**: 3 + 2 + 5 = **10**.',
      'No grafo, existe a aresta direta **D–E = 7**.',
      'A AGM é ótima para "conectar tudo pelo menor custo total"; Dijkstra é ótimo para "ir de u a v". **Problemas diferentes.**'
    ],
    note: {
      kind: 'warn',
      title: 'Como isso cai na prova',
      text: 'A afirmação "a AGM contém um caminho de custo mínimo entre quaisquer dois vértices" é FALSA. Guarde este contraexemplo de 5 vértices: ele derruba a afirmação em dez segundos.'
    },
    graph: {
      ...ponderado,
      caption: 'na AGM: D–A–B–E = 10 · no grafo: D–E = 7',
      nodes: [
        { id: 'A', x: 140, y: 110, state: 'active' },
        { id: 'B', x: 390, y: 80, state: 'active' },
        { id: 'C', x: 620, y: 160 },
        { id: 'D', x: 250, y: 330, state: 'active' },
        { id: 'E', x: 540, y: 340, state: 'active' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 2, state: 'active' },
        { from: 'A', to: 'D', weight: 3, state: 'active' },
        { from: 'B', to: 'D', weight: 4, state: 'dim' },
        { from: 'B', to: 'E', weight: 5, state: 'active' },
        { from: 'B', to: 'C', weight: 6, state: 'dim' },
        { from: 'C', to: 'E', weight: 3, state: 'dim' },
        { from: 'D', to: 'E', weight: 7, state: 'warn' }
      ]
    }
  },
  {
    type: 'compare',
    eyebrow: 'Decisão',
    title: 'Prim ou Kruskal',
    columns: [
      {
        title: 'Prim',
        description: 'Θ(m log n) com heap',
        items: [
          'Mantém **uma** árvore conexa o tempo todo',
          'Melhor em grafo **denso**',
          'Precisa de fila de prioridade',
          'É a busca genérica com prioridade = peso da aresta'
        ]
      },
      {
        title: 'Kruskal',
        description: 'Θ(m log m), dominado pela ordenação',
        items: [
          'Mantém uma **floresta** que se funde',
          'Melhor em grafo **esparso**',
          'Precisa de união-busca',
          'Examina arestas em ordem global de peso'
        ]
      },
      {
        title: 'Em comum',
        items: [
          'Gulosos e **ótimos** — pelo corte seguro',
          'Exigem grafo **conexo e não dirigido**',
          'Com pesos distintos, a AGM é **única**',
          'Com empate, o custo é único mas a árvore pode não ser'
        ]
      }
    ]
  }
];
