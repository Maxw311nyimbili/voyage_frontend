'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    const scrollToPlanner = () => {
        const plannerSection = document.getElementById('planner');
        plannerSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative bg-white h-screen pt-16 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">

                {/* Center Content */}
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Headline */}
                        <h1 className="text-6xl md:text-7xl font-semibold leading-tight mb-6 tracking-tight">
                            <span className="text-gray-900">Plan your</span>
                            <br />
                            <span className="text-orange-500">perfect trip</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl text-orange-500 mb-12 font-semibold max-w-2xl mx-auto leading-relaxed">
                            AI-powered itineraries with real photos and interactive maps.
                            <br />
                            Just tell us where you want to go.
                        </p>

                        {/* CTA */}
                        <button
                            onClick={scrollToPlanner}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white text-base font-medium rounded-full hover:bg-orange-600 transition-all shadow-sm hover:shadow-md"
                        >
                            Start planning
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Subtle Background Element */}
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 -z-10" />
            </div>
        </div>
    );
}
