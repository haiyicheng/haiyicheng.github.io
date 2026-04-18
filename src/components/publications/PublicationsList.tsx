'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

const sectionOrder: { type: string; label: string }[] = [
    { type: 'journal', label: 'Peer-Reviewed Articles' },
    { type: 'preprint', label: 'Working Papers' },
    { type: 'conference', label: 'Conference Presentations' },
];

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    const grouped = sectionOrder
        .map(({ type, label }) => ({
            label,
            pubs: publications.filter(p => p.type === type),
        }))
        .filter(g => g.pubs.length > 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-6">
                <h1 className={`${embedded ? "text-2xl" : "text-3xl"} font-serif font-bold text-primary mb-3`}>{config.title}</h1>
                {config.description && (
                    <div className="text-base text-neutral-700 dark:text-neutral-500 max-w-2xl leading-relaxed">
                        <ReactMarkdown components={{ p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p> }}>{config.description}</ReactMarkdown>
                    </div>
                )}
            </div>

            {grouped.map(({ label, pubs }) => (
                <div key={label} className="mb-8">
                    <h2 className="text-xl font-serif font-bold text-primary mb-4">{label}</h2>
                    <div className="space-y-4">
                        {pubs.map((pub, index) => (
                            <motion.div
                                key={pub.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.05 * index }}
                                className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200"
                            >
                                <h3 className="text-base font-semibold text-primary mb-1 leading-snug">
                                    {pub.title}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''}`}>
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                {(pub.journal || pub.conference) && (
                                    <p className="text-sm text-neutral-800 dark:text-neutral-600 mb-2">
                                        <em>{pub.journal || pub.conference}</em>{pub.volume ? `, ${pub.volume}` : ''}{pub.pages ? `, ${pub.pages}` : ''}{pub.year ? `, ${pub.year}` : ''}.
                                    </p>
                                )}
                                {pub.description && (
                                    <div className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                                        <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>{pub.description}</ReactMarkdown>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 mt-1">
                                    {pub.doi && (
                                        <a
                                            href={`https://doi.org/${pub.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            DOI
                                        </a>
                                    )}
                                    {pub.abstract && (
                                        <button
                                            onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                            className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors",
                                                expandedAbstractId === pub.id
                                                    ? "bg-accent text-white"
                                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                            )}
                                        >
                                            <DocumentTextIcon className="h-3 w-3 mr-1" />
                                            Abstract
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {expandedAbstractId === pub.id && pub.abstract ? (
                                        <motion.div
                                            key="abstract"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mt-3"
                                        >
                                            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700">
                                                <p className="text-sm text-neutral-600 dark:text-neutral-500 leading-relaxed">
                                                    {pub.abstract}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </motion.div>
    );
}
