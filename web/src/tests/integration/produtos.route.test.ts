import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/(backend)/api/produtos/route';
import { prisma } from '@/lib/prisma';

vi.mock('@/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'user-123', email: 'mel@poli.usp.br' }
      })
    }
  }
}));

vi.mock('@/utils/s3', () => ({
  uploadImageToS3: vi.fn().mockResolvedValue('https://s3.mock.com/pocao.png')
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    produto: {
      create: vi.fn()
    }
  }
}));

describe('API Integration: POST /api/produtos', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar um produto com sucesso quando os dados são válidos', async () => {
    
    const formData = new FormData();
    formData.append('nome', 'Poção de Foco Prova da Poli');
    formData.append('descricao', 'Garante 10 em Cálculo se estudar o suficiente.');
    formData.append('preco', '150.00');
    formData.append('categoryIDs', '65f1234567890abcdef12345');
    
    const file = new File([''], 'test.png', { type: 'image/png' });
    formData.append('imagem', file);

    const req = new Request('http://localhost:3000/api/produtos', {
      method: 'POST',
      body: formData,
    });

    (prisma.produto.create as any).mockResolvedValue({
      id: 'prod-999',
      nome: 'Poção de Foco Prova da Poli',
      preco: 150.00
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe('prod-999');
    expect(prisma.produto.create).toHaveBeenCalled();
  });

  it('deve retornar 401 se o usuário não estiver logado', async () => {
    
    const { auth } = await import('@/auth');
    (auth.api.getSession as any).mockResolvedValueOnce(null);

    const req = new Request('http://localhost:3000/api/produtos', {
      method: 'POST',
      body: new FormData(),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});