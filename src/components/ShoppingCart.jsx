import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { initializeCheckout } from '@/api/EcommerceApi';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const items = cartItems.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity
      }));

      const { url } = await initializeCheckout({
        items,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.href,
      });

      if (url) {
        clearCart();
        window.location.href = url;
      } else {
        throw new Error("Failed to retrieve checkout URL");
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Error',
        description: 'There was a problem initializing checkout. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const renderImage = (imageSrc, title) => {
    if (!imageSrc) return <div className="w-16 h-16 bg-slate-800 rounded-md flex items-center justify-center text-slate-500">?</div>;
    if (imageSrc.length <= 4 && !imageSrc.startsWith('http')) {
      return <div className="w-16 h-16 bg-slate-800 rounded-md flex items-center justify-center text-3xl">{imageSrc}</div>;
    }
    return <img src={imageSrc} alt={title} className="w-16 h-16 object-cover rounded-md" />;
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShoppingCartIcon />
                Cart ({itemCount})
              </h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800" disabled={isProcessing}>
                <X />
              </Button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-500 h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={48} className="mb-4 opacity-50" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.variant.id} className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl">
                    {renderImage(item.product.image, item.product.title)}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-white line-clamp-1">{item.product.title}</h3>
                      <p className="text-sm text-slate-400">{item.variant.title}</p>
                      <p className="text-sm text-blue-400 font-bold">
                        {item.variant.sale_price_formatted || `$${(item.variant.price / 100 || 29).toFixed(2)}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-md">
                        <Button onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))} size="sm" variant="ghost" className="px-2 h-7 text-slate-300 hover:text-white hover:bg-slate-800" disabled={isProcessing}>-</Button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} size="sm" variant="ghost" className="px-2 h-7 text-slate-300 hover:text-white hover:bg-slate-800" disabled={isProcessing}>+</Button>
                      </div>
                      <Button onClick={() => removeFromCart(item.variant.id)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-6 px-2 text-xs" disabled={isProcessing}>Remove</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg text-slate-300">Total</span>
                  <span className="text-2xl font-bold text-white">{getCartTotal()}</span>
                </div>
                <Button 
                  onClick={handleCheckout} 
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-blue-900/20 transition-all"
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    `Checkout securely`
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;