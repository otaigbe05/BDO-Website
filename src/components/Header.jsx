import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart2, ArrowRight } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // A thin line under the header that fills as the page is read.
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

    const navLinks = [
        { title: 'Home', to: '/' },
        { title: 'OMIS Product', to: '/omis-product' },
        { title: 'Services', to: '/services' },
        { title: 'ROI Calculator', to: '/roi-calculator' },
        { title: 'About', to: '/about' },
        { title: 'Contact', to: '/contact' },
    ];

    const activeLinkStyle = {
        color: '#1D4ED8', /* blue-800 for stronger contrast */
        fontWeight: '800',
        textDecoration: 'underline',
        textUnderlineOffset: '4px'
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-300 supports-[backdrop-filter]:bg-white/95 font-sans shadow-sm">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-6 h-20">
                        <Link to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-lg xl:text-xl font-extrabold text-slate-900 transition-transform hover:scale-105 tracking-tight">
                           <BarChart2 className="w-7 h-7 text-blue-700"/>
                           BDO Analytics Solutions
                        </Link>
                        
                        <div className="hidden lg:flex items-center gap-4 2xl:gap-7">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/'}
                                    className="text-slate-900 hover:text-blue-800 hover:underline underline-offset-4 transition-colors text-sm font-bold tracking-wide whitespace-nowrap"
                                    style={({ isActive }) => isActive ? activeLinkStyle : {}}
                                >
                                    {link.title}
                                </NavLink>
                            ))}
                            {/* The template gallery is its own app behind /templates, so a normal link. */}
                            <a href="/templates/" className="group inline-flex items-center gap-1.5 text-slate-900 hover:text-blue-800 hover:underline underline-offset-4 transition-colors text-sm font-bold tracking-wide whitespace-nowrap">
                                Templates
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 no-underline">New</span>
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="hidden xl:flex items-center gap-3">
                                <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-600/20 rounded-xl transition-all hover:scale-105 ml-2">
                                    <Link to="/book-demo">Book a Demo</Link>
                                </Button>
                                <Button asChild variant="outline" className="hidden 2xl:inline-flex font-bold shadow-sm rounded-xl border-blue-700 text-blue-800 hover:bg-blue-50 transition-all">
                                    <a href="https://omis-crm.com" target="_blank" rel="noopener noreferrer">
                                        Try OMIS Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                           </div>
                            <div className="lg:hidden flex items-center gap-2">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 rounded-md text-slate-900 hover:text-blue-800"
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
                <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-300 shadow-xl overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/'}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                                    style={({ isActive }) => (isActive ? { ...activeLinkStyle, backgroundColor: '#F0F9FF' } : {})}
                                >
                                    {link.title}
                                </NavLink>
                            ))}
                            <a href="/templates/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:text-blue-800 hover:bg-blue-50 transition-colors">
                                Website Templates
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800">New</span>
                            </a>
                            <div className="pt-4 flex flex-col gap-3 px-1">
                                <Button asChild className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md rounded-xl py-6">
                                    <Link to="/book-demo" onClick={() => setIsMenuOpen(false)}>Book a Demo</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full border-blue-700 text-blue-800 hover:bg-blue-50 font-bold rounded-xl py-6">
                                     <a href="https://omis-crm.com" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                                        Try OMIS Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;