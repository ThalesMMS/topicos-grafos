import * as G from './modelos.js';

export const slides = [
  {
    "id": "sec-digrafos",
    "type": "section",
    "title": "5 · Dígrafos e dependências",
    "description": "A direção altera quem alcança quem; componentes fortes não são simples componentes do desenho sem setas."
  },
  {
    "id": "fechos",
    "type": "concept",
    "title": "Fechos direto e inverso",
    "graph": G.dirigido,
    "description": "Incluímos o próprio vértice, pelo caminho de comprimento zero.",
    "points": [
      "Fecho direto de b: {b,c,d}, os vértices alcançáveis a partir de b.",
      "Fecho inverso de b: {a,b,c}, os que conseguem alcançar b.",
      "A interseção {b,c} é sua componente fortemente conexa."
    ],
    "note": {
      "kind": "key",
      "title": "Graus no dirigido",
      "text": "d⁺ conta saídas; d⁻ conta entradas. ∑d⁺=∑d⁻=m."
    },
    "cobertura": [
      "fecho-direto",
      "fecho-inverso",
      "cfc"
    ]
  },
  {
    "id": "conectividade-dirigida",
    "type": "compare",
    "title": "Três níveis de conectividade",
    "columns": [
      {
        "title": "Fraca / simples",
        "items": [
          "O grafo sem as direções é conexo.",
          "Não exige caminho dirigido entre todo par."
        ]
      },
      {
        "title": "Semiforte",
        "items": [
          "Para cada par u,v: u alcança v OU v alcança u.",
          "O exemplo a→b↔c→d é semiforte."
        ]
      },
      {
        "title": "Forte",
        "items": [
          "Para cada par u,v: há caminho nos DOIS sentidos.",
          "As CFCs do exemplo são {a}, {b,c}, {d}."
        ]
      }
    ],
    "note": {
      "kind": "key",
      "title": "Hierarquia",
      "text": "Forte ⇒ semiforte ⇒ fraca; as recíprocas falham. Kosaraju identifica CFCs com duas DFS e o grafo transposto; detalhes ficam para aprofundamento."
    },
    "cobertura": [
      "conectividade-dirigida",
      "kosaraju"
    ]
  },
  {
    "id": "topologica",
    "type": "steps",
    "title": "Ordenação topológica: respeitar precedências",
    "description": "DAG é um dígrafo acíclico. Uma ordem topológica coloca u antes de v para todo arco u→v.",
    "graph": G.dag,
    "items": [
      {
        "title": "Inicializar graus de entrada",
        "text": "Manter na fila os vértices com grau de entrada zero."
      },
      {
        "title": "Emitir um vértice pronto",
        "text": "Removê-lo e reduzir os graus de entrada dos seus sucessores."
      },
      {
        "title": "Repetir até esvaziar a fila",
        "text": "1,2,3,4,5 e 1,3,2,4,5 são válidas neste DAG."
      }
    ],
    "note": {
      "kind": "key",
      "title": "Critério de parada",
      "text": "Kahn custa O(n+m). Se emite menos de n vértices, existe ciclo. Não é necessário executar outra DFS antes."
    },
    "cobertura": [
      "dag",
      "ordenacao-topologica"
    ]
  }
];
