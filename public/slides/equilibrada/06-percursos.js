import * as G from './modelos.js';

export const slides = [
  {
    "id": "sec-euler",
    "type": "section",
    "title": "6 · Euler e Hamilton",
    "description": "O que não pode ser repetido: arestas ou vértices?"
  },
  {
    "id": "euler-hamilton",
    "type": "compare",
    "title": "Perguntas semelhantes, garantias distintas",
    "columns": [
      {
        "title": "Euler: arestas",
        "items": [
          "Usar cada aresta exatamente uma vez.",
          "Vértices podem ser repetidos.",
          "No não dirigido: paridades e conectividade decidem."
        ]
      },
      {
        "title": "Hamilton: vértices",
        "items": [
          "Visitar todos os vértices sem repetir.",
          "Para ciclo, retornar ao primeiro.",
          "Critérios suficientes não substituem uma decisão geral."
        ]
      }
    ],
    "note": {
      "kind": "key",
      "title": "Critério de Euler",
      "text": "Não dirigido, ignorando vértices isolados: conexo + zero graus ímpares ⇒ circuito euleriano; exatamente dois ⇒ trajeto aberto. Em dígrafos, acrescentar condições de conectividade às de balanço dos graus."
    },
    "cobertura": [
      "euler",
      "hamilton"
    ]
  },
  {
    "id": "fleury",
    "type": "concept",
    "title": "Construir sem abandonar arestas",
    "graph": G.destacar(G.euler,{nodes:{c:'active',d:'active'},caption:'c–a–b–c–d–e–f–d: cada uma das sete arestas uma vez.'}),
    "description": "Fleury evita uma ponte no grafo restante enquanto houver outra opção. Começa em c, um dos dois vértices ímpares.",
    "note": {
      "kind": "key",
      "title": "Decisão ≠ construção",
      "text": "Decidir existência é O(n+m). Fleury com testes repetidos de ponte não é linear (O(m²) na implementação usual). Hierholzer constrói e intercala circuitos enquanto restam arestas, em tempo linear."
    },
    "cobertura": [
      "fleury"
    ]
  },
  {
    "id": "dirac",
    "type": "concept",
    "title": "Condição suficiente não é condição necessária",
    "graph": G.ciclo5,
    "description": "Dirac: em grafo simples não dirigido, n≥3 e grau mínimo≥n/2 garantem ciclo hamiltoniano.",
    "points": [
      "C₅ é hamiltoniano, mas seu grau mínimo 2 é menor que 5/2.",
      "Falhar no teste não prova inexistência."
    ],
    "note": {
      "kind": "key",
      "title": "Limite do critério",
      "text": "Decidir Hamilton no caso geral é NP-completo. Isso não significa que toda instância ou toda classe de grafos seja difícil."
    },
    "cobertura": [
      "hamilton-suficiencia"
    ]
  }
];
