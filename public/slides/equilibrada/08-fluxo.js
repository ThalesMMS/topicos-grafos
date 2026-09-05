import * as G from './modelos.js';
import * as A from './simulacoes.js';
import { pergunta, resposta } from './perguntas.js';

export const slides = [
  {
    "id": "sec-fluxo",
    "type": "section",
    "title": "8 · Fluxo máximo",
    "description": "A capacidade limita o transporte; a rede residual permite corrigir escolhas anteriores."
  },
  {
    "id": "fluxo-viavel",
    "type": "definition",
    "title": "Capacidade e conservação",
    "formulas": [
      "0 ≤ f(u,v) ≤ c(u,v)",
      "v≠s,t: entrada = saída",
      "|f| = saída líquida de s",
      "    = entrada líquida em t"
    ],
    "graph": G.fluxo,
    "description": "Nesta rede não há arcos entrando em S nem saindo de T. Os números do desenho são capacidades, não custos.",
    "cobertura": [
      "fluxo",
      "conservacao",
      "capacidade"
    ]
  },
  {
    "id": "residual",
    "type": "definition",
    "title": "Residual: folga para frente, cancelamento para trás",
    "formulas": [
      "Para um arco sem antiparalelo na rede original:",
      "capacidade residual à frente = c(u,v)−f(u,v)",
      "capacidade residual reversa = f(u,v)"
    ],
    "description": "Usar v→u na residual desfaz parte do fluxo enviado por u→v. Não é transporte adicional no sentido errado.",
    "points": [
      "Caminho aumentante liga S a T usando somente capacidade residual positiva.",
      "Seu gargalo é a menor capacidade residual desse caminho.",
      "Sem reversas, uma escolha anterior pode impedir a obtenção do máximo."
    ],
    "cobertura": [
      "rede-residual"
    ]
  },
  {
    "id": "ford-fulkerson",
    "type": "trace",
    "title": "Ford–Fulkerson: aumentar e corrigir",
    "graph": ({...G.fluxo,edges:G.fluxo.edges.map((e,i)=>({...e,weight:undefined,label:A.aumentar(G.fluxo,'S','T',G.aumentantes).flows[i]+'/'+e.weight})),caption:'Rótulos: fluxo / capacidade ao final.'}),
    "headers": [
      "Caminho residual",
      "Gargalo",
      "Valor"
    ],
    "rows": A.aumentar(G.fluxo,'S','T',G.aumentantes).frames.map(f=>[f.path.join('→'),f.delta,f.value]),
    "description": "O último caminho usa B→A: cancela uma unidade em A→B. O valor total sobe de 4 para 5.",
    "note": {
      "kind": "key",
      "title": "Escolha do caminho",
      "text": "Com capacidades inteiras: O(m·F), sendo F o valor máximo; é pseudopolinomial. Edmonds–Karp escolhe aumentantes por BFS e tem O(nm²)."
    },
    "cobertura": [
      "ford-fulkerson",
      "edmonds-karp"
    ]
  },
  {
    "id": "corte-minimo",
    "type": "concept",
    "title": "Um corte certifica que não cabe mais fluxo",
    "graph": G.destacar(G.fluxo,{nodes:{S:'active'},edges:[['S','A'],['S','B']],caption:'Corte {S} | {A,B,T}: capacidade 3+2=5.'}),
    "description": "Na residual final, de S só se alcança S. Não há caminho aumentante até T.",
    "points": [
      "Todo fluxo viável tem valor ≤ capacidade de qualquer corte s–t.",
      "O fluxo de valor 5 e o corte de capacidade 5 certificam otimalidade.",
      "Na capacidade do corte dirigido, contar somente arcos do lado da fonte para o outro lado."
    ],
    "note": {
      "kind": "key",
      "title": "Teorema fluxo máximo / corte mínimo",
      "text": "Não é necessário saturar todas as arestas, nem todas as saídas da fonte em uma rede qualquer."
    },
    "cobertura": [
      "fluxo-maximo-corte-minimo"
    ]
  },
  pergunta('fluxo'),
  resposta('fluxo')
];
