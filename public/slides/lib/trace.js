/**
 * trace.js — executa os algoritmos de verdade e emite os slides do passo a
 * passo a partir do resultado.
 *
 * Por que gerar em vez de escrever à mão: um trace de Dijkstra com 6 iterações
 * tem dezenas de números na tela. Escritos à mão, um erro passa despercebido e
 * vai para o projetor. Aqui o algoritmo roda, e o slide mostra o que ele
 * produziu — se estivesse errado, o teste de invariante acusaria.
 */

/** Clona o spec aplicando estados por vértice e por aresta. */
export function comEstados(base, { nodes = {}, edges = {}, caption, notes = {} } = {}) {
  const chaveAresta = aresta => `${aresta.from}-${aresta.to}`;
  const chaveInversa = aresta => `${aresta.to}-${aresta.from}`;
  return {
    ...base,
    caption: caption ?? base.caption,
    nodes: base.nodes.map(node => {
      const copia = { ...node };
      if (nodes[node.id]) copia.state = nodes[node.id];
      else delete copia.state;
      if (notes[node.id] !== undefined) copia.note = notes[node.id];
      else if (base.keepNotes !== true) delete copia.note;
      return copia;
    }),
    edges: base.edges.map(aresta => {
      const copia = { ...aresta };
      const estado = edges[chaveAresta(aresta)] ?? edges[chaveInversa(aresta)];
      if (estado) copia.state = estado;
      else delete copia.state;
      return copia;
    })
  };
}

const INFINITO = '∞';
const mostra = valor => (valor === Infinity ? INFINITO : String(valor));

/** Lista de adjacência a partir do spec, respeitando direção. */
function adjacencia(spec) {
  const mapa = new Map(spec.nodes.map(node => [node.id, []]));
  for (const aresta of spec.edges) {
    const peso = aresta.weight ?? 1;
    mapa.get(aresta.from).push({ para: aresta.to, peso, aresta });
    if (!spec.directed) mapa.get(aresta.to).push({ para: aresta.from, peso, aresta });
  }
  // Ordem lexicográfica: torna o trace determinístico e reproduzível na prova.
  for (const lista of mapa.values()) lista.sort((a, b) => a.para.localeCompare(b.para));
  return mapa;
}

/* ==========================================================================
   Dijkstra
   ========================================================================== */

export function tracoDijkstra({ base, origem, eyebrow = 'Dijkstra' }) {
  const adj = adjacencia(base);
  const ids = base.nodes.map(node => node.id);
  const d = new Map(ids.map(id => [id, id === origem ? 0 : Infinity]));
  const pai = new Map(ids.map(id => [id, null]));
  const fechado = new Set();
  const slides = [];
  const linhas = [];

  const tabela = () => ({
    headers: ['vértice', 'd[v]', 'π[v]', 'estado'],
    rows: ids.map(id => [
      id,
      mostra(d.get(id)),
      pai.get(id) || '—',
      fechado.has(id) ? 'fechado' : d.get(id) === Infinity ? 'não alcançado' : 'aberto'
    ])
  });

  const estadosNos = () => Object.fromEntries(ids.map(id => [
    id,
    fechado.has(id) ? 'done' : d.get(id) === Infinity ? 'dim' : 'active'
  ]));

  const arestasDaArvore = () => {
    const mapa = {};
    for (const id of ids) if (pai.get(id)) mapa[`${pai.get(id)}-${id}`] = 'tree';
    return mapa;
  };

  slides.push({
    type: 'trace',
    eyebrow,
    title: `Inicialização: só ${origem} vale 0`,
    description: `Toda estimativa começa em ${INFINITO} — exceto a origem. Nenhum vértice está fechado ainda.`,
    graph: comEstados(base, {
      nodes: estadosNos(),
      notes: Object.fromEntries(ids.map(id => [id, mostra(d.get(id))])),
      caption: `d[${origem}] = 0 · todo o resto = ${INFINITO}`
    }),
    ...tabela()
  });

  while (fechado.size < ids.length) {
    let atual = null;
    for (const id of ids) {
      if (fechado.has(id) || d.get(id) === Infinity) continue;
      if (atual === null || d.get(id) < d.get(atual)) atual = id;
    }
    if (atual === null) break;
    fechado.add(atual);

    const relaxadas = [];
    for (const { para, peso } of adj.get(atual)) {
      if (fechado.has(para)) continue;
      const candidato = d.get(atual) + peso;
      if (candidato < d.get(para)) {
        relaxadas.push(`${para}: ${mostra(d.get(para))} → ${candidato}`);
        d.set(para, candidato);
        pai.set(para, atual);
      }
    }
    linhas.push(atual);

    slides.push({
      type: 'trace',
      eyebrow,
      title: `Fecha ${atual} (d = ${d.get(atual)})`,
      description: relaxadas.length
        ? `É o menor entre os abertos, então a distância dele é definitiva. Relaxando as saídas: **${relaxadas.join(' · ')}**.`
        : 'É o menor entre os abertos. Nenhuma saída dele melhora as estimativas atuais.',
      graph: comEstados(base, {
        nodes: { ...estadosNos(), [atual]: 'done' },
        edges: arestasDaArvore(),
        notes: Object.fromEntries(ids.map(id => [id, mostra(d.get(id))])),
        caption: `fechados: ${linhas.join(' · ')}`
      }),
      ...tabela()
    });
  }

  return slides;
}

