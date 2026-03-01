'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Emoji } from 'react-apple-emojis';

export default function Pricing() {
  const t = useTranslations('Pricing');
  const locale = useLocale();

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
    <section id="pricing" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
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

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            </div>

            <div className="relative">
            {/* Offer Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Emoji name="wrapped-gift" width={24} />
              <span>{t('offer_badge')}</span>
            </div>

            {/* Plans */}
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-left">
                <div className="text-sm uppercase tracking-wide text-primary-100 mb-2">
                  {t('plans.standard_title')}
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">{t('plans.standard_price')}</div>
                <div className="text-sm text-primary-100">{t('plans.standard_subtitle')}</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-left">
                <div className="text-sm uppercase tracking-wide text-primary-100 mb-2">
                  {t('plans.wedding_title')}
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">{t('plans.wedding_price')}</div>
                <div className="text-sm text-primary-100">{t('plans.wedding_subtitle')}</div>
              </div>
            </div>

              {/* Benefits Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left max-w-2xl mx-auto">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                    <span className="text-2xl">{benefit.icon}</span>
                    <div>
                      <h4 className="font-bold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-primary-100">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  t('features_list.photos'),
                  t('features_list.video'),
                  t('features_list.contact'),
                  t('features_list.social'),
                  t('features_list.analytics'),
                  t('features_list.inquiries'),
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                    <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={`https://app.ahjazliqaati.com/${locale}/register`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-primary-600 font-bold rounded-xl text-lg transition-all duration-200"
              >
                {t('cta')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Trust Message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-slate-500 mt-8"
        >
          {t('trust_message')}
        </motion.p>
      </div>
    </section>
  );
}
