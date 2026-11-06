
function Header({ search, onSearchChange }) {   // recebe duas props: search = termo de busca, onSearchChange = função que atualiza o termo de busca
  return (
    <header className="bg-slate-950 border-b border-slate-700 shadow-lg">
      <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-5">
        <h1 className="text-3xl font-extrabold text-white">Pokédex</h1>

        <input
          type="text"
          placeholder="Digite parte do nome do Pokémon..."
          value={search}    // value do input é o termo de busca atual, vindo da prop search
          onChange={(e) => onSearchChange(e.target.value)}    // onChange chama a função onSearchChange com o novo valor do input, atualizando o termo de busca
          className="w-full max-w-md rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        />
      </div>
    </header>
  );
}

export default Header;
