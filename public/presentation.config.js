/**
 * Arquivo principal do deck.
 *
 * ESCOPO: algoritmos e propriedades de GRAFOS. Nada de programação dinâmica
 * sobre sequências nem de complexidade de estruturas de dados — se não tem
 * vértice e aresta, não entra.
 *
 * QUESTÕES: cinco do ENADE, de três anos e três áreas (Computação 2011,
 * Ciência da Computação 2021, Engenharia de Computação 2023), todas com
 * gabarito oficial conferido no caderno do INEP e resolvidas de forma
 * independente. A interação da plateia acontece só nelas.
 *
 * Os traces de BFS, DFS, Dijkstra, Kruskal, Kahn e coloração gulosa são
 * GERADOS executando o algoritmo (ver slides/lib/trace.js) — os números na
 * tela não podem divergir do que o algoritmo faz.
 *
 * O material de fluxo máximo, emparelhamento e planaridade está em
 * slides/apendice/ e não entra neste deck.
 */
import { abertura } from './slides/00-abertura.js';
import { fundamentos } from './slides/01-fundamentos.js';
import { relacoes } from './slides/02-relacoes.js';
import { busca } from './slides/03-busca.js';
import { caminhos } from './slides/04-caminhos.js';
import { arvores } from './slides/05-arvores.js';
import { digrafos } from './slides/06-digrafos.js';
import { percursos } from './slides/07-percursos.js';
import { coloracao } from './slides/08-coloracao.js';
import { fechamento } from './slides/09-fechamento.js';

/** Alternativas das questões, reaproveitadas pelo celular da plateia. */
const alternativas = opcoes => opcoes.map(([id, label]) => ({ id, label }));

export const CONFIG = {
  title: 'Teoria dos Grafos e Computabilidade',
  subtitle: 'Algoritmos passo a passo e questões do ENADE',
  presenter: {
    name: 'Antônio',
    role: 'Ciência da Computação — PUC Minas'
  },
  brand: {
    name: 'Teoria dos Grafos',
    colors: {
      background: '#0b1220',
      surface: '#111c30',
      text: '#f6f8fc',
      muted: '#b7c2d8',
      accent: '#74d4b3',
      accentStrong: '#31b98a'
    }
  },
  polls: {
    enade_aperto: {
      question: 'ENADE 2011 · Q20 — 1ª asserção: em G, a quantidade de vértices com grau ímpar é ímpar. PORQUE 2ª asserção: vale ∑ grau(v) = 2·|E|. Assinale a opção correta:',
      type: 'single',
      options: alternativas([
        ['a', 'A) As duas verdadeiras, e a 2ª justifica a 1ª'],
        ['b', 'B) As duas verdadeiras, mas a 2ª não justifica a 1ª'],
        ['c', 'C) A 1ª verdadeira e a 2ª falsa'],
        ['d', 'D) A 1ª falsa e a 2ª verdadeira'],
        ['e', 'E) As duas falsas']
      ])
    },
    enade_dijkstra: {
      question: 'ENADE 2021 · Q34 — Dijkstra a partir de D (−1 = infinito). Qual a estimativa de custo após DUAS iterações?',
      type: 'single',
      options: alternativas([
        ['a', 'A) A:5 B:6 C:10 D:0 E:4 F:1 G:−1'],
        ['b', 'B) A:5 B:9 C:−1 D:0 E:5 F:1 G:−1'],
        ['c', 'C) A:5 B:9 C:−1 D:0 E:4 F:1 G:2'],
        ['d', 'D) A:5 B:7 C:8 D:0 E:4 F:1 G:2'],
        ['e', 'E) A:5 B:6 C:8 D:0 E:3 F:1 G:2']
      ])
    },
    enade_equivalencia: {
      question: 'ENADE 2023 · Q12 — Pares: 1–5, 2–8, 5–7, 7–10, 2–9, 3–4, 10–1, 5–10, 7–1, 9–8 (cada máquina se relaciona consigo mesma). Assinale a opção correta:',
      type: 'single',
      options: alternativas([
        ['a', 'A) É uma relação de equivalência'],
        ['b', 'B) Tem simetria, mas não transitividade'],
        ['c', 'C) Tem transitividade, mas não simetria'],
        ['d', 'D) {1, 3, 5, 7, 10} é uma classe de equivalência'],
        ['e', 'E) {2, 3, 4, 8, 9} é uma classe de equivalência']
      ])
    },
    enade_ospf: {
      question: 'ENADE 2023 · Q11 — O OSPF modela o SA como grafo ponderado (atrasos = pesos) e roda Dijkstra distribuído. É correto apenas o que se afirma em:',
      type: 'single',
      options: alternativas([
        ['a', 'A) I e III'],
        ['b', 'B) II e III'],
        ['c', 'C) II e IV'],
        ['d', 'D) I, II e IV'],
        ['e', 'E) I, III e IV']
      ])
    },
    enade_gulosa: {
      question: 'ENADE 2023 · Q32 — Rota de Manaus a São Paulo por busca gulosa. A solução encontrada será:',
      type: 'single',
      options: alternativas([
        ['a', 'A) Manaus → Macapá → São Paulo'],
        ['b', 'B) Manaus → Porto Velho → Cuiabá → Goiânia → São Paulo'],
        ['c', 'C) Manaus → Porto Velho → Palmas → Goiânia → São Paulo'],
        ['d', 'D) Manaus → Macapá → Belém → Palmas → Goiânia → São Paulo'],
        ['e', 'E) Manaus → Macapá → Belém → Palmas → P. Velho → Cuiabá → Goiânia → SP']
      ])
    }
  },
  slides: [
    ...abertura,
    ...fundamentos,
    ...relacoes,
    ...busca,
    ...caminhos,
    ...arvores,
    ...digrafos,
    ...percursos,
    ...coloracao,
    ...fechamento
  ]
};
