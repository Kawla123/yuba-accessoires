"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CursorSheen } from "@/components/CursorSheen";

export function CollectionHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Parallaxe de scroll : l'image dérive légèrement pendant que le hero
  // défile hors de l'écran.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  // Parallaxe souris (desktop uniquement) : un seul effet simple, appliqué
  // sur un calque séparé de celui du scroll pour ne jamais entrer en
  // compétition avec lui.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relX * 10);
    mouseY.set(relY * 10);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[75vh] min-h-[480px] overflow-hidden bg-ink"
    >
      <motion.div
        style={reducedMotion ? undefined : { y: scrollY }}
        className="absolute inset-0"
      >
        <motion.div
          style={reducedMotion ? undefined : { x: springX, y: springY }}
          className="absolute -inset-4"
        >
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/40" />

      <CursorSheen />

      <div className="relative flex h-full flex-col justify-end px-6 pb-16 sm:px-10 lg:px-16">
        <h1 className="max-w-lg font-serif text-5xl text-cream sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-md font-sans text-sm text-cream/80 sm:text-base">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
