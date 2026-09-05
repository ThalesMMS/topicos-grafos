import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { CONFIG } from '../public/presentation.config.js';
import { slideMarkup } from '../public/assets/render.js';
import { activityForSlide } from '../public/assets/activity.js';
import { pergunta, resposta, QUESTOES } from '../public/slides/equilibrada/perguntas.js';
import { bfs, colorir } from '../public/slides/equilibrada/simulacoes.js';
import { isomorfos, componentes, coroa } from '../public/slides/equilibrada/modelos.js';
import worker, { Room } from '../src/worker.js';

test('resolução preserva alternativas, não se apresenta como gabarito oficial', () => {
  for (const q of QUESTOES) {
    const vote = pergunta(q.id), answer = resposta(q.id);
    assert.deepEqual(answer.alternatives, vote.alternatives);
    assert.equal(answer.poll, vote.poll);
    assert.equal(activityForSlide(vote), `poll:${vote.poll}`);
    assert.equal(activityForSlide(answer), 'stage');
    assert.doesNotMatch(slideMarkup(vote), /alt--correta|answer-panel/);
    const html = slideMarkup(answer);
    assert.match(html, /Resolução · exercício autoral/);
    assert.doesNotMatch(html, /Gabarito oficial/);
    assert.equal((html.match(/class="alt alt--correta"/g) || []).length, 1);
  }
});

test('rótulo do gabarito é escapado e tem fallback neutro', () => {
  const slide = { ...resposta('fluxo'), answerLabel: '<img src=x onerror=alert(1)>' };
  assert.doesNotMatch(slideMarkup(slide), /<img/);
  assert.match(slideMarkup(slide), /&lt;img/);
  delete slide.answerLabel;
  assert.match(slideMarkup(slide), /Gabarito · D/);
});

test('o bloco de fechamento começa na síntese, sem consumir fluxo', () => {
  const bounds = CONFIG.slides.filter(s => typeof s.minutes === 'number');
  assert.equal(bounds.at(-1).id, 'sintese');
  assert.equal(bounds.at(-1).minutes, 2);
  assert.equal(bounds.reduce((sum, s) => sum + s.minutes, 0), 85);
  assert.equal(CONFIG.slides.at(-1).minutes, undefined);
});

test('a bijeção desenhada preserva arestas e não arestas', () => {
  const map = { 1: 'd', 2: 'a', 3: 'b', 4: 'c' };
  const edge = (u, v) => isomorfos.edges.some(e =>
    (e.from === u && e.to === v) || (e.from === v && e.to === u));
  for (const u of Object.keys(map)) for (const v of Object.keys(map)) {
    assert.equal(edge(u, v), edge(map[u], map[v]));
  }
});

test('o componente isolado e a coloração não ótima são reais', () => {
  assert.equal(bfs(componentes, 'A').distance.F, Infinity);
  assert.equal(bfs(componentes, 'F').distance.F, 0);
  const ruim = colorir(coroa, ['u1', 'v1', 'u2', 'v2', 'u3', 'v3']);
  const boa = colorir(coroa, ['u1', 'u2', 'u3', 'v1', 'v2', 'v3']);
  assert.equal(ruim.count, 3);
  assert.equal(boa.count, 2);
});

test('o telão carrega os ajustes de legibilidade e mantém o runtime', () => {
  const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  assert.ok(html.indexOf('/assets/revisao.css') > html.indexOf('/assets/styles.css'));
  assert.match(html, /\/assets\/sync\.js/);
  assert.match(html, /\/assets\/qrcode\.js/);
});

