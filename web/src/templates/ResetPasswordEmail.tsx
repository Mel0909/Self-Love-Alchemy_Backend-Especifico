import * as React from 'react';

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export const ResetPasswordEmail: React.FC<Readonly<ResetPasswordEmailProps>> = ({
  name,
  resetUrl,
}) => (
  <div>
    <h1>Olá, {name}!</h1>
    <p>Você solicitou a recuperação de senha na Lojinha.</p>
    <p>Clique no link abaixo para definir uma nova senha:</p>
    <a href={resetUrl}>Redefinir Senha</a>
    <p>Se você não solicitou isso, ignore este e-mail.</p>
  </div>
);