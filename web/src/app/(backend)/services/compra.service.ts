import { prisma } from "@/lib/prisma";

export class CompraService {
  static async efetivarCompra(userId: string, itensCarrinho: { id: string; quantidade: number }[]) {
    const produtoIDs = itensCarrinho.map(item => item.id);

    const produtosNoBanco = await prisma.produto.findMany({
      where: { id: { in: produtoIDs } }
    });

    if (produtosNoBanco.length === 0) {
      throw new Error("Nenhum produto válido encontrado para esta compra.");
    }

    let precoTotal = 0;
    for (const itemFront of itensCarrinho) {
      const produtoReal = produtosNoBanco.find(p => p.id === itemFront.id);
      if (produtoReal) {
        precoTotal += (produtoReal.preco * itemFront.quantidade);
      }
    }

    const novaCompra = await prisma.compra.create({
      data: {
        userId: userId,
        precoTotal: precoTotal,
        produtos: {
          connect: produtosNoBanco.map(p => ({ id: p.id }))
        }
      }
    });

    return novaCompra;
  }
}