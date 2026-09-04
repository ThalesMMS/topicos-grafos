/**
 * Abertura — capa e contrato. Dois slides, sem enrolação.
 */

export const abertura = [
  {
    type: 'cover',
    eyebrow: 'Teoria dos Grafos',
    title: 'Algoritmos de grafos,',
    highlight: 'passo a passo',
    description: 'Aponte a câmera para o QR code. Você vai votar em cinco questões do ENADE — e ver cada algoritmo rodar antes delas.'
  },
  {
    type: 'section',
    kicker: 'Como funciona',
    minutes: 2,
    title: 'Oito blocos, cinco questões do ENADE.',
    description: 'Cada questão vem **depois** do algoritmo que a resolve. Você vota pelo celular, a sala vê o resultado, e aí discutimos o gabarito.',
    topics: [
      '1 · Grau e aperto de mãos → ENADE 2011',
      '2 · Componentes conexos → ENADE 2023',
      '3 · Busca: BFS e DFS passo a passo',
      '4 · Caminhos mínimos → ENADE 2021 e 2023 (×2)',
      '5 · Árvore geradora mínima',
      '6 · Dígrafos e ordenação topológica',
      '7 · Euler e Hamilton',
      '8 · Coloração'
    ]
  }
];
