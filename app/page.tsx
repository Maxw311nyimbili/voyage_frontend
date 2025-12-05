'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PlaceModal from '../components/PlaceModal';
import { Loader2, Sparkles, Clock, Download } from 'lucide-react';

const MapComponent = dynamic(() => import('../components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400">Loading Map...</div>
        </div>
    ),
});

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState<any>(null);
    const [formData, setFormData] = useState({
        destination: '',
        days: 3,
        interests: '',
    });
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/generate_itinerary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setItinerary(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate itinerary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!itinerary) return;
        setDownloading(true);

        try {
            const res = await fetch('http://localhost:8000/generate_itinerary_pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itinerary),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `wanderlust_itinerary_${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const errorText = await res.text();
                console.error('PDF Generation failed:', errorText);
                alert('Failed to generate PDF. Please check the console for details.');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF. Is the backend running?');
        } finally {
            setDownloading(false);
        }
    };

    const handleMarkerClick = (activity: any) => {
        setSelectedActivity(activity);
        setIsModalOpen(true);
    };

    const mapCenter: [number, number] = useMemo(() => {
        if (itinerary?.days?.[0]?.activities?.[0]) {
            return [itinerary.days[0].activities[0].lat, itinerary.days[0].activities[0].lon];
        }
        return [48.8566, 2.3522];
    }, [itinerary]);

    const allActivities = useMemo(() => {
        if (!itinerary || !itinerary.days) return [];
        return itinerary.days.flatMap((day: any) => day.activities || []);
    }, [itinerary]);

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />

            {/* Planner Section - Split Layout */}
            <section id="planner" className="h-screen flex">
                {/* Left Sidebar - Input & List */}
                <div className="w-[480px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
                    {/* Input Form */}
                    <div className="p-8 border-b border-gray-200">
                        <h2 className="text-3xl font-black mb-6 text-orange-500">
                            Where to?
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Destination..."
                                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="14"
                                    placeholder="Days"
                                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    value={formData.days}
                                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                                />
                                <input
                                    type="text"
                                    placeholder="Interests..."
                                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    value={formData.interests}
                                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 text-white py-4 font-medium rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Generate
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Itinerary List - No Images */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {itinerary ? (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black mb-1">{itinerary.trip_title}</h3>
                                        <p className="text-sm text-gray-500">{itinerary.days?.length} days</p>
                                    </div>
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={downloading}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-black disabled:opacity-50"
                                        title="Download PDF"
                                    >
                                        {downloading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <Download className="h-6 w-6" />
                                        )}
                                    </button>
                                </div>

                                {itinerary.days?.map((day: any, dayIdx: number) => (
                                    <div key={dayIdx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center font-black rounded-lg">
                                                {day.day}
                                            </div>
                                            <h4 className="font-black text-lg">{day.title}</h4>
                                        </div>

                                        <div className="space-y-2 pl-13">
                                            {day.activities?.map((activity: any, actIdx: number) => (
                                                <button
                                                    key={actIdx}
                                                    onClick={() => handleMarkerClick(activity)}
                                                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all group"
                                                >
                                                    <h5 className="font-semibold group-hover:text-gray-900 mb-1 text-gray-900">
                                                        {activity.name}
                                                    </h5>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                        <Clock className="h-3 w-3" />
                                                        {activity.time}
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {activity.description}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                <p>Enter a destination to start</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Map */}
                <div className="flex-1 relative">
                    <MapComponent
                        activities={allActivities}
                        center={mapCenter}
                        onMarkerClick={handleMarkerClick}
                    />
                </div>

                <PlaceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    activity={selectedActivity}
                />
            </section>
        </main>
    );
}
