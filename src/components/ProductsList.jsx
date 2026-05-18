import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayVariant = useMemo(() => product.variants && product.variants[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => hasSale ? displayVariant.sale_price_formatted : (displayVariant?.price_formatted || `$29.00`), [displayVariant, hasSale]);
  const originalPrice = useMemo(() => hasSale ? displayVariant.price_formatted : null, [displayVariant, hasSale]);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Only navigate to detail page if there are multiple variants and it's not a pre-configured template
    if (product.variants && product.variants.length > 1 && !product.isTemplate) {
      navigate(`/product/${product.id}`);
      return;
    }

    const defaultVariant = product.variants ? product.variants[0] : {
      id: `${product.id}-default`,
      title: 'Digital Download',
      price: product.price || 29,
      price_formatted: `$${product.price ? product.price.toFixed(2) : '29.00'}`
    };

    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity || 999);
      toast({
        title: "Added to Cart! 🛒",
        description: `${product.title || product.name} has been added to your cart.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [product, addToCart, toast, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="rounded-2xl border border-slate-700 bg-slate-800/50 text-white overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:bg-slate-800 flex flex-col h-full relative cursor-pointer" onClick={handleAddToCart}>
        <div className="relative h-48 bg-slate-900 flex items-center justify-center border-b border-slate-700">
          {product.image && product.image.length <= 4 && !product.image.startsWith('http') ? (
            <div className="text-7xl group-hover:scale-110 transition-transform duration-300">{product.image}</div>
          ) : (
            <img
              src={product.image || placeholderImage}
              alt={product.title || product.name || 'Product Image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
          
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg flex items-baseline gap-1.5">
            {hasSale && (
              <span className="line-through opacity-70 text-xs">{originalPrice}</span>
            )}
            <span>{displayPrice}</span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2">{product.title || product.name}</h3>
          <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
            {product.subtitle || product.description || 'Enhance your business with our professional templates and solutions.'}
          </p>
          
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsList = ({ preloadedProducts }) => {
  const [products, setProducts] = useState(preloadedProducts || []);
  const [loading, setLoading] = useState(!preloadedProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (preloadedProducts) {
      setProducts(preloadedProducts);
      setLoading(false);
      return;
    }

    const fetchProductsWithQuantities = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsResponse = await getProducts();

        if (!productsResponse || !productsResponse.products || productsResponse.products.length === 0) {
          setProducts([]);
          return;
        }

        const productIds = productsResponse.products.map(product => product.id);

        try {
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: productIds
          });

          const variantQuantityMap = new Map();
          if (quantitiesResponse && quantitiesResponse.variants) {
            quantitiesResponse.variants.forEach(variant => {
              variantQuantityMap.set(variant.id, variant.inventory_quantity);
            });
          }

          const productsWithQuantities = productsResponse.products.map(product => ({
            ...product,
            variants: product.variants ? product.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            })) : []
          }));

          setProducts(productsWithQuantities);
        } catch (qtyErr) {
          setProducts(productsResponse.products);
        }
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithQuantities();
  }, [preloadedProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8 bg-red-400/10 rounded-xl border border-red-400/20 max-w-2xl mx-auto">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-slate-400 p-12 bg-slate-800/50 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
        <p className="text-lg">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;