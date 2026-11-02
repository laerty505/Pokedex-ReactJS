# Pokédex

Aplicação front-end em React que consome a [PokéAPI](https://pokeapi.co/) e exibe os Pokémon em uma interface interativa e responsiva: listagem paginada, busca por nome, filtro por tipo e modal de detalhes.

## Como rodar

Requisito: Node.js 18 ou superior.

```bash
npm install
npm start
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

Outros comandos:

- `npm run dev`: equivalente ao `npm start`, ele faz o servidor aceitar conexões de outros dispositivos da sua rede (útil para testar no celular).


## Tecnologias e dependências

- **React 19**: somente componentes de função, com os hooks `useState` e `useEffect` (sem classes).
- **Vite 8** (`@vitejs/plugin-react`): servidor de desenvolvimento e build.
- **Tailwind CSS 4** (`tailwindcss` e `@tailwindcss/vite`): estilização por classes utilitárias e responsividade (grid e breakpoints `sm`, `md`, `lg`).
- **fetch** nativo para as requisições (sem axios).

## Estrutura do projeto

```
src/
├── main.jsx                  # ponto de entrada
├── App.jsx                   # estados da interface e montagem da tela
├── App.css                   # apenas o import do Tailwind
├── services/
│   └── api.js                # funções que falam com a PokéAPI
├── components/
│   ├── Header.jsx            # título e campo de busca por nome
│   ├── TypeFilter.jsx        # seletor de tipo, contagem e botão de voltar
│   ├── PokemonList.jsx       # grid responsivo de cards
│   ├── PokemonCard.jsx       # card de um Pokémon (id, imagem, nome, tipos)
│   └── PokemonModal.jsx      # janela de detalhes
└── hooks/
    ├── usePokemonList.js     # lista geral paginada
    ├── useTypes.js           # tipos vindos de /type
    └── usePokemonByType.js   # Pokémon de um tipo, paginados
```

## Funcionalidades

- **Listagem:** 20 Pokémon por vez, com número, imagem (sprite), nome e tipos. O botão "Carregar mais Pokémon" traz o próximo lote.
- **Detalhes:** ao clicar em um card abre um modal com experiência base, altura, peso, tipos, habilidades e estatísticas de base, além da sprite.
- **Busca por nome:** filtro client-side por parte do nome, sem diferenciar maiúsculas de minúsculas.
- **Filtro por tipo:** a lista de tipos vem do endpoint `/type`. Ao escolher um tipo, a tela mostra "mostrando X de Y Pokémon" e permite voltar à lista completa.
- **Carregando e erros:** mensagem "Carregando..." durante as requisições e mensagem de erro em vermelho se a API falhar.
- **Responsividade:** o grid vai de 2 colunas (celular) até 5 (desktop); o cabeçalho e o filtro quebram linha em telas pequenas.

## Decisões de implementação

### Consumo da API (`api.js`)

Concentrei todas as requisições em um único arquivo, com uma função `get` que:

- devolve `null` em caso de 404, para a chamada não quebrar com um recurso inexistente;
- lança um erro para qualquer outra resposta que não seja bem-sucedida, para os `catch` dos hooks tratarem.

Assim os componentes e hooks não precisam conhecer URLs nem detalhes do `fetch`.

### Paginação e detalhes de cada Pokémon

O endpoint `/pokemon` devolve só nome e URL. Por isso, para cada lote de 20 Pokémon:

1. peço a página com `limit` e `offset` (o `offset` é o tamanho da lista já carregada);
2. uso `Promise.all` para buscar os detalhes dos 20 ao mesmo tempo (imagem, tipos, estatísticas), o que é mais rápido do que pedir um por vez;
3. acrescento o lote à lista existente, sem apagar o que já estava na tela.

O campo `next` da resposta indica se ainda há mais páginas e controla a exibição do botão "Carregar mais".

### Hooks personalizados

Separei a lógica de dados em hooks para o `App` não ficar com requisições misturadas à interface:

- **`usePokemonList`**: carrega a primeira página em um `useEffect` com dependência `[]` (roda uma vez ao abrir o app) e expõe `loadMore`.
- **`useTypes`**: busca os tipos uma única vez. Uso `limit=100` porque o padrão (20) poderia cortar a lista, e removo `unknown` e `shadow`, que não têm Pokémon jogáveis.
- **`usePokemonByType`**: ao contrário da lista geral, o endpoint `/type/{nome}` devolve **todos** os Pokémon do tipo de uma vez, mas só com nome e URL. Guardo essa lista completa (`refs`) e busco os detalhes de 20 em 20, usando o mesmo princípio da lista geral. O tamanho de `refs` é o total mostrado na tela.

### Condição de corrida no filtro por tipo

O `useEffect` do `usePokemonByType` depende de `[type]` e tem uma função de limpeza (*cleanup*) que marca uma flag `cancelled`. Se o usuário trocar de tipo antes da resposta anterior chegar, a resposta antiga é ignorada e não sobrescreve a nova.

### Escolha entre lista geral e lista por tipo

Os hooks `usePokemonList` e `usePokemonByType` são chamados sempre, pois hooks não podem ficar dentro de `if`. O `App` apenas escolhe qual resultado usar conforme `type` esteja vazio ou não. Depois dessa escolha, o restante do código (busca, mensagens, grid, botão) é o mesmo para os dois casos, sem duplicação.

### Busca por nome

É client-side, como pede a atividade: aplico `filter` com `includes` sobre a lista que já está na memória, sem nova requisição. Ela vale também dentro de um tipo escolhido.

### Componentização e fluxo de dados

O `App` guarda os estados da interface (`selected`, `search`, `type`) e passa dados e funções por props. Os componentes de apresentação (`Header`, `TypeFilter`, `PokemonList`, `PokemonCard`, `PokemonModal`) não fazem requisições: recebem o que mostrar e avisam o `App` por callbacks (`onSearchChange`, `onTypeChange`, `onSelect`, `onClose`). Isso os torna reutilizáveis e fáceis de testar isoladamente.

### Modal

O Pokémon clicado fica guardado em `selected`. Se for `null`, o `PokemonModal` não renderiza nada; ao fechar, o `App` volta `selected` para `null`.

### Carregando e erros

Cada hook mantém seus estados `loading` e `error`. Os `fetch` ficam em `try/catch/finally`: o `catch` define uma mensagem amigável e o `finally` sempre desliga o "carregando". A tela mostra "Carregando..." na primeira carga e desabilita o botão "Carregar mais" enquanto há requisição em andamento, evitando cliques duplicados.

## Limitações conhecidas

- A busca por nome só procura entre os Pokémon **já carregados**; para achar um que ainda não apareceu é preciso clicar em "Carregar mais".
- A contagem do filtro de tipo mostra "X de Y": Y é o total do tipo na API, X é quantos já foram carregados.
- Alguns Pokémon (formas especiais) podem não ter sprite (`front_default` nulo) e aparecer sem imagem.
- Se a primeira carga da lista geral falhar, a mensagem de erro aparece, mas não há botão para tentar novamente (é preciso recarregar a página).
- O modal fecha apenas pelo botão "X".
