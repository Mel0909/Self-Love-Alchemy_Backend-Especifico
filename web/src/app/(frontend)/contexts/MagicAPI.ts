export const MagicAPI = {
  getUsuariosGeral: () => JSON.parse(localStorage.getItem("grimorio_usuarios") || "[]"),

  salvarNovoUsuario: (usuario: any) => {
    const lista = MagicAPI.getUsuariosGeral();
    lista.push(usuario);
    localStorage.setItem("grimorio_usuarios", JSON.stringify(lista));
  },

  salvarCarrinhoNoUsuario: (email: string, carrinho: any[]) => {
    const lista = MagicAPI.getUsuariosGeral();
    const novaLista = lista.map((u: any) => 
      u.email === email ? { ...u, lista_compras: carrinho } : u
    );
    localStorage.setItem("grimorio_usuarios", JSON.stringify(novaLista));
  },

  getDadosUsuario: (email: string) => {
    const lista = MagicAPI.getUsuariosGeral();
    return lista.find((u: any) => u.email === email);
  }
};