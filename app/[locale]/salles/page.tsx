import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function SallesPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <section className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Browse Venues</h1>
        <p className="text-slate-600 mb-8">
          Your venues listing page is now connected. This route exists at
          <span className="font-semibold"> /{locale}/salles</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            Add Your Venue
          </Link>
        </div>
      </section>
    </main>
  );
}
