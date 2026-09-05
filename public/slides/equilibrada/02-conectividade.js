import * as G from './modelos.js';
import * as A from './simulacoes.js';
import { pergunta, resposta } from './perguntas.js';

export const slides = [
  {
    "id": "sec-conectividade",
    "type": "section",
    "title": "2 · Conectividade e buscas",
    "description": "Entender alcançabilidade, medir distâncias e explorar sistematicamente o grafo."
  },
  {
    "id": "percursos-basicos",
    "type": "table",
    "title": "Passeio, trajeto e caminho",
    "headers": [
      "Objeto",
      "Pode repetir aresta?",
      "Pode repetir vértice?"
    ],
    "rows": [
      [
        "Passeio",
        "Sim",
        "Sim"
      ],
      [
        "Trajeto / trilha",
        "Não",
        "Sim"
      ],
      [
        "Caminho simples",
        "Não",
        "Não"
      ],
      [
        "Ciclo simples",
        "Não",
        "Só o primeiro no fechamento"
      ]
    ],
    "note": {
      "kind": "key",
      "title": "Distância",
      "text": "Comprimento é número de arestas. Distância é o MENOR comprimento entre dois vértices; um passeio qualquer não prova minimalidade."
    },
    "cobertura": [
      "passeio",
      "trilha",
      "caminho",
      "distancia"
    ]
  },
  {
    "id": "componentes",
    "type": "concept",
    "title": "Componentes são blocos maximais conexos",
    "graph": G.componentes,
    "description": "No não dirigido, u e v estão no mesmo componente quando existe um caminho entre eles.",
    "points": [
      "Maximal significa que não pode ser ampliado mantendo a propriedade; não significa “o maior componente”.",
      "Alcançabilidade, admitindo caminho de comprimento zero, é reflexiva, simétrica e transitiva.",
      "Cada classe de equivalência é um componente, inclusive um vértice isolado."
    ],
    "note": {
      "kind": "key",
      "title": "Contagem útil",
      "text": "Com n vértices e k componentes, uma floresta geradora tem n−k arestas."
    },
    "cobertura": [
      "componentes",
      "equivalencia"
    ]
  },
  {
    "id": "metricas",
    "type": "trace",
    "title": "Raio e diâmetro vêm das menores distâncias",
    "graph": G.rede,
    "headers": [
      "v",
      "d(A)",
      "d(B)",
      "d(C)",
      "d(D)",
      "d(E)",
      "ecc(v)"
    ],
    "rows": G.rede.nodes.map(({id}) => { const d=A.bfs(G.rede,id).distance; return [id,...G.rede.nodes.map(n=>A.mostrar(d[n.id])),A.mostrar(Math.max(...Object.values(d)))]; }),
    "description": "ecc(v)=maxᵤ d(v,u); raio=min ecc; diâmetro=max ecc.",
    "note": {
      "kind": "key",
      "title": "Leitura da tabela",
      "text": "Raio=2; diâmetro=3; centro={B,C,D}. Diâmetro não é o caminho mais longo. Em grafos desconexos, declarar a convenção ou calcular por componente."
    },
    "cobertura": [
      "excentricidade",
      "raio",
      "diametro",
      "centro"
    ]
  },
  {
    "id": "pontes",
    "type": "concept",
    "title": "Conexidade não significa resistência a falhas",
    "graph": G.destacar(G.rede,{nodes:{D:'warn'},edges:[['D','E']],caption:'D é articulação; DE é ponte.'}),
    "description": "Ponte: aresta cuja remoção aumenta o número de componentes. Articulação: vértice com esse efeito.",
    "points": [
      "Remover DE isola E.",
      "Remover D separa E do restante.",
      "Remover AB não desconecta: há o desvio A–C–D–B."
    ],
    "cobertura": [
      "ponte",
      "articulacao"
    ]
  },
  {
    "id": "bfs-regra",
    "type": "code",
    "title": "BFS: descobrir uma vez, processar em fila",
    "lines": [
      "BFS(G,s):",
      "  dist[v] ← ∞ para todo v; marcar s",
      "  dist[s] ← 0; fila ← [s]",
      "  enquanto fila não vazia:",
      "    u ← remover do início",
      "    para v em adj(u):",
      "      se v ainda não descoberto:",
      "        dist[v] ← dist[u]+1; pai[v] ← u",
      "        marcar v e inserir no fim"
    ],
    "note": {
      "kind": "key",
      "title": "Custo e floresta",
      "text": "Com listas: O(n+m). Para percorrer o grafo inteiro, repetir a busca a partir dos vértices ainda não descobertos."
    },
    "cobertura": [
      "bfs"
    ]
  },
  {
    "id": "bfs-execucao",
    "type": "trace",
    "title": "BFS a partir de A",
    "graph": G.destacar(G.rede,{edges:Object.entries(A.bfs(G.rede,'A').parent).filter(([,p])=>p!==null).map(([v,p])=>[p,v]),notes:A.bfs(G.rede,'A').distance,caption:'Vizinhos em ordem alfabética; níveis 0,1,1,2,3.'}),
    "headers": [
      "Retira",
      "Descobre",
      "Fila após processar"
    ],
    "rows": A.bfs(G.rede,'A').frames.map(f=>[f.u,f.discovered.join(', ')||'—',f.queue.join(', ')||'vazia']),
    "description": "Cada nível é a distância em número de arestas.",
    "note": {
      "kind": "key",
      "title": "Invariante",
      "text": "Outra ordem de vizinhos pode mudar os pais, mas não as distâncias."
    },
    "cobertura": [
      "bfs-execucao"
    ]
  },
  {
    "id": "dfs-regra",
    "type": "code",
    "title": "DFS: terminar um ramo antes de outro",
    "lines": [
      "VISITA(u):",
      "  u ← cinza; registrar descoberta",
      "  para v em adj(u):",
      "    se v é branco:",
      "      pai[v] ← u; VISITA(v)",
      "  u ← preto; registrar término"
    ],
    "description": "A recursão usa uma pilha. Branco: não descoberto; cinza: ativo; preto: concluído.",
    "note": {
      "kind": "key",
      "title": "Cuidado na detecção",
      "text": "No não dirigido, ignorar a volta pela própria aresta do pai ao detectar ciclos. Arestas paralelas exigem identificar a aresta, não só o pai."
    },
    "cobertura": [
      "dfs"
    ]
  },
  {
    "id": "dfs-execucao",
    "type": "trace",
    "title": "DFS registra entrada e saída",
    "graph": G.destacar(G.rede,{edges:Object.entries(A.dfs(G.rede,'A').parent).filter(([,p])=>p!==null).map(([v,p])=>[p,v]),caption:'Ordem alfabética dos vizinhos.'}),
    "headers": [
      "v",
      "Pai",
      "Descoberta",
      "Término"
    ],
    "rows": G.rede.nodes.map(({id})=>{const d=A.dfs(G.rede,'A');return [id,A.mostrar(d.parent[id]),d.discovery[id],d.finish[id]];}),
    "description": "Os intervalos de descoberta/término são aninhados ou disjuntos. Listas permitem O(n+m).",
    "cobertura": [
      "dfs-execucao"
    ]
  },
  {
    "id": "escolher-busca",
    "type": "compare",
    "title": "As garantias são diferentes",
    "columns": [
      {
        "title": "BFS",
        "items": [
          "Fila; níveis por distância.",
          "Menor número de arestas.",
          "Teste de bipartição com duas cores."
        ]
      },
      {
        "title": "DFS",
        "items": [
          "Pilha; descoberta e término.",
          "Ciclos e ordenação topológica.",
          "Base para componentes fortes e pontes."
        ]
      },
      {
        "title": "Ambas",
        "items": [
          "Alcançabilidade e componentes.",
          "Árvore/floresta de descoberta.",
          "Não minimizam custos arbitrários."
        ]
      }
    ],
    "note": {
      "kind": "warn",
      "title": "Não confundir o esqueleto com o algoritmo",
      "text": "Dijkstra e Prim precisam atualizar estimativas. Não basta trocar a fila por um heap no pseudocódigo da BFS."
    },
    "cobertura": [
      "bfs-dfs-comparacao"
    ]
  },
  pergunta('buscas'),
  resposta('buscas')
];
