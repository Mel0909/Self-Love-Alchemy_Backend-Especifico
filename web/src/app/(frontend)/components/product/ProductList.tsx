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
        setProdutosDoBanco(dados);
      } catch (error) {
        console.error("Erro ao carregar poções:", error);
      } finally {
        setCarregando(false);
      }
    }
    fetchProdutos();
  }, []);

  const produtosFiltrados = produtosDoBanco.filter((p) => {
    const nomeOk = p.nome.toLowerCase().includes(filtro.toLowerCase());
    
    const categoriaOk = 
      categoria === "todas" || 
      p.categorias?.some((cat: any) => cat.nome === categoria);

    const precoNum = p.preco;
    const precoMinOk = min === "" || precoNum >= min;
    const precoMaxOk = max === "" || precoNum <= max;

    return nomeOk && categoriaOk && precoMinOk && precoMaxOk;
  });

  if (carregando) return <p className={styles.loading}>Invocando poções do banco de dados...</p>;

  return (
    <section className={styles.vitrineContainer}>
      <div className={styles.productGrid}>
        {produtosFiltrados.map((item) => (
          <ProductCard 
            key={item.id} 
            produto={item} 
            onOpenZoom={() => setProdutoEmZoom(item)} 
          />
        ))}
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