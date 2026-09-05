/** Roteiro principal: cobertura curricular antes da seleção de exercícios. */
import { slides as fundamentos } from './01-fundamentos.js';
import { slides as conectividade } from './02-conectividade.js';
import { slides as arvores } from './03-arvores.js';
import { slides as caminhos } from './04-caminhos.js';
import { slides as digrafos } from './05-digrafos.js';
import { slides as percursos } from './06-percursos.js';
import { slides as planaridade } from './07-planaridade.js';
import { slides as fluxo } from './08-fluxo.js';
import { polls as autorais } from './perguntas.js';
import { polls as oficiais, enade } from './enade.js';
import { complementos } from './complementos.js';
export const polls = { ...autorais, ...oficiais };
const atividades = { fundamentos: ['enade_aperto'], conectividade: ['enade_equivalencia'], caminhos: ['enade_dijkstra', 'enade_ospf', 'enade_gulosa'] };
function ampliar(id, slides) {
  return [...slides, ...(complementos[id] || []), ...(atividades[id] || []).flatMap(enade)];
}

// Tempo estimado para REVISÃO: atividades e discussão incluídas; ensaiar antes.
// Não é uma proposta de ministrar toda a disciplina do zero em uma hora.
export const MODULOS = [
  { id: 'fundamentos', title: 'Fundamentos e representações', minutes: 13, slides: ampliar('fundamentos', fundamentos) },
  { id: 'conectividade', title: 'Conectividade e buscas', minutes: 16, slides: ampliar('conectividade', conectividade) },
  { id: 'arvores', title: 'Árvores e AGM', minutes: 6, slides: ampliar('arvores', arvores) },
  { id: 'caminhos', title: 'Caminhos mínimos', minutes: 18, slides: ampliar('caminhos', caminhos) },
  { id: 'digrafos', title: 'Dígrafos e dependências', minutes: 6, slides: ampliar('digrafos', digrafos) },
  { id: 'percursos', title: 'Euler e Hamilton', minutes: 5, slides: ampliar('percursos', percursos) },
  { id: 'planaridade', title: 'Planaridade e coloração', minutes: 8, slides: ampliar('planaridade', planaridade) },
  { id: 'fluxo', title: 'Fluxo máximo', minutes: 10, slides: ampliar('fluxo', fluxo) }
];
export const DURACAO_ESTIMADA = 85;
export const slides = [
  {
    id: 'abertura-equilibrada', type: 'cover', minutes: 1,
    eyebrow: 'Teoria dos Grafos · revisão',
    title: 'Modelar, entender,', highlight: 'escolher e verificar',
    description: 'Dos fundamentos às famílias de problemas. Cinco questões do ENADE e cinco exercícios autorais, com votação pelo celular.'
  },
  ...MODULOS.flatMap(m => m.slides.map(slide => ({
    ...slide, module: m.id,
    ...(slide.type === 'section' ? { minutes: m.minutes, kicker: 'Revisão · '+m.minutes+' min estimados' } : {})
  }))),
  {
    id: 'sintese', type: 'table', minutes: 2, eyebrow: 'Síntese',
    title: 'Começar pela pergunta e conferir a hipótese',
    headers: ['Pergunta', 'Ferramenta / certificado'],
    rows: [
      ['Quem alcança quem? Quantos grupos?', 'BFS / DFS; componentes'],
      ['Menos arestas ou menor custo?', 'BFS / Dijkstra / Bellman–Ford'],
      ['Conectar tudo pelo menor custo total?', 'Prim / Kruskal; propriedade do corte'],
      ['Respeitar dependências?', 'DAG; ordenação topológica'],
      ['Usar cada aresta ou visitar cada vértice?', 'Euler ≠ Hamilton'],
      ['Desenhar sem cruzamentos? Separar conflitos?', 'Planaridade ≠ coloração'],
      ['Quanto pode ser transportado?', 'Fluxo máximo = corte mínimo']
    ]
  },
  {
    id: 'referencias', type: 'list', eyebrow: 'Fontes e aprofundamento',
    title: 'Fontes e aprofundamento',
    items: [
      'Acervo curricular: ThalesMMS/Grafos.',
      'Apoio técnico: Sedgewick e Wayne, Algorithms, 4ª edição; Princeton.',
      'Fontes por módulo e limites: docs/ROTEIRO_EQUILIBRADO.md.'
    ],
    note: { kind: 'key', title: 'Escopo', text: 'Esta revisão cobre grafos. Não pretende cobrir toda a parte de computabilidade. Inclui as cinco questões do ENADE do roteiro anterior e cinco exercícios autorais, identificados separadamente.' }
  },
  {
    id: 'fechamento-equilibrado', type: 'closing',
    eyebrow: 'Discussão final', title: 'Qual hipótese sustenta a sua resposta?',
    description: 'Identifique o modelo, escolha a ferramenta e verifique o resultado. A existência de um exemplo não substitui a garantia do algoritmo.'
  }
];
