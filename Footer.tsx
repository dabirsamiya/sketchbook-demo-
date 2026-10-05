import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link href="/" className="wordmark footer-wordmark"><span className="wordmark-symbol" aria-hidden="true"><i /><i /><i /></span><span>LINE <b>/</b> FORM</span></Link>
          <p>Objects for ideas.<br />Made for the spaces we imagine.</p>
          <a className="footer-instagram" href="https://www.instagram.com/lineandform.studio/" target="_blank" rel="noreferrer">Instagram <span>↗</span></a>
        </div>
        <div className="footer-link-group"><span className="eyebrow">EXPLORE</span><Link href="/#shop">Shop</Link><Link href="/#about">About</Link><Link href="/#journal">Journal</Link><Link href="/track-order">Track an order</Link></div>
        <div className="footer-link-group"><span className="eyebrow">GOOD TO KNOW</span><Link href="/#faq">FAQ</Link><Link href="/#faq">Shipping</Link><Link href="/#faq">Returns</Link><Link href="/#contact">Contact</Link></div>
        <NewsletterForm />
      </div>
      <div className="footer-bottom"><span>© 2026 LINE / FORM STUDIO</span><span>MADE FOR THE SPACE BETWEEN THOUGHT & FORM.</span><Link href="/track-order">ORDER SUPPORT ↗</Link></div>
    </footer>
  );
}

