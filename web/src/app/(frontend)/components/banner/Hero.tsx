"use client";
import { useEffect, useState } from "react";
import { frasesMagicas } from "@/app/(frontend)/data/frases";
import styles from "./Hero.module.css";

export default function Hero() {
  const [fraseDaSorte, setFraseDaSorte] = useState("Carregando sua magia...");

  const mudarFrase = () => {
    const indiceAleatorio = Math.floor(Math.random() * frasesMagicas.length);
    setFraseDaSorte(frasesMagicas[indiceAleatorio]);
  };

  useEffect(() => {
    mudarFrase();
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Manifeste Sua Melhor Versão</h1>
        <p className={styles.luckyPhrase}>{fraseDaSorte}</p>
        <button className={styles.btnHero} onClick={mudarFrase}>
        ✨ Explore Sua Magia ✨
        </button>
      </div>
    </section>
  );
}