
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { Product, CartItem, Category } from './types';
import { PRODUCTS } from './constants';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Hammasi'>('Hammasi');
  const [view, setView] = useState<'store' | 'checkout'>('store');

  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, [tg]);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    if (!tg) return;

    if (totalItems > 0 && view === 'store') {
      tg.MainButton.setText(`Buyurtma berish: $${totalAmount.toLocaleString()}`);
      tg.MainButton.show();
      tg.MainButton.onClick(() => setView('checkout'));
    } else if (view === 'checkout') {
      tg.MainButton.setText(`To'lovni tasdiqlash ($${totalAmount.toLocaleString()})`);
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }

    return () => {
      tg.MainButton.offClick(() => {});
    };
  }, [totalItems, totalAmount, view, tg]);

  useEffect(() => {
    if (!tg) return;
    if (view === 'checkout') {
      tg.BackButton.show();
      tg.BackButton.onClick(() => setView('store'));
    } else {
      tg.BackButton.hide();
    }
  }, [view, tg]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing?.quantity === 1) {
        return prev.filter(item => item.id !== id);
      }
      return prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Hammasi') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleCheckout = () => {
    tg.HapticFeedback.notificationOccurred('success');
    const orderData = {
        items: cart.map(i => ({ name: i.name, qty: i.quantity })),
        total: totalAmount,
        user: tg.initDataUnsafe?.user?.first_name
    };
    tg.sendData(JSON.stringify(orderData));
    tg.close();
  };

  tg?.MainButton.onClick(() => {
    if (view === 'checkout') {
        handleCheckout();
    }
  });

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      {view === 'store' ? (
        <main className="p-4">
          <section className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Eng zo'r qurilmalar</h2>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {['Hammasi', ...Object.values(Category)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-4 py-2 rounded-2xl whitespace-nowrap text-sm font-bold transition-all ${
                    selectedCategory === cat 
                    ? 'gradient-brand text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-slate-500 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                count={cart.find(i => i.id === product.id)?.quantity || 0}
              />
            ))}
          </div>
        </main>
      ) : (
        <main className="p-6">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Sizning Savatchangiz</h2>
          
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-slate-100">
                <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-blue-500 font-bold">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">-</button>
                  <span className="font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-600/70 font-medium">Mahsulotlar soni</span>
              <span className="font-bold text-slate-900">{totalItems} ta</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-600/70 font-medium">Yetkazib berish</span>
              <span className="font-bold text-green-600">Bepul</span>
            </div>
            <div className="h-[1px] bg-blue-200 mb-4 opacity-50"></div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Jami:</span>
              <span className="text-2xl font-black text-blue-600">${totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed px-4">
            Tasdiqlash tugmasini bosganingizdan so'ng, bizning operatorlarimiz siz bilan bog'lanishadi.
          </p>
        </main>
      )}
    </div>
  );
};

export default App;
