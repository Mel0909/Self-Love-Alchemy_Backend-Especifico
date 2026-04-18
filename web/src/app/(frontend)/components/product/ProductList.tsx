"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductZoom from "./ProductZoom";
import styles from "./ProductList.module.css";

export default function ProductList({ filtro, categoria, min, max }: any) {
  const [produtoEmZoom, setProdutoEmZoom] = useState<any>(null);
  const [produtosDoBanco, setProdutosDoBanco] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await fetch("/api/produtos");
        const dados = await response.json();
        console.log("Resposta da API:", dados);

        if (dados.success && Array.isArray(dados.data)) {
          console.log("Produtos carregados:", dados.data.length);
          setProdutosDoBanco(dados.data);
        } else {
          console.error("Formato incorreto da API:", dados);
          setProdutosDoBanco([]);
        }
      } catch (error) {
        console.error("Erro ao carregar poções:", error);
        setProdutosDoBanco([]);
      } finally {
        setCarregando(false);
      }
    }
    fetchProdutos();
  }, []);

  const listaSegura = Array.isArray(produtosDoBanco) ? produtosDoBanco : [];

  const produtosFiltrados = listaSegura.filter((p) => {

    const nomeOk = p.nome?.toLowerCase().includes(filtro.toLowerCase()) ?? false;
    
    const categoriaOk = 
      categoria === "todas" || 
      p.categorias?.some((cat: any) => cat.nome === categoria) ||
      p.categoryIDs?.includes(categoria);

    const precoNum = p.preco || 0;
    const precoMinOk = min === "" || precoNum >= min;
    const precoMaxOk = max === "" || precoNum <= max;

    return nomeOk && categoriaOk && precoMinOk && precoMaxOk;
  });

  if (carregando) {
    return <p className={styles.loading}>Invocando poções do banco de dados...</p>;
  }

  return (
    <section className={styles.vitrineContainer}>
      <div className={styles.productGrid}>
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((item) => (
            <ProductCard 
              key={item.id} 
              produto={item} 
              onOpenZoom={() => setProdutoEmZoom(item)} 
            />
          ))
        ) : (
          <p className={styles.noResults}>Nenhuma poção encontrada com esses filtros.</p>
        )}
      </div>

      {produtoEmZoom && (
        <ProductZoom 
          produto={produtoEmZoom} 
          onClose={() => setProdutoEmZoom(null)} 
        />
      )}
    </section>
  );
}