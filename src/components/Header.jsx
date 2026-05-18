import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart2, ShoppingCart as ShoppingCartIcon, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import ShoppingCart from '@/components/ShoppingCart';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartItems } = useCart();

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const navLinks = [
        { title: 'Home', to: '/' },
        { title: 'OMIS Product', to: '/omis-product' },
        { title: 'Services', to: '/services' },
        { title: 'Business Templates', to: '/business-templates' },
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
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900 transition-transform hover:scale-105 tracking-tight">
                           <BarChart2 className="w-7 h-7 text-blue-700"/>
                           BDO Analytics Solutions
                        </Link>
                        
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
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
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="hidden xl:flex items-center gap-3">
                                <button 
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-slate-900 hover:text-blue-800 transition-colors focus:outline-none"
                                    aria-label="Open Shopping Cart"
                                >
                                    <ShoppingCartIcon className="w-6 h-6" />
                                    {itemCount > 0 && (
                                        <motion.span 
                                            key={itemCount}
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center w-5 h-5 bg-blue-700 text-white text-xs font-bold rounded-full"
                                        >
                                            {itemCount}
                                        </motion.span>
                                    )}
                                </button>

                                <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-600/20 rounded-xl transition-all hover:scale-105 ml-2">
                                    <Link to="/book-demo">Book a Demo</Link>
                                </Button>
                                <Button asChild variant="outline" className="font-bold shadow-sm rounded-xl border-blue-700 text-blue-800 hover:bg-blue-50 transition-all">
                                    <a href="https://omis-crm.com" target="_blank" rel="noopener noreferrer">
                                        Try OMIS Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                           </div>
                            <div className="lg:hidden flex items-center gap-2">
                                <button 
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-slate-900 hover:text-blue-800 transition-colors focus:outline-none"
                                    aria-label="Open Shopping Cart"
                                >
                                    <ShoppingCartIcon className="w-6 h-6" />
                                    {itemCount > 0 && (
                                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center w-5 h-5 bg-blue-700 text-white text-xs font-bold rounded-full">
                                            {itemCount}
                                        </span>
                                    )}
                                </button>

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

            <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        </>
    );
};

export default Header;