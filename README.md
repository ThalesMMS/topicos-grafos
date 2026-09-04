# Presentation Template

Esqueleto reutilizável de apresentação HTML com três superfícies sincronizadas em tempo real:

- **Telão:** slides, resultados ao vivo e QR code.
- **Plateia:** votação pelo celular e envio de perguntas.
- **Régie:** abertura, fechamento e reset de enquetes, além da moderação das perguntas.

O estado da sala fica em um Durable Object do Cloudflare Workers e é distribuído por WebSocket.

## Começar

Requisitos: Node.js 20 ou mais recente e uma conta Cloudflare.

```bash
npm install
npm run dev
```

No ambiente local, abra:

- Telão: `http://localhost:8787/?k=change-this-key`
- Plateia: `http://localhost:8787/participar/`
- Régie: `http://localhost:8787/regie/?k=change-this-key`

Ao validar a chave, o servidor cria uma sessão privada e remove a chave da URL. Os links do telão e da régie não ficam disponíveis sem essa sessão.

## Personalizar

Edite [public/presentation.config.js](public/presentation.config.js). Esse arquivo concentra título, cores, enquetes e a ordem dos módulos. O conteúdo de cada módulo fica em [public/slides/](public/slides/), um arquivo por assunto — para encurtar a aula, comente o módulo no array `slides`.

Tipos de slide incluídos:

| Tipo | Uso |
| --- | --- |
| `cover` | Abertura com QR code e total de participantes |
| `section` | Divisória de módulo, com `kicker` e lista de `topics` |
| `statement` | Ideia central com título e descrição |
| `concept` | Texto à esquerda e diagrama à direita — o layout de conceito |
| `graph` | Diagrama grande no centro, com texto compacto |
| `definition` | Bloco de `formulas` em destaque (aceita diagrama ao lado) |
| `table` | `headers` + `rows` |
| `code` | Pseudocódigo em `lines` |
| `compare` | Duas a quatro `columns` lado a lado |
| `steps` | Passo a passo numerado em `items` |
| `exercise` | Questão com `alternatives` e resposta escondida num `<details>` |
| `list` | Lista de pontos |
| `poll` | Resultado de uma enquete em tempo real |
| `quote` | Citação ou mensagem principal |
| `closing` | Encerramento e chamada para ação |

Qualquer slide aceita `note: { kind, title, text }` com `kind` em `key`, `tip`, `warn` ou `check`, e `points: [...]` para uma lista de apoio.

No texto valem quatro marcações inline: `**negrito**`, `*ênfase*`, `` `código` `` e `==destaque na cor da marca==`. Tudo é escapado antes — não há HTML cru.

### Diagramas de grafo

Qualquer slide de tipo `concept`, `graph`, `definition`, `code`, `steps` ou `exercise` aceita um campo `graph`, desenhado como SVG por [public/assets/graph-draw.js](public/assets/graph-draw.js):

```js
graph: {
  view: [760, 420],       // sistema de coordenadas
  directed: true,         // desenha setas
  caption: 'texto sob o desenho',
  nodes: [{ id: 'A', x: 180, y: 140, note: 'd = 2', state: 'active' }],
  edges: [{ from: 'A', to: 'B', weight: 3, state: 'tree', curve: 40 }]
}
```

`state` em vértice: `active`, `done`, `dim`, `warn`. Em aresta: `active`, `tree`, `dim`, `warn`. Use `curve` para arestas paralelas (valores opostos, como 40 e −40) e `from === to` para laços.

Para associar um slide a uma enquete, use a mesma chave declarada em `polls`:

```js
{
  type: 'poll',
  poll: 'warmup',
  eyebrow: 'Enquete ao vivo'
}
```

O endereço codificado no QR code é calculado a partir do domínio atual. Não é necessário alterar o HTML ao publicar em outro endereço.

## Enquetes

Escolha única:

```js
example: {
  question: 'Qual opção representa melhor sua situação?',
  type: 'single',
  options: [
    { id: 'a', label: 'Opção A' },
    { id: 'b', label: 'Opção B' }
  ]
}
```

Escolha múltipla:

```js
example: {
  question: 'Quais opções se aplicam?',
  type: 'multiple',
  exclusive: 'none',
  options: [
    { id: 'a', label: 'Opção A' },
    { id: 'b', label: 'Opção B' },
    { id: 'none', label: 'Nenhuma delas' }
  ]
}
```

Quando `exclusive` é definido, selecionar essa opção limpa as demais; selecionar outra opção limpa a exclusiva.

## Controles do telão

- `←` / `→` ou Page Up / Page Down: navegar.
- Home / End: primeiro ou último slide.
- Espaço: avançar.
- `F`: alternar tela cheia.
- Botões no canto inferior: navegação e tela cheia por mouse ou toque.

Ao entrar em um slide de enquete, ela é aberta automaticamente. A régie continua permitindo abrir, fechar ou zerar cada enquete manualmente.

## Publicar

Troque em `wrangler.jsonc`:

- `name`: nome público do Worker;
- `PRESENTER_KEY`: chave usada para liberar telão e régie.

Em produção, prefira armazenar a chave como secret:

```bash
npx wrangler secret put PRESENTER_KEY
npm run deploy
```

Se usar um secret, remova `PRESENTER_KEY` da seção `vars` antes da publicação.

## Testar

```bash
npm test
```

Os testes verificam a integridade da configuração, as referências entre slides e enquetes e o cálculo dos resultados.

## Estrutura

```text
presentation-template/
├─ public/
│  ├─ index.html                 telão
│  ├─ participar/index.html      plateia
│  ├─ regie/index.html           painel de controle
│  ├─ presentation.config.js     conteúdo editável
│  └─ assets/                    estilos, sincronização e QR code
├─ src/worker.js                 sala em tempo real e autenticação
├─ tests/                        testes de configuração e resultados
├─ wrangler.jsonc                configuração do Cloudflare
└─ package.json
```

## Licença de terceiro

O gerador de QR code incluído em `public/assets/qrcode.js` usa licença MIT. Consulte [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
