/**
 * Relações e classes de equivalência → ENADE Q12 → componentes conexos.
 * A ponte do bloco: classe de equivalência e componente conexo são o mesmo
 * objeto, e o algoritmo que acha um acha o outro.
 */

const cluster = {
  view: [760, 400],
  nodes: [
    { id: '1', x: 120, y: 110 },
    { id: '5', x: 270, y: 210 },
    { id: '7', x: 120, y: 310 },
    { id: '10', x: 280, y: 60 },
    { id: '2', x: 500, y: 100 },
    { id: '8', x: 650, y: 170 },
    { id: '9', x: 500, y: 240 },
    { id: '3', x: 560, y: 350 },
    { id: '4', x: 700, y: 350 },
    { id: '6', x: 380, y: 350 }
  ],
  edges: [
    { from: '1', to: '5' }, { from: '5', to: '7' }, { from: '7', to: '10' },
    { from: '10', to: '1' }, { from: '5', to: '10' }, { from: '7', to: '1' },
    { from: '2', to: '8' }, { from: '2', to: '9' }, { from: '9', to: '8' },
    { from: '3', to: '4' }
  ]
};

const pintado = {
  ...cluster,
  nodes: cluster.nodes.map(node => ({
    ...node,
    state: ['1', '5', '7', '10'].includes(node.id) ? 'active'
      : ['2', '8', '9'].includes(node.id) ? 'done'
      : ['3', '4'].includes(node.id) ? 'warn' : 'dim',
    note: node.id === '6' ? 'sozinho' : undefined
  }))
};

