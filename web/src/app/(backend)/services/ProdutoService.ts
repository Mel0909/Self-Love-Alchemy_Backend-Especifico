import { prisma } from "../../../lib/prisma";

export const ProdutoService = {
  async listarTodos() {
    return await prisma.produto.findMany({
    });
  },

  async criar(dados: { 
    nome: string; 
    descricao: string; 
    preco: number; 
    imagem?: string;
    categoryIDs?: string[]
  }) {
    return await prisma.produto.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        preco: dados.preco,
        imagem: dados.imagem,
        categorias: {
          connect: dados.categoryIDs?.map(id => ({ id })) 
        }
      },
      include: {
        categorias: true 
      }
    });
  },

async criarEmLote(produtos: any[]) {
    const resultados = [];

    for (const item of produtos) {
      const precoNumerico = typeof item.preco === 'string' 
        ? parseFloat(item.preco.replace(",", ".")) 
        : item.preco;

      const nomesCategorias = Array.isArray(item.categoria) 
        ? item.categoria 
        : [item.categoria];

      const novoProduto = await prisma.produto.create({
        data: {
          nome: item.nome,
          descricao: item.desc || item.descricao,
          preco: precoNumerico,
          imagem: item.imagem,
          categorias: {
            connectOrCreate: nomesCategorias.map((nome: string) => ({
              where: { nome },
              create: { nome }
            }))
          }
        },
        include: { categorias: true }
      });
      
      resultados.push(novoProduto);
    }
    return resultados;
  },

  async buscarPorId(id: string) {
    return await prisma.produto.findUnique({
      where: { id },
    });
  },

  async deletar(id: string) {
    return await prisma.produto.delete({
      where: { id }
    });
  }
};



