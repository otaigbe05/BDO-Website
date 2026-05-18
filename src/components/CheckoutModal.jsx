import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initiateCheckout } from '@/lib/stripeCheckout';
import { Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CheckoutModal = ({ isOpen, onClose, template }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await initiateCheckout(template, email);
      // Redirect happens in the initiateCheckout function
    } catch (err) {
      console.error(err);
      toast({
        title: "Checkout Error",
        description: "There was a problem initiating checkout. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Purchase</DialogTitle>
          <DialogDescription>
            You are purchasing the <strong className="text-slate-900">{template.name}</strong> for ${template.price}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCheckout} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="you@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-11 ${error ? 'border-red-500' : ''}`}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-slate-500">We'll send your download link here.</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Total</span>
              <span className="text-xl font-bold text-slate-900">${template.price}.00</span>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;