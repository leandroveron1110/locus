import { useEffect, useRef, useState } from "react";

export function useIntersection<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect(); // 👈 una sola vez
      }
    }, options);

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isIntersecting };
}
