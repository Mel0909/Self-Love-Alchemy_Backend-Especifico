"use client";
import styles from "./Footer.module.css";

interface ContatoProps {
  onOpenHistory: () => void;
}

export default function Contato({ onOpenHistory }: ContatoProps) {
  return (
    <div className={`${styles.footerCol} ${styles.brandCol}`}>
      <img 
        src="/imgs/simbolos/bruxinha.png" 
        alt="Bruxinha Alchemy" 
        className={styles.footerImg} 
      />
      
      <div className={styles.brandInfo}>
        <h4 className={styles.footerTitle}>Nossa História ✨</h4>
        <button className={styles.historyLink} onClick={onOpenHistory}>
          Saiba mais sobre o nosso coven.
        </button>
      </div>

      <div className={styles.contactInfo}>
        <h4 className={styles.footerTitle}>Contato Mágico 🌙</h4>
        <p>Telefone: <a href="https://wa.me/5562986070909" target="_blank" className={styles.contactLink}>+55 (62) 98607-0909</a></p>
        <p>E-mail: <a href="mailto:mel.bichuetti@gmail.com" className={styles.contactLink}>mel.bichuetti@gmail.com</a></p>
        <p>Linkedin: <a href="https://www.linkedin.com/in/mel-neves-146937335/" target="_blank" className={styles.contactLink}>Mel Neves</a></p>
      </div>
    </div>
  );
}