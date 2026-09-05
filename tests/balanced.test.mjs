import assert from 'node:assert/strict';
import test from 'node:test';
import { CONFIG } from '../public/presentation.config.js';
import { MODULOS, DURACAO_ESTIMADA } from '../public/slides/equilibrada/index.js';
import { QUESTOES, pergunta, resposta } from '../public/slides/equilibrada/perguntas.js';
import { activityForSlide } from '../public/assets/activity.js';
import { slideMarkup } from '../public/assets/render.js';
import * as G from '../public/slides/equilibrada/modelos.js';
import * as A from '../public/slides/equilibrada/simulacoes.js';

const graph = (ids, edges, directed=false) => ({nodes:ids.map(id=>({id})),edges:edges.map(([from,to,weight=1])=>({from,to,weight})),directed});
const main = id => CONFIG.slides.find(s=>s.id===id);
// Oráculo independente por programação dinâmica, não pela implementação de Dijkstra.
function allPairs(g) {
  const ids=g.nodes.map(n=>n.id), n=ids.length;
  const d=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?0:Infinity));
  for(const e of g.edges){const i=ids.indexOf(e.from),j=ids.indexOf(e.to); d[i][j]=Math.min(d[i][j],e.weight??1); if(!g.directed)d[j][i]=d[i][j];}
  for(let k=0;k<n;k++)for(let i=0;i<n;i++)for(let j=0;j<n;j++)d[i][j]=Math.min(d[i][j],d[i][k]+d[k][j]);
  return {ids,d};
}
function minCut(g) {
  const middle=g.nodes.map(n=>n.id).filter(v=>v!=='S'&&v!=='T');
  return Math.min(...Array.from({length:2**middle.length},(_,mask)=>{
    const side=new Set(['S',...middle.filter((_,i)=>mask&(1<<i))]);
    return g.edges.filter(e=>side.has(e.from)&&!side.has(e.to)).reduce((s,e)=>s+e.weight,0);
  }));
}
function assertViable(g,flows,value){
  const net=Object.fromEntries(g.nodes.map(n=>[n.id,0]));
  g.edges.forEach((e,i)=>{assert.ok(flows[i]>=0&&flows[i]<=e.weight);net[e.from]+=flows[i];net[e.to]-=flows[i];});
  for(const [v,balance]of Object.entries(net))assert.equal(balance,v==='S'?value:v==='T'?-value:0,`conservação em ${v}`);
}

