/**
 * Módulo 12 — Ordenação topológica: Kahn, DFS e detecção de ciclo.
 */

const dag = {
  view: [760, 380],
  directed: true,
  nodes: [
    { id: '1', x: 110, y: 190 },
    { id: '2', x: 310, y: 90 },
    { id: '3', x: 310, y: 300 },
    { id: '4', x: 510, y: 190 },
    { id: '5', x: 690, y: 190 }
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '4' },
    { from: '4', to: '5' }
  ]
};

export const topologica = [
  {
    type: 'section',
    kicker: 'Módulo 12',
    title: 'Alinhar um DAG numa fila que respeita todas as setas.',
    description: 'É o algoritmo por trás de build systems, grade curricular, escalonamento de tarefas e resolução de dependências.',
    topics: ['Kahn', 'via DFS', 'unicidade', 'detecção de ciclo']
  },
  {
    type: 'definition',
    eyebrow: 'Definição',
    title: 'Ordenação topológica',
    formulas: [
      'ordem v₁, v₂, …, vₙ tal que',
      'para todo arco (vᵢ, vⱼ):  i < j'
    ],
    description: 'Toda seta aponta para a **frente** na lista. Existe ordenação topológica **se e somente se** o dígrafo é acíclico (DAG).',
    points: [
      'Um ciclo v→u→v exigiria i < j e j < i ao mesmo tempo. Impossível.',
      'Na prática: "que ordem de disciplinas respeita todos os pré-requisitos?"',
      'Em geral existem **várias** ordens válidas — não é uma resposta única.'
    ],
    graph: { ...dag, caption: '1 → {2,3} → 4 → 5' }
  },
  {
    type: 'steps',
    eyebrow: 'Algoritmo de Kahn',
    title: 'Quem não depende de ninguém sai primeiro',
    description: 'Mantenha uma fila com todos os vértices de **grau de entrada 0**. Desempate por ordem lexicográfica quando houver mais de um.',
    items: [
      { title: 'Calcule os graus de entrada', text: 'd⁻: 1→0, 2→1, 3→1, 4→2, 5→1. Só o vértice **1** está pronto.' },
      { title: 'Extrai 1', text: 'Decrementa d⁻ de 2 e de 3: os dois chegam a 0 e entram na fila juntos.' },
      { title: 'Extrai 2 (desempate lex)', text: 'Decrementa d⁻(4): de 2 para 1. **Decrementar não é liberar** — 4 ainda não entra.' },
      { title: 'Extrai 3', text: 'Decrementa d⁻(4): de 1 para 0. Agora sim, 4 entra na fila.' },
      { title: 'Extrai 4, depois 5', text: 'Ordem final: **1, 2, 3, 4, 5**. Custo total O(n + m).' }
    ],
    note: {
      kind: 'key',
      title: 'Como Kahn detecta ciclo',
      text: 'Se o laço termina e você emitiu menos de n vértices, os que sobraram estão presos num ciclo — cada um espera outro que nunca chega a grau 0.'
    },
    graph: {
      ...dag,
      caption: 'ordem emitida: 1 · 2 · 3 · 4 · 5',
      nodes: [
        { id: '1', x: 110, y: 190, state: 'done', note: '1º' },
        { id: '2', x: 310, y: 90, state: 'done', note: '2º' },
        { id: '3', x: 310, y: 300, state: 'done', note: '3º' },
        { id: '4', x: 510, y: 190, state: 'active', note: '4º' },
        { id: '5', x: 690, y: 190, note: '5º' }
      ]
    }
  },
  {
    type: 'code',
    eyebrow: 'A alternativa por DFS',
    title: 'Ordem inversa dos tempos de término',
    description: 'Rode a DFS e, quando um vértice **terminar**, empilhe-o. Ao final, desempilhar dá a ordenação topológica.',
    lines: [
      'TOPO-DFS(G):',
      '  pilha ← vazia',
      '  para cada v em V:',
      '    se v branco: VISITA(v)',
      '  devolva pilha desempilhada     // ordem inversa de término',
      '',
      '  VISITA(v):',
      '    v ← cinza',
      '    para cada u em adj⁺(v):',
      '      se u é CINZA: erro — existe ciclo (aresta de retorno)',
      '      se u é branco: VISITA(u)',
      '    v ← preto',
      '    empilhe v'
    ],
    note: {
      kind: 'tip',
      title: 'Por que a inversa funciona',
      text: 'Um vértice só termina depois de todos os seus descendentes. Logo ele tem o maior tempo de término da sua sub-árvore — e deve aparecer antes deles na ordem.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'Unicidade',
    title: 'Uma única ordem ⟺ existe caminho hamiltoniano',
    description: 'Se em algum momento houver **dois** vértices com grau de entrada 0 ao mesmo tempo, existe mais de uma ordenação válida.',
    points: [
      'No exemplo, 2 e 3 ficam prontos juntos: 1,2,3,4,5 e 1,3,2,4,5 são ambas válidas.',
      'A ordem é única exatamente quando cada par consecutivo tem arco — que é o critério de **caminho hamiltoniano em DAG** do módulo 9.',
      'Na prova, declare o critério de desempate (lexicográfico é o usual) antes de rodar.'
    ],
    graph: {
      view: [760, 380],
      directed: true,
      caption: '2 e 3 ficam prontos ao mesmo tempo → duas ordens válidas',
      nodes: [
        { id: '1', x: 110, y: 190, state: 'dim' },
        { id: '2', x: 310, y: 90, state: 'active' },
        { id: '3', x: 310, y: 300, state: 'active' },
        { id: '4', x: 510, y: 190 },
        { id: '5', x: 690, y: 190 }
      ],
      edges: [
        { from: '1', to: '2', state: 'dim' },
        { from: '1', to: '3', state: 'dim' },
        { from: '2', to: '4' },
        { from: '3', to: '4' },
        { from: '4', to: '5' }
      ]
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · ordenação topológica',
    question: 'Sobre ordenação topológica de um dígrafo D, avalie:',
    alternatives: [
      'I. D admite ordenação topológica se e somente se D é acíclico.',
      'II. A ordenação topológica de um DAG é sempre única.',
      'III. Se o algoritmo de Kahn emite menos de n vértices, D contém ciclo.'
    ],
    answer: 'Corretas: I e III.',
    why: 'I é a caracterização: ciclo e ordem linear são incompatíveis, e todo DAG tem pelo menos uma fonte, o que sustenta a construção por indução. III é como Kahn detecta o ciclo: os vértices restantes nunca atingem grau de entrada 0. II é falsa: basta haver dois vértices simultaneamente sem dependências pendentes — no DAG do módulo, 1,2,3,4,5 e 1,3,2,4,5 são ambas corretas.'
  }
];
