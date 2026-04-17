"use client";
import styles from "./Footer.module.css";

export default function Assinatura() {
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    alert("O universo registrou seu e-mail! ✨");
  };

  return (
    <div className={`${styles.footerCol} ${styles.newsletterCol}`}>
      <h4 className={styles.footerTitle}>Assine nosso Grimório 📖</h4>
      <p className={styles.newsletterDesc}>
        Inscreva-se para receber rituais exclusivos e novidades da estante mágica.
      </p>
      <form className={styles.newsletterForm} onSubmit={handleNewsletter}>
        <input type="email" placeholder="Seu e-mail mágico..." required />
        <button type="submit">Manifestar ✨</button>
      </form>
    </div>
  );
}