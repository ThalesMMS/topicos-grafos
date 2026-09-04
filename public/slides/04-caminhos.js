/**
 * Caminhos mínimos — relaxamento, Dijkstra passo a passo (gerado),
 * ENADE Q11 (OSPF/Dijkstra) e ENADE Q32 (busca gulosa).
 */

import { tracoDijkstra } from './lib/trace.js';

const rede = {
  view: [720, 400],
  directed: true,
  nodes: [
    { id: 'S', x: 110, y: 200 },
    { id: 'A', x: 340, y: 90 },
    { id: 'B', x: 340, y: 310 },
    { id: 'T', x: 590, y: 200 }
  ],
  edges: [
    { from: 'S', to: 'A', weight: 2 },
    { from: 'S', to: 'B', weight: 5 },
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'T', weight: 7 },
    { from: 'B', to: 'T', weight: 3 }
  ]
};

/**
 * Mapa da questão 32. As estimativas até São Paulo vão na `note` de cada
 * cidade, então o enunciado não precisa repeti-las em texto.
 */
const mapa = {
  view: [760, 420],
  directed: true,
  nodes: [
    { id: 'Manaus', x: 105, y: 90, note: '2 693' },
    { id: 'P. Velho', x: 105, y: 265, note: '2 464' },
    { id: 'Macapá', x: 350, y: 60, note: '2 665' },
    { id: 'Belém', x: 590, y: 60, note: '2 463' },
    { id: 'Palmas', x: 590, y: 195, note: '1 489' },
    { id: 'Cuiabá', x: 340, y: 265, note: '1 326' },
    { id: 'Goiânia', x: 570, y: 330, note: '809' },
    { id: 'S. Paulo', x: 570, y: 460, note: '0' }
  ],
  edges: [
    { from: 'Manaus', to: 'Macapá' },
    { from: 'Manaus', to: 'P. Velho' },
    { from: 'Macapá', to: 'Belém' },
    { from: 'Belém', to: 'Palmas' },
    { from: 'P. Velho', to: 'Cuiabá' },
    { from: 'P. Velho', to: 'Palmas' },
    { from: 'Cuiabá', to: 'Goiânia' },
    { from: 'Palmas', to: 'Goiânia' },
    { from: 'Goiânia', to: 'S. Paulo' }
  ]
};

/** O mesmo mapa com a rota que a gulosa devolve destacada. */
const mapaResolvido = {
  ...mapa,
  nodes: mapa.nodes.map(node => ({
    ...node,
    state: ['P. Velho', 'Cuiabá', 'Goiânia'].includes(node.id) ? 'done'
      : ['Manaus', 'S. Paulo'].includes(node.id) ? 'active' : 'dim'
  })),
  edges: mapa.edges.map(aresta => ({
    ...aresta,
    state: [['Manaus', 'P. Velho'], ['P. Velho', 'Cuiabá'], ['Cuiabá', 'Goiânia'], ['Goiânia', 'S. Paulo']]
      .some(([de, para]) => aresta.from === de && aresta.to === para) ? 'tree' : 'dim'
  }))
};

const negativo = {
  view: [720, 400],
  directed: true,
  nodes: [
    { id: 's', x: 110, y: 200 },
    { id: 'a', x: 360, y: 90, state: 'warn', note: '6 ✗ / 4 ✓' },
    { id: 'b', x: 360, y: 310, note: '7' },
    { id: 'c', x: 610, y: 200, note: '9' }
  ],
  edges: [
    { from: 's', to: 'a', weight: 6 },
    { from: 's', to: 'b', weight: 7 },
    { from: 'b', to: 'a', weight: -3, state: 'warn' },
    { from: 'a', to: 'c', weight: 5, state: 'tree' },
    { from: 'b', to: 'c', weight: 9, state: 'dim' }
  ]
};

