import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { CONFIG } from '../public/presentation.config.js';
import { QUESTOES } from '../public/slides/seminario/questoes.js';
import { activityForSlide } from '../public/assets/activity.js';
import { slideMarkup } from '../public/assets/render.js';
test('cinco questões originais: PDF local, recortes e votação sem resposta exposta',()=>{
  assert.equal(QUESTOES.length,5);
  assert.equal(QUESTOES.filter(q=>q.source.startsWith('POSCOMP')).length,2);
  const manifest=JSON.parse(readFileSync(new URL('../public/provas/recortes/manifesto.json',import.meta.url)));
  for(const q of QUESTOES){
    const pair=CONFIG.slides.filter(s=>s.poll===q.id);
    assert.equal(pair.length,2);
    const [vote,answer]=pair;
    assert.equal(activityForSlide(vote),`poll:${q.id}`);
    assert.equal(activityForSlide(answer),'stage');
    // O orçamento vive em slides/seminario/index.js; aqui basta garantir que
    // a votação tem mais tempo que o gabarito e não é um slide relâmpago.
    // O orçamento vive em slides/seminario/index.js. Aqui só garantimos que a
    // votação tem tempo real de leitura e dura mais que o gabarito.
    assert.ok(vote.minutes >= 2, `votação com apenas ${vote.minutes} min`);
    assert.ok(vote.minutes > answer.minutes, 'votação deveria durar mais que o gabarito');
    assert.deepEqual(answer.alternatives,vote.alternatives);
    assert.ok(existsSync(new URL(`../public/provas/${q.pdf}`,import.meta.url)));
    for(const image of q.images){
      assert.ok(existsSync(new URL(`../public/provas/recortes/${image}.png`,import.meta.url)));
      assert.equal(manifest.find(m=>m.image===image+'.png').pdf,q.pdf);
    }
    const html=slideMarkup(vote);
    assert.match(html,/<img/);assert.doesNotMatch(html,/alt--correta|answer-panel|Resolução comentada/);
    assert.deepEqual(CONFIG.polls[q.id].options.map(a=>a.label),q.alternatives.map(a=>`${a.id.toUpperCase()}) ${a.text}`));
  }
});
