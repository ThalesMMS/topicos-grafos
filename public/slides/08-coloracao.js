/**
 * Coloração — limites de χ, guloso passo a passo (gerado) e onde o guloso erra.
 */

import { tracoColoracao } from './lib/trace.js';

const grafoCor = {
  view: [760, 400],
  nodes: [
    { id: 'A', x: 250, y: 110 },
    { id: 'B', x: 470, y: 80 },
    { id: 'C', x: 110, y: 300 },
    { id: 'D', x: 440, y: 280 },
    { id: 'E', x: 670, y: 190 }
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'D' },
    { from: 'A', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'D', to: 'E' }
  ]
};

const coroa = {
  view: [760, 400],
  nodes: [
    { id: 'u₁', x: 190, y: 80, state: 'done', note: 'cor 0' },
    { id: 'u₂', x: 190, y: 205, state: 'active', note: 'cor 1' },
    { id: 'u₃', x: 190, y: 330, state: 'warn', note: 'cor 2' },
    { id: 'v₁', x: 570, y: 80, state: 'done', note: 'cor 0' },
    { id: 'v₂', x: 570, y: 205, state: 'active', note: 'cor 1' },
    { id: 'v₃', x: 570, y: 330, state: 'warn', note: 'cor 2' }
  ],
  edges: [
    { from: 'u₁', to: 'v₂' },
    { from: 'u₁', to: 'v₃' },
    { from: 'u₂', to: 'v₁' },
    { from: 'u₂', to: 'v₃' },
    { from: 'u₃', to: 'v₁' },
    { from: 'u₃', to: 'v₂' }
  ]
};

