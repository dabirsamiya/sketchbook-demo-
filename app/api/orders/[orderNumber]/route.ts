import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    const { orderNumber: rawOrderNumber } = await params;
    const orderNumber = decodeURIComponent(rawOrderNumber).trim().replace(/^#/, "").toUpperCase();
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "We couldn't find that order. Check the number and try again." }, { status: 404 });
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      address: {
        line1: order.address,
        apartment: order.apartment,
        city: order.city,
        state: order.state,
        pinCode: order.pinCode,
        country: order.country,
      },
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        unitPrice: item.unitPricePaise / 100,
        quantity: item.quantity,
      })),
      subtotal: order.subtotalPaise / 100,
      gst: order.gstPaise / 100,
      shipping: order.shippingPaise / 100,
      total: order.totalPaise / 100,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Could not look up demo order", error);
    return NextResponse.json({ error: "Order tracking is temporarily unavailable." }, { status: 500 });
  }
}
