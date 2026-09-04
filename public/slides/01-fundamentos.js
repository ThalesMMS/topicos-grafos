/**
 * Fundamentos — as propriedades que os algoritmos usam depois.
 * Sem narrativa: só o que volta a aparecer mais tarde.
 */

const g1 = {
  view: [700, 400],
  nodes: [
    { id: 'a', x: 150, y: 120, note: 'd = 2' },
    { id: 'b', x: 400, y: 90, note: 'd = 4' },
    { id: 'c', x: 620, y: 160, note: 'd = 1' },
    { id: 'd', x: 260, y: 320, note: 'd = 3' },
    { id: 'e', x: 500, y: 330, note: 'd = 2' }
  ],
  edges: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'a', to: 'd' },
    { from: 'b', to: 'd' },
    { from: 'b', to: 'e' },
    { from: 'd', to: 'e' }
  ]
};

export const fundamentos = [
  {
    type: 'section',
    kicker: 'Bloco 1',
    minutes: 5,
    title: 'As propriedades que os algoritmos gastam.',
    description: 'Cada item daqui reaparece como pré-condição, invariante ou custo de algum algoritmo dos próximos blocos.',
    topics: ['G = (V, E) e grau', 'aperto de mãos', 'representação e custo']
  },
  {
    type: 'definition',
    eyebrow: 'Definição',
    title: 'G = (V, E) — dois conjuntos, nada além disso',
    formulas: [
      'G = (V, E)      V finito e não vazio',
      'não dirigido:  aresta {u,v}  — par NÃO ordenado',
      'dirigido:      arco   (u,v)  — par ORDENADO, (u,v) ≠ (v,u)',
      'n = |V|        m = |E|'
    ],
    description: 'A direção não é enfeite: ela decide quais algoritmos se aplicam. Kosaraju e ordenação topológica só existem no dirigido; Prim e Kruskal só no não dirigido.',
    graph: { ...g1, caption: 'n = 5, m = 6' }
  },
  {
    type: 'definition',
    eyebrow: 'Propriedade 1 — a mais usada do curso',
    title: 'Lema do aperto de mãos',
    formulas: [
      '∑ d(v) = 2·m',
      'corolário: o nº de vértices de grau ÍMPAR é PAR'
    ],
    description: '**Prova, em uma linha:** cada aresta tem exatamente dois extremos, então contribui 2 para a soma. Some sobre as m arestas. ∎',
    points: [
      'No grafo ao lado: 2 + 4 + 1 + 3 + 2 = **12** = 2 · 6 ✓',
      'Uso imediato: se a soma dos graus der ímpar, **você errou a conta** — não existe grafo assim.',
      'Uso na prova: um grafo r-regular com n·r ímpar não existe, porque m = n·r/2 teria de ser inteiro.',
      'Laço soma **2** ao grau (os dois extremos são o mesmo vértice); cada paralela soma **1** de cada lado.'
    ],
    graph: { ...g1, caption: '∑d(v) = 2+4+1+3+2 = 12 = 2m' }
  },
  {
    type: 'question',
    source: 'ENADE 2011 · Computação · questão 20',
    poll: 'enade_aperto',
    statement: 'G é um grafo qualquer; V e E são os conjuntos de vértices e de arestas; grau(v) é o grau de um vértice v ∈ V. Analise as asserções — **1ª:** em G, a quantidade de vértices com grau ímpar é ímpar. **PORQUE** — **2ª:** para G, vale a identidade ∑ grau(v) = 2·|E|.',
    question: 'Acerca dessas asserções, assinale a opção correta.',
    alternatives: [
      { id: 'a', text: 'As duas são verdadeiras, e a 2ª justifica corretamente a 1ª.' },
      { id: 'b', text: 'As duas são verdadeiras, mas a 2ª não justifica a 1ª.' },
      { id: 'c', text: 'A 1ª é verdadeira e a 2ª é falsa.' },
      { id: 'd', text: 'A 1ª é falsa e a 2ª é verdadeira.' },
      { id: 'e', text: 'As duas são falsas.' }
    ],
    answer: 'd'
  },
  {
    type: 'question',
    source: 'ENADE 2011 · questão 20 · gabarito',
    reveal: true,
    answer: 'd',
    poll: 'enade_aperto',
    question: 'A identidade está certa; o corolário que a banca escreveu, não',
    statement: 'A 2ª asserção é o lema do aperto de mãos — verdadeira. A 1ª troca uma palavra: o número de vértices de grau ímpar é **PAR**, nunca ímpar.',
    alternatives: [
      { id: 'a', text: 'As duas verdadeiras, a 2ª justifica a 1ª' },
      { id: 'b', text: 'As duas verdadeiras, a 2ª não justifica a 1ª' },
      { id: 'c', text: 'A 1ª verdadeira e a 2ª falsa' },
      { id: 'd', text: 'A 1ª é falsa (é PAR) e a 2ª é verdadeira' },
      { id: 'e', text: 'As duas falsas' }
    ],
    why: 'Separe V em pares e ímpares: ∑d(v) = ∑(pares) + ∑(ímpares) = 2m. A soma dos graus pares é par, e 2m é par — logo a soma dos graus ímpares também é par. Uma soma de números ímpares só é par se houver uma quantidade PAR deles. No grafo ao lado, os ímpares são c (1) e d (3): exatamente dois. Como a 1ª asserção é falsa, nem se discute se a 2ª a justifica — o que já elimina A, B e C.',
    graph: {
      ...g1,
      caption: 'ímpares: c (1) e d (3) — dois, que é par',
      nodes: [
        { id: 'a', x: 150, y: 120, note: '2 par' },
        { id: 'b', x: 400, y: 90, note: '4 par' },
        { id: 'c', x: 620, y: 160, state: 'warn', note: '1 ÍMPAR' },
        { id: 'd', x: 260, y: 320, state: 'warn', note: '3 ÍMPAR' },
        { id: 'e', x: 500, y: 330, note: '2 par' }
      ]
    }
  },
  {
    type: 'table',
    eyebrow: 'Propriedade 2 — de onde vem a complexidade',
    title: 'A estrutura escolhida define o custo de todo algoritmo depois',
    description: 'BFS, DFS, Dijkstra e Kruskal têm as complexidades que têm **por causa desta tabela**. Trocar a estrutura troca o expoente.',
    headers: ['operação', 'matriz de adjacência', 'listas de adjacência'],
    rows: [
      ['espaço', 'Θ(n²)', '**Θ(n + m)**'],
      ['existe aresta u–v?', '**Θ(1)**', 'Θ(d(u))'],
      ['percorrer vizinhos de u', 'Θ(n)', '**Θ(d(u))**'],
      ['percorrer TODOS os vizinhos de TODOS', 'Θ(n²)', '**Θ(n + m)**'],
      ['grafo esparso (m ≈ n)', 'desperdiça', 'ideal'],
      ['grafo denso (m ≈ n²)', 'ideal', 'aceitável']
    ],
    note: {
      kind: 'key',
      title: 'A linha que explica o O(n + m)',
      text: 'Uma busca lê a lista de cada vértice uma vez. Como ∑d(v) = 2m (aperto de mãos!), o total é Θ(n + m). A propriedade anterior é literalmente a prova do custo da BFS.'
    }
  }
];