/* ==========================================================================
   BFS
   ========================================================================== */

export function tracoBfs({ base, origem, eyebrow = 'BFS' }) {
  const adj = adjacencia(base);
  const ids = base.nodes.map(node => node.id);
  const nivel = new Map(ids.map(id => [id, Infinity]));
  const pai = new Map(ids.map(id => [id, null]));
  nivel.set(origem, 0);
  const fila = [origem];
  const processados = [];
  const slides = [];

  const tabela = () => ({
    headers: ['vértice', 'nível', 'π[v]'],
    rows: ids.map(id => [id, mostra(nivel.get(id)), pai.get(id) || '—'])
  });

  const estados = () => Object.fromEntries(ids.map(id => [
    id,
    processados.includes(id) ? 'done' : nivel.get(id) === Infinity ? 'dim' : 'active'
  ]));

  const arvore = () => {
    const mapa = {};
    for (const id of ids) if (pai.get(id)) mapa[`${pai.get(id)}-${id}`] = 'tree';
    return mapa;
  };

  slides.push({
    type: 'trace',
    eyebrow,
    title: `Enfileira a raiz ${origem}`,
    description: `A raiz recebe nível 0 e entra na fila. Todo o resto está a ${INFINITO}.`,
    graph: comEstados(base, {
      nodes: estados(),
      notes: Object.fromEntries(ids.map(id => [id, mostra(nivel.get(id))])),
      caption: `fila: [${fila.join(', ')}]`
    }),
    ...tabela()
  });

  while (fila.length) {
    const atual = fila.shift();
    processados.push(atual);
    const descobertos = [];
    for (const { para } of adj.get(atual)) {
      if (nivel.get(para) !== Infinity) continue;
      nivel.set(para, nivel.get(atual) + 1);
      pai.set(para, atual);
      fila.push(para);
      descobertos.push(para);
    }

    slides.push({
      type: 'trace',
      eyebrow,
      title: `Desenfileira ${atual}`,
      description: descobertos.length
        ? `Descobre **${descobertos.join(', ')}** no nível ${nivel.get(descobertos[0])}. Cada um entra na fila uma única vez.`
        : `Todos os vizinhos de ${atual} já tinham sido descobertos: nada entra na fila.`,
      graph: comEstados(base, {
        nodes: { ...estados(), [atual]: 'done' },
        edges: arvore(),
        notes: Object.fromEntries(ids.map(id => [id, mostra(nivel.get(id))])),
        caption: fila.length ? `fila: [${fila.join(', ')}]` : 'fila vazia — busca encerrada'
      }),
      ...tabela()
    });
  }

  return slides;
}

/* ==========================================================================
   Kruskal (com união-busca explícito)
   ========================================================================== */

