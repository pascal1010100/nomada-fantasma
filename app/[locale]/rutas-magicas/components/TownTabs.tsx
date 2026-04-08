'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Info } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';

export type TownTabId = 'experiences' | 'discover' | 'info';

interface Tab {
    id: TownTabId;
    label: string;
    icon: React.ReactNode;
}

interface TownTabsProps {
    panels: Record<TownTabId, React.ReactNode>;
    defaultTabId?: TownTabId;
}

export default function TownTabs({ panels, defaultTabId = 'experiences' }: TownTabsProps) {
    const t = useTranslations('TownTabs');
    const tabs: Tab[] = [
        { id: 'experiences', label: t('experiences'), icon: <Sparkles className="w-4 h-4" /> },
        { id: 'discover', label: t('discover'), icon: <Compass className="w-4 h-4" /> },
        { id: 'info', label: t('practicalInfo'), icon: <Info className="w-4 h-4" /> },
    ];

    const [activeTab, setActiveTab] = useState<TownTabId>(
        tabs.some((tab) => tab.id === defaultTabId) ? defaultTabId : tabs[0].id
    );

    const activePanel = panels[activeTab] ?? panels[tabs[0].id];

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="sticky top-[48px] md:top-[53px] z-40 transition-all duration-300 pt-2 pb-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-8">
                <nav className="flex space-x-8 overflow-x-auto px-4 sm:px-0 no-scrollbar" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative flex items-center gap-2 py-3 px-4 font-medium text-sm whitespace-nowrap transition-colors outline-none focus:outline-none rounded-full
                                ${activeTab === tab.id
                                    ? 'text-purple-700 dark:text-purple-300' // Text color when active
                                    : 'text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400'
                                }
                            `}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-purple-100 dark:bg-purple-900 rounded-full shadow-sm"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center">
                                {tab.icon}
                                <span className="ml-2">{tab.label}</span>
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area with Staggered Animation */}
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activePanel}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
