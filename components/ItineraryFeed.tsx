'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

interface Activity {
    name: string;
    description: string;
    time: string;
}

interface DayPlan {
    day: number;
    title: string;
    activities: Activity[];
}

interface ItineraryFeedProps {
    days: DayPlan[];
}

export default function ItineraryFeed({ days }: ItineraryFeedProps) {
    if (!days) return null;

    return (
        <div className="space-y-8">
            {days.map((day, dayIdx) => (
                <motion.div
                    key={dayIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIdx * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">Day {day.day}</span>
                        {day.title}
                    </h3>

                    <div className="space-y-6 relative pl-4 border-l-2 border-gray-100">
                        {day.activities.map((activity, actIdx) => (
                            <div key={actIdx} className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-400 border-2 border-white ring-2 ring-blue-100" />

                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-gray-800">{activity.name}</h4>
                                    <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {activity.time}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {activity.description}
                                </p>

                                <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    View on Map
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
