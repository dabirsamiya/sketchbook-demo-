"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useCart } from "@/components/StorefrontProvider";
import { formatCurrency, products } from "@/lib/products";

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5.2 8.5h13.6l1 12H4.2l1-12Z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8.5 9V6.8a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.3" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Header() {
  const { itemCount, setDrawerOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return products.filter((product) => !query || `${product.name} ${product.format} ${product.pages} ${product.paper}`.toLowerCase().includes(query));
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstMatch = searchResults[0];
    if (!firstMatch) return;
    const target = firstMatch.id === "studio-edition" ? "studio-edition" : "shop";
    window.location.assign(`/#${target}`);
    setSearchOpen(false);
  };

  return (
    <header className={`site-header${scrolled ? " is-compact" : ""}`}>
      <div className="header-inner">
        <button
          className="mobile-menu-toggle icon-button"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`menu-lines${menuOpen ? " is-open" : ""}`}><i /><i /></span>
        </button>
        <Link href="/" className="wordmark" aria-label="Line and Form home" onClick={closeMenu}>
          <span className="wordmark-symbol" aria-hidden="true"><i /><i /><i /></span>
          <span>LINE <b>/</b> FORM</span>
        </Link>

        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          <Link href="/#shop" onClick={closeMenu}>Shop</Link>
          <Link href="/#about" onClick={closeMenu}>About</Link>
          <Link href="/#journal" onClick={closeMenu}>Journal</Link>
          <Link href="/#contact" onClick={closeMenu}>Contact</Link>
        </nav>

        <div className="header-actions">
          <button className="header-action search-action" type="button" aria-label="Search products" aria-expanded={searchOpen} aria-controls="product-search-panel" onClick={() => { setSearchOpen((open) => !open); closeMenu(); }}>
            <SearchIcon /><span>Search</span>
          </button>
          <Link href="/track-order" className="header-action account-action" aria-label="Track an order">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.25" /><path d="M5.2 20c.5-3.5 3.1-5.4 6.8-5.4s6.3 1.9 6.8 5.4" stroke="currentColor" strokeWidth="1.25" /></svg>
            <span>Account</span>
          </Link>
          <button className="header-action cart-trigger" type="button" onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}>
            <span className="bag-wrap"><BagIcon />{itemCount > 0 && <span className="cart-badge">{itemCount > 99 ? "99+" : itemCount}</span>}</span>
            <span className="cart-word">Cart</span>
          </button>
        </div>
      </div>
      {searchOpen && <form id="product-search-panel" className="search-panel" role="search" onSubmit={submitSearch}>
        <div className="search-panel-heading"><label className="eyebrow" htmlFor="product-search">FIND THE OBJECT</label><button className="search-close" type="button" onClick={() => setSearchOpen(false)} aria-label="Close product search">×</button></div>
        <div className="search-input-wrap"><SearchIcon /><input id="product-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search sketchbooks, format, paper…" autoFocus /><button type="submit" aria-label="Go to first matching product">→</button></div>
        <div className="search-results" aria-live="polite">{searchResults.length ? searchResults.map((product) => <Link href={product.id === "studio-edition" ? "/#studio-edition" : "/#shop"} key={product.id} onClick={() => setSearchOpen(false)}><span><strong>{product.name}</strong><small>{product.format} · {product.pages}</small></span><span>{formatCurrency(product.price)} <b>↗</b></span></Link>) : <p>No objects found. Try “A4” or “paper”.</p>}</div>
      </form>}
    </header>
  );
}