export const caminhos = [
  {
    type: 'section',
    kicker: 'Bloco 4',
    minutes: 11,
    title: 'Caminhos mínimos.',
    description: 'Menos arestas não é menos custo. Três algoritmos, três hipóteses sobre os pesos — escolher o errado é o erro mais frequente da prova.',
    topics: ['relaxamento', 'Dijkstra passo a passo', 'ENADE Q11', 'gulosa × Dijkstra × A*', 'ENADE Q32']
  },
  {
    type: 'concept',
    eyebrow: 'A distinção de partida',
    title: 'Hops mínimos ≠ custo mínimo',
    description: 'De S a T: o caminho com **menos arestas** é S–A–T (2 arestas, custo **9**). O de **menor custo** é S–A–B–T (3 arestas, custo **6**). Quem usa BFS aqui responde 9.',
    points: [
      'Todos os pesos iguais → **BFS**, Θ(n + m).',
      'Pesos diferentes e **não negativos** → **Dijkstra**.',
      'Existe peso negativo → **Bellman-Ford**.',
      'Preciso de todos os pares → **Floyd-Warshall**, Θ(n³).'
    ],
    graph: {
      ...rede,
      caption: 'S–A–T: 2 arestas, custo 9 · S–A–B–T: 3 arestas, custo 6',
      edges: [
        { from: 'S', to: 'A', weight: 2, state: 'active' },
        { from: 'S', to: 'B', weight: 5, state: 'dim' },
        { from: 'A', to: 'B', weight: 1, state: 'active' },
        { from: 'A', to: 'T', weight: 7, state: 'warn' },
        { from: 'B', to: 'T', weight: 3, state: 'active' }
      ]
    }
  },
  {
    type: 'definition',
    eyebrow: 'A operação única',
    title: 'Relaxamento — os três algoritmos só fazem isto',
    formulas: [
      'RELAXA(u, v):',
      '  se  d[v] > d[u] + w(u,v):',
      '      d[v] ← d[u] + w(u,v)',
      '      π[v] ← u'
    ],
    description: 'Dijkstra, Bellman-Ford e Floyd-Warshall diferem **só na ordem e na quantidade de relaxamentos**. Nada mais.',
    points: [
      '`d[v]` é sempre uma **estimativa superior** da distância real — nunca fica abaixo dela.',
      '`π[v]` guarda o predecessor: é assim que se reconstrói o caminho no fim, de trás para frente.',
      'Inicialização: `d[origem] = 0`, todo o resto `∞`.',
      '**Dijkstra:** cada aresta é relaxada uma vez, na ordem certa. **Bellman-Ford:** todas as arestas, n−1 vezes.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Dijkstra · pré-condição e invariante',
    title: 'Por que fechar o menor aberto é seguro',
    formulas: [
      'PRÉ-CONDIÇÃO:  w(u,v) ≥ 0  para toda aresta',
      '',
      'INVARIANTE: se v está FECHADO, então d[v] é a distância real',
      '',
      'custo: Θ(m log n) com heap binário'
    ],
    description: 'Seja v o menor aberto. Qualquer caminho alternativo até v passa por outro vértice aberto u, com `d[u] ≥ d[v]` — e daí em diante só **soma peso não negativo**. Logo nenhum desvio chega mais barato, e `d[v]` já é definitivo.',
    note: {
      kind: 'warn',
      title: 'Onde exatamente o argumento morre',
      text: 'A frase "só soma peso não negativo". Com uma aresta negativa, um desvio pode BAIXAR o custo depois de v ter sido fechado — e Dijkstra nunca revisita quem fechou.'
    }
  },

  // --- Dijkstra passo a passo, gerado executando o algoritmo -------------
  ...tracoDijkstra({ base: rede, origem: 'S', eyebrow: 'Dijkstra de S' }),

  {
    type: 'concept',
    eyebrow: 'Reconstrução',
    title: 'O caminho sai do π, de trás para frente',
    description: 'O algoritmo devolve distâncias. O **caminho** você reconstrói andando pelos predecessores a partir do destino.',
    points: [
      '`π[T] = B` → `π[B] = A` → `π[A] = S` → `π[S] = —`. Invertendo: **S → A → B → T**.',
      'Custo pelo caminho: 2 + 1 + 3 = **6** = `d[T]` ✓ — a verificação independente do resultado.',
      'O conjunto de todas as arestas `(π[v], v)` forma a **árvore de caminhos mínimos**.'
    ],
    note: {
      kind: 'check',
      title: 'Sempre confira somando',
      text: 'Reconstrua o caminho e some os pesos à mão. Se não bater com d[destino], o trace tem erro. São 3 somas e você garante a questão.'
    }
  },
  {
    type: 'question',
    source: 'ENADE 2021 · Ciência da Computação · questão 34',
    poll: 'enade_dijkstra',
    statement: 'Dijkstra usa uma fila de prioridades cujas prioridades são a estimativa de custo. A cada iteração um vértice é retirado da fila e os arcos que começam nele são analisados. Deseja-se o custo a partir de **D**; `−1` representa custo infinito (nenhum caminho descoberto ainda).',
    question: 'Qual a estimativa de custo após DUAS iterações do algoritmo?',
    alternatives: [
      { id: 'a', text: 'A:5 B:6 C:10 D:0 E:4 F:1 G:−1' },
      { id: 'b', text: 'A:5 B:9 C:−1 D:0 E:5 F:1 G:−1' },
      { id: 'c', text: 'A:5 B:9 C:−1 D:0 E:4 F:1 G:2' },
      { id: 'd', text: 'A:5 B:7 C:8 D:0 E:4 F:1 G:2' },
      { id: 'e', text: 'A:5 B:6 C:8 D:0 E:3 F:1 G:2' }
    ],
    answer: 'c',
    graph: {
      view: [760, 400],
      directed: true,
      caption: 'em destaque os arcos que as duas primeiras iterações usam',
      nodes: [
        { id: 'D', x: 90, y: 200, state: 'active' },
        { id: 'A', x: 300, y: 70 },
        { id: 'B', x: 480, y: 130 },
        { id: 'C', x: 680, y: 70 },
        { id: 'E', x: 680, y: 230 },
        { id: 'F', x: 300, y: 330 },
        { id: 'G', x: 520, y: 330 }
      ],
      edges: [
        { from: 'D', to: 'A', weight: 5, state: 'active' },
        { from: 'D', to: 'B', weight: 9, state: 'active' },
        { from: 'D', to: 'F', weight: 1, state: 'active' },
        { from: 'F', to: 'G', weight: 1, state: 'active' },
        { from: 'F', to: 'E', weight: 3, state: 'active' },
        { from: 'A', to: 'B', state: 'dim' },
        { from: 'B', to: 'C', state: 'dim' },
        { from: 'C', to: 'E', state: 'dim' },
        { from: 'G', to: 'E', state: 'dim' }
      ]
    }
  },
  {
    type: 'question',
    source: 'ENADE 2021 · questão 34 · gabarito',
    reveal: true,
    answer: 'c',
    poll: 'enade_dijkstra',
    question: 'A primeira iteração extrai a própria origem',
    statement: 'Iteração 1 extrai D (menor aberto, 0) e relaxa D→A=5, D→B=9, D→F=1. Iteração 2 extrai **F** (1) — não A (5) — e relaxa F→G=2 e F→E=4.',
    alternatives: [
      { id: 'a', text: 'A:5 B:6 C:10 D:0 E:4 F:1 G:−1' },
      { id: 'b', text: 'A:5 B:9 C:−1 D:0 E:5 F:1 G:−1' },
      { id: 'c', text: 'A:5 B:9 C:−1 D:0 E:4 F:1 G:2' },
      { id: 'd', text: 'A:5 B:7 C:8 D:0 E:4 F:1 G:2' },
      { id: 'e', text: 'A:5 B:6 C:8 D:0 E:3 F:1 G:2' }
    ],
    why: 'B esqueceu de relaxar F→G e deixou G em −1. D já mostra B:7 e C:8 — é o estado depois de TRÊS iterações, quando A também já saiu da fila e melhorou B via A→B. A e E mexem em B sem que exista arco para isso. Contar as iterações certas é metade da questão: a extração da origem conta como a primeira.'
  },
  {
    type: 'trace',
    eyebrow: 'ENADE 2021 · questão 34 · a tabela',
    title: 'Duas iterações: extrai D, depois extrai F',
    description: 'A pegadinha é contar as iterações. A **primeira** extrai a origem D — ela conta. A segunda extrai o menor aberto, que é **F** com 1, e não A com 5.',
    headers: ['vértice', 'após iteração 1', 'após iteração 2'],
    rows: [
      ['D', '0 (extraído)', '0'],
      ['A', '5', '5'],
      ['B', '9', '9'],
      ['C', '−1', '−1'],
      ['E', '−1', '**4** (1+3 via F)'],
      ['F', '1', '1 (extraído)'],
      ['G', '−1', '**2** (1+1 via F)']
    ],
    note: {
      kind: 'warn',
      title: 'Por que as outras alternativas caem',
      text: 'B mantém G em −1: esqueceu de relaxar F→G. D já traz B:7 e C:8 — é o estado depois de TRÊS iterações. A e E alteram B para 6, o que exigiria um arco que não existe. Contar iterações é metade da questão.'
    }
  },
  {
    type: 'question',
    source: 'ENADE 2023 · Engenharia de Computação · questão 11',
    poll: 'enade_ospf',
    statement: 'O protocolo OSPF representa um sistema autônomo (SA) como um grafo ponderado: roteadores são os vértices, conexões são as arestas e atrasos nas conexões são os pesos. A identificação de cada conexão e seu atraso são passados de roteador em roteador até que todos formem uma base de dados com o grafo do SA. O OSPF usa uma versão distribuída do algoritmo de caminhos mínimos de Dijkstra. Cada rota computada é a de menor soma dos atrasos.',
    question: 'Acerca do OSPF, é correto apenas o que se afirma em:',
    claims: [
      'Havendo diferentes caminhos entre origem e destino, a rota selecionada é a que apresenta o menor número de conexões.',
      'Há uma instância da base de dados de conexões e atrasos, formando o grafo do SA, em cada roteador que compõe o SA.',
      'O algoritmo de Dijkstra é executado por um único roteador, e a tabela de rotas resultante é passada para todos os demais.',
      'Para todos os roteadores dentro de um SA, há necessidade de tráfego de informações sobre atrasos e conexões entre roteadores.'
    ],
    alternatives: [
      { id: 'a', text: 'I e III' },
      { id: 'b', text: 'II e III' },
      { id: 'c', text: 'II e IV' },
      { id: 'd', text: 'I, II e IV' },
      { id: 'e', text: 'I, III e IV' }
    ],
    answer: 'c'
  },
  {
    type: 'question',
    source: 'ENADE 2023 · questão 11 · gabarito',
    reveal: true,
    answer: 'c',
    poll: 'enade_ospf',
    question: 'Duas afirmações caem direto no conteúdo deste bloco',
    statement: 'A questão inteira gira em torno da distinção do primeiro slide — hops contra custo — e do significado da palavra "distribuída".',
    alternatives: [
      { id: 'a', text: 'I e III' },
      { id: 'b', text: 'II e III' },
      { id: 'c', text: 'II e IV — cada roteador tem sua cópia do grafo, e a troca de mensagens a mantém' },
      { id: 'd', text: 'I, II e IV' },
      { id: 'e', text: 'I, III e IV' }
    ],
    why: 'I é FALSA e é a armadilha do bloco: o critério é a soma dos atrasos, não a contagem de saltos — exatamente S–A–T (2 arestas, 9) contra S–A–B–T (3 arestas, 6). III é FALSA: "distribuída" significa que cada roteador roda Dijkstra sobre a própria cópia do grafo; ninguém centraliza. II e IV descrevem a inundação de estados de enlace, que é o que faz todas as cópias convergirem para a mesma base.'
  },
  {
    type: 'compare',
    eyebrow: 'A família toda',
    title: 'Gulosa, Dijkstra e A* — o que cada uma minimiza',
    description: 'As três escolhem o próximo vértice por uma função de prioridade. A diferença está **em qual função**.',
    columns: [
      {
        title: 'Gulosa (best-first)',
        description: 'prioridade = h(v)',
        items: [
          'Olha só a **estimativa até o destino**',
          'Ignora o custo já percorrido',
          'Rápida, e **sem garantia de ótimo**',
          'Nunca reconsidera a escolha'
        ]
      },
      {
        title: 'Dijkstra',
        description: 'prioridade = g(v)',
        items: [
          'Olha só o **custo real acumulado**',
          'Ignora onde está o destino',
          '**Ótimo** com pesos ≥ 0',
          'Explora em todas as direções'
        ]
      },
      {
        title: 'A*',
        description: 'prioridade = g(v) + h(v)',
        items: [
          'Soma os dois',
          '**Ótimo** se h for admissível (nunca superestima)',
          'Com h ≡ 0 vira exatamente Dijkstra',
          'Com g ≡ 0 vira exatamente a gulosa'
        ]
      }
    ],
    note: {
      kind: 'key',
      title: 'A frase que resolve a próxima questão',
      text: 'A gulosa escolhe pelo h e não volta atrás. Então basta seguir a tabela de estimativas, passo a passo, sem somar nada do caminho já andado.'
    }
  },
  {
    type: 'question',
    source: 'ENADE 2023 · Engenharia de Computação · questão 32',
    poll: 'enade_gulosa',
    statement: 'Uma empresa de transportes calcula uma rota de Manaus para São Paulo pela estratégia da **busca gulosa** — busca local que seleciona a melhor alternativa disponível a cada passo. Sob cada cidade está a estimativa de distância até São Paulo, em km.',
    question: 'A solução encontrada pelo algoritmo será:',
    graph: { ...mapa, caption: 'estimativa até São Paulo (km) sob cada cidade' },
    alternatives: [
      { id: 'a', text: 'Manaus → Macapá → São Paulo' },
      { id: 'b', text: 'Manaus → Porto Velho → Cuiabá → Goiânia → São Paulo' },
      { id: 'c', text: 'Manaus → Porto Velho → Palmas → Goiânia → São Paulo' },
      { id: 'd', text: 'Manaus → Macapá → Belém → Palmas → Goiânia → São Paulo' },
      { id: 'e', text: 'Manaus → Macapá → Belém → Palmas → P. Velho → Cuiabá → Goiânia → São Paulo' }
    ],
    answer: 'b'
  },
  {
    type: 'trace',
    eyebrow: 'ENADE 2023 · questão 32 · gabarito B',
    title: 'Três comparações resolvem',
    description: 'Em cada vértice, compare **apenas** o h dos vizinhos e vá para o menor. Não some o caminho andado — é isso que faz dela gulosa.',
    headers: ['em', 'opções (h)', 'escolhe'],
    rows: [
      ['Manaus', 'Macapá 2 665 · P. Velho **2 464**', 'Porto Velho'],
      ['P. Velho', 'Palmas 1 489 · Cuiabá **1 326**', 'Cuiabá'],
      ['Cuiabá', 'Goiânia **809**', 'Goiânia'],
      ['Goiânia', 'São Paulo **0**', 'chegou']
    ],
    graph: { ...mapaResolvido, caption: 'em verde a rota que a gulosa devolve' },

    note: {
      kind: 'warn',
      title: 'O que a gulosa não garante',
      text: 'Ela nunca soma o custo já percorrido nem reconsidera. Se o trecho Manaus→Porto Velho fosse gigantesco, ela escolheria igual. Por isso a rota NÃO tem garantia de ser a mais curta.'
    }
  },
  {
    type: 'question',
    source: 'ENADE 2023 · questão 32 · gabarito',
    reveal: true,
    answer: 'b',
    poll: 'enade_gulosa',
    question: 'Três comparações de h, sem somar nada do caminho',
    statement: 'Em cada cidade, compare apenas a estimativa dos vizinhos e vá para o menor: Porto Velho (2 464) sobre Macapá (2 665), Cuiabá (1 326) sobre Palmas (1 489), e daí Goiânia e São Paulo.',
    alternatives: [
      { id: 'a', text: 'Manaus → Macapá → São Paulo' },
      { id: 'b', text: 'Manaus → Porto Velho → Cuiabá → Goiânia → São Paulo' },
      { id: 'c', text: 'Manaus → Porto Velho → Palmas → Goiânia → São Paulo' },
      { id: 'd', text: 'Manaus → Macapá → Belém → Palmas → Goiânia → São Paulo' },
      { id: 'e', text: 'Manaus → Macapá → Belém → Palmas → P. Velho → Cuiabá → Goiânia → SP' }
    ],
    why: 'A alternativa A nem é caminho no grafo — Macapá não liga direto a São Paulo. D e E começam por Macapá, que tem h maior que Porto Velho: a gulosa nunca escolheria. C erra na segunda comparação, indo para Palmas (1 489) quando Cuiabá (1 326) está disponível. Repare que a gulosa jamais soma o trecho já percorrido: se Manaus→Porto Velho fosse enorme, ela escolheria igual — e é exatamente por isso que a rota não tem garantia de ser a mais curta.'
  },
  {
    type: 'graph',
    eyebrow: 'Onde Dijkstra quebra',
    title: 'Um arco negativo derruba o invariante',
    description: 'Dijkstra fecharia **a** com d = 6 na primeira iteração (é o menor aberto). Mas o caminho s→b→a custa 7 − 3 = **4**. Como *a* já estava fechado, a correção nunca acontece.',
    graph: { ...negativo, caption: 'd[a] real = 4 via s→b→a; Dijkstra devolveria 6' },
    points: [
      'Solução: **Bellman-Ford** — relaxa todas as m arestas, n−1 vezes. Θ(n·m).',
      'Uma passagem extra: se **ainda** melhora, existe **ciclo negativo alcançável** e não há caminho mínimo.',
      'Bellman-Ford é o único dos três que **detecta** o ciclo negativo. Dijkstra erra em silêncio.'
    ],
    note: {
      kind: 'warn',
      title: 'Não tente somar uma constante nos pesos',
      text: 'Somar k a todo peso para eliminar o negativo muda o resultado: caminhos com mais arestas recebem mais k e deixam de competir em igualdade. Não funciona.'
    }
  }
];
