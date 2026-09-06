/**
 * Quatro artigos, quatro aplicações DIFERENTES de grafos.
 *
 * O critério de SELEÇÃO é a diversidade de domínio — logística, compiladores,
 * busca na web e descoberta de fármacos. A ORDEM é cronológica: 1959, 1982,
 * 1999, 2020. Em
 * cada um, o que muda é o que vira vértice e o que vira aresta, e é isso que o
 * slide de síntese compara.
 *
 * A ordem cronológica tem um efeito colateral bom: o artigo de 1982 é o de
 * coloração, e ele cai logo depois do bloco de coloração do seminário.
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
    title: 'O problema que criou a roteirização',
    paper: 'The Truck Dispatching Problem',
    authors: 'George B. Dantzig · John H. Ramser · Management Science 6(1), p. 80–91',
    href: 'https://doi.org/10.1287/mnsc.6.1.80',
    points: [
      'Problema real: abastecer postos de gasolina a partir de um terminal, com uma frota de caminhões.',
      '**Vértice** = terminal ou posto. **Aresta** = trecho entre dois pontos, com distância.',
      'Cada caminhão sai do depósito, atende um subconjunto de postos e volta — respeitando a **capacidade** do tanque.',
      'É o **Problema de Roteamento de Veículos**. A definição usada hoje é essencialmente a deste artigo.'
    ],
    connection: 'A diferença é de natureza: Dijkstra resolve o melhor caminho entre DOIS pontos, em tempo polinomial. Aqui a pergunta é em que ORDEM visitar muitos pontos, e essa versão é NP-difícil. Daí o uso de heurística gulosa na questão 32, em vez de um algoritmo exato.',
    limit: 'O artigo resolve instâncias pequenas por programação linear e admite obter solução apenas *próxima* da ótima. Trânsito, janelas de entrega e frota heterogênea entram em formulações posteriores.'
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
      '**Vértice** = variável do programa. **Aresta** = duas variáveis **vivas ao mesmo tempo**, logo não podem dividir registrador.',
      'Isso é o *grafo de interferência*. Atribuir registradores = **colorir** esse grafo.',
      'k registradores disponíveis ⇒ a pergunta é se o grafo admite k-coloração.',
      'Quando não admite, o compilador escolhe uma variável para mandar à memória (*spill*) e recolore — decisão guiada por custo e grau.'
    ],
    connection: 'A coloração deixa de ser um quebra-cabeça de mapa: é uma etapa de toda compilação. E como determinar χ(G) é NP-difícil, a prática recorre à mesma heurística gulosa apresentada anteriormente.',
    limit: 'Compiladores modernos usam variantes (Chaitin–Briggs, alocação linear) e escolhem conforme o tempo de compilação disponível. O artigo é o marco fundador, não o estado da arte.'
  },
  {
    id: 'artigo-pagerank',
    type: 'article',
    minutes: 3,
    period: 'Aplicação 3 · busca na web',
    year: '1999',
    title: 'A web é um dígrafo, e o link é um voto',
    paper: 'The PageRank Citation Ranking: Bringing Order to the Web',
    authors: 'Lawrence Page · Sergey Brin · Rajeev Motwani · Terry Winograd · Stanford InfoLab, TR 1999-66',
    href: 'http://ilpubs.stanford.edu:8090/422/',
    points: [
      '**Vértice** = página. **Aresta** = link de uma página para outra. O grafo é dirigido.',
      'Ideia: a importância de uma página vem da importância de quem aponta para ela — uma definição **recursiva** sobre o grafo.',
      'Modelo equivalente: um navegante aleatório segue links; o PageRank é a fração do tempo que ele passa em cada página.',
      'O cálculo é iterativo sobre a matriz de adjacência, repetido até estabilizar.'
    ],
    connection: 'É o dígrafo do bloco 3 em escala real. Alcançabilidade e grau de entrada deixam de ser exercício e viram critério de ranqueamento — a mesma estrutura, outra pergunta.',
    limit: 'O artigo é de 1999 e descreve o protótipo acadêmico. Buscadores atuais combinam centenas de sinais; PageRank não é, hoje, o mecanismo único de ordenação.'
  },
  {
    id: 'artigo-halicina',
    type: 'article',
    minutes: 3,
    period: 'Aplicação 4 · biologia e química',
    year: '2020',
    title: 'A molécula já é um grafo — basta aprender sobre ele',
    paper: 'A Deep Learning Approach to Antibiotic Discovery',
    authors: 'Jonathan M. Stokes et al. · Cell 180(4), fevereiro de 2020',
    href: 'https://www.cell.com/cell/fulltext/S0092-8674(20)30102-1',
    points: [
      '**Vértice** = átomo. **Aresta** = ligação química. Uma molécula é literalmente um grafo rotulado.',
      'O modelo aprende trocando mensagens entre vértices vizinhos — a informação caminha pela estrutura, não por uma lista de propriedades.',
      'Treinado para prever atividade antibacteriana, foi aplicado a bibliotecas de milhões de moléculas.',
      'Resultado: identificou a **halicina**, estruturalmente distante dos antibióticos conhecidos, com atividade contra patógenos resistentes.'
    ],
    connection: 'Nos outros três, alguém CONSTRUIU o grafo para modelar o problema. Aqui ele **já existe** na natureza: a questão não é construir o grafo, é escolher o algoritmo que percorre a estrutura para aprender dela.',
    limit: 'A triagem é computacional: aponta candidatos, não aprova medicamentos. A halicina passou por testes em cultura e em camundongos; eficácia e segurança em humanos exigem ensaios clínicos.'
  },
  {
    id: 'artigos-sintese',
    type: 'compare',
    minutes: 2,
    eyebrow: 'Fechando os quatro',
    title: 'Mesma estrutura, quatro perguntas diferentes',
    columns: [
      {
        title: '1959 · logística',
        description: 'vértice = posto, aresta = trecho',
        items: ['Pergunta: em que ordem visitar?', 'Ferramenta: heurística (é NP-difícil)', 'Saída: uma rota por caminhão']
      },
      {
        title: '1982 · compilador',
        description: 'vértice = variável, aresta = conflito',
        items: ['Pergunta: cabe em k registradores?', 'Ferramenta: coloração', 'Saída: uma atribuição (ou um spill)']
      },
      {
        title: '1999 · web',
        description: 'vértice = página, aresta = link',
        items: ['Pergunta: quem é importante?', 'Ferramenta: iteração sobre o dígrafo', 'Saída: uma ordenação']
      },
      {
        title: '2020 · química',
        description: 'vértice = átomo, aresta = ligação',
        items: ['Pergunta: esta molécula age?', 'Ferramenta: aprendizado sobre o grafo', 'Saída: uma previsão a testar']
      }
    ],
    note: {
      kind: 'key',
      title: 'O que os quatro têm em comum',
      text: 'Nenhum deles inventou um algoritmo novo de grafos. Os quatro souberam enxergar o problema como grafo — e aí puderam usar o que já existia. Modelar é a parte difícil.'
    }
  }
];
