import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: { src: string; alt?: string; gradient?: string }[];
  isArabic?: boolean;
  autoMs?: number;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
};

export function FullBleedBackgroundSlider({
  images,
  isArabic = false,
  autoMs = 5500,
  className = "",
  showArrows = true,
  showDots = true,
}: Props) {
  const total = images.length;
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const goTo = React.useCallback(
    (idx: number) => {
      if (total <= 0) return;
      const safe = ((idx % total) + total) % total;
      setActive(safe);
    },
    [total]
  );

  const next = React.useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = React.useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay
  React.useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % total);
    }, autoMs);
    return () => window.clearInterval(id);
  }, [paused, total, autoMs]);

  // Keyboard
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") (isArabic ? prev : next)();
      if (e.key === "ArrowLeft") (isArabic ? next : prev)();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isArabic, next, prev]);

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
    if (Math.abs(dx) < 40) return;

    if (dx > 0) {
      isArabic ? next() : prev();
    } else {
      isArabic ? prev() : next();
    }
  };

  const item = images[active];

  return (
    <div
      className={[
        "relative w-full overflow-hidden",
        // ارتفاع متجاوب (غيّره لو تحب)
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
      <AnimatePresence mode="wait">
        <motion.div
          key={item?.src ?? active}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1.0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* الصورة */}
          <img
            src={item.src}
            alt={item.alt ?? ""}
            className="absolute inset-0 h-full w-full object-top"
            loading={active === 0 ? "eager" : "lazy"}
            decoding="async"
          />

          {/* overlay gradient اختياري */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                item.gradient ??
                "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.10) 45%, rgba(0,0,0,0.55))",
            }}
          />

          {/* فينييت خفيف */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/35" />

          {/* Light sweep بسيط */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ x: isArabic ? 140 : -140, opacity: 0 }}
            animate={{ x: isArabic ? -140 : 140, opacity: 0.18 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{
              background:
                "linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.45) 40%, transparent 70%)",
              mixBlendMode: "soft-light",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* الأسهم */}
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

      {/* الدوتس */}
      {showDots && total > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-2">
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
