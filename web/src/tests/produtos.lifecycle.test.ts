import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/(backend)/api/produtos/route';
import { PATCH, DELETE } from '@/app/(backend)/api/produtos/[id]/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/auth', () => ({
  auth: { 
    api: { 
      getSession: vi.fn().mockResolvedValue({ user: { id: 'admin-123', email: 'mel@poli.usp.br' } }) 
    } 
  }
}));

vi.mock('@/utils/s3', () => ({
  uploadImageToS3: vi.fn().mockResolvedValue('https://s3.mock.com/nova-imagem.png'),
  deleteImageFromS3: vi.fn().mockResolvedValue(true)
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    produto: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  }
}));

describe('Ciclo de Vida do Produto - Teste de Integração', () => {
  const mockId = '65f1234567890abcdef12345';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve executar o fluxo completo: Criar -> Editar -> Deletar', async () => {
    
    const formCreate = new FormData();
    formCreate.append('nome', 'Poção de Teste');
    formCreate.append('descricao', 'Uma descrição mágica com mais de dez caracteres.');
    formCreate.append('preco', '50.0');
    formCreate.append('categoryIDs', mockId);

    (prisma.produto.create as any).mockResolvedValue({ 
      id: mockId, 
      nome: 'Poção de Teste', 
      descricao: 'Uma descrição mágica com mais de dez caracteres.',
      imagem: 'https://s3.mock.com/imagem-inicial.png' 
    });

    const resCreate = await POST(new Request('http://localhost/api/produtos', { 
      method: 'POST', 
      body: formCreate 
    }));
    
    expect(resCreate.status).toBe(201);
    expect(prisma.produto.create).toHaveBeenCalled();
    
    const formUpdate = new FormData();
    formUpdate.append('nome', 'Poção Atualizada');
    const file = new File(['fake-content'], 'nova-foto.png', { type: 'image/png' });
    formUpdate.append('imagem', file);

    (prisma.produto.findUnique as any).mockResolvedValue({ 
      id: mockId, 
      imagem: 'https://s3.mock.com/imagem-velha.png' 
    });
    
    (prisma.produto.update as any).mockResolvedValue({ 
      id: mockId, 
      nome: 'Poção Atualizada' 
    });

    const resUpdate = await PATCH(
        new Request(`http://localhost/api/produtos/${mockId}`, { method: 'PATCH', body: formUpdate }),
        { params: { id: mockId } }
    );
    
    expect(resUpdate.status).toBe(200);
    
    const { deleteImageFromS3 } = await import('@/utils/s3');
    expect(deleteImageFromS3).toHaveBeenCalledWith('https://s3.mock.com/imagem-velha.png');

    (prisma.produto.findUnique as any).mockResolvedValue({ 
      id: mockId, 
      imagem: 'https://s3.mock.com/nova-imagem.png' 
    });
    (prisma.produto.delete as any).mockResolvedValue({ id: mockId });

    const resDelete = await DELETE(
        new Request(`http://localhost/api/produtos/${mockId}`, { method: 'DELETE' }),
        { params: { id: mockId } }
    );

    expect(resDelete.status).toBe(200);
    expect(prisma.produto.delete).toHaveBeenCalledWith({ where: { id: mockId } });
    expect(deleteImageFromS3).toHaveBeenCalledWith('https://s3.mock.com/nova-imagem.png');
  });
});