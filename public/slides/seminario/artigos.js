/**
 * Quatro artigos, quatro aplicações DIFERENTES de grafos.
 *
 * O critério de SELEÇÃO é a diversidade de domínio — logística, compiladores,
 * busca na web e descoberta de fármacos. A ORDEM é cronológica: 1959, 1982,
 * 1999, 2020. Em
 * cada um, o que muda é o que vira vértice e o que vira aresta, e é isso que o
 * slide de síntese compara.
 *
 * O bloco de coloração vem antes dos artigos e prepara a aplicação de 1982.
 *
 * Todas as referências foram conferidas na fonte: título, autoria, veículo e
 * ano. O campo `limit` existe para que nenhuma afirmação chegue ao telão sem o
 * seu contorno.
 */

export const artigos = [
  {
    id: 'artigo-dantzig',
    type: 'article',
    minutes: 3,
    period: 'Aplicação 1 · logística',
    year: '1959',
    title: 'Como distribuir entregas entre caminhões',
    paper: 'The Truck Dispatching Problem',
    authors: 'George B. Dantzig · John H. Ramser · Management Science 6(1), p. 80–91',
    href: 'https://doi.org/10.1287/mnsc.6.1.80',
    points: [
      'Problema: abastecer postos de gasolina a partir de um terminal, com uma frota de caminhões.',
      '**Vértice** = terminal ou posto. **Aresta** = ligação cujo custo é a menor distância entre os pontos.',
      'Cada caminhão sai do depósito, atende um subconjunto de postos e volta — respeitando a **capacidade** do tanque.',
      'O objetivo é atender às demandas e minimizar a distância total da frota. É uma formulação inicial do **Problema de Roteamento de Veículos**.'
    ],
    connection: 'Dijkstra ou Floyd–Warshall podem fornecer as distâncias entre os pontos. O roteamento usa essas distâncias para decidir quais clientes cada caminhão atende e em que ordem.',
    limit: 'O procedimento usa programação linear para buscar uma solução próxima da ótima. O artigo relata problemas de teste, ainda sem aplicação prática do método.'
  },
  {
    id: 'artigo-chaitin',
    type: 'article',
    minutes: 3,
    period: 'Aplicação 2 · compiladores',
    year: '1982',
    title: 'Alocar registradores é colorir um grafo',
    paper: 'Register allocation & spilling via graph coloring',
    authors: 'Gregory J. Chaitin · SIGPLAN Symposium on Compiler Construction · SIGPLAN Notices 17(6), p. 98–101',
    href: 'https://dl.acm.org/doi/10.1145/800230.806984',
    points: [
      '**Vértice** = valor a guardar em registrador. **Aresta** = conflito entre valores que precisam permanecer disponíveis ao mesmo tempo.',
      'Isso é o *grafo de interferência*. Atribuir registradores = **colorir** esse grafo.',
      'k registradores disponíveis ⇒ a pergunta é se o grafo admite k-coloração.',
      'Quando a alocação não encontra cores suficientes, escolhe valores para guardar na memória (*spill*). O artigo usa conflitos e estimativas de custo nessa decisão.'
    ],
    connection: 'As cores agora representam registradores. Vértices adjacentes precisam de registradores diferentes. Chaitin combina coloração com simplificação do grafo e escolha de spills.',
    limit: 'O trabalho de 1982 amplia uma proposta anterior de alocação por coloração para tratar spills. Uma heurística pode recorrer à memória mesmo quando existe uma k-coloração.'
  },
  {
    id: 'artigo-pagerank',
    type: 'article',
    minutes: 3,
    period: 'Aplicação 3 · busca na web',
    year: '1999',
    title: 'PageRank: calcular importância a partir dos links',
    paper: 'The PageRank Citation Ranking: Bringing Order to the Web',
    authors: 'Lawrence Page · Sergey Brin · Rajeev Motwani · Terry Winograd · Stanford InfoLab, TR 1999-66',
    href: 'http://ilpubs.stanford.edu:8090/422/',
    points: [
      '**Vértice** = página. **Aresta** = link de uma página para outra. O grafo é dirigido.',
      'Ideia: a importância de uma página vem da importância de quem aponta para ela — uma definição **recursiva** sobre o grafo.',
      'Um navegante aleatório segue links ou salta para uma página escolhida ao acaso. O PageRank é a fração do tempo que ele passa em cada página, no longo prazo.',
      'O cálculo usa probabilidades de transição derivadas dos links, com saltos aleatórios e tratamento das páginas sem saída.'
    ],
    connection: 'O sentido dos arcos indica quem aponta para quem. O grau de entrada conta links recebidos. PageRank também considera a importância das páginas de origem e como elas distribuem seus links.',
    limit: 'PageRank mede importância pela estrutura de links. A relevância para uma consulta também depende do conteúdo e de outros critérios.'
  },
  {
    id: 'artigo-halicina',
    type: 'article',
    minutes: 3,
    period: 'Aplicação 4 · biologia e química',
    year: '2020',
    title: 'Grafos moleculares na busca de antibióticos',
    paper: 'A Deep Learning Approach to Antibiotic Discovery',
    authors: 'Jonathan M. Stokes et al. · Cell 180(4), fevereiro de 2020',
    href: 'https://www.cell.com/cell/fulltext/S0092-8674(20)30102-1',
    points: [
      '**Vértice** = átomo. **Aresta** = ligação química. Rótulos descrevem propriedades dos átomos e das ligações.',
      'A rede neural propaga mensagens pelas ligações e combina a representação aprendida com descritores moleculares para fazer a previsão.',
      'Treinado para prever atividade antibacteriana, foi aplicado a bibliotecas de milhões de moléculas.',
      'Resultado: identificou a **halicina**, estruturalmente distante dos antibióticos conhecidos, com atividade contra patógenos resistentes.'
    ],
    connection: 'A lista de adjacência volta a ter utilidade: ela identifica os vizinhos que trocam informação. A estrutura orienta uma previsão aprendida, em vez de uma busca de caminhos mínimos.',
    limit: 'A triagem é computacional: aponta candidatos, não aprova medicamentos. A halicina passou por testes em cultura e em camundongos; eficácia e segurança em humanos exigem ensaios clínicos.'
  },
  {
    id: 'artigos-sintese',
    type: 'compare',
    minutes: 2,
    eyebrow: 'Comparação das aplicações',
    title: 'Modelagem e saída nas quatro aplicações',
    columns: [
      {
        title: '1959 · logística',
        description: 'vértice = terminal ou posto, aresta = ligação',
        items: ['Pergunta: quem atende cada posto e em que ordem?', 'Ferramenta: procedimento baseado em programação linear', 'Saída: uma rota por caminhão']
      },
      {
        title: '1982 · compilador',
        description: 'vértice = variável, aresta = conflito',
        items: ['Pergunta: cabe em k registradores?', 'Ferramenta: coloração', 'Saída: uma atribuição (ou um spill)']
      },
      {
        title: '1999 · web',
        description: 'vértice = página, aresta = link',
        items: ['Pergunta: qual a importância de cada página?', 'Ferramenta: iteração de probabilidades', 'Saída: uma pontuação por página']
      },
      {
        title: '2020 · química',
        description: 'vértice = átomo, aresta = ligação',
        items: ['Pergunta: a molécula tem atividade antibacteriana?', 'Ferramenta: aprendizado sobre o grafo', 'Saída: uma previsão a testar']
      }
    ],
    note: {
      kind: 'key',
      title: 'O que os quatro têm em comum',
      text: 'Cada aplicação define o significado dos vértices e das arestas, a saída esperada e como verificar o resultado. Esses mesmos critérios orientam a resolução das questões.'
    }
  }
];
