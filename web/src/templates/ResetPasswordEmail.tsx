import * as React from 'react';

export const ResetPasswordEmail = ({ resetLink }: { resetLink: string }) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
    <h1>Recuperação de Senha</h1>
    <p>Você solicitou a alteração de senha da sua conta na Lojinha.</p>
    <p>Clique no botão abaixo para definir uma nova senha. Este link expira em 1 hora.</p>
    <a href={resetLink} style={{
      background: '#8b5cf6',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none'
    }}>
      Alterar Senha
    </a>
    <p>Se não foi você, apenas ignore este e-mail.</p>
  </div>
);