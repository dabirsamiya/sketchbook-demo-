import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type OrderLineItem = {
  productId: string;
  name: string;
  image: string;
  unitPricePaise: number;
  quantity: number;
};

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  apartment: text("apartment").notNull().default(""),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pinCode: text("pin_code").notNull(),
  country: text("country").notNull().default("India"),
  items: jsonb("items").$type<OrderLineItem[]>().notNull(),
  subtotalPaise: integer("subtotal_paise").notNull(),
  gstPaise: integer("gst_paise").notNull(),
  shippingPaise: integer("shipping_paise").notNull(),
  totalPaise: integer("total_paise").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
