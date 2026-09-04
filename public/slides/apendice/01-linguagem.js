/**
 * Módulo 1 — Linguagem e prova: conjuntos, relações, grau como função,
 * quantificadores e as cinco técnicas de justificativa.
 */

const trianguloComFolha = {
  view: [760, 420],
  nodes: [
    { id: 'a', x: 190, y: 150, note: 'd = 2' },
    { id: 'b', x: 400, y: 100, note: 'd = 4' },
    { id: 'c', x: 620, y: 160, note: 'd = 1' },
    { id: 'd', x: 300, y: 320, note: 'd = 3' },
    { id: 'e', x: 520, y: 330, note: 'd = 2' }
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

export const linguagem = [
  {
    type: 'section',
    kicker: 'Módulo 1',
    title: 'A linguagem antes do desenho.',
    description: 'Sem esse vocabulário, todo enunciado de prova parece ambíguo. Com ele, quase todo enunciado se resolve sozinho.',
    topics: ['G = (V, E)', 'grau como função', 'quantificadores', 'as 5 técnicas de prova']
  },
  {
    type: 'definition',
    eyebrow: 'Definição 1',
    title: 'G é um par de conjuntos',
    formulas: [
      'G = (V, E)',
      'V ≠ ∅, finito         E ⊆ { {u,v} : u,v ∈ V }'
    ],
    description: 'V é o conjunto de **vértices**; E, o de **arestas**. Grafo não dirigido: a aresta é um par *não ordenado*. Dígrafo: a aresta é um par *ordenado* e se chama **arco**.',
    points: [
      'V finito e não vazio — não existe grafo sem vértice.',
      'E pode ser vazio: um grafo só de vértices isolados é um grafo legítimo.',
      '`{u,v} = {v,u}` no não dirigido, mas `(u,v) ≠ (v,u)` no dígrafo.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'Definição 2',
    title: 'Cardinalidade: n e m',
    description: 'Toda contagem da prova sai desses dois números: `n = |V|` e `m = |E|`.',
    points: [
      '**n = |V| = 5** — cinco vértices.',
      '**m = |E| = 6** — seis arestas.',
      'Os nomes A, B, C são rótulos. Trocá-los não muda o grafo.'
    ],
    graph: {
      ...trianguloComFolha,
      caption: 'V = {a, b, c, d, e}   E = {ab, bc, ad, bd, be, de}'
    }
  },
  {
    type: 'concept',
    eyebrow: 'Definição 3',
    title: 'Adjacência é uma relação; incidência mistura naturezas',
    description: 'Confundir as duas é o erro de vocabulário que mais custa ponto.',
    points: [
      '**Adjacência** liga iguais: dois *vértices* adjacentes compartilham uma aresta; duas *arestas* adjacentes compartilham um extremo.',
      '**Incidência** liga diferentes: a aresta `{a,b}` é incidente aos vértices a e b.',
      'No não dirigido a adjacência é **simétrica**: a adjacente a b ⟺ b adjacente a a.',
      'Em dígrafo ela deixa de ser simétrica — e é aí que a teoria muda de forma.'
    ],
    note: {
      kind: 'warn',
      title: 'Não diga "vértice incidente a vértice"',
      text: 'Vértice é adjacente a vértice. Aresta é incidente a vértice. A banca lê isso.'
    },
    graph: {
      view: [760, 420],
      caption: 'a e b são adjacentes; a aresta ab é incidente a a e a b',
      nodes: [
        { id: 'a', x: 220, y: 190, state: 'active' },
        { id: 'b', x: 470, y: 130, state: 'active' },
        { id: 'c', x: 640, y: 300 },
        { id: 'd', x: 300, y: 350 }
      ],
      edges: [
        { from: 'a', to: 'b', label: 'incidente a a e a b', state: 'active' },
        { from: 'b', to: 'c' },
        { from: 'a', to: 'd' },
        { from: 'd', to: 'c', state: 'dim' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'Definição 4',
    title: 'Grau é uma função de V em ℕ',
    formulas: [
      'd : V → ℕ        d(v) = nº de arestas incidentes a v',
      'N(v) = { u ∈ V : {u,v} ∈ E }      (vizinhança)'
    ],
    description: 'Grau conta **arestas incidentes**, não vizinhos distintos. Em grafo simples os dois números coincidem; com laço ou paralela, não.',
    points: [
      'Laço soma **2** ao grau: seus dois extremos são o mesmo vértice.',
      'Cada paralela conta **uma vez cada** — são arestas diferentes.',
      'Grau 1 = vértice **pendente**. Grau 0 = vértice **isolado**.',
      'Em dígrafo o grau se parte em dois: `d⁻(v)` (entrada) e `d⁺(v)` (saída).'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'O caso que a prova cobra',
    title: 'Com laço e paralelas, d(a) = 4',
    description: 'Um laço em a, duas paralelas a–b e a aresta bc.',
    graph: {
      view: [760, 380],
      caption: 'd(a) = 2 (laço) + 2 (paralelas) = 4',
      nodes: [
        { id: 'a', x: 240, y: 240, state: 'active', note: 'd = 4' },
        { id: 'b', x: 500, y: 160, note: 'd = 3' },
        { id: 'c', x: 600, y: 320, note: 'd = 1' }
      ],
      edges: [
        { from: 'a', to: 'a', label: 'laço: soma 2', state: 'active' },
        { from: 'a', to: 'b', curve: 40, state: 'active' },
        { from: 'a', to: 'b', curve: -40, state: 'active' },
        { from: 'b', to: 'c' }
      ]
    },
    points: [
      'Soma dos graus: 4 + 3 + 1 = **8** = 2 · 4 arestas ✓'
    ],
    note: {
      kind: 'warn',
      title: 'O teste que denuncia o erro',
      text: 'Se você contar o laço como 1, a soma dá 7 — ímpar. Como ∑d(v) = 2m é sempre par, a própria conta acusa a conta errada.'
    }
  },
  {
    type: 'definition',
    eyebrow: 'Lema 1 — o mais usado do semestre',
    title: 'Lema do aperto de mãos',
    formulas: [
      '∑ d(v) = 2 · |E|',
      'corolário: o nº de vértices de grau ÍMPAR é PAR'
    ],
    description: '**Prova direta, em uma linha:** cada aresta tem exatamente dois extremos, então cada aresta contribui 2 para a soma total dos graus. Some sobre todas as arestas.',
    points: [
      'A soma dos graus é **sempre par** — não existe exceção.',
      'Logo os graus ímpares vêm aos pares: se um vértice é ímpar, existe outro.',
      'É o lema que decide, em Euler, se o trajeto existe (0 ou 2 ímpares).'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Contagem',
    title: 'Quantas arestas cabem: C(n, 2)',
    formulas: [
      'C(n,2) = n(n−1)/2       ← máximo em grafo simples',
      'grafo completo Kₙ: m = n(n−1)/2 e d(v) = n − 1 para todo v'
    ],
    description: 'Toda aresta simples é um par não ordenado de vértices distintos. O número de pares é o limite superior de |E|.',
    points: [
      'n = 5 ⇒ no máximo 10 arestas. K₅ tem exatamente 10.',
      'Se o enunciado der m > n(n−1)/2 num grafo simples, o objeto **não existe** — e a resposta é a contagem.',
      'Com laços e paralelas o limite deixa de valer: multigrafo não tem teto de arestas.'
    ]
  },
  {
    type: 'table',
    eyebrow: 'Dicionário',
    title: 'A notação que aparece nos enunciados',
    headers: ['símbolo', 'lê-se', 'significa'],
    rows: [
      ['n, m', 'ordem e tamanho', '|V| e |E|'],
      ['d(v), δ, Δ', 'grau, mínimo, máximo', 'grau de v; menor e maior grau de G'],
      ['N(v)', 'vizinhança de v', 'conjunto dos vértices adjacentes a v'],
      ['d(u,v)', 'distância', 'nº de arestas do menor caminho u→v'],
      ['G − v, G − e', 'remoção', 'apaga o vértice (e suas arestas) ou só a aresta'],
      ['G[S]', 'subgrafo induzido', 'só os vértices de S, com todas as arestas entre eles'],
      ['Kₙ, K₍p,q₎, Cₙ, Pₙ', 'completo, bipartido completo, ciclo, caminho', 'as famílias que aparecem em quase toda prova'],
      ['κ, λ', 'kappa, lambda', 'conectividade de vértices e de arestas'],
      ['χ, ω', 'chi, ômega', 'número cromático e tamanho da maior clique']
    ]
  },
  {
    type: 'section',
    kicker: 'Módulo 1 · parte 2',
    title: 'Cinco maneiras de justificar.',
    description: 'A prova quase nunca pede "calcule". Ela pede "mostre que" ou "é verdade que".',
    topics: ['direta', 'construção', 'contraexemplo', 'contradição', 'indução']
  },
  {
    type: 'compare',
    eyebrow: 'Escolha da técnica',
    title: 'Qual usar, e quando',
    columns: [
      {
        title: 'Direta',
        description: 'Para "todo G com P tem Q".',
        items: ['Parta da hipótese', 'Aplique a definição', 'Chegue na tese']
      },
      {
        title: 'Construção',
        description: 'Para "existe G tal que…".',
        items: ['Exiba o objeto', 'Confira cada propriedade pedida', 'Um exemplo basta']
      },
      {
        title: 'Contraexemplo',
        description: 'Para derrubar um "sempre".',
        items: ['Um G concreto', 'Mostre P verdadeiro e Q falso', 'Não precisa explicar o porquê geral']
      },
      {
        title: 'Contradição / indução',
        description: 'Quando o direto empaca.',
        items: ['Negue a tese e ache o absurdo', 'Ou: base + HI + passo', 'Em grafo, o passo costuma remover uma folha']
      }
    ]
  },
  {
    type: 'steps',
    eyebrow: 'Indução em grafos',
    title: 'O passo quase sempre é "remova uma folha"',
    description: 'Provar que toda árvore com n vértices tem n − 1 arestas.',
    items: [
      { title: 'Base: n = 1', text: 'Um vértice, nenhuma aresta. 1 − 1 = 0 ✓' },
      { title: 'Hipótese (HI)', text: 'Toda árvore com k vértices tem k − 1 arestas.' },
      { title: 'Passo: ache uma folha', text: 'Toda árvore com ≥ 2 vértices tem pelo menos duas folhas — senão todo grau ≥ 2 e existiria ciclo.' },
      { title: 'Remova a folha', text: 'T − f continua conexa e acíclica: é árvore com k vértices. Pela HI, tem k − 1 arestas.' },
      { title: 'Devolva a folha', text: 'A folha traz de volta exatamente uma aresta: (k − 1) + 1 = k arestas para k + 1 vértices ✓' }
    ],
    note: {
      kind: 'tip',
      title: 'Por que folha, e não um vértice qualquer',
      text: 'Remover um vértice de grau ≥ 2 pode desconectar a árvore — aí o objeto restante não é árvore e a HI não se aplica.'
    },
    graph: {
      view: [760, 420],
      caption: 'T − f ainda é árvore: a HI vale para ela',
      nodes: [
        { id: 'r', x: 380, y: 90 },
        { id: 'u', x: 230, y: 220 },
        { id: 'v', x: 530, y: 220 },
        { id: 'w', x: 150, y: 350 },
        { id: 'f', x: 330, y: 350, state: 'warn', note: 'folha' }
      ],
      edges: [
        { from: 'r', to: 'u', state: 'tree' },
        { from: 'r', to: 'v', state: 'tree' },
        { from: 'u', to: 'w', state: 'tree' },
        { from: 'u', to: 'f', state: 'warn' }
      ]
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Exercício 1 · use o lema',
    question: 'Existe grafo simples com 5 vértices, todos de grau 3?',
    alternatives: [
      'Sim, é o K₅ sem um emparelhamento.',
      'Não — e a razão é a paridade.',
      'Depende: existe se permitirmos laços.'
    ],
    answer: 'Não existe.',
    why: 'A soma dos graus seria 5 · 3 = 15, ímpar. Mas ∑d(v) = 2m é sempre par. Contradição — o objeto não existe, independentemente de desenho. (A terceira alternativa também falha: laço deixaria de ser grafo simples.)'
  },
  {
    type: 'list',
    eyebrow: 'Fecha o módulo 1',
    title: 'Checklist de justificativa',
    items: [
      'Escrevi a **definição** que estou usando, com V e E?',
      'A **hipótese** do enunciado apareceu em algum passo? Se não apareceu, provei outra coisa.',
      'Se é "existe", **exibi** o objeto? Se é "todo", cuidei do **caso geral**?',
      'Se é falso, dei um **contraexemplo concreto** — com V, E e a conta?',
      'Conferi a **paridade**: ∑d(v) é par? m ≤ n(n−1)/2?'
    ],
    note: {
      kind: 'key',
      title: 'Em uma frase',
      text: 'Desenho é rascunho; conta sobre V e E é resposta.'
    }
  }
];
