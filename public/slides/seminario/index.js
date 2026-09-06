import * as G from '../equilibrada/modelos.js';
import * as A from '../equilibrada/simulacoes.js';
import * as M from './modelos.js';
import { pergunta, resposta, polls } from './questoes.js';
import { artigos } from './artigos.js';
import * as ALG from './algoritmos.js';
import * as P from './passos.js';

/** Insere slides logo depois do slide de id `alvo`; estoura se o id sumir. */
function inserir(bloco, alvo, novos) {
  const i = bloco.findIndex(s => s.id === alvo);
  if (i < 0) throw new Error('id não encontrado no bloco: ' + alvo);
  return [...bloco.slice(0, i + 1), ...novos, ...bloco.slice(i + 1)];
}
export { polls };
const step=(title,text)=>({title,text});
const d=A.dijkstra(M.provaDijkstra,'D');
const traceD=(i)=>({id:`prova-dijkstra-passo-${i+1}`,type:'trace',minutes:1,
  eyebrow:`Q34 · resolução no quadro · ${i+1}/2`,title:i===0?'Retirar D; registrar quatro estimativas':'Retirar F; melhorar E e descobrir G',
  description:i===0?'D também liga diretamente a E, com peso 5. Ainda não descobrimos C nem G.':'F tem o menor custo aberto: 1. Compare 1+3 com o 5 de E; depois registre 1+1 em G.',
  graph:M.destacar(M.provaDijkstra,{nodes:Object.fromEntries(d.frames.slice(0,i+1).map(f=>[f.u,'done'])),edges:i===0?[['D','A'],['D','B'],['D','E'],['D','F']]:[['F','E'],['F','G']],notes:Object.fromEntries(Object.entries(d.frames[i].distance).map(([v,c])=>[v,A.mostrar(c)])),caption:'Traços verdes: arcos relaxados neste passo. Anotações: estimativas atuais.'}),
  headers:['vértice','antes','depois'],rows:['A','B','C','D','E','F','G'].map(v=>[v,i===0?(v==='D'?'0':'∞'):A.mostrar(d.frames[i-1].distance[v]),A.mostrar(d.frames[i].distance[v])])});

