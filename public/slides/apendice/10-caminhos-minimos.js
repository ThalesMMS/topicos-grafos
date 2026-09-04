/**
 * Módulo 10 — Caminhos mínimos: BFS, Dijkstra, Bellman-Ford e Floyd-Warshall.
 */

const redeDijkstra = {
  view: [760, 400],
  directed: true,
  nodes: [
    { id: 'S', x: 120, y: 210 },
    { id: 'A', x: 350, y: 100 },
    { id: 'B', x: 350, y: 320 },
    { id: 'T', x: 640, y: 210 }
  ],
  edges: [
    { from: 'S', to: 'A', weight: 2 },
    { from: 'S', to: 'B', weight: 5 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'T', weight: 7 },
    { from: 'B', to: 'T', weight: 3 }
  ]
};

export const caminhosMinimos = [
  {
    type: 'section',
    kicker: 'Módulo 10',
    title: 'Menos arestas não é menos custo.',
    description: 'Três algoritmos, três hipóteses diferentes sobre os pesos. Escolher o errado é o erro mais frequente da prova.',
    topics: ['BFS × Dijkstra', 'relaxamento', 'Bellman-Ford', 'Floyd-Warshall']
  },
  {
    type: 'concept',
    eyebrow: 'A distinção de partida',
    title: 'Hops mínimos ≠ custo mínimo',
    description: 'De S a T há um caminho com **1 aresta**? Não — mas há um de 2 arestas (S–A–T, custo 9) e um de 3 (S–A–B–T, custo **6**). O mais curto em arestas é o mais caro.',
    points: [
      'Todas as arestas com o mesmo peso → **BFS** resolve, O(n + m).',
      'Pesos diferentes e **não negativos** → **Dijkstra**.',
      'Existe peso negativo → **Bellman-Ford**.',
      'Preciso de todos os pares → **Floyd-Warshall**.'
    ],
    graph: {
      ...redeDijkstra,
      caption: 'S–A–T tem 2 arestas e custa 9; S–A–B–T tem 3 e custa 6',
      edges: [
        { from: 'S', to: 'A', weight: 2, state: 'active' },
        { from: 'S', to: 'B', weight: 5, state: 'dim' },
        { from: 'A', to: 'B', weight: 1, state: 'active' },
        { from: 'A', to: 'T', weight: 7, state: 'warn' },
        { from: 'B', to: 'T', weight: 3, state: 'active' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'A operação básica dos três algoritmos',
    title: 'Relaxamento',
    formulas: [
      'RELAX(u, v):',
      '  se  d[v] > d[u] + w(u,v):',
      '      d[v] ← d[u] + w(u,v)',
      '      π[v] ← u'
    ],
    description: 'Toda a diferença entre Dijkstra, Bellman-Ford e Floyd-Warshall está em **em que ordem** e **quantas vezes** se relaxa cada aresta.',
    points: [
      '`d[v]` é sempre uma **estimativa superior** da distância real — nunca fica abaixo dela.',
      '`π[v]` guarda o predecessor: é assim que se reconstrói o caminho no fim, andando de trás para frente.',
      'Inicialização: `d[origem] = 0`, todo o resto `∞`.'
    ]
  },
  {
    type: 'steps',
    eyebrow: 'Dijkstra',
    title: 'Feche sempre o vértice aberto de menor estimativa',
    description: 'Partindo de S. "Fechar" significa: a distância daquele vértice está definitiva e não muda mais.',
    items: [
      { title: 'Início', text: 'd[S]=0; A=B=T=∞. Nenhum vértice fechado.' },
      { title: 'Fecha S (0)', text: 'Relaxa S→A: d[A]=2. Relaxa S→B: d[B]=5.' },
      { title: 'Fecha A (2) — o menor aberto', text: 'Relaxa A→B: 2+1 = 3 < 5, então **d[B] cai para 3**, π[B]=A. Relaxa A→T: d[T]=9.' },
      { title: 'Fecha B (3)', text: 'Relaxa B→T: 3+3 = 6 < 9, então **d[T]=6**, π[T]=B.' },
      { title: 'Fecha T (6). Fim.', text: 'Reconstrói por π: T←B←A←S. Caminho **S–A–B–T**, custo 6.' }
    ],
    note: {
      kind: 'key',
      title: 'Por que fechar o menor é seguro',
      text: 'Com pesos ≥ 0, nenhum caminho que ainda passe por vértices abertos pode chegar mais barato — qualquer desvio só adiciona peso não negativo. É exatamente esse argumento que morre com peso negativo.'
    },
    graph: {
      ...redeDijkstra,
      caption: 'd[S]=0 · d[A]=2 · d[B]=3 · d[T]=6',
      nodes: [
        { id: 'S', x: 120, y: 210, state: 'active', note: '0' },
        { id: 'A', x: 350, y: 100, state: 'done', note: '2' },
        { id: 'B', x: 350, y: 320, state: 'done', note: '3' },
        { id: 'T', x: 640, y: 210, state: 'done', note: '6' }
      ],
      edges: [
        { from: 'S', to: 'A', weight: 2, state: 'tree' },
        { from: 'S', to: 'B', weight: 5, state: 'dim' },
        { from: 'A', to: 'B', weight: 1, state: 'tree' },
        { from: 'A', to: 'T', weight: 7, state: 'dim' },
        { from: 'B', to: 'T', weight: 3, state: 'tree' }
      ]
    }
  },
  {
    type: 'graph',
    eyebrow: 'Onde Dijkstra quebra',
    title: 'Um arco negativo derruba o invariante',
    description: 'Dijkstra fecharia **a** com d = 6 logo no início. Mas o caminho s→b→a custa 7 − 3 = **4**. Como a já estava fechado, a correção nunca acontece.',
    graph: {
      view: [760, 400],
      directed: true,
      caption: 'd[a] real = 4 pelo caminho s→b→a; Dijkstra devolveria 6',
      nodes: [
        { id: 's', x: 120, y: 210, state: 'active', note: '0' },
        { id: 'a', x: 380, y: 100, state: 'warn', note: '6 ✗ / 4 ✓' },
        { id: 'b', x: 380, y: 320, state: 'done', note: '7' },
        { id: 'c', x: 650, y: 210, note: '9' }
      ],
      edges: [
        { from: 's', to: 'a', weight: 6 },
        { from: 's', to: 'b', weight: 7 },
        { from: 'b', to: 'a', weight: -3, state: 'warn' },
        { from: 'a', to: 'c', weight: 5, state: 'tree' },
        { from: 'b', to: 'c', weight: 9, state: 'dim' }
      ]
    },
    note: {
      kind: 'warn',
      title: 'Não tente "consertar" somando uma constante',
      text: 'Somar k a todos os pesos para eliminar o negativo muda o resultado: caminhos com mais arestas recebem mais k e deixam de competir em igualdade. Não funciona.'
    }
  },
  {
    type: 'steps',
    eyebrow: 'Bellman-Ford',
    title: 'Relaxe TODAS as arestas, n − 1 vezes',
    description: 'Sem escolher ordem esperta: força bruta ordenada. Custo O(n · m).',
    items: [
      { title: 'Inicialize', text: 'd[s] = 0, resto ∞.' },
      { title: 'Repita n − 1 vezes', text: 'Em cada passagem, relaxe **todas** as m arestas, em qualquer ordem fixa.' },
      { title: 'Por que n − 1 basta', text: 'Um caminho mínimo tem no máximo n − 1 arestas. A passagem k garante corretas todas as distâncias que usam até k arestas.' },
      { title: 'Passagem extra: o teste', text: 'Rode uma n-ésima passagem. Se **alguma** distância ainda melhorar, existe ciclo negativo alcançável.' },
      { title: 'Ciclo negativo', text: 'Aí não existe caminho mínimo: dar mais uma volta no ciclo sempre barateia, e o ínfimo é −∞.' }
    ],
    note: {
      kind: 'key',
      title: 'O que Bellman-Ford entrega além do resultado',
      text: 'Ele é o único dos três que **detecta** ciclo negativo. Dijkstra dá resposta errada em silêncio; Floyd-Warshall denuncia pela diagonal.'
    }
  },
  {
    type: 'definition',
    eyebrow: 'Floyd-Warshall',
    title: 'Todos os pares, por programação dinâmica',
    formulas: [
      'dist(i, j, k) = menor caminho i→j usando só {1..k} como INTERMEDIÁRIOS',
      '',
      'dist(i,j,k) = min( dist(i,j,k−1),',
      '                   dist(i,k,k−1) + dist(k,j,k−1) )'
    ],
    description: 'Em cada rodada k você pergunta uma coisa só: **"passar por k melhora o caminho de i até j?"**. Três laços aninhados, O(n³).',
    points: [
      'D⁽⁰⁾ é a matriz de pesos: só as arestas diretas, ∞ onde não há arco.',
      'k é o **intermediário liberado**, nunca o número de saltos. Confundir os dois é o erro clássico.',
      'Aceita pesos negativos. Se algum `dist(i,i) < 0` no fim, há ciclo negativo passando por i.',
      'Para reconstruir o caminho, guarde a matriz de intermediários junto.'
    ]
  },
  {
    type: 'table',
    eyebrow: 'A decisão',
    title: 'Qual algoritmo, sob qual hipótese',
    headers: ['algoritmo', 'pesos', 'origem', 'custo', 'detecta ciclo negativo?'],
    rows: [
      ['BFS', 'todos iguais', 'uma', 'O(n + m)', 'não se aplica'],
      ['Dijkstra', '**≥ 0**', 'uma', 'O(m log n)', 'não — erra em silêncio'],
      ['Bellman-Ford', 'quaisquer', 'uma', 'O(n · m)', '**sim**'],
      ['Floyd-Warshall', 'quaisquer', 'todos os pares', 'O(n³)', 'sim (diagonal < 0)']
    ],
    note: {
      kind: 'tip',
      title: 'Regra de bolso',
      text: 'Peso negativo na figura? Risque Dijkstra da lista antes de ler o resto do enunciado.'
    }
  },
  {
    type: 'poll',
    poll: 'dijkstra',
    eyebrow: 'Checkpoint'
  },
  {
    type: 'exercise',
    eyebrow: 'ENADE 2023 · Engenharia de Computação · questão 11',
    question: 'O OSPF modela o sistema autônomo como grafo ponderado (roteadores = vértices, conexões = arestas, atrasos = pesos) e usa uma versão distribuída de Dijkstra. Avalie:',
    alternatives: [
      'I. Havendo vários caminhos, a rota escolhida é a de menor número de conexões.',
      'II. Cada roteador do SA mantém uma instância da base de dados com o grafo que descreve o SA.',
      'III. Dijkstra é executado por um único roteador, que distribui a tabela de rotas aos demais.',
      'IV. É necessário haver tráfego de informações sobre atrasos e conexões entre todos os roteadores do SA.'
    ],
    answer: 'Gabarito oficial: alternativa C — II e IV, apenas.',
    why: 'I é falsa: o critério é a **soma dos atrasos**, não a contagem de saltos — é exatamente a distinção "hops × custo" deste módulo. III é falsa: o algoritmo é distribuído, cada roteador roda Dijkstra sobre a própria cópia do grafo. II e IV descrevem o funcionamento real: a inundação de estados de enlace faz todo roteador convergir para a mesma base, e é essa troca de mensagens que a mantém atualizada.'
  }
];
