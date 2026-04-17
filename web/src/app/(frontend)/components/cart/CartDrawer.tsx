"use client";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { authClient } from "@/lib/auth-client";
import CartItem from "./CartItem";
import styles from "./CartDrawer.module.css";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { carrinho, limparCarrinho } = useCart();
  const { addToast } = useToast();

  const { data: session } = authClient.useSession();

 const total = carrinho.reduce((acc: number, item: any) => {
    return acc + (item.preco * item.quantidade);
  }, 0);

  const finalizarCompra = async () => {
    if (!session) {
      addToast("Acesse seu coven para finalizar! (Login)");
      return;
    }

    try {
      const response = await fetch("/api/compras/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itens: carrinho
        })
      });

      if (response.ok) {
        addToast("Magia concluída! Compra registrada com sucesso. ✨");
        limparCarrinho();
        onClose();
      } else {
        const err = await response.json();
        addToast(`O caldeirão falhou: ${err.error}`);
      }
    } catch (error) {
      addToast("Erro de conexão com o plano astral.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeModal} onClick={onClose}>&times;</button>
        
        <h2 className={styles.modalTitle}>Seu Caldeirão Místico</h2>

        <div className={styles.cartItemsContainer}>
          {carrinho.length === 0 ? (
            <p style={{textAlign: 'center', color: '#999', padding: '40px 0', fontStyle: 'italic'}}>
              Seu caldeirão está vazio e frio... <br/> Adicione itens para começar a magia! ✨
            </p>
          ) : (
            carrinho.map((item: any) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {carrinho.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.totalContainer}>
              <span>Total da Jornada:</span>
              <span className={styles.totalPrice}>
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <button 
              className={styles.checkoutBtn} 
              onClick={finalizarCompra}
              disabled={carrinho.length === 0}
            >
              Finalizar Alquimia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}