export const coloracao = [
  {
    type: 'section',
    kicker: 'Bloco 8',
    minutes: 6,
    title: 'Coloração: separar o que não pode conviver.',
    description: 'Mapas, horários, alocação de registradores e frequências de rádio são o mesmo problema com nomes diferentes.',
    topics: ['número cromático', 'ω ≤ χ ≤ Δ+1', 'guloso passo a passo', 'onde o guloso erra']
  },
  {
    type: 'definition',
    eyebrow: 'Definição',
    title: 'Coloração própria e número cromático',
    formulas: [
      'coloração própria: c: V → {1..k}',
      '  com c(u) ≠ c(v) para toda aresta {u,v}',
      '',
      'χ(G) = menor k para o qual existe coloração própria'
    ],
    description: 'Colorir é **particionar V em conjuntos independentes**: cada cor é um conjunto sem aresta interna. χ(G) é o menor número desses conjuntos que cobre V.',
    points: [
      'χ(G) = 1 ⟺ G não tem aresta. **χ(G) ≤ 2 ⟺ G é bipartido**.',
      'χ(Kₙ) = n — todos adjacentes, ninguém compartilha cor.',
      'χ(Cₙ) = 2 se n é par, **3 se n é ímpar** — e é o mesmo ciclo ímpar que quebra a bipartição.'
    ]
  },
  {
    type: 'definition',
    eyebrow: 'Os limites',
    title: 'ω(G) ≤ χ(G) ≤ Δ(G) + 1',
    formulas: [
      'ω(G) = tamanho da maior clique     Δ(G) = maior grau',
      '',
      'BROOKS: se G é conexo e NÃO é Kₙ nem ciclo ímpar,',
      '        então χ(G) ≤ Δ(G)'
    ],
    description: 'O limite inferior vem da clique: k vértices mutuamente adjacentes exigem k cores. O superior vem do guloso: ao pintar v, seus ≤ Δ vizinhos ocupam no máximo Δ cores, e **sempre sobra a Δ+1**.',
    points: [
      'Δ+1 é **teto, não valor**. Um caminho tem Δ = 2 e χ = 2, não 3.',
      'Prender χ entre dois números costuma valer mais ponto do que exibir uma coloração.',
      'Se você achar uma clique de tamanho k **e** uma coloração com k cores, então **χ = k** — provado dos dois lados.'
    ]
  },
  {
    type: 'graph',
    eyebrow: 'Prendendo χ neste grafo',
    title: 'O triângulo A–B–D obriga três cores',
    description: 'ω = 3 (a clique ABD) e Δ = 4 (o vértice D), então **3 ≤ χ ≤ 5**. Se o guloso achar uma coloração com 3, os dois lados fecham e χ = 3.',
    graph: {
      ...grafoCor,
      caption: 'A, B e D são mutuamente adjacentes: uma clique de tamanho 3',
      nodes: [
        { id: 'A', x: 250, y: 110, state: 'active' },
        { id: 'B', x: 470, y: 80, state: 'active' },
        { id: 'C', x: 110, y: 300 },
        { id: 'D', x: 440, y: 280, state: 'active' },
        { id: 'E', x: 670, y: 190 }
      ],
      edges: [
        { from: 'A', to: 'B', state: 'active' },
        { from: 'A', to: 'D', state: 'active' },
        { from: 'B', to: 'D', state: 'active' },
        { from: 'A', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'B', to: 'E' },
        { from: 'D', to: 'E' }
      ]
    }
  },
  {
    type: 'code',
    eyebrow: 'O algoritmo',
    title: 'Guloso: a menor cor ausente na vizinhança já pintada',
    description: 'Percorre os vértices numa ordem fixa e **nunca volta atrás**. Custo Θ(n + m), e usa no máximo Δ + 1 cores.',
    lines: [
      'GULOSO(G, ordem):',
      '  para v em ordem:',
      '    usadas ← { c(u) : u vizinho de v JÁ pintado }',
      '    c(v)   ← menor inteiro ≥ 0 que NÃO está em usadas',
      '',
      '// garante coloração própria',
      '// NÃO garante o mínimo de cores'
    ],
    note: {
      kind: 'tip',
      title: 'Welch-Powell é só uma escolha de ordem',
      text: 'A heurística de Welch-Powell é rodar este mesmo guloso na ordem de grau DECRESCENTE. Costuma economizar cores, mas continua sem garantia de ótimo.'
    }
  },

  // --- guloso passo a passo, na ordem de grau decrescente (Welch-Powell) --
  ...tracoColoracao({ base: grafoCor, ordem: ['D', 'A', 'B', 'C', 'E'], eyebrow: 'Guloso · ordem de grau decrescente' }),

  {
    type: 'graph',
    eyebrow: 'Onde o guloso erra',
    title: 'A ordem decide: 3 cores num grafo de χ = 2',
    description: 'Este grafo é **bipartido** — os lados são {u₁,u₂,u₃} e {v₁,v₂,v₃}, então χ = 2. Mas o guloso na ordem u₁, v₁, u₂, v₂, u₃, v₃ gasta **três** cores.',
    graph: { ...coroa, caption: 'u₁=0, v₁=0, u₂=1, v₂=1, u₃=2, v₃=2 — três cores para χ = 2' },
    points: [
      'A cada par, os vizinhos já pintados bloqueiam mais uma cor, e o guloso abre uma nova.',
      'Bastava pintar todos os u de uma cor e todos os v de outra — e a ordem u₁,u₂,u₃,v₁,v₂,v₃ faz exatamente isso.'
    ],
    note: {
      kind: 'warn',
      title: 'A conclusão que a prova cobra',
      text: 'O resultado do guloso é um LIMITE SUPERIOR para χ, nunca o valor. Escrever "χ = 3 porque o guloso deu 3" é erro — aqui a resposta certa é 2.'
    }
  },
  {
    type: 'compare',
    eyebrow: 'De onde vem o grafo que você colore',
    title: 'As duas construções clássicas',
    columns: [
      {
        title: 'Mapa → grafo dual',
        description: 'Colorir países vizinhos com cores distintas.',
        items: [
          'Vértice = **região**',
          'Aresta = **fronteira de comprimento positivo**',
          'Um ponto de encontro (canto) NÃO é fronteira',
          'Mapa é planar ⇒ χ ≤ 4 (Teorema das Quatro Cores)'
        ]
      },
      {
        title: 'Horários → grafo de conflito',
        description: 'Marcar provas sem chocar alunos.',
        items: [
          'Vértice = **disciplina**',
          'Aresta = **existe aluno matriculado nas duas**',
          'χ = número mínimo de horários',
          'Sem aresta dentro de um lado: 2 horários bastam'
        ]
      }
    ],
    note: {
      kind: 'key',
      title: 'Onde estão os erros nesse tipo de questão',
      text: 'Quase todos na construção de V e E, não na coloração. Escreva a regra de vértice e de aresta antes de escolher a primeira cor.'
    }
  }
];
