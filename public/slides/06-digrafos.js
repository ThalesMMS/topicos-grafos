/**
 * Dígrafos — alcançabilidade, DAG, ordenação topológica (Kahn passo a passo)
 * e componentes fortemente conexos.
 */

import { tracoKahn } from './lib/trace.js';

const dag = {
  view: [760, 380],
  directed: true,
  nodes: [
    { id: '1', x: 100, y: 190 },
    { id: '2', x: 300, y: 80 },
    { id: '3', x: 300, y: 300 },
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

const comCiclo = {
  view: [760, 380],
  directed: true,
  nodes: [
    { id: 'a', x: 120, y: 190, state: 'dim' },
    { id: 'b', x: 330, y: 100, state: 'warn' },
    { id: 'c', x: 540, y: 100, state: 'warn' },
    { id: 'd', x: 440, y: 300, state: 'warn' },
    { id: 'e', x: 680, y: 240, state: 'dim' }
  ],
  edges: [
    { from: 'a', to: 'b', state: 'dim' },
    { from: 'b', to: 'c', state: 'warn' },
    { from: 'c', to: 'd', state: 'warn' },
    { from: 'd', to: 'b', state: 'warn' },
    { from: 'c', to: 'e', state: 'dim' }
  ]
};

export const digrafos = [
  {
    type: 'section',
    kicker: 'Bloco 6',
    minutes: 7,
    title: 'Dígrafos: direção muda tudo.',
    description: 'Alcançabilidade deixa de ser simétrica — e nascem dois algoritmos que só existem no dirigido.',
    topics: ['graus de entrada e saída', 'DAG e ciclo', 'ordenação topológica', 'componentes fortes']
  },
  {
    type: 'definition',
    eyebrow: 'Propriedade',
    title: 'No dígrafo o grau se parte em dois',
    formulas: [
      'arco (u,v): par ORDENADO — (u,v) ≠ (v,u)',
      '',
      'd⁺(v) = arcos que SAEM      d⁻(v) = arcos que ENTRAM',
      '',
      '∑ d⁺(v) = ∑ d⁻(v) = |E|     (e NÃO 2|E|)'
    ],
    description: 'Cada arco contribui uma vez para a saída de um vértice e uma vez para a entrada de outro. Daí as duas somas darem m, e não 2m como no aperto de mãos.',
    points: [
      '`d⁻(v) = 0` → **fonte**. `d⁺(v) = 0` → **poço** (sumidouro).',
      'O **grafo subjacente** é o que sobra quando você apaga as setas.',
      'Alcançabilidade deixa de ser simétrica: existir caminho de u a v não garante o de volta.'
    ],
    graph: {
      view: [700, 360],
      directed: true,
      caption: 'a é fonte (d⁻=0); e é poço (d⁺=0)',
      nodes: [
        { id: 'a', x: 110, y: 180, state: 'active', note: 'fonte' },
        { id: 'b', x: 330, y: 90 },
        { id: 'c', x: 330, y: 280 },
        { id: 'e', x: 590, y: 180, state: 'done', note: 'poço' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
        { from: 'b', to: 'e' },
        { from: 'c', to: 'e' }
      ]
    }
  },
  {
    type: 'graph',
    eyebrow: 'Detecção de ciclo',
    title: 'Aresta de retorno ⟺ existe ciclo',
    description: 'Rode a DFS. Se algum arco aponta para um vértice **cinza** (aberto na pilha), esse arco é de **retorno** — e ele fecha um ciclo. Se nenhum aparece, o dígrafo é um **DAG**.',
    graph: { ...comCiclo, caption: 'o arco d→b aponta para b, que está cinza: ciclo b→c→d→b' },
    points: [
      'Custo: **Θ(n + m)** — é só uma DFS com as três cores.',
      'Branco = não descoberto · **cinza = descoberto e aberto** · preto = terminado.',
      'Arco para vértice **preto** não é retorno: é avanço ou cruzamento, e não fecha ciclo.'
    ],
    note: {
      kind: 'key',
      title: 'Por que isso é pré-requisito do próximo algoritmo',
      text: 'Ordenação topológica só existe em DAG. Antes de ordenar, você precisa saber que não há ciclo — e o teste é esta DFS.'
    }
  },
  {
    type: 'definition',
    eyebrow: 'Ordenação topológica',
    title: 'Alinhar o DAG para que toda seta aponte para frente',
    formulas: [
      'ordem v₁, v₂, …, vₙ  tal que',
      'para todo arco (vᵢ, vⱼ):   i < j',
      '',
      'existe ⟺ o dígrafo é ACÍCLICO'
    ],
    description: 'Um ciclo v→u→v exigiria i < j e j < i ao mesmo tempo — impossível. É a demonstração da equivalência, em uma linha.',
    points: [
      'Aplicações: pré-requisitos de disciplinas, ordem de compilação, resolução de dependências, escalonamento de tarefas.',
      'Em geral existem **várias** ordens válidas — não é resposta única.',
      'Dois algoritmos: **Kahn** (grau de entrada 0) e **DFS** (inverso dos tempos de término).'
    ],
    graph: { ...dag, caption: '1 → {2,3} → 4 → 5' }
  },

  // --- Kahn passo a passo, gerado executando o algoritmo -----------------
  ...tracoKahn({ base: dag, eyebrow: 'Kahn' }),

  {
    type: 'code',
    eyebrow: 'A alternativa por DFS',
    title: 'Ordem inversa dos tempos de término',
    description: 'Um vértice só termina depois de **todos** os seus descendentes. Logo tem o maior f da sua sub-árvore — e deve aparecer antes deles.',
    lines: [
      'TOPO-DFS(G):',
      '  pilha ← vazia',
      '  para cada v em V:',
      '    se v é branco: VISITA(v)',
      '  devolva pilha desempilhada    // inverso do término',
      '',
      '  VISITA(v):',
      '    v ← cinza',
      '    para cada u em adj⁺(v):',
      '      se u é CINZA: erro — ciclo, não há ordem',
      '      se u é branco: VISITA(u)',
      '    v ← preto',
      '    empilhe v'
    ],
    note: {
      kind: 'warn',
      title: 'Como cada um denuncia o ciclo',
      text: 'Kahn: o laço termina tendo emitido MENOS de n vértices — os restantes se esperam mutuamente. DFS: encontra uma aresta de retorno. Dois sinais diferentes, mesmo diagnóstico.'
    }
  },
  {
    type: 'concept',
    eyebrow: 'Unicidade',
    title: 'Ordem única ⟺ existe caminho hamiltoniano',
    description: 'Se em algum momento **dois** vértices têm grau de entrada 0 ao mesmo tempo, existe mais de uma ordenação válida.',
    points: [
      'No DAG do bloco, 2 e 3 ficam prontos juntos: **1,2,3,4,5** e **1,3,2,4,5** são as duas ordens válidas.',
      'A ordem é única exatamente quando **cada par consecutivo tem arco** — e isso é um caminho hamiltoniano.',
      'É o único caso em que Hamilton tem critério exato e linear. No grafo geral, o problema é NP-completo.'
    ],
    graph: {
      ...dag,
      caption: '2 e 3 prontos ao mesmo tempo → duas ordens válidas',
      nodes: [
        { id: '1', x: 100, y: 190, state: 'dim' },
        { id: '2', x: 300, y: 80, state: 'active' },
        { id: '3', x: 300, y: 300, state: 'active' },
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
    type: 'steps',
    eyebrow: 'Componentes fortemente conexos',
    title: 'Kosaraju: duas DFS e o grafo reverso',
    description: 'CFC é uma classe de equivalência da relação "u alcança v **e** v alcança u" — de novo a estrutura do bloco 2, agora com direção.',
    items: [
      { title: 'DFS em G', text: 'Grave o **tempo de término** f(v) de cada vértice.' },
      { title: 'Construa G_R', text: 'Inverta todos os arcos. As CFCs de G_R são exatamente as mesmas de G.' },
      { title: 'DFS em G_R por f decrescente', text: 'Escolha sempre a raiz não visitada de **maior** tempo de término.' },
      { title: 'Cada árvore é uma CFC', text: 'A floresta da segunda DFS entrega os componentes, um por árvore. Θ(n + m).' }
    ],
    note: {
      kind: 'warn',
      title: 'Os dois erros que anulam a questão',
      text: 'Rodar a segunda DFS no grafo original em vez do reverso; ou usar ordem CRESCENTE de término. Qualquer um dos dois devolve componentes errados.'
    },
    graph: {
      ...comCiclo,
      caption: 'CFCs: {a} · {b,c,d} · {e} — a condensação é sempre um DAG',
      nodes: [
        { id: 'a', x: 120, y: 190, state: 'dim' },
        { id: 'b', x: 330, y: 100, state: 'active' },
        { id: 'c', x: 540, y: 100, state: 'active' },
        { id: 'd', x: 440, y: 300, state: 'active' },
        { id: 'e', x: 680, y: 240, state: 'dim' }
      ]
    }
  }
];
