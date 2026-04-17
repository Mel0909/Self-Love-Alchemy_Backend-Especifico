"use client";
import { useState } from "react";
import Header from "./(frontend)/components/header/Header";
import Hero from "./(frontend)/components/banner/Hero";
import SearchBox from "./(frontend)/components/search/SearchBox";
import ProductList from "./(frontend)/components/product/ProductList";
import Footer from "./(frontend)/components/footer/Footer";
import CartDrawer from "./(frontend)/components/cart/CartDrawer";
import LoginModal from "./(frontend)/components/login/LoginModal";

export default function Home() {
  const [termoBusca, setTermoBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [precoMin, setPrecoMin] = useState<number | "">("");
  const [precoMax, setPrecoMax] = useState<number | "">("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const limparFiltros = () => {
    setCategoria("todas");
    setPrecoMin("");
    setPrecoMax("");
    setTermoBusca("");
  };

  return (
    <main>
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenLogin={() => setIsLoginOpen(true)}
      />
      
      <Hero />
      
      <SearchBox 
        termo={termoBusca} setTermo={setTermoBusca}
        categoria={categoria} setCategoria={setCategoria}
        precoMin={precoMin} setPrecoMin={setPrecoMin}
        precoMax={precoMax} setPrecoMax={setPrecoMax}
        onClear={limparFiltros}
      />
      
      <ProductList 
        filtro={termoBusca} 
        categoria={categoria}
        min={precoMin}
        max={precoMax}
      />
      
      <Footer />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </main>
  );
}