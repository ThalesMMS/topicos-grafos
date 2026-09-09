# Grafos, rotas e algoritmos — roteiro de ensaio

Revisão de conteúdo de 07/09/2026. Roteiro ativo: `public/slides/seminario/index.js`.
São 113 slides, quatro partes e orçamento total de 80 minutos. Os tempos são a soma
dos campos `minutes`, não uma duração medida de fala. Há 15 segundos por slide
de passo, dois minutos por questão, um minuto por resolução e 2min40s por
artigo. O ensaio deve orientar o ritmo de apresentação.

## Organização

| Parte | Slides | Orçamento | Conteúdo |
|---|---:|---:|---|
| 1 | 40 | 24min30s | Modelagem, representações, conectividade, BFS, DFS e Dijkstra. ENADE 2021 Q34. |
| 2 | 13 | 13min45s | Métricas da BFS, OSPF, pesos negativos, Bellman–Ford e Floyd–Warshall. ENADE 2023 Q11 e POSCOMP 2014 Q37. |
| 3 | 39 | 23min15s | Árvores, Kruskal, Prim, topológica por DFS e Kahn, Kosaraju, Euler/Hamilton e fluxo. POSCOMP 2012 Q35. |
| 4 | 21 | 18min30s | Busca gulosa, ENADE 2023 Q32, comparação com A*, coloração, Welsh–Powell e três artigos. |

As partes têm cargas diferentes. Cada apresentador deve ensaiar sua parte inteira,
incluindo leitura das questões e explicação das tabelas. A versão ativa termina
na comparação dos artigos, sem slide nem tempo reservado para roda final.

## Como usar as questões

1. Projetar o recorte original e dar tempo para leitura. Os recortes e PDFs completos também estão em `public/provas/`.
2. Votar pelo celular. A régie permite abrir, fechar e zerar a votação.
3. Mostrar a execução, quando houver, e depois a resolução. As respostas não abrem nova votação.
4. Pedir uma justificativa da escolha, além da letra da alternativa.

| Questão | Página PDF | Resposta | Resolução |
|---|---|---|---|
| ENADE 2021 CC, Q34 | 43 | C | D=0. Extrair D: A=5, B=9, E=5, F=1. Extrair F: E=4, G=2. C continua infinito. |
| ENADE 2023 Eng. Computação, Q11 | 15 | C | I confunde saltos e custo. II descreve a cópia da base. III centraliza o cálculo incorretamente. IV descreve a troca de informações. II e IV são verdadeiras. |
| POSCOMP 2014, Q37 | 12 (impressa 10) | B | Floyd–Warshall calcula distâncias entre todos os pares. No exemplo didático, permitir B muda A→C de 9 para 5. |
| POSCOMP 2012, Q35 | 14 (impressa 12) | B | I–C: topológica por DFS. II–D: Prim. III–E: Dijkstra. IV–A: CFC/Kosaraju. V–B: Kruskal. |
| ENADE 2023 Eng. Computação, Q32 | 34–35 | B | Porto Velho (2464) vence Macapá (2665). Cuiabá (1326) vence Palmas (1489). Seguem Goiânia (809) e São Paulo (0). |

O gabarito local do POSCOMP 2012 é **provisório**. A associação também confere
pelas definições. A Q35 chama Prim e Dijkstra de “busca em largura” de forma ampla.
As regras de prioridade diferem da fila FIFO da BFS.

## Conferência dos passos e transições