export const relacoes = [
  {
    type: 'section',
    kicker: 'Bloco 2',
    minutes: 6,
    title: 'Relações: a propriedade que vira algoritmo.',
    description: 'Reflexiva, simétrica e transitiva não são decoreba — juntas elas produzem uma partição, e achar essa partição é um algoritmo de grafo.',
    topics: ['as três propriedades', 'classes de equivalência', 'ENADE 2023 · Q12', 'componentes conexos']
  },
  {
    type: 'definition',
    eyebrow: 'As três propriedades',
    title: 'Reflexiva, simétrica, transitiva',
    formulas: [
      'para R ⊆ A × A:',
      'REFLEXIVA:   ∀x          [ x R x ]',
      'SIMÉTRICA:   ∀x, y       [ x R y → y R x ]',
      'TRANSITIVA:  ∀x, y, z    [ (x R y ∧ y R z) → x R z ]',
      '',
      'as três juntas ⇒ RELAÇÃO DE EQUIVALÊNCIA'
    ],
    description: 'Uma relação sobre A × A é exatamente um **grafo dirigido** com V = A. Cada propriedade tem uma leitura visual imediata.',
    points: [
      '**Reflexiva** = todo vértice tem laço.',
      '**Simétrica** = todo arco tem o arco de volta — ou seja, o grafo é não dirigido.',
      '**Transitiva** = caminho de comprimento 2 implica atalho de comprimento 1.',
      'Equivalência ⇒ cada componente vira uma **clique completa com laços**.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'A consequência',
    title: 'Classes de equivalência formam uma partição',
    formulas: [
      '[x] = { y ∈ S | x R y }',
      '',
      '1) [x] ≠ ∅          — reflexividade põe x dentro de [x]',
      '2) [x] ∩ [y] = ∅    — ou então [x] = [y]',
      '3) ⋃ [x] = S        — todo elemento está em alguma classe'
    ],
    description: 'As três condições são a definição de partição. Ou seja: **relação de equivalência e partição são a mesma coisa vista de dois ângulos**.',
    note: {
      kind: 'key',
      title: 'A ponte para o bloco de busca',
      text: 'A relação "existe caminho de u a v" é reflexiva, simétrica e transitiva num grafo não dirigido. Logo é equivalência — e as classes dela são exatamente os COMPONENTES CONEXOS. É por isso que uma busca resolve os dois problemas.'
    }
  },
  {
    type: 'question',
    source: 'ENADE 2023 · Engenharia de Computação · questão 12',
    poll: 'enade_equivalencia',
    statement: 'Num cluster com 10 computadores, os administradores montaram uma tabela em que dois computadores aparecem juntos numa linha se têm alguma característica semelhante. Um computador também tem relação consigo mesmo. Pares: 1–5, 2–8, 5–7, 7–10, 2–9, 3–4, 10–1, 5–10, 7–1, 9–8.',
    question: 'Com base no conceito de relações de equivalência, assinale a opção correta.',
    alternatives: [
      { id: 'a', text: 'A relação descrita pela tabela é uma relação de equivalência.' },
      { id: 'b', text: 'Apresenta simetria, mas não transitividade.' },
      { id: 'c', text: 'Apresenta transitividade, mas não simetria.' },
      { id: 'd', text: 'O subconjunto {1, 3, 5, 7, 10} forma uma classe de equivalência.' },
      { id: 'e', text: 'O subconjunto {2, 3, 4, 8, 9} forma uma classe de equivalência.' }
    ],
    answer: 'a'
  },
  {
    type: 'question',
    source: 'ENADE 2023 · questão 12 · gabarito',
    reveal: true,
    answer: 'a',
    poll: 'enade_equivalencia',
    question: 'Como decidir isso em 40 segundos',
    statement: 'Reflexividade e simetria vêm de graça pelo enunciado (cada máquina se relaciona consigo mesma; a tabela é de pares não ordenados). Sobra testar transitividade — e o teste visual é: cada componente do grafo precisa ser uma CLIQUE COMPLETA.',
    alternatives: [
      { id: 'a', text: 'É relação de equivalência — os 3 blocos são cliques completas.' },
      { id: 'b', text: 'Simetria sem transitividade' },
      { id: 'c', text: 'Transitividade sem simetria' },
      { id: 'd', text: '{1, 3, 5, 7, 10} é classe — mas 3 não se liga a nenhum deles' },
      { id: 'e', text: '{2, 3, 4, 8, 9} é classe — mesmo problema com 3 e 4' }
    ],
    why: '{1,5,7,10} tem os 6 pares possíveis na tabela (1–5, 1–7, 1–10, 5–7, 5–10, 7–10). {2,8,9} tem os 3 (2–8, 2–9, 8–9). {3,4} tem o seu. E o 6 não aparece na tabela: forma classe sozinho, pela reflexividade. Nenhuma aresta cruza blocos, então a transitividade fecha. As classes são a partição {1,5,7,10} · {2,8,9} · {3,4} · {6}.',
    graph: { ...pintado, caption: '4 componentes = 4 classes de equivalência' }
  },
  {
    type: 'concept',
    eyebrow: 'O que a questão realmente cobrou',
    title: 'Ela é um problema de componentes conexos disfarçado',
    description: 'A tabela de pares é uma lista de arestas. "É equivalência?" vira "cada componente é completo?". E achar os componentes é uma busca — ou união-busca.',
    points: [
      'Montar o grafo: 10 vértices, 10 arestas. **Θ(n + m)**.',
      'Achar os componentes: uma BFS ou DFS por vértice não visitado. **Θ(n + m)**.',
      'Testar se o componente de tamanho k é clique: ele precisa ter exatamente `C(k,2)` arestas.',
      '{1,5,7,10}: k = 4 ⇒ C(4,2) = **6 arestas** ✓ · {2,8,9}: k = 3 ⇒ **3** ✓ · {3,4}: k = 2 ⇒ **1** ✓'
    ],
    note: {
      kind: 'tip',
      title: 'O atalho que resolve na prova',
      text: 'Some: 6 + 3 + 1 = 10, que é exatamente o número de pares da tabela. Se sobrasse ou faltasse aresta, não seria equivalência. Uma soma decide a questão inteira.'
    },
    graph: { ...pintado, caption: 'C(4,2) + C(3,2) + C(2,2) + C(1,2) = 6 + 3 + 1 + 0 = 10 ✓' }
  }
];
