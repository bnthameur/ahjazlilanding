import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SITE_URL = 'https://ahjazliqaati.com';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await props.params;
    const titles: Record<string, string> = {
        ar: 'شروط الخدمة — احجز لقاعتي',
        fr: 'Conditions d\'Utilisation — Ahjaz Liqaati',
        en: 'Terms of Service — Ahjaz Liqaati',
    };
    return {
        title: titles[locale] || titles.ar,
        alternates: {
            canonical: locale === 'ar' ? `${SITE_URL}/terms` : `${SITE_URL}/${locale}/terms`,
        },
        robots: { index: true, follow: true },
    };
}

export default async function TermsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Legal' });
  const lastUpdated = 'Mars 2025 / مارس 2025';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back_home')}
          </Link>

          <div className="prose prose-slate max-w-none">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              {t('terms_title')}
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              {t('last_updated')}: {lastUpdated}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptation des conditions / قبول الشروط</h2>
              <p className="text-slate-600 leading-relaxed">
                En utilisant la plateforme <strong>Ahjazli Qaati</strong> (احجز لي قاعتي), vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                باستخدامك لمنصة <strong>احجز لي قاعتي</strong>، فإنك توافق على شروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Description du service / وصف الخدمة</h2>
              <p className="text-slate-600 leading-relaxed">
                Ahjazli Qaati est une plateforme de mise en relation entre propriétaires de salles de fêtes et espaces événementiels en Algérie, et les personnes à la recherche de tels espaces. La plateforme permet :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 mt-3">
                <li>La publication et la gestion d'annonces de salles (pour les propriétaires)</li>
                <li>La recherche et la consultation de salles disponibles (pour les clients)</li>
                <li>La mise en relation directe entre propriétaires et clients</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Comptes propriétaires / حسابات أصحاب القاعات</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                En créant un compte propriétaire, vous vous engagez à :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Fournir des informations exactes et complètes sur votre salle</li>
                <li>Maintenir à jour les informations de votre annonce</li>
                <li>Ne pas publier de contenu trompeur, illégal ou portant atteinte aux droits de tiers</li>
                <li>Respecter la tarification et les conditions affichées sur votre annonce</li>
                <li>Répondre aux demandes des clients dans un délai raisonnable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Tarification et paiement / التسعير والدفع</h2>
              <p className="text-slate-600 leading-relaxed">
                La publication d'une annonce sur Ahjazli Qaati est soumise au paiement d'un abonnement selon les formules en vigueur :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 mt-3">
                <li>Formule Essentielle : 5 000 DA pour 2 mois de visibilité</li>
                <li>Formule Premium : 10 000 DA pour 6 mois de visibilité</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                Les tarifs sont susceptibles d'être modifiés. Toute modification sera notifiée aux utilisateurs au préalable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Contenu interdit / المحتوى المحظور</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Il est strictement interdit de publier sur la plateforme :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Des informations fausses ou trompeuses</li>
                <li>Des images ou vidéos n'appartenant pas à votre salle ou sans autorisation</li>
                <li>Du contenu à caractère illégal, offensant ou discriminatoire</li>
                <li>Des coordonnées de contact erronées</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                Toute violation de ces règles peut entraîner la suspension ou la suppression de votre compte.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Responsabilité / المسؤولية</h2>
              <p className="text-slate-600 leading-relaxed">
                Ahjazli Qaati est une plateforme de mise en relation et n'est pas partie aux contrats conclus entre propriétaires et clients. Nous déclinons toute responsabilité concernant les accords conclus directement entre les parties, les disponibilités des salles, ou tout différend éventuel.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Propriété intellectuelle / الملكية الفكرية</h2>
              <p className="text-slate-600 leading-relaxed">
                La plateforme Ahjazli Qaati, son design, son logo et ses contenus originaux sont la propriété exclusive de l'équipe Ahjazli Qaati. Les photos et vidéos publiées par les propriétaires de salles restent leur propriété, mais ils accordent à Ahjazli Qaati une licence pour les afficher sur la plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Modifications des conditions / تعديل الشروط</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme. L'utilisation continue de la plateforme après modification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                Pour toute question relative à ces conditions d'utilisation :<br />
                Email : <a href="mailto:support@ahjazliqaati.dz" className="text-primary-600 hover:underline">support@ahjazliqaati.dz</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
