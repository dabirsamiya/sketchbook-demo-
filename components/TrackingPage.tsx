"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { formatCurrency } from "@/lib/products";

type TrackedOrder = {
  orderNumber: string;
  customerName: string;
  address: { line1: string; apartment: string; city: string; state: string; pinCode: string; country: string };
  items: { productId: string; name: string; image: string; unitPrice: number; quantity: number }[];
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
};

const milestones = [
  { status: "confirmed", title: "ORDER CONFIRMED", note: "Your order is safely with us." },
  { status: "preparing", title: "BEING PREPARED", note: "A little care before it leaves the studio." },
  { status: "shipped", title: "SHIPPED", note: "On its way to your part of the world." },
  { status: "out_for_delivery", title: "OUT FOR DELIVERY", note: "Almost at your door." },
  { status: "delivered", title: "DELIVERED", note: "Ready for the next idea." },
];

function statusIndex(status: string) {
  const index = milestones.findIndex((milestone) => milestone.status === status);
  return index < 0 ? 0 : index;
}

export function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const lookupOrder = useCallback(async (reference: string) => {
    const cleaned = reference.trim().replace(/^#/, "");
    if (!cleaned) return;
    setBusy(true);
    setError("");
    setOrder(null);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(cleaned)}`, { cache: "no-store" });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string" ? result.error : "We couldn't find that order number.";
        throw new Error(message);
      }
      setOrder(result as TrackedOrder);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn't find that order number.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const requestedOrder = new URLSearchParams(window.location.search).get("orderNumber");
    if (requestedOrder) {
      setOrderNumber(requestedOrder);
      void lookupOrder(requestedOrder);
    }
  }, [lookupOrder]);

  function handleTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookupOrder(orderNumber);
  }

  const currentIndex = order ? statusIndex(order.status) : 0;

  return (
    <main className="tracking-page commerce-page">
      <div className="commerce-breadcrumb"><Link href="/">HOME</Link><span>/</span><span>TRACK YOUR ORDER</span></div>
      <section className="tracking-intro"><span className="eyebrow">A LITTLE CLOSER TO YOUR DOOR</span><h1>TRACK YOUR<br /><em>ORDER.</em></h1><p>Enter the order number from your confirmation. We&apos;ll show you where your sketchbook is in its journey.</p>
        <form className="track-form" onSubmit={handleTrack}><label htmlFor="tracking-number">ORDER NUMBER</label><div><span>#</span><input id="tracking-number" type="text" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} placeholder="ARCH-12345678" autoComplete="off" required /><button className="button button-dark" type="submit" disabled={busy}>{busy ? "Checking…" : "Track order"}<span>→</span></button></div></form>
        {error && <p className="track-error" role="alert">{error}</p>}
      </section>
      {order && <section className="tracking-result" aria-live="polite"><div className="tracking-result-head"><div><span className="eyebrow">YOUR ORDER · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span><h2>#{order.orderNumber}</h2></div><span className="status-pill"><i /> {milestones[currentIndex]?.title ?? "ORDER CONFIRMED"}</span></div><div className="tracking-result-grid"><div className="timeline">{milestones.map((milestone, index) => {const complete = index < currentIndex; const current = index === currentIndex; return <div className={`timeline-step${complete ? " is-complete" : ""}${current ? " is-current" : ""}`} key={milestone.status}><div className="timeline-marker">{complete || (current && index === 0) ? "✓" : <span>{String(index + 1).padStart(2, "0")}</span>}</div><div className="timeline-step-copy"><h3>{milestone.title}{current && index === 0 && <span className="milestone-check"> ✓</span>}</h3><p>{milestone.note}</p></div><span className="timeline-state">{complete || current ? (current ? "CURRENT" : "DONE") : "UP NEXT"}</span></div>})}</div><aside className="tracking-order-details"><span className="eyebrow">IN THIS PARCEL</span>{order.items.map((item) => <div className="tracking-product" key={item.productId}><div className="tracking-product-image"><Image src={item.image} alt={item.name} fill sizes="64px" /></div><div><h3>{item.name}</h3><p>Qty. {item.quantity}</p></div><strong>{formatCurrency(item.unitPrice * item.quantity)}</strong></div>)}<div className="tracking-total"><span>ORDER TOTAL</span><strong>{formatCurrency(order.total)}</strong></div><div className="tracking-address"><span>DELIVERING TO</span><p>{order.customerName}<br />{order.address.line1}{order.address.apartment ? `, ${order.address.apartment}` : ""}<br />{order.address.city}, {order.address.state} {order.address.pinCode}</p></div><Link className="text-link" href="/">CONTINUE SHOPPING <span>↗</span></Link></aside></div><p className="tracking-demo-note">DEMO TRACKING · STATUS UPDATES ARE REPRESENTATIVE AND NO PHYSICAL SHIPMENT IS ARRANGED.</p></section>}
      {!order && !busy && <div className="track-help"><span>NO ORDER NUMBER YET?</span><p>Place a demo order and your unique order reference will appear on the confirmation screen.</p><Link href="/#shop" className="text-link">MEET THE SKETCHBOOK <span>→</span></Link></div>}
    </main>
  );
}
