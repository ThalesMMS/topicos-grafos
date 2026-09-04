/**
 * Módulo 7 — Árvores, árvores geradoras e AGM (Prim, Kruskal, corte seguro).
 */

const ponderado = {
  view: [760, 420],
  nodes: [
    { id: 'A', x: 150, y: 120 },
    { id: 'B', x: 400, y: 90 },
    { id: 'C', x: 650, y: 160 },
    { id: 'D', x: 270, y: 330 },
    { id: 'E', x: 570, y: 340 }
  ],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'D', weight: 3 },
    { from: 'B', to: 'D', weight: 4 },
    { from: 'B', to: 'C', weight: 6 },
    { from: 'B', to: 'E', weight: 5 },
    { from: 'C', to: 'E', weight: 3 },
    { from: 'D', to: 'E', weight: 7 }
  ]
};

const agm = {
  ...ponderado,
  edges: [
    { from: 'A', to: 'B', weight: 2, state: 'tree' },
    { from: 'A', to: 'D', weight: 3, state: 'tree' },
    { from: 'B', to: 'D', weight: 4, state: 'dim' },
    { from: 'B', to: 'C', weight: 6, state: 'dim' },
    { from: 'B', to: 'E', weight: 5, state: 'tree' },
    { from: 'C', to: 'E', weight: 3, state: 'tree' },
    { from: 'D', to: 'E', weight: 7, state: 'dim' }
  ]
};

