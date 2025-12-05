import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <Plane className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">
                                Voyage
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-8">
                        <Link href="#planner" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                            Plan Trip
                        </Link>
                        <Link href="#about" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                            About
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
