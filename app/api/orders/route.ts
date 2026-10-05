import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, type OrderLineItem } from "@/db/schema";
import { ORDER_CONFIG, getProduct } from "@/lib/products";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || !isRecord(body.customer) || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Please complete your delivery details." }, { status: 400 });
    }

    const customer = body.customer;
    const details = {
      customerName: requiredText(customer.fullName),
      email: requiredText(customer.email),
      phone: requiredText(customer.phone),
      address: requiredText(customer.address),
      apartment: requiredText(customer.apartment),
      city: requiredText(customer.city),
      state: requiredText(customer.state),
      pinCode: requiredText(customer.pinCode),
      country: requiredText(customer.country) || "India",
    };

    if (
      !details.customerName ||
      !/^\S+@\S+\.\S+$/.test(details.email) ||
      details.phone.replace(/\D/g, "").length < 10 ||
      !details.address ||
      !details.city ||
      !details.state ||
      !details.pinCode
    ) {
      return NextResponse.json({ error: "Please check your contact and delivery details." }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of body.items) {
      if (!isRecord(item) || typeof item.productId !== "string") {
        return NextResponse.json({ error: "Your cart could not be verified." }, { status: 400 });
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50 || !getProduct(item.productId)) {
        return NextResponse.json({ error: "Your cart contains an invalid item." }, { status: 400 });
      }
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + quantity);
    }

    if (quantities.size === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const lineItems: OrderLineItem[] = [];
    for (const [productId, quantity] of quantities) {
      const product = getProduct(productId);
      if (!product || quantity > 50) {
        return NextResponse.json({ error: "Your cart contains an invalid item." }, { status: 400 });
      }
      lineItems.push({
        productId,
        name: product.name,
        image: product.image,
        unitPricePaise: product.price * 100,
        quantity,
      });
    }

    const subtotalPaise = lineItems.reduce(
      (sum, item) => sum + item.unitPricePaise * item.quantity,
      0,
    );
    const gstPaise = Math.round(subtotalPaise * ORDER_CONFIG.gstRate);
    const shippingPaise = ORDER_CONFIG.shippingFee * 100;
    const orderNumber = `ARCH-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

    const [savedOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        ...details,
        items: lineItems,
        subtotalPaise,
        gstPaise,
        shippingPaise,
        totalPaise: subtotalPaise + gstPaise + shippingPaise,
        status: "confirmed",
      })
      .returning({ orderNumber: orders.orderNumber });

    return NextResponse.json({ orderNumber: savedOrder.orderNumber }, { status: 201 });
  } catch (error) {
    console.error("Could not create demo order", error);
    return NextResponse.json({ error: "We couldn't place this demo order. Please try again." }, { status: 500 });
  }
}
