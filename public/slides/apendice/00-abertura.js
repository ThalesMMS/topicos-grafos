/**
 * Módulo 0 — Abertura: capa, contrato da aula e mapa do caminho.
 */

export const abertura = [
  {
    type: 'cover',
    eyebrow: 'Teoria dos Grafos',
    title: 'Grafos:',
    highlight: 'do desenho à prova',
    description: 'Aponte a câmera para o QR code. Você vai votar, errar de propósito e ver a correção na hora.'
  },
  {
    type: 'concept',
    eyebrow: 'Contrato da aula',
    title: 'Um grafo não é um desenho. É um par de conjuntos.',
    description: 'O desenho ajuda a pensar, mas **nunca é a justificativa**. Toda vez que a resposta depender de como você desenhou, a resposta está errada.',
    points: [
      'O mesmo grafo tem infinitos desenhos — e nenhum deles é o grafo.',
      'Duas arestas que se cruzam no papel podem não se cruzar em outro desenho.',
      'Na prova, o que vale é a conta sobre V e E: graus, contagem, invariantes.'
    ],
    note: {
      kind: 'key',
      title: 'Leve isto para todos os slides',
      text: 'Definição → propriedade → conclusão. Se um passo desses estiver faltando, é chute, não prova.'
    },
    graph: {
      view: [760, 420],
      caption: 'os dois desenhos são o MESMO grafo (K4)',
      nodes: [
        { id: '1', x: 130, y: 110 },
        { id: '2', x: 320, y: 110 },
        { id: '3', x: 130, y: 300 },
        { id: '4', x: 320, y: 300 },
        { id: 'a', x: 560, y: 80 },
        { id: 'b', x: 690, y: 240 },
        { id: 'c', x: 560, y: 380 },
        { id: 'd', x: 470, y: 230 }
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '1', to: '3' },
        { from: '2', to: '4' },
        { from: '3', to: '4' },
        { from: '1', to: '4', state: 'active' },
        { from: '2', to: '3', state: 'active', curve: 34 },
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'a', to: 'c', curve: 70 },
        { from: 'd', to: 'a', state: 'active' },
        { from: 'd', to: 'b', state: 'active' },
        { from: 'd', to: 'c' }
      ]
    }
  },
  {
    type: 'section',
    kicker: 'Mapa do caminho',
    title: 'Catorze paradas, uma por vez.',
    description: 'A ordem importa: cada módulo só usa o que já foi provado antes. Cada um fecha com uma questão no formato de prova.',
    topics: [
      '1 · Linguagem e prova',
      '2 · Fundamentos',
      '3 · Representação',
      '4 · Caminhos e conectividade',
      '5 · Dígrafos e Kosaraju',
      '6 · Busca: BFS e DFS',
      '7 · Árvores e AGM',
      '8 · Planaridade',
      '9 · Euler e Hamilton',
      '10 · Caminhos mínimos',
      '11 · Fluxo máximo',
      '12 · Ordenação topológica',
      '13 · Emparelhamento',
      '14 · Coloração'
    ]
  },
  {
    type: 'poll',
    poll: 'warmup',
    eyebrow: 'Antes de começar'
  }
];
