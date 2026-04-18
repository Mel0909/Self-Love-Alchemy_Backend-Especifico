"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import styles from "./LoginModal.module.css";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState(""); // Código que chega no e-mail
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
      addToast("Erro ao dissipar a magia.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const emailCompleto = email.includes("@") ? email : `${email}@gmail.com`;

    try {
      if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: emailCompleto }),
        });
        if (res.ok) {
          addToast("Coruja enviada! Copie o código do e-mail. 🦉");
          setMode("reset"); // Muda para a tela de digitar o código e nova senha
        } else {
          addToast("E-mail não encontrado no grimório.");
        }
      } 
      
      else if (mode === "reset") {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ token, password: senha }),
        });
        if (res.ok) {
          addToast("Magia restaurada! Agora faça login.");
          setMode("login");
        } else {
          addToast("Código inválido ou expirado.");
        }
      }

      else if (mode === "login") {
        const { error } = await authClient.signIn.email({ email: emailCompleto, password: senha });
        if (error) addToast("Credenciais incorretas!");
        else { addToast("Bem-vinda de volta!"); onClose(); }
      }

      else if (mode === "signup") {
        const { error } = await authClient.signUp.email({ email: emailCompleto, password: senha, name: nome });
        if (error) addToast(error.message || "Erro no cadastro.");
        else { addToast("Grimório criado!"); onClose(); }
      }
    } catch (err) {
      addToast("Erro na conexão astral.");
    } finally {
      setLoading(false);
    }
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
              <button className={styles.loginBtn} onClick={handleLogout} disabled={loading}>
                {loading ? "Saindo..." : "Sair da Conta"}
              </button>
            </div>
          ) : (
            <>
              <h2 className={styles.modalTitle}>
                {mode === "login" && "Bem-vinda de volta"}
                {mode === "signup" && "Nova Bruxinha"}
                {mode === "forgot" && "Recuperar Magia"}
                {mode === "reset" && "Nova Palavra Mágica"}
              </h2>

              <form style={{ width: '100%' }} onSubmit={handleAction}>
                {mode === "signup" && (
                  <input type="text" placeholder="Nome de bruxa" className={styles.inputMagico} value={nome} onChange={(e) => setNome(e.target.value)} required />
                )}

                {/* Mostra o campo de e-mail em todos os modos, EXCETO no reset final */}
                {mode !== "reset" && (
                  <div className={styles.emailWrapper}>
                    <input type="text" placeholder="correio mágico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <span className={styles.sufixo}>@gmail.com</span>
                  </div>
                )}

                {/* Campo de Código (TOKEN) - Apenas no modo Reset */}
                {mode === "reset" && (
                  <input type="text" placeholder="Código do e-mail" className={styles.inputMagico} value={token} onChange={(e) => setToken(e.target.value)} required />
                )}

                {/* Campo de Senha - Escondido apenas no modo de solicitar e-mail (forgot) */}
                {mode !== "forgot" && (
                  <>
                    <input type="password" placeholder={mode === "reset" ? "Nova palavra mágica" : "Palavra mágica"} className={styles.inputMagico} value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    {mode === "login" && (
                      <p className={styles.forgotLink} onClick={() => setMode("forgot")}>Esqueci minha palavra mágica</p>
                    )}
                  </>
                )}

                <button type="submit" className={styles.loginBtn} disabled={loading}>
                  {loading ? "Invocando..." : 
                    mode === "login" ? "Entrar no Caldeirão" : 
                    mode === "signup" ? "Criar Grimório" : 
                    mode === "forgot" ? "Enviar Coruja" : "Restaurar Magia"
                  }
                </button>
              </form>

              <p className={styles.toggleLink} onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
                {mode === "signup" ? "Já sou uma bruxinha" : "Quero me tornar uma bruxinha"}
              </p>
              
              {mode !== "login" && (
                <p className={styles.toggleLink} style={{marginTop: '5px'}} onClick={() => setMode("login")}>Voltar ao Início</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}