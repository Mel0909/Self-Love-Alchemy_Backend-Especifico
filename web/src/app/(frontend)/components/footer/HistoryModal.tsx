"use client";
import styles from "./HistoryModal.module.css"; // Importação corrigida!

interface HistoryModalProps {
  onClose: () => void;
}

export default function HistoryModal({ onClose }: HistoryModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeModal} onClick={onClose}>×</button>
        
        <h2 className={styles.historyText} style={{ textAlign: 'center', fontSize: '1.5rem', fontFamily: 'Cinzel Decorative' }}>
          O Segredo da Nossa Magia ✨
        </h2>
        
        <div className={styles.historyBody}>
          <h3 className={styles.subTitle}>Projeto Final: Treinamento de Fundamentos</h3>
          
          <p className={styles.historyText}>
            Bem-vindo(a) ao nosso coven! Este espaço místico foi desenvolvido como o projeto final 
            do treinamento de Fundamentos Web. Cada detalhe, desde os elixires até os feitiços de 
            CSS, foi pensado para unir tecnologia e autocuidado.
          </p>
          
          <p className={styles.historyText}>
            Embora nossos produtos sejam poções digitais, o propósito é real: criar uma 
            experiência de encanto e inspirar a jornada de amor próprio de cada bruxinha 
            que navega por aqui.
          </p>

          <p className={styles.quote}>
            "A verdadeira alquimia acontece no momento em que você decide cultivar o amor por si mesma." 🌙
          </p>
        </div>
      </div>
    </div>
  );
}