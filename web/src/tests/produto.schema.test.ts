import { describe, it, expect } from 'vitest';
import { produtoSchema } from '../app/(backend)/schemas/produto.schema';

describe('ProdutoSchema Validation', () => {
  it('deve validar um produto correto', () => {
    const produtoValido = {
      nome: 'Poção de Invisibilidade',
      descricao: 'Uma poção muito poderosa para sumir de reuniões chatas.',
      preco: 150.50,
      categoryIDs: ['67a1b2c3d4e5f6a7b8c9d0e1'] // Um ObjectId válido
    };

    const resultado = produtoSchema.safeParse(produtoValido);
    expect(resultado.success).toBe(true);
  });

  it('deve falhar se o nome for muito curto', () => {
    const produtoInvalido = {
      nome: 'Ab',
      descricao: 'Descrição longa o suficiente...',
      preco: 10,
      categoryIDs: []
    };

    const resultado = produtoSchema.safeParse(produtoInvalido);
    expect(resultado.success).toBe(false);
  });

  it('deve falhar se o categoryID não for um ObjectId válido', () => {
    const produtoComIdRuim = {
      nome: 'Vela Mística',
      descricao: 'Descrição longa o suficiente...',
      preco: 50,
      categoryIDs: ['id-invalido-123']
    };

    const resultado = produtoSchema.safeParse(produtoComIdRuim);
    expect(resultado.success).toBe(false);
  });
});