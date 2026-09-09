import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { CONFIG } from '../public/presentation.config.js';
import { slideMarkup } from '../public/assets/render.js';
import { MODULOS } from '../public/slides/seminario/index.js';
import { provaDijkstra, cidades } from '../public/slides/seminario/modelos.js';
import { dijkstra } from '../public/slides/equilibrada/simulacoes.js';
test('seminário tem quatro partes, duração coerente e ids únicos',()=>{
  assert.equal(MODULOS.length,4);
  // A duração declarada é a soma real dos slides — não um número escolhido à mão.
  assert.equal(CONFIG.estimatedMinutes,MODULOS.reduce((t,m)=>t+m.minutes,0));
  assert.equal(CONFIG.estimatedMinutes,80);
  assert.ok(MODULOS.every(m=>m.minutes>0&&m.slides.length>0));
  assert.equal(new Set(CONFIG.slides.map(s=>s.id)).size,CONFIG.slides.length);
  assert.equal(CONFIG.slides[0].type,'cover');
});

test('a capa traz os quatro nomes e nenhum endereço escrito',()=>{
  const capa=CONFIG.slides[0];
  assert.deepEqual(capa.names,['Antonio Neto','Thales Matheus','Ji Xinyi','Lucas Emerick']);
  assert.match(`${capa.title} ${capa.highlight}`,/Seminário de Grafos/);
  const markup=slideMarkup(capa,{polls:CONFIG.polls,participantUrl:'https://exemplo.test/participar/'});
  assert.ok(!markup.includes('exemplo.test'),'a capa ainda escreve o endereço; deve mostrar só o QR');
  assert.ok(markup.includes('data-connected'),'a capa perdeu a contagem de conectados');
});

test('nada no deck menciona "Integrante"',()=>{
  for(const slide of CONFIG.slides){
    assert.ok(!slide.presenter,`slide ${slide.id} ainda carrega presenter`);
    const texto=JSON.stringify(slide);
    assert.ok(!/Integrante/i.test(texto),`slide ${slide.id} menciona Integrante`);
  }
});

test('a questão mostra só o recorte, as alternativas e os votos',()=>{
  for(const original of CONFIG.slides.filter(s=>s.original&&!s.reveal)){
    const markup=slideMarkup(original,{polls:CONFIG.polls});
    assert.ok(markup.includes('<img'),`${original.id}: perdeu o recorte da prova`);
    assert.ok(markup.includes('data-alt-pct'),`${original.id}: perdeu as porcentagens`);
    assert.ok(!markup.includes('<a '),`${original.id}: tem link, deve ficar só imagem e %`);
    assert.ok(!markup.includes('<details'),`${original.id}: ainda tem o resumo dobrável`);
    assert.ok(!/\d+ minutos?/.test(markup),`${original.id}: ainda instrui o tempo de leitura`);
    // O enunciado some da TELA, não da árvore de acessibilidade: sem ele, a
    // questão viraria uma imagem sem alternativa textual.
    assert.ok(markup.includes('apenas-leitor-de-tela'),`${original.id}: sem texto para leitor de tela`);
  }
});

test('cada artigo é de uma aplicação DIFERENTE, sem repetir domínio',()=>{
  const papers=CONFIG.slides.filter(s=>s.type==='article');
  assert.ok(papers.length>=3,`só ${papers.length} artigo(s)`);
  for(const p of papers)assert.ok(p.href&&p.authors&&p.paper&&p.limit&&p.connection,`artigo incompleto: ${p.paper}`);
  // Cada artigo declara seu domínio no `period`. O desequilíbrio que motivou
  // esta regra era ter três artigos de roteirização; um por domínio, tudo bem.
  const dominios=papers.map(p=>p.period.replace(/^Aplicação \d+ · /,''));
  assert.equal(new Set(dominios).size,papers.length,`domínios repetidos: ${dominios.join(' / ')}`);
  assert.equal(new Set(papers.map(p=>p.year)).size,papers.length,'dois artigos do mesmo ano');
});

test('o texto do deck é impessoal, sem "vimos" nem comandos ao leitor',()=>{
  // Um seminário descreve o que o algoritmo faz; não narra o que "nós fizemos"
  // nem manda o leitor fazer coisas. Sem este teste, uma frase assim volta na
  // próxima edição de conteúdo e ninguém percebe.
  const pessoal=/\b(vimos|veremos|vemos|temos|podemos|fizemos|nossos?|nossas?|nós|vamos)\b/i;
  const comando=/\b(peça|repare|confira|imagine|lembre|note que)\b/i;
  const falhas=[];
  for(const slide of CONFIG.slides){
    const texto=JSON.stringify(slide);
    if(pessoal.test(texto)) falhas.push(`${slide.id}: primeira pessoa — "${texto.match(pessoal)[0]}"`);
    if(comando.test(texto)) falhas.push(`${slide.id}: comando ao leitor — "${texto.match(comando)[0]}"`);
  }
  assert.equal(falhas.length,0,`\n  ${falhas.join('\n  ')}`);
});

test('os artigos aparecem em ordem cronológica',()=>{
  const anos=CONFIG.slides.filter(s=>s.type==='article').map(s=>Number(s.year));
  assert.deepEqual(anos,[...anos].sort((a,b)=>a-b),`fora de ordem: ${anos.join(', ')}`);
});

