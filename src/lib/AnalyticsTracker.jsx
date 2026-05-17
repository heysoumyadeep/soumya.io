'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = setTimeout(() => {
      const qs = searchParams?.toString();
      trackPageView(`${pathname}${qs ? `?${qs}` : ''}`);
    }, 100);
    return () => clearTimeout(id);
  }, [pathname, searchParams]);

  return null;
}
