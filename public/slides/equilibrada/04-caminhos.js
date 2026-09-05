import * as G from './modelos.js';
import * as A from './simulacoes.js';
import { pergunta, resposta } from './perguntas.js';

export const slides = [
  {
    "id": "sec-caminhos",
    "type": "section",
    "title": "4 · Caminhos mínimos",
    "description": "Escolher pelo objetivo, pelos pesos e pelas hipóteses de correção."
  },
  {
    "id": "pesos",
    "type": "concept",
    "title": "Menos arestas não é menor custo",
    "graph": G.rotas,
    "description": "S–A–T tem duas arestas e custa 9. S–A–B–T tem três e custa 6.",
    "points": [
      "BFS minimiza número de arestas; com pesos iguais não negativos, também minimiza custo.",
      "Dijkstra minimiza custo com pesos não negativos.",
      "Em empate de níveis, BFS pode escolher outra rota: o custo não é seu critério."
    ],
    "cobertura": [
      "caminho-minimo"
    ]
  },
  {
    "id": "relaxamento",
    "type": "code",
    "title": "Descobrir não é finalizar uma distância",
    "lines": [
      "Inicializar d[s]=0; demais d[v]=∞",
      "Extrair u com menor d entre os não finalizados",
      "Finalizar u; para cada arco u→v:",
      "  se v não finalizado e d[u]+w(u,v)<d[v]:",
      "    d[v] ← d[u]+w(u,v)",
      "    pai[v] ← u; atualizar prioridade de v"
    ],
    "description": "Depois de S, B tem estimativa 5. A ainda pode melhorá-la para 3.",
    "note": {
      "kind": "key",
      "title": "Invariante de Dijkstra",
      "text": "O menor aberto só é definitivo porque nenhum arco reduz o custo por ter peso negativo."
    },
    "cobertura": [
      "relaxamento",
      "dijkstra"
    ]
  },
  {
    "id": "dijkstra",
    "type": "trace",
    "title": "Dijkstra: quatro extrações, uma tabela",
    "graph": G.destacar(G.rotas,{edges:[['S','A'],['A','B'],['B','T']],notes:A.dijkstra(G.rotas,'S').distance,caption:'Pais finais: A←S; B←A; T←B. Rota S–A–B–T.'}),
    "headers": [
      "Finaliza",
      "d(S)",
      "d(A)",
      "d(B)",
      "d(T)"
    ],
    "rows": A.dijkstra(G.rotas,'S').frames.map(f=>[f.u,...['S','A','B','T'].map(id=>A.mostrar(f.distance[id]))]),
    "description": "A origem conta como a primeira extração. Reconstruir o caminho pelos pais e conferir a soma: 2+1+3=6.",
    "note": {
      "kind": "key",
      "title": "Custo depende da implementação",
      "text": "Com heap e listas: O((n+m) log n). A simulação pequena deste slide usa varredura O(n²+m), sem heap."
    },
    "cobertura": [
      "dijkstra-execucao"
    ]
  },
  {
    "id": "algoritmos-caminhos",
    "type": "table",
    "title": "Qual problema cada algoritmo resolve?",
    "headers": [
      "Algoritmo",
      "Problema / hipótese",
      "Custo usual"
    ],
    "rows": [
      [
        "BFS",
        "Uma origem; sem pesos ou pesos iguais ≥0",
        "O(n+m)"
      ],
      [
        "Dijkstra",
        "Uma origem; pesos não negativos",
        "O((n+m) log n), com heap"
      ],
      [
        "Bellman–Ford",
        "Uma origem; admite pesos negativos",
        "O(nm)"
      ],
      [
        "Floyd–Warshall",
        "Todos os pares; admite pesos negativos",
        "O(n³)"
      ]
    ],
    "note": {
      "kind": "warn",
      "title": "Ciclos negativos",
      "text": "Bellman–Ford detecta ciclos negativos alcançáveis. Floyd–Warshall também detecta: alguma diagonal d[v][v]<0. Um par só fica sem mínimo finito quando pode alcançar um ciclo negativo e depois o destino."
    },
    "cobertura": [
      "bellman-ford",
      "floyd-warshall",
      "ciclo-negativo"
    ]
  },
  pergunta('otimizacao'),
  resposta('otimizacao')
];
