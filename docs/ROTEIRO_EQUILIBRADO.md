# Roteiro principal equilibrado de Grafos

## Objetivo e critério de prioridade

Substituir a revisão seletiva organizada em torno de cinco questões do ENADE por uma revisão curricular de grafos. A ordem é: modelo → propriedades → representação → problema → algoritmo → verificação. A escolha dos exercícios não determina mais quais capítulos entram no roteiro.

O público pressuposto já cursou a matéria. Os 60 minutos são uma estimativa para **revisão**, incluindo votação e discussão, não uma promessa de ensinar a disciplina do zero. Ensaiar no projetor e ajustar o ritmo. A parte de computabilidade não está coberta; o título geral da disciplina foi preservado e o subtítulo delimita o recorte.

A prioridade não é igualar todos os temas. Fundamentos/representações e conectividade/buscas recebem juntos 23 minutos, porque sustentam os demais problemas. AGM, caminhos mínimos, planaridade/coloração e fluxo ganham espaço próprio. Resultados especializados deixam de competir com a cobertura básica.

## Distribuição principal

| Bloco | Minutos estimados | Slides | Objetivo observável |
| --- | ---: | ---: | --- |
| Fundamentos e representações | 10 | 10 | Modelar V/E; distinguir famílias, isomorfismo, subgrafos e ler matrizes/listas |
| Conectividade e buscas | 13 | 12 | Reconhecer componentes, calcular métricas, interpretar BFS/DFS e falhas por remoção |
| Árvores e AGM | 6 | 5 | Identificar a função objetivo e executar Prim/Kruskal com a propriedade do corte |
| Caminhos mínimos | 7 | 7 | Aplicar relaxamento e selecionar o algoritmo pelas hipóteses dos pesos |
| Dígrafos e dependências | 4 | 4 | Distinguir fechos e conectividade; interpretar CFCs e ordem topológica |
| Euler e Hamilton | 4 | 4 | Separar arestas de vértices e condições suficientes de necessárias |
| Planaridade e coloração | 7 | 9 | Usar faces/Euler e limites; distinguir planaridade, bipartição e coloração |
| Fluxo máximo | 6 | 7 | Verificar viabilidade, usar reversas residuais e certificar o máximo com um corte |
| Abertura + fechamento | 3 | 4 | Delimitar o recorte, sintetizar, apresentar fontes e discutir hipóteses |
| **Total** | **60** | **62** | |

O fechamento de dois minutos começa no slide `sintese` e compreende síntese, referências e discussão final. Essa fronteira impede que o cronômetro atribua esses slides ao bloco de fluxo. Os slides de seção estão incluídos nas contagens. O código mantém os tempos em `MODULOS`; os testes verificam a soma e um teto de 65 slides. Esses testes não substituem o ensaio oral.

## Alterações pedagógicas

Recuperados no roteiro ativo: modelagem, famílias, isomorfismo, subgrafos induzidos/geradores, matriz de incidência, matriz de adjacência, listas, distância/excentricidade/raio/diâmetro/centro, pontes e articulações, fechos direto/inverso, planaridade/faces/fórmula de Euler e fluxo máximo.

Relações de equivalência passam a explicar componentes, sem bloco autônomo. BFS, DFS, Dijkstra e Kruskal têm execuções completas em tabelas compactas, sem uma tela para cada estado. Dijkstra mantém relaxamento, hipóteses, execução e contraste com AGM, mas sem três questões sobre rotas no mesmo bloco.

O exemplo de isomorfismo traz uma bijeção explícita; o de componentes inclui um vértice isolado. A coloração tem um contraexemplo executado: o guloso usa três cores num grafo bipartido de número cromático dois.

Kahn é a execução principal para ordenação topológica. Kosaraju é situado sem outra execução extensa. Hamilton mantém a distinção de Euler e o contraexemplo C5 para Dirac. Ore, Bondy–Chvátal, unicidade de ordem, detalhes de A*, OSPF, Dinic e emparelhamento ficam para aprofundamento; não foram adicionados como novas obrigações curriculares.

