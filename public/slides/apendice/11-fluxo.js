/**
 * Módulo 11 — Fluxo máximo: rede residual, Ford-Fulkerson, corte mínimo e as
 * variantes que domam a complexidade.
 */

const rede = {
  view: [760, 400],
  directed: true,
  nodes: [
    { id: 'S', x: 120, y: 210 },
    { id: 'A', x: 360, y: 100 },
    { id: 'B', x: 360, y: 320 },
    { id: 'T', x: 640, y: 210 }
  ],
  edges: [
    { from: 'S', to: 'A', weight: 3 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'T', weight: 2 },
    { from: 'B', to: 'T', weight: 3 }
  ]
};

export const fluxo = [
  {
    type: 'section',
    kicker: 'Módulo 11',
    title: 'Fluxo máximo: quanto passa pelo gargalo.',
    description: 'O algoritmo é simples. O que faz ele funcionar é uma aresta que não existe na rede original.',
    topics: ['fluxo viável', 'rede residual', 'Ford-Fulkerson', 'max-flow = min-cut']
  },
  {
    type: 'definition',
    eyebrow: 'A rede',
    title: 'Fluxo viável: duas restrições, só',
    formulas: [
      'capacidade:   0 ≤ f(u,v) ≤ c(u,v)   para todo arco',
      'conservação:  ∑ f(entra em v) = ∑ f(sai de v)   para v ≠ s, t',
      '|f| = fluxo que sai de s = fluxo que entra em t'
    ],
    description: 'A conservação **não** vale na fonte s nem no sumidouro t — são eles que produzem e consomem o fluxo.',
    points: [
      'A capacidade total saindo de S é 3 + 2 = 5. Nenhum fluxo pode passar disso.',
      'Esse limite superior imediato já é um **corte** — e a resposta final vai bater com ele.',
      'Aplicações: emparelhamento bipartido, caminhos disjuntos, escalonamento, segmentação.'
    ],
    graph: { ...rede, caption: 'capacidades; ainda sem fluxo nenhum' }
  },
  {
    type: 'definition',
    eyebrow: 'A ideia central',
    title: 'Rede residual: folga para frente, cancelamento para trás',
    formulas: [
      'para cada arco (u,v) com fluxo f:',
      '  c_res(u,v) = c(u,v) − f(u,v)     ← folga que ainda cabe',
      '  c_res(v,u) = f(u,v)              ← ARESTA REVERSA: desfazer'
    ],
    description: 'A aresta reversa não existe na rede original. Ela é o mecanismo que permite ao algoritmo **corrigir uma decisão ruim** sem recomeçar.',
    points: [
      'Empurrar fluxo por (v,u) na residual significa **cancelar** fluxo que ia por (u,v).',
      'Sem a reversa, o guloso trava num ótimo local e devolve resposta menor que a máxima.',
      'Caminho **aumentante** = qualquer caminho de s a t na residual com capacidade > 0.'
    ],
    note: {
      kind: 'warn',
      title: 'O erro que mais aparece na correção',
      text: 'Montar a residual só com as folgas, esquecendo as reversas. O algoritmo ainda "roda" e ainda "termina" — com um número menor que o fluxo máximo.'
    }
  },
  {
    type: 'steps',
    eyebrow: 'Ford-Fulkerson',
    title: 'O trace completo — inclusive o cancelamento',
    description: 'Enquanto existir caminho aumentante na residual, empurre o gargalo dele.',
    items: [
      { title: 'Aumentante 1: S→A→B→T', text: 'Gargalo = min(3, 2, 3) = **2**. Fluxo total: 2. (Escolha gulosa e infeliz: saturou A→B.)' },
      { title: 'Aumentante 2: S→A→T', text: 'Gargalo = min(1, 2) = **1**. Fluxo total: 3.' },
      { title: 'Aumentante 3: S→B→T', text: 'Gargalo = min(2, 1) = **1**. Fluxo total: 4.' },
      { title: 'Aumentante 4: S→B→A→T', text: 'B→A só existe na residual: é a **reversa** de A→B. Gargalo = min(1, 2, 1) = **1**. Fluxo total: 5.' },
      { title: 'Não há mais aumentante', text: 'Na residual, de S só se alcança… nada. O fluxo máximo é **5**.' }
    ],
    note: {
      kind: 'key',
      title: 'O que o passo 4 fez de fato',
      text: 'Ele desviou 1 unidade que ia de A para B, mandando-a direto para T, e usou B para escoar 1 unidade extra vinda de S. A reversa comprou essa troca.'
    },
    graph: {
      ...rede,
      caption: 'fluxo máximo = 5 (capacidade total de saída de S)',
      nodes: [
        { id: 'S', x: 120, y: 210, state: 'active' },
        { id: 'A', x: 360, y: 100, state: 'done' },
        { id: 'B', x: 360, y: 320, state: 'done' },
        { id: 'T', x: 640, y: 210, state: 'active' }
      ],
      edges: [
        { from: 'S', to: 'A', label: '3/3', state: 'active' },
        { from: 'S', to: 'B', label: '2/2', state: 'active' },
        { from: 'A', to: 'B', label: '1/2', state: 'tree' },
        { from: 'A', to: 'T', label: '2/2', state: 'active' },
        { from: 'B', to: 'T', label: '3/3', state: 'active' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'O teorema',
    title: 'Fluxo máximo = corte mínimo',
    formulas: [
      'corte (S, T): partição de V com s ∈ S e t ∈ T',
      'c(S,T) = ∑ c(u,v) para u ∈ S, v ∈ T   (só os arcos que ATRAVESSAM)',
      '',
      'máx |f| = mín c(S,T)'
    ],
    description: 'Todo fluxo é ≤ todo corte (fraco); e quando o algoritmo para, os dois se igualam (forte). Isso dá um **certificado verificável** da resposta.',
    points: [
      'Aqui o corte S = {s} tem capacidade 3 + 2 = 5 — igual ao fluxo. Certificado fechado.',
      'Como achar o corte mínimo: rode a busca na residual final; S = vértices alcançáveis a partir de s.',
      'Arcos que voltam de T para S **não contam** na capacidade do corte.'
    ],
    note: {
      kind: 'check',
      title: 'Como conferir sua resposta na prova',
      text: 'Exiba um corte cuja capacidade seja igual ao fluxo que você achou. Se bater, seu fluxo é provadamente máximo — sem precisar confiar no seu próprio trace.'
    }
  },
  {
    type: 'compare',
    eyebrow: 'A escolha do caminho aumentante muda tudo',
    title: 'Ford-Fulkerson, Edmonds-Karp e Dinic',
    columns: [
      {
        title: 'Ford-Fulkerson',
        description: 'Caminho aumentante qualquer.',
        items: ['O(|f| · m) — depende do VALOR do fluxo', 'Com capacidade irracional pode não terminar', 'Serve para entender, não para implementar']
      },
      {
        title: 'Edmonds-Karp',
        description: 'O aumentante mais curto (BFS).',
        items: ['O(n · m²), independente das capacidades', 'É Ford-Fulkerson + BFS, só isso', 'Evita o pingue-pongue do arco estreito']
      },
      {
        title: 'Dinic',
        description: 'Rede de níveis + fluxo de bloqueio.',
        items: ['O(n² · m) geral', 'O(m·√n) em redes de capacidade unitária', 'Padrão para emparelhamento bipartido']
      }
    ],
    note: {
      kind: 'tip',
      title: 'Por que BFS resolve',
      text: 'O caso ruim do Ford-Fulkerson é escolher sempre um caminho longo que atravessa um arco de capacidade 1, alternando de um lado para o outro. O caminho mais curto nunca cai nessa armadilha.'
    }
  },
  {
    type: 'exercise',
    eyebrow: 'Questão no formato ENADE · fluxo',
    question: 'Sobre fluxo máximo em uma rede com capacidades inteiras, avalie:',
    alternatives: [
      'I. O valor do fluxo máximo é igual à capacidade do corte mínimo.',
      'II. A rede residual precisa conter, além das folgas, arestas reversas correspondentes ao fluxo já enviado.',
      'III. Se o algoritmo termina sem encontrar caminho aumentante, o fluxo obtido pode ainda não ser máximo.'
    ],
    answer: 'Corretas: I e II.',
    why: 'I é o teorema max-flow/min-cut. II — sem as reversas o algoritmo não consegue cancelar decisões anteriores e pode parar abaixo do máximo (foi exatamente o quarto aumentante do trace que precisou dela). III é falsa: a ausência de caminho aumentante na residual é precisamente a **condição de otimalidade** — o conjunto alcançável a partir de s define um corte de capacidade igual ao fluxo.'
  }
];
