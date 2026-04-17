"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { MagicAPI } from "./MagicAPI";

interface AuthContextType {
  usuario: any | null;
  entrar: (email: string, senha: string) => boolean;
  cadastrar: (nome: string, email: string, senha: string) => boolean;
  deslogar: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<any>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const email = localStorage.getItem("email_bruxinha");
    if (email) {
      const dados = MagicAPI.getDadosUsuario(email);
      if (dados) setUsuario({ nome: dados.nome, email: dados.email });
    }
  }, []);

  const entrar = (email: string, senha: string) => {
    const user = MagicAPI.getUsuariosGeral().find((u: any) => u.email === email && u.senha === senha);
    if (user) {
      setUsuario({ nome: user.nome, email: user.email });
      localStorage.setItem("email_bruxinha", user.email);
      localStorage.setItem("nome_bruxinha", user.nome);
      return true;
    }
    return false;
  };

  const cadastrar = (nome: string, email: string, senha: string) => {
    if (MagicAPI.getUsuariosGeral().some((u: any) => u.email === email)) return false;
    const novo = { nome, email, senha, lista_compras: [] };
    MagicAPI.salvarNovoUsuario(novo);
    setUsuario({ nome, email });
    localStorage.setItem("email_bruxinha", email);
    localStorage.setItem("nome_bruxinha", nome);
    return true;
  };

  const deslogar = () => {
    setUsuario(null);
    localStorage.removeItem("email_bruxinha");
    localStorage.removeItem("nome_bruxinha");
  };

  return (
    <AuthContext.Provider value={{ usuario, entrar, cadastrar, deslogar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};