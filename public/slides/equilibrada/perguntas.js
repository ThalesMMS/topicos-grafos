/** Atividades autorais; não são questões oficiais nem adaptações atribuídas ao INEP.
 * Mesma fonte de alternativas para o telão e o celular, sem duplicar strings.
 */
export const QUESTOES = [
  {
    "id": "fundamentos",
    "module": "fundamentos",
    "theme": "Representações e subgrafos",
    "statement": "G é o ciclo A–B–C–D–A, simples e não dirigido.",
    "question": "Qual afirmação está correta?",
    "options": [
      "A matriz de adjacência é 4 × 4 e simétrica.",
      "O subgrafo induzido por {A,B,C} contém a aresta A–C.",
      "Todo subgrafo gerador precisa ser conexo.",
      "A soma dos graus de G é 4."
    ],
    "answer": "a",
    "why": "Há uma linha e uma coluna por vértice; a adjacência é simétrica. G[{A,B,C}] contém somente AB e BC. Gerador significa manter V, não conexidade. Os quatro graus 2 somam 8 = 2m."
  },
  {
    "id": "buscas",
    "module": "conectividade",
    "theme": "Conectividade e BFS",
    "statement": "G é não dirigido e sem pesos: V={A,B,C,D,E}; E={AB,AC,BD,CD,DE}.",
    "question": "Uma BFS a partir de A garante qual resultado?",
    "options": [
      "Um caminho de custo mínimo com quaisquer pesos.",
      "dist(A,E)=3 e uma árvore com quatro arestas.",
      "Toda árvore de busca é a única árvore geradora de G.",
      "A primeira visita de E pode ter nível 2."
    ],
    "answer": "b",
    "why": "As camadas são {A}, {B,C}, {D}, {E}. A BFS mede número de arestas: E fica no nível 3. Como os cinco vértices são alcançados, há quatro arestas de descoberta. A ordem dos vizinhos pode alterar a árvore, não as distâncias."
  },
  {
    "id": "otimizacao",
    "module": "caminhos",
    "theme": "AGM versus caminhos mínimos",
    "statement": "Um grafo não dirigido tem apenas AB=2, AC=3 e BC=2. Deseja-se conectar os três vértices pelo menor custo total e, separadamente, viajar de A a C.",
    "question": "Quais são os custos ótimos desses dois problemas?",
    "options": [
      "AGM=3; caminho A→C=3.",
      "AGM=4; caminho A→C=4.",
      "AGM=4; caminho A→C=3.",
      "AGM=5; caminho A→C=4."
    ],
    "answer": "c",
    "why": "A AGM usa AB e BC e custa 2+2=4. Já o menor caminho de A a C é a aresta AC, de custo 3. O caminho dentro da AGM custa 4: os objetivos não são intercambiáveis."
  },
  {
    "id": "planaridade",
    "module": "planaridade",
    "theme": "Planaridade e coloração",
    "statement": "K₃,₃ é o grafo bipartido completo com três vértices em cada parte: n=6, m=9.",
    "question": "Qual conclusão é correta?",
    "options": [
      "É planar porque 9 ≤ 3×6−6.",
      "É não planar e seu número cromático é 2.",
      "É não planar, portanto exige pelo menos 5 cores.",
      "Ser bipartido implica ser planar."
    ],
    "answer": "b",
    "why": "Se fosse planar, o limite para grafos simples bipartidos daria m≤2n−4=8; mas m=9. Duas cores bastam, uma por parte, e uma não basta porque existem arestas. Não planaridade não implica número cromático alto."
  },
  {
    "id": "fluxo",
    "module": "fluxo",
    "theme": "Fluxo máximo e corte mínimo",
    "statement": "Uma rede admite um fluxo viável de valor 5. Também foi encontrado um corte s–t de capacidade 5.",
    "question": "O que esses dois resultados certificam?",
    "options": [
      "Somente que o fluxo respeita as capacidades.",
      "Que todas as arestas da rede estão saturadas.",
      "Que o menor caminho s→t tem custo 5.",
      "Que o fluxo é máximo e o corte é mínimo."
    ],
    "answer": "d",
    "why": "Qualquer fluxo viável tem valor menor ou igual à capacidade de qualquer corte s–t. A igualdade 5=5 fecha os limites inferior e superior. Não é necessário saturar todas as arestas, nem todos os arcos de saída da fonte."
  }
];
export const polls = Object.fromEntries(QUESTOES.map(q => [
  `revisao_${q.id}`, {
    question: `Exercício autoral — ${q.statement} ${q.question}`,
    type: 'single',
    options: q.options.map((label, i) => ({ id: 'abcd'[i], label: `${'ABCD'[i]}) ${label}` }))
  }
]));
function localizar(id) {
  const q = QUESTOES.find(q => q.id === id);
  if (!q) throw new Error(`Questão inexistente: ${id}`);
  return q;
}
export function pergunta(id) {
  const q = localizar(id);
  return {
    id: `questao-${id}`, type: 'question', source: `Exercício autoral · ${q.theme}`,
    statement: q.statement, question: q.question, answer: q.answer,
    poll: `revisao_${id}`,
    alternatives: q.options.map((text, i) => ({ id: 'abcd'[i], text }))
  };
}
export function resposta(id) {
  const q = localizar(id);
  return {
    ...pergunta(id), id: `resposta-${id}`, reveal: true,
    answerLabel: 'Resolução · exercício autoral', why: q.why
  };
}
