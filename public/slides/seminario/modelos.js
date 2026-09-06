import { destacar } from '../equilibrada/modelos.js';
export { destacar };
const n=(id,x,y,note)=>({id,x,y,...(note?{note}:{})});
const e=(from,to,weight)=>({from,to,...(weight===undefined?{}:{weight})});
// Conferido visualmente com ENADE 2021, página 43: todos os onze arcos.
export const provaDijkstra={view:[760,420],directed:true,
  nodes:[n('D',90,215),n('A',260,80),n('B',455,155),n('C',680,75),n('E',680,250),n('F',290,350),n('G',525,350)],
  edges:[e('D','A',5),e('A','B',2),e('D','B',9),e('D','E',5),e('D','F',1),e('F','E',3),e('F','G',1),e('G','E',1),e('E','B',1),e('B','C',8),e('E','C',5)],
  caption:'Redesenho do original. Seta = sentido permitido; número = peso do arco.'};
// A figura original não contém setas: manter conexões não dirigidas.
export const cidades={view:[840,460],directed:false,
  nodes:[n('Manaus',115,125,'h = 2693'),n('P. Velho',125,325,'h = 2464'),n('Macapá',355,75,'h = 2665'),n('Belém',600,75,'h = 2463'),n('Palmas',600,215,'h = 1489'),n('Cuiabá',350,345,'h = 1326'),n('Goiânia',600,355,'h = 809'),n('S. Paulo',780,355,'h = 0')],
  edges:[e('Manaus','Macapá'),e('Manaus','P. Velho'),e('Macapá','Belém'),e('Belém','Palmas'),e('P. Velho','Palmas'),e('P. Velho','Cuiabá'),e('Cuiabá','Goiânia'),e('Palmas','Goiânia'),e('Goiânia','S. Paulo'),{...e('Macapá','S. Paulo'),curve:-280}],
  caption:'h é estimativa até São Paulo; não é o custo da aresta. A ligação Macapá–São Paulo existe.'};
export const floyd={view:[720,380],directed:true,nodes:[n('A',110,235),n('B',355,90),n('C',610,235)],edges:[e('A','B',2),e('B','C',3),e('A','C',9)]};
export const negativo={view:[720,380],directed:true,nodes:[n('S',110,220),n('A',590,220),n('B',355,80)],edges:[e('S','A',2),e('S','B',5),e('B','A',-4)]};
