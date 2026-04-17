"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import styles from "./LoginModal.module.css";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = authClient.useSession();
  const { limparCarrinho } = useCart();
  const { addToast } = useToast();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      limparCarrinho();
      addToast("Sessão encerrada e caldeirão limpo! ✨");
      onClose();
    } catch (error) {
      addToast("Erro ao dissipar a magia do login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const emailCompleto = email.includes("@") ? email : `${email}@gmail.com`;

    if (isLogin) {
      const { error } = await authClient.signIn.email({
        email: emailCompleto,
        password: senha,
      });

      if (error) {
        addToast("Credenciais incorretas no grimório!");
      } else {
        addToast(`Bem-vinda de volta ao coven!`);
        onClose();
      }
    } else {
      if (!nome) return addToast("Preencha seu nome de bruxa!");
      const { error } = await authClient.signUp.email({
        email: emailCompleto,
        password: senha,
        name: nome,
      });

      if (error) {
        addToast(error.message || "Erro ao criar grimório.");
      } else {
        addToast("Cadastro realizado! Bem-vinda.");
        onClose();
      }
    }
    setLoading(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeModal} onClick={onClose}>&times;</button>
        <div className={styles.modalLoginBody}>
          <img src="/imgs/simbolos/bruxinha.png" alt="Bruxinha" className={styles.loginImg} />

          {session?.user ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h2 className={styles.modalTitle}>Olá, Bruxa {session.user.name}!</h2>
              <p>Sua conta está ativa e sua magia carregada.</p>
              <button 
                className={styles.loginBtn} 
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "Saindo..." : "Sair da Conta"}
              </button>
            </div>
          ) : (
            <>
              <h2 className={styles.modalTitle}>{isLogin ? "Bem-vinda de volta" : "Nova Bruxinha"}</h2>
              <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                {!isLogin && (
                  <input type="text" placeholder="Nome de bruxa" className={styles.inputMagico} value={nome} onChange={(e) => setNome(e.target.value)} required />
                )}
                <div className={styles.emailWrapper}>
                  <input type="text" placeholder="correio mágico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <span className={styles.sufixo}>@gmail.com</span>
                </div>
                <input type="password" placeholder="Palavra mágica" className={styles.inputMagico} value={senha} onChange={(e) => setSenha(e.target.value)} required />
                <button type="submit" className={styles.loginBtn} disabled={loading}>
                  {loading ? "Invocando..." : (isLogin ? "Entrar no Caldeirão" : "Criar Grimório")}
                </button>
              </form>
              <p className={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Quero me tornar uma bruxinha" : "Já sou uma bruxinha"}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}