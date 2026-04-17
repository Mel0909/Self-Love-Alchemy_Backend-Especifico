import { ToastProvider } from "./(frontend)/contexts/ToastContext";
import { AuthProvider } from "./(frontend)/contexts/AuthContext";
import { CartProvider } from "./(frontend)/contexts/CartContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}