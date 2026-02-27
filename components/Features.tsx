'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Emoji } from 'react-apple-emojis';

export default function Features() {
  const t = useTranslations('Features');
  const locale = useLocale();

  const features = [
    {
      icon: <Emoji name="magnifying-glass-tilted-left" width={48} />,
      title: t('items.discovery_title'),
      description: t('items.discovery_desc'),
    },
    {
      icon: <Emoji name="telephone-receiver" width={48} />,
      title: t('items.contact_title'),
      description: t('items.contact_desc'),
    },
    {
      icon: <Emoji name="round-pushpin" width={48} />,
      title: t('items.filtering_title'),
      description: t('items.filtering_desc'),
    },
    {
      icon: <Emoji name="camera" width={48} />,
      title: t('items.media_title'),
      description: t('items.media_desc'),
    },
    {
      icon: <Emoji name="free-button" width={48} />,
      title: t('items.listing_title'),
      description: t('items.listing_desc'),
    },
    {
      icon: <Emoji name="high-voltage" width={48} />,
      title: t('items.response_title'),
      description: t('items.response_desc'),
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-primary-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex items-center justify-start mb-5 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16"
        >
          <a
            href={`/${locale}/salles`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            {t('cta')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
