import * as G from './modelos.js';
import { pergunta, resposta } from './perguntas.js';

export const slides = [
  {
    "id": "sec-fundamentos",
    "type": "section",
    "title": "1 · Fundamentos e representações",
    "description": "Modelar, reconhecer a estrutura e ler os dados antes de escolher um algoritmo."
  },
  {
    "id": "modelagem",
    "type": "concept",
    "title": "Do problema para G = (V, E)",
    "graph": G.rede,
    "description": "Neste campus, A–E são prédios e cada aresta é uma ligação direta de fibra. V representa os objetos; E, a relação. n=|V| e m=|E|.",
    "points": [
      "Uma ligação tem sentido? Use arcos ordenados (u,v).",
      "Custo, distância e capacidade são pesos com significados diferentes.",
      "Adjacência: vértice–vértice. Incidência: vértice–aresta. Grau: quantas incidências chegam ao vértice."
    ],
    "note": {
      "kind": "key",
      "title": "Grau e aperto de mãos",
      "text": "No não dirigido, ∑ grau(v)=2m; um laço conta duas vezes. O número de graus ímpares é par."
    },
    "cobertura": [
      "modelagem",
      "adjacencia",
      "incidencia",
      "grau"
    ]
  },
  {
    "id": "familias",
    "type": "table",
    "title": "Famílias que mudam a interpretação",
    "headers": [
      "Família",
      "O que verificar",
      "Contagem"
    ],
    "rows": [
      [
        "Simples",
        "Sem laços nem arestas paralelas",
        "No não dirigido: m≤n(n−1)/2"
      ],
      [
        "Completo Kₙ",
        "Todo par distinto é adjacente",
        "m=n(n−1)/2"
      ],
      [
        "r-regular",
        "Todos os graus iguais a r",
        "2m=nr"
      ],
      [
        "Bipartido",
        "Duas partes; sem aresta interna",
        "Kₚ,ᵩ tem p+q vértices e pq arestas"
      ],
      [
        "Complementar de G",
        "Mesmos vértices; arestas ausentes em G",
        "G simples, não dirigido"
      ],
      [
        "Caminho / ciclo",
        "Pₙ / Cₙ",
        "n−1 / n arestas"
      ]
    ],
    "note": {
      "kind": "key",
      "title": "Estrutura, não aparência",
      "text": "Um desenho em duas colunas não prova bipartição. É necessário que toda aresta ligue partes distintas."
    },
    "cobertura": [
      "familias",
      "biparticao",
      "complementar"
    ]
  },
  {
    "id": "isomorfismo",
    "type": "definition",
    "title": "Isomorfismo preserva adjacências",
    "graph": G.isomorfos,
    "formulas": [
      "φ: V(G) → V(H) é uma bijeção",
      "{u,v} ∈ E(G) ⇔ {φ(u),φ(v)} ∈ E(H)"
    ],
    "description": "Para grafos simples não dirigidos: relabelar e redesenhar não altera a estrutura.",
    "points": [
      "Diferença em n, m, graus ou componentes descarta isomorfismo.",
      "Concordar nesses invariantes não basta: é preciso verificar um mapeamento.",
      "No desenho: 1↦d, 2↦a, 3↦b, 4↦c preserva todas as quatro arestas."
    ],
    "cobertura": [
      "isomorfismo"
    ]
  },
  {
    "id": "subgrafos",
    "type": "compare",
    "title": "Induzido não é o mesmo que gerador",
    "columns": [
      {
        "title": "Subgrafo",
        "items": [
          "Escolhe subconjuntos de vértices e arestas.",
          "Nenhuma aresta pode ficar sem seus extremos."
        ]
      },
      {
        "title": "Induzido G[S]",
        "items": [
          "Escolhe S⊆V.",
          "Mantém TODAS as arestas de G entre vértices de S."
        ]
      },
      {
        "title": "Gerador",
        "items": [
          "Mantém TODOS os vértices.",
          "Pode remover arestas e ficar desconexo."
        ]
      }
    ],
    "note": {
      "kind": "key",
      "title": "Operações básicas",
      "text": "No ciclo A–B–C–D–A: o induzido por {A,B,C} contém AB e BC. Remover apenas DA mantém os quatro vértices e produz um subgrafo gerador."
    },
    "cobertura": [
      "subgrafo",
      "induzido",
      "gerador"
    ]
  },
  {
    "id": "incidencia",
    "type": "trace",
    "title": "Incidência: vértice × aresta",
    "graph": G.quadrado,
    "headers": [
      "",
      "e1",
      "e2",
      "e3",
      "e4"
    ],
    "rows": [
      [
        "A",
        "1",
        "0",
        "0",
        "1"
      ],
      [
        "B",
        "1",
        "1",
        "0",
        "0"
      ],
      [
        "C",
        "0",
        "1",
        "1",
        "0"
      ],
      [
        "D",
        "0",
        "0",
        "1",
        "1"
      ]
    ],
    "description": "Neste grafo sem laços, cada coluna tem dois 1. A soma de uma linha dá o grau.",
    "note": {
      "kind": "key",
      "title": "Versão dirigida",
      "text": "No dirigido, a convenção é −1 na origem e +1 no destino. Laços exigem tratamento explícito."
    },
    "cobertura": [
      "matriz-incidencia"
    ]
  },
  {
    "id": "adjacencia",
    "type": "trace",
    "title": "Adjacência: vértice × vértice",
    "graph": G.quadrado,
    "headers": [
      "",
      "A",
      "B",
      "C",
      "D"
    ],
    "rows": [
      [
        "A",
        "0",
        "1",
        "0",
        "1"
      ],
      [
        "B",
        "1",
        "0",
        "1",
        "0"
      ],
      [
        "C",
        "0",
        "1",
        "0",
        "1"
      ],
      [
        "D",
        "1",
        "0",
        "1",
        "0"
      ]
    ],
    "description": "A[u][v]=1 indica uma aresta. No não dirigido, a matriz é simétrica.",
    "note": {
      "kind": "key",
      "title": "Outra representação",
      "text": "Listas equivalentes: A:[B,D]; B:[A,C]; C:[B,D]; D:[A,C]. A relação é a mesma; a estrutura de armazenamento muda."
    },
    "cobertura": [
      "matriz-adjacencia",
      "lista-adjacencia"
    ]
  },
  {
    "id": "custos-representacoes",
    "type": "table",
    "title": "Escolha pela operação, não só pelo desenho",
    "headers": [
      "Estrutura",
      "Espaço",
      "Existe u–v?",
      "Enumerar vizinhos de u"
    ],
    "rows": [
      [
        "Matriz de adjacência",
        "Θ(n²)",
        "Θ(1)",
        "Θ(n)"
      ],
      [
        "Listas não ordenadas",
        "Θ(n+m)",
        "O(grau(u))",
        "Θ(grau(u))"
      ],
      [
        "Matriz de incidência",
        "Θ(nm)",
        "O(m)",
        "O(nm), sem índice auxiliar"
      ]
    ],
    "note": {
      "kind": "key",
      "title": "Hipóteses de implementação",
      "text": "Custos assumem armazenamento convencional. Na incidência, localizar o outro extremo pode exigir percorrer uma coluna. Índices auxiliares mudam o custo."
    },
    "cobertura": [
      "representacoes-custos"
    ]
  },
  pergunta('fundamentos'),
  resposta('fundamentos')
];
