'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Info, Hotel } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface TownTabsProps {
    children: React.ReactNode[];
}

const tabs: Tab[] = [
    { id: 'hospedaje', label: 'Hospedaje', icon: <Hotel className="w-4 h-4" /> },
    { id: 'experiences', label: 'Experiencias', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'discover', label: 'Descubre', icon: <Compass className="w-4 h-4" /> },
    { id: 'info', label: 'Info Práctica', icon: <Info className="w-4 h-4" /> },
];

export default function TownTabs({ children }: TownTabsProps) {
    const [activeTab, setActiveTab] = useState('hospedaje');

    // Calculate active index for rendering the correct child
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

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
                        {activeTabIndex !== -1 && children[activeTabIndex]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
