/**
 * Busca — o esqueleto comum, a BFS passo a passo (gerada) e a DFS.
 */

import { tracoBfs, tracoDfs } from './lib/trace.js';

const base = {
  view: [760, 400],
  nodes: [
    { id: 'A', x: 380, y: 60 },
    { id: 'B', x: 170, y: 190 },
    { id: 'C', x: 590, y: 190 },
    { id: 'D', x: 170, y: 340 },
    { id: 'E', x: 590, y: 340 }
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'C', to: 'E' },
    { from: 'D', to: 'E' }
  ]
};

export const busca = [
  {
    type: 'section',
    kicker: 'Bloco 3',
    minutes: 10,
    title: 'Busca: um esqueleto, duas estruturas.',
    description: 'O algoritmo é o mesmo. Trocar a fila pela pilha troca a ordem de visita — e com ela todo o conjunto de problemas que a busca resolve.',
    topics: ['esqueleto genérico', 'BFS passo a passo', 'DFS e tempos', 'classificação de arestas']
  },
  {
    type: 'code',
    eyebrow: 'O esqueleto',
    title: 'Todo algoritmo de busca é este laço',
    description: 'Troque a política de retirada da fronteira e você tem BFS, DFS, Prim ou Dijkstra. É literalmente a mesma estrutura.',
    lines: [
      'BUSCA(G, raiz):',
      '  marque(raiz);  fronteira ← { raiz }',
      '',
      '  enquanto fronteira não vazia:',
      '    u ← RETIRA(fronteira)          // ← aqui mora a diferença',
      '    para cada v em adj(u):',
      '      se v não marcado:',
      '        marque(v);  π[v] ← u        // aresta de ÁRVORE',
      '        fronteira ← fronteira ∪ { v }',
      '',
      '  se sobrou vértice não marcado:    // grafo desconexo',
      '    escolha nova raiz e repita → FLORESTA'
    ],
    note: {
      kind: 'key',
      title: 'A política de RETIRA define o algoritmo',
      text: 'Fila (FIFO) → BFS. Pilha (LIFO) → DFS. Fila de prioridade pela aresta mais leve → Prim. Fila de prioridade pela distância acumulada → Dijkstra. Quatro algoritmos, um laço.'
    }
  },
  {
    type: 'definition',
    eyebrow: 'Custo',
    title: 'Por que a busca custa Θ(n + m)',
    formulas: [
      'cada vértice entra na fronteira UMA vez        → Θ(n)',
      'cada lista de adjacência é lida UMA vez       → ∑ d(v) = 2m',
      '                                    total: Θ(n + m)'
    ],
    description: 'O segundo termo é o lema do aperto de mãos aplicado ao custo. **A propriedade do bloco 1 é a prova da complexidade daqui.**',
    points: [
      'Com **matriz** de adjacência, o percurso viraria Θ(n²) — mesmo num grafo com 3 arestas.',
      'O marcador é o que garante "uma vez": sem ele, um ciclo faz a busca girar para sempre.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'BFS · a propriedade que ela garante',
    title: 'O nível da BFS É a distância',
    description: 'A BFS descobre todos os vértices a distância 1, depois todos a distância 2, e assim por diante. Logo `nível[v] = d(raiz, v)`.',
    points: [
      'Consequência: a árvore da BFS é uma **árvore de caminhos mínimos** em número de arestas.',
      'Consequência: num grafo não dirigido, **não existe** aresta ligando níveis com diferença ≥ 2 — se existisse, o nível menor teria descoberto o outro antes.',
      'Vale **apenas** com arestas de peso igual. Com pesos diferentes, o nível deixa de ser custo — é o assunto do bloco 4.'
    ],
    graph: base
  },

  // --- BFS passo a passo, gerada executando o algoritmo -------------------
  ...tracoBfs({ base, origem: 'A', eyebrow: 'BFS a partir de A' }),

  {
    type: 'table',
    eyebrow: 'BFS · leitura do resultado',
    title: 'As arestas que não entraram na árvore',
    description: 'Compare os níveis das duas pontas de cada aresta que a BFS **não** usou para descobrir ninguém.',
    headers: ['aresta', 'níveis', 'classe', 'por quê'],
    rows: [
      ['A–B, A–C, B–D, C–E', 'ℓ e ℓ+1', '**árvore**', 'descobriu o vértice'],
      ['B–C', '1 e 1, mesmo pai (A)', 'irmão', 'os dois vieram de A'],
      ['D–E', '2 e 2, pais diferentes', 'primo', 'nenhum é ancestral do outro'],
      ['C–D', '1 e 2, sem parentesco', 'tio', 'liga camadas vizinhas por fora da árvore']
    ],
    note: {
      kind: 'check',
      title: 'Teste de sanidade da sua BFS',
      text: 'Se você achou uma aresta ligando o nível 0 ao nível 2, a BFS está errada. Essa impossibilidade é o jeito mais rápido de conferir o próprio trace na prova.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'DFS',
    title: 'Pilha: desce até o fim e carimba dois tempos',
    description: 'Cada vértice ganha `d[v]` quando é **descoberto** e `f[v]` quando **termina** — todos os vizinhos já explorados. Três cores acompanham isso: branco, cinza, preto.',
    points: [
      '**Branco:** não descoberto. **Cinza:** descoberto e aberto na pilha. **Preto:** terminado.',
      'Os intervalos `[d, f]` são **aninhados ou disjuntos** — nunca se cruzam. É o teorema dos parênteses.',
      '`[d(u), f(u)]` contém `[d(v), f(v)]` **⟺** v é descendente de u na árvore DFS.',
      'Aresta para vértice **cinza** é de **retorno** — e denuncia um ciclo.'
    ],
    graph: base
  },

  // --- DFS passo a passo, gerada executando o algoritmo -----------------
  ...tracoDfs({ base, origem: 'A', eyebrow: 'DFS a partir de A' }),

  {
    type: 'compare',
    eyebrow: 'Decisão',
    title: 'Qual busca resolve qual problema',
    columns: [
      {
        title: 'BFS · fila',
        description: 'Θ(n + m)',
        items: [
          'Distância em nº de arestas',
          'Caminho mínimo **não ponderado**',
          'Teste de bipartição (2-coloração)',
          'Menor nº de movimentos'
        ]
      },
      {
        title: 'DFS · pilha',
        description: 'Θ(n + m)',
        items: [
          'Detectar ciclo (aresta de retorno)',
          'Ordenação topológica',
          'Componentes fortemente conexos (Kosaraju)',
          'Articulações e pontes'
        ]
      },
      {
        title: 'As duas dão',
        items: [
          'Componentes conexos — as classes do bloco 2',
          'Árvore ou floresta geradora',
          'Teste de conexidade'
        ]
      }
    ]
  }
];
