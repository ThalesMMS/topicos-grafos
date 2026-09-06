# Grafos, rotas e algoritmos — roteiro de ensaio

Versão de 06/09/2026. Roteiro ativo: `public/slides/seminario/index.js`.
43 slides; 88 minutos planejados; quatro integrantes com 22 minutos cada.
O cronômetro mostra tempo decorrido e compara com o orçamento individual dos slides.
Os tempos são um plano de ensaio, não uma garantia automática de duração.
Ensaiar as falas e reservar os três minutos completos de leitura/votação por questão.

## Organização

| Janela | Integrante | Foco e resultado esperado |
|---|---|---|
| 00–22 min | 1 | Modelar, representar, executar BFS/DFS e resolver ENADE 2021 Q34 com duas extrações de Dijkstra. |
| 22–44 min | 2 | Conectar Dijkstra ao OSPF (ENADE 2023 Q11), avaliar pesos negativos e executar uma atualização de Floyd–Warshall (POSCOMP 2014 Q37). |
| 44–66 min | 3 | Diferenciar AGM e caminhos mínimos; executar Kruskal/Prim, ordem topológica e Kosaraju; resolver POSCOMP 2012 Q35. |
| 66–88 min | 4 | Resolver a busca gulosa ENADE 2023 Q32, introduzir A*, comparar três artigos e conduzir discussão. |

Os nomes “Integrante 1–4” são rótulos editáveis, sem inventar nomes para o grupo.
Na roda final, os quatro devem participar: um modera, um anota critérios, um provoca contrapontos e um sintetiza.

## Como usar as questões

1. Projetar o recorte original e conceder três minutos. O clique na imagem abre o recorte ampliado; o link abaixo abre a prova completa na página.
2. Votar pelo celular. A régie permite abrir/fechar e zerar a votação.
3. Avançar para a execução no quadro quando houver, depois discutir a resolução. Os slides de resposta não abrem uma atividade de votação.
4. Pedir a alguém para justificar um passo, não apenas dizer a letra.

| Questão | Página PDF | Resposta | Passos da resolução |
|---|---|---|---|
| ENADE 2021 CC, Q34 | 43 | C | Inicializar D=0; extrair D; A=5, B=9, E=5, F=1; extrair F; E=4, G=2; C continua infinito. |
| ENADE 2023 Eng. Computação, Q11 | 15 | C | I confunde saltos e custo; II descreve a cópia da base; III centraliza incorretamente; IV descreve troca de estados. II e IV são verdadeiras. |
| POSCOMP 2014, Q37 | 12 (impressa 10) | B | Identificar “todos os pares”; usar matriz; permitir B como intermediário no exemplo; A→C passa de 9 para 5. |
| POSCOMP 2012, Q35 | 14 (impressa 12) | B | I–C: topológica; II–D: Prim; III–E: Dijkstra; IV–A: CFC/Kosaraju; V–B: Kruskal. |
| ENADE 2023 Eng. Computação, Q32 | 34–35 | B | 2464<2665: Porto Velho; 1326<1489: Cuiabá; depois Goiânia e São Paulo. |

POSCOMP 2012: o arquivo de gabarito localizado na SBC é **provisório**. A associação também foi resolvida conceitualmente; não foi tratada como gabarito definitivo.
Q35 usa “busca em largura” de modo amplo para Prim/Dijkstra. Explicar que as implementações usuais usam prioridade, diferente da fila FIFO da BFS.

## Pontos de atenção para quem apresenta

- Q34: o original contém **D→E de peso 5** e **E→B de peso 1**. A terceira extração é **G**, não A. Não continuar a execução antes de responder o estado solicitado.
- Q32: o desenho original é **não dirigido** e possui **Macapá–São Paulo**. A alternativa A é um caminho válido; só não é o escolhido pela regra gulosa. As estimativas não são pesos dos trechos.
- Dijkstra: exigir pesos não negativos; relaxamento compara o candidato com a melhor estimativa atual. Com heap binário e listas: O((n+m) log n).
- BFS: descobre por camadas e conta arestas. DFS: usa a ordem de término; não calcula menor caminho em geral.
- Prim escolhe uma aresta que cruza o corte. Kruskal escolhe uma aresta que une componentes. Ambos dão custo 13 no exemplo, mas em ordens diferentes.
- Floyd–Warshall: k fica no laço externo. Preserve pesos de laços negativos na inicialização; diagonal negativa sinaliza ciclo negativo. Um par só perde mínimo finito se pode passar pelo ciclo e chegar ao destino.
- A*: admissibilidade limita h; consistência permite finalizar sem reabertura. Se necessário, reabrir vértices melhorados. Não confundir a busca gulosa geral com a regra local particular da Q32.
- OSPF: usar as hipóteses simplificadas da prova. A RFC explica o escopo por áreas na rede real.

