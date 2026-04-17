"use client";
import { useToast } from "../../contexts/ToastContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { addToast } = useToast();

  const assinarGrimorio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;

    if (emailInput.value) {
      addToast("O universo registrou seu e-mail! Verifique sua caixa de entrada. ✨");
      form.reset();
    }
  };

  return (
    <footer className={styles.alchemyFooter}>
      <div className={styles.footerContainer}>
        
        <div className={`${styles.footerCol} ${styles.brandCol}`}>
          <img 
            src="/imgs/simbolos/bruxinha.png" 
            alt="Bruxinha Self-Love Alchemy" 
            className={styles.footerImg} 
          />
          
          <div className={styles.brandTextContent}>
            <div className={styles.brandInfo}>
              <h4 className={styles.footerTitle}>Nossa História ✨</h4>
              <button className={styles.historyLink}>
                Saiba mais sobre o nosso coven.
              </button>
            </div>

            <div className={styles.contactInfo}>
              <h4 className={styles.footerTitle}>Contato Mágico 🌙</h4>
              <p>Telefone: 
                <a href="https://wa.me/5562986070909" target="_blank" className={styles.contactLink}>
                  +55 (62) 98607-0909
                </a>
              </p>
              <p>E-mail: 
                <a href="mailto:mel.bichuetti@gmail.com" className={styles.contactLink}>
                  mel.bichuetti@gmail.com
                </a>
              </p>
              <p>Linkedin: 
                <a href="https://www.linkedin.com/in/mel-neves-146937335/" target="_blank" className={styles.contactLink}>
                  Mel Neves
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className={`${styles.footerCol} ${styles.newsletterCol}`}>
          <h4 className={styles.footerTitle}>Assine nosso Grimório 📖</h4>
          <p className={styles.newsletterDesc}>
            Inscreva-se para receber rituais exclusivos, novidades da estante mágica e descontos secretos.
          </p>
          
          <form className={styles.newsletterForm} onSubmit={assinarGrimorio}>
            <input type="email" placeholder="Seu e-mail mágico..." required />
            <button type="submit">Manifestar ✨</button>
          </form>
        </div>

      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2026 Self-Love Alchemy. Cultivando a magia interior.</p>
      </div>
    </footer>
  );
}