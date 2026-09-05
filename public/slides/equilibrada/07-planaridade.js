import * as G from './modelos.js';
import * as A from './simulacoes.js';
import { pergunta, resposta } from './perguntas.js';

export const slides = [
  {
    "id": "sec-planaridade",
    "type": "section",
    "title": "7 · Planaridade e coloração",
    "description": "Geometria do desenho e conflitos de cores são propriedades diferentes."
  },
  {
    "id": "planar",
    "type": "concept",
    "title": "Planar: existe um desenho sem cruzamentos",
    "graph": G.k4,
    "description": "K₄ é planar. O desenho sem cruzamentos tem três faces internas e uma externa: f=4.",
    "points": [
      "Planar é propriedade do grafo; plano descreve uma representação sem cruzamentos.",
      "Um desenho com cruzamento, sozinho, não prova não planaridade."
    ],
    "cobertura": [
      "planaridade",
      "faces"
    ]
  },
  {
    "id": "euler-faces",
    "type": "definition",
    "title": "Contar faces e limitar arestas",
    "formulas": [
      "Plano e conexo: n − m + f = 2",
      "Com k componentes: n − m + f = 1 + k",
      "Simples e planar, n≥3: m ≤ 3n−6",
      "Simples, planar e bipartido, n≥3: m ≤ 2n−4"
    ],
    "description": "K₄: 4−6+4=2. A face externa também conta; uma ponte aparece duas vezes no contorno da sua face.",
    "note": {
      "kind": "warn",
      "title": "Necessário, não suficiente",
      "text": "Violar um limite prova não planaridade. Satisfazê-lo não prova planaridade."
    },
    "cobertura": [
      "formula-euler",
      "limites-planaridade"
    ]
  },
  {
    "id": "obstaculos",
    "type": "concept",
    "title": "K₃,₃ passa no limite geral, mas não no bipartido",
    "graph": G.k33,
    "description": "n=6, m=9: 9≤12 não decide. Como é bipartido, o limite seria 2×6−4=8; 9>8 prova não planaridade.",
    "points": [
      "K₅: n=5, m=10; viola 3n−6=9.",
      "Kuratowski: não conter subdivisão de K₅ nem de K₃,₃ caracteriza planaridade."
    ],
    "note": {
      "kind": "key",
      "title": "Obstáculos",
      "text": "Subdividir é inserir vértices de grau 2 nas arestas. A caracterização não exige que K₅ ou K₃,₃ apareçam como subgrafos literais."
    },
    "cobertura": [
      "k5",
      "k33",
      "kuratowski"
    ]
  },
  {
    "id": "coloracao",
    "type": "definition",
    "title": "Colorir é separar vértices em conjuntos independentes",
    "formulas": [
      "c(u) ≠ c(v) para toda aresta {u,v}",
      "χ(G) = menor número de cores numa coloração própria",
      "ω(G) ≤ χ(G) ≤ Δ(G)+1"
    ],
    "description": "Uma clique com k vértices exige k cores. Uma coloração com k cores prova que k cores bastam.",
    "points": [
      "Grafos sem arestas têm χ=1, se V não vazio.",
      "Bipartido ⇔ χ≤2 ⇔ não tem ciclo ímpar, para grafos simples não dirigidos.",
      "Grafo simples planar tem χ≤4; não planar não significa χ>4."
    ],
    "cobertura": [
      "coloracao",
      "numero-cromatico"
    ]
  },
  {
    "id": "guloso-cores",
    "type": "trace",
    "title": "Uma coloração é um limite superior",
    "graph": G.destacar(G.cores,{notes:Object.fromEntries(Object.entries(A.colorir(G.cores,['D','A','B','C','E']).colors).map(([v,c])=>[v,'cor '+c])),caption:'Clique A–B–D: χ≥3. A coloração construída prova χ≤3.'}),
    "headers": [
      "Vértice",
      "Cores já vizinhas",
      "Escolha"
    ],
    "rows": A.colorir(G.cores,['D','A','B','C','E']).frames.map(f=>[f.u,f.used.join(', ')||'nenhuma',f.color]),
    "description": "Ordem por grau decrescente: D, A, B, C, E. Escolher a menor cor ainda permitida.",
    "note": {
      "kind": "key",
      "title": "Verificação dos dois limites",
      "text": "Aqui χ=3 porque há também uma clique de tamanho 3. Em geral, o guloso depende da ordem e não garante o mínimo."
    },
    "cobertura": [
      "coloracao-gulosa"
    ]
  },
  {
    id: 'ordem-cores', type: 'concept',
    title: 'A ordem pode gastar uma cor desnecessária',
    graph: G.destacar(G.coroa, {
      notes: Object.fromEntries(Object.entries(A.colorir(G.coroa, ['u1','v1','u2','v2','u3','v3']).colors).map(([v,c]) => [v, 'cor '+c])),
      caption: 'Ordem u1,v1,u2,v2,u3,v3: o guloso usa três cores.'
    }),
    description: 'Este grafo é bipartido: todos os u podem receber cor 1 e todos os v, cor 2. Logo χ=2.',
    points: ['Na ordem intercalada, o guloso usa três cores.', 'O algoritmo produz uma coloração válida, não necessariamente ótima.'],
    cobertura: ['coloracao-contraexemplo']
  },
  pergunta('planaridade'),
  resposta('planaridade')
];
