# Revisão de Grafos com as questões do ENADE

O roteiro ativo combina cobertura curricular do acervo `/Users/thales/GitHub/Grafos` com todas as cinco questões do ENADE preservadas dos módulos anteriores. As cinco atividades autorais também permanecem. A revisão pressupõe conhecimento prévio da disciplina.

## Distribuição

| Bloco | Slides | Minutos estimados |
| --- | ---: | ---: |
| Fundamentos e representações | 12 | 13 |
| Conectividade e buscas | 15 | 16 |
| Árvores e AGM | 5 | 6 |
| Caminhos mínimos | 16 | 18 |
| Dígrafos e dependências | 5 | 6 |
| Euler e Hamilton | 5 | 5 |
| Planaridade e coloração | 10 | 8 |
| Fluxo e aplicações | 9 | 10 |
| Abertura e fechamento | 4 | 3 |
| Total | 81 | 85 |

A estimativa anterior de 60 minutos foi ampliada para acomodar as questões e as explicações adicionais. Os tempos incluem atividades e resoluções, mas exigem ensaio oral. A redução de passos de animação não elimina o tempo necessário para interpretar tabelas.

## Questões preservadas

- ENADE 2011, Computação, questão 20: lema do aperto de mãos.
- ENADE 2023, Engenharia de Computação, questão 12: relações de equivalência.
- ENADE 2021, Ciência da Computação, questão 34: duas iterações de Dijkstra.
- ENADE 2023, Engenharia de Computação, questão 11: OSPF.
- ENADE 2023, Engenharia de Computação, questão 32: busca gulosa em rotas.

`enade.js` reutiliza os enunciados, alternativas, figuras, afirmações e resoluções existentes no projeto. Esta alteração não certifica a transcrição contra os cadernos oficiais. As alternativas da votação e da resolução são unificadas; as enquetes para celular são geradas dessas mesmas alternativas. A interface identifica a resolução como ENADE, sem atribuir nova verificação de gabarito oficial.

As cinco questões autorais cobrem representações, BFS, AGM versus caminhos mínimos, planaridade/coloração e fluxo/corte. Cada uma das dez atividades tem uma tela de votação e uma resolução. Passar à resolução retorna a atividade a `stage`; o fechamento explícito da enquete permanece na régie, conforme o contrato existente.

## Algoritmos e critérios

O núcleo mantém BFS, DFS, Prim, Kruskal, Dijkstra, Kahn, Fleury, coloração gulosa e Ford–Fulkerson. Execuções são compactadas em tabelas.

`complementos.js` acrescenta explicações de Bellman–Ford, Floyd–Warshall, busca gulosa e A*, ordenação topológica por DFS, Kosaraju, Welsh–Powell, Edmonds–Karp, Dinic, Edmonds/blossom e método Húngaro. Transporte é situado como fluxo de custo mínimo. Ore e o fecho de Bondy–Chvátal são apresentados como critérios, com suas limitações. Hierholzer é descrito no slide de construção euleriana.

O resumo distingue a caminhada gulosa local da questão de rotas da busca gulosa geral com fronteira; A* em grafo precisa de consistência ou reabertura adequada. Floyd–Warshall também detecta ciclos negativos. Fecho incompleto não prova ausência de ciclo hamiltoniano.

## Referências curriculares e organização

O acervo Grafos contém as séries de modelagem, definições, estruturas de representação, conectividade, buscas, AGM, caminhos mínimos, planaridade, coloração e fluxo. Seus PDFs também incluem ordenação topológica, emparelhamento, transporte e atribuição linear. As transcrições possuem ruído e não devem ser copiadas como garantia de correção.

`public/presentation.config.js` importa `slides/equilibrada/index.js`. Os oito módulos mantêm a base curricular; `modelos.js` e `simulacoes.js` sustentam os exemplos. Os módulos anteriores e o apêndice permanecem como referência. Apenas as questões antigas são importadas no roteiro novo; o restante do material antigo não recebeu auditoria completa.

Worker, autenticação e protocolo de sincronização não foram alterados. As dez enquetes passam a integrar a configuração da sala. Votos antigos de enquetes ENADE ainda válidas são preservados.

## Validação

Executar `npm test`. Os testes verificam conteúdo ativo, preservação das cinco questões ENADE, unicidade dos IDs, alternativas e enquetes, limites de texto e diagramas, renderização, simulações matemáticas e handlers de sala com adaptadores em memória.

Nesta alteração, o Safari carregou o roteiro de 81 slides no servidor local da porta 8788. Isso não equivale a verificar todas as telas no projetor ou votar de um celular. O navegador apresentava aviso de conexão interrompida, que exige verificação separada antes do uso em aula. Não houve publicação ou deploy.
