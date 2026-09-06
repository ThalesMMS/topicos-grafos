/**
 * Conteúdo de algoritmos reintegrado ao seminário.
 *
 * Os módulos de `equilibrada/` continuaram no repositório, mas deixaram de ser
 * importados — foi assim que o seminário perdeu árvore, Euler, Hamilton,
 * coloração e fluxo. Este arquivo traz de volta as partes que sustentam os
 * algoritmos apresentados, sem duplicar o que o seminário já cobre.
 *
 * `pegar()` busca por título e ESTOURA se o slide não existir mais. Assim, se
 * alguém renomear um slide lá, o erro aparece no teste em vez de o conteúdo
 * sumir silenciosamente do telão — que é exatamente o que aconteceu antes.
 */

import { slides as fundamentos } from '../equilibrada/01-fundamentos.js';
import { slides as conectividade } from '../equilibrada/02-conectividade.js';
import { slides as arvores } from '../equilibrada/03-arvores.js';
import { slides as digrafos } from '../equilibrada/05-digrafos.js';
import { slides as percursos } from '../equilibrada/06-percursos.js';
import { slides as planaridade } from '../equilibrada/07-planaridade.js';
import { slides as fluxo } from '../equilibrada/08-fluxo.js';

/**
 * Quanto conteúdo de algoritmos entra no seminário.
 *
 * O slot original era de 88 minutos. Restaurar o que havia sido tirado não
 * cabe nele — os três níveis abaixo foram MEDIDOS, não estimados:
 *
 *   'completo'  → 67 slides, 126,5 min. Todos os algoritmos.
 *   'essencial' → 59 slides, 114,5 min. Sem fluxo máximo, sem famílias/matrizes.
 *   'minimo'    → 51 slides, 103,5 min. Só o que sustenta as questões da prova.
 *
 * Nem o 'minimo' cabe em 88: o próprio seminário sem nenhum acréscimo já ocupa
 * 92 min com os três artigos novos. Para 88, é preciso cortar conteúdo-base —
 * decisão de quem apresenta, não do código. Trocar esta constante é a única
 * edição necessária para mudar de nível.
 */
export const SELECAO = 'completo';

const NIVEIS = {
  completo: new Set(['fundamentos', 'conectividade', 'dfs', 'metricas', 'arvores', 'alcance', 'euler', 'cores', 'fluxo']),
  essencial: new Set(['conectividade', 'dfs', 'arvores', 'alcance', 'euler', 'cores']),
  minimo: new Set(['dfs', 'arvores', 'cores'])
};

/** Um grupo entra no deck apenas se o nível escolhido o inclui. */
const seLigado = (chave, slides) => (NIVEIS[SELECAO] || NIVEIS.completo).has(chave) ? slides : [];

/**
 * Recupera slides pelo título e carimba a duração prevista.
 * @param {Array} modulo lista de slides de origem
 * @param {Array<[string, number]>} pedidos pares [título, minutos]
 */
function pegar(modulo, pedidos) {
  return pedidos.map(([titulo, minutes]) => {
    const slide = modulo.find(s => s.title === titulo);
    if (!slide) {
      const existentes = modulo.map(s => s.title).filter(Boolean).join(' | ');
      throw new Error(`slide "${titulo}" não existe mais. Disponíveis: ${existentes}`);
    }
    // Prefixo obrigatório: os módulos de origem têm ids próprios que colidem
    // com os do seminário (o "dfs-regra" existe nos dois). Sem isto, um slide
    // some do deck sem erro nenhum.
    return { ...slide, id: `alg-${slide.id}`, minutes };
  });
}

/** Famílias e as duas matrizes de representação. Entra no bloco 1. */
export const baseFundamentos = seLigado('fundamentos', pegar(fundamentos, [
  ['Famílias que mudam a interpretação', 1],
  ['Incidência: vértice × aresta', 1],
  ['Adjacência: vértice × vértice', 1]
]));

/** Vocabulário de percurso e o que quebra a rede. Entra no bloco 1. */
export const baseConectividade = seLigado('conectividade', pegar(conectividade, [
  ['Passeio, trajeto e caminho', 1],
  ['Componentes são blocos maximais conexos', 1],
  ['Um grafo conexo ainda pode ser frágil', 1.5]
]));

/** A DFS que o seminário só descrevia em texto. Entra no bloco 1. */
export const detalheDfs = seLigado('dfs', pegar(conectividade, [
  ['DFS: terminar um ramo antes de outro', 1],
  ['DFS registra entrada e saída', 2]
]));

/** Raio e diâmetro: métricas que saem da BFS. Entra no bloco 2. */
export const metricas = seLigado('metricas', pegar(conectividade, [
  ['Raio e diâmetro vêm das menores distâncias', 1.5]
]));

/** A teoria que faltava embaixo de Kruskal e Prim. Entra no bloco 3. */
export const teoriaArvores = seLigado('arvores', pegar(arvores, [
  ['Árvore: conexa e acíclica', 1.5],
  ['A aresta mais leve de um corte é segura', 2]
]));

/** Alcançabilidade dirigida, antes de Kosaraju. Entra no bloco 3. */
export const alcance = seLigado('alcance', pegar(digrafos, [
  ['Fechos direto e inverso', 1],
  ['Três níveis de conectividade', 1.5]
]));

/** Euler e Hamilton — sumiram inteiros do seminário. Entra no bloco 3. */
export const eulerHamilton = seLigado('euler', pegar(percursos, [
  ['Perguntas semelhantes, garantias distintas', 1.5],
  ['Construir sem abandonar arestas', 2],
  ['Condição suficiente não é condição necessária', 1.5]
]));

/** Coloração — sustenta o artigo do Chaitin. Entra no bloco 4. */
export const coloracao = seLigado('cores', pegar(planaridade, [
  ['Colorir é separar vértices em conjuntos independentes', 1.5],
  ['Uma coloração é um limite superior', 2],
  ['A ordem pode gastar uma cor desnecessária', 1.5]
]));

/** Fluxo máximo e corte mínimo — também sumiram inteiros. Entra no bloco 4. */
export const fluxoMaximo = seLigado('fluxo', pegar(fluxo, [
  ['Capacidade e conservação', 1.5],
  ['Residual: folga para frente, cancelamento para trás', 2],
  ['Ford–Fulkerson: aumentar e corrigir', 2.5],
  ['Um corte certifica que não cabe mais fluxo', 1.5]
]));
