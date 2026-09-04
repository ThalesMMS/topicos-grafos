/** Explicações curtas para os algoritmos e critérios do acervo anterior. */
export const complementos = {
  conectividade: [{
    id: 'equivalencia-criterios', type: 'concept', title: 'Equivalência exige três propriedades',
    points: [
      'Reflexiva: todo elemento se relaciona consigo mesmo.',
      'Simétrica: se x se relaciona com y, então y se relaciona com x.',
      'Transitiva: xRy e yRz implicam xRz. Arestas diretas não bastam para garantir isso.',
      'Alcançabilidade em grafo não dirigido é equivalência; suas classes são as componentes.'
    ]
  }],
  caminhos: [{
    id: 'bellman-ford-resumo', type: 'steps', title: 'Bellman–Ford: permitir pesos negativos',
    items: [
      {title:'Inicializar',text:'Distância zero na origem e infinito nas demais.'},
      {title:'Relaxar todas as arestas',text:'Repetir até n−1 passagens. Parar antes se nenhuma distância mudar.'},
      {title:'Verificar mais uma passagem',text:'Se ainda há melhora, existe ciclo negativo alcançável da origem.'}
    ],
    description:'Cada passagem propaga caminhos com mais uma aresta. Sem ciclo negativo relevante, um caminho mínimo simples usa no máximo n−1 arestas. Custo O(nm).',
    cobertura:['bellman-ford-execucao']
  }, {
    id:'floyd-warshall-resumo',type:'code',title:'Floyd–Warshall: todos os pares',
    lines:['D[i][i] = 0; demais: peso do arco ou ∞','para cada intermediário k:','  para cada origem i e destino j:','    D[i][j] = min(D[i][j], D[i][k] + D[k][j])'],
    description:'Inicializar com o menor peso disponível, preservando laços negativos. A cada k, permitir mais um intermediário. Tempo O(n³), espaço O(n²).',
    note:{kind:'warn',title:'Ciclo negativo',text:'Uma diagonal negativa identifica ciclo negativo. Só os pares que podem passar por ele e alcançar o destino ficam sem mínimo finito.'}
  }, {
    id:'heuristicas-resumo',type:'compare',title:'Gulosa, Dijkstra e A*: prioridades diferentes',
    columns:[
      {title:'Gulosa',items:['Prioridade h(v): estimativa restante.','Ignora custo acumulado; não garante menor custo.','Na questão de rotas, a escolha é local entre vizinhos.']},
      {title:'Dijkstra',items:['Prioridade g(v): custo acumulado.','Relaxa arestas e atualiza estimativas.','Pesos não negativos garantem a finalização.']},
      {title:'A*',items:['Prioridade g(v)+h(v).','h admissível não superestima.','Busca em grafo: usar h consistente ou reabrir nós quando necessário.']}
    ],
    note:{kind:'key',title:'Heurística zero',text:'Com h=0, A* usa a prioridade de Dijkstra. A busca gulosa geral mantém uma fronteira; não deve ser confundida com toda caminhada gulosa local.'}
  }],
  digrafos:[{
    id:'dfs-kosaraju-resumo',type:'steps',title:'DFS: ordem topológica e Kosaraju',
    items:[
      {title:'Ordenar um DAG com DFS',text:'Emitir os vértices na ordem inversa de término. Uma aresta de retorno denuncia ciclo e invalida a ordenação.'},
      {title:'Kosaraju: primeira DFS',text:'Percorrer todo o grafo original e guardar a ordem de término.'},
      {title:'Kosaraju: segunda DFS',text:'No transposto, visitar em término decrescente da primeira busca. Cada nova árvore identifica uma CFC.'}
    ],description:'Ambos custam O(n+m) com listas. Kahn chega à ordem topológica removendo graus de entrada zero; Kosaraju resolve outro problema, as componentes fortes.'
  }],
  percursos:[{
    id:'ore-fecho-resumo',type:'concept',title:'Ore e o fecho de Bondy–Chvátal',
    points:[
      'Em grafo simples não dirigido com n≥3, Ore garante ciclo hamiltoniano se d(u)+d(v)≥n para todo par não adjacente.',
      'No fecho, adicionar arestas entre pares não adjacentes com soma de graus ≥n, repetindo enquanto possível.',
      'O grafo é hamiltoniano se e somente se seu fecho é hamiltoniano.',
      'Fecho completo certifica Hamilton. Fecho incompleto não decide: C₅ já tem ciclo hamiltoniano.'
    ],description:'São critérios e uma transformação que preserva hamiltonicidade; não constituem um algoritmo eficiente geral de decisão.'
  }],
  planaridade:[{
    id:'welsh-powell-resumo',type:'steps',title:'Welsh–Powell: ordenar antes de colorir',
    items:[
      {title:'Ordenar',text:'Colocar vértices por grau decrescente; fixar uma regra para empates.'},
      {title:'Preencher uma classe de cor',text:'Percorrer os ainda não coloridos e usar a mesma cor quando não houver vizinho já nessa classe.'},
      {title:'Repetir',text:'Abrir uma nova cor e repetir até colorir todos os vértices.'}
    ],description:'É uma heurística gulosa. Entrega coloração válida, mas o número de cores depende da ordem e pode superar χ(G).'
  }],
  fluxo:[{
    id:'fluxo-algoritmos-resumo',type:'compare',title:'Como escolher os caminhos aumentantes',
    columns:[
      {title:'Ford–Fulkerson',items:['Qualquer caminho na rede residual.','Aumentar pelo gargalo e atualizar reversas.','Capacidades inteiras: O(mF).']},
      {title:'Edmonds–Karp',items:['Usar BFS na residual.','Minimizar o número de arcos do aumentante.','Tempo O(nm²).']},
      {title:'Dinic',items:['BFS constrói o grafo de níveis.','Enviar fluxo bloqueante antes da próxima BFS.','Tempo geral O(n²m).']}
    ],description:'Os três mantêm capacidade e conservação. Dinic agrupa aumentos em fases; Edmonds–Karp faz nova BFS a cada aumento.'
  },{
    id:'emparelhamento-resumo',type:'compare',title:'Emparelhar, atribuir e transportar',
    columns:[
      {title:'Edmonds / blossom',items:['Emparelhamento máximo em grafo geral.','Procurar caminhos alternantes aumentantes.','Contrair ciclos ímpares e expandir ao reconstruir.']},
      {title:'Método Húngaro',items:['Atribuição um a um com custo mínimo.','Manter custos reduzidos e emparelhar em arestas de custo reduzido zero.','Ajustar potenciais até completar a atribuição.']},
      {title:'Transporte',items:['Ofertas e demandas podem exceder uma unidade.','Modelar capacidades e custos por unidade.','Resolver como fluxo de custo mínimo.']}
    ],description:'Berge: um emparelhamento é máximo se e somente se não possui caminho aumentante. Atribuição ponderada e fluxo máximo têm objetivos distintos.'
  }]
};
