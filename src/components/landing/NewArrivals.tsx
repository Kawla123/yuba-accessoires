"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { Link } from "@/i18n/navigation";
import type { LandingProduct } from "@/lib/queries/landing";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function NewArrivals({ products }: { products: LandingProduct[] }) {
  return (
    <section id="nouveautes" className="px-6 py-24 sm:px-10 lg:py-32">
      <h2 className="mb-12 font-serif text-4xl text-ink italic sm:text-5xl">
        Nouveautés
      </h2>

      <motion.div
        className="grid gap-4 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {products.map((product, i) => (
          <motion.div
            key={product.slug}
            variants={item}
            className={
              i === 0 ? "md:row-span-2 md:aspect-auto" : "aspect-[4/5]"
            }
          >
            <Link
              href={`/produit/${product.slug}`}
              className={`group relative block h-full overflow-hidden ${
                i === 0 ? "aspect-[4/5] md:aspect-auto" : ""
              }`}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes={i === 0 ? "50vw" : "25vw"}
                className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
