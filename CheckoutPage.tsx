"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type FormEvent } from "react";
import { useCart } from "@/components/StorefrontProvider";
import { calculateTotals, formatCurrency, ORDER_CONFIG } from "@/lib/products";

export function CheckoutPage() {
  const { items, subtotal, ready } = useCart();
  const router = useRouter();
  const totals = calculateTotals(subtotal);

  useEffect(() => {
    if (ready && items.length === 0) router.replace("/cart");
  }, [ready, items.length, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = Object.fromEntries(data.entries());
    window.sessionStorage.setItem("line-form-checkout", JSON.stringify(customer));
    router.push("/payment");
  }

  if (!ready || items.length === 0) {
    return <main className="commerce-page checkout-page"><div className="commerce-loading">Preparing your checkout…</div></main>;
  }

  return (
    <main className="commerce-page checkout-page">
      <div className="commerce-breadcrumb"><Link href="/">HOME</Link><span>/</span><Link href="/cart">CART</Link><span>/</span><span>DELIVERY</span></div>
      <div className="checkout-heading"><span className="eyebrow">ONE LAST THING BEFORE IT&apos;S YOURS</span><h1>DELIVERY <em>DETAILS.</em></h1><p>Where should we send the beginning of something?</p></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section"><div className="form-section-title"><span>01</span><div><h2>CONTACT INFORMATION</h2><p>For order updates and the occasional delivery question.</p></div></div><div className="form-fields two-col"><label>Full name <b>*</b><input name="fullName" type="text" autoComplete="name" placeholder="Your full name" minLength={2} required /></label><label>Email address <b>*</b><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><label className="field-full">Phone number <b>*</b><input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" pattern="[+0-9 ()-]{10,20}" title="Enter a valid phone number" required /><small>Used only if the courier needs to reach you.</small></label></div></section>
          <section className="form-section"><div className="form-section-title"><span>02</span><div><h2>DELIVERY ADDRESS</h2><p>We&apos;ll make sure it finds its way to you.</p></div></div><div className="form-fields two-col"><label className="field-full">Address <b>*</b><input name="address" type="text" autoComplete="address-line1" placeholder="House / street / locality" minLength={5} required /></label><label className="field-full">Apartment / building <span className="optional-label">OPTIONAL</span><input name="apartment" type="text" autoComplete="address-line2" placeholder="Apartment, floor, building name" /></label><label>City <b>*</b><input name="city" type="text" autoComplete="address-level2" placeholder="City" required /></label><label>State <b>*</b><input name="state" type="text" autoComplete="address-level1" placeholder="State" required /></label><label>PIN code <b>*</b><input name="pinCode" type="text" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="6-digit PIN code" title="Enter a 6-digit PIN code" required /></label><label>Country <b>*</b><select name="country" defaultValue="India" autoComplete="country-name" required><option value="India">India</option><option value="Other">Other</option></select></label></div></section>
          <div className="checkout-form-foot"><span><i /> DEMO CHECKOUT · NO PAYMENT DETAILS REQUIRED</span><Link href="/cart">← Return to cart</Link></div>
          <button className="button button-dark checkout-continue" type="submit">Continue to payment <span>→</span></button>
        </form>
        <aside className="checkout-summary"><div className="summary-heading"><span className="eyebrow">A CLEAR VIEW</span><h2>YOUR ORDER</h2></div><div className="checkout-items">{items.map(({ product, quantity }) => <div className="checkout-item" key={product.id}><div className="checkout-item-img"><Image src={product.image} alt={product.name} fill sizes="70px" /><span>{quantity}</span></div><div><h3>{product.name}</h3><p>{product.format} · {product.pages}</p></div><strong>{formatCurrency(product.price * quantity)}</strong></div>)}</div><div className="summary-lines"><div><span>Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div><div><span>GST <small>{Math.round(ORDER_CONFIG.gstRate * 100)}%</small></span><strong>{formatCurrency(totals.gst)}</strong></div><div><span>Shipping</span><strong>{formatCurrency(totals.shipping)}</strong></div></div><div className="summary-total"><span>Total <small>INCL. TAX</small></span><strong>{formatCurrency(totals.total)}</strong></div><div className="checkout-demo-note"><span>✳</span><p>Payment is for demonstration only. No real payment will be requested or collected.</p></div></aside>
      </div>
    </main>
  );
}