As cinco atividades são **autorais**, não oficiais do ENADE. Estão distribuídas entre fundamentos/representações, conectividade/BFS, AGM versus caminhos, planaridade/coloração e fluxo/corte. Uma única fonte gera as alternativas para telão e celular. Cada pergunta tem exatamente uma resolução e usa o mesmo identificador de enquete com `reveal: true`; a atividade retorna a `stage`. A resolução preserva alternativas e resultados no mesmo layout `question`, com `answerLabel` explícito de exercício autoral. O renderizador escapa esse rótulo e usa “Gabarito” como fallback neutro, sem atribuição automática a uma prova oficial.

## Fontes e rastreabilidade

Referência curricular indicada pelo solicitante: [ThalesMMS/Grafos, revisão f0424a9](https://github.com/ThalesMMS/Grafos/tree/f0424a9783402e649dec6472e4e39679a0004b1c). Alguns arquivos podem exigir acesso ao repositório. A base comparada da apresentação foi [nietus/topicos-grafos, e49c75c](https://github.com/nietus/topicos-grafos/tree/e49c75ca04511842738aa6e79e697ce63c41272b).

| Arquivo novo | Temas/arquivos de referência no acervo Grafos |
| --- | --- |
| `01-fundamentos.js` | `02 Modelos baseados em grafos.txt`; `01` e `02 Definicao de grafo...`; `Isomorfismo - Subgrafo...`; `01`, `02` e `03 Estruturas de dados para representacao de grafos.txt` |
| `02-conectividade.js` | `Caminho - Nocoes basicas de conectividade.txt`; `01` e `02 Fecho transitivo - Conectividade em grafos.txt`; séries `Busca em largura...` e `Busca em profundidade...` |
| `03-arvores.js` | Série `Arvore Geradora Minima...` |
| `04-caminhos.js` | Série `Caminho Minimo...`; distinção entre número de arestas, pesos e cortes |
| `05-digrafos.js` | Fechos, conectividade dirigida e busca em profundidade |
| `06-percursos.js` | Conceitos de passeio/trajeto/caminho; seleção revista do módulo anterior de Euler/Hamilton |
| `07-planaridade.js` | `Planaridade em grafos...`; série `Coloracao...` |
| `08-fluxo.js` | Série `Fluxo Maximo...`: capacidade, conservação, residual, aumento e corte |

A classificação de prioridade é editorial, não uma alegação de frequência estatística no ENADE. O acervo contém transcrições e resumos com ruído; suas frases não foram copiadas como garantia de correção. Os exemplos foram reexpressos e conferidos matematicamente.

Referências técnicas de apoio:

- [Sedgewick e Wayne — grafos não dirigidos](https://algs4.cs.princeton.edu/41graph/) e [dígrafos](https://algs4.cs.princeton.edu/42digraph/).
- [Árvores geradoras mínimas](https://algs4.cs.princeton.edu/43mst/) e [caminhos mínimos](https://algs4.cs.princeton.edu/44sp/).
- [Floyd–Warshall com detecção de ciclo negativo](https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/FloydWarshall.java.html).
- [Fluxo máximo](https://algs4.cs.princeton.edu/64maxflow/).

## Correções conceituais incorporadas no roteiro novo

1. BFS/DFS, Prim e Dijkstra não são obtidos apenas trocando a estrutura de fronteira num laço que proíbe atualizar vértices descobertos. Dijkstra precisa de relaxamento e finalização; Prim atualiza chaves do corte.
2. Floyd–Warshall também permite detectar ciclos negativos. A ausência de mínimo finito afeta pares que conseguem passar pelo ciclo negativo e depois alcançar o destino, não necessariamente todos os pares.
3. Os custos do material distinguem a versão com heap da simulação didática de Dijkstra por varredura. O custo quase constante de união-busca é amortizado e requer as otimizações citadas.
4. O custo de enumerar vizinhos por matriz de incidência depende dos índices auxiliares. A apresentação não atribui à matriz pura uma consulta ao outro extremo que ela não oferece diretamente.
5. Decidir Euler não tem o mesmo custo de construir por Fleury. O roteiro separa o critério linear, os testes repetidos de ponte e a alternativa linear de Hierholzer.
6. Maximal não significa máximo. Componentes são maximais por inclusão.
7. A condição de Dirac é suficiente, não necessária. A interpretação incorreta do fecho de Bondy–Chvátal não foi trazida ao roteiro novo.
8. Um fluxo máximo não precisa saturar todas as arestas, nem todas as saídas da fonte. Há teste específico de uma rede cujo gargalo é interno.
9. K3,3 é não planar e 2-colorível. Isso impede a falsa implicação “não planar ⇒ mais de quatro cores”.

## Organização e escopo de código

`public/presentation.config.js` seleciona `public/slides/equilibrada/index.js`. Os oito módulos são separados; `modelos.js` concentra diagramas, `simulacoes.js` gera os resultados e `perguntas.js` concentra atividades. IDs estáveis e `cobertura` permitem verificar o conteúdo realmente carregado.

Não há alteração de dependências, Workers, autenticação, WebSocket ou identidade do apresentador. `render.js` ganha somente o rótulo configurável e escapado do gabarito. `index.html` carrega `assets/revisao.css`, que mantém os tokens de marca, trata cápsulas SVG, contém tabelas/fórmulas em telas estreitas, mantém figuras ao lado do texto em projetores e restaura o clique no cronômetro. Não há configuração de CI nova. Os módulos antigos e o apêndice continuam no repositório, mas não são importados pelo roteiro principal. Eles são material histórico e não receberam uma auditoria completa: revisar antes de reinseri-los; enquetes antigas precisam de configuração correspondente.

As simulações são para exemplos pequenos. Dijkstra usa varredura, DFS usa recursão, e a simulação residual aceita capacidades inteiras positivas, sem laços, paralelas ou antiparalelas. Não são implementações de produção para grafos grandes. O custo teórico nos slides sempre identifica as hipóteses relevantes.

## Validação e critérios de revisão

Executar, no checkout completo:

```sh
npm test
npm run dev
```

O teste novo verifica a cobertura ativa, orçamento temporal, limite de slides, perguntas/resoluções, sincronização de alternativas, matrizes, referências de vértices e renderização no renderer existente. Os cálculos têm verificações independentes: caminhos mínimos em 30 grafos por Floyd–Warshall de teste, enumeração de subconjuntos para AGM, clique e coloração válida, conservação em cada aumento e enumeração de cortes.

Antes de usar em aula, validar com o Worker real: entrar no telão, navegar pelos blocos, votar no celular, passar à resolução, confirmar encerramento da atividade, testar a régie e repetir com mais de um participante. Conferir no projetor e no Safari. Uma prévia estática não valida autenticação, sincronização, persistência de sala nem votação real.

## Verificação realizada nesta revisão

- `npm test`: 52 testes aprovados (26 originais, sem modificar seus limites, e 26 novos). Os handlers de sala também foram exercitados com storage e sockets em memória: abrir as cinco enquetes, substituir votos, contabilizar dois participantes, retornar a `stage`, fechar pela régie, resetar e migrar o estado com as enquetes antigas.
- Chromium/Playwright: os 62 slides foram renderizados com o CSS e o renderizador de produção em 1920×1080, 1280×720 e 1024×768. Sem transbordamento dos slides, corte de fórmulas/tabelas ou sobreposição ao rodapé nessas resoluções. Em 390×844, os slides densos permitem rolagem vertical e tabelas largas rolagem interna, sem alargar a página.
- O código do telão foi exercitado em documento isolado: botões anterior/próximo, Home/End, hash, pausa/retomada do cronômetro e cinco ciclos pergunta → resultados → resolução. Não houve erro JavaScript nos cenários exercitados.

Limites: a navegação local estava bloqueada no ambiente de revisão; os assets foram carregados em documento isolado (`set_content`). A conexão `LivePresentation` e o QR foram substituídos por adaptadores de teste no ensaio de interface; não houve deploy, teste de rede WebSocket, leitura real de QR, execução de Durable Object na Cloudflare, Safari ou ensaio oral. Os testes de sala exercitam o código real com mocks, não a infraestrutura implantada.

No contrato existente, passar à resolução retira o formulário da atividade corrente, mas não fecha a enquete no servidor: o fechamento explícito continua disponível na régie. Essa revisão preserva esse comportamento.