const bloco1=[
  {id:'abertura',type:'cover',minutes:2,
    title:'Seminário de',highlight:'Grafos',
    names:['Antonio Neto','Thales Matheus','Ji Xinyi','Lucas Emerick']},
  {id:'agenda',type:'compare',minutes:1,eyebrow:'Índice',title:'Quatro partes',
    columns:[
      {title:'Parte 1 · Modelagem e busca',items:[
        'G = (V, E): famílias, matrizes de incidência e adjacência',
        'BFS: fila, níveis e árvore de caminhos mínimos',
        'DFS: pilha, tempos de descoberta e término',
        'Passeio, trajeto, caminho e componentes conexos',
        'Dijkstra: relaxamento e o invariante do menor aberto']},
      {title:'Parte 2 · Caminhos mínimos',items:[
        'Raio, diâmetro e excentricidade a partir da BFS',
        'Dijkstra em rede: uma árvore por origem',
        'Peso negativo: onde a garantia quebra',
        'Bellman–Ford: passagens e ciclo negativo',
        'Floyd–Warshall: todos os pares, um intermediário por vez']},
      {title:'Parte 3 · Árvores, ordem e fluxo',items:[
        'Árvore geradora e a propriedade do corte seguro',
        'Kruskal com união-busca · Prim por corte',
        'Ordenação topológica e fechos transitivos',
        'Kosaraju: componentes fortemente conexos',
        'Euler e Hamilton · Ford–Fulkerson e corte mínimo']},
      {title:'Parte 4 · Heurística e aplicações',items:[
        'Gulosa, Dijkstra e A*: qual número decide',
        'Coloração: limites de χ e o guloso dependente da ordem',
        'PageRank: a web como dígrafo',
        'Quatro artigos: logística, compiladores, web e química']}
    ]},
  // Este slide abre o seminário: não pode citar algoritmo nenhum, porque
  // nenhum foi apresentado ainda. A tabela que liga pergunta a algoritmo está
  // no fim da parte 2, quando BFS, Dijkstra e os demais já existem.
  {id:'modelo',type:'concept',minutes:2,eyebrow:'01 · Antes de executar',
    title:'O que vira vértice e o que vira aresta',graph:G.rotas,
    description:'Um grafo é um par de conjuntos: vértices e arestas. Modelar é decidir o que cada um representa — e essa decisão vem antes de qualquer conta.',
    points:[
      '**Vértice**: o objeto sobre o qual a pergunta fala. Em rotas, a cidade — não a estrada.',
      '**Aresta**: a relação que a pergunta usa. Aqui, existe ligação direta entre dois pontos.',
      '**Peso**: só entra se a pergunta somar alguma coisa — distância, tempo, custo, capacidade.',
      '**Direção**: se a relação vale nos dois sentidos, é aresta; se vale num só, é arco.'
    ],
    note:{kind:'key',title:'A modelagem já decide metade',
      text:'Escolher o vértice errado inviabiliza o resto. As pontes de Königsberg não são vértices: são as arestas, e é por isso que o problema tem resposta.'}},
  {id:'representacao',type:'code',minutes:2,title:'A representação aparece no custo do algoritmo',graph:G.rotas,lines:['S: (A,2), (B,5)','A: (B,1), (T,7)','B: (T,3)','T: []'],description:'Listas de adjacência: espaço O(n+m), percorrer vizinhos custa O(grau de saída). Matriz: espaço O(n²), testar um arco custa O(1).',note:{kind:'key',title:'Como ler o exemplo',text:'S→A e A→B existem; seus reversos não foram declarados. n=4 e m=5.'}},
  {id:'bfs-regra',type:'code',minutes:2,title:'BFS: descobrir por camadas',lines:['d[s] = 0; demais d[v] = ∞','fila = [s]','enquanto fila não vazia:','  u = retirar do início','  para cada vizinho v ainda não descoberto:','    d[v] = d[u]+1; pai[v] = u','    inserir v no fim da fila'],description:'Marcar ao enfileirar evita duplicatas. As distâncias contam arestas. Com listas, tempo O(n+m).'},
  {id:'bfs-quadro',type:'trace',minutes:2,title:'A fila conta a história da busca',graph:M.destacar(G.rede,{edges:[['A','B'],['A','C'],['B','D'],['D','E']],notes:{A:'0',B:'1',C:'1',D:'2',E:'3'},caption:'Vizinhos em ordem alfabética. C encontra D já descoberto.'}),headers:['retira','fila depois','novos'],rows:A.bfs(G.rede,'A').frames.map(f=>[f.u,f.queue.join(', ')||'vazia',f.discovered.join(', ')||'nenhum']),description:'A árvore de pais recupera A–B–D–E. Três arestas: nenhuma rota com menos arestas chega a E.'},
  {id:'dfs-regra',type:'steps',minutes:2,title:'DFS: ir fundo e registrar a volta',graph:G.dag,items:[step('Entrar','Marcar o vértice e explorar um vizinho ainda não visitado.'),step('Voltar','Quando não há mais vizinhos novos, registrar o término.'),step('Usar a ordem','Em um DAG, inverter a ordem de término dá uma ordem topológica.')],description:'A pilha guarda o caminho de exploração. DFS não garante caminho mínimo. Tempo O(n+m) com listas.'},
  {id:'dijkstra-invariante',type:'code',minutes:2,title:'Por que o menor aberto pode ser finalizado?',lines:['extrair u com menor d[u] ainda aberto','para cada arco u→v:','  candidato = d[u] + peso(u,v)','  se candidato < d[v]:','    d[v] = candidato; pai[v] = u','    atualizar a prioridade de v'],description:'Com pesos não negativos, passar por um vértice ainda mais distante não produz um caminho menor até u. Essa hipótese permite finalizar u.',note:{kind:'key',title:'Implementação',text:'Heap binário + listas: O((n+m) log n). Varredura dos vértices: O(n²+m). Relaxar não significa melhorar sempre.'}},
  // A questão vem DEPOIS do algoritmo e do passo a passo dele: a sala precisa
  // ter visto Dijkstra rodar antes de ser cobrada num trace de Dijkstra.
  pergunta('enade_dijkstra'),traceD(0),traceD(1),resposta('enade_dijkstra'),
];
const bloco2=[
  {id:'ospf-modelo',type:'concept',minutes:2,eyebrow:'02 · A mesma ideia em redes',title:'Cada roteador é uma origem diferente',graph:G.rotas,description:'No modelo do enunciado, o custo é atraso. Compartilhar a topologia permite que cada roteador execute Dijkstra a partir de si.',points:['S–A–T: duas conexões, custo 9.','S–A–B–T: três conexões, custo 6.','A árvore de caminhos mínimos depende da origem.'],note:{kind:'tip',title:'Leitura da prova',text:'A questão simplifica o sistema autônomo. Em OSPF real, a organização em áreas delimita o escopo das bases de estado de enlace.'}},
  pergunta('enade_ospf'),resposta('enade_ospf'),
  {id:'peso-negativo',type:'concept',minutes:2,title:'Mude uma hipótese; a garantia desaparece',graph:M.negativo,description:'Dijkstra finalizaria A com custo 2 antes de B. Mas S→B→A custa 5−4=1. A prova de correção não vale com esse arco negativo.',note:{kind:'check',title:'Diagnóstico',text:'Não basta decorar o algoritmo. Verifique a origem, o objetivo, o sentido das arestas e os sinais dos pesos.'}},
  {id:'bellman-ford',type:'steps',minutes:2,title:'Bellman–Ford: propagar melhorias por passagens',items:[step('Inicializar','Origem com zero; demais com infinito.'),step('Relaxar todas as arestas','Repetir até n−1 passagens. Cada uma admite caminhos com mais uma aresta.'),step('Detectar ciclo negativo','Uma melhora na passagem extra denuncia ciclo negativo alcançável.')],description:'O(nm). Sem ciclo negativo relevante, um caminho mínimo pode ser simples, com no máximo n−1 arestas.'},
  {id:'floyd-regra',type:'code',minutes:2,title:'Floyd–Warshall: permitir um intermediário por vez',lines:['D[i][j] = peso(i,j) ou ∞; D[i][i] = 0','para k de 1 até n:','  para i de 1 até n:','    para j de 1 até n:','      D[i][j] = min(D[i][j], D[i][k]+D[k][j])'],description:'Após a rodada k, os caminhos podem usar os primeiros k vértices como intermediários. Tempo O(n³), espaço O(n²).',note:{kind:'warn',title:'Condição',text:'Admite pesos negativos. Ciclos negativos relevantes impedem um mínimo finito; aparecem como diagonal negativa. Preserve laços negativos na inicialização.'}},
  {id:'floyd-quadro',type:'trace',minutes:2,title:'Permitir B muda o par A→C',graph:M.destacar(M.floyd,{edges:[['A','B'],['B','C']],caption:'Caminho direto custa 9. Via B: 2+3=5.'}),headers:['par','antes de B','via B','depois'],rows:[['A→C','9','2+3=5','5'],['A→B','2','2+0=2','2'],['B→C','3','0+3=3','3']],description:'É uma atualização de matriz, não uma extração de fila. O laço de k fica por fora porque cada rodada precisa dos resultados completos da rodada anterior.'},
  pergunta('poscomp_floyd'),resposta('poscomp_floyd'),
  {id:'escolha-caminhos',type:'table',minutes:2,title:'A saída pedida decide a ferramenta',headers:['Entrada / saída','Algoritmo','Custo usual'],rows:[['Uma origem, menos arestas','BFS','O(n+m)'],['Uma origem, pesos ≥0','Dijkstra + heap','O((n+m) log n)'],['Uma origem, pesos negativos','Bellman–Ford','O(nm)'],['Todos os pares','Floyd–Warshall','O(n³)']],note:{kind:'key',title:'Conexão com logística',text:'Uma matriz de distâncias entre depósitos e clientes pode alimentar outro problema: decidir a ordem das visitas.'}},
];
const bloco3=[
  {id:'agm-intro',type:'section',minutes:1,eyebrow:'03 · Reconhecer mecanismos',title:'Uma rede inteira custa quanto?',description:'A próxima questão compara algoritmos parecidos por fora, mas com objetivos diferentes.'},
  {id:'agm-versus-caminho',type:'compare',minutes:2,title:'AGM e caminhos mínimos minimizam coisas diferentes',columns:[{title:'Árvore geradora mínima',items:['Conecta todos os vértices.','Minimiza a soma das arestas da árvore.','Grafo não dirigido, conexo e ponderado.']},{title:'Árvore de caminhos mínimos',items:['Parte de uma origem escolhida.','Minimiza a distância da origem a cada vértice.','Não minimiza o custo total da infraestrutura.']}],description:'Em um grafo desconexo, Prim/Kruskal podem ser usados para obter uma floresta geradora mínima.'},
  {id:'kruskal-quadro',type:'trace',minutes:3,title:'Kruskal: aceitar só o que une componentes',graph:M.destacar(G.ponderado,{edges:[['A','B'],['A','D'],['C','E'],['B','E']],caption:'AB=2, AD=3, CE=3, BE=5. Total 13; quatro arestas para cinco vértices.'}),headers:['aresta','peso','decisão'],rows:[['A–B','2','aceitar'],['A–D','3','aceitar'],['C–E','3','aceitar'],['B–D','4','rejeitar: forma ciclo'],['B–E','5','aceitar: conecta os grupos']],description:'Ordenar custa O(m log m). O teste de ciclo pode usar Union–Find.'},
  {id:'prim-quadro',type:'trace',minutes:2,title:'Prim: crescer a partir de um conjunto',graph:M.destacar(G.ponderado,{edges:[['A','B'],['A','D'],['B','E'],['E','C']],caption:'Mesma AGM, outra ordem de construção. Começar em A.'}),headers:['dentro','menor aresta que sai','custo total'],rows:[['{A}','A–B: 2','2'],['{A,B}','A–D: 3','5'],['{A,B,D}','B–E: 5','10'],['{A,B,D,E}','E–C: 3','13']],description:'Escolher a menor aresta que cruza o corte. Não escolher a menor distância acumulada desde A.'},
  {id:'union-find',type:'steps',minutes:2,title:'Union–Find: a pergunta é “já estão juntos?”',items:[step('find(u) e find(v)','Encontrar o representante de cada componente.'),step('Representantes iguais','A aresta fecharia um ciclo: rejeitar.'),step('Representantes diferentes','Aceitar a aresta e unir os conjuntos.')],description:'Compressão de caminhos e união por tamanho/rank tornam as operações quase constantes amortizadas. O custo dominante de Kruskal é ordenar.'},
  {id:'topologica',type:'trace',minutes:3,title:'Dependências: emitir depois de resolver os sucessores',graph:G.dag,headers:['DFS a partir de 1','ordem'],rows:[['Descoberta (vizinhos crescentes)','1, 2, 4, 5, 3'],['Término','5, 4, 2, 3, 1'],['Término invertido','1, 3, 2, 4, 5']],description:'Cada arco aponta para um vértice posterior na ordem final. Uma aresta de retorno na DFS detecta ciclo e impede a ordenação.',note:{kind:'check',title:'Verifique',text:'2 e 3 podem trocar de posição. Uma ordenação topológica não precisa ser única.'}},
  {id:'kosaraju',type:'steps',minutes:3,title:'Kosaraju: duas buscas separam componentes fortes',graph:G.dirigido,items:[step('Primeira DFS no original','Guardar término: d, c, b, a, começando por a.'),step('Inverter todos os arcos','No transposto, visitar a, b, c, d por término decrescente.'),step('Cada nova árvore é uma CFC','Componentes: {a}, {b,c}, {d}. Custo O(n+m).')],description:'b e c alcançam um ao outro. a chega até d, mas d não retorna a a.'},
  pergunta('poscomp_familias'),resposta('poscomp_familias'),
  {id:'fila-nao-e-bfs',type:'compare',minutes:1,title:'Fila FIFO e fila de prioridade têm regras distintas',columns:[{title:'BFS',items:['Primeiro a entrar, primeiro a sair.','Camadas por quantidade de arestas.']},{title:'Prim / Dijkstra',items:['Prim: menor aresta cruzando o corte.','Dijkstra: menor distância estimada.']}],description:'A Q35 usa “busca em largura” de forma ampla. Na implementação, Prim e Dijkstra usam prioridades; não são a BFS comum com fila FIFO.'},
];
const bloco4=[
  {id:'heuristicas-intro',type:'section',minutes:.5,eyebrow:'04 · Rotas, pesquisa e discussão',title:'Quando estimar ajuda a decidir',description:'Do exercício da transportadora às heurísticas aprendidas para logística.'},
  {id:'heuristicas-prioridade',type:'compare',minutes:1,title:'Qual número decide o próximo passo?',columns:[{title:'Gulosa',items:['h(v): estimativa restante.','A Q32 escolhe localmente entre vizinhos.']},{title:'Dijkstra',items:['g(v): custo acumulado.','Menor custo aberto.']},{title:'A*',items:['g(v)+h(v).','Custo até aqui + estimativa restante.']}]},
  pergunta('enade_gulosa'),
  {id:'gulosa-quadro',type:'trace',minutes:2,title:'Quatro escolhas, sempre olhando h',graph:M.destacar(M.cidades,{edges:[['Manaus','P. Velho'],['P. Velho','Cuiabá'],['Cuiabá','Goiânia'],['Goiânia','S. Paulo']],caption:M.cidades.caption}),headers:['em','comparar estimativas','ir para'],rows:[['Manaus','2464 < 2665','P. Velho'],['P. Velho','1326 < 1489 < 2693','Cuiabá'],['Cuiabá','809 < 2464','Goiânia'],['Goiânia','0 < 1326 < 1489','São Paulo']],description:'A escolha segue a regra local do enunciado. Nenhum custo de trecho foi somado.'},
  resposta('enade_gulosa'),
  {id:'astar-adicional',type:'steps',minutes:2,eyebrow:'Tópico adicional · busca informada',title:'A*: usar uma estimativa sem perder a garantia',items:[step('Ordenar por f=g+h','Manter o custo real g e a estimativa h separados.'),step('Escolher uma heurística admissível','h nunca pode superestimar o custo mínimo restante.'),step('Na busca em grafo','Usar h consistente ou permitir reabrir vértices melhorados.')],description:'Com h=0, a prioridade coincide com a de Dijkstra. Para parar com garantia, retirar o objetivo da fronteira; não parar na primeira descoberta.'},
];
// Todo algoritmo é EXECUTADO na frente da turma: passo a passo logo depois
// da regra. Os passos vêm de rodar o algoritmo (passos.js), nunca da mão.
let b1 = inserir(inserir(inserir(bloco1,
  'representacao', ALG.baseFundamentos),
  'modelo', ALG.baseConectividade),
  'dfs-regra', ALG.detalheDfs);
