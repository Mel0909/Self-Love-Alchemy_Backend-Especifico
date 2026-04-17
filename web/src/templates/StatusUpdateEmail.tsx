import * as React from 'react';

interface StatusUpdateEmailProps {
  nome: string;
  status: string;
  idCompra: string;
}

export const StatusUpdateEmail: React.FC<Readonly<StatusUpdateEmailProps>> = ({
  nome,
  status,
  idCompra,
}) => {
  const statusMessages: Record<string, string> = {
    paid: "O seu pagamento foi confirmado e já estamos a preparar o seu pedido!",
    shipped: "Boas notícias! O seu pedido foi enviado e está a caminho.",
    delivered: "O seu pedido foi entregue com sucesso. Aproveite a sua compra!",
    cancelled: "O seu pedido foi cancelado. Se tiver dúvidas, entre em contacto connosco."
  };

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
      <h1>Olá, {nome}!</h1>
      <p>Temos uma atualização sobre o seu pedido <strong>#{idCompra}</strong>.</p>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Status atual: {status.toUpperCase()}
      </p>
      <p>{statusMessages[status] || "O status do seu pedido foi alterado."}</p>
      <hr />
      <p style={{ fontSize: '12px', color: '#777' }}>
        Obrigado por comprar na Lojinha!
      </p>
    </div>
  );
};