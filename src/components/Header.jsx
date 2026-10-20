import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';
import { TRADES } from '@/data/trades';

// "Websites": all designs, then one page per trade (each from that owner's point of view).
// Each product in the menu carries its colour dot (blue websites, green OMIS, purple analytics),
// matching the home page.
const Dot = ({ color }) => <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />;

const IndustriesMenu = () => {
    const [open, setOpen] = useState(false);
    const box = useRef(null);
    const { pathname } = useLocation();
    useEffect(() => { setOpen(false); }, [pathname]);
    useEffect(() => {
        if (!open) return undefined;
        const away = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
        const esc = (e) => { if (e.key === 'Escape') { setOpen(false); box.current?.querySelector('button')?.focus(); } };
        document.addEventListener('pointerdown', away);
        document.addEventListener('keydown', esc);
        return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
    }, [open]);
    const here = pathname.startsWith('/for/');
    return (
        <div ref={box} className="relative">
            <button
                type="button"
                aria-expanded={open}
                aria-controls="industries-menu"
                onClick={() => setOpen((o) => !o)}
                className={`inline-flex items-center gap-1 text-sm font-bold tracking-wide whitespace-nowrap transition-colors hover:text-blue-800 ${here ? 'text-blue-700' : 'text-slate-900'}`}
            >
                <Dot color="bg-blue-600" />Websites <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="industries-menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -left-4 top-full z-50 mt-4 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                    >
                        <a href="/templates/" className="block rounded-xl px-3 py-2.5 hover:bg-blue-50">
                            <span className="block text-sm font-bold text-blue-800">See all the designs</span>
                            <span className="block text-xs text-slate-600">75 website designs for 5 trades</span>
                        </a>
                        <p className="px-3 pt-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">By trade</p>
                        <ul>
                            {TRADES.map((t) => (
                                <li key={t.slug}>
                                    <Link to={`/for/${t.slug}`} className="block rounded-xl px-3 py-2.5 hover:bg-blue-50">
                                        <span className="block text-sm font-bold text-slate-900">{t.label}</span>
                                        <span className="block text-xs text-slate-600">Your website and OMIS, for {t.plural}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // A thin line under the header that fills as the page is read.
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

    const navLinks = [
        { title: 'Home', to: '/' },
        { title: 'OMIS booking', to: '/omis-product', dot: 'bg-emerald-600' },
        { title: 'Data & analytics', to: '/services', dot: 'bg-violet-600' },
        { title: 'Pricing', to: '/pricing' },
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
                        <Link to="/" aria-label="BDO Analytics Solutions, home" className="flex shrink-0 items-center whitespace-nowrap transition-transform hover:scale-[1.03]">
                           <Logo animate />
                        </Link>
                        
                        <div className="hidden lg:flex items-center gap-4 2xl:gap-7">
                            <IndustriesMenu />
                            {navLinks.filter((link) => link.to !== '/').map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/'}
                                    className="inline-flex items-center gap-1.5 text-slate-900 hover:text-blue-800 hover:underline underline-offset-4 transition-colors text-sm font-bold tracking-wide whitespace-nowrap"
                                    style={({ isActive }) => isActive ? activeLinkStyle : {}}
                                >
                                    {link.dot && <Dot color={link.dot} />}{link.title}
                                </NavLink>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                           {/* One button for all three products; each card on the home page carries its own. */}
                           <div className="hidden xl:flex items-center gap-3">
                                <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md rounded-xl transition-all hover:scale-105 ml-2">
                                    <Link to="/contact">Book a call</Link>
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
                                    <span className="inline-flex items-center gap-2">{link.dot && <Dot color={link.dot} />}{link.title}</span>
                                </NavLink>
                            ))}
                            <p className="px-4 pt-3 text-xs font-extrabold uppercase tracking-wider text-blue-700 inline-flex items-center gap-2"><Dot color="bg-blue-600" />Websites, by trade</p>
                            <div className="grid grid-cols-2 gap-1">
                                {TRADES.map((t) => (
                                    <Link key={t.slug} to={`/for/${t.slug}`} onClick={() => setIsMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-800">
                                        {t.label}
                                    </Link>
                                ))}
                            </div>
                            <a href="/templates/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-extrabold text-slate-900 hover:text-blue-800 hover:bg-blue-50 transition-colors">
                                See all the website designs
                            </a>
                            <div className="pt-4 flex flex-col gap-3 px-1">
                                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md rounded-xl py-6">
                                    <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Book a call</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl py-6">
                                     <a href="https://omis-crm.com" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                                        Try OMIS free <ArrowRight className="ml-2 w-4 h-4" />
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