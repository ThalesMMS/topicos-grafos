/**
 * Módulo 14 — Coloração: limites de χ, guloso, Welch-Powell e as duas
 * construções clássicas (mapas e horários).
 */

const grafoCor = {
  view: [760, 400],
  nodes: [
    { id: 'A', x: 250, y: 110 },
    { id: 'B', x: 470, y: 80 },
    { id: 'C', x: 120, y: 300 },
    { id: 'D', x: 440, y: 280 },
    { id: 'E', x: 660, y: 180 }
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'D' },
    { from: 'A', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'D', to: 'E' }
  ]
};

export const coloracao = [
  {
    type: 'section',
    kicker: 'Módulo 14',
    title: 'Coloração: separar o que não pode conviver.',
    description: 'Mapas, horários, alocação de registradores e frequências de rádio são o mesmo problema com nomes diferentes.',
    topics: ['número cromático', 'ω ≤ χ ≤ Δ+1', 'guloso', 'Welch-Powell']
  },
  {
    type: 'definition',
    eyebrow: 'Definição',
    title: 'Coloração própria e número cromático',
    formulas: [
      'coloração própria: c: V → {1..k} com c(u) ≠ c(v) para toda aresta {u,v}',
      'χ(G) = menor k para o qual existe coloração própria'
    ],
    description: 'Colorir é particionar V em **conjuntos independentes**: cada cor é um conjunto sem aresta interna. χ(G) é o menor número de conjuntos independentes que cobre V.',
    points: [
      'χ(G) = 1 ⟺ G não tem aresta. χ(G) ≤ 2 ⟺ G é **bipartido** (módulo 4).',
      'χ(Kₙ) = n — todos são adjacentes, ninguém compartilha cor.',
      'χ(Cₙ) = 2 se n é par, 3 se n é ímpar.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Os limites',
    title: 'ω(G) ≤ χ(G) ≤ Δ(G) + 1',
    formulas: [
      'ω(G) = tamanho da maior clique   Δ(G) = maior grau',
      '',
      'Brooks: se G é conexo e NÃO é Kₙ nem ciclo ímpar,',
      '        então χ(G) ≤ Δ(G)'
    ],
    description: 'O limite inferior vem da clique: k vértices mutuamente adjacentes exigem k cores. O superior vem do guloso: ao colorir v, seus ≤ Δ vizinhos ocupam no máximo Δ cores, e sempre sobra a Δ+1.',
    points: [
      'Δ+1 é **teto**, não valor. Um caminho tem Δ = 2 e χ = 2, não 3.',
      'Prender χ entre dois números costuma valer mais ponto do que exibir uma coloração.',
      'Se achar uma clique de tamanho k **e** uma coloração com k cores, então χ = k — provado dos dois lados.'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'Aplicando',
    title: 'O triângulo A–B–D obriga três cores',
    description: 'ω = 3 (a clique ABD) e Δ = 4 (o vértice D), então 3 ≤ χ ≤ 5. Como existe coloração com 3 cores, **χ = 3** — os dois lados fecham.',
    graph: {
      ...grafoCor,
      caption: 'cor 0: D · cor 1: A, E · cor 2: B, C — três cores, nenhuma aresta monocromática',
      nodes: [
        { id: 'A', x: 250, y: 110, state: 'active', note: 'cor 1' },
        { id: 'B', x: 470, y: 80, state: 'done', note: 'cor 2' },
        { id: 'C', x: 120, y: 300, state: 'done', note: 'cor 2' },
        { id: 'D', x: 440, y: 280, state: 'warn', note: 'cor 0' },
        { id: 'E', x: 660, y: 180, state: 'active', note: 'cor 1' }
      ]
    },
    points: [
      'Limite inferior: ABD é K₃, logo χ ≥ 3.',
      'Limite superior: a coloração exibida usa 3, logo χ ≤ 3. Conclusão: χ = 3.'
    ]
  },
  {
    type: 'code',
    eyebrow: 'Algoritmo guloso',
    title: 'Menor cor ausente na vizinhança já pintada',
    description: 'Percorre os vértices numa ordem fixa e nunca volta atrás. Custo O(n + m), e usa no máximo Δ + 1 cores.',
    lines: [
      'GULOSO(G, ordem):',
      '  para v em ordem:',
      '    usadas ← { c(u) : u vizinho de v já pintado }',
      '    c(v)   ← menor inteiro ≥ 0 que NÃO está em usadas',
      '',
      '// garante coloração própria',
      '// NÃO garante o mínimo de cores'
    ],
    note: {
      kind: 'key',
      title: 'A propriedade curiosa',
      text: 'Existe sempre uma ordem em que o guloso acerta χ exatamente. O problema é que achar essa ordem é tão difícil quanto colorir.'
    }
  },
  {
    type: 'graph',
    eyebrow: 'Onde o guloso erra',
    title: 'A ordem decide: 3 cores num grafo bipartido',
    description: 'Este grafo é bipartido, então χ = 2. Mas o guloso na ordem u₁, v₁, u₂, v₂, u₃, v₃ gasta **três** cores.',
    graph: {
      view: [760, 400],
      caption: 'u₁=0, v₁=0, u₂=1, v₂=1, u₃=2, v₃=2 — três cores para um grafo de χ = 2',
      nodes: [
        { id: 'u₁', x: 190, y: 90, state: 'done', note: '0' },
        { id: 'u₂', x: 190, y: 210, state: 'active', note: '1' },
        { id: 'u₃', x: 190, y: 330, state: 'warn', note: '2' },
        { id: 'v₁', x: 570, y: 90, state: 'done', note: '0' },
        { id: 'v₂', x: 570, y: 210, state: 'active', note: '1' },
        { id: 'v₃', x: 570, y: 330, state: 'warn', note: '2' }
      ],
      edges: [
        { from: 'u₁', to: 'v₂' },
        { from: 'u₁', to: 'v₃' },
        { from: 'u₂', to: 'v₁' },
        { from: 'u₂', to: 'v₃' },
        { from: 'u₃', to: 'v₁' },
        { from: 'u₃', to: 'v₂' }
      ]
    },
    note: {
      kind: 'warn',
      title: 'A conclusão que a prova cobra',
      text: 'O resultado do guloso é um **limite superior** para χ, nunca o valor. Escrever "χ = 3 porque o guloso deu 3" é erro — aqui a resposta certa é 2.'
    }
  },
  {
    type: 'steps',
    eyebrow: 'Welch-Powell',
    title: 'A heurística: ordene por grau decrescente',
    description: 'Uma escolha de ordem que costuma economizar cores. Continua sendo heurística — não garante o ótimo.',
    items: [
      { title: 'Ordene por grau decrescente', text: 'D(4), A(3), B(3), C(2), E(2).' },
      { title: 'Cor 0: varra a lista', text: 'Pinte D. Nenhum dos seguintes serve — A, B, C e E são todos vizinhos de D. Cor 0 = {D}.' },
      { title: 'Cor 1: nova varredura', text: 'Pinte A. B é vizinho de A, C também. **E** não é vizinho de A: entra. Cor 1 = {A, E}.' },
      { title: 'Cor 2: sobram B e C', text: 'B e C não são adjacentes entre si. Cor 2 = {B, C}.' },
      { title: 'Resultado: 3 cores', text: 'Coincide com χ = 3 aqui — mas por sorte da instância, não por garantia.' }
    ],
    note: {
      kind: 'check',
      title: 'Verificação obrigatória',
      text: 'Antes de responder, percorra as m arestas conferindo que as pontas têm cores diferentes. Uma aresta monocromática invalida a resposta inteira.'
    }
  },
  {
    type: 'compare',
    eyebrow: 'As duas construções clássicas',
    title: 'De onde vem o grafo que você vai colorir',
    columns: [
      {
        title: 'Mapa → grafo dual',
        description: 'Colorir países vizinhos com cores distintas.',
        items: ['Vértice = região', 'Aresta = fronteira de comprimento positivo', 'Um ponto de encontro (canto) NÃO é fronteira', 'Mapa é planar ⇒ χ ≤ 4 (Teorema das Quatro Cores)']
      },
      {
        title: 'Horários → grafo de conflito',
        description: 'Marcar provas sem chocar alunos.',
        items: ['Vértice = disciplina', 'Aresta = existe aluno matriculado nas duas', 'χ = número mínimo de horários', 'Sem aresta dentro de um lado: 2 horários bastam']
      }
    ],
    note: {
      kind: 'key',
      title: 'A parte que vale a nota',
      text: 'Escreva a regra de V e E **antes** de escolher cores. A maior parte dos erros nesse tipo de questão está na construção do grafo, não na coloração.'
    }
  },
  {
    type: 'poll',
    poll: 'coloracao',
    eyebrow: 'Checkpoint'
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · coloração',
    question: 'Sobre a coloração própria de vértices de um grafo simples G, avalie:',
    alternatives: [
      'I. χ(G) ≥ ω(G), onde ω é o tamanho da maior clique.',
      'II. O algoritmo guloso sempre produz uma coloração com χ(G) cores.',
      'III. Se G é bipartido e tem ao menos uma aresta, então χ(G) = 2.'
    ],
    answer: 'Corretas: I e III.',
    why: 'I — os ω vértices de uma clique são mutuamente adjacentes e exigem ω cores distintas. III — bipartido dá coloração com 2 (uma cor por lado), e ter aresta impede que 1 baste. II é falsa: o guloso depende da ordem e entrega apenas um limite superior — no grafo bipartido do módulo ele gastou 3 cores onde 2 bastavam.'
  }
];
