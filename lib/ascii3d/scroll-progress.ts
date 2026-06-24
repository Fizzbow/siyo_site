/**
 * Scroll progress for a tall section with an inner sticky viewport.
 * `0` = sticky segment starts; `1` = scrolled through (sectionHeight - viewportHeight).
 */
export function computeScrollProgress(
  sectionEl: HTMLElement,
  scrollY: number = window.scrollY
): number {
  const start = sectionEl.offsetTop;
  const scrollableDistance = sectionEl.offsetHeight - window.innerHeight;

  if (scrollableDistance <= 0) {
    return scrollY >= start ? 1 : 0;
  }

  return Math.min(1, Math.max(0, (scrollY - start) / scrollableDistance));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type ScrollProgressListener = (progress: number) => void;

export function subscribeScrollProgress(
  sectionEl: HTMLElement,
  onProgress: ScrollProgressListener
): () => void {
  let rafId = 0;

  const emit = () => {
    rafId = 0;
    const progress = prefersReducedMotion()
      ? 0.25
      : computeScrollProgress(sectionEl);
    onProgress(progress);
  };

  const schedule = () => {
    if (rafId !== 0) {
      return;
    }
    rafId = window.requestAnimationFrame(emit);
  };

  emit();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(schedule)
      : null;
  resizeObserver?.observe(sectionEl);

  return () => {
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
    }
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    resizeObserver?.disconnect();
  };
}
