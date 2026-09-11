import { useEffect } from 'react';

const BRAND = 'AURORA';

/** Pass null for the homepage — it stays the bare brand name by client choice. */
export const titleFor = (page) => (page ? `${page} — ${BRAND}` : BRAND);

export function useDocumentTitle(page) {
  useEffect(() => {
    document.title = titleFor(page);
  }, [page]);
}