export function tracoKruskal({ base, eyebrow = 'Kruskal' }) {
  const ids = base.nodes.map(node => node.id);
  const pai = new Map(ids.map(id => [id, id]));
  const raiz = id => (pai.get(id) === id ? id : raiz(pai.get(id)));

  const ordenadas = [...base.edges]
    .map(aresta => ({ ...aresta, peso: aresta.weight ?? 1 }))
    .sort((a, b) => a.peso - b.peso
      || `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`));

  const escolhidas = [];
  const recusadas = [];
  const slides = [];
  let custo = 0;

  const componentes = () => {
    const grupos = new Map();
    for (const id of ids) {
      const r = raiz(id);
      if (!grupos.has(r)) grupos.set(r, []);
      grupos.get(r).push(id);
    }
    return [...grupos.values()].map(grupo => `{${grupo.join(',')}}`).join(' ');
  };

  const tabela = () => ({
    headers: ['aresta', 'peso', 'decisão'],
    rows: ordenadas.map(aresta => {
      const nome = `${aresta.from}–${aresta.to}`;
      if (escolhidas.some(e => e.from === aresta.from && e.to === aresta.to)) return [nome, String(aresta.peso), 'aceita'];
      if (recusadas.some(e => e.from === aresta.from && e.to === aresta.to)) return [nome, String(aresta.peso), 'recusada (ciclo)'];
      return [nome, String(aresta.peso), '—'];
    })
  });

  const estadosArestas = () => {
    const mapa = {};
    for (const e of escolhidas) mapa[`${e.from}-${e.to}`] = 'tree';
    for (const e of recusadas) mapa[`${e.from}-${e.to}`] = 'warn';
    return mapa;
  };

  slides.push({
    type: 'trace',
    eyebrow,
    title: 'Ordene as arestas e comece com n árvores triviais',
    description: `Cada vértice é o próprio componente. A ordem de exame é: **${ordenadas.map(a => `${a.from}–${a.to}(${a.peso})`).join(' · ')}**.`,
    graph: comEstados(base, { nodes: {}, edges: {}, caption: `componentes: ${componentes()}` }),
    ...tabela()
  });

  for (const aresta of ordenadas) {
    const ra = raiz(aresta.from);
    const rb = raiz(aresta.to);
    const aceita = ra !== rb;
    if (aceita) {
      pai.set(ra, rb);
      escolhidas.push(aresta);
      custo += aresta.peso;
    } else {
      recusadas.push(aresta);
    }

    slides.push({
      type: 'trace',
      eyebrow,
      title: aceita
        ? `${aresta.from}–${aresta.to} (${aresta.peso}): aceita`
        : `${aresta.from}–${aresta.to} (${aresta.peso}): RECUSADA`,
      description: aceita
        ? `As pontas estavam em componentes diferentes, então a aresta une os dois. Custo acumulado: **${custo}**.`
        : `As pontas já estão no mesmo componente — aceitar fecharia um ciclo. \`find(${aresta.from})\` = \`find(${aresta.to})\`.`,
      graph: comEstados(base, {
        nodes: {},
        edges: estadosArestas(),
        caption: `componentes: ${componentes()}`
      }),
      ...tabela(),
      note: escolhidas.length === ids.length - 1
        ? { kind: 'key', title: 'Pare aqui', text: `São n − 1 = ${ids.length - 1} arestas: a árvore está completa, custo ${custo}. O resto da lista nem precisa ser examinado.` }
        : undefined
    });

    if (escolhidas.length === ids.length - 1) break;
  }

  return slides;
}

/* ==========================================================================
   DFS — tempos de descoberta/término e classificação das arestas
   ========================================================================== */

