/**
 * Módulo 2 — Fundamentos: modelagem, famílias clássicas, isomorfismo e
 * subgrafos.
 */

const konigsberg = {
  view: [760, 420],
  nodes: [
    { id: 'N', x: 380, y: 80, note: 'd = 3' },
    { id: 'I', x: 380, y: 220, note: 'd = 5' },
    { id: 'S', x: 380, y: 360, note: 'd = 3' },
    { id: 'L', x: 650, y: 220, note: 'd = 3' }
  ],
  edges: [
    { from: 'N', to: 'I', curve: 55 },
    { from: 'N', to: 'I', curve: -55 },
    { from: 'S', to: 'I', curve: 55 },
    { from: 'S', to: 'I', curve: -55 },
    { from: 'N', to: 'L' },
    { from: 'S', to: 'L' },
    { from: 'I', to: 'L' }
  ]
};

export const fundamentos = [
  {
    type: 'section',
    kicker: 'Módulo 2',
    title: 'Fundamentos: modelar, nomear, reconhecer.',
    description: 'Antes de qualquer algoritmo: o que vira vértice, o que vira aresta, e quando dois grafos são o mesmo grafo.',
    topics: ['modelagem', 'famílias clássicas', 'isomorfismo', 'subgrafos']
  },
  {
    type: 'steps',
    eyebrow: 'Modelagem',
    title: 'Duas decisões resolvem o problema — ou o estragam',
    description: 'A modelagem já responde metade da questão. Escolha errada de vértice e o resto não salva.',
    items: [
      { title: 'Quem é vértice?', text: 'O objeto sobre o qual a pergunta fala. Em rotas: a cidade, não a estrada.' },
      { title: 'Quem é aresta?', text: 'A relação que a pergunta usa. Em rotas: existe estrada direta entre as duas cidades.' },
      { title: 'Tem direção?', text: 'Se a relação vale nos dois sentidos, é aresta. Se só num, é arco — e o grafo vira dígrafo.' },
      { title: 'Tem peso?', text: 'Só coloque peso se a pergunta somar alguma coisa: tempo, custo, capacidade.' },
      { title: 'A pergunta mudou de domínio', text: '"Dá para passear por todas as pontes?" virou "existe trajeto euleriano?" — e agora tem teorema.' }
    ],
    note: {
      kind: 'warn',
      title: 'Armadilha clássica',
      text: 'Modelar o objeto visível em vez da relação. As pontes de Königsberg não são vértices: são as arestas.'
    }
  },
  {
    type: 'graph',
    eyebrow: 'O problema que fundou a área',
    title: 'Königsberg, 1736: quatro margens, sete pontes',
    description: 'Euler apagou o mapa e ficou só com isto. Duas pontes entre o mesmo par viram **duas arestas paralelas** — o modelo é um multigrafo.',
    graph: {
      ...konigsberg,
      caption: 'n = 4, m = 7 — e quatro vértices de grau ímpar'
    },
    note: {
      kind: 'key',
      title: 'A resposta cabe numa linha',
      text: 'Um trajeto que usa cada aresta uma vez exige 0 ou 2 vértices de grau ímpar. Aqui há 4. Logo o passeio não existe — e nem foi preciso tentar.'
    }
  },
  {
    type: 'table',
    eyebrow: 'Vocabulário obrigatório',
    title: 'As famílias que caem em toda prova',
    headers: ['família', 'notação', 'n', 'm', 'graus'],
    rows: [
      ['Completo', 'Kₙ', 'n', 'n(n−1)/2', 'todos n − 1'],
      ['Ciclo', 'Cₙ', 'n', 'n', 'todos 2'],
      ['Caminho', 'Pₙ', 'n', 'n − 1', '2 pontas com 1, resto 2'],
      ['Bipartido completo', 'K₍p,q₎', 'p + q', 'p · q', 'lado p tem grau q; lado q tem grau p'],
      ['Árvore', '—', 'n', 'n − 1', 'pelo menos duas folhas (grau 1)'],
      ['r-regular', '—', 'n', 'n·r/2', 'todos iguais a r']
    ],
    note: {
      kind: 'tip',
      title: 'Use como teste rápido',
      text: 'Grafo r-regular com n·r ímpar não existe: m = n·r/2 teria de ser inteiro.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'Definição',
    title: 'Bipartido: duas classes, arestas só entre elas',
    description: 'V se parte em V₁ e V₂ **disjuntos**, e toda aresta tem uma ponta em cada lado. Nenhuma aresta dentro de um lado.',
    points: [
      'K₍₂,₃₎ tem todas as 2 · 3 = 6 arestas possíveis entre os lados.',
      'Um grafo é bipartido **se e somente se** não tem ciclo ímpar.',
      'É o modelo de: alunos × disciplinas, tarefas × máquinas, oferta × demanda.'
    ],
    graph: {
      view: [760, 420],
      caption: 'K₂,₃ — nenhuma aresta liga dois vértices do mesmo lado',
      nodes: [
        { id: 'u₁', x: 200, y: 140, state: 'active' },
        { id: 'u₂', x: 200, y: 300, state: 'active' },
        { id: 'w₁', x: 580, y: 90 },
        { id: 'w₂', x: 580, y: 215 },
        { id: 'w₃', x: 580, y: 340 }
      ],
      edges: [
        { from: 'u₁', to: 'w₁' },
        { from: 'u₁', to: 'w₂' },
        { from: 'u₁', to: 'w₃' },
        { from: 'u₂', to: 'w₁' },
        { from: 'u₂', to: 'w₂' },
        { from: 'u₂', to: 'w₃' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'Definição central',
    title: 'Isomorfismo: mesmo grafo, outros nomes',
    formulas: [
      'G ≅ H  ⟺  ∃ φ: V(G) → V(H) bijeção tal que',
      '{u,v} ∈ E(G)  ⟺  {φ(u), φ(v)} ∈ E(H)'
    ],
    description: 'A bijeção precisa preservar adjacência **nos dois sentidos**: aresta vira aresta, e não-aresta vira não-aresta.',
    points: [
      'Para **provar** que são isomorfos: exiba φ e verifique aresta por aresta.',
      'Para **provar** que não são: exiba um invariante que difere.',
      'Não vale dizer "os desenhos parecem diferentes". Desenho não é argumento.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'Como achar φ na prova',
    title: 'Comece pelos graus raros',
    description: 'Se G tem um único vértice de grau 3, ele **tem que** virar o único de grau 3 em H. Cada grau raro elimina possibilidades.',
    points: [
      'Monte a sequência de graus dos dois lados e alinhe.',
      'Vértice de grau único → imagem forçada. Sem escolha, sem erro.',
      'Depois estenda pelos vizinhos dele; termine verificando as m arestas.'
    ],
    note: {
      kind: 'check',
      title: 'A verificação é obrigatória',
      text: 'Exibir φ sem conferir as arestas não é prova. São m verificações — faça todas, é rápido.'
    },
    graph: {
      view: [760, 420],
      caption: 'φ: 1↦a, 2↦b, 3↦c, 4↦d — confira as 4 arestas',
      nodes: [
        { id: '1', x: 130, y: 120, note: 'd=3', state: 'active' },
        { id: '2', x: 300, y: 120 },
        { id: '3', x: 130, y: 300 },
        { id: '4', x: 300, y: 300 },
        { id: 'a', x: 500, y: 210, note: 'd=3', state: 'active' },
        { id: 'b', x: 660, y: 110 },
        { id: 'c', x: 660, y: 210 },
        { id: 'd', x: 660, y: 310 }
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '1', to: '3' },
        { from: '1', to: '4' },
        { from: '3', to: '4' },
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
        { from: 'a', to: 'd' },
        { from: 'c', to: 'd' }
      ]
    }
  },
  {
    type: 'graph',
    eyebrow: 'Invariantes: necessários, nunca suficientes',
    title: 'Mesmos números, grafos diferentes',
    description: 'Os dois têm n = 6, m = 6 e **todos os graus iguais a 2**. Ainda assim não são isomorfos: um é conexo, o outro tem dois componentes.',
    graph: {
      view: [760, 400],
      caption: 'C₆ (conexo) × 2·C₃ (dois componentes) — invariantes de grau não distinguem',
      nodes: [
        { id: '1', x: 130, y: 120 },
        { id: '2', x: 260, y: 80 },
        { id: '3', x: 340, y: 200 },
        { id: '4', x: 260, y: 320 },
        { id: '5', x: 130, y: 350 },
        { id: '6', x: 60, y: 220 },
        { id: 'p', x: 520, y: 100 },
        { id: 'q', x: 650, y: 100 },
        { id: 'r', x: 585, y: 210 },
        { id: 'x', x: 520, y: 300 },
        { id: 'y', x: 650, y: 300 },
        { id: 'z', x: 585, y: 390 }
      ],
      edges: [
        { from: '1', to: '2' }, { from: '2', to: '3' }, { from: '3', to: '4' },
        { from: '4', to: '5' }, { from: '5', to: '6' }, { from: '6', to: '1' },
        { from: 'p', to: 'q', state: 'active' }, { from: 'q', to: 'r', state: 'active' }, { from: 'r', to: 'p', state: 'active' },
        { from: 'x', to: 'y', state: 'active' }, { from: 'y', to: 'z', state: 'active' }, { from: 'z', to: 'x', state: 'active' }
      ]
    },
    points: [
      'Invariante que **prova** a diferença aqui: número de componentes (1 × 2).',
      'Outros invariantes úteis: comprimento do menor ciclo, sequência de graus dos vizinhos, bipartição.'
    ]
  },
  {
    type: 'compare',
    eyebrow: 'Subgrafos',
    title: 'Induzido e gerador não são a mesma coisa',
    columns: [
      {
        title: 'Subgrafo qualquer',
        description: 'H ⊆ G com V(H) ⊆ V(G) e E(H) ⊆ E(G).',
        items: ['Escolho vértices E arestas', 'Só não posso ter aresta sem os dois extremos']
      },
      {
        title: 'Induzido G[S]',
        description: 'Escolho os vértices; as arestas vêm de graça.',
        items: ['Todas as arestas de G entre vértices de S', 'Não posso deixar aresta de fora']
      },
      {
        title: 'Gerador (spanning)',
        description: 'Mantenho V inteiro; escolho as arestas.',
        items: ['V(H) = V(G), sempre', 'Árvore geradora é o caso mais cobrado']
      }
    ],
    note: {
      kind: 'warn',
      title: 'Remover vértice leva as arestas junto',
      text: 'G − v apaga v **e** todas as arestas incidentes a ele. G − e apaga só a aresta: os vértices ficam.'
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Questão de prova · P1 22.1 · no formato ENADE',
    question: 'G é simples, não dirigido, com 10 vértices e 5 componentes. Avalie:',
    alternatives: [
      'I. G tem no mínimo 5 arestas.',
      'II. G tem no máximo C(6,2) = 15 arestas.',
      'III. A soma dos graus de G é necessariamente par.'
    ],
    answer: 'I, II e III estão corretas.',
    why: 'I — cada componente com nᵢ vértices precisa de pelo menos nᵢ − 1 arestas para ser conexo; somando os 5 componentes: 10 − 5 = 5. II — para maximizar, concentre o máximo de vértices num só componente: 6 num K₆ e os outros 4 isolados (que já fecham os 5 componentes) → C(6,2) = 15. III — lema do aperto de mãos: ∑d(v) = 2m é par sempre, com qualquer número de componentes.'
  }
];
