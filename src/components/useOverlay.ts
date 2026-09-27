import { useEffect } from "react";

// While an overlay (bag, product, lightbox) is open, the page stops paging.
let open = 0;
export function useOverlay(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;
    open++;
    document.body.dataset.overlay = "1";
    return () => {
      open--;
      if (!open) delete document.body.dataset.overlay;
    };
  }, [isOpen]);
}
