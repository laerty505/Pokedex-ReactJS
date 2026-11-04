# Pokédex

Aplicação front-end em React que consome a [PokéAPI](https://pokeapi.co/) e exibe os Pokémon em uma interface interativa e responsiva: listagem paginada (páginas anterior/próxima), busca por nome, filtro por tipo e modal de detalhes.

## Como rodar

Requisito: Node.js 20.19 ou superior (exigência do Vite 8).

```bash
npm install
npm start
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

Outros comandos:

- `npm run dev`: igual ao `npm start`, mas com a opção `--host`, que faz o servidor aceitar conexões de outros dispositivos da sua rede (útil para testar no celular).
- `npm run build`: gera a versão de produção; `npm run preview` serve essa versão localmente.
- `npm run lint`: roda o ESLint.


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

- **Listagem:** 20 Pokémon por página, com número, imagem, nome e tipos. Os botões "Próxima Página" e "Página Anterior" navegam entre as páginas (o anterior não aparece na primeira página e o próximo some na última). A imagem usa a arte oficial e, se não houver, a sprite `front_default`.
- **Detalhes:** ao clicar em um card abre um modal com experiência base, altura, peso, tipos, habilidades e estatísticas de base, além da imagem.
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

1. peço a página com `limit` e `offset` (o `offset` é um estado que aumenta ou diminui de 20 em 20 ao navegar entre as páginas);
2. uso `Promise.all` para buscar os detalhes dos 20 ao mesmo tempo (imagem, tipos, estatísticas), o que é mais rápido do que pedir um por vez;
3. substituo a lista atual pelo lote recebido, de modo que a tela mostra apenas a página corrente.

O campo `next` da resposta indica se ainda há mais páginas e controla a exibição do botão "Próxima Página".

### Hooks personalizados

Separei a lógica de dados em hooks para o `App` não ficar com requisições misturadas à interface:

- **`usePokemonList`**: carrega a página atual em um `useEffect` com dependência `[offset]` (roda ao abrir o app e a cada mudança de página) e expõe `incrementOffset` e `decrementOffset`.
- **`useTypes`**: busca os tipos uma única vez. Uso `limit=100` porque o padrão (20) poderia cortar a lista, e removo `unknown` e `shadow`, que não têm Pokémon jogáveis.
- **`usePokemonByType`**: ao contrário da lista geral, o endpoint `/type/{nome}` devolve **todos** os Pokémon do tipo de uma vez, mas só com nome e URL. Guardo essa lista completa (`refs`) e busco os detalhes de 20 em 20 (`refs.slice(offset, offset + 20)`), usando o mesmo princípio da lista geral e os mesmos `incrementOffset` e `decrementOffset`. O tamanho de `refs` é o total mostrado na tela.

### Condição de corrida no filtro por tipo

Os dois `useEffect` do `usePokemonByType` (um busca a lista de referências do tipo, o outro os detalhes da página atual) têm uma função de limpeza (*cleanup*) que marca uma flag `cancelled`. Se o usuário trocar de tipo (ou de página) antes da resposta anterior chegar, a resposta antiga é ignorada e não sobrescreve a nova.

### Escolha entre lista geral e lista por tipo

Os hooks `usePokemonList` e `usePokemonByType` são chamados sempre, pois hooks não podem ficar dentro de `if`. O `App` apenas escolhe qual resultado usar conforme `type` esteja vazio ou não. Depois dessa escolha, o restante do código (busca, mensagens, grid, botão) é o mesmo para os dois casos, sem duplicação.

### Busca por nome

É client-side, como pede a atividade: aplico `filter` com `includes` sobre a lista que já está na memória, sem nova requisição. Ela vale também dentro de um tipo escolhido.

### Componentização e fluxo de dados

O `App` guarda os estados da interface (`selected`, `search`, `type`) e passa dados e funções por props. Os componentes de apresentação (`Header`, `TypeFilter`, `PokemonList`, `PokemonCard`, `PokemonModal`) não fazem requisições: recebem o que mostrar e avisam o `App` por callbacks (`onSearchChange`, `onTypeChange`, `onSelect`, `onClose`). Isso os torna reutilizáveis e fáceis de testar isoladamente.

### Modal

O Pokémon clicado fica guardado em `selected`. Se for `null`, o `PokemonModal` não renderiza nada; ao fechar, o `App` volta `selected` para `null`.

### Carregando e erros

Os hooks de Pokémon mantêm seus estados `loading` e `error` (o `useTypes` mantém só o `error`). As requisições ficam em `try/catch/finally`: o `catch` define uma mensagem amigável e o `finally` sempre desliga o "carregando". A tela mostra "Carregando..." enquanto a lista está vazia e há requisição em andamento, e desabilita os botões "Próxima Página" e "Página Anterior" (que passam a exibir "Carregando...") durante a requisição, evitando cliques duplicados.

## Limitações conhecidas

- A busca por nome só procura entre os Pokémon **da página atual** (20); para achar um que não está nela é preciso navegar pelas páginas.
- A contagem do filtro de tipo mostra "X de Y": Y é o total do tipo na API, X é quantos estão na página atual.
- Alguns Pokémon (formas especiais) podem não ter nem arte oficial nem sprite (`front_default` nulo) e aparecer sem imagem.
- Se a primeira carga da lista geral falhar, a mensagem de erro aparece, mas não há botão para tentar novamente (é preciso recarregar a página).
- O modal fecha apenas pelo botão "X".