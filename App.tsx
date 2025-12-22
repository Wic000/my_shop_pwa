import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Cpu, MessageSquare, Plus, Minus, Trash2, ArrowRight, Star, Zap, LayoutGrid, Monitor, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as gemini from './services/geminiService';
import { Product, CartItem, Message } from './types';

const PRODUCTS: Product[] = [
  { id: 1, category: 'Noutbuklar', name: 'MacBook Pro M4 Max', price: 3899, specs: '16-core CPU, 40-core GPU', img: 'https://images.unsplash.com/photo-1517336714460-453b5a2d0400?auto=format&fit=crop&q=80', rating: 5.0 },
  { id: 2, category: 'Gaming PC', name: 'PC App Beast Edition', price: 4200, specs: 'RTX 5090 Ready, 128GB RAM', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80', rating: 4.9 },
  { id: 3, category: 'Monitorlar', name: 'ROG Swift OLED 4K', price: 1499, specs: '480Hz, 0.03ms Response', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80', rating: 4.8 },
  { id: 4, category: 'Aksessuarlar', name: 'Custom Mechanical KB', price: 299, specs: 'Hot-swap, Gasket Mount', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80', rating: 4.7 }
];

const CATEGORIES = ['Hammasi', 'Noutbuklar', 'Gaming PC', 'Monitorlar', 'Aksessuarlar'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'chat' | 'cart'>('store');
  const [activeCategory, setActiveCategory] = useState('Hammasi');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Salom! PC App AI yordamchisiman. Sizga qanday kompyuter kerak?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const haptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
      else tg.HapticFeedback.impactOccurred(type);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    haptic('success');
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
    haptic('light');
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);
    haptic('medium');

    try {
      const response = await gemini.generateResponse(userText);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Xatolik yuz berdi. Iltimos qayta urining." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between glass-card border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 pc-gradient-btn rounded-xl flex items-center justify-center shadow-lg shadow-pc-cyan/20">
            <Cpu size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tighter leading-none">PC <span className="text-pc-cyan">App</span></h1>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Premium Store</span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('cart')}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activeTab === 'cart' ? 'pc-gradient-btn' : 'glass-card'}`}
        >
          <ShoppingCart size={20} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#050a18]">
              {cart.reduce((a, b) => a + b.qty, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-4 pb-28">
        <AnimatePresence mode="wait">
          {activeTab === 'store' && (
            <motion.div key="store" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* Promo Banner */}
              <div className="pc-gradient-btn rounded-3xl p-6 mb-8 relative overflow-hidden shadow-2xl shadow-pc-cyan/10">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-2">PC App Max</h2>
                  <p className="text-white/80 text-xs font-medium max-w-[180px]">Yangi RTX 50 seriyasi bilan tanishing</p>
                  <button className="mt-4 bg-white text-[#050a18] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Ko'rish</button>
                </div>
                <Monitor size={140} className="absolute -right-6 -bottom-6 opacity-20 rotate-12" />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${activeCategory === cat ? 'bg-pc-cyan border-pc-cyan text-pc-dark shadow-lg' : 'border-white/10 text-slate-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products */}
              <div className="grid gap-4">
                {PRODUCTS.filter(p => activeCategory === 'Hammasi' || p.category === activeCategory).map(p => (
                  <div key={p.id} className="glass-card rounded-2xl overflow-hidden flex flex-col">
                    <img src={p.img} className="w-full h-40 object-cover" alt={p.name} />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] text-pc-cyan font-bold uppercase">{p.category}</span>
                          <h3 className="font-bold text-lg">{p.name}</h3>
                        </div>
                        <span className="text-xl font-black">${p.price}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4">{p.specs}</p>
                      <button 
                        onClick={() => addToCart(p)}
                        className="w-full pc-gradient-btn py-3 rounded-xl text-xs font-black uppercase tracking-widest"
                      >
                        Savatga qo'shish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-6">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-pc-blue text-white rounded-tr-none' : 'glass-card rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-pc-cyan"></div>
                    <div className="w-2 h-2 rounded-full bg-pc-cyan"></div>
                    <div className="w-2 h-2 rounded-full bg-pc-cyan"></div>
                  </div>
                )}
              </div>
              <div className="p-2 glass-card rounded-2xl flex items-center gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Kompyuter haqida so'rang..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none"
                />
                <button onClick={handleSend} className="w-10 h-10 pc-gradient-btn rounded-xl flex items-center justify-center">
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <h2 className="text-2xl font-black mb-6">Savat</h2>
              {cart.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <ShoppingCart size={64} className="mx-auto mb-4" />
                  <p className="font-bold">Savat hozircha bo'sh</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="glass-card p-3 rounded-2xl flex gap-4">
                      <img src={item.product.img} className="w-20 h-20 rounded-xl object-cover" alt="" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{item.product.name}</h4>
                        <span className="text-pc-cyan font-black">${item.product.price}</span>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQty(item.product.id, -1)} className="p-1 glass-card rounded-md"><Minus size={12}/></button>
                          <span className="text-sm font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(item.product.id, 1)} className="p-1 glass-card rounded-md"><Plus size={12}/></button>
                        </div>
                      </div>
                      <button onClick={() => updateQty(item.product.id, -item.qty)} className="text-red-500/50 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                  ))}
                  <div className="mt-8 p-6 glass-card rounded-3xl text-center">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Umumiy summa</span>
                    <div className="text-4xl font-black mt-2 mb-6">${total}</div>
                    <button className="w-full pc-gradient-btn py-4 rounded-xl font-black text-sm tracking-widest uppercase shadow-xl shadow-pc-cyan/20">Buyurtmani tasdiqlash</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 h-18 glass-card rounded-3xl flex items-center justify-around px-2 z-50">
        {[
          { id: 'store', icon: LayoutGrid, label: 'Do\'kon' },
          { id: 'chat', icon: MessageSquare, label: 'AI Yordamchi' },
          { id: 'cart', icon: ShoppingCart, label: 'Savat' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); haptic('light'); }}
            className={`flex flex-col items-center justify-center w-20 py-2 rounded-2xl transition-all ${activeTab === tab.id ? 'text-pc-cyan' : 'text-slate-500'}`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-bold mt-1">{tab.label}</span>
            {activeTab === tab.id && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-pc-cyan rounded-full mt-1" />}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;