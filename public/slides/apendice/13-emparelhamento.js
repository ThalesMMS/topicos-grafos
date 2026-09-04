/**
 * Módulo 13 — Emparelhamento, Berge, atribuição (Húngaro) e os quatro
 * conjuntos especiais.
 */

const bipartido = {
  view: [760, 400],
  nodes: [
    { id: '1', x: 190, y: 90 },
    { id: '2', x: 190, y: 210 },
    { id: '3', x: 190, y: 330 },
    { id: 'a', x: 570, y: 90 },
    { id: 'b', x: 570, y: 210 },
    { id: 'c', x: 570, y: 330 }
  ],
  edges: [
    { from: '1', to: 'a' },
    { from: '1', to: 'b' },
    { from: '2', to: 'b' },
    { from: '3', to: 'b' },
    { from: '3', to: 'c' }
  ]
};

export const emparelhamento = [
  {
    type: 'section',
    kicker: 'Módulo 13',
    title: 'Parear sem repetir ninguém.',
    description: 'Tarefas e máquinas, alunos e orientadores, times e horários: o mesmo problema, com e sem custo.',
    topics: ['emparelhamento', 'Teorema de Berge', 'método Húngaro', 'conjuntos especiais']
  },
  {
    type: 'definition',
    eyebrow: 'Definição',
    title: 'Emparelhamento: arestas sem vértice em comum',
    formulas: [
      'M ⊆ E é emparelhamento  ⟺  duas arestas de M nunca compartilham extremo',
      'v é SATURADO por M se alguma aresta de M toca v; senão, v é LIVRE',
      'M é PERFEITO se satura todos os vértices  ⇒ |M| = n/2'
    ],
    description: 'Cada vértice participa de no máximo uma aresta escolhida. É a formalização exata de "cada pessoa recebe no máximo uma tarefa".',
    points: [
      'M **maximal**: não dá para acrescentar aresta nenhuma sem quebrar a regra.',
      'M **máximo**: tem a maior cardinalidade possível. Maximal ≠ máximo.',
      'Emparelhamento perfeito só pode existir se n for par.'
    ],
    graph: {
      ...bipartido,
      caption: 'M = {1a, 3c} — os vértices 2 e b estão livres',
      nodes: [
        { id: '1', x: 190, y: 90, state: 'done' },
        { id: '2', x: 190, y: 210, state: 'warn', note: 'livre' },
        { id: '3', x: 190, y: 330, state: 'done' },
        { id: 'a', x: 570, y: 90, state: 'done' },
        { id: 'b', x: 570, y: 210, state: 'warn', note: 'livre' },
        { id: 'c', x: 570, y: 330, state: 'done' }
      ],
      edges: [
        { from: '1', to: 'a', state: 'tree' },
        { from: '1', to: 'b', state: 'dim' },
        { from: '2', to: 'b', state: 'dim' },
        { from: '3', to: 'b', state: 'dim' },
        { from: '3', to: 'c', state: 'tree' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'A ferramenta',
    title: 'Caminho alternante e caminho aumentante',
    formulas: [
      'M-ALTERNANTE: caminho que alterna aresta fora de M / dentro de M',
      'M-AUMENTANTE: alternante que COMEÇA e TERMINA em vértices LIVRES',
      '',
      'M ← M △ P   (diferença simétrica)  ⇒  |M| cresce em 1'
    ],
    description: 'Um caminho aumentante tem uma aresta fora de M a mais do que dentro. Trocar dentro por fora ao longo dele aumenta o emparelhamento em exatamente 1.',
    points: [
      'No grafo anterior, **a – 1 – b** é alternante (a1 ∈ M, 1b ∉ M) mas começa num vértice saturado: não serve.',
      'Já **2 – b** é aumentante — 2 e b estão livres. Aplicando M △ {2b} chega-se a {1a, 2b, 3c}, perfeito.',
      'A diferença simétrica preserva a propriedade de emparelhamento — nenhum vértice fica com duas arestas.',
      'Comece a busca sempre a partir de um vértice **livre**.'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'A distinção que vale ponto',
    title: 'Maximal não é máximo',
    description: 'No caminho 1–2–3–4, o emparelhamento M = {23} é **maximal** (nenhuma aresta pode ser acrescentada) e tem tamanho 1. Mas {12, 34} tem tamanho 2.',
    graph: {
      view: [760, 320],
      caption: 'M = {23} é maximal e não é máximo — 1–2–3–4 é aumentante',
      nodes: [
        { id: '1', x: 110, y: 160, state: 'warn', note: 'livre' },
        { id: '2', x: 320, y: 160, state: 'done' },
        { id: '3', x: 530, y: 160, state: 'done' },
        { id: '4', x: 700, y: 160, state: 'warn', note: 'livre' }
      ],
      edges: [
        { from: '1', to: '2', state: 'dim' },
        { from: '2', to: '3', state: 'tree', label: '∈ M' },
        { from: '3', to: '4', state: 'dim' }
      ]
    },
    points: [
      'O caminho 1–2–3–4 é aumentante: fora, dentro, fora — começando e terminando em livres.',
      'Aplicando M △ P: sai 23, entram 12 e 34. Novo M = {12, 34}, tamanho 2 e perfeito.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Teorema de Berge (1957)',
    title: 'O critério exato de otimalidade',
    formulas: [
      'M é MÁXIMO  ⟺  não existe caminho M-aumentante em G'
    ],
    description: 'É o que transforma "tentei e não consegui melhorar" em prova. Se você varreu todos os vértices livres e nenhum caminho aumentante apareceu, o emparelhamento **é** máximo.',
    points: [
      'Algoritmo direto: enquanto existir aumentante, aplique a diferença simétrica. Cada iteração ganha +1, então há no máximo n/2 iterações.',
      'Em grafo **bipartido**, achar o aumentante é uma busca simples (Hopcroft-Karp faz em O(m√n)).',
      'Em grafo **geral**, ciclos ímpares atrapalham — é aí que entra Edmonds.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'Grafo geral',
    title: 'Edmonds e a flor (blossom)',
    description: 'Num ciclo ímpar alternante, a busca pode entrar e sair pelo mesmo vértice e concluir errado que não há aumentante. A **flor** é esse ciclo.',
    points: [
      '**Contrair** a flor num supervértice reduz o problema a um grafo menor.',
      'Achado o aumentante no grafo contraído, faça o **lifting**: expanda a flor e complete o caminho por dentro dela.',
      'É o que torna emparelhamento máximo polinomial em grafo geral — O(n³) na versão clássica.'
    ],
    note: {
      kind: 'tip',
      title: 'Em bipartido você nunca precisa disso',
      text: 'Grafo bipartido não tem ciclo ímpar (módulo 4). Logo não há flor, e a busca simples basta.'
    }
  },
  {
    type: 'definition',
    eyebrow: 'Com custo: problema de atribuição',
    title: 'Método Húngaro',
    formulas: [
      'minimizar ∑ c(i, σ(i))  sobre todas as bijeções σ',
      '',
      'invariante: subtrair uma constante de uma linha (ou coluna)',
      '            NÃO muda a atribuição ótima'
    ],
    description: 'Atribuição é emparelhamento perfeito **ponderado** num K₍n,n₎. O Húngaro explora o invariante acima para fabricar zeros e ler a solução neles.',
    points: [
      '**Passo 1** — reduza cada linha pelo seu mínimo; depois cada coluna.',
      '**Passo 2** — cubra todos os zeros com o **mínimo** de linhas/colunas.',
      '**Passo 3** — se o nº de linhas = n, os zeros independentes dão a solução. Senão, seja α o menor valor descoberto: subtraia α dos descobertos, some α nos cobertos duas vezes e volte ao passo 2.',
      'Matriz retangular: complete com linhas/colunas *dummy* de custo 0 até ficar quadrada.'
    ]
  },
  {
    type: 'table',
    eyebrow: 'Húngaro na prática',
    title: 'Uma matriz 3 × 3, do custo ao ótimo',
    description: 'Custos originais à esquerda; depois das reduções e do ajuste com α = 1, os zeros independentes aparecem em negrito.',
    headers: ['', 'a', 'b', 'c', '→ após reduções e ajuste', 'a', 'b', 'c'],
    rows: [
      ['1', '4', '1', '3', '', '1', '**0**', '1'],
      ['2', '2', '0', '5', '', '**0**', '0', '4'],
      ['3', '3', '2', '2', '', '0', '1', '**0**']
    ],
    note: {
      kind: 'check',
      title: 'Conferindo o resultado',
      text: 'Atribuição: 1→b, 2→a, 3→c. Custo real 1 + 2 + 2 = **5**. As outras cinco permutações dão 6, 6, 7, 9 e 11 — o 5 é mesmo o mínimo.'
    }
  },
  {
    type: 'compare',
    eyebrow: 'Os quatro conjuntos especiais',
    title: 'Independente, dominante, cobertura e clique',
    columns: [
      {
        title: 'Independente',
        description: 'Nenhuma aresta **dentro** do conjunto.',
        items: ['Dois vértices do conjunto nunca são adjacentes', 'Maior tamanho: α(G)']
      },
      {
        title: 'Dominante',
        description: 'Todo vértice de fora tem vizinho **dentro**.',
        items: ['Cobre o grafo por vizinhança', 'Menor tamanho: γ(G)']
      },
      {
        title: 'Cobertura de vértices',
        description: 'Toda **aresta** tem ponta no conjunto.',
        items: ['S é cobertura ⟺ V∖S é independente', 'Menor tamanho: β(G)']
      },
      {
        title: 'Clique',
        description: 'Todos adjacentes entre si.',
        items: ['Subgrafo completo', 'Maior tamanho: ω(G)']
      }
    ],
    note: {
      kind: 'key',
      title: 'König, em bipartido',
      text: 'Em grafo bipartido, o tamanho do **emparelhamento máximo** é igual ao da **cobertura mínima de vértices**. É o que liga este módulo ao anterior — e o que se prova por fluxo.'
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · emparelhamento',
    question: 'Sobre emparelhamento M em um grafo G, avalie:',
    alternatives: [
      'I. M é máximo se e somente se não existe caminho M-aumentante em G.',
      'II. Todo emparelhamento maximal é máximo.',
      'III. Se P é um caminho M-aumentante, então M △ P é um emparelhamento com |M| + 1 arestas.'
    ],
    answer: 'Corretas: I e III.',
    why: 'I é o Teorema de Berge. III é a construção que ele sustenta: o aumentante tem uma aresta fora de M a mais do que dentro, e a diferença simétrica troca os papéis mantendo a propriedade de emparelhamento. II é falsa — no caminho 1–2–3–4, M = {23} é maximal (nenhuma aresta cabe) e tem 1 aresta, enquanto {12, 34} tem 2.'
  }
];
