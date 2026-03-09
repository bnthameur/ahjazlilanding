import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export default createMiddleware(routing);

export const config = {
    matcher: [
        '/',
        '/(ar|en|fr)/:path*',
        '/((?!api|_next|_vercel|.*\..*).*)'
    ]
};
