"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function EditorialZoomSection({
  image,
  caption,
}: {
  image: string;
  caption: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const wrapper = wrapperRef.current;
    const imgEl = imgRef.current;
    const captionEl = captionRef.current;
    if (!wrapper || !imgEl || !captionEl) return;

    // Deux ScrollTrigger scrub sur le même déclencheur plutôt qu'une
    // timeline unique : plus simple à faire correspondre exactement au
    // dernier quart du défilement pour la légende, sans calcul de
    // position relative dans une timeline.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgEl,
        { scale: 2.2 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );

      gsap.fromTo(
        captionEl,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "75% top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );
    }, wrapper);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="relative h-[70vh] min-h-[420px] overflow-hidden bg-ink">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <p className="absolute inset-x-0 bottom-12 text-center font-serif text-2xl text-cream italic">
          {caption}
        </p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <p
          ref={captionRef}
          className="absolute inset-x-0 bottom-16 text-center font-serif text-2xl text-cream italic opacity-0"
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
