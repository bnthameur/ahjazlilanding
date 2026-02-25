import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function RegisterPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <section className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">List Your Venue</h1>
        <p className="text-slate-600 mb-8">
          Registration route is active at
          <span className="font-semibold"> /{locale}/register</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
