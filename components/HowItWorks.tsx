'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Emoji } from 'react-apple-emojis';
import { Link } from '@/i18n/navigation';

export default function HowItWorks() {
  const t = useTranslations('HowItWorks');
  const locale = useLocale();

  const customerSteps = [
    {
      step: '01',
      title: t('customer.step1_title'),
      description: t('customer.step1_desc'),
      icon: <Emoji name="magnifying-glass-tilted-left" width={40} />,
    },
    {
      step: '02',
      title: t('customer.step2_title'),
      description: t('customer.step2_desc'),
      icon: <Emoji name="camera" width={40} />,
    },
    {
      step: '03',
      title: t('customer.step3_title'),
      description: t('customer.step3_desc'),
      icon: <Emoji name="telephone-receiver" width={40} />,
    },
  ];

  const ownerSteps = [
    {
      step: '01',
      title: t('owner.step1_title'),
      description: t('owner.step1_desc'),
      icon: <Emoji name="memo" width={40} />,
    },
    {
      step: '02',
      title: t('owner.step2_title'),
      description: t('owner.step2_desc'),
      icon: <Emoji name="classical-building" width={40} />,
    },
    {
      step: '03',
      title: t('owner.step3_title'),
      description: t('owner.step3_desc'),
      icon: <Emoji name="chart-increasing" width={40} />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50">
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

        {/* Two Columns */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* For Customers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-shrink-0">
                <Emoji name="direct-hit" width={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{t('customer.title')}</h3>
            </div>

            <div className="space-y-6">
              {customerSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    {index < customerSteps.length - 1 && (
                      <div className="w-0.5 h-12 bg-primary-200 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.icon}</span>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`http://localhost:3001/${locale}/salles`}
              className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {t('customer.cta')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>

          {/* For Owners */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-shrink-0">
                <Emoji name="classical-building" width={48} />
              </div>
              <h3 className="text-2xl font-bold">{t('owner.title')}</h3>
            </div>

            <div className="space-y-6">
              {ownerSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    {index < ownerSteps.length - 1 && (
                      <div className="w-0.5 h-12 bg-white/30 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.icon}</span>
                      <h4 className="font-bold">{item.title}</h4>
                    </div>
                    <p className="text-primary-100 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`http://localhost:3001/${locale}/register`}
              className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-primary-600 font-semibold rounded-lg transition-all duration-200"
            >
              {t('owner.cta')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