export const arvores = [
  {
    type: 'section',
    kicker: 'Módulo 7',
    title: 'Árvores: o mínimo que conecta.',
    description: 'Conectar n vértices custa pelo menos n − 1 arestas. Árvore é exatamente o caso em que não sobra nenhuma.',
    topics: ['árvore e folhas', 'geradora', 'AGM', 'Prim e Kruskal']
  },
  {
    type: 'definition',
    eyebrow: 'Definição',
    title: 'Árvore = conexo + acíclico',
    formulas: [
      'T é árvore  ⟺  T é conexo e sem ciclos',
      '|E| = |V| − 1'
    ],
    description: 'As caracterizações abaixo são **todas equivalentes**. Numa prova, use a que der menos trabalho.',
    points: [
      'T é conexo e tem n − 1 arestas.',
      'T é acíclico e tem n − 1 arestas.',
      'Existe **um único caminho** entre cada par de vértices.',
      'Remover qualquer aresta desconecta (**toda** aresta é ponte).',
      'Adicionar qualquer aresta cria **exatamente um** ciclo.'
    ],
    note: {
      kind: 'tip',
      title: 'Atalho de prova',
      text: 'Provar duas das três — conexo, acíclico, n − 1 arestas — já implica a terceira. Escolha as duas mais fáceis do enunciado.'
    }
  },
  {
    type: 'graph',
    eyebrow: 'Anatomia',
    title: 'Folhas, internos e o caminho único',
    description: 'Toda árvore com pelo menos 2 vértices tem **no mínimo duas folhas** (grau 1). Se todo grau fosse ≥ 2, haveria ciclo.',
    graph: {
      view: [760, 400],
      caption: 'caminho único de D até F: D–B–A–C–F',
      nodes: [
        { id: 'A', x: 380, y: 90, state: 'active' },
        { id: 'B', x: 210, y: 220, state: 'active' },
        { id: 'C', x: 550, y: 220, state: 'active' },
        { id: 'D', x: 110, y: 350, state: 'active', note: 'folha' },
        { id: 'E', x: 310, y: 350, note: 'folha' },
        { id: 'F', x: 550, y: 350, state: 'active', note: 'folha' }
      ],
      edges: [
        { from: 'A', to: 'B', state: 'active' },
        { from: 'A', to: 'C', state: 'active' },
        { from: 'B', to: 'D', state: 'active' },
        { from: 'B', to: 'E' },
        { from: 'C', to: 'F', state: 'active' }
      ]
    },
    points: [
      'n = 6, m = 5 = n − 1 ✓',
      'Não existe atalho: qualquer desvio repetiria vértice e criaria ciclo.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Do grafo para a árvore',
    title: 'Árvore geradora e AGM',
    formulas: [
      'geradora: T ⊆ G, V(T) = V(G), T é árvore',
      'AGM: geradora que minimiza  w(T) = ∑ w(e), e ∈ T'
    ],
    description: 'Todo grafo conexo tem árvore geradora — basta ir derrubando uma aresta de cada ciclo até não sobrar nenhum. Se G é desconexo, você obtém uma **floresta geradora**.',
    points: [
      'A aresta que fica chama-se **ramo**; a que sai, **elo** (ou corda).',
      'Número de elos: m − (n − 1) = m − n + 1, o **número ciclomático**.',
      'A AGM não é única quando há empate de pesos — mas o **custo mínimo** é único.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'O teorema que sustenta os dois algoritmos',
    title: 'Aresta leve de um corte é segura',
    description: 'Corte é uma partição de V em (S, V∖S). Uma aresta **cruza** o corte se tem uma ponta em cada lado. A aresta de menor peso que cruza um corte pertence a alguma AGM.',
    points: [
      '**Prim** e **Kruskal** são a mesma ideia: escolher repetidamente uma aresta leve de corte.',
      'Prim mantém **um** corte crescendo a partir de S. Kruskal usa o corte implícito entre componentes.',
      'É por isso que dois algoritmos tão diferentes chegam ao mesmo custo.'
    ],
    note: {
      kind: 'key',
      title: 'A justificativa por troca',
      text: 'Se uma AGM T não contém a aresta leve e do corte, adicione e a T: forma-se um ciclo que cruza o corte de volta por outra aresta e′, com w(e′) ≥ w(e). Trocar e′ por e não piora o custo — logo existe AGM que contém e.'
    },
    graph: {
      ...ponderado,
      caption: 'corte S = {A, B, D}: cruzam BC(6), BE(5), DE(7) → a leve é BE(5)',
      nodes: [
        { id: 'A', x: 150, y: 120, state: 'done' },
        { id: 'B', x: 400, y: 90, state: 'done' },
        { id: 'C', x: 650, y: 160 },
        { id: 'D', x: 270, y: 330, state: 'done' },
        { id: 'E', x: 570, y: 340 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 2 },
        { from: 'A', to: 'D', weight: 3 },
        { from: 'B', to: 'D', weight: 4 },
        { from: 'B', to: 'C', weight: 6, state: 'dim' },
        { from: 'B', to: 'E', weight: 5, state: 'active' },
        { from: 'C', to: 'E', weight: 3 },
        { from: 'D', to: 'E', weight: 7, state: 'dim' }
      ]
    }
  },
  {
    type: 'steps',
    eyebrow: 'Prim',
    title: 'Cresce uma única árvore a partir de uma raiz',
    description: 'Partindo de A no grafo do módulo. Mantenha uma chave por vértice: o menor peso que o liga à árvore.',
    items: [
      { title: 'Início: A na árvore', text: 'Chaves: B=2, D=3, C=∞, E=∞.' },
      { title: 'Extrai B (chave 2)', text: 'Inclui AB. Relaxa: D melhora? min(3, 4) = 3, fica. C=6, E=5.' },
      { title: 'Extrai D (chave 3)', text: 'Inclui AD. Relaxa por D: E teria 7 > 5, não melhora.' },
      { title: 'Extrai E (chave 5)', text: 'Inclui BE. Relaxa por E: C cai de 6 para **3**.' },
      { title: 'Extrai C (chave 3)', text: 'Inclui CE. Cinco vértices na árvore: pare. Custo 2+3+5+3 = **13**.' }
    ],
    note: {
      kind: 'tip',
      title: 'Custo',
      text: 'Com fila de prioridade binária: O(m log n). Com heap de Fibonacci: O(m + n log n).'
    },
    graph: { ...agm, caption: 'AGM = {AB, AD, BE, CE}, custo 13' }
  },
  {
    type: 'steps',
    eyebrow: 'Kruskal',
    title: 'Ordena as arestas e recusa quem fecha ciclo',
    description: 'Começa com n árvores triviais (um vértice cada) e vai fundindo.',
    items: [
      { title: 'Ordene por peso', text: 'AB(2), AD(3), CE(3), BD(4), BE(5), BC(6), DE(7).' },
      { title: 'AB(2): aceita', text: 'Une {A} e {B}.' },
      { title: 'AD(3): aceita', text: 'Une {A,B} e {D}.' },
      { title: 'CE(3): aceita', text: 'Une {C} e {E} — componente separado, sem problema.' },
      { title: 'BD(4): RECUSA', text: 'B e D já estão no mesmo componente: fecharia o ciclo A–B–D–A.' },
      { title: 'BE(5): aceita e encerra', text: 'Une os dois componentes. São n − 1 = 4 arestas: pare. Custo **13** — o mesmo de Prim.' }
    ],
    note: {
      kind: 'key',
      title: 'Como testar o ciclo em O(α(n))',
      text: 'Union-Find: aceite a aresta só se `find(u) ≠ find(v)`, e então faça `union(u,v)`. Ordenar domina o custo: O(m log m).'
    }
  },
  {
    type: 'compare',
    eyebrow: 'Decisão',
    title: 'Prim ou Kruskal',
    columns: [
      {
        title: 'Prim',
        description: 'O(m log n) com heap.',
        items: ['Mantém UMA árvore conexa o tempo todo', 'Bom em grafo denso', 'Precisa de fila de prioridade']
      },
      {
        title: 'Kruskal',
        description: 'O(m log m) dominado pela ordenação.',
        items: ['Mantém uma FLORESTA que se funde', 'Bom em grafo esparso', 'Precisa de Union-Find']
      },
      {
        title: 'Em comum',
        items: ['Ambos são gulosos e ambos são ótimos', 'Ambos dependem do corte seguro', 'Exigem grafo conexo e não dirigido']
      }
    ],
    note: {
      kind: 'warn',
      title: 'Empate de pesos',
      text: 'Com pesos repetidos a AGM pode não ser única. Na prova, declare o critério de desempate (ordem lexicográfica, por exemplo) antes de rodar.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'Ciclo fundamental',
    title: 'Cada elo fecha exatamente um ciclo',
    description: 'Adicione a T um elo e = {u,v}. Como T já tem um caminho único de u a v, o resultado tem **exatamente um** ciclo — o ciclo fundamental de e em relação a T.',
    points: [
      'Elo BD(4): o caminho em T de B a D é B–A–D. Ciclo fundamental: **B–A–D–B**.',
      'Se uma aresta da AGM some, o grafo se parte em dois lados: reconecte pela **aresta leve do corte** e a AGM se atualiza em O(m).',
      'Número de ciclos fundamentais = número de elos = m − n + 1.'
    ],
    graph: {
      ...ponderado,
      caption: 'BD(4) fecha o ciclo fundamental B–A–D–B',
      edges: [
        { from: 'A', to: 'B', weight: 2, state: 'active' },
        { from: 'A', to: 'D', weight: 3, state: 'active' },
        { from: 'B', to: 'D', weight: 4, state: 'warn' },
        { from: 'B', to: 'C', weight: 6, state: 'dim' },
        { from: 'B', to: 'E', weight: 5, state: 'tree' },
        { from: 'C', to: 'E', weight: 3, state: 'tree' },
        { from: 'D', to: 'E', weight: 7, state: 'dim' }
      ]
    }
  },
  {
    type: 'poll',
    poll: 'agm',
    eyebrow: 'Checkpoint'
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · AGM',
    question: 'Sobre a árvore geradora mínima T de um grafo conexo e ponderado G, avalie:',
    alternatives: [
      'I. Prim e Kruskal sempre produzem árvores com o mesmo custo total.',
      'II. O caminho entre dois vértices dentro de T é sempre um caminho de custo mínimo em G.',
      'III. Se todos os pesos de G forem distintos, a AGM é única.'
    ],
    answer: 'Corretas: I e III.',
    why: 'I — os dois são ótimos, logo o custo coincide (as árvores podem diferir se houver empate, o custo não). II é falsa e é o erro clássico: AGM minimiza a **soma global**, não distância entre pares. No grafo do módulo, o caminho de D a E em T é D–A–B–E, custo 3+2+5 = 10, enquanto a aresta DE custa 7. III — com pesos distintos, o argumento de troca nunca encontra empate e a escolha em cada corte é forçada.'
  }
];
