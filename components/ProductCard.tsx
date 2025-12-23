
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  count: number;
  onRemoveFromCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, count, onRemoveFromCart }) => {
  const handleHaptic = () => {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md active:scale-[0.98]">
      <div className="relative h-44 overflow-hidden group">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-blue-600 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{product.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 h-8 mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Narxi:</span>
            <span className="font-bold text-blue-600">${product.price.toLocaleString()}</span>
          </div>

          {count > 0 ? (
            <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1">
              <button 
                onClick={() => {
                    handleHaptic();
                    onRemoveFromCart(product.id);
                }}
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 font-bold hover:bg-red-50 hover:text-red-500"
              >
                -
              </button>
              <span className="font-bold text-slate-700 min-w-[12px] text-center">{count}</span>
              <button 
                onClick={() => {
                    handleHaptic();
                    onAddToCart(product);
                }}
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 font-bold"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                handleHaptic();
                onAddToCart(product);
              }}
              className="px-4 py-2 gradient-brand rounded-2xl text-white text-xs font-bold shadow-lg shadow-blue-100 hover:brightness-110 transition-all"
            >
              Sotib olish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
