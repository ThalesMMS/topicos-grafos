/**
 * Módulo 4 — Caminhos, distância, componentes, cortes e bipartição.
 */

const rede = {
  view: [760, 400],
  nodes: [
    { id: 'A', x: 120, y: 210 },
    { id: 'B', x: 300, y: 110 },
    { id: 'C', x: 300, y: 310 },
    { id: 'D', x: 490, y: 210 },
    { id: 'E', x: 670, y: 210 }
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' }
  ]
};

const duasPontas = {
  view: [760, 400],
  nodes: [
    { id: 'a', x: 130, y: 120 },
    { id: 'b', x: 130, y: 300 },
    { id: 'c', x: 300, y: 210 },
    { id: 'd', x: 480, y: 210 },
    { id: 'e', x: 650, y: 120 },
    { id: 'f', x: 650, y: 300 }
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

export const conectividade = [
  {
    type: 'section',
    kicker: 'Módulo 4',
    title: 'Quem alcança quem, e a que custo.',
    description: 'Toda a segunda metade do curso — busca, AGM, fluxo — depende destes quatro conceitos.',
    topics: ['passeio × caminho', 'distância, raio, diâmetro', 'componentes', 'cortes e bipartição']
  },
  {
    type: 'definition',
    eyebrow: 'Hierarquia',
    title: 'Passeio ⊃ trajeto ⊃ caminho',
    formulas: [
      'passeio:  v₀ e₁ v₁ e₂ … vₖ   (pode repetir tudo)',
      'trajeto:  passeio que NÃO repete ARESTA',
      'caminho:  passeio que NÃO repete VÉRTICE',
      'ciclo:    caminho fechado (v₀ = vₖ), k ≥ 3 no simples'
    ],
    description: 'Todo caminho é trajeto; todo trajeto é passeio. As recíprocas são falsas — e é nessa diferença que Euler e Hamilton se separam.',
    points: [
      '**Euler** fala de trajeto: passa por toda **aresta** uma vez.',
      '**Hamilton** fala de caminho: passa por todo **vértice** uma vez.',
      'O comprimento de um passeio é o número de arestas usadas, contando repetições.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'Distância',
    title: 'd(u,v) é o MENOR caminho, não um caminho qualquer',
    description: 'A distância é o mínimo do número de arestas sobre todos os caminhos de u a v. Se não existe caminho, `d(u,v) = ∞`.',
    points: [
      'd(A,B) = 1 · d(A,D) = 2 · **d(A,E) = 3**',
      'A–B–D–C–A–B–D–E é um passeio válido de comprimento 7 — e não diz nada sobre distância.',
      'd é simétrica no não dirigido e satisfaz a desigualdade triangular.'
    ],
    note: {
      kind: 'warn',
      title: 'A armadilha do passeio comprido',
      text: 'Exibir um passeio prova que existe conexão, nunca que a distância é aquela. Para distância você precisa do argumento de minimalidade — na prática, a BFS.'
    },
    graph: {
      ...rede,
      caption: 'as camadas a partir de A: {A} · {B,C} · {D} · {E}',
      nodes: [
        { id: 'A', x: 120, y: 210, state: 'active', note: '0' },
        { id: 'B', x: 300, y: 110, state: 'done', note: '1' },
        { id: 'C', x: 300, y: 310, state: 'done', note: '1' },
        { id: 'D', x: 490, y: 210, state: 'done', note: '2' },
        { id: 'E', x: 670, y: 210, state: 'done', note: '3' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'Métricas do grafo inteiro',
    title: 'Excentricidade, raio, diâmetro e centro',
    formulas: [
      'ecc(v) = max { d(v,u) : u ∈ V }',
      'raio(G) = min ecc(v)        diâmetro(G) = max ecc(v)',
      'centro(G) = { v : ecc(v) = raio(G) }'
    ],
    description: 'Excentricidade é "o quão longe fica o vértice mais distante de v". As outras três saem dela.',
    points: [
      'Diâmetro é o maior *menor caminho* — dois mínimos aninhados. Nunca é "o maior caminho".',
      'Algoritmo direto: uma BFS a partir de **cada** vértice, guardando o maior nível. Custo O(n·(n+m)).',
      'Grafo desconexo: diâmetro infinito (ou definido por componente).'
    ]
  },
  {
    type: 'table',
    eyebrow: 'Na prática',
    title: 'Uma BFS por vértice resolve o grafo do slide anterior',
    headers: ['v', 'd para A', 'B', 'C', 'D', 'E', 'ecc(v)'],
    rows: [
      ['A', '0', '1', '1', '2', '3', '**3**'],
      ['B', '1', '0', '2', '1', '2', '2'],
      ['C', '1', '2', '0', '1', '2', '2'],
      ['D', '2', '1', '1', '0', '1', '2'],
      ['E', '3', '2', '2', '1', '0', '**3**']
    ],
    note: {
      kind: 'key',
      title: 'Leitura da tabela',
      text: 'raio = 2, diâmetro = 3, centro = {B, C, D}. O centro é onde você instalaria o servidor.'
    }
  },
  {
    type: 'definition',
    eyebrow: 'Componentes',
    title: 'Quantas arestas cabem com n vértices e k componentes',
    formulas: [
      'mínimo:  m ≥ n − k',
      'máximo:  m ≤ C(n − k + 1, 2) = (n−k)(n−k+1)/2'
    ],
    description: 'O mínimo vem de cada componente ser pelo menos uma árvore. O máximo vem de concentrar tudo: um K₍n−k+1₎ e os outros k − 1 componentes com um vértice só.',
    points: [
      'n = 10, k = 5 ⇒ 5 ≤ m ≤ C(6,2) = 15.',
      'Se o enunciado der m fora desse intervalo, **o grafo não existe** — e a resposta é a conta.',
      'k = 1 devolve os casos conhecidos: n − 1 ≤ m ≤ n(n−1)/2.'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'Fragilidade',
    title: 'Articulação e ponte: onde o grafo se parte',
    description: '**Articulação** é o vértice cuja remoção aumenta o número de componentes. **Ponte** é a aresta com o mesmo efeito.',
    graph: {
      ...duasPontas,
      caption: 'c e d são articulações; a aresta cd é a única ponte',
      nodes: [
        { id: 'a', x: 130, y: 120 },
        { id: 'b', x: 130, y: 300 },
        { id: 'c', x: 300, y: 210, state: 'warn', note: 'articulação' },
        { id: 'd', x: 480, y: 210, state: 'warn', note: 'articulação' },
        { id: 'e', x: 650, y: 120 },
        { id: 'f', x: 650, y: 300 }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'd', state: 'warn', label: 'ponte' },
        { from: 'd', to: 'e' },
        { from: 'd', to: 'f' },
        { from: 'e', to: 'f' }
      ]
    },
    points: [
      'Remover **a** não desconecta: b continua ligado por c. Logo a **não** é articulação.',
      'Toda ponte tem os dois extremos como articulação — desde que cada extremo tenha grau ≥ 2.',
      'Algoritmo ingênuo: para cada v, rode uma busca em G − v e conte componentes. O(n·(n+m)).'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Medida de robustez',
    title: 'κ ≤ λ ≤ δ',
    formulas: [
      'κ(G) = mín. de VÉRTICES a remover para desconectar',
      'λ(G) = mín. de ARESTAS a remover para desconectar',
      'δ(G) = menor grau        →  κ(G) ≤ λ(G) ≤ δ(G)'
    ],
    description: 'A desigualdade é fácil de justificar: isolar o vértice de menor grau custa δ arestas, então λ ≤ δ. E todo corte de vértices induz um corte de arestas não maior.',
    points: [
      'G é **separável** quando κ(G) = 1, ou seja, quando existe articulação.',
      'G é **k-conexo** quando κ(G) ≥ k: sobrevive à remoção de k − 1 vértices quaisquer.',
      'C₄ não é separável: remover qualquer vértice deixa um caminho, que é conexo. κ(C₄) = 2.'
    ]
  },
  {
    type: 'steps',
    eyebrow: 'Teste decisivo',
    title: 'Bipartido ⟺ sem ciclo ímpar',
    description: 'O teste é uma BFS que pinta cada nível com a cor oposta à do nível anterior.',
    items: [
      { title: 'Pinte a raiz de 0', text: 'Qualquer vértice serve como raiz.' },
      { title: 'Cada vizinho recebe a cor oposta', text: 'cor(v) = 1 − cor(u), onde u é quem descobriu v.' },
      { title: 'Aresta entre cores iguais = conflito', text: 'Achou conflito, existe ciclo ímpar: o grafo NÃO é bipartido. Pare.' },
      { title: 'Terminou sem conflito', text: 'As duas cores são as duas partes. O grafo é bipartido.' }
    ],
    note: {
      kind: 'key',
      title: 'Por que funciona',
      text: 'Numa 2-coloração toda aresta troca de cor. Um ciclo volta ao ponto de partida, logo precisa de um número PAR de trocas. Ciclo ímpar é impossível.'
    },
    graph: {
      view: [760, 400],
      caption: 'C₅: as duas frentes se encontram e 3–4 fecha o conflito',
      nodes: [
        { id: '1', x: 380, y: 70, state: 'active', note: 'cor 0' },
        { id: '2', x: 610, y: 200, state: 'done', note: 'cor 1' },
        { id: '5', x: 150, y: 200, state: 'done', note: 'cor 1' },
        { id: '3', x: 530, y: 350, state: 'active', note: 'cor 0' },
        { id: '4', x: 230, y: 350, state: 'active', note: 'cor 0' }
      ],
      edges: [
        { from: '1', to: '2', state: 'tree' },
        { from: '1', to: '5', state: 'tree' },
        { from: '2', to: '3', state: 'tree' },
        { from: '5', to: '4', state: 'tree' },
        { from: '3', to: '4', state: 'warn', label: 'conflito: 0 e 0' }
      ]
    }
  },
  {
    type: 'poll',
    poll: 'conectividade',
    eyebrow: 'Checkpoint'
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · cortes',
    question: 'Sobre um grafo G conexo com pelo menos 3 vértices, avalie:',
    alternatives: [
      'I. Se e é uma ponte, então e não pertence a nenhum ciclo de G.',
      'II. Se v é articulação, então todo par de vértices de G − v continua conectado.',
      'III. Vale κ(G) ≤ λ(G) ≤ δ(G).'
    ],
    answer: 'Corretas: I e III.',
    why: 'I — se e = {u,v} estivesse num ciclo, o resto do ciclo seria um caminho alternativo de u a v, e remover e não desconectaria nada; logo ponte e ciclo se excluem. II é falsa e inverte a definição: articulação é exatamente o vértice cuja remoção **desconecta** — existe par que deixa de se comunicar em G − v. III é a cadeia padrão de robustez.'
  }
];
