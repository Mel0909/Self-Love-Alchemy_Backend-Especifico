import { resend } from "@/lib/resend";
import { StatusUpdateEmail } from "@/templates/StatusUpdateEmail";
import * as React from 'react'; 

export async function sendEmail(to: string, nome: string, status: string, idCompra: string) {
  let subject = "Atualização de Pedido - Lojinha";
  
  if (status === "paid") subject = "Pagamento confirmado";
  if (status === "shipped") subject = "Seu pedido foi enviado";
  if (status === "delivered") subject = "Seu pedido foi entregue com sucesso";

  try {
    const { data, error } = await resend.emails.send({
      from: 'Lojinha <onboarding@resend.dev>', 
      to: [to],
      subject: subject,
      react: <StatusUpdateEmail nome={nome} status={status} idCompra={idCompra} />,
    });

    if (error) {
        console.error("Erro na API do Resend:", error);
        return;
    }
    
    return data;
  } catch (err) {
    console.error("Erro técnico no disparo do e-mail:", err);
  }
}