b1 = inserir(b1, 'bfs-quadro', P.passosBfs);
b1 = inserir(b1, 'alg-dfs-execucao', P.passosDfs);
b1 = inserir(b1, 'dijkstra-invariante', P.passosDijkstra);
let b2 = inserir(bloco2, 'ospf-modelo', ALG.metricas);
b2 = inserir(b2, 'bellman-ford', P.passosBellman);
let b3 = inserir(inserir(inserir(bloco3,
  'agm-intro', ALG.teoriaArvores),
  'topologica', ALG.alcance),
  'fila-nao-e-bfs', [...ALG.eulerHamilton, ...ALG.fluxoMaximo]);
b3 = inserir(b3, 'kruskal-quadro', P.passosKruskal);
b3 = inserir(b3, 'prim-quadro', P.passosPrim);
b3 = inserir(b3, 'topologica', P.passosKahn);
// Coloração entra ANTES dos artigos: ela é o que dá sentido ao de Chaitin,
// em que alocar registradores é literalmente colorir um grafo.
let b4 = inserir(inserir(bloco4,
  'astar-adicional', ALG.coloracao),
  'alg-ordem-cores', artigos);
b4 = inserir(b4, 'alg-guloso-cores', P.passosCores);
/**
 * Traces-resumo que o passo a passo tornou redundantes.
 *
 * Cada um destes era UM slide contando o que o algoritmo faz. Agora existe a
 * execução completa, passo por passo, do mesmo algoritmo — manter os dois é
 * repetir o conteúdo e gastar o tempo que o seminário não tem.
 */
