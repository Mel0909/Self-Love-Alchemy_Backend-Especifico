"use client";
import { useCart } from "../../contexts/CartContext";
import styles from "./CartItem.module.css";

export default function CartItem({ item }: any) {
  const { removerDoCarrinho, atualizarQuantidade } = useCart();

  return (
    <div className={styles.cartItem}>
      <img src={item.imagem} alt={item.nome} className={styles.itemThumb} />

      <div className={styles.itemInfo}>
        <h4>{item.nome}</h4>
        <p className={styles.itemPrice}>
          {item.quantidade}x R$ {item.preco.toFixed(2).replace(".", ",")}
        </p>
      </div>

      <div className={styles.qtSelector}>
        <button 
          className={styles.qtBtn} 
          onClick={() => atualizarQuantidade(item.id, -1)}
        >
          -
        </button>
        
        <span className={styles.qtNumber}>{item.quantidade}</span>
        
        <button 
          className={styles.qtBtn} 
          onClick={() => atualizarQuantidade(item.id, 1)}
        >
          +
        </button>
      </div>

      <button className={styles.removeBtn} onClick={() => removerDoCarrinho(item.id)}>
        🗑️
      </button>
    </div>
  );
}