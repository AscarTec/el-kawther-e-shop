import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { src: string; alt?: string; gradient?: string };

type Props = {
  images: Slide[];
  isArabic?: boolean;
  autoMs?: number;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  showProgress?: boolean;
  swipeThreshold?: number; // px
};

export function FullBleedBackgroundSlider({
  images,
  isArabic = false,
  autoMs = 5500,
  className = "",
  showArrows = true,
  showDots = true,
  showProgress = true,
  swipeThreshold = 45,
}: Props) {
  const total = images.length;
  const reduceMotion = useReducedMotion();

  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // عشان نعمل reset للـ autoplay بعد أي تفاعل (next/prev/dots/swipe)
  const [tick, setTick] = React.useState(0);

  const goTo = React.useCallback(
    (idx: number) => {
      if (total <= 0) return;
      const safe = ((idx % total) + total) % total;
      setActive(safe);
      setTick((t) => t + 1); // reset timer
    },
    [total]
  );

  const next = React.useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = React.useCallback(() => goTo(active - 1), [active, goTo]);

  const item = images[active];

  // Preload next image (احترافي جداً لتقليل الفلاش)
  React.useEffect(() => {
    if (total <= 1) return;
    const nextIdx = (active + 1) % total;
    const src = images[nextIdx]?.src;
    if (!src) return;
    const img = new Image();
    img.src = src;
  }, [active, images, total]);

  // Autoplay with reset + pause
  React.useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % total);
    }, autoMs);
    return () => window.clearInterval(id);
  }, [paused, total, autoMs, tick]);

  // Pause when tab is hidden (أداء/بطارية)
  React.useEffect(() => {
    const onVis = () => setPaused(document.visibilityState !== "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Keyboard (RTL/LTR)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (total <= 1) return;

      if (e.key === "ArrowRight") (isArabic ? prev : next)();
      if (e.key === "ArrowLeft") (isArabic ? next : prev)();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isArabic, next, prev, total]);

  // Touch / swipe
  const startXRef = React.useRef<number | null>(null);
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    startXRef.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const startX = startXRef.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    startXRef.current = null;
    if (startX == null || endX == null) return;

    const dx = endX - startX;
    if (Math.abs(dx) < swipeThreshold) return;

    // dx > 0 => swipe right
    if (dx > 0) {
      isArabic ? next() : prev();
    } else {
      isArabic ? prev() : next();
    }
  };

  // Motion presets (respect reduced motion)
  const motionInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 1.06, filter: "blur(10px)" };

  const motionAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1.0, filter: "blur(0px)" };

  const motionExit = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 1.02, filter: "blur(12px)" };

  const motionTransition = reduceMotion
    ? { duration: 0.35, ease: "easeOut" as const }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

  // Default gradient if slide doesn't provide
  const fallbackGradient =
    "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.10) 45%, rgba(0,0,0,0.55))";

  return (
    <div
      className={[
        "relative w-full overflow-hidden select-none",
        "h-[360px] sm:h-[440px] md:h-[520px] lg:h-[640px]",
        className,
      ].join(" ")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label={isArabic ? "شرائح خلفية" : "Background slider"}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item?.src ?? active}
          className="absolute inset-0"
          initial={motionInitial}
          animate={motionAnimate}
          exit={motionExit}
          transition={motionTransition}
        >
          {/* Image */}
          <img
            src={item?.src}
            alt={item?.alt ?? ""}
            className="absolute inset-0 h-full w-full object-top "
            loading={active === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundImage: item?.gradient ?? fallbackGradient }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-black/15 dark:bg-black/35" />

          {/* Light sweep (disabled for reduced motion) */}
          {!reduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ x: isArabic ? 160 : -160, opacity: 0 }}
              animate={{ x: isArabic ? -160 : 160, opacity: 0.18 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              style={{
                background:
                  "linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.45) 40%, transparent 70%)",
                mixBlendMode: "soft-light",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            onClick={isArabic ? next : prev}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center"
            aria-label={isArabic ? "التالي" : "Previous"}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>

          <button
            type="button"
            onClick={isArabic ? prev : next}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-10 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center"
            aria-label={isArabic ? "السابق" : "Next"}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </>
      )}

      {/* Progress bar (nice for hero banners) */}
      {showProgress && total > 1 && !paused && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[72%] md:w-[55%]">
          <div className="h-1.5 w-full rounded-full bg-white/30 overflow-hidden">
            <motion.div
              key={`${active}-${tick}`} // restart on change or reset
              className="h-full rounded-full bg-white"
              style={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: autoMs / 1000, ease: "linear" }}
            />
          </div>
        </div>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className="absolute bottom-7 md:bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={[
                "h-2.5 rounded-full transition-all",
                idx === active ? "w-10 bg-white" : "w-2.5 bg-white/55 hover:bg-white/75",
              ].join(" ")}
              aria-label={(isArabic ? "انتقل إلى شريحة " : "Go to slide ") + (idx + 1)}
              aria-current={idx === active ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
