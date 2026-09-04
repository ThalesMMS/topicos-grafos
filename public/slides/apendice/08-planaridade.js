/**
 * Módulo 8 — Planaridade: faces, fórmula de Euler, os limites que dela saem
 * e os dois obstáculos mínimos.
 */

export const planaridade = [
  {
    type: 'section',
    kicker: 'Módulo 8',
    title: 'Cruzar no papel não decide nada.',
    description: 'Planaridade é sobre existir *algum* desenho sem cruzamento — não sobre o desenho que você fez.',
    topics: ['faces', 'fórmula de Euler', 'm ≤ 3n − 6', 'K₅ e K₃,₃']
  },
  {
    type: 'concept',
    eyebrow: 'A definição correta',
    title: 'Planar é existir UM desenho sem cruzamento',
    description: 'K₄ desenhado como quadrado com as diagonais parece ter cruzamento. Mova um vértice para dentro do triângulo e o cruzamento some. **É planar.**',
    points: [
      'Um desenho com cruzamento não prova nada — só mostra que *aquele* desenho é ruim.',
      'Grafo **plano** é o desenho já sem cruzamentos; grafo **planar** é o que admite um.',
      'Para provar que **não** é planar, você precisa de contagem (Euler) ou de Kuratowski.'
    ],
    graph: {
      view: [760, 400],
      caption: 'o mesmo K₄: à esquerda com cruzamento, à direita plano',
      nodes: [
        { id: '1', x: 100, y: 110 },
        { id: '2', x: 300, y: 110 },
        { id: '3', x: 100, y: 320 },
        { id: '4', x: 300, y: 320 },
        { id: 'A', x: 570, y: 90, state: 'done' },
        { id: 'B', x: 450, y: 330, state: 'done' },
        { id: 'C', x: 690, y: 330, state: 'done' },
        { id: 'D', x: 570, y: 230, state: 'active' }
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '1', to: '3' },
        { from: '2', to: '4' },
        { from: '3', to: '4' },
        { from: '1', to: '4', state: 'warn' },
        { from: '2', to: '3', state: 'warn' },
        { from: 'A', to: 'B', state: 'tree' },
        { from: 'A', to: 'C', state: 'tree' },
        { from: 'B', to: 'C', state: 'tree' },
        { from: 'A', to: 'D', state: 'tree' },
        { from: 'B', to: 'D', state: 'tree' },
        { from: 'C', to: 'D', state: 'tree' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'Faces',
    title: 'Face é uma região do plano — inclusive a de fora',
    formulas: [
      'grau de uma face = nº de arestas no seu contorno',
      '∑ grau(face) = 2m       (cada aresta faz fronteira duas vezes)'
    ],
    description: 'No K₄ plano do slide anterior há **4 faces**: os três triângulos internos ABD, ACD, BCD e a **face infinita** ABC, que é a região externa. Esquecer a face infinita é o erro mais comum.',
    points: [
      'Cada uma das 4 faces do K₄ tem grau 3. Soma: 4 · 3 = 12 = 2 · 6 arestas ✓',
      'Em grafo simples com ciclo, toda face tem grau **≥ 3**.',
      'A relação ∑grau(face) = 2m é o que transforma Euler em desigualdade útil.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Teorema de Euler (1758)',
    title: 'n − m + f = 2',
    formulas: [
      'para todo grafo PLANO e CONEXO:   n − m + f = 2',
      'K₄:  4 − 6 + 4 = 2 ✓'
    ],
    description: 'Vale para qualquer desenho plano conexo, e o número de faces não depende do desenho escolhido.',
    points: [
      'Se G tem k componentes, a fórmula vira `n − m + f = 1 + k`.',
      'Prova por indução no número de arestas: sem ciclo é árvore (f = 1, m = n − 1 ✓); com ciclo, remova uma aresta do ciclo — some uma face e uma aresta, e o valor não muda.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'O corolário que você vai usar',
    title: 'De Euler saem os dois limites de aresta',
    formulas: [
      'planar simples, n ≥ 3:            m ≤ 3n − 6',
      'planar simples e BIPARTIDO, n ≥ 3: m ≤ 2n − 4'
    ],
    description: 'Cada face tem grau ≥ 3, então 2m = ∑grau(face) ≥ 3f, ou seja f ≤ 2m/3. Substitua em n − m + f = 2 e isole m.',
    points: [
      'Em bipartido não existe triângulo, então toda face tem grau ≥ **4**: 2m ≥ 4f, e o limite fecha em 2n − 4.',
      'Os limites são **necessários, não suficientes**: passar no teste não prova planaridade.',
      'Violar o limite, porém, **prova** que não é planar — e é assim que se resolve a questão.'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'Obstáculo 1',
    title: 'K₅ não é planar: 10 > 9',
    description: 'n = 5, m = C(5,2) = 10. O limite dá 3n − 6 = 3·5 − 6 = **9**. Como 10 > 9, nenhum desenho plano existe.',
    graph: {
      view: [760, 400],
      caption: 'K₅: n = 5, m = 10, 3n − 6 = 9 → não planar',
      nodes: [
        { id: '1', x: 380, y: 60, state: 'warn' },
        { id: '2', x: 620, y: 200, state: 'warn' },
        { id: '3', x: 530, y: 360, state: 'warn' },
        { id: '4', x: 230, y: 360, state: 'warn' },
        { id: '5', x: 140, y: 200, state: 'warn' }
      ],
      edges: [
        { from: '1', to: '2' }, { from: '2', to: '3' }, { from: '3', to: '4' },
        { from: '4', to: '5' }, { from: '5', to: '1' }, { from: '1', to: '3' },
        { from: '1', to: '4' }, { from: '2', to: '4' }, { from: '2', to: '5' },
        { from: '3', to: '5' }
      ]
    },
    note: {
      kind: 'key',
      title: 'Isto é uma prova completa',
      text: 'Duas contas e uma desigualdade. Não é preciso tentar desenhar — tentativa frustrada nunca é argumento.'
    }
  },
  {
    type: 'graph',
    eyebrow: 'Obstáculo 2',
    title: 'K₃,₃ não é planar: aqui 3n − 6 não pega',
    description: 'n = 6, m = 9. O limite geral dá 3n − 6 = 12, e 9 ≤ 12 **passa**. Mas K₃,₃ é bipartido: o limite certo é 2n − 4 = **8**, e 9 > 8.',
    graph: {
      view: [760, 400],
      caption: 'K₃,₃: bipartido, sem triângulo → toda face teria grau ≥ 4',
      nodes: [
        { id: 'u₁', x: 190, y: 90, state: 'active' },
        { id: 'u₂', x: 190, y: 210, state: 'active' },
        { id: 'u₃', x: 190, y: 330, state: 'active' },
        { id: 'w₁', x: 570, y: 90 },
        { id: 'w₂', x: 570, y: 210 },
        { id: 'w₃', x: 570, y: 330 }
      ],
      edges: [
        { from: 'u₁', to: 'w₁' }, { from: 'u₁', to: 'w₂' }, { from: 'u₁', to: 'w₃' },
        { from: 'u₂', to: 'w₁' }, { from: 'u₂', to: 'w₂' }, { from: 'u₂', to: 'w₃' },
        { from: 'u₃', to: 'w₁' }, { from: 'u₃', to: 'w₂' }, { from: 'u₃', to: 'w₃' }
      ]
    },
    note: {
      kind: 'warn',
      title: 'A pegadinha exata da prova',
      text: 'Aplicar só m ≤ 3n − 6 no K₃,₃ e concluir "é planar". O grafo passa nesse teste e mesmo assim não é planar — porque o teste é necessário, nunca suficiente.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'A caracterização completa',
    title: 'Kuratowski: só existem esses dois obstáculos',
    description: 'Um grafo é planar **se e somente se** não contém subdivisão de K₅ nem de K₃,₃. (Versão de Wagner: nenhum dos dois como *menor*.)',
    points: [
      '**Subdivisão** é acrescentar vértices de grau 2 no meio das arestas — não muda a planaridade.',
      'Para provar "não é planar" sem contagem: exiba a cópia de K₅ ou K₃,₃ escondida dentro do grafo.',
      'A contagem falha em alguns casos; Kuratowski nunca falha — mas é mais trabalhoso.'
    ],
    note: {
      kind: 'tip',
      title: 'Ordem de ataque na prova',
      text: '1) teste m ≤ 3n − 6 (e 2n − 4 se bipartido). 2) violou? acabou. 3) passou? procure K₅ ou K₃,₃, ou exiba um desenho plano.'
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · planaridade',
    question: 'Sobre grafos planares simples com n ≥ 3, avalie:',
    alternatives: [
      'I. Todo grafo simples com m > 3n − 6 é não planar.',
      'II. Todo grafo simples com m ≤ 3n − 6 é planar.',
      'III. Num grafo plano e conexo vale n − m + f = 2, contando a face infinita.'
    ],
    answer: 'Corretas: I e III.',
    why: 'I é a contrapositiva do corolário de Euler: se fosse planar teria m ≤ 3n − 6. III é a fórmula de Euler, e a face externa conta. II é falsa — K₃,₃ é o contraexemplo: n = 6, m = 9 ≤ 12 = 3n − 6, e mesmo assim não é planar. O limite é condição necessária, não suficiente.'
  }
];
