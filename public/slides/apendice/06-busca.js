/**
 * Módulo 6 — Busca: genérica, BFS, DFS, tempos e classificação de arestas.
 */

const buscaBase = {
  view: [760, 400],
  nodes: [
    { id: 'A', x: 380, y: 70 },
    { id: 'B', x: 200, y: 200 },
    { id: 'C', x: 560, y: 200 },
    { id: 'D', x: 200, y: 340 },
    { id: 'E', x: 560, y: 340 }
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
    kicker: 'Módulo 6',
    title: 'Uma estrutura de dados separa BFS de DFS.',
    description: 'O algoritmo é o mesmo: tire da fronteira, visite os vizinhos. Fila dá níveis; pilha dá profundidade.',
    topics: ['busca genérica', 'BFS e níveis', 'DFS e tempos', 'classificação de arestas']
  },
  {
    type: 'steps',
    eyebrow: 'Busca genérica',
    title: 'Três estados e uma fronteira',
    description: 'Todo algoritmo de busca é este esqueleto. O que muda é **de onde** você tira o próximo vértice.',
    items: [
      { title: 'Estados', text: 'Não marcado (branco) → marcado, com aresta pendente (cinza) → explorado (preto).' },
      { title: 'Escolha uma raiz e marque', text: 'A raiz entra na fronteira.' },
      { title: 'Repita: tire um da fronteira', text: 'Fila → BFS. Pilha → DFS. Fila de prioridade por peso → Prim/Dijkstra.' },
      { title: 'Vizinho não marcado vira filho', text: 'A aresta usada é **aresta de árvore**; o vértice ganha predecessor π.' },
      { title: 'Fronteira vazia não é fim', text: 'Se sobrou vértice branco, o grafo é desconexo: escolha nova raiz. O resultado é uma **floresta**.' }
    ],
    note: {
      kind: 'key',
      title: 'Por que isto importa',
      text: 'Uma busca completa custa O(n + m) com listas de adjacência — e resolve conexidade, componentes, ciclos, bipartição e caminhos mínimos não ponderados.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'BFS',
    title: 'Fila: descobre por camadas, e a camada é a distância',
    description: 'A BFS visita todos os vértices a distância 1, depois todos a distância 2, e assim por diante. O **nível** de v é exatamente `d(raiz, v)`.',
    points: [
      'Cada vértice entra na fila **uma vez**, quando é descoberto.',
      'Guarde `nível[v]` e `π[v]` na descoberta: dão a distância e o caminho de volta.',
      'A árvore da BFS é uma **árvore de caminhos mínimos** (em número de arestas).'
    ],
    note: {
      kind: 'warn',
      title: 'Mínimo em arestas, não em peso',
      text: 'BFS só resolve caminho mínimo quando todas as arestas custam o mesmo. Com pesos diferentes, é Dijkstra.'
    },
    graph: {
      ...buscaBase,
      caption: 'BFS a partir de A: níveis 0 · 1 · 2',
      nodes: [
        { id: 'A', x: 380, y: 70, state: 'active', note: 'nível 0' },
        { id: 'B', x: 200, y: 200, state: 'done', note: 'nível 1' },
        { id: 'C', x: 560, y: 200, state: 'done', note: 'nível 1' },
        { id: 'D', x: 200, y: 340, state: 'done', note: 'nível 2' },
        { id: 'E', x: 560, y: 340, state: 'done', note: 'nível 2' }
      ],
      edges: [
        { from: 'A', to: 'B', state: 'tree' },
        { from: 'A', to: 'C', state: 'tree' },
        { from: 'B', to: 'C', state: 'dim' },
        { from: 'B', to: 'D', state: 'tree' },
        { from: 'C', to: 'D', state: 'dim' },
        { from: 'C', to: 'E', state: 'tree' },
        { from: 'D', to: 'E', state: 'dim' }
      ]
    }
  },
  {
    type: 'table',
    eyebrow: 'BFS · classificação no não dirigido',
    title: 'Só existem quatro relações possíveis',
    description: 'Compare os níveis das duas pontas da aresta que **não** é de árvore.',
    headers: ['classe', 'níveis', 'no exemplo', 'significado'],
    rows: [
      ['árvore', 'ℓ e ℓ+1', 'AB, AC, BD, CE', 'descobriu o vértice'],
      ['irmão', 'mesmo nível, mesmo pai', 'B–C', 'os dois vieram de A'],
      ['primo', 'mesmo nível, pais diferentes', 'D–E', 'nenhum é ancestral do outro'],
      ['tio', 'níveis ℓ e ℓ+1, sem parentesco', 'C–D', 'liga camadas vizinhas por fora da árvore']
    ],
    note: {
      kind: 'key',
      title: 'O que a BFS proíbe',
      text: 'Numa BFS de grafo não dirigido **não existe** aresta ligando níveis com diferença ≥ 2. Se existisse, o nível menor teria descoberto o outro antes.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'DFS',
    title: 'Pilha: desce até o fim, e volta marcando os tempos',
    description: 'Cada vértice ganha dois carimbos: `d[v]` quando é descoberto e `f[v]` quando termina (todos os vizinhos já explorados).',
    points: [
      'Os intervalos `[d, f]` são **aninhados ou disjuntos** — nunca se cruzam.',
      '`[d(u), f(u)]` contém `[d(v), f(v)]` ⟺ v é descendente de u na árvore DFS.',
      'Aresta que volta para um vértice **cinza** (ainda aberto) é **aresta de retorno** — e ela denuncia um ciclo.'
    ],
    graph: {
      view: [760, 400],
      caption: 'ordem de adjacência A:[B,C] B:[A,D,C] D:[B,C,E] → A[1/10] B[2/9] D[3/8] C[4/7] E[5/6]',
      nodes: [
        { id: 'A', x: 380, y: 70, state: 'active', note: '1/10' },
        { id: 'B', x: 200, y: 200, state: 'done', note: '2/9' },
        { id: 'C', x: 560, y: 200, state: 'done', note: '4/7' },
        { id: 'D', x: 200, y: 340, state: 'done', note: '3/8' },
        { id: 'E', x: 560, y: 340, state: 'done', note: '5/6' }
      ],
      edges: [
        { from: 'A', to: 'B', state: 'tree' },
        { from: 'B', to: 'D', state: 'tree' },
        { from: 'D', to: 'C', state: 'tree' },
        { from: 'C', to: 'E', state: 'tree' },
        { from: 'A', to: 'C', state: 'warn', label: 'retorno' },
        { from: 'B', to: 'C', state: 'warn', label: 'retorno' },
        { from: 'D', to: 'E', state: 'warn', label: 'retorno' }
      ]
    }
  },
  {
    type: 'table',
    eyebrow: 'DFS · dígrafos',
    title: 'Quatro classes, lidas só nos intervalos',
    description: 'Para o arco (u,v), compare os intervalos. Não precisa olhar o desenho.',
    headers: ['classe', 'teste nos intervalos', 'o que significa'],
    rows: [
      ['árvore', 'v branco quando (u,v) é examinado', 'u descobriu v'],
      ['retorno', 'd(v) < d(u) < f(u) < f(v)', 'v é ancestral de u — **existe ciclo**'],
      ['avanço', 'd(u) < d(v) < f(v) < f(u), sem ser de árvore', 'v é descendente, alcançado por atalho'],
      ['cruzamento', 'f(v) < d(u) — intervalos disjuntos', 'v já tinha terminado; outra sub-árvore']
    ],
    note: {
      kind: 'key',
      title: 'O teste de ciclo mais barato que existe',
      text: 'Um dígrafo tem ciclo **se e somente se** a DFS encontra pelo menos uma aresta de retorno. É assim que se detecta DAG em O(n + m).'
    }
  },
  {
    type: 'compare',
    eyebrow: 'Decisão',
    title: 'BFS ou DFS?',
    columns: [
      {
        title: 'Use BFS',
        items: ['Distância em nº de arestas', 'Caminho mínimo não ponderado', 'Teste de bipartição', 'Menor nº de movimentos']
      },
      {
        title: 'Use DFS',
        items: ['Detectar ciclo', 'Ordenação topológica', 'CFCs (Kosaraju, Tarjan)', 'Articulações e pontes']
      },
      {
        title: 'Ambas dão',
        items: ['Componentes conexos', 'Árvore/floresta geradora', 'Teste de conexidade', 'Custo O(n + m)']
      }
    ]
  },
  {
    type: 'exercise',
    eyebrow: 'ENADE 2023 · Engenharia de Computação · questão 32',
    question: 'Uma transportadora calcula a rota de Manaus a São Paulo por busca gulosa (escolhe a cada passo a melhor alternativa disponível, pela estimativa de distância até São Paulo). Qual solução o algoritmo encontra?',
    alternatives: [
      'Manaus → Macapá → São Paulo',
      'Manaus → Porto Velho → Cuiabá → Goiânia → São Paulo',
      'Manaus → Porto Velho → Palmas → Goiânia → São Paulo',
      'Manaus → Macapá → Belém → Palmas → Goiânia → São Paulo'
    ],
    answer: 'Gabarito oficial: alternativa B — Manaus → Porto Velho → Cuiabá → Goiânia → São Paulo.',
    why: 'A busca gulosa olha só a heurística h (distância estimada até São Paulo), nunca o custo já percorrido. De Manaus, entre Macapá (2 665 km) e Porto Velho (2 464 km), escolhe Porto Velho. De lá, entre Cuiabá (1 326 km) e Palmas (1 489 km), escolhe Cuiabá. Depois Goiânia (809 km) e então São Paulo (0 km). Repare: a escolha é local e a rota resultante não tem garantia de ser ótima — essa é a diferença para Dijkstra e A*.'
  }
];