test('o conteúdo de algoritmos restaurado chegou ao deck',()=>{
  const titulos=CONFIG.slides.map(s=>s.title||'').join(' | ');
  // Cada um destes sumiu quando os módulos deixaram de ser importados.
  for(const esperado of ['Árvore: conexa e acíclica','A aresta mais leve de um corte é segura',
    'O critério de Dirac garante um ciclo hamiltoniano','Capacidade e conservação',
    'Colorir é separar vértices em conjuntos independentes'])
    assert.ok(titulos.includes(esperado),`conteúdo de algoritmos ausente: "${esperado}"`);
});

test('o algoritmo é apresentado ANTES da questão que o cobra',()=>{
  // A questão de Dijkstra já esteve 6 slides à frente da explicação de
  // Dijkstra: a sala votava num trace do algoritmo sem nunca ter visto o
  // algoritmo. Cada questão exige seu conteúdo antes.
  const posicao = id => CONFIG.slides.findIndex(s => s.id === id);
  const exigencias = [
    ['enade_dijkstra-pergunta', ['dijkstra-invariante', 'p-dijkstra-1']],
    ['enade_ospf-pergunta',     ['ospf-modelo', 'p-dijkstra-1']],
    ['poscomp_floyd-pergunta',  ['floyd-regra', 'floyd-quadro']],
    ['poscomp_familias-pergunta',['p-kruskal-1', 'p-prim-1', 'topologica', 'kosaraju', 'fila-nao-e-bfs']],
    ['enade_gulosa-pergunta',   ['heuristicas-prioridade']]
  ];
  for (const [questao, prerequisitos] of exigencias) {
    const iq = posicao(questao);
    assert.ok(iq >= 0, `questão ausente: ${questao}`);
    for (const pre of prerequisitos) {
      const ip = posicao(pre);
      assert.ok(ip >= 0, `pré-requisito ausente: ${pre}`);
      assert.ok(ip < iq, `"${pre}" (slide ${ip + 1}) vem DEPOIS de "${questao}" (slide ${iq + 1})`);
    }
  }
});

test('o slide de abertura não cita algoritmo que ainda não foi apresentado',()=>{
  const abertura = CONFIG.slides.find(s => s.id === 'modelo');
  const texto = JSON.stringify(abertura);
  for (const nome of ['BFS','DFS','Dijkstra','Kruskal','Prim','Bellman','Floyd','Kosaraju','geradora mínima'])
    assert.ok(!texto.includes(nome), `o slide de modelagem cita "${nome}" antes de apresentá-lo`);
});

test('as execuções completas têm um slide por mudança de estado',()=>{
  // Estes são os algoritmos apresentados como execução completa. Floyd,
  // Kosaraju e Fleury aparecem explicitamente como exemplos delimitados.
  const passos=CONFIG.slides.filter(s=>/^p-/.test(s.id));
  const familias=new Set(passos.map(s=>/^p-([a-z]+)-/.exec(s.id)[1]));
  for(const algoritmo of ['bfs','dfs','dijkstra','bellman','kruskal','prim','kahn','fluxo','cores','welsh'])
    assert.ok(familias.has(algoritmo),`sem passo a passo: ${algoritmo}`);
  // Cada passo declara sua posição, para a turma saber onde está.
  for(const passo of passos) assert.match(passo.eyebrow,/passo \d+\/\d+/);
});

test('nenhum trace-resumo sobreviveu ao passo a passo que o substituiu',()=>{
  const ids=new Set(CONFIG.slides.map(s=>s.id));
  for(const superado of ['bfs-quadro','alg-dfs-execucao','kruskal-quadro','prim-quadro','alg-ford-fulkerson','alg-guloso-cores'])
    assert.ok(!ids.has(superado),`"${superado}" repete o que o passo a passo já mostra`);
});
test('Q34 conserva todos os arcos da prova e E=5 na primeira extração',()=>{
  const edges=['D>A:5','A>B:2','D>B:9','D>E:5','D>F:1','F>E:3','F>G:1','G>E:1','E>B:1','B>C:8','E>C:5'];
  assert.deepEqual(provaDijkstra.edges.map(e=>`${e.from}>${e.to}:${e.weight}`).sort(),edges.sort());
  const frames=dijkstra(provaDijkstra,'D').frames;
  assert.deepEqual(frames.slice(0,3).map(f=>f.u),['D','F','G']);assert.equal(frames[0].distance.E,5);
  assert.deepEqual(frames[1].distance,{D:0,A:5,B:9,C:Infinity,E:4,F:1,G:2});
});
test('Q32 preserva ligação Macapá–São Paulo e conexões sem setas',()=>{
  assert.equal(cidades.directed,false);assert.ok(cidades.edges.some(e=>e.from==='Macapá'&&e.to==='S. Paulo'));
  assert.ok(cidades.edges.every(e=>e.weight===undefined));
});
test('PDFs armazenados conferem com o manifesto de origem',()=>{
  const sources=JSON.parse(readFileSync(new URL('../public/provas/fontes.json',import.meta.url)));
  assert.ok(sources.length>=10);
  for(const source of sources){const bytes=readFileSync(new URL(`../public/provas/${source.file}`,import.meta.url));
    assert.equal(bytes.subarray(0,4).toString(),'%PDF');assert.equal(createHash('sha256').update(bytes).digest('hex'),source.sha256);}
});
