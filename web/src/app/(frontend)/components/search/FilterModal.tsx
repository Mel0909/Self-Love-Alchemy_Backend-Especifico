"use client";
import { useState, useEffect } from "react";
import styles from "./FilterModal.module.css";

interface FilterModalProps {
  onClose: () => void;
  categoria: string;
  setCategoria: (val: string) => void;
  precoMin: number | "";
  setPrecoMin: (val: number | "") => void;
  precoMax: number | "";
  setPrecoMax: (val: number | "") => void;
  onClear: () => void;
}

export default function FilterModal({ 
  onClose, categoria, setCategoria, precoMin, setPrecoMin, precoMax, setPrecoMax, onClear 
}: FilterModalProps) {
  
  const [categoriasDB, setCategoriasDB] = useState<string[]>([]);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const response = await fetch("/api/categoria");
        const dados = await response.json();
        const nomes = dados.map((c: any) => c.nome);
        setCategoriasDB(nomes);
      } catch (error) {
        console.error("Erro ao carregar categorias mágicas:", error);
      }
    }
    carregarCategorias();
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeModal} onClick={onClose}>×</button>
        
        <h2 className={styles.modalTitle}>Filtros Místicos</h2>
        
        <div className={styles.formMagico}>
          <label className={styles.label}>Categoria:</label>
          <select 
            className={styles.inputMagico} 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="todas">Todas as Magias</option>
            {categoriasDB.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label className={styles.label}>Faixa de Preço (R$):</label>
          <div className={styles.precoContainer}>
            <input 
              type="number" 
              placeholder="Mínimo" 
              className={styles.inputMagico}
              value={precoMin}
              onChange={(e) => setPrecoMin(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <input 
              type="number" 
              placeholder="Máximo" 
              className={styles.inputMagico}
              value={precoMax}
              onChange={(e) => setPrecoMax(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <button className={styles.applyBtn} onClick={onClose}>
            Aplicar Magia
          </button>
          
          <button className={styles.clearBtn} onClick={onClear}>
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}