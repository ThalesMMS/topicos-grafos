/**
 * Módulo 5 — Dígrafos: alcançabilidade, fechos, os três níveis de conexidade,
 * base, antibase e Kosaraju.
 */

const digrafo = {
  view: [760, 400],
  directed: true,
  nodes: [
    { id: 'a', x: 140, y: 200 },
    { id: 'b', x: 330, y: 100 },
    { id: 'c', x: 520, y: 100 },
    { id: 'd', x: 430, y: 300 },
    { id: 'e', x: 660, y: 240 }
  ],
  edges: [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'b' },
    { from: 'c', to: 'e' }
  ]
};

export const digrafos = [
  {
    type: 'section',
    kicker: 'Módulo 5',
    title: 'Direção quebra o "conexo" que você conhecia.',
    description: 'Num dígrafo, "existe caminho" deixa de ser simétrico — e a conectividade se parte em três níveis.',
    topics: ['fechos Γ⁺ e Γ⁻', 'S, SF e F-conexo', 'base e antibase', 'Kosaraju']
  },
  {
    type: 'definition',
    eyebrow: 'Vocabulário do dígrafo',
    title: 'Arco, graus de entrada e saída',
    formulas: [
      'arco (u,v): par ORDENADO — (u,v) ≠ (v,u)',
      'd⁺(v) = nº de arcos que SAEM     d⁻(v) = nº que ENTRAM',
      '∑ d⁺(v) = ∑ d⁻(v) = |E|'
    ],
    description: 'Cada arco contribui uma vez para a saída de um vértice e uma vez para a entrada de outro. Daí as duas somas serem iguais a m — e não a 2m.',
    points: [
      '`d⁺(v) = 0`: **poço** (sumidouro) — nada sai.',
      '`d⁻(v) = 0`: **fonte** — nada entra.',
      'O **grafo subjacente** é o que sobra quando você apaga as setas.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Alcançabilidade',
    title: 'Fecho transitivo: direto e inverso',
    formulas: [
      'Γ⁺(v) = { u : existe caminho v ↝ u }   (quem v alcança)',
      'Γ⁻(v) = { u : existe caminho u ↝ v }   (quem alcança v)'
    ],
    description: 'Os dois fechos são a ferramenta que resolve praticamente toda questão de dígrafo na prova: conexidade, base, antibase e componentes fortes saem deles.',
    points: [
      'Calcule Γ⁺(v) com uma busca a partir de v, seguindo as setas.',
      'Calcule Γ⁻(v) com a mesma busca no **grafo reverso** (todas as setas invertidas).',
      'Convenção comum: v ∈ Γ⁺(v) e v ∈ Γ⁻(v) — confira a convenção da sua disciplina.'
    ],
    graph: {
      ...digrafo,
      caption: 'Γ⁺(a) = {a,b,c,d,e} — a alcança tudo. Γ⁻(a) = {a} — ninguém alcança a.',
      nodes: [
        { id: 'a', x: 140, y: 200, state: 'active', note: 'fonte' },
        { id: 'b', x: 330, y: 100, state: 'done' },
        { id: 'c', x: 520, y: 100, state: 'done' },
        { id: 'd', x: 430, y: 300, state: 'done' },
        { id: 'e', x: 660, y: 240, state: 'done', note: 'poço' }
      ]
    }
  },
  {
    type: 'compare',
    eyebrow: 'Os três níveis',
    title: 'S, SF e F-conexo — em ordem crescente de exigência',
    columns: [
      {
        title: 'S-conexo (simplesmente)',
        description: 'O **grafo subjacente** é conexo.',
        items: ['Apague as setas e teste conexidade', 'O mais fraco dos três', 'Todo dígrafo SF-conexo é S-conexo']
      },
      {
        title: 'SF-conexo (semifortemente)',
        description: 'Para todo par u,v existe caminho **em pelo menos um sentido**.',
        items: ['u ↝ v OU v ↝ u, para todo par', 'Não exige os dois sentidos', 'Todo DAG "em fila" é SF-conexo']
      },
      {
        title: 'F-conexo (fortemente)',
        description: 'Para todo par, caminho **nos dois sentidos**.',
        items: ['u ↝ v E v ↝ u', 'Equivale a: Γ⁺(v) = V para todo v', 'O dígrafo inteiro é uma única CFC']
      }
    ],
    note: {
      kind: 'warn',
      title: 'Onde a prova te pega',
      text: 'Achar um caminho de u para v não prova nada sobre F-conexo. Você precisa do caminho de volta também — e ele costuma não existir.'
    }
  },
  {
    type: 'definition',
    eyebrow: 'Base e antibase',
    title: 'De onde tudo nasce, para onde tudo vai',
    formulas: [
      'BASE: menor conjunto B tal que ⋃ Γ⁺(v) = V, v ∈ B',
      'ANTIBASE: menor conjunto A tal que ⋃ Γ⁻(v) = V, v ∈ A'
    ],
    description: 'Base é um conjunto mínimo de "pontos de partida" que alcança o grafo inteiro. Antibase é o conjunto mínimo de destinos alcançáveis por todos.',
    points: [
      'Receita: condense as CFCs. A **base** pega um vértice de cada CFC-**fonte** (sem arco entrando).',
      'A **antibase** pega um vértice de cada CFC-**poço** (sem arco saindo).',
      'Se o dígrafo é F-conexo, base e antibase têm um vértice só — qualquer um serve.'
    ]
  },
  {
    type: 'concept',
    eyebrow: 'CFC',
    title: 'Componente fortemente conexo é o átomo da direção',
    description: 'CFC é uma classe de equivalência da relação "u alcança v **e** v alcança u". Todo vértice está em exatamente uma.',
    points: [
      'Aqui as CFCs são **{b, c, d}** (o ciclo) e os unitários {a} e {e}.',
      'Contrair cada CFC num único vértice dá a **condensação** — que é sempre um DAG.',
      'A condensação ser acíclica não é acidente: um ciclo entre CFCs as fundiria numa só.'
    ],
    graph: {
      ...digrafo,
      caption: 'CFCs: {a} · {b,c,d} · {e} — a condensação é a ⟶ {b,c,d} ⟶ e',
      nodes: [
        { id: 'a', x: 140, y: 200, state: 'dim' },
        { id: 'b', x: 330, y: 100, state: 'active' },
        { id: 'c', x: 520, y: 100, state: 'active' },
        { id: 'd', x: 430, y: 300, state: 'active' },
        { id: 'e', x: 660, y: 240, state: 'dim' }
      ],
      edges: [
        { from: 'a', to: 'b', state: 'dim' },
        { from: 'b', to: 'c', state: 'active' },
        { from: 'c', to: 'd', state: 'active' },
        { from: 'd', to: 'b', state: 'active' },
        { from: 'c', to: 'e', state: 'dim' }
      ]
    }
  },
  {
    type: 'steps',
    eyebrow: 'Algoritmo',
    title: 'Kosaraju: duas DFS e um grafo reverso',
    description: 'Custo O(n + m). O truque inteiro está na **ordem** da segunda DFS.',
    items: [
      { title: 'DFS em G', text: 'Rode a busca em profundidade no grafo original e grave o **tempo de término** f(v) de cada vértice.' },
      { title: 'Construa G_R', text: 'Inverta todos os arcos. As CFCs de G_R são exatamente as mesmas de G.' },
      { title: 'DFS em G_R por ordem decrescente de f', text: 'Escolha sempre a raiz ainda não visitada com maior tempo de término.' },
      { title: 'Cada árvore é uma CFC', text: 'A floresta da segunda DFS entrega os componentes, um por árvore. Fim.' }
    ],
    note: {
      kind: 'warn',
      title: 'Os dois erros que anulam a questão',
      text: 'Rodar a segunda DFS no grafo original (em vez do reverso), ou usar ordem crescente de término. Qualquer um dos dois devolve componentes errados.'
    }
  },
  {
    type: 'code',
    eyebrow: 'Kosaraju em pseudocódigo',
    title: 'Curto o bastante para escrever na prova',
    lines: [
      'KOSARAJU(G):',
      '  pilha ← vazia',
      '  para cada v em V:',
      '    se v não visitado: DFS1(v)',
      '',
      '  DFS1(v):                      // grava término',
      '    marque v',
      '    para cada u em adj⁺(v): se u não visitado: DFS1(u)',
      '    empilhe v                   // v terminou agora',
      '',
      '  G_R ← reverso(G);  desmarque tudo',
      '  enquanto pilha não vazia:',
      '    v ← desempilha()            // maior término primeiro',
      '    se v não visitado:',
      '      CFC ← DFS2(v) em G_R      // uma árvore = um componente',
      '      reporte CFC'
    ]
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · baseada na P1 22.2',
    question: 'Sobre um dígrafo D e seus níveis de conexidade, avalie:',
    alternatives: [
      'I. Se D é F-conexo, então D é SF-conexo e S-conexo.',
      'II. Se o grafo subjacente de D é conexo, então D é SF-conexo.',
      'III. A condensação das CFCs de D é sempre acíclica.'
    ],
    answer: 'Corretas: I e III.',
    why: 'I — os três níveis são encaixados: alcançabilidade nos dois sentidos implica em pelo menos um, que implica conexidade do subjacente. II é falsa: tome a ⟵ b ⟶ c. O subjacente é conexo (S-conexo), mas de a não se chega em c nem de c em a — nenhum dos dois sentidos existe, logo não é SF-conexo. III — se houvesse ciclo entre duas CFCs, todos os seus vértices se alcançariam mutuamente e as CFCs seriam uma só, contradizendo a maximalidade.'
  }
];