test('roteiro principal tem IDs únicos e mantém abertura/fechamento',()=>{
  const ids=CONFIG.slides.map(s=>s.id); assert.equal(new Set(ids).size,ids.length);
  assert.equal(CONFIG.slides[0].type,'cover'); assert.equal(CONFIG.slides.at(-1).type,'closing');
  assert.ok(CONFIG.slides.length<=85,'não inflar o roteiro com apêndices inteiros');
});
test('oito módulos e orçamento explícito para uma revisão de 85 minutos',()=>{
  assert.equal(MODULOS.length,8);assert.equal(DURACAO_ESTIMADA,85);
  const total=CONFIG.slides.reduce((sum,s)=>sum+(s.minutes||0),0);
  assert.equal(total,DURACAO_ESTIMADA);
  assert.equal(MODULOS.find(m=>m.id==='fluxo').minutes,10);
  assert.ok(MODULOS.find(m=>m.id==='fundamentos').minutes>=10);
  assert.ok(MODULOS.find(m=>m.id==='conectividade').minutes>=13);
  for(const m of MODULOS)assert.equal(m.slides.filter(s=>s.type==='section').length,1);
});
test('cobertura essencial está no deck carregado, não apenas no apêndice',()=>{
  const tags=new Set(CONFIG.slides.flatMap(s=>s.cobertura||[]));
  for(const topic of ['modelagem','grau','familias','isomorfismo','subgrafo','matriz-incidencia','matriz-adjacencia','lista-adjacencia','componentes','distancia','excentricidade','raio','diametro','ponte','articulacao','bfs','dfs','agm','prim','kruskal','dijkstra','fecho-direto','fecho-inverso','cfc','ordenacao-topologica','euler','hamilton','planaridade','faces','formula-euler','coloracao','rede-residual','ford-fulkerson','fluxo-maximo-corte-minimo'])assert.ok(tags.has(topic),topic);
});
test('cinco atividades em cinco domínios; alternativas sincronizadas e solução fora da votação',()=>{
  assert.equal(QUESTOES.length,5);assert.equal(new Set(QUESTOES.map(q=>q.module)).size,5);
  assert.equal(Object.keys(CONFIG.polls).length,10);
  for(const q of QUESTOES){
    const s=pergunta(q.id),r=resposta(q.id),poll=CONFIG.polls[s.poll];
    assert.equal(main(s.id).module,q.module);assert.match(s.source,/autoral/);
    assert.equal(activityForSlide(s),`poll:${s.poll}`);assert.equal(activityForSlide(r),'stage');
    assert.ok(s.alternatives.some(a=>a.id===q.answer));
    assert.deepEqual(s.alternatives.map(a=>a.text),poll.options.map(a=>a.label.slice(3)));
    assert.ok(poll.question.includes(q.statement));
    assert.equal(CONFIG.slides[CONFIG.slides.findIndex(x=>x.id===s.id)+1].id,r.id);
    assert.ok(!slideMarkup(r).includes('Gabarito oficial'));
  }
  assert.throws(()=>pergunta('inexistente'));
});
test('tabelas têm linhas retangulares e diagramas têm posições finitas',()=>{
  for(const s of CONFIG.slides){
    for(const row of s.rows||[])assert.equal(row.length,s.headers.length,s.id);
    for(const n of s.graph?.nodes||[]){assert.ok(Number.isFinite(n.x));assert.ok(Number.isFinite(n.y));}
    const html=slideMarkup(s,{polls:CONFIG.polls});assert.ok(!/undefined|NaN|Enquete não encontrada/.test(html),s.id);
  }
});
test('matrizes dos slides representam exatamente o quadrado',()=>{
  const ids=G.quadrado.nodes.map(n=>n.id);
  assert.deepEqual(main('incidencia').rows,ids.map(v=>[v,...G.quadrado.edges.map(e=>e.from===v||e.to===v?'1':'0')]));
  assert.deepEqual(main('adjacencia').rows,ids.map(u=>[u,...ids.map(v=>G.quadrado.edges.some(e=>e.from===u&&e.to===v||e.from===v&&e.to===u)?'1':'0')]));
});
test('BFS e métricas conferem com distâncias independentes',()=>{
  const oracle=allPairs(G.rede);
  for(let i=0;i<oracle.ids.length;i++)assert.deepEqual(oracle.ids.map(v=>A.bfs(G.rede,oracle.ids[i]).distance[v]),oracle.d[i]);
  assert.deepEqual(A.bfs(G.rede,'A').order,['A','B','C','D','E']);
  const ecc=oracle.d.map(r=>Math.max(...r));assert.deepEqual(ecc,[3,2,2,2,3]);
  assert.equal(Math.min(...ecc),2);assert.equal(Math.max(...ecc),3);
});
test('DFS gera floresta e tempos corretamente aninhados',()=>{
  const f=A.dfs(G.rede,'A');assert.deepEqual(f.order,['A','B','D','C','E']);
  assert.deepEqual(Object.values(f.discovery).concat(Object.values(f.finish)).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10]);
  for(const [v,p] of Object.entries(f.parent))if(p!==null){assert.ok(f.discovery[p]<f.discovery[v]);assert.ok(f.finish[v]<f.finish[p]);}
  const disconnected=graph(['a','b','c'],[['a','b']]);assert.equal(Object.values(A.dfs(disconnected,'a').parent).filter(v=>v===null).length,2);
  assert.equal(A.bfs(disconnected,'a').distance.c,Infinity);
});
test('Dijkstra melhora uma estimativa descoberta e confere em 30 grafos pequenos',()=>{
  const result=A.dijkstra(G.rotas,'S');assert.deepEqual(result.distance,{S:0,A:2,B:3,T:6});
  assert.equal(result.frames[0].distance.B,5);assert.equal(result.frames[1].distance.B,3);
  let seed=7;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};
  for(let k=0;k<30;k++){
    const ids=['a','b','c','d','e'],edges=[];
    for(const u of ids)for(const v of ids)if(u!==v&&random()<0.35)edges.push([u,v,Math.floor(random()*8)]);
    const g=graph(ids,edges,true),oracle=allPairs(g);
    for(let i=0;i<ids.length;i++)assert.deepEqual(ids.map(v=>A.dijkstra(g,ids[i]).distance[v]),oracle.d[i]);
  }
});
test('precondições recusam origem inexistente e pesos inválidos',()=>{
  assert.throws(()=>A.bfs(G.rede,'X'));assert.throws(()=>A.dijkstra(graph(['a','b'],[['a','b',-1]],true),'a'),/não negativos/);
  assert.throws(()=>A.adjacencia(graph(['a'],[['a','x']])));
  assert.throws(()=>A.adjacencia(graph(['a','a'],[])));
  assert.throws(()=>A.adjacencia(graph(['a','b'],[['a','b',NaN]])));
  assert.throws(()=>A.kruskal(G.rotas));
});
test('AGM tem custo 13 e mínimo confirmado enumerando subconjuntos',()=>{
  const result=A.kruskal(G.ponderado);assert.equal(result.cost,13);assert.equal(result.accepted.length,4);
  let minimum=Infinity;
  for(let mask=0;mask<2**G.ponderado.edges.length;mask++){
    const edges=G.ponderado.edges.filter((_,i)=>mask&(1<<i));if(edges.length!==4)continue;
    const candidate={...G.ponderado,edges};
    if(Object.values(A.bfs(candidate,'A').distance).every(Number.isFinite))minimum=Math.min(minimum,edges.reduce((s,e)=>s+e.weight,0));
  }
  assert.equal(result.cost,minimum);
  const triangle=graph(['A','B','C'],[['A','B',2],['A','C',3],['B','C',2]]);
  assert.equal(A.kruskal(triangle).cost,4);assert.equal(A.dijkstra(triangle,'A').distance.C,3);
  assert.equal(A.kruskal(graph(['a','b','c'],[['a','b',-2]])).components,2);
});
test('coloração respeita todas as arestas e limite inferior da clique',()=>{
  const r=A.colorir(G.cores,['D','A','B','C','E']);assert.equal(r.count,3);
  for(const e of G.cores.edges)assert.notEqual(r.colors[e.from],r.colors[e.to]);
  for(const [u,v] of [['A','B'],['A','D'],['B','D']])assert.ok(G.cores.edges.some(e=>e.from===u&&e.to===v||e.from===v&&e.to===u));
  assert.equal(A.colorir(G.k33,['u1','u2','u3','v1','v2','v3']).count,2);
  assert.throws(()=>A.colorir(G.cores,['A']));assert.throws(()=>A.colorir(graph(['a'],[['a','a']]),['a']));
});
test('exemplo euleriano usa as sete arestas exatamente uma vez',()=>{
  const route=['c','a','b','c','d','e','f','d'];
  const canonical=(a,b)=>[a,b].sort().join('-');
  const used=route.slice(1).map((v,i)=>canonical(route[i],v));
  assert.equal(new Set(used).size,7);assert.deepEqual([...used].sort(),G.euler.edges.map(e=>canonical(e.from,e.to)).sort());
});
test('fluxo: conservação em cada passo, uso real de reversa e corte mínimo independente',()=>{
  const r=A.aumentar(G.fluxo,'S','T',G.aumentantes);
  assert.deepEqual(r.frames.map(f=>f.delta),[2,1,1,1]);assert.deepEqual(r.frames.map(f=>f.value),[2,3,4,5]);
  for(const f of r.frames)assertViable(G.fluxo,f.flows,f.value);
  assert.equal(r.frames.at(-1).usedReverse,true);assert.equal(r.frames[2].flows[2],2);assert.equal(r.flows[2],1);
  assert.equal(r.value,5);assert.equal(r.cut,minCut(G.fluxo));assert.equal(r.cut,r.value);assert.equal(r.optimal,true);assert.deepEqual(r.reachable,['S']);
  assert.equal(A.aumentar(G.fluxo,'S','T',G.aumentantes.slice(0,3)).optimal,false);
});
test('fluxo máximo não precisa saturar todos os arcos da fonte',()=>{
  const g=graph(['S','A','T'],[['S','A',10],['A','T',1]],true);
  const r=A.aumentar(g,'S','T',[['S','A','T']]);assert.equal(r.value,1);assert.equal(r.cut,1);assert.ok(r.flows[0]<10);assert.equal(r.optimal,true);
});
test('contrato residual recusa caminhos e redes inválidos',()=>{
  assert.throws(()=>A.aumentar(G.fluxo,'S','T',[['S','T']]));
  assert.throws(()=>A.aumentar(G.fluxo,'S','T',[['S','A','S','B','T']]));
  assert.throws(()=>A.aumentar(graph(['S','T'],[['S','T',1],['T','S',1]],true),'S','T',[]));
  assert.throws(()=>A.aumentar(graph(['S','T'],[['S','T',0.5]],true),'S','T',[]));
});
test('importar o roteiro não altera os modelos compartilhados',()=>{
  assert.ok(G.rede.nodes.every(n=>!('state' in n)&&!('note' in n)));
  assert.ok(G.fluxo.edges.every(e=>Number.isFinite(e.weight)&&!('label' in e)));
});
