"use client";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import FilterModal from "./FilterModal";
import styles from "./SearchBox.module.css";

export default function SearchBox({ 
  termo, setTermo, categoria, setCategoria, precoMin, setPrecoMin, precoMax, setPrecoMax, onClear 
}: any) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className={styles.searchFilterContainer}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Procurar magia..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        <span className={styles.searchIcon}>
          <Search size={22} color="var(--mystic-pink)" />
        </span>
      </div>

      <button className={styles.filterBtn} onClick={() => setIsModalOpen(true)}>
        <SlidersHorizontal size={28} color="var(--mystic-gold)" />
      </button>

      {isModalOpen && (
        <FilterModal 
          onClose={() => setIsModalOpen(false)}
          categoria={categoria}
          setCategoria={setCategoria}
          precoMin={precoMin}
          setPrecoMin={setPrecoMin}
          precoMax={precoMax}
          setPrecoMax={setPrecoMax}
          onClear={onClear}
        />
      )}
    </section>
  );
}