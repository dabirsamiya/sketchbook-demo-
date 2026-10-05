"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/products";
import { useCart } from "@/components/StorefrontProvider";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, items, subtotal, changeQuantity, removeFromCart } = useCart();

  return (
    <div className={`drawer-layer${drawerOpen ? " is-open" : ""}`} aria-hidden={!drawerOpen}>
      <button className="drawer-scrim" type="button" aria-label="Close cart" onClick={() => setDrawerOpen(false)} tabIndex={drawerOpen ? 0 : -1} />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your cart" aria-hidden={!drawerOpen}>
        <div className="drawer-heading">
          <div><span className="eyebrow">A GOOD PLACE TO BEGIN</span><h2>Your cart <span>({items.reduce((n, item) => n + item.quantity, 0)})</span></h2></div>
          <button className="icon-button drawer-close" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close cart">×</button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty"><span className="empty-mark">∅</span><p>Your next idea starts here.</p><Link className="text-link" href="/#shop" onClick={() => setDrawerOpen(false)}>Explore the sketchbooks <span>↗</span></Link></div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map(({ product, quantity }) => (
                <article className="drawer-item" key={product.id}>
                  <div className="drawer-item-image"><Image src={product.image} alt={product.name} fill sizes="96px" /></div>
                  <div className="drawer-item-content">
                    <div className="drawer-item-top"><h3>{product.name}</h3><button type="button" className="remove-link" onClick={() => removeFromCart(product.id)}>Remove</button></div>
                    <p>{product.format} · {product.pages}</p>
                    <div className="drawer-item-bottom"><div className="quantity-control" aria-label={`Quantity for ${product.name}`}><button type="button" aria-label="Decrease quantity" onClick={() => changeQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => changeQuantity(product.id, quantity + 1)}>+</button></div><strong>{formatCurrency(product.price * quantity)}</strong></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="drawer-summary"><div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><p>Taxes and delivery are calculated at checkout.</p><Link className="button button-outline drawer-view-cart" href="/cart" onClick={() => setDrawerOpen(false)}>View cart</Link><Link className="button button-dark" href="/checkout" onClick={() => setDrawerOpen(false)}>Checkout <span>→</span></Link></div>
          </>
        )}
      </aside>
    </div>
  );
}
