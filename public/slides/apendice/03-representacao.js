/**
 * Módulo 3 — Representação: incidência, adjacência, listas e o custo de cada
 * escolha.
 */

const quadrado = {
  view: [700, 380],
  nodes: [
    { id: 'a', x: 200, y: 110 },
    { id: 'b', x: 500, y: 110 },
    { id: 'c', x: 500, y: 290 },
    { id: 'd', x: 200, y: 290 }
  ],
  edges: [
    { from: 'a', to: 'b', label: 'e₁' },
    { from: 'b', to: 'c', label: 'e₂' },
    { from: 'a', to: 'd', label: 'e₃' },
    { from: 'c', to: 'd', label: 'e₄' }
  ]
};

export const representacao = [
  {
    type: 'section',
    kicker: 'Módulo 3',
    title: 'O desenho precisa virar estrutura.',
    description: 'Nenhum algoritmo lê figura. Ele lê matriz ou lista — e a escolha muda o custo de tudo que vem depois.',
    topics: ['matriz de incidência', 'matriz de adjacência', 'listas', 'custo']
  },
  {
    type: 'graph',
    eyebrow: 'O grafo de referência do módulo',
    title: 'Quatro vértices, quatro arestas nomeadas',
    description: 'Repare que as **arestas têm nome** (e₁…e₄). A matriz de incidência precisa disso; a de adjacência, não.',
    graph: { ...quadrado, caption: 'V = {a,b,c,d}   E = {e₁=ab, e₂=bc, e₃=ad, e₄=cd}' }
  },
  {
    type: 'table',
    eyebrow: 'Estrutura 1',
    title: 'Matriz de incidência: n linhas × m colunas',
    description: '`B[v][e] = 1` se a aresta e é incidente ao vértice v. **Cada coluna tem exatamente dois 1** — os dois extremos da aresta.',
    headers: ['', 'e₁', 'e₂', 'e₃', 'e₄'],
    rows: [
      ['a', '1', '0', '1', '0'],
      ['b', '1', '1', '0', '0'],
      ['c', '0', '1', '0', '1'],
      ['d', '0', '0', '1', '1']
    ],
    note: {
      kind: 'tip',
      title: 'Como ler o grau na matriz',
      text: 'O grau de v é a soma da linha de v. Some a matriz inteira e você obtém 2m — o aperto de mãos de novo.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'Estrutura 1 · versão dirigida',
    title: 'Em dígrafo: −1 sai, +1 entra',
    description: 'A coluna do arco (u,v) tem **−1 na linha de u** e **+1 na linha de v**. A soma de cada coluna é 0.',
    points: [
      'Somando os valores positivos da linha de v: grau de entrada `d⁻(v)`.',
      'Somando os negativos (em módulo): grau de saída `d⁺(v)`.',
      'Laço é o caso degenerado: −1 e +1 na mesma linha, que se cancelam.'
    ],
    note: {
      kind: 'warn',
      title: 'Não confunda com adjacência',
      text: 'Incidência é n × m (vértice × aresta). Adjacência é n × n (vértice × vértice). Trocar as duas na prova custa a questão inteira.'
    },
    graph: {
      view: [700, 380],
      directed: true,
      caption: 'coluna de (a,b): −1 em a, +1 em b',
      nodes: [
        { id: 'a', x: 200, y: 110, state: 'active' },
        { id: 'b', x: 500, y: 110, state: 'active' },
        { id: 'c', x: 500, y: 290 },
        { id: 'd', x: 200, y: 290 }
      ],
      edges: [
        { from: 'a', to: 'b', label: '(a,b)', state: 'active' },
        { from: 'b', to: 'c' },
        { from: 'd', to: 'a' },
        { from: 'c', to: 'd' }
      ]
    }
  },
  {
    type: 'table',
    eyebrow: 'Estrutura 2',
    title: 'Matriz de adjacência: n × n',
    description: '`A[u][v] = 1` se existe aresta entre u e v. No **não dirigido a matriz é simétrica**; no dirigido, linha = quem sai, coluna = quem entra.',
    headers: ['', 'a', 'b', 'c', 'd'],
    rows: [
      ['a', '0', '1', '0', '1'],
      ['b', '1', '0', '1', '0'],
      ['c', '0', '1', '0', '1'],
      ['d', '1', '0', '1', '0']
    ],
    note: {
      kind: 'key',
      title: 'A vantagem que justifica o espaço',
      text: '"Existe aresta a–c?" responde em O(1): é só olhar A[a][c]. Nenhuma outra estrutura faz isso.'
    }
  },
  {
    type: 'code',
    eyebrow: 'Estrutura 3',
    title: 'Listas de adjacência: cada vértice guarda seus vizinhos',
    description: 'Espaço proporcional ao que existe — `O(n + m)` — e não ao que poderia existir. É a estrutura padrão de BFS, DFS, Dijkstra e Kruskal.',
    lines: [
      'a → [b, d]',
      'b → [a, c]',
      'c → [b, d]',
      'd → [a, c]',
      '',
      '// percorrer os vizinhos de u custa O(d(u)),',
      '// não O(n) como na matriz de adjacência'
    ],
    note: {
      kind: 'warn',
      title: 'O preço da lista',
      text: '"Existe aresta a–c?" custa O(d(a)): é preciso varrer a lista. Grafo denso com muita consulta pontual pede matriz.'
    }
  },
  {
    type: 'table',
    eyebrow: 'A decisão',
    title: 'Qual estrutura, e por quê',
    headers: ['operação', 'incidência', 'adjacência', 'listas'],
    rows: [
      ['espaço', 'O(n · m)', 'O(n²)', 'O(n + m)'],
      ['existe aresta u–v?', 'O(m)', '**O(1)**', 'O(d(u))'],
      ['percorrer vizinhos de u', 'O(m)', 'O(n)', '**O(d(u))**'],
      ['inserir aresta', 'O(n·m) (recria coluna)', 'O(1)', 'O(1)'],
      ['grafo esparso (m ≈ n)', 'péssimo', 'desperdiça O(n²)', '**ideal**'],
      ['grafo denso (m ≈ n²)', 'ruim', '**ideal**', 'aceitável']
    ],
    note: {
      kind: 'key',
      title: 'Regra prática',
      text: 'Esparso e vai percorrer: listas. Denso e vai consultar par a par: matriz de adjacência. Incidência: quando a *aresta* é o objeto (fluxo, circuitos, cortes).'
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · custo de estrutura',
    question: 'Um algoritmo percorre todos os vizinhos de cada vértice, uma vez. Avalie:',
    alternatives: [
      'I. Com listas de adjacência o percurso completo custa O(n + m).',
      'II. Com matriz de adjacência o percurso completo custa O(n²), mesmo que m seja pequeno.',
      'III. Para m ≈ n, a matriz de adjacência é assintoticamente melhor que as listas.'
    ],
    answer: 'Corretas: I e II.',
    why: 'I — cada lista é lida uma vez: ∑d(v) = 2m, mais O(n) para visitar os vértices. II — a matriz obriga a varrer as n posições de cada linha, existindo aresta ou não: n · n. III é falsa e inverte a conclusão: com m ≈ n, listas dão O(n) e a matriz dá O(n²) — a matriz é pior.'
  }
];
