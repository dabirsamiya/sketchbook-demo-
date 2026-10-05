import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatCurrency } from "@/lib/products";

export const dynamic = "force-dynamic";

function addBusinessDays(start: Date, days: number) {
  const date = new Date(start);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) added += 1;
  }
  return date;
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber: rawOrderNumber } = await params;
  const orderNumber = decodeURIComponent(rawOrderNumber).trim().replace(/^#/, "").toUpperCase();
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) notFound();

  const deliveryStart = addBusinessDays(order.createdAt, 5);
  const deliveryEnd = addBusinessDays(order.createdAt, 7);
  const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

  return (
    <main className="confirmation-page commerce-page">
      <div className="commerce-breadcrumb"><Link href="/">HOME</Link><span>/</span><span>ORDER CONFIRMED</span></div>
      <div className="confirmation-topline"><span className="eyebrow">LINE / FORM STUDIO · ORDER RECEIPT</span><span>01 / 01</span></div>
      <section className="confirmation-hero"><div className="confirmation-check">✓</div><span className="eyebrow">A THOUGHTFUL PLACE TO BEGIN</span><h1>ORDER<br /><em>CONFIRMED.</em></h1><p>Thank you for your order, {order.customerName.split(" ")[0]}.</p><span className="confirmation-rule" /></section>
      <div className="confirmation-number"><span>YOUR ORDER NUMBER</span><strong>#{order.orderNumber}</strong><Link href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}>TRACK THIS ORDER <span>↗</span></Link></div>
      <div className="confirmation-layout"><section className="confirmation-items"><div className="summary-heading"><span className="eyebrow">A GOOD CHOICE</span><h2>IN YOUR ORDER</h2></div>{order.items.map((item) => <article className="confirmation-item" key={item.productId}><div className="confirmation-item-image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 760px) 27vw, 130px" /></div><div><h3>{item.name}</h3><p>A4 · {item.quantity} {item.quantity === 1 ? "item" : "items"}</p></div><strong>{formatCurrency((item.unitPricePaise * item.quantity) / 100)}</strong></article>)}<div className="summary-lines confirmation-totals"><div><span>Subtotal</span><strong>{formatCurrency(order.subtotalPaise / 100)}</strong></div><div><span>GST</span><strong>{formatCurrency(order.gstPaise / 100)}</strong></div><div><span>Shipping</span><strong>{formatCurrency(order.shippingPaise / 100)}</strong></div></div><div className="summary-total"><span>Total <small>INCL. TAX</small></span><strong>{formatCurrency(order.totalPaise / 100)}</strong></div></section><aside className="confirmation-side"><div className="delivery-estimate"><span className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</span><h2>ON ITS WAY<br /><em>TO YOU.</em></h2><p>Estimated delivery</p><strong>{deliveryStart.toLocaleDateString("en-IN", dateOptions)} — {deliveryEnd.toLocaleDateString("en-IN", dateOptions)}</strong><span className="estimate-note">5–7 working days · Demo estimate</span></div><div className="delivery-address"><span className="eyebrow">SENT TO</span><p><strong>{order.customerName}</strong><br />{order.address}{order.apartment ? <><br />{order.apartment}</> : null}<br />{order.city}, {order.state} {order.pinCode}<br />{order.country}</p><span>{order.email}</span></div><div className="demo-order-note"><span>✳</span><p>This is a presentation demo. No payment was collected and no physical shipment has been arranged.</p></div></aside></div>
      <div className="confirmation-actions"><Link className="button button-dark" href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}>Track order <span>→</span></Link><Link className="button button-outline" href="/#shop">Continue shopping</Link></div>
      <p className="confirmation-endnote">THANK YOU FOR MAKING ROOM FOR AN IDEA.</p>
    </main>
  );
}