## Pesquisa: o que cada artigo acrescenta

**2010–2015:** Delling, D.; Goldberg, A. V.; Pajor, T.; Werneck, R. F. *Customizable Route Planning in Road Networks*. Versão dos autores de 24/07/2013, que expande trabalhos de conferência. [PDF Microsoft Research](https://www.microsoft.com/en-us/research/wp-content/uploads/2013/01/crp_web_130724.pdf).
Contribuição: separar preparação da topologia, customização da métrica e consulta. Pergunta para a turma: o que precisa ser recalculado se o trânsito muda, mas a rede não?

**2016–2020 — logística:** Kool, W.; van Hoof, H.; Welling, M. *Attention, Learn to Solve Routing Problems!* ICLR 2019. [Artigo e versões](https://arxiv.org/abs/1803.08475), [implementação dos autores](https://github.com/wouterkool/attention-learn-to-route).
Contribuição: aprender uma política de construção de rotas com atenção e REINFORCE. Discutir objetivo, restrições de capacidade e generalização. O bom resultado em benchmarks não substitui uma verificação de viabilidade em produção.

**2021–2026 — avanço recente:** Duan, R.; Mao, J.; Mao, X.; Shu, X.; Yin, L. *Breaking the Sorting Barrier for Directed Single-Source Shortest Paths*. 2025. [Artigo](https://arxiv.org/abs/2504.17033).
Contribuição: limite determinístico O(m log^(2/3) n) para SSSP dirigido com pesos reais não negativos, no modelo comparação–adição. Rompe a barreira anterior em grafos esparsos. Discutir diferença entre complexidade assintótica e tempo medido num sistema real.

Essa evolução relaciona três frentes de pesquisa (engenharia de rotas, heurísticas aprendidas e teoria). Não afirma que os artigos resolvem o mesmo problema ou que um substituiu o anterior.

## Roda final — quatro minutos

Transportadora com capacidade limitada e trânsito variável propõe adotar um planejador aprendido.
Um minuto para definir objetivos; dois para ouvir argumentos; um para sintetizar um benchmark, uma restrição de viabilidade e um plano de recuperação.
Se a turma não iniciar: “Uma rota 5% menor que viola a capacidade é aceitável?” ou “Que comparação sustenta a troca de algoritmo?”.
Relacionar as respostas às hipóteses das questões e aos limites dos três artigos.

## Fontes técnicas e acervo

- [Princeton: caminhos mínimos](https://algs4.cs.princeton.edu/44sp/).
- [Princeton: árvores geradoras mínimas](https://algs4.cs.princeton.edu/43mst/).
- [RFC 2328: OSPF, seções 2.2 e 3](https://www.rfc-editor.org/rfc/rfc2328).
- `public/provas/index.html`: índice de 13 PDFs, incluindo material extra ENADE 2011 e POSCOMP 2019.
- `public/provas/fontes.json`: URL de origem, tamanho, data de download e SHA-256.
- `public/provas/recortes/manifesto.json`: página e coordenadas de cada recorte.
- `scripts/recortar-provas.py`: reprodução dos recortes a 216 dpi, sem redesenhar enunciados.

Os módulos curriculares anteriores continuam como acervo de código. Saíram do roteiro principal as telas de classificação, equivalência, isomorfismo, métricas, Euler/Hamilton, planaridade, coloração, fluxo e emparelhamento que não conduziam às cinco questões escolhidas. O acervo não deve ser confundido com a versão revisada das questões: use os modelos em `slides/seminario`.
