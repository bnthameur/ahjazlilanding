'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Emoji } from 'react-apple-emojis';
import Image from 'next/image';

export default function Pricing() {
  const t = useTranslations('Pricing');
  const locale = useLocale();
  const plans = [
    {
      title: t('plans.standard_title'),
      price: t('plans.standard_price'),
      subtitle: t('plans.standard_subtitle'),
      accent: 'from-white to-rose-50',
      border: 'border-white/70',
      text: 'text-slate-900',
      featured: false,
    },
    {
      title: t('plans.wedding_title'),
      price: t('plans.wedding_price'),
      subtitle: t('plans.wedding_subtitle'),
      accent: 'from-slate-950 via-slate-900 to-primary-900',
      border: 'border-primary-300/30',
      text: 'text-white',
      featured: true,
    },
  ];

  const benefits = [
    {
      icon: <Emoji name="loudspeaker" width={32} />,
      title: t('benefits.reach_title'),
      description: t('benefits.reach_desc'),
    },
    {
      icon: <Emoji name="money-bag" width={32} />,
      title: t('benefits.fees_title'),
      description: t('benefits.fees_desc'),
    },
    {
      icon: <Emoji name="high-voltage" width={32} />,
      title: t('benefits.management_title'),
      description: t('benefits.management_desc'),
    },
    {
      icon: <Emoji name="bar-chart" width={32} />,
      title: t('benefits.performance_title'),
      description: t('benefits.performance_desc'),
    },
  ];

  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-28 bg-[radial-gradient(circle_at_top,#fff1f2,transparent_38%),linear-gradient(180deg,#fff7ed_0%,#ffffff_42%,#fff7ed_100%)]">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-[-8rem] top-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 text-primary-700 rounded-full text-sm font-medium mb-4 shadow-sm ring-1 ring-primary-100">
            <Emoji name="sparkles" width={18} />
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('title_part1')}{' '}
            <span className="text-primary-600">{t('title_highlight')}</span>
          </h2>
          <p className="text-lg text-slate-600">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] items-start"
        >
          <div className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{t('offer_badge')}</p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">{t('price')}</h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600">{t('price_subtitle')}</p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg">
                <Image src="/logo.png" alt="Ahjazli Qaati" width={100} height={32} className="h-9 w-auto object-contain brightness-0 invert opacity-80" unoptimized />
                <div className="mt-1 text-sm text-slate-200">{t('trust_message')}</div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.title}
                  className={`rounded-[1.75rem] border ${plan.border} bg-gradient-to-br ${plan.accent} p-6 shadow-sm`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className={`text-xs uppercase tracking-[0.22em] ${plan.featured ? 'text-primary-200' : 'text-slate-400'}`}>
                        {plan.title}
                      </div>
                      <div className={`mt-3 text-4xl font-bold ${plan.text}`}>{plan.price}</div>
                      <div className={`mt-2 text-sm ${plan.featured ? 'text-slate-200' : 'text-slate-600'}`}>{plan.subtitle}</div>
                    </div>
                    <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${plan.featured ? 'bg-white/10 text-white' : 'bg-white text-primary-700 shadow-sm'}`}>
                      {plan.featured ? 'PRO' : 'START'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{benefit.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 text-white p-6 sm:p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.85)] overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium mb-6">
                <Emoji name="wrapped-gift" width={22} />
                {t('offer_badge')}
              </div>

              <div className="space-y-3 mb-8">
                {[
                  t('features_list.photos'),
                  t('features_list.video'),
                  t('features_list.contact'),
                  t('features_list.social'),
                  t('features_list.analytics'),
                  t('features_list.inquiries'),
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-primary-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href={`https://app.ahjazliqaati.com/${locale}/register`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-lg font-bold text-primary-700 transition-all duration-200 hover:bg-rose-50"
              >
                {t('cta')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <p className="mt-4 text-center text-sm text-slate-300">{t('trust_message')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
