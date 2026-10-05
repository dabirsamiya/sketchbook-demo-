export type Product = {
  id: string;
  name: string;
  shortName: string;
  price: number;
  format: string;
  pages: string;
  paper: string;
  binding: string;
  cover: string;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "architects-sketchbook",
    name: "Architect's Sketchbook",
    shortName: "The Architect's Sketchbook",
    price: 1499,
    format: "A4",
    pages: "160 pages",
    paper: "Premium sketch paper",
    binding: "Lay-flat binding",
    cover: "Textured stone cover",
    image: "/images/cover-detail.jpg",
    description:
      "A considered everyday companion for concepts, notes and the first lines of something new.",
  },
  {
    id: "studio-edition",
    name: "Architect's Sketchbook — Studio Edition",
    shortName: "Studio Edition",
    price: 1999,
    format: "A4",
    pages: "200 pages",
    paper: "Premium heavyweight sketch paper",
    binding: "Lay-flat binding",
    cover: "Deep charcoal textured cover",
    image: "/images/sketchbook-open.jpg",
    description:
      "A deeper edition for longer projects, full studies and ideas that need more room.",
  },
];

export const ORDER_CONFIG = {
  gstRate: 0.18,
  shippingFee: 99,
} as const;

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateTotals(subtotal: number) {
  const gst = Math.round(subtotal * ORDER_CONFIG.gstRate * 100) / 100;
  const shipping = subtotal > 0 ? ORDER_CONFIG.shippingFee : 0;
  return { subtotal, gst, shipping, total: subtotal + gst + shipping };
}
