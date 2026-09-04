/**
 * Módulo 15 — Fechamento: mapa de decisão, checklist de prova e encerramento.
 */

export const fechamento = [
  {
    type: 'section',
    kicker: 'Fechamento',
    title: 'Como escolher a ferramenta na hora da prova.',
    description: 'Quase toda questão começa com uma dessas cinco perguntas. Identificada a pergunta, o algoritmo vem junto.',
    topics: ['mapa de decisão', 'erros clássicos', 'checklist']
  },
  {
    type: 'table',
    eyebrow: 'Mapa de decisão',
    title: 'A pergunta do enunciado → a ferramenta',
    headers: ['se o enunciado pergunta…', 'a ferramenta é', 'custo'],
    rows: [
      ['Está tudo conectado? Quantos componentes?', 'BFS ou DFS', 'O(n + m)'],
      ['Menor nº de arestas entre dois vértices', 'BFS', 'O(n + m)'],
      ['Menor custo, pesos ≥ 0', 'Dijkstra', 'O(m log n)'],
      ['Menor custo com peso negativo', 'Bellman-Ford', 'O(n · m)'],
      ['Menor custo entre todos os pares', 'Floyd-Warshall', 'O(n³)'],
      ['Conectar tudo pelo menor custo total', 'Prim ou Kruskal', 'O(m log n)'],
      ['Existe ciclo? É DAG?', 'DFS (aresta de retorno)', 'O(n + m)'],
      ['Em que ordem executar as dependências', 'Ordenação topológica', 'O(n + m)'],
      ['Componentes fortemente conexos', 'Kosaraju (2 DFS)', 'O(n + m)'],
      ['Passar por toda ARESTA uma vez', 'Critério de Euler + Fleury', 'O(n + m)'],
      ['Passar por todo VÉRTICE uma vez', 'Dirac/Ore (suficientes); NP em geral', '—'],
      ['Quanto passa pelo gargalo', 'Ford-Fulkerson / Edmonds-Karp', 'O(n·m²)'],
      ['Parear sem repetir', 'Berge + caminho aumentante', 'O(m√n) bipartido'],
      ['Parear com custo mínimo', 'Método Húngaro', 'O(n³)'],
      ['Separar o que não pode conviver', 'Coloração (guloso, Welch-Powell)', 'NP em geral']
    ]
  },
  {
    type: 'list',
    eyebrow: 'Os erros que mais custam ponto',
    title: 'Dez armadilhas, uma linha cada',
    items: [
      'Contar o **laço como 1** no grau — vale 2, e a soma ímpar denuncia.',
      'Confundir **adjacente** (vértice-vértice) com **incidente** (aresta-vértice).',
      'Usar **Dijkstra com peso negativo** — ele fecha um vértice cedo e erra em silêncio.',
      'Achar que o caminho dentro da **AGM é caminho mínimo**. Não é.',
      'Concluir "não é hamiltoniano" porque **falhou em Dirac**. Dirac é só suficiente.',
      'Aplicar **m ≤ 3n − 6** num bipartido: o limite certo é 2n − 4 (K₃,₃ passa no primeiro e não é planar).',
      'Montar a **residual sem as arestas reversas** — o fluxo para abaixo do máximo.',
      'Dizer **χ = 3 porque o guloso deu 3**. O guloso só dá limite superior.',
      'Chamar **maximal de máximo** em emparelhamento e em conjunto independente.',
      'Rodar a **segunda DFS do Kosaraju no grafo original** em vez do reverso.'
    ]
  },
  {
    type: 'list',
    eyebrow: 'Antes de entregar',
    title: 'Checklist de três minutos',
    items: [
      'Escrevi **V e E** explicitamente, ou só desenhei?',
      'A **hipótese do enunciado** apareceu em algum passo da justificativa?',
      'Conferi a **paridade**: ∑d(v) = 2m? O nº de graus ímpares é par?',
      'Os **limites** batem: n − k ≤ m ≤ C(n−k+1, 2)?',
      'Se afirmei "é mínimo/máximo", tenho o **certificado** (corte, invariante, Berge)?',
      'Se é "existe", **exibi** o objeto? Se é "todo", cobri o **caso geral**?',
      'Se é falso, dei um **contraexemplo concreto**, com a conta?'
    ],
    note: {
      kind: 'key',
      title: 'A frase que resume o curso',
      text: 'Desenho é rascunho. Conta sobre V e E é resposta.'
    }
  },
  {
    type: 'poll',
    poll: 'final',
    eyebrow: 'Última enquete'
  },
  {
    type: 'quote',
    eyebrow: 'Königsberg, 1736',
    quote: 'O problema não era caminhar melhor. Era perceber que o mapa não importava — só quem se conectava com quem.',
    attribution: 'A ideia que fundou a teoria dos grafos'
  },
  {
    type: 'closing',
    eyebrow: 'Obrigado',
    title: 'Dúvida agora vale mais que dúvida na véspera.',
    description: 'Material completo com as resoluções passo a passo: thalesmms.github.io/Listas-Exercicios — Guia de Grafos e Grafos-Provas.'
  }
];
