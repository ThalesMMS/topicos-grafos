const alternatives = labels => labels.map((text, i) => ({ id: 'abcde'[i], text }));
export const QUESTOES = [
  {
    id: 'enade_dijkstra', source: 'ENADE 2021 · Ciência da Computação · Q34',
    question: 'Qual é a tabela depois de duas extrações?',
    statement: 'Origem D. A primeira iteração retira a origem. Na prova, −1 representa infinito.',
    images: ['enade-2021-q34'], pdf: 'enade-2021-computacao-prova.pdf', page: 43,
    alternatives: alternatives(['A:5 B:6 C:10 D:0 E:4 F:1 G:−1','A:5 B:9 C:−1 D:0 E:5 F:1 G:−1','A:5 B:9 C:−1 D:0 E:4 F:1 G:2','A:5 B:7 C:8 D:0 E:4 F:1 G:2','A:5 B:6 C:8 D:0 E:3 F:1 G:2']),
    answer: 'c', why: 'Extraia D: A=5, B=9, E=5, F=1. Extraia F: E=min(5,1+3)=4 e G=1+1=2. C continua infinito. A terceira extração seria G, de custo 2; as distâncias ainda são estimativas nos vértices não finalizados.',
    solution: 'D, depois F: relaxar é comparar e atualizar',
  },
  {
    id: 'enade_ospf', source: 'ENADE 2023 · Engenharia de Computação · Q11',
    question: 'Quais afirmações descrevem o OSPF da questão?',
    statement: 'Use o enunciado original no telão: I trata de saltos; II, da cópia do grafo; III, de execução centralizada; IV, da troca de informações.',
    images: ['enade-2023-q11'], pdf: 'enade-2023-engenharia-prova.pdf', page: 15,
    alternatives: alternatives(['I e III.','II e III.','II e IV.','I, II e IV.','I, III e IV.']),
    answer:'c', solution:'Cada origem calcula sua própria árvore de rotas',
    why:'I é falsa: o objetivo é somar custos, e não contar conexões. II é verdadeira: cada roteador mantém sua base. III é falsa: cada roteador executa o cálculo a partir de si. IV é verdadeira: a troca de estados de enlace atualiza as bases. Assim, II e IV.',
  },
  {
    id:'poscomp_floyd', source:'POSCOMP 2014 · Q37 · página impressa 10',
    question:'Qual algoritmo calcula caminhos mínimos entre todos os pares?',
    statement:'Assinale o algoritmo destinado ao problema de todos os pares de vértices.',
    images:['poscomp-2014-q37'], pdf:'poscomp-2014-prova-sem-marcacoes.pdf',page:12,
    alternatives:alternatives(['Bellman-Ford.','Floyd-Warshall.','Dijkstra.','Kruskal.','Prim.']),
    answer:'b', solution:'Todos os pares: guardar uma matriz de distâncias',
    why:'Floyd–Warshall considera cada vértice como intermediário e atualiza todos os pares. Bellman–Ford e Dijkstra são algoritmos de uma origem; podem ser repetidos para resolver todos os pares, mas não é essa a formulação pedida. Prim e Kruskal minimizam o custo total de uma árvore geradora.',
  },
  {
    id:'poscomp_familias',source:'POSCOMP 2012 · Q35 · página impressa 12',
    question:'Associe cada algoritmo ao mecanismo que ele utiliza',
    statement:'I: topológica; II: Prim; III: Dijkstra; IV: CFC; V: Kruskal. A: DFS e transposto; B: ordenar arestas sem ciclos; C: DFS em DAG; D: menor aresta; E: menor distância acumulada.',
    images:['poscomp-2012-q35'],pdf:'poscomp-2012-prova-sem-marcacoes.pdf',page:14,
    alternatives:alternatives(['I-A, II-B, III-C, IV-D, V-E.','I-C, II-D, III-E, IV-A, V-B.','I-C, II-E, III-B, IV-A, V-D.','I-D, II-B, III-A, IV-C, V-E.','I-D, II-E, III-A, IV-B, V-C.']),
    answer:'b',solution:'Reconheça o mecanismo, não só o nome',
    why:'I–C: DAG e ordem de término. II–D: menor aresta cruzando o corte. III–E: menor custo acumulado. IV–A: duas DFS e grafo transposto, como Kosaraju. V–B: arestas ordenadas e prevenção de ciclos. B também consta no gabarito provisório da SBC; o arquivo disponível está identificado como provisório.',
  },
  {
    id:'enade_gulosa', source:'ENADE 2023 · Engenharia de Computação · Q32',
    question:'Qual rota a busca gulosa local escolhe?',
    statement:'Manaus → São Paulo. Em cada cidade, escolha o vizinho com menor estimativa h até São Paulo. Consulte o grafo e a tabela originais.',
    images:['enade-2023-q32-grafo','enade-2023-q32-alternativas'],pdf:'enade-2023-engenharia-prova.pdf',page:34,
    alternatives:alternatives(['Manaus → Macapá → São Paulo','Manaus → Porto Velho → Cuiabá → Goiânia → São Paulo','Manaus → Porto Velho → Palmas → Goiânia → São Paulo','Manaus → Macapá → Belém → Palmas → Goiânia → São Paulo','Manaus → Macapá → Belém → Palmas → P. Velho → Cuiabá → Goiânia → São Paulo']),
    answer:'b',solution:'A ligação existe; a regra gulosa escolhe outra rota',
    why:'Porto Velho tem h=2464, menor que Macapá (2665). Depois, Cuiabá tem h=1326, menor que Palmas (1489). Seguem Goiânia (809) e São Paulo (0). A rota via Macapá existe, mas perde na primeira comparação. A tabela informa estimativas ao destino, não pesos dos trechos: não permite provar qual rota tem menor custo real.',
  },
];
export const polls = Object.fromEntries(QUESTOES.map(q => [q.id, {
  type:'single', question:`${q.source} — ${q.statement} ${q.question}`,
  options:q.alternatives.map(a=>({id:a.id,label:`${a.id.toUpperCase()}) ${a.text}`}))
}]));
export const pergunta = id => {
  const q=QUESTOES.find(q=>q.id===id);
  if(!q) throw new Error(`Questão ausente: ${id}`);
  return {...q,id:id+'-pergunta',type:'question',poll:id,original:true,minutes:3};
};
export const resposta = id => {
  const q=QUESTOES.find(q=>q.id===id);
  if(!q) throw new Error(`Questão ausente: ${id}`);
  return {...q,id:id+'-resposta',type:'question',poll:id,reveal:true,images:undefined,question:q.solution,statement:undefined,answerLabel:'Resolução comentada',minutes:2};
};
