"use client";
import { useCart } from "../../contexts/CartContext";
import styles from "./ProductCard.module.css";

export default function ProductCard({ produto, onOpenZoom }: any) {
  const { adicionarAoCarrinho } = useCart();

  return (
    <article className={styles.productCard}>
      <div className={styles.productImage} onClick={onOpenZoom}>
        <img src={produto.imagem} alt={produto.nome} />
      </div>
      
      <div className={styles.productInfo}>
        <h3>{produto.nome}</h3>
        <p className={styles.price}>R$ {produto.preco.toFixed(2)}</p>
        
        <div className={styles.cardButtons}>
          <button className={styles.viewBtn} onClick={onOpenZoom}>
            Ver Detalhes
          </button>
          <button 
            className={styles.addToCartBtn} 
            onClick={(e) => {
                e.stopPropagation();
                adicionarAoCarrinho(produto);
            }}
        >
            Adicionar ao Caldeirão
        </button>
        </div>
      </div>
    </article>
  );
}