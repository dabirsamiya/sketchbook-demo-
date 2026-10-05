"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/StorefrontProvider";
import { calculateTotals, formatCurrency, ORDER_CONFIG } from "@/lib/products";

export function CartPage() {
  const { items, subtotal, ready, changeQuantity, removeFromCart } = useCart();
  const totals = calculateTotals(subtotal);

  return (
    <main className="commerce-page cart-page">
      <div className="commerce-breadcrumb"><Link href="/">HOME</Link><span>/</span><span>YOUR CART</span></div>
      <div className="commerce-title-row"><div><span className="eyebrow">A GOOD PLACE TO BEGIN</span><h1>YOUR CART<span className="title-period">.</span></h1></div><span className="cart-title-count">{ready ? String(items.reduce((count, line) => count + line.quantity, 0)).padStart(2, "0") : "—"} ITEMS</span></div>
      {!ready ? <div className="commerce-loading">Opening your cart…</div> : items.length === 0 ? (
        <div className="empty-cart"><span className="empty-cart-mark">01</span><div><h2>Nothing here, yet.</h2><p>A page is a good place to start.</p><Link className="button button-dark" href="/#shop">Discover the sketchbook <span>→</span></Link></div></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-table">
            <div className="cart-table-heading"><span>PRODUCT</span><span>QUANTITY</span><span>PRICE</span></div>
            {items.map(({ product, quantity }) => <article className="cart-row" key={product.id}>
              <div className="cart-product-cell"><div className="cart-product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 760px) 26vw, 148px" /></div><div><span className="eyebrow">LINE / FORM · OBJECT 01</span><h2>{product.name}</h2><p>{product.format} · {product.pages} · {product.binding}</p><button className="remove-link" type="button" onClick={() => removeFromCart(product.id)}>Remove</button></div></div>
              <div className="cart-quantity-cell"><div className="quantity-control" aria-label={`Quantity for ${product.name}`}><button type="button" aria-label="Decrease quantity" onClick={() => changeQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => changeQuantity(product.id, quantity + 1)}>+</button></div></div>
              <div className="cart-price-cell"><span>{formatCurrency(product.price)}</span><strong>{formatCurrency(product.price * quantity)}</strong></div>
            </article>)}
            <Link className="cart-continue-link" href="/#shop"><span>←</span> Continue exploring</Link>
          </div>
          <aside className="cart-summary"><div className="summary-heading"><span className="eyebrow">A CLEAR VIEW</span><h2>ORDER SUMMARY</h2></div><div className="summary-lines"><div><span>Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div><div><span>GST <small>{Math.round(ORDER_CONFIG.gstRate * 100)}%</small></span><strong>{formatCurrency(totals.gst)}</strong></div><div><span>Shipping</span><strong>{formatCurrency(totals.shipping)}</strong></div></div><div className="summary-total"><span>Total <small>INCL. TAX</small></span><strong>{formatCurrency(totals.total)}</strong></div><Link className="button button-dark summary-cta" href="/checkout">Continue to checkout <span>→</span></Link><p className="summary-reassurance">No payment is collected in this demo.<br />Your delivery details come next.</p><div className="summary-rule-note"><span>01</span><span>PACKED WITH CARE<br />MADE TO MAKE IT TO YOU</span></div></aside>
        </div>
      )}
      <div className="commerce-bottom-note"><span>LINE / FORM STUDIO</span><span>A GOOD IDEA DESERVES A GOOD PAGE.</span></div>
    </main>
  );
}
