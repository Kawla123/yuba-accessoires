"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { mapRange } from "@/lib/scrollMap";
import { placeholder } from "@/lib/placeholder";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 25;
const FRAME_URLS = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/frames/frame-${String(i + 1).padStart(3, "0")}.jpg`,
);

// Photo de secours si la séquence de frames ne charge pas du tout.
const FALLBACK_IMAGE = placeholder("hero-fallback-clair", 1920, 1080);

export function ScrollFrameHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const displayImgRef = useRef<HTMLImageElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [framesReady, setFramesReady] = useState(false);
  const [framesFailed, setFramesFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Précharge et décode les 25 frames une seule fois.
  useEffect(() => {
    let cancelled = false;

    const images = FRAME_URLS.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    imagesRef.current = images;

    Promise.allSettled(images.map((img) => img.decode())).then((results) => {
      if (cancelled) return;
      const allFailed = results.every((r) => r.status === "rejected");
      if (allFailed) {
        setFramesFailed(true);
      } else {
        setFramesReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Scrub GSAP : avance dans la séquence de frames au lieu de currentTime
  // d'une vidéo. Ne s'active jamais sous prefers-reduced-motion.
  useEffect(() => {
    if (reducedMotion || !framesReady) return;

    const wrapper = wrapperRef.current;
    const displayImg = displayImgRef.current;
    if (!wrapper || !displayImg) return;

    // gsap.context() + ctx.revert() est le pattern officiel GSAP pour React :
    // il capture TOUT ce qui est créé dans la fonction (tween + ScrollTrigger
    // associé) et garantit leur destruction complète au cleanup — plus fiable
    // qu'un tween.kill() manuel, qui selon les cas peut laisser le
    // ScrollTrigger actif (observateur de scroll orphelin qui continue de
    // scruber en fond, cause probable du ralentissement observé après
    // plusieurs Fast Refresh en dev : plusieurs instances tournent alors en
    // parallèle sur le même élément).
    const ctx = gsap.context(() => {
      const proxy = { frame: 0 };
      gsap.to(proxy, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        onUpdate: () => {
          const index = Math.round(proxy.frame);
          const src = imagesRef.current[index]?.src;
          if (src && displayImg.src !== src) {
            displayImg.src = src;
          }
        },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, [reducedMotion, framesReady]);

  if (reducedMotion) {
    return <ReducedMotionHero />;
  }

  return (
    <div ref={wrapperRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-ink">
        {framesFailed ? (
          // eslint-disable-next-line @next/next/no-img-element -- repli statique, pas d'optimisation nécessaire.
          <img
            src={FALLBACK_IMAGE}
            alt=""
            className="animate-kenburns absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- src réassigné en JS à chaque frame du scrub, next/image ne convient pas ici.
          <img
            ref={displayImgRef}
            src={FRAME_URLS[0]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/65" />

        <HeroCopy progress={scrollYProgress} />
        <ScrollHint progress={scrollYProgress} />
      </div>
    </div>
  );
}

function ReducedMotionHero() {
  return (
    <div className="relative flex h-[100dvh] items-center justify-center overflow-hidden bg-ink">
      {/* eslint-disable-next-line @next/next/no-img-element -- une seule frame statique, pas de scrub. */}
      <img
        src={FRAME_URLS[0]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/65" />

      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <p className="font-sans text-sm tracking-[0.35em] text-cream uppercase sm:text-base">
          Yuba Accessoires
        </p>
        <p className="font-serif text-2xl text-gold italic sm:text-3xl">
          L&rsquo;élégance dans chaque détail
        </p>
        <a
          href="#collections"
          className="font-serif text-lg text-cream italic underline decoration-gold/60 underline-offset-8"
        >
          Découvrez nos collections
        </a>
      </div>
    </div>
  );
}

function HeroCopy({ progress }: { progress: MotionValue<number> }) {
  const titleOpacity = useTransform(progress, (p) =>
    mapRange(p, [0, 0.15, 0.2], [1, 1, 0]),
  );
  const titleY = useTransform(progress, (p) => mapRange(p, [0, 0.2], [0, -40]));

  const text2Opacity = useTransform(progress, (p) =>
    mapRange(p, [0.3, 0.38, 0.5, 0.58], [0, 1, 1, 0]),
  );
  const text2Y = useTransform(progress, (p) =>
    mapRange(p, [0.3, 0.38, 0.5, 0.58], [24, 0, 0, -24]),
  );

  const text3Opacity = useTransform(progress, (p) =>
    mapRange(p, [0.68, 0.76, 0.9, 0.99], [0, 1, 1, 0]),
  );
  const text3Y = useTransform(progress, (p) =>
    mapRange(p, [0.68, 0.76, 0.9, 0.99], [24, 0, 0, -24]),
  );

  return (
    <div className="relative flex h-full items-center justify-center px-6 text-center">
      <motion.p
        style={{ opacity: titleOpacity, y: titleY }}
        className="absolute font-sans text-sm tracking-[0.4em] text-cream uppercase sm:text-base md:text-lg"
      >
        Yuba Accessoires
      </motion.p>

      <motion.p
        style={{ opacity: text2Opacity, y: text2Y }}
        className="absolute max-w-xl font-serif text-3xl text-gold italic sm:text-4xl md:text-5xl"
      >
        L&rsquo;élégance dans chaque détail
      </motion.p>

      <motion.a
        href="#collections"
        style={{ opacity: text3Opacity, y: text3Y }}
        className="absolute font-serif text-2xl text-cream italic underline decoration-gold/60 underline-offset-8 sm:text-3xl"
      >
        Découvrez nos collections
      </motion.a>
    </div>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (p) => mapRange(p, [0, 0.05], [1, 0]));

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-cream/70"
    >
      <span className="font-sans text-[11px] tracking-[0.3em] uppercase">
        Faites défiler
      </span>
      <span className="h-8 w-px bg-cream/40" />
    </motion.div>
  );
}
