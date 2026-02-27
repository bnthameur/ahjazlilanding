'use client';

import { useEffect } from 'react';

export default function OAuthFixer() {
  useEffect(() => {
    // If we loaded on localhost with an OAuth code, redirect to production
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost' &&
      window.location.search.includes('code=')
    ) {
      const code = new URLSearchParams(window.location.search).get('code');
      const locale = window.location.pathname.split('/')[1] || 'en';
      const productionUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://ahjazlilanding-production.up.railway.app';
      
      if (code) {
        const redirectUrl = `${productionUrl}/${locale}/auth/callback?code=${encodeURIComponent(code)}`;
        window.location.replace(redirectUrl);
      }
    }
  }, []);

  return null;
}
