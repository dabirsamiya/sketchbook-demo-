"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/StorefrontProvider";
import { formatCurrency, products } from "@/lib/products";

const instagramUrl = "https://www.instagram.com/lineandform.studio/";

const faqItems = [
  { question: "What size is the sketchbook?", answer: "The sketchbook is A4 (210 × 297 mm), a generous working size for plans, studies and everyday notes." },
  { question: "How many pages does it have?", answer: "The Architect's Sketchbook has 160 carefully selected pages. The Studio Edition has 200." },
  { question: "What paper is used?", answer: "A warm-white, premium uncoated sketch paper selected for graphite, fineliner, notes and confident everyday drawing." },
  { question: "Do you ship across India?", answer: "Yes. We deliver across India. A flat shipping charge is shown clearly at checkout before you place a demo order." },
  { question: "How long does delivery take?", answer: "Orders are usually prepared within 1–2 working days and delivered in approximately 5–7 working days, depending on your location." },
  { question: "Can I return or exchange my order?", answer: "For this presentation demo, returns and exchanges are not processed. Before launch, our final returns policy and support contact will be published here." },
  { question: "Can I place bulk orders?", answer: "Yes. We welcome enquiries from architecture studios, colleges, workshops and teams. Use the bulk order link and we'll help shape an order for your group." },
  { question: "How can I track my order?", answer: "Use the order number from your confirmation on our Track order page. Demo orders show the complete order journey." },
];

const testimonials = [
  { quote: "Finally, a sketchbook that actually feels designed for architectural thinking.", by: "Architecture student" },
  { quote: "The paper has just the right amount of warmth. It has become part of my studio ritual.", by: "Independent architect" },
  { quote: "Thoughtful, beautifully made, and always in my bag between the studio and site.", by: "Spatial designer" },
];

function SectionLabel({ children, number }: { children: string; number?: string }) {
  return <div className="section-label"><span>{number ?? "—"}</span><span>{children}</span></div>;
}

export function StorefrontHome() {
  const { addToCart } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const primaryProduct = products[0];
  const studioEdition = products[1];

  return (
    <main>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <SectionLabel number="OBJECTS FOR IDEAS · 01">THE ARCHITECT&apos;S SKETCHBOOK</SectionLabel>
          <h1 id="hero-heading">FOR IDEAS<br />THAT BEGIN<br /><em>ON PAPER.</em></h1>
          <p className="hero-intro">A premium sketchbook created for architects, designers and creative minds who turn ideas into spaces.</p>
          <div className="hero-actions"><a className="button button-dark" href="#shop">Shop the sketchbook <span>→</span></a><a className="button button-text" href="#details">Explore the details <span>↓</span></a></div>
          <div className="hero-footnote"><span>DESIGNED FOR DAILY PRACTICE</span><span>01 — 2026</span></div>
        </div>
        <div className="hero-visual">
          <Image src="/images/sketchbook-hero.jpg" alt="Textured architecture sketchbook on a warm limestone surface" fill priority sizes="(max-width: 760px) 100vw, 58vw" />
          <div className="hero-image-note"><span>STUDY 01</span><span>THE OBJECT IN NATURAL LIGHT</span></div>
          <div className="hero-side-note">A QUIETER WAY TO BEGIN</div>
        </div>
        <div className="hero-mobile-index">LINE / FORM · STUDIO PAPER — 2026</div>
      </section>

      <section className="manifesto-strip" aria-label="Our philosophy"><div>MADE FOR ARCHITECTS</div><div>DESIGNED FOR IDEAS</div><div>BUILT FOR EVERYDAY SKETCHING</div></section>

      <section className="object-section page-section" id="shop">
        <div className="section-topline"><SectionLabel number="01 / THE OBJECT">A STUDY IN USEFUL BEAUTY</SectionLabel><span className="topline-coordinate">A4 · 160 PAGES · INDIA</span></div>
        <div className="object-layout" id="details">
          <div className="object-image-wrap">
            <Image src="/images/sketchbook-open.jpg" alt="The Architect's Sketchbook opened flat to a graphite floor plan" fill sizes="(max-width: 760px) 100vw, 58vw" />
            <span className="image-index">FIG. 01 — AN OPEN STUDY</span>
            <span className="image-corner-mark" aria-hidden="true">A4</span>
          </div>
          <div className="object-copy">
            <span className="eyebrow">THE EVERYDAY ORIGINAL · NO. 01</span>
            <h2>A SKETCHBOOK<br />DESIGNED WITH<br /><em>INTENTION.</em></h2>
            <p className="object-description">A considered space for the things that don&apos;t exist yet. Made to move from first thought to final detail — and everywhere in between.</p>
            <div className="object-price-line"><div><span>ARCHITECT&apos;S SKETCHBOOK</span><strong>{formatCurrency(primaryProduct.price)}</strong></div><span className="availability"><i /> AVAILABLE TO ORDER</span></div>
            <div className="object-attributes"><span>A4</span><span>160 pages</span><span>Premium sketch paper</span><span>Lay-flat binding</span></div>
            <div className="object-actions"><button className="button button-dark" type="button" onClick={() => addToCart(primaryProduct.id)}>Add to cart <span>→</span></button><a className="button button-outline" href="#gallery">View details</a></div>
            <p className="delivery-note"><span aria-hidden="true">✳</span> Thoughtfully packed · Ships across India</p>
            <div className="edition-line" id="studio-edition"><div><span className="eyebrow">NEED A LITTLE MORE ROOM?</span><strong>Meet the Studio Edition</strong><p>200 pages · deeper charcoal cover</p></div><div className="edition-buy"><span>{formatCurrency(studioEdition.price)}</span><button type="button" aria-label="Add the Studio Edition to cart" onClick={() => addToCart(studioEdition.id)}>Add <b>+</b></button></div></div>
          </div>
        </div>
      </section>

      <section className="gallery-section page-section" id="gallery">
        <div className="gallery-heading"><SectionLabel number="02 / A CLOSER LOOK">AN OBJECT, FROM EVERY ANGLE</SectionLabel><h2>MADE TO BE<br /><em>MARKED UP.</em></h2><p>Texture, proportion, a page that opens flat. The details are quiet; the ideas are yours.</p></div>
        <div className="gallery-grid" aria-label="Sketchbook image gallery">
          <figure className="gallery-tile gallery-desk"><div className="gallery-image"><Image src="/images/studio-desk.jpg" alt="Sketchbook among architectural drawings on a studio desk" fill sizes="(max-width: 760px) 84vw, 58vw" /></div><figcaption><span>01</span><span>THE WORKING TABLE</span></figcaption></figure>
          <figure className="gallery-tile gallery-cover"><div className="gallery-image"><Image src="/images/cover-detail.jpg" alt="Close detail of textured stone cover and lay-flat binding" fill sizes="(max-width: 760px) 84vw, 38vw" /></div><figcaption><span>02</span><span>TEXTURE, HELD IN THE HAND</span></figcaption></figure>
          <figure className="gallery-tile gallery-sketch"><div className="gallery-image"><Image src="/images/architecture-study.jpg" alt="Graphite floor plan, elevation and perspective study on sketchbook paper" fill sizes="(max-width: 760px) 84vw, 38vw" /></div><figcaption><span>03</span><span>LINES BEFORE LANGUAGE</span></figcaption></figure>
          <figure className="gallery-tile gallery-back"><div className="back-cover-study"><div className="backbook"><i /><i /><i /><span>LINE / FORM</span></div><span className="back-cover-caption">A considered cover.<br />Nothing unnecessary.</span></div><figcaption><span>04</span><span>THE BACK COVER · UNCOATED FINISH</span></figcaption></figure>
          <figure className="gallery-tile gallery-open"><div className="gallery-image"><Image src="/images/sketchbook-open.jpg" alt="Lay-flat sketchbook open to a delicate plan drawing" fill sizes="(max-width: 760px) 84vw, 58vw" /></div><figcaption><span>05</span><span>FLAT, WHEN THE IDEA ISN&apos;T</span></figcaption></figure>
          <figure className="gallery-tile gallery-paper"><div className="gallery-image"><Image src="/images/cover-detail.jpg" alt="Tactile sketch paper and the soft edge of the sketchbook" fill sizes="(max-width: 760px) 84vw, 38vw" /></div><figcaption><span>06</span><span>160 PAGES OF POSSIBILITY</span></figcaption></figure>
          <figure className="gallery-tile gallery-scale"><div className="scale-study"><div className="scale-notebook"><span>LINE / FORM</span></div><div className="scale-ruler"><span>0</span><i /><span>10</span><i /><span>20</span><i /><span>30 cm</span></div><p>210 × 297 mm<br /><b>A4, generously considered.</b></p></div><figcaption><span>07</span><span>SIZE, IN PERSPECTIVE</span></figcaption></figure>
        </div>
      </section>

      <section className="why-section page-section" id="about">
        <div className="why-heading"><SectionLabel number="03 / THE THINKING">A TOOL FOR THE IN-BETWEEN</SectionLabel><h2>BUILT FOR THE WAY<br /><em>ARCHITECTS THINK.</em></h2><p>Not a blank page. An invitation to notice what could be.</p></div>
        <div className="feature-list">
          <article className="feature-row"><span className="feature-no">01</span><div className="feature-line-art line-art-one" aria-hidden="true"><i /><i /><i /></div><div><h3>THINK ON PAPER</h3><p>For concepts, notes and early-stage ideas.</p></div><span className="feature-arrow">↗</span></article>
          <article className="feature-row"><span className="feature-no">02</span><div className="feature-line-art line-art-two" aria-hidden="true"><i /><i /></div><div><h3>ARCHITECTURAL FORMAT</h3><p>Designed around the way architects and designers work.</p></div><span className="feature-arrow">↗</span></article>
          <article className="feature-row"><span className="feature-no">03</span><div className="feature-line-art line-art-three" aria-hidden="true"><i /><i /><i /><i /></div><div><h3>PREMIUM PAPER</h3><p>A grounded, considered surface for confident lines and visual thinking.</p></div><span className="feature-arrow">↗</span></article>
          <article className="feature-row"><span className="feature-no">04</span><div className="feature-line-art line-art-four" aria-hidden="true"><i /><i /></div><div><h3>MADE TO CARRY</h3><p>From studio to site to classroom, and back again.</p></div><span className="feature-arrow">↗</span></article>
        </div>
      </section>

      <section className="visual-statement" aria-label="Every project starts somewhere">
        <Image src="/images/studio-desk.jpg" alt="Architectural diagrams and sketchbook arranged in a pool of afternoon light" fill sizes="100vw" />
        <div className="visual-overlay" />
        <div className="visual-statement-content"><span className="eyebrow">A NOTE FROM THE STUDIO · 01</span><h2>EVERY PROJECT<br />STARTS <em>SOMEWHERE.</em></h2><p>Sometimes, it starts with a line.</p></div>
        <span className="visual-coordinate">19° 04′ N · 72° 52′ E</span>
      </section>

      <section className="specs-section page-section" id="specifications">
        <div className="specs-intro"><SectionLabel number="04 / THE DETAILS">MADE WITH PURPOSE</SectionLabel><h2>THE DETAILS<br /><em>MATTER.</em></h2><p>Every choice has a reason. Nothing more than the work asks for.</p><a className="text-link" href="#how-it-works">A SIMPLE WAY TO ORDER <span>↓</span></a></div>
        <div className="specs-table"><div className="specs-table-head"><span>SPECIFICATION</span><span>DETAIL</span></div><div><span>Format</span><strong>A4 · 210 × 297 mm</strong></div><div><span>Pages</span><strong>160 pages</strong></div><div><span>Paper</span><strong>Premium uncoated sketch paper</strong></div><div><span>Binding</span><strong>Lay-flat binding</strong></div><div><span>Cover</span><strong>Premium textured stone cover</strong></div><div><span>Made for</span><strong>Sketching / Drafting / Notes</strong></div><div className="specs-footnote"><span>STUDIO EDITION ALSO AVAILABLE</span><span>A4 · 200 PAGES · CHARCOAL COVER</span></div></div>
      </section>

      <section className="process-section page-section" id="how-it-works"><div className="process-heading"><SectionLabel number="05 / A QUIETER CHECKOUT">FROM HERE TO YOUR DOOR</SectionLabel><h2>FOUR SMALL STEPS.<br /><em>THEN, YOURS.</em></h2></div><div className="process-grid"><article><span>01</span><h3>CHOOSE</h3><p>Find the sketchbook that feels like yours.</p></article><article><span>02</span><h3>ADD TO CART</h3><p>Set your quantity and review the details.</p></article><article><span>03</span><h3>CHECKOUT</h3><p>Tell us where to send it.</p></article><article><span>04</span><h3>CONFIRM</h3><p>Complete the demo order. No payment details needed.</p></article></div></section>

      <section className="journal-section page-section" id="journal"><div className="journal-image"><Image src="/images/architecture-study.jpg" alt="A graphite architectural study in progress" fill sizes="(max-width: 760px) 100vw, 45vw" /></div><div className="journal-copy"><SectionLabel number="FROM THE STUDIO · FIELD NOTE 01">THE SPACE BEFORE THE SPACE</SectionLabel><span className="eyebrow journal-kicker">NOTES ON THE FIRST MARK</span><h2>BEFORE A SPACE<br />IS BUILT, IT IS<br /><em>IMAGINED.</em></h2><p>Between an idea and a place is a quiet, important moment. A thought takes a line; a line becomes a possibility. We made this for that moment.</p><a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">FOLLOW THE FIELD NOTES <span>↗</span></a></div></section>

      <section className="instagram-section page-section" aria-labelledby="instagram-title">
        <div className="instagram-heading"><div><SectionLabel number="06 / OPEN STUDIO">A SMALL WINDOW INTO OUR PROCESS</SectionLabel><h2 id="instagram-title">FROM THE<br /><em>STUDIO.</em></h2></div><a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">FOLLOW US ON INSTAGRAM <span>↗</span></a></div>
        <div className="instagram-grid"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="View studio sketches on Instagram"><Image src="/images/architecture-study.jpg" alt="Floor plan and architectural sketches from the studio" fill sizes="(max-width: 760px) 42vw, 25vw" /><span>FIELD NOTE 01 ↗</span></a><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="View the sketchbook on Instagram"><Image src="/images/sketchbook-hero.jpg" alt="The sketchbook set in natural stone light" fill sizes="(max-width: 760px) 42vw, 25vw" /><span>THE OBJECT ↗</span></a><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="View studio process on Instagram"><Image src="/images/studio-desk.jpg" alt="A working architect's desk with sketchbook and tracing paper" fill sizes="(max-width: 760px) 42vw, 25vw" /><span>AT THE TABLE ↗</span></a><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="View sketchbook details on Instagram"><Image src="/images/cover-detail.jpg" alt="Close-up of the textured sketchbook cover" fill sizes="(max-width: 760px) 42vw, 25vw" /><span>IN DETAIL ↗</span></a></div>
      </section>

      <section className="testimonial-section page-section"><div className="testimonial-heading"><SectionLabel number="07 / IN GOOD COMPANY">WORDS FROM THE WORK</SectionLabel><h2>A GOOD TOOL<br /><em>GETS OUT OF THE WAY.</em></h2></div><div className="testimonial-grid">{testimonials.map((item, index) => <figure key={item.by}><span className="quote-mark">“</span><blockquote>{item.quote}</blockquote><figcaption><span>0{index + 1}</span><span>— {item.by}</span></figcaption></figure>)}</div></section>

      <section className="faq-section page-section" id="faq"><div className="faq-intro"><SectionLabel number="08 / A FEW GOOD QUESTIONS">BEFORE YOU BEGIN</SectionLabel><h2>GOOD TO<br /><em>KNOW.</em></h2><p>Useful details, without the fine print.</p><a className="text-link" href="mailto:hello@lineandform.studio">SOMETHING ELSE? WRITE TO US <span>↗</span></a></div><div className="faq-list">{faqItems.map((item, index) => <div className={`faq-item${openFaq === index ? " is-open" : ""}`} key={item.question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="faq-number">0{index + 1}</span><span>{item.question}</span><b aria-hidden="true">{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p className="faq-answer">{item.answer}</p>}</div>)}</div></section>

      <section className="bulk-section"><div><span className="eyebrow">FOR THE PEOPLE WHO MAKE PLACES</span><h2>ORDERING FOR A STUDIO,<br /><em>COLLEGE OR TEAM?</em></h2><p>For architecture studios, colleges, workshops and bulk orders. Tell us what you have in mind.</p></div><a className="button button-light" href="mailto:hello@lineandform.studio?subject=Studio%20and%20bulk%20order%20enquiry">Enquire for bulk orders <span>↗</span></a><span className="bulk-cross" aria-hidden="true">+</span></section>

      <section className="closing-note"><span>ONE PAGE AT A TIME.</span><Link href="#shop">RETURN TO THE OBJECT <span>↑</span></Link><span>LINE / FORM · 2026</span></section>
      <div className="mobile-add-bar"><div><span>THE ARCHITECT&apos;S SKETCHBOOK</span><strong>{formatCurrency(primaryProduct.price)}</strong></div><button className="button button-dark" type="button" onClick={() => addToCart(primaryProduct.id)}>Add to cart <span>→</span></button></div>
    </main>
  );
}
