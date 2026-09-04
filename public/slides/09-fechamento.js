/**
 * Fechamento — mapa de decisão e as armadilhas que as questões cobraram.
 */

export const fechamento = [
  {
    type: 'section',
    kicker: 'Fechamento',
    minutes: 2,
    title: 'Como reconhecer o algoritmo no enunciado.',
    description: 'Quase toda questão de grafos começa com uma destas perguntas. Identificada a pergunta, o algoritmo vem junto.'
  },
  {
    type: 'table',
    eyebrow: 'Mapa de decisão',
    title: 'O que o enunciado pede → o que você usa',
    headers: ['se o enunciado pede…', 'ferramenta', 'custo'],
    rows: [
      ['Está tudo conectado? Quantos grupos?', 'BFS/DFS ou união-busca', 'Θ(n + m)'],
      ['Menor nº de arestas entre dois vértices', 'BFS (nível = distância)', 'Θ(n + m)'],
      ['Menor custo, pesos ≥ 0', 'Dijkstra', 'Θ(m log n)'],
      ['Menor custo com peso negativo', 'Bellman-Ford', 'Θ(n · m)'],
      ['Conectar tudo pelo menor custo total', 'Prim ou Kruskal', 'Θ(m log n)'],
      ['Existe ciclo? É DAG?', 'DFS — aresta de retorno', 'Θ(n + m)'],
      ['Ordem que respeita dependências', 'Kahn ou DFS invertida', 'Θ(n + m)'],
      ['Grupos que se alcançam mutuamente', 'Kosaraju — 2 DFS', 'Θ(n + m)'],
      ['Passar por toda ARESTA uma vez', 'Critério de Euler + Fleury', 'Θ(n + m)'],
      ['Passar por todo VÉRTICE uma vez', 'Dirac/Ore (suficientes); NP no geral', '—'],
      ['Separar o que não pode conviver', 'Coloração — guloso, Welch-Powell', 'NP no geral']
    ]
  },
  {
    type: 'list',
    eyebrow: 'As armadilhas que as cinco questões cobraram',
    title: 'Nove erros, uma linha cada',
    items: [
      'Dizer que o nº de vértices de grau ímpar é **ímpar** — é **par**. Foi a 1ª asserção da questão de 2011.',
      'Errar a **contagem de iterações** do Dijkstra: a extração da origem já é a primeira. Foi a de 2021.',
      'Confundir **menos arestas** com **menor custo** — foi a afirmação I da Q11/2023.',
      'Somar o **custo já percorrido** na busca gulosa: ela só olha a estimativa. Foi a Q32/2023.',
      'Aceitar **classe de equivalência com membro avulso** — foram as alternativas D e E da Q12/2023.',
      'Usar **Dijkstra com peso negativo**: ele fecha cedo e erra em silêncio.',
      'Achar que o caminho **dentro da AGM** é caminho mínimo. Não é: D–A–B–E = 10 contra D–E = 7.',
      'Concluir "não é hamiltoniano" porque **falhou em Dirac** — o C₅ derruba isso.',
      'Escrever **χ = 3 porque o guloso deu 3**: o guloso só dá limite superior.'
    ],
    note: {
      kind: 'key',
      title: 'O padrão dos erros',
      text: 'Quase todos são troca de uma palavra: par/ímpar, hops/custo, dentro/fora, suficiente/necessário, limite/valor. A prova raramente pede conta difícil — ela pede leitura precisa.'
    }
  },
  {
    type: 'list',
    eyebrow: 'Antes de marcar a alternativa',
    title: 'Checklist de 30 segundos',
    items: [
      'A hipótese sobre os **pesos** está satisfeita? (≥ 0 para Dijkstra)',
      'O grafo é **dirigido** ou não? Isso descarta metade dos algoritmos.',
      'Conferi a **paridade**? ∑d(v) = 2m, e o nº de graus ímpares é par.',
      'Se afirmei "é mínimo/máximo", tenho o **certificado**? (corte seguro, clique, invariante)',
      'A resposta passa na **verificação independente**? Somar o caminho, contar as arestas, olhar cada aresta colorida.'
    ]
  },
  {
    type: 'closing',
    eyebrow: 'Obrigado',
    title: 'Dúvida agora vale mais que dúvida na véspera.',
    description: 'Resoluções passo a passo: thalesmms.github.io/Listas-Exercicios — Guia de Grafos e Grafos-Provas.'
  }
];
