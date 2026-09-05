import * as G from './modelos.js';
import * as A from './simulacoes.js';

export const slides = [
  {
    "id": "sec-arvores",
    "type": "section",
    "title": "3 · Árvores e custo de conexão",
    "description": "Conectar todos os vértices, sem ciclos, minimizando a soma total dos pesos."
  },
  {
    "id": "arvore",
    "type": "definition",
    "title": "Árvore: conexa e acíclica",
    "formulas": [
      "G não dirigido: árvore ⇔ conexo e acíclico",
      "Conexo e m=n−1 ⇔ árvore",
      "Acíclico e m=n−1 ⇔ árvore",
      "Em uma árvore: caminho simples único entre cada par"
    ],
    "description": "Uma árvore geradora mantém todos os vértices de um grafo conexo e seleciona n−1 arestas.",
    "note": {
      "kind": "key",
      "title": "Hipóteses",
      "text": "Em um grafo desconexo, o análogo é a floresta geradora mínima. Pesos negativos são permitidos em AGM."
    },
    "cobertura": [
      "arvore",
      "agm"
    ]
  },
  {
    "id": "corte-agm",
    "type": "concept",
    "title": "A aresta mais leve de um corte é segura",
    "graph": G.destacar(G.ponderado,{nodes:{A:'done',B:'done',D:'done'},edges:[['B','E']],caption:'S={A,B,D}: BE=5 é a menor entre BE, BC e DE.'}),
    "description": "Um corte divide V em S e V\\S. Entre as arestas que o atravessam, uma de peso mínimo pertence a alguma AGM.",
    "points": [
      "Se essa aresta não está numa AGM, adicioná-la cria um ciclo.",
      "O ciclo atravessa o corte de volta por uma aresta de peso não menor.",
      "Trocar essas arestas mantém uma árvore e não aumenta o custo."
    ],
    "cobertura": [
      "corte-seguro"
    ]
  },
  {
    "id": "kruskal",
    "type": "trace",
    "title": "Kruskal: unir componentes sem fechar ciclos",
    "graph": G.destacar(G.ponderado,{edges:A.kruskal(G.ponderado).accepted.map(e=>[e.from,e.to]),caption:'AGM: AB, AD, CE, BE; custo 13.'}),
    "headers": [
      "Aresta",
      "Peso",
      "Decisão",
      "Custo"
    ],
    "rows": A.kruskal(G.ponderado).frames.map(f=>[f.edge.from+'–'+f.edge.to,f.edge.weight,f.take?'aceita':'recusa: ciclo',f.cost]),
    "description": "Ordena arestas por peso; união-busca verifica se os extremos já pertencem ao mesmo componente.",
    "note": {
      "kind": "key",
      "title": "Implementação",
      "text": "O(m log m) para ordenar; find/union quase constantes amortizados exigem compressão de caminhos e união por rank/tamanho."
    },
    "cobertura": [
      "kruskal"
    ]
  },
  {
    "id": "prim",
    "type": "steps",
    "title": "Prim: expandir uma única árvore",
    "items": [
      {
        "title": "Começar em A",
        "text": "Chaves: B=2, D=3, C=∞, E=∞."
      },
      {
        "title": "Adicionar B, depois D",
        "text": "Entram AB=2 e AD=3; BE=5 é a melhor entrada de E."
      },
      {
        "title": "Adicionar E",
        "text": "Entra BE=5. A chave de C cai de 6 para 3 via E."
      },
      {
        "title": "Adicionar C",
        "text": "Entra CE=3. Custo total=13, como em Kruskal."
      }
    ],
    "note": {
      "kind": "key",
      "title": "Diferença essencial",
      "text": "Chave de Prim é o peso da aresta de entrada, não a distância acumulada de Dijkstra. Com matriz: O(n²); com heap e listas: O((n+m) log n)."
    },
    "cobertura": [
      "prim"
    ]
  }
];