// Testa os handlers reais, com adaptadores de storage/socket em memória.
// Não equivale a um ensaio de Durable Object implantado na Cloudflare.
function fixture(stored) {
  const sockets = [];
  let persisted = stored;
  const state = {
    setWebSocketAutoResponse() {}, getWebSockets: () => sockets,
    storage: { get: async () => persisted, put: async (_key, value) => { persisted = structuredClone(value); } }
  };
  const previous = globalThis.WebSocketRequestResponsePair;
  globalThis.WebSocketRequestResponsePair = class {};
  let room;
  try { room = new Room(state, { PRESENTER_KEY: 'test-only' }); }
  finally {
    if (previous === undefined) delete globalThis.WebSocketRequestResponsePair;
    else globalThis.WebSocketRequestResponsePair = previous;
  }
  const socket = attachment => {
    const s = {
      messages: [], deserializeAttachment: () => attachment,
      serializeAttachment: value => { attachment = value; },
      send: raw => s.messages.push(JSON.parse(raw))
    };
    sockets.push(s); return s;
  };
  return { room, socket, persisted: () => persisted,
    send: (s, m) => room.webSocketMessage(s, JSON.stringify(m)) };
}

test('dez enquetes: abrir, votar, substituir voto, resolver e resetar', async () => {
  const f = fixture();
  const presenter = f.socket({ role: 'presenter', control: true });
  const alice = f.socket({ role: 'audience', deviceId: 'alice', control: false });
  const bob = f.socket({ role: 'audience', deviceId: 'bob', control: false });
  for (const [poll, config] of Object.entries(CONFIG.polls)) {
    const [a, b] = config.options.map(o => o.id);
    await f.send(alice, { type: 'vote', poll, option: a });
    assert.equal((await f.room.getState()).polls[poll].byDevice.alice, undefined);
    await f.send(presenter, { type: 'activity', activity: `poll:${poll}` });
    await f.send(alice, { type: 'vote', poll, option: a });
    await f.send(alice, { type: 'vote', poll, option: b });
    await f.send(bob, { type: 'vote', poll, option: b });
    const result = f.room.aggregate(await f.room.getState()).polls[poll];
    assert.equal(result.responses, 2);
    assert.equal(result.counts[a], 0);
    assert.equal(result.counts[b], 2);
    await f.send(presenter, { type: 'activity', activity: 'stage' });
    assert.equal((await f.room.getState()).activity, 'stage');
    // No contrato existente, esconder a atividade não fecha a enquete.
    await f.send(presenter, { type: 'set_poll', poll, open: false });
    await f.send(alice, { type: 'vote', poll, option: a });
    assert.equal((await f.room.getState()).polls[poll].byDevice.alice, b);
    await f.send(presenter, { type: 'reset_poll', poll });
    assert.deepEqual(f.persisted().polls[poll].byDevice, {});
    assert.ok(alice.messages.some(m => m.type === 'mine' && m.polls[poll] === ''));
  }
});

test('sala antiga migra enquetes e público não pode controlar o telão', async () => {
  const f = fixture({ version: 1, activity: 'poll:enade_ospf', sequence: 9,
    polls: { enade_ospf: { open: true, byDevice: { old: 'a' } } }, questions: [] });
  const state = await f.room.getState();
  assert.equal(state.activity, 'poll:enade_ospf');
  assert.deepEqual(state.polls.enade_ospf.byDevice, { old: 'a' });
  assert.deepEqual(Object.keys(state.polls).sort(), Object.keys(CONFIG.polls).sort());
  const audience = f.socket({ role: 'audience', deviceId: 'x', control: false });
  await f.send(audience, { type: 'activity', activity: 'closing' });
  assert.equal(state.activity, 'poll:enade_ospf');
});

test('configuração pública entrega as dez perguntas, mas não slides/gabaritos', async () => {
  const response = await worker.fetch(new Request('https://example.test/audience.config.js'), {});
  assert.equal(response.status, 200);
  const source = await response.text();
  const data = JSON.parse(source.replace(/^export const CONFIG = /, '').replace(/;\s*$/, ''));
  assert.deepEqual(data.polls, CONFIG.polls);
  assert.equal(data.slides, undefined);
  assert.doesNotMatch(source, /"answer"|"why"|"reveal"/);
});
