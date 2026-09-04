/**
 * Percursos — Euler (critério e Fleury) e Hamilton (condições suficientes).
 */

const doisTriangulos = {
  view: [760, 400],
  nodes: [
    { id: 'a', x: 130, y: 110 },
    { id: 'b', x: 130, y: 300 },
    { id: 'c', x: 310, y: 205 },
    { id: 'd', x: 500, y: 205 },
    { id: 'e', x: 670, y: 110 },
    { id: 'f', x: 670, y: 300 }
  ],
  edges: [
    { from: 'a', to: 'b' },
    { from: 'a', to: 'c' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'e' },
    { from: 'd', to: 'f' },
    { from: 'e', to: 'f' }
  ]
};

const c5 = {
  view: [760, 400],
  nodes: [
    { id: '1', x: 380, y: 70, state: 'active', note: 'd=2' },
    { id: '2', x: 610, y: 200, state: 'active', note: 'd=2' },
    { id: '3', x: 530, y: 350, state: 'active', note: 'd=2' },
    { id: '4', x: 230, y: 350, state: 'active', note: 'd=2' },
    { id: '5', x: 150, y: 200, state: 'active', note: 'd=2' }
  ],
  edges: [
    { from: '1', to: '2', state: 'tree' },
    { from: '2', to: '3', state: 'tree' },
    { from: '3', to: '4', state: 'tree' },
    { from: '4', to: '5', state: 'tree' },
    { from: '5', to: '1', state: 'tree' }
  ]
};

