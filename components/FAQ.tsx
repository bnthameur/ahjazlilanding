'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('items.list_q'),
      answer: t('items.list_a'),
    },
    {
      question: t('items.free_q'),
      answer: t('items.free_a'),
    },
    {
      question: t('items.approval_q'),
      answer: t('items.approval_a'),
    },
    {
      question: t('items.contact_q'),
      answer: t('items.contact_a'),
    },
    {
      question: t('items.edit_q'),
      answer: t('items.edit_a'),
    },
    {
      question: t('items.types_q'),
      answer: t('items.types_a'),
    },
    {
      question: t('items.safe_q'),
      answer: t('items.safe_a'),
    },
    {
      question: t('items.visibility_q'),
      answer: t('items.visibility_a'),
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
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

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-white rounded-xl p-5 text-left border border-slate-200 hover:border-primary-200 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-primary-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12 p-8 bg-white rounded-2xl border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('contact_title')}</h3>
          <p className="text-slate-600 mb-4">{t('contact_subtitle')}</p>
          <a
            href="mailto:support@ahjazliqaati.dz"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('contact_cta')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