export function tracoDfs({ base, origem, eyebrow = 'DFS' }) {
  const adj = adjacencia(base);
  const ids = base.nodes.map(node => node.id);
  const cor = new Map(ids.map(id => [id, 'branco']));
  const d = new Map();
  const f = new Map();
  const pai = new Map(ids.map(id => [id, null]));
  const classes = new Map();
  const slides = [];
  let relogio = 0;

  const tabela = () => ({
    headers: ['v', 'd[v]', 'f[v]', 'π[v]'],
    rows: ids.map(id => [id, d.has(id) ? String(d.get(id)) : '—', f.has(id) ? String(f.get(id)) : '—', pai.get(id) || '—'])
  });

  const estados = () => Object.fromEntries(ids.map(id => [
    id,
    cor.get(id) === 'preto' ? 'done' : cor.get(id) === 'cinza' ? 'active' : 'dim'
  ]));

  const arestas = () => Object.fromEntries([...classes].map(([chave, classe]) => [
    chave,
    classe === 'árvore' ? 'tree' : classe === 'retorno' ? 'warn' : 'dim'
  ]));

  const registra = (titulo, descricao, legenda) => slides.push({
    type: 'trace',
    eyebrow,
    title: titulo,
    description: descricao,
    graph: comEstados(base, {
      nodes: estados(),
      edges: arestas(),
      notes: Object.fromEntries(ids.map(id => [
        id,
        d.has(id) ? `${d.get(id)}/${f.has(id) ? f.get(id) : '·'}` : ''
      ])),
      caption: legenda
    }),
    ...tabela()
  });

  const visita = raiz => {
    const pilha = [{ v: raiz, i: 0 }];
    relogio += 1;
    d.set(raiz, relogio);
    cor.set(raiz, 'cinza');
    registra(
      `Descobre ${raiz} (d = ${relogio})`,
      `${raiz} fica **cinza**: descoberto, mas com vizinhos pendentes.`,
      `pilha: [${pilha.map(q => q.v).join(', ')}]`
    );

    while (pilha.length) {
      const topo = pilha[pilha.length - 1];
      const vizinhos = adj.get(topo.v);
      if (topo.i < vizinhos.length) {
        const { para } = vizinhos[topo.i];
        topo.i += 1;
        const chave = `${topo.v}-${para}`;
        if (cor.get(para) === 'branco') {
          classes.set(chave, 'árvore');
          pai.set(para, topo.v);
          relogio += 1;
          d.set(para, relogio);
          cor.set(para, 'cinza');
          pilha.push({ v: para, i: 0 });
          registra(
            `${topo.v} → ${para}: aresta de ÁRVORE`,
            `${para} era branco, então ${topo.v} o descobre. d[${para}] = ${relogio}.`,
            `pilha: [${pilha.map(q => q.v).join(', ')}]`
          );
        } else if (cor.get(para) === 'cinza' && pai.get(topo.v) !== para) {
          if (!classes.has(chave) && !classes.has(`${para}-${topo.v}`)) {
            classes.set(chave, 'retorno');
            registra(
              `${topo.v} → ${para}: aresta de RETORNO`,
              `${para} está **cinza** — ainda aberto na pilha. Isso fecha um ciclo: ${para} é ancestral de ${topo.v}.`,
              `pilha: [${pilha.map(q => q.v).join(', ')}]`
            );
          }
        }
      } else {
        relogio += 1;
        f.set(topo.v, relogio);
        cor.set(topo.v, 'preto');
        pilha.pop();
        registra(
          `${topo.v} termina (f = ${relogio})`,
          `Todos os vizinhos de ${topo.v} já foram explorados: ele fica **preto** e sai da pilha.`,
          pilha.length ? `pilha: [${pilha.map(q => q.v).join(', ')}]` : 'pilha vazia'
        );
      }
    }
  };

  visita(origem);
  for (const id of ids) if (cor.get(id) === 'branco') visita(id);

  return slides;
}

/* ==========================================================================
   Ordenação topológica (Kahn)
   ========================================================================== */

export function tracoKahn({ base, eyebrow = 'Kahn' }) {
  const ids = base.nodes.map(node => node.id);
  const entrada = new Map(ids.map(id => [id, 0]));
  for (const aresta of base.edges) entrada.set(aresta.to, entrada.get(aresta.to) + 1);

  const prontos = ids.filter(id => entrada.get(id) === 0).sort();
  const ordem = [];
  const slides = [];

  const tabela = () => ({
    headers: ['v', 'grau de entrada', 'situação'],
    rows: ids.map(id => [
      id,
      String(entrada.get(id)),
      ordem.includes(id) ? `emitido (${ordem.indexOf(id) + 1}º)` : prontos.includes(id) ? 'na fila' : 'esperando'
    ])
  });

  const estados = () => Object.fromEntries(ids.map(id => [
    id,
    ordem.includes(id) ? 'done' : prontos.includes(id) ? 'active' : 'dim'
  ]));

  slides.push({
    type: 'trace',
    eyebrow,
    title: 'Calcule o grau de entrada de cada vértice',
    description: `Quem tem grau de entrada **0** não depende de ninguém e já pode sair. Fila inicial: **${prontos.join(', ')}**.`,
    graph: comEstados(base, {
      nodes: estados(),
      notes: Object.fromEntries(ids.map(id => [id, `d⁻ = ${entrada.get(id)}`])),
      caption: `fila: [${prontos.join(', ')}]`
    }),
    ...tabela()
  });

  while (prontos.length) {
    const atual = prontos.shift();
    ordem.push(atual);
    const liberados = [];
    const decrementados = [];
    for (const aresta of base.edges) {
      if (aresta.from !== atual) continue;
      entrada.set(aresta.to, entrada.get(aresta.to) - 1);
      decrementados.push(aresta.to);
      if (entrada.get(aresta.to) === 0) liberados.push(aresta.to);
    }
    prontos.push(...liberados);
    prontos.sort();

    slides.push({
      type: 'trace',
      eyebrow,
      title: `Extrai ${atual}`,
      description: decrementados.length
        ? `Decrementa o grau de entrada de **${decrementados.join(', ')}**.`
          + (liberados.length
            ? ` Chegou a 0 em **${liberados.join(', ')}** — esses entram na fila.`
            : ' Nenhum chegou a 0: **decrementar não é liberar**.')
        : `${atual} não tem arcos de saída: nada muda.`,
      graph: comEstados(base, {
        nodes: { ...estados(), [atual]: 'done' },
        notes: Object.fromEntries(ids.map(id => [id, `d⁻ = ${entrada.get(id)}`])),
        caption: prontos.length ? `fila: [${prontos.join(', ')}]` : `ordem final: ${ordem.join(' → ')}`
      }),
      ...tabela(),
      note: ordem.length === ids.length
        ? { kind: 'key', title: 'Ordem completa', text: `${ordem.join(' → ')}. Emitiu todos os ${ids.length} vértices, logo o dígrafo é acíclico. Se tivesse parado antes, os restantes estariam num ciclo.` }
        : undefined
    });
  }

  return slides;
}

