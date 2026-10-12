'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getApiUrl } from '../lib/config';

export default function PageTimer() {
  const pathname = usePathname();

  useEffect(() => {
    const start = Date.now();
    let sent = false;
    const send = () => {
      const elapsed = Date.now() - start;
      // skip the instant remount that React dev mode does on every page load
      if (sent || elapsed < 500) return;
      sent = true;
      fetch(`${getApiUrl()}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          activityType: 'page',
          eventType: 'page_view',
          timeOnPageMs: elapsed,
          metadata: { path: pathname },
        }),
      }).catch(() => {});
    };
    window.addEventListener('pagehide', send);
    return () => {
      window.removeEventListener('pagehide', send);
      send();
    };
  }, [pathname]);

  return null;
}