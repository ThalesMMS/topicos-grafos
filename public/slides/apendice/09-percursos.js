/**
 * Módulo 9 — Percursos especiais: Euler (critério e Fleury) e Hamilton
 * (Dirac, Ore, Bondy–Chvátal e o caso DAG).
 */

const doisTriangulos = {
  view: [760, 400],
  nodes: [
    { id: 'a', x: 130, y: 120, note: 'd=2' },
    { id: 'b', x: 130, y: 300, note: 'd=2' },
    { id: 'c', x: 300, y: 210, note: 'd=3 ímpar' },
    { id: 'd', x: 480, y: 210, note: 'd=3 ímpar' },
    { id: 'e', x: 650, y: 120, note: 'd=2' },
    { id: 'f', x: 650, y: 300, note: 'd=2' }
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

export const percursos = [
  {
    type: 'section',
    kicker: 'Módulo 9',
    title: 'Euler passa por arestas. Hamilton, por vértices.',
    description: 'Uma pergunta quase idêntica, dois destinos opostos: Euler tem critério exato e linear; Hamilton é NP-completo.',
    topics: ['critério de Euler', 'Fleury', 'Dirac, Ore, Bondy–Chvátal', 'Hamilton em DAG']
  },
  {
    type: 'compare',
    eyebrow: 'A distinção que a prova cobra',
    title: 'Duas perguntas parecidas, dificuldades opostas',
    columns: [
      {
        title: 'Euler',
        description: 'Usar cada ARESTA exatamente uma vez.',
        items: ['Critério exato pela paridade dos graus', 'Decidir custa O(n + m)', 'Construir: Fleury ou Hierholzer']
      },
      {
        title: 'Hamilton',
        description: 'Visitar cada VÉRTICE exatamente uma vez.',
        items: ['Nenhum critério necessário e suficiente conhecido', 'Decidir é NP-completo', 'Só há condições SUFICIENTES']
      },
      {
        title: 'Cuidado com o nome',
        items: ['Ciclo: fecha onde começou', 'Trajeto/caminho: pontas diferentes', '"Semi-" = existe o aberto, não o fechado']
      }
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Critério de Euler',
    title: 'Conte quantos graus ímpares existem',
    formulas: [
      'G conexo:',
      '  0 vértices de grau ímpar → existe CICLO euleriano',
      '  2 vértices de grau ímpar → existe TRAJETO euleriano',
      '                              (começa num ímpar, termina no outro)',
      '  4 ou mais ímpares         → não existe nenhum dos dois'
    ],
    description: 'Cada passagem por um vértice intermediário gasta **duas** arestas: uma para entrar, outra para sair. Por isso vértice interno precisa de grau par.',
    points: [
      'Nunca existem exatamente 1 ou 3 ímpares: o lema do aperto de mãos proíbe.',
      'Königsberg tinha 4 ímpares — por isso a resposta de Euler foi "não existe".',
      'Em dígrafo o critério vira: `d⁺(v) = d⁻(v)` para todo v (ciclo), com no máximo dois vértices desbalanceados em ±1 (trajeto).'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'Aplicando',
    title: 'Exatamente dois ímpares: existe trajeto, não existe ciclo',
    description: 'Graus: a=2, b=2, **c=3**, **d=3**, e=2, f=2. Dois ímpares ⇒ trajeto euleriano que **começa em c e termina em d** (ou vice-versa).',
    graph: {
      ...doisTriangulos,
      caption: 'os únicos ímpares são c e d — as duas pontas obrigatórias do trajeto',
      nodes: [
        { id: 'a', x: 130, y: 120, note: 'd=2' },
        { id: 'b', x: 130, y: 300, note: 'd=2' },
        { id: 'c', x: 300, y: 210, state: 'active', note: 'd=3' },
        { id: 'd', x: 480, y: 210, state: 'active', note: 'd=3' },
        { id: 'e', x: 650, y: 120, note: 'd=2' },
        { id: 'f', x: 650, y: 300, note: 'd=2' }
      ]
    },
    note: {
      kind: 'key',
      title: 'A resposta já está pronta',
      text: 'Você respondeu "existe trajeto" sem desenhar nenhum trajeto. O critério dispensa a construção.'
    }
  },
  {
    type: 'steps',
    eyebrow: 'Fleury',
    title: 'Construindo o trajeto: nunca atravesse uma ponte cedo demais',
    description: 'A regra única: só use uma ponte quando ela for a **última** opção no vértice atual.',
    items: [
      { title: 'Comece num vértice ímpar', text: 'Aqui, em c. (Se não houver ímpar, comece em qualquer um.)' },
      { title: 'Gaste o triângulo da esquerda', text: 'c → a → b → c. A ponte cd continua intacta — e havia alternativa, então não a usamos.' },
      { title: 'Agora a ponte é a única saída', text: 'Em c só resta cd. Atravesse: c → d. Sem arrependimento: nada ficou para trás.' },
      { title: 'Gaste o triângulo da direita', text: 'd → e → f → d. Acabaram as arestas.' },
      { title: 'Trajeto completo', text: 'c–a–b–c–d–e–f–d: as 7 arestas, cada uma uma vez, terminando no outro ímpar ✓' }
    ],
    note: {
      kind: 'warn',
      title: 'O erro que trava o algoritmo',
      text: 'Sair de c pela ponte logo no primeiro passo. Você vai para o lado direito e nunca mais volta: o triângulo da esquerda fica órfão e o trajeto morre incompleto.'
    },
    graph: {
      ...doisTriangulos,
      caption: 'primeiro o triângulo esquerdo; a ponte cd fica por último',
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
    eyebrow: 'Hamilton · condições suficientes',
    title: 'Dirac, Ore e Bondy–Chvátal',
    formulas: [
      'DIRAC:  G simples, n ≥ 3, δ(G) ≥ n/2        ⇒ há ciclo hamiltoniano',
      'ORE:    d(u) + d(v) ≥ n para todo par u,v   ⇒ há ciclo hamiltoniano',
      '        NÃO adjacente',
      'BONDY–CHVÁTAL: G é hamiltoniano ⟺ o FECHO de G é hamiltoniano'
    ],
    description: 'As três dizem "se o grafo for denso o bastante, o ciclo existe". Nenhuma delas é **necessária**.',
    points: [
      'Dirac é caso particular de Ore: se todo grau ≥ n/2, qualquer soma de dois dá ≥ n.',
      'Ore só cobra dos pares **não adjacentes** — por isso alcança grafos que Dirac rejeita.',
      '**Fecho**: enquanto existir par não adjacente com d(u) + d(v) ≥ n, adicione a aresta uv. Se o fecho virar Kₙ, o original é hamiltoniano.'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'O contraexemplo indispensável',
    title: 'C₅: as três condições falham e o ciclo existe',
    description: 'No ciclo C₅ todo grau é 2. Dirac pede δ ≥ 2,5 — falha. Ore pede d(u)+d(v) ≥ 5 e o que existe é 4 — falha. O fecho não ganha nenhuma aresta.',
    graph: {
      view: [760, 400],
      caption: 'δ = 2 < 5/2 e mesmo assim o ciclo hamiltoniano é o próprio C₅',
      nodes: [
        { id: '1', x: 380, y: 60, state: 'active', note: 'd=2' },
        { id: '2', x: 620, y: 200, state: 'active', note: 'd=2' },
        { id: '3', x: 530, y: 360, state: 'active', note: 'd=2' },
        { id: '4', x: 230, y: 360, state: 'active', note: 'd=2' },
        { id: '5', x: 140, y: 200, state: 'active', note: 'd=2' }
      ],
      edges: [
        { from: '1', to: '2', state: 'tree' },
        { from: '2', to: '3', state: 'tree' },
        { from: '3', to: '4', state: 'tree' },
        { from: '4', to: '5', state: 'tree' },
        { from: '5', to: '1', state: 'tree' }
      ]
    },
    note: {
      kind: 'warn',
      title: 'A conclusão que vale ponto',
      text: 'Falhar em Dirac/Ore **não prova** que não é hamiltoniano. Condição suficiente só serve numa direção: se passa, existe; se falha, não se sabe.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'A exceção com critério exato',
    title: 'Em DAG, Hamilton é fácil — e linear',
    description: 'Num grafo dirigido acíclico existe caminho hamiltoniano **se e somente se** a ordenação topológica tem arco entre cada par consecutivo.',
    points: [
      'Se existe, a ordenação topológica é **única** — e ela é o próprio caminho.',
      'Se em algum ponto dois vértices consecutivos não têm arco, o caminho hamiltoniano não existe.',
      'Custo: uma ordenação topológica, O(n + m). Compare com o caso geral, NP-completo.'
    ],
    graph: {
      view: [760, 380],
      directed: true,
      caption: 'ordem topológica 1,2,3,4 com todos os arcos consecutivos → caminho hamiltoniano',
      nodes: [
        { id: '1', x: 120, y: 190, state: 'active' },
        { id: '2', x: 320, y: 190, state: 'active' },
        { id: '3', x: 520, y: 190, state: 'active' },
        { id: '4', x: 700, y: 190, state: 'active' }
      ],
      edges: [
        { from: '1', to: '2', state: 'tree' },
        { from: '2', to: '3', state: 'tree' },
        { from: '3', to: '4', state: 'tree' },
        { from: '1', to: '3', curve: -80, state: 'dim' },
        { from: '2', to: '4', curve: 80, state: 'dim' }
      ]
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · baseada na P1 22.2',
    question: 'Sobre percursos em um grafo G conexo e simples, avalie:',
    alternatives: [
      'I. G admite ciclo euleriano se e somente se todo vértice tem grau par.',
      'II. Se G não satisfaz a condição de Dirac, então G não tem ciclo hamiltoniano.',
      'III. Um grafo com exatamente dois vértices de grau ímpar admite trajeto euleriano, com início e fim nesses dois vértices.'
    ],
    answer: 'Corretas: I e III.',
    why: 'I e III são as duas metades do critério de Euler (com G conexo). II é falsa e é o erro conceitual mais caro do módulo: Dirac é condição **suficiente**, não necessária. O C₅ falha em Dirac (δ = 2 < 2,5) e é hamiltoniano.'
  }
];