- **BFS:** níveis de A,B,C,D,E = 0,1,1,2,3. A árvore de pais recupera A–B–D–E. Outra ordem de vizinhos pode mudar pais, mas preserva distâncias. Raio 2, diâmetro 3 e centro {B,C,D} vêm dessa mesma rede.
- **DFS:** vizinhos em ordem alfabética. Descoberta/término: A=1/10, B=2/9, C=4/5, D=3/8, E=6/7. No não dirigido, a volta pela aresta do pai não conta como ciclo.
- **Dijkstra:** em S,A,B,T, as distâncias finais são 0,2,3,6. B cai de 5 para 3. Na Q34, parar após D e F; a terceira extração seria G. O −1 da prova representa infinito, não peso negativo.
- **OSPF:** S–A–T tem duas conexões e custo 9; S–A–B–T tem três e custo 6. Cada roteador usa a própria origem. O enunciado adota atraso como custo; na rede real, as bases têm escopo por área.
- **Bellman–Ford:** a ordem é S→A, S→B, B→A. A recebe 2 e depois 1 já na primeira passagem, pois as atualizações valem imediatamente. A segunda não melhora nada. A garantia por k arestas não limita a propagação a uma aresta por passagem nessa implementação. Após n−1 passagens, uma melhora adicional indica ciclo negativo alcançável.
- **Floyd–Warshall:** o slide mostra uma atualização da matriz, não a execução inteira. k fica no laço externo. A inicialização preserva laços negativos. A diagonal negativa sinaliza ciclo negativo; um par perde o mínimo finito se pode passar pelo ciclo e chegar ao destino.
- **Kruskal e Prim:** ambos chegam ao custo 13. Kruskal aceita AB, AD, CE, rejeita BD por ciclo e aceita BE. Prim, partindo de A, escolhe AB, AD, BE, EC. Sua chave é o peso da melhor ligação à árvore, sem acumular a distância desde A.
- **Topológica:** a Q35 descreve DFS. No DAG, o término é 5,4,2,3,1 e a inversão é 1,3,2,4,5. Kahn é outra abordagem e produz 1,2,3,4,5. Se a fila esvazia antes de incluir todos, há ciclo bloqueando o restante; nem todo vértice bloqueado precisa pertencer ao ciclo.
- **Kosaraju:** o slide resume as três fases. A primeira DFS termina em d,c,b,a. A segunda usa o transposto na ordem a,b,c,d e encontra {a}, {b,c}, {d}. Isso completa os mecanismos necessários para a Q35.
- **Euler/Hamilton e fluxo:** são complementos, sem questão própria entre as cinco selecionadas. Euler trata de usar arestas uma vez; Hamilton, de visitar vértices; Fleury traz um resultado comentado. Ford–Fulkerson agora tem um slide por caminho aumentante: os aumentos são 2,1,1,1 e o total é 5. O último caminho cancela uma unidade em A→B. O corte de capacidade 5 confirma o máximo.
- **Gulosa:** a Q32 usa escolha local entre vizinhos. Macapá–São Paulo existe, mas a regra escolhe Porto Velho primeiro. Os valores h são estimativas ao destino, sem custos dos trechos. Não permitem comparar custos reais das rotas nem executar A* numericamente.
- **A*:** aparece apenas na comparação visual de prioridades. Usa f=g+h e, no exemplo, corrige a primeira expansão para chegar ao caminho de custo 4. As condições formais de correção foram retiradas para não interromper a progressão do seminário.
- **Coloração:** na ordem A,B,C,D,E, as cores são 0,1,1,0,1. Duas cores bastam e a existência de uma aresta exige pelo menos duas. O grafo coroa seguinte mostra como outra ordem pode usar mais cores que o necessário. Welsh–Powell aparece em cinco slides: ordena D,A,B,C,E por grau; forma as classes {D}, {A,E} e {B,C}; e usa a clique A–B–D para provar que as três cores são ótimas neste exemplo. Esse assunto prepara a aplicação em compiladores.

## O que cada artigo acrescenta

**1959 — logística.** Dantzig e Ramser, *The Truck Dispatching Problem*.
Parte de distâncias entre postos e terminal para distribuir entregas entre
caminhões. Dijkstra ou Floyd–Warshall podem fornecer essas distâncias. Escolher
clientes e a ordem de visitas é outro problema, diferente da regra local da Q32.
O artigo apresenta um procedimento baseado em programação linear e problemas de
teste. [Publicação original](https://doi.org/10.1287/mnsc.6.1.80).

**1982 — compiladores.** Chaitin, *Register allocation & spilling via graph coloring*.
Conflitos entre valores viram arestas e registradores viram cores. O trabalho
amplia a alocação por coloração para escolher spills a partir do grafo e de custos.
Vai além de colorir numa ordem fixa. [Resumo do autor na IBM](https://research.ibm.com/publications/register-allocation-andamp-spilling-via-graph-coloring),
[publicação](https://dl.acm.org/doi/10.1145/800230.806984).

**2020 — química.** Stokes et al., *A Deep Learning Approach to Antibiotic Discovery*.
A rede propaga mensagens pelas ligações e usa descritores moleculares na previsão.
A triagem identificou atividade antibacteriana da halicina, com validação em
cultura e em animais. Isso não equivale a aprovação clínica.
[Artigo completo](https://pmc.ncbi.nlm.nih.gov/articles/8349178/),
[registro da publicação](https://pubmed.ncbi.nlm.nih.gov/32084340/).

A síntese compara modelagem, objetivo e saída. Os artigos ampliam as aplicações
do conteúdo, sem necessariamente resolver as mesmas perguntas das provas.

## Fontes técnicas e acervo

- [Princeton: caminhos mínimos](https://algs4.cs.princeton.edu/44sp/).
- [Princeton: árvores geradoras mínimas](https://algs4.cs.princeton.edu/43mst/).
- [RFC 2328: OSPF](https://www.rfc-editor.org/rfc/rfc2328).
- `public/provas/index.html`: índice de 13 PDFs, incluindo material extra ENADE 2011 e POSCOMP 2019.
- `public/provas/fontes.json`: origem, tamanho, data de download e SHA-256.
- `public/provas/recortes/manifesto.json`: páginas e coordenadas dos seis recortes.
- `scripts/recortar-provas.py`: reprodução dos recortes a 216 dpi.

O roteiro importa exemplos de `slides/equilibrada/`, mas não essa apresentação
inteira. A seleção e a ordem ativas estão em `slides/seminario/`.