const SUPERADOS = new Set([
  'bfs-quadro',        // 6 passos de BFS
  'alg-dfs-execucao',  // 11 passos de DFS
  'kruskal-quadro',    // 6 passos de Kruskal
  'prim-quadro',       // 5 passos de Prim
  'topologica',        // 6 passos de Kahn
  'alg-guloso-cores'   // 5 passos de coloração
]);

/**
 * Orçamento por tipo de slide, em minutos. É a ÚNICA fonte da duração:
 * os minutos escritos à mão em cada slide são substituídos por estes.
 *
 * O seminário tem 1h20. Mexer aqui é como esticar ou encolher a apresentação
 * inteira sem tirar conteúdo.
 */
const ORCAMENTO = {
  passo: 0.25,       // 15 segundos: só muda o estado, o desenho já é conhecido
  cover: 1,
  section: 0.5,
  compare: 0.75,
  table: 1,
  list: 1,
  concept: 1,
  code: 1,
  definition: 1,
  trace: 1,
  steps: 1.25,
  article: 2,
  votacao: 2.5,      // ler o enunciado da prova, pensar e votar
  gabarito: 1.25     // resolução comentada
};

const orcar = slide => {
  if (/^p-/.test(slide.id)) return ORCAMENTO.passo;
  if (slide.type === 'question') return slide.reveal ? ORCAMENTO.gabarito : ORCAMENTO.votacao;
  return ORCAMENTO[slide.type] ?? 1;
};

const aplicar = bloco => bloco
  .filter(s => !SUPERADOS.has(s.id))
  .map(s => ({ ...s, minutes: orcar(s) }));

export const MODULOS=[b1,b2,b3,b4].map(aplicar).map((slides,i)=>({id:`bloco-${i+1}`,minutes:slides.reduce((t,s)=>t+s.minutes,0),slides}));
export const DURACAO_ESTIMADA=MODULOS.reduce((t,m)=>t+m.minutes,0);
export const slides=MODULOS.flatMap((m,i)=>m.slides.map(s=>({...s,module:m.id,parte:i+1})));