/* ==========================================================================
   Coloração gulosa — a menor cor ausente na vizinhança já pintada
   ========================================================================== */

export function tracoColoracao({ base, ordem, eyebrow = 'Guloso' }) {
  const adj = adjacencia(base);
  const cor = new Map();
  const slides = [];
  const NOMES = ['0', '1', '2', '3', '4'];
  const ESTADOS = ['active', 'done', 'warn', 'dim'];

  const tabela = () => ({
    headers: ['v', 'vizinhos pintados', 'cor'],
    rows: ordem.map(id => {
      const pintados = adj.get(id).filter(a => cor.has(a.para)).map(a => `${a.para}(${cor.get(a.para)})`);
      return [id, pintados.join(' ') || '—', cor.has(id) ? NOMES[cor.get(id)] : '—'];
    })
  });

  const estados = () => Object.fromEntries(
    [...cor].map(([id, c]) => [id, ESTADOS[c % ESTADOS.length]])
  );

  for (const atual of ordem) {
    const usadas = new Set(adj.get(atual).filter(a => cor.has(a.para)).map(a => cor.get(a.para)));
    let escolhida = 0;
    while (usadas.has(escolhida)) escolhida += 1;
    cor.set(atual, escolhida);

    slides.push({
      type: 'trace',
      eyebrow,
      title: `${atual} recebe a cor ${NOMES[escolhida]}`,
      description: usadas.size
        ? `Os vizinhos já pintados usam { ${[...usadas].map(c => NOMES[c]).join(', ')} }. A **menor cor ausente** é ${NOMES[escolhida]}.`
        : `Nenhum vizinho pintado ainda: fica com a menor cor possível, ${NOMES[escolhida]}.`,
      graph: comEstados(base, {
        nodes: estados(),
        notes: Object.fromEntries([...cor].map(([id, c]) => [id, `cor ${NOMES[c]}`])),
        caption: `ordem: ${ordem.join(' · ')} — pintados ${cor.size}/${ordem.length}`
      }),
      ...tabela()
    });
  }

  const total = new Set(cor.values()).size;
  slides[slides.length - 1].note = {
    kind: 'check',
    title: `O guloso usou ${total} cores`,
    text: `Isso é um LIMITE SUPERIOR para χ, não o valor. Confira as arestas uma a uma: nenhuma pode ter as duas pontas da mesma cor.`
  };

  return slides;
}

/* ==========================================================================
   LCS — a matriz de programação dinâmica, preenchida célula a célula
   ========================================================================== */

export function tracoLcs({ a, b, eyebrow = 'LCS' }) {
  const n = a.length;
  const m = b.length;
  const tabela = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      tabela[i][j] = a[i - 1] === b[j - 1]
        ? tabela[i - 1][j - 1] + 1
        : Math.max(tabela[i][j - 1], tabela[i - 1][j]);
    }
  }

  // Reconstrução da subsequência, andando de trás para frente.
  let i = n;
  let j = m;
  const saida = [];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      saida.unshift(a[i - 1]);
      i -= 1;
      j -= 1;
    } else if (tabela[i - 1][j] >= tabela[i][j - 1]) i -= 1;
    else j -= 1;
  }

  const linhas = [];
  for (let linha = 0; linha <= n; linha += 1) {
    linhas.push([
      linha === 0 ? '—' : a[linha - 1],
      ...tabela[linha].map(String)
    ]);
  }

  return {
    comprimento: tabela[n][m],
    subsequencia: saida.join(''),
    headers: ['A \\ B', '—', ...b.split('')],
    rows: linhas,
    eyebrow
  };
}
