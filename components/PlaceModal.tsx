'use client';

import { X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface PlaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: {
        name: string;
        description: string;
        time: string;
        image_url?: string;
    } | null;
}

export default function PlaceModal({ isOpen, onClose, activity }: PlaceModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!activity) return null;

    // Use backend-provided image or fallback
    const images = [
        activity.image_url || 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=800',
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 30 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white z-50 max-h-[90vh] overflow-hidden shadow-2xl rounded-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-10 w-12 h-12 bg-black text-white hover:bg-gray-900 flex items-center justify-center transition-colors rounded-xl"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="grid md:grid-cols-5">
                            {/* Image */}
                            <div className="md:col-span-3 relative h-96 md:h-auto bg-gray-900">
                                <img
                                    src={activity.image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'}
                                    alt={activity.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Only set fallback once to prevent infinite loop
                                        if (e.currentTarget.src !== 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80') {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
                                        }
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2 p-10 flex flex-col justify-center bg-white">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold mb-6 self-start tracking-wider rounded-lg">
                                    <Clock className="h-3 w-3" />
                                    {activity.time}
                                </div>

                                <h2 className="text-4xl font-black text-black mb-4 leading-tight">
                                    {activity.name}
                                </h2>

                                <p className="text-base text-gray-600 leading-relaxed mb-8">
                                    {activity.description}
                                </p>

                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors"
                                >
                                    Get Directions →
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
