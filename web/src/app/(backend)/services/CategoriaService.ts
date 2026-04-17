import { prisma } from "../../../lib/prisma";

export const CategoriaService = {
  
  async criar(nome: string) {
    return await prisma.categoria.create({
      data: { nome },
    });
  },

  async listarTodas() {
    return await prisma.categoria.findMany({
      include: {
        produtos: true,
      },
    });
  },

  async buscarPorId(id: string) {
    return await prisma.categoria.findUnique({
      where: { id },
      include: { produtos: true },
    });
  },

  async atualizar(id: string, nome: string) {
    return await prisma.categoria.update({
      where: { id },
      data: { nome },
    });
  },

  async deletar(id: string) {
    return await prisma.categoria.delete({
      where: { id },
    });
  },
};