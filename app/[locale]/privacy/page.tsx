import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function PrivacyPage(props: {
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
              {t('privacy_title')}
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              {t('last_updated')}: {lastUpdated}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                Bienvenue sur <strong>Ahjazli Qaati</strong> (احجز لي قاعتي), la plateforme de référence pour la découverte et la mise en valeur des salles de fêtes et espaces événementiels en Algérie. Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
              </p>
              <p className="text-slate-600 leading-relaxed mt-3">
                مرحباً بكم في <strong>احجز لي قاعتي</strong>، المنصة المرجعية للبحث عن قاعات الأفراح وأماكن الفعاليات في الجزائر. نحن نحترم خصوصيتكم ونلتزم بحماية بياناتكم الشخصية.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Données collectées / البيانات المجمعة</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Nous collectons les données suivantes lors de votre utilisation de la plateforme :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Informations de compte : nom, adresse e-mail, numéro de téléphone (pour les propriétaires de salles)</li>
                <li>Informations sur les salles : titre, description, photos, vidéos, localisation, tarifs</li>
                <li>Données de navigation : pages visitées, durée de session, adresse IP</li>
                <li>Messages et demandes de renseignements envoyés via la plateforme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Utilisation des données / استخدام البيانات</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Les données collectées sont utilisées pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Faire fonctionner et améliorer la plateforme</li>
                <li>Afficher les annonces de salles aux utilisateurs</li>
                <li>Mettre en relation les propriétaires de salles avec les clients potentiels</li>
                <li>Envoyer des notifications relatives à votre compte ou vos annonces</li>
                <li>Analyser l'utilisation de la plateforme afin d'améliorer l'expérience utilisateur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Partage des données / مشاركة البيانات</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous ne vendons jamais vos données personnelles à des tiers. Les informations de contact que vous choisissez de rendre publiques (numéro de téléphone, WhatsApp, e-mail) sont visibles par les utilisateurs de la plateforme dans le cadre de la mise en relation. Nous pouvons partager des données agrégées et anonymisées à des fins statistiques.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Sécurité / الأمان</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous utilisons des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction. Les données sont stockées sur des serveurs sécurisés fournis par Supabase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Vos droits / حقوقكم</h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Conformément à la législation applicable, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la portabilité des données</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-3">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:support@ahjazliqaati.dz" className="text-primary-600 hover:underline">support@ahjazliqaati.dz</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous utilisons des cookies essentiels pour le fonctionnement de la plateforme (authentification, préférences de langue) et des cookies analytiques pour comprendre comment la plateforme est utilisée. Vous pouvez désactiver les cookies non essentiels via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                Pour toute question relative à cette politique de confidentialité, veuillez nous contacter :<br />
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
