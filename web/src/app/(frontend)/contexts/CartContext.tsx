"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { authClient } from "@/lib/auth-client"; 
import { useToast } from "./ToastContext";

const CartContext = createContext<any>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const salvo = localStorage.getItem("alchemy-cart");
      return salvo ? JSON.parse(salvo) : [];
    }
    return [];
  });

  const [estaCarregandoBanco, setEstaCarregandoBanco] = useState(false);
  const { data: session } = authClient.useSession();
  const { addToast } = useToast();
  
  const inicializado = useRef(false);

  useEffect(() => {
    async function sincronizarComBanco() {
      if (session?.user) {
        setEstaCarregandoBanco(true);
        try {
          const res = await fetch("/api/carrinho");
          const data = await res.json();
          if (data.carrinho && data.carrinho.length > 0) {
            setCarrinho(data.carrinho);
          }
        } catch (error) {
          console.error("Erro ao sincronizar banco:", error);
        } finally {
          setEstaCarregandoBanco(false);
          inicializado.current = true;
        }
      } else {
        inicializado.current = true;
      }
    }
    sincronizarComBanco();
  }, [session]);

  useEffect(() => {
    if (inicializado.current && !estaCarregandoBanco) {
      localStorage.setItem("alchemy-cart", JSON.stringify(carrinho));

      if (session?.user) {
        fetch("/api/carrinho", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carrinho })
        });
      }
    }
  }, [carrinho, session, estaCarregandoBanco]);


  const adicionarAoCarrinho = (produto: any) => {
    const existe = carrinho.find((item) => item.id === produto.id);
    if (existe) {
      setCarrinho(prev => prev.map(item => 
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
      addToast(`Mais um(a) ${produto.nome} adicionado!`);
    } else {
      setCarrinho(prev => [...prev, { ...produto, quantidade: 1 }]);
      addToast(`${produto.nome} no caldeirão! ✨`);
    }
  };

  const atualizarQuantidade = (id: string, mudanca: number) => {
    setCarrinho(prev => prev.map(item => 
      item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade + mudanca) } : item
    ));
  };

  const removerDoCarrinho = (id: string) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
    addToast("Item removido!");
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem("alchemy-cart");
    if (session?.user) {
      fetch("/api/carrinho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrinho: [] })
      });
    }
  };

  return (
    <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, atualizarQuantidade, limparCarrinho }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

