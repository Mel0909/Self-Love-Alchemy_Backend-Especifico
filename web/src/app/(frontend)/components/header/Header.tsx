"use client";
import { useState, useEffect } from "react"; // Adicionamos useEffect
import { authClient } from "@/lib/auth-client"; 
import { useCart } from "../../contexts/CartContext";
import styles from "./Header.module.css";

export default function Header({ onOpenCart, onOpenLogin }: any) {
  const { data: session } = authClient.useSession();
  const { carrinho } = useCart();
  
  const [estaMontado, setEstaMontado] = useState(false);

  useEffect(() => {
    setEstaMontado(true);
  }, []);

  const numCarrinho = carrinho?.length || 0;
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src="/imgs/simbolos/logo.png" alt="Logo" className={styles.logoImg} />
        <h1 className={styles.nome}>Self-Love Alchemy</h1>
      </div>

      <button className={styles.menuMobileBtn} onClick={toggleMenu}>
        ☰
      </button>

      <div className={`${styles.headerRight} ${menuAberto ? styles.headerRightActive : ""}`}>
        
        <div className={styles.user} onClick={() => {
          onOpenLogin();
          setMenuAberto(false);
        }}>
          <img src="/imgs/simbolos/perfil.png" alt="Perfil" className={styles.userImg} />
          <span className={styles.userName}>
            {session?.user?.name ? `Oi, ${session.user.name}!` : "Bruxinha"}
          </span>
          <span className={styles.menuText}>Minha Conta</span>
        </div>
        
        <div className={styles.carrinhoContainer} onClick={() => {
          onOpenCart();
          setMenuAberto(false);
        }}>
          <img src="/imgs/simbolos/carrinho.png" alt="Carrinho" className={styles.carrinhoImg} />
          <span className={styles.menuText}>Meu Caldeirão</span>
          
          <span className={styles.numCarrinho}>
            {estaMontado ? numCarrinho : 0}
          </span> 
        </div>

      </div>
    </header>
  );
}