import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../public/presentation.config.js';
import { fundamentos as f } from '../public/slides/01-fundamentos.js';
import { relacoes as r } from '../public/slides/02-relacoes.js';
import { caminhos as c } from '../public/slides/04-caminhos.js';
import { activityForSlide } from '../public/assets/activity.js';
test('todas as cinco questões ENADE permanecem ativas, com alternativas, figura e resolução',()=>{
 const original=[...f,...r,...c].filter(s=>s.type==='question'&&!s.reveal);
 assert.equal(original.length,5);
 for(const q of original){
  const pair=CONFIG.slides.filter(s=>s.poll===q.poll);
  assert.equal(pair.length,2,q.poll);
  const [vote,answer]=pair;
  assert.equal(vote.statement,q.statement);
  assert.deepEqual(vote.graph,q.graph);
  assert.deepEqual(vote.claims,q.claims);
  assert.deepEqual(vote.alternatives,q.alternatives);
  assert.deepEqual(answer.alternatives,q.alternatives);
  assert.equal(answer.answer,q.answer);
  assert.equal(activityForSlide(vote),`poll:${q.poll}`);
  assert.equal(activityForSlide(answer),'stage');
  assert.deepEqual(CONFIG.polls[q.poll].options.map(o=>o.id),q.alternatives.map(a=>a.id));
 }
});
test('algoritmos complementares recebem explicação no roteiro ativo',()=>{
 for(const name of ['Bellman','Floyd','A*','Kosaraju','Welsh','Dinic','Edmonds','Húngaro','Bondy']){
  assert.ok(CONFIG.slides.some(s=>JSON.stringify(s).includes(name)),name);
 }
});