export const percursos = [
  {
    type: 'section',
    kicker: 'Bloco 7',
    minutes: 5,
    title: 'Euler passa por arestas. Hamilton, por vértices.',
    description: 'Duas perguntas quase idênticas com dificuldades opostas: uma tem critério exato e linear, a outra é NP-completa.',
    topics: ['critério de Euler', 'Fleury', 'Dirac e Ore', 'o contraexemplo obrigatório']
  },
  {
    type: 'definition',
    eyebrow: 'Critério de Euler',
    title: 'Conte quantos graus ímpares existem',
    formulas: [
      'G conexo, contando os vértices de grau ÍMPAR:',
      '',
      '   0 ímpares  →  existe CICLO euleriano',
      '   2 ímpares  →  existe TRAJETO euleriano',
      '                 (começa num ímpar, termina no outro)',
      '  ≥4 ímpares  →  não existe nenhum dos dois'
    ],
    description: 'Cada passagem por um vértice **intermediário** gasta duas arestas: uma para entrar, outra para sair. Por isso vértice interno precisa de grau par.',
    points: [
      'Nunca existem exatamente 1 ou 3 ímpares — o **aperto de mãos do bloco 1** proíbe.',
      'Königsberg tinha **4** ímpares. Foi por isso que Euler respondeu "não existe", sem tentar.',
      'Em dígrafo: `d⁺(v) = d⁻(v)` para todo v (ciclo), com no máximo dois desbalanceados em ±1 (trajeto).'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'Aplicando',
    title: 'Dois ímpares: existe trajeto, não existe ciclo',
    description: 'Graus: a=2, b=2, **c=3**, **d=3**, e=2, f=2. Dois ímpares ⇒ trajeto euleriano que **começa em c e termina em d** (ou vice-versa).',
    graph: {
      ...doisTriangulos,
      caption: 'os únicos ímpares são c e d — as duas pontas obrigatórias',
      nodes: [
        { id: 'a', x: 130, y: 110, note: 'd=2' },
        { id: 'b', x: 130, y: 300, note: 'd=2' },
        { id: 'c', x: 310, y: 205, state: 'active', note: 'd=3' },
        { id: 'd', x: 500, y: 205, state: 'active', note: 'd=3' },
        { id: 'e', x: 670, y: 110, note: 'd=2' },
        { id: 'f', x: 670, y: 300, note: 'd=2' }
      ]
    },
    points: [
      'Você respondeu "existe trajeto" **sem construir nenhum trajeto**. O critério dispensa a construção.',
      'Custo de decidir: **Θ(n + m)** — é só somar graus.'
    ]
  },
  {
    type: 'steps',
    eyebrow: 'Fleury · construindo o trajeto',
    title: 'Nunca atravesse uma ponte cedo demais',
    description: 'A regra única: só use uma ponte quando ela for a **última** opção no vértice atual.',
    items: [
      { title: 'Comece num vértice ímpar', text: 'Aqui, em c. (Sem ímpares, comece em qualquer um.)' },
      { title: 'Gaste o triângulo da esquerda', text: 'c → a → b → c. A ponte c–d fica intacta: havia alternativa.' },
      { title: 'Agora a ponte é a única saída', text: 'Em c só resta c–d. Atravesse — e sem arrependimento, porque nada ficou para trás.' },
      { title: 'Gaste o triângulo da direita', text: 'd → e → f → d. Acabaram as arestas.' },
      { title: 'Trajeto completo', text: '**c–a–b–c–d–e–f–d**: as 7 arestas, cada uma uma vez, terminando no outro ímpar ✓' }
    ],
    note: {
      kind: 'warn',
      title: 'O erro que trava o algoritmo',
      text: 'Sair de c pela ponte no primeiro passo. Você vai para o lado direito e nunca volta: o triângulo da esquerda fica órfão e o trajeto morre incompleto.'
    },
    graph: {
      ...doisTriangulos,
      caption: 'primeiro o triângulo esquerdo; a ponte c–d por último',
      edges: [
        { from: 'a', to: 'b', state: 'tree' },
        { from: 'a', to: 'c', state: 'tree' },
        { from: 'b', to: 'c', state: 'tree' },
        { from: 'c', to: 'd', state: 'warn', label: 'ponte: por último' },
        { from: 'd', to: 'e', state: 'dim' },
        { from: 'd', to: 'f', state: 'dim' },
        { from: 'e', to: 'f', state: 'dim' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'Hamilton · condições SUFICIENTES',
    title: 'Dirac, Ore e Bondy–Chvátal',
    formulas: [
      'DIRAC   n ≥ 3  e  δ(G) ≥ n/2',
      '        ⇒ existe ciclo hamiltoniano',
      '',
      'ORE     d(u) + d(v) ≥ n  para todo par',
      '        u, v NÃO adjacente',
      '        ⇒ existe ciclo hamiltoniano',
      '',
      'BONDY–CHVÁTAL',
      '        G é hamiltoniano ⟺ fecho(G) é hamiltoniano'
    ],
    description: 'As três dizem "se o grafo for denso o bastante, o ciclo existe". **Nenhuma delas é necessária** — e é aí que a prova pega.',
    points: [
      'Dirac é caso particular de Ore: se todo grau ≥ n/2, qualquer soma de dois dá ≥ n.',
      'Ore só cobra dos pares **não adjacentes** — por isso alcança grafos que Dirac rejeita.',
      '**Fecho:** enquanto existir par não adjacente com d(u)+d(v) ≥ n, adicione a aresta. Se o fecho virar Kₙ, o original é hamiltoniano.'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'O contraexemplo que você tem de decorar',
    title: 'C₅: as três condições falham e o ciclo existe',
    description: 'No ciclo C₅ todo grau é 2. Dirac pede δ ≥ 2,5 — **falha**. Ore pede d(u)+d(v) ≥ 5 e o que existe é 4 — **falha**. O fecho não ganha aresta nenhuma.',
    graph: { ...c5, caption: 'δ = 2 < 5/2, e o ciclo hamiltoniano é o próprio C₅' },
    points: [
      'E, ainda assim, **1–2–3–4–5–1** é um ciclo hamiltoniano.',
      'Falhar em Dirac/Ore **não prova** que não é hamiltoniano.',
      'Condição suficiente só serve numa direção: se passa, existe; se falha, **não se sabe**.'
    ],
    note: {
      kind: 'key',
      title: 'A assimetria entre os dois problemas',
      text: 'Euler: critério necessário E suficiente, decidido em Θ(n+m) contando paridades. Hamilton: só condições suficientes, e decidir é NP-completo. Dois enunciados quase iguais, dificuldades opostas.'
    }
  },
  {
    type: 'compare',
    eyebrow: 'Não confunda os quatro nomes',
    title: 'Trajeto, ciclo, caminho — e o que "semi" significa',
    columns: [
      {
        title: 'Euler · arestas',
        items: [
          '**Ciclo euleriano:** usa toda aresta uma vez e volta ao início (0 ímpares)',
          '**Trajeto euleriano:** usa toda aresta uma vez, pontas diferentes (2 ímpares)',
          '"Semi-euleriano" = existe o trajeto, não o ciclo'
        ]
      },
      {
        title: 'Hamilton · vértices',
        items: [
          '**Ciclo hamiltoniano:** visita todo vértice uma vez e fecha',
          '**Caminho hamiltoniano:** visita todo vértice uma vez, pontas diferentes',
          '"Semi-hamiltoniano" = existe o caminho, não o ciclo'
        ]
      },
      {
        title: 'O erro de leitura',
        items: [
          'Trajeto **não repete aresta**; caminho **não repete vértice**',
          'Todo caminho é trajeto; a recíproca é falsa',
          'A palavra no enunciado decide qual teoria usar'
        ]
      }
    ]
  }
];
