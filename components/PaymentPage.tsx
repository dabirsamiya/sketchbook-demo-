"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/StorefrontProvider";
import { calculateTotals, formatCurrency } from "@/lib/products";

type CustomerDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
};

export function PaymentPage() {
  const { items, subtotal, ready, clearCart } = useCart();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [detailsReady, setDetailsReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const totals = calculateTotals(subtotal);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("line-form-checkout");
      if (saved) setCustomer(JSON.parse(saved) as CustomerDetails);
    } catch {
      window.sessionStorage.removeItem("line-form-checkout");
    }
    setDetailsReady(true);
  }, []);

  useEffect(() => {
    if (ready && items.length === 0) router.replace("/cart");
    else if (ready && detailsReady && !customer) router.replace("/checkout");
  }, [ready, items.length, detailsReady, customer, router]);

  async function completeDemoOrder() {
    if (!customer || items.length === 0 || processing) return;
    setProcessing(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok || typeof result !== "object" || result === null || !("orderNumber" in result) || typeof result.orderNumber !== "string") {
        const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string" ? result.error : "We couldn't create the order. Please try again.";
        throw new Error(message);
      }
      clearCart();
      window.sessionStorage.removeItem("line-form-checkout");
      router.push(`/order/${encodeURIComponent(result.orderNumber)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  if (!ready || !detailsReady || items.length === 0 || !customer) {
    return <main className="commerce-page payment-page"><div className="commerce-loading">Preparing your secure demo checkout…</div></main>;
  }

  return (
    <main className="commerce-page payment-page">
      <div className="commerce-breadcrumb"><Link href="/">HOME</Link><span>/</span><Link href="/cart">CART</Link><span>/</span><Link href="/checkout">DELIVERY</Link><span>/</span><span>PAYMENT DEMO</span></div>
      <div className="checkout-heading"><span className="eyebrow">THE FINAL STEP · FOR PRESENTATION ONLY</span><h1>PAYMENT <em>DEMO.</em></h1><p>Your order is ready. This preview does not collect payment.</p></div>
      <div className="payment-layout"><section className="payment-panel"><div className="payment-panel-mark"><span>LF</span><div><span className="eyebrow">LINE / FORM STUDIO</span><strong>PAYMENT DEMO</strong></div></div><div className="payment-message"><span className="payment-symbol">✳</span><h2>MADE FOR THE<br /><em>DEMO, NOT YOUR CARD.</em></h2><p>A payment gateway will be connected before launch. No card details are required here, and no real payment will be made.</p></div><div className="payment-panel-footer"><span>01 / 01</span><span>SAFE TO CONTINUE · DEMO MODE</span></div></section>
        <aside className="payment-summary"><div className="summary-heading"><span className="eyebrow">READY WHEN YOU ARE</span><h2>ORDER SUMMARY</h2></div><div className="checkout-items">{items.map(({ product, quantity }) => <div className="checkout-item" key={product.id}><div className="checkout-item-img"><Image src={product.image} alt={product.name} fill sizes="70px" /><span>{quantity}</span></div><div><h3>{product.name}</h3><p>{product.format} · {product.pages}</p></div><strong>{formatCurrency(product.price * quantity)}</strong></div>)}</div><div className="summary-lines"><div><span>Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div><div><span>GST</span><strong>{formatCurrency(totals.gst)}</strong></div><div><span>Shipping</span><strong>{formatCurrency(totals.shipping)}</strong></div></div><div className="summary-total"><span>Total <small>INCL. TAX</small></span><strong>{formatCurrency(totals.total)}</strong></div><div className="payment-delivery"><span>DELIVERING TO</span><p>{customer.fullName}<br />{customer.address}{customer.apartment ? `, ${customer.apartment}` : ""}<br />{customer.city}, {customer.state} {customer.pinCode}</p><Link href="/checkout">EDIT DETAILS ↗</Link></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark payment-complete" type="button" onClick={completeDemoOrder} disabled={processing}>{processing ? "Creating your demo order…" : "Complete demo order"}<span>{processing ? "···" : "→"}</span></button><Link className="payment-back" href="/checkout">← Back to delivery details</Link></aside>
      </div>
      <p className="payment-disclaimer">This is a client presentation demo. No payment information is requested or stored.</p>
    </main>
  );
}
