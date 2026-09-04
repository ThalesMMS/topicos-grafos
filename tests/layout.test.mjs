/**
 * Limites de layout — o que estoura no projetor.
 *
 * Estes números não são estéticos: são os pontos em que um bloco passa a
 * transbordar a área do slide em 1920×1080. Se um teste daqui falhar, o texto
 * precisa encurtar (ou virar dois slides), não o limite subir.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { CONFIG } from '../public/presentation.config.js';

const slides = CONFIG.slides.map((slide, index) => ({ n: index + 1, slide }));

const paraCada = (verificar) => {
  const falhas = [];
  for (const { n, slide } of slides) {
    try {
      verificar(slide, n);
    } catch (erro) {
      falhas.push(`slide ${n}: ${erro.message}`);
    }
  }
  assert.equal(falhas.length, 0, `\n  ${falhas.join('\n  ')}`);
};

test('tabelas caem na tela', () => paraCada((s, n) => {
  if (s.headers) assert.ok(s.headers.length <= 8, `tabela com ${s.headers.length} colunas (máx. 8)`);
  if (s.rows) assert.ok(s.rows.length <= 12, `tabela com ${s.rows.length} linhas (máx. 12)`);
  if (s.rows) {
    const maior = Math.max(0, ...s.rows.flat().map(c => String(c).length));
    assert.ok(maior <= 70, `célula com ${maior} caracteres (máx. 70)`);
  }
}));

test('blocos de texto não transbordam', () => paraCada(s => {
  if (s.statement) assert.ok(s.statement.length <= 520, `enunciado com ${s.statement.length} caracteres (máx. 520)`);
  if (s.description) assert.ok(s.description.length <= 380, `descrição com ${s.description.length} caracteres (máx. 380)`);
  if (s.why) assert.ok(s.why.length <= 620, `justificativa com ${s.why.length} caracteres (máx. 620)`);
  if (s.title) assert.ok(s.title.length <= 68, `título com ${s.title.length} caracteres (máx. 68)`);
}));

test('alternativas, afirmações e bullets são legíveis de longe', () => paraCada(s => {
  for (const alternativa of s.alternatives || []) {
    const texto = String(alternativa.text ?? alternativa);
    assert.ok(texto.length <= 92, `alternativa com ${texto.length} caracteres (máx. 92)`);
  }
  for (const claim of s.claims || []) {
    assert.ok(claim.length <= 160, `afirmação com ${claim.length} caracteres (máx. 160)`);
  }
  for (const point of s.points || []) {
    assert.ok(point.length <= 190, `bullet com ${point.length} caracteres (máx. 190)`);
  }
  if (s.points) assert.ok(s.points.length <= 6, `${s.points.length} bullets (máx. 6)`);
}));

test('fórmulas e código não quebram o bloco monoespaçado', () => paraCada(s => {
  for (const formula of s.formulas || []) {
    assert.ok(formula.length <= 64, `fórmula com ${formula.length} caracteres (máx. 64)`);
  }
  for (const linha of s.lines || []) {
    assert.ok(linha.length <= 66, `linha de código com ${linha.length} caracteres (máx. 66)`);
  }
}));

test('diagramas têm proporção de tela', () => paraCada(s => {
  if (!s.graph) return;
  const [largura, altura] = s.graph.view || [760, 420];
  const razao = largura / altura;
  assert.ok(razao >= 1.1 && razao <= 2.4, `proporção ${razao.toFixed(2)} fora de [1.1, 2.4]`);
  assert.ok(s.graph.nodes.length <= 12, `${s.graph.nodes.length} vértices (máx. 12)`);
}));

test('toda questão tem gabarito coerente', () => paraCada(s => {
  if (s.type !== 'question') return;
  assert.ok(s.answer, 'questão sem gabarito');
  assert.ok(s.alternatives?.length, 'questão sem alternativas');
  const ids = s.alternatives.map(a => a.id);
  assert.ok(ids.includes(s.answer), `gabarito "${s.answer}" não está entre as alternativas`);
  assert.equal(new Set(ids).size, ids.length, 'alternativas com id repetido');
  if (s.reveal) assert.ok(s.why, 'slide de gabarito sem justificativa');
  if (s.poll) assert.ok(CONFIG.polls[s.poll], `enquete "${s.poll}" não existe`);
}));

test('cada questão tem exatamente um slide de votação e um de gabarito', () => {
  const porEnquete = new Map();
  for (const { slide } of slides) {
    if (!slide.poll) continue;
    if (!porEnquete.has(slide.poll)) porEnquete.set(slide.poll, { votacao: 0, gabarito: 0 });
    const contagem = porEnquete.get(slide.poll);
    if (slide.reveal) contagem.gabarito += 1;
    else contagem.votacao += 1;
  }
  for (const [chave, contagem] of porEnquete) {
    assert.equal(contagem.votacao, 1, `enquete "${chave}" tem ${contagem.votacao} slides de votação`);
    assert.equal(contagem.gabarito, 1, `enquete "${chave}" tem ${contagem.gabarito} slides de gabarito`);
  }
  assert.equal(
    porEnquete.size,
    Object.keys(CONFIG.polls).length,
    'existe enquete declarada que nenhum slide usa'
  );
});

test('nenhuma lista tem entrada vazia', () => paraCada(s => {
  for (const campo of ['points', 'items', 'claims', 'topics', 'rows', 'lines']) {
    for (const entrada of s[campo] || []) {
      if (Array.isArray(entrada)) continue;
      const texto = typeof entrada === 'object' ? (entrada.title ?? '') : String(entrada ?? '');
      // `lines` é pseudocódigo: linha em branco ali é espaçamento proposital.
      if (campo === 'lines') continue;
      assert.ok(texto.trim().length > 0, `entrada vazia em "${campo}"`);
    }
  }
}));

test('bloco de fórmula não começa nem termina em branco', () => paraCada(s => {
  const formulas = s.formulas || (s.formula ? [s.formula] : []);
  if (!formulas.length) return;
  assert.ok(String(formulas[0]).trim(), 'primeira linha da fórmula está vazia');
  assert.ok(String(formulas.at(-1)).trim(), 'última linha da fórmula está vazia');
}));

test('nenhuma frase termina truncada', () => paraCada(s => {
  // Verbo ou preposição no FIM DO BLOCO quase sempre é frase cortada pelo
  // limite de largura — foi assim que "o FECHO de G é" foi para o telão.
  // No meio de um bloco de fórmula a continuação é legítima ("tal que" na
  // linha 1, completado na linha 2), então só a última linha é verificada.
  // Atenção: \b é ASCII em JavaScript e NÃO casa antes de "é". Usar (^|\s).
  const suspeitas = /(?:^|\s)(é|são|foi|tem|de|da|do|em|com|para|por|que|e|ou)\s*$/i;
  const formulas = (s.formulas || []).map(String).filter(linha => linha.trim());
  const candidatos = [
    ...(formulas.length ? [formulas.at(-1)] : []),
    ...(s.claims || []).map(String),
    ...(s.alternatives || []).map(alternativa => String(alternativa.text ?? alternativa))
  ];
  for (const linha of candidatos) {
    assert.ok(!suspeitas.test(linha), `possivelmente truncada: "${linha}"`);
  }
}));
