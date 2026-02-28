'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { VenueCard } from './VenueCard';

const VENUE_APP_URL = 'https://app.ahjazliqaati.com';

const CATEGORIES = [
    { key: 'all', icon: '🏛️' },
    { key: 'wedding_hall', icon: '💒' },
    { key: 'event_salon', icon: '🎉' },
    { key: 'conference_room', icon: '🏢' },
    { key: 'garden_outdoor', icon: '🌳' },
    { key: 'villa', icon: '🏡' },
    { key: 'hotel_ballroom', icon: '🏨' },
    { key: 'restaurant', icon: '🍽️' },
    { key: 'rooftop', icon: '🌆' },
];

const WILAYAS = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
    'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
    'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
    'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
    'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi',
    'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
    'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla',
    'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane',
    'El M\'Ghair', 'El Meniaa', 'Ouled Djellal', 'Bordj Badji Mokhtar',
    'Béni Abbès', 'Timimoun', 'Touggourt', 'Djanet', 'In Salah', 'In Guezzam'
];

interface Venue {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    capacity: number;
    images: string[];
    category?: string;
}

export default function ExploreVenues() {
    const locale = useLocale();
    const t = useTranslations('VenuesList');
    const [venues, setVenues] = useState<Venue[]>([]);
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch venues on mount
    useEffect(() => {
        const fetchVenues = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .from('venues')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching venues:', error);
                setLoading(false);
                return;
            }

            setVenues(data || []);
            setFilteredVenues(data || []);
            setLoading(false);
        };

        fetchVenues();
    }, []);

    // Filter venues when filters change
    useEffect(() => {
        let result = venues;

        if (selectedCategory !== 'all') {
            result = result.filter(v => v.category === selectedCategory);
        }

        if (selectedLocation) {
            result = result.filter(v =>
                v.location?.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(v =>
                v.title?.toLowerCase().includes(q) ||
                v.description?.toLowerCase().includes(q) ||
                v.location?.toLowerCase().includes(q)
            );
        }

        setFilteredVenues(result);
    }, [selectedCategory, selectedLocation, searchQuery, venues]);

    return (
        <section id="explore" className="py-16 sm:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                        <span>🔍</span>
                        <span>{t('badge')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {/* Search & Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-8"
                >
                    {/* Search Row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('search_placeholder')}
                                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                            />
                        </div>
                        <div className="relative sm:w-56">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm appearance-none bg-white cursor-pointer"
                            >
                                <option value="">{t('all_locations')}</option>
                                {WILAYAS.map((w) => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`sm:hidden flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${showFilters ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-slate-200 text-slate-600'}`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            {t('filters')}
                        </button>
                    </div>

                    {/* Category Chips */}
                    <div className={`mt-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat.key
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <span className="text-base">{cat.icon}</span>
                                    {t(`categories.${cat.key}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredVenues.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="text-xl text-slate-500 font-medium">{t('empty')}</p>
                        <p className="text-slate-400 mt-2">{t('try_different')}</p>
                    </motion.div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-slate-500">
                                {t('results_count', { count: filteredVenues.length })}
                            </p>
                        </div>

                        {/* Venue Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredVenues.map((venue, index) => (
                                <motion.div
                                    key={venue.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <VenueCard venue={venue} />
                                </motion.div>
                            ))}
                        </div>

                        {/* View More CTA */}
                        <div className="text-center mt-12">
                            <a
                                href={`${VENUE_APP_URL}/${locale}/salles`}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                {t('view_all')}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
