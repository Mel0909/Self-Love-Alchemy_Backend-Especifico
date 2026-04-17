import { prisma } from "@/lib/prisma";

export class UserService {
  static async getUserStats(userId: string) {
    const compras = await prisma.compra.findMany({
      where: { userId: userId },
      include: { produtos: true }
    });

    const numeroDeCompras = compras.length;

    if (numeroDeCompras === 0) {
      return {
        totalGasto: 0,
        numeroDeCompras: 0,
        produtoMaisComprado: null
      };
    }

    let totalGasto = 0;
    const contagemProdutos: Record<string, { nome: string; quantidade: number }> = {};

    for (const compra of compras) {
      totalGasto += compra.precoTotal;

      for (const produto of compra.produtos) {
        if (!contagemProdutos[produto.id]) {
          contagemProdutos[produto.id] = { nome: produto.nome, quantidade: 0 };
        }
        contagemProdutos[produto.id].quantidade += 1;
      }
    }

    let produtoMaisComprado = null;
    let maxQuantidade = 0;

    for (const [id, dados] of Object.entries(contagemProdutos)) {
      if (dados.quantidade > maxQuantidade) {
        maxQuantidade = dados.quantidade;
        produtoMaisComprado = dados.nome;
      }
    }

    return {
      totalGasto,
      numeroDeCompras,
      produtoMaisComprado
    };
  }
}