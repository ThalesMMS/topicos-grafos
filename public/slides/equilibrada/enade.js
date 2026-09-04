/** Questões preservadas do roteiro anterior; alternativas únicas para telão e celular. */
import { fundamentos } from '../01-fundamentos.js';
import { relacoes } from '../02-relacoes.js';
import { caminhos } from '../04-caminhos.js';
const anteriores = [...fundamentos, ...relacoes, ...caminhos];
const questoes = anteriores.filter(s => s.type === 'question' && !s.reveal);
export const polls = Object.fromEntries(questoes.map(q => [q.poll, {
  type: 'single',
  question: `${q.source} — ${q.statement} ${q.question}`,
  options: q.alternatives.map(a => ({ id: a.id, label: `${a.id.toUpperCase()}) ${a.text}` }))
}]));
export function enade(poll) {
  const q = questoes.find(s => s.poll === poll);
  if (!q) throw new Error(`Questão ausente: ${poll}`);
  const r = anteriores.find(s => s.poll === poll && s.reveal);
  return [
    { ...q, id: `${poll}-pergunta` },
    { ...r, id: `${poll}-resposta`, alternatives: q.alternatives, answerLabel: 'Resolução · ENADE' }
  ];
}
