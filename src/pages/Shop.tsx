import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Store, Plus, ShoppingCart, ShieldCheck, Search, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { ModuleGuard } from '../components/ModuleGuard';

export const Shop = () => {
  return <ShopApp />;
};

const SafeImage = ({ src, alt, className, ...props }: any) => {
  const [error, setError] = useState(false);
  const fallback = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400';
  
  // Use a ref to track if we've already tried the src to avoid flicker
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-slate-50 ${className}`}>
      <img 
        src={error ? fallback : (currentSrc || fallback)} 
        alt={alt} 
        className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${error ? 'opacity-50' : 'opacity-100'}`} 
        onError={() => {
          if (!error) {
            setError(true);
          }
        }}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};

const ShopApp = () => {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [view, setView] = useState<'list'|'detail'|'sell'|'checkout'>('list');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Form State for selling
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state for checkout
  const [orderAddress, setOrderAddress] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const productDefinitions = [
        {
          type: 'Smartphone', brands: ['Samsung', 'Xiaomi', 'Apple', 'Vivo', 'Oppo'], minPrice: 15000, maxPrice: 120000,
          images: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          type: 'Laptop', brands: ['HP', 'Dell', 'Lenovo', 'Apple', 'Asus'], minPrice: 45000, maxPrice: 150000,
          images: [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          type: 'Chair', brands: ['Hatil', 'Otobi', 'IKEA', 'Regal', 'Partex'], minPrice: 2000, maxPrice: 15000,
          images: [
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          type: 'Table', brands: ['Hatil', 'Regal', 'Otobi', 'Partex', 'IKEA'], minPrice: 4000, maxPrice: 25000,
          images: [
            'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          type: 'Fan', brands: ['Walton', 'Vision', 'Click', 'Nitol', 'Super Star'], minPrice: 1500, maxPrice: 5000,
          images: [
            'https://images.unsplash.com/photo-1616858100147-38e2178d8a7c?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1553531384-397c80973a0b?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1565151443317-024097486f06?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1542369014-41d3e86c0780?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          type: 'Light', brands: ['Philips', 'Walton', 'Energypac', 'Super Star', 'Transtec'], minPrice: 200, maxPrice: 2500,
          images: [
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1540932239986-30128078f3b5?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1517991104123-1d56a7295ec2?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          type: 'Bag', brands: ['Apex', 'Bata', 'Gucci', 'Prada', 'Nike'], minPrice: 1000, maxPrice: 8000,
          images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          type: 'Watch', brands: ['Casio', 'Rolex', 'Seiko', 'Fossil', 'Titan'], minPrice: 2000, maxPrice: 50000,
          images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1508057198693-8c5e23661603?auto=format&fit=crop&q=80&w=400'
          ]
        }
      ];

      const dummyCount = Math.max(0, 60 - fetched.length);
      if (dummyCount > 0) {
        const dummies = Array.from({ length: dummyCount }).map((_, i) => {
          const category = productDefinitions[i % productDefinitions.length];
          const brand = category.brands[i % category.brands.length];
          const model = `${category.type} Series ${((i * 7) % 10) + 1}`;
          const priceOffset = (i * 123) % (category.maxPrice - category.minPrice);
          
          return {
            id: `dummy_${i}`,
            name: `${brand} ${model}`,
            price: category.minPrice + priceOffset,
            description: `Brand new authentic ${brand} ${category.type} with official warranty and full accessories included.`,
            photoUrl: category.images[i % category.images.length]
          };
        });
        fetched = [...fetched, ...dummies];
      }

      setProducts(fetched);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    if (profile.microjobPoints < 20) {
      alert("20 Microjob Points are required to list a product!");
      return;
    }

    setLoading(true);
    await updateDoc(doc(db, 'users', user.uid), {
      microjobPoints: increment(-20)
    });

    await addDoc(collection(db, 'products'), {
      userId: user.uid,
      name,
      price: Number(price),
      description,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
      createdAt: new Date().toISOString()
    });
    setView('list');
    setName(''); setPrice(''); setDescription(''); setPhotoUrl('');
    setLoading(false);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        setView('list');
      }, 3000);
    }, 1000);
  };

  if (view === 'sell') {
    return (
      <div className="h-full bg-slate-50 flex flex-col relative pb-20">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold flex items-center gap-2">Add Your Product</h1>
          <button onClick={() => setView('list')} className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Cancel</button>
        </div>
        <ModuleGuard moduleId="shop" title="Sell on Affiliate Shop">
          <div className="p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="font-bold text-slate-800 text-lg">Product Details</h3>
                <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                  Cost: 20 Points
                </div>
              </div>
              
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wide">Product Name</label>
                  <input required placeholder="E.g. iPhone 14 Pro Max" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wide">Selling Price (BDT)</label>
                  <input required type="number" placeholder="E.g. 50000" value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wide">Photo URL</label>
                  <input type="url" placeholder="https://..." value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wide">Description</label>
                  <textarea placeholder="Tell us about the product..." value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none" />
                </div>
                <button disabled={loading} type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl px-4 py-4 mt-4 active:scale-[0.98] transition-all">
                  {loading ? 'Adding...' : 'Add Product (-20 Points)'}
                </button>
              </form>
            </div>
          </div>
        </ModuleGuard>
      </div>
    );
  }

  if (view === 'detail' && selectedProduct) {
    return (
      <div className="h-full bg-slate-50 flex flex-col relative pb-20 overflow-y-auto">
        <div className="bg-white p-4 sticky top-0 z-10 flex items-center shadow-sm">
          <button onClick={() => setView('list')} className="text-slate-500 font-bold w-10 h-10 flex items-center">&larr; Back</button>
        </div>
        <div className="bg-white border-b border-slate-100 pb-6">
          <div className="aspect-square bg-slate-100 max-h-[350px] w-full relative">
             <SafeImage src={selectedProduct.photoUrl} alt={selectedProduct.name} className="w-full h-full object-contain" />
          </div>
          <div className="px-5 pt-6">
            <h1 className="text-2xl font-bold text-slate-800 leading-tight mb-2">{selectedProduct.name}</h1>
            <div className="text-3xl font-black text-rose-600 mb-4">BDT {selectedProduct.price}</div>
            <p className="text-slate-600 text-sm leading-relaxed">{selectedProduct.description}</p>
          </div>
        </div>
        <div className="p-4 mt-auto">
          <button onClick={() => setView('checkout')} className="w-full bg-slate-900 shadow-xl hover:bg-slate-800 text-white font-bold rounded-2xl px-4 py-4 mt-8 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
            <ShoppingCart size={20} /> Buy Now
          </button>
        </div>
      </div>
    );
  }

  if (view === 'checkout' && selectedProduct) {
    return (
      <div className="h-full bg-slate-50 flex flex-col relative pb-20">
        <div className="bg-white p-4 sticky top-0 z-10 flex items-center shadow-sm border-b border-slate-100">
          <button onClick={() => setView('detail')} className="text-slate-500 font-bold w-10 h-10 flex items-center">&larr; Back</button>
          <span className="font-bold flex-1 text-center pr-10">Checkout</span>
        </div>
        
        {orderPlaced ? (
          <div className="p-8 flex flex-col items-center justify-center text-center mt-20">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
            <p className="text-slate-500 text-sm">Your order for {selectedProduct.name} has been placed successfully.</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
                <SafeImage src={selectedProduct.photoUrl} alt="" className="w-20 h-20 object-cover rounded-xl bg-slate-50" />
                <div>
                  <div className="font-bold text-slate-800">{selectedProduct.name}</div>
                  <div className="text-rose-600 font-bold">BDT {selectedProduct.price}</div>
                  <div className="text-xs text-slate-500 mt-1">Qty: 1</div>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 mb-4">Delivery Details</h3>
              <form onSubmit={submitOrder} className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Full Name & Address</label>
                  <textarea required value={orderAddress} onChange={e=>setOrderAddress(e.target.value)} rows={3} placeholder="Please provide your detailed delivery address..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Phone Number</label>
                  <input required type="tel" value={orderPhone} onChange={e=>setOrderPhone(e.target.value)} placeholder="01XXX-XXXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-bold rounded-xl px-4 py-4 mt-6 active:scale-[0.98] flex items-center justify-center gap-2">
                  {loading ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 relative pb-20 overflow-y-auto">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 pt-4 pb-3 sticky top-0 z-10 shadow-md">
        <div className="flex justify-between items-center mb-3">
           <div className="text-white font-black text-xl flex items-center gap-1">
             <ShoppingCart size={22}/> UNITY SHOP
           </div>
           <button onClick={() => setView('sell')} className="text-[11px] font-bold bg-white text-orange-600 px-4 py-1.5 rounded-full shadow-sm">
              Sell / List Product
           </button>
        </div>
        <div className="bg-white rounded-lg flex items-center px-3 py-2 shadow-inner">
           <Search size={16} className="text-slate-400" />
           <input type="text" placeholder="Search in Shop..." className="bg-transparent border-none outline-none text-sm w-full ml-2 text-slate-700" />
        </div>
      </div>

      <div className="bg-white p-4 mb-2">
          <div className="w-full h-28 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-xl mb-4 flex flex-col items-center justify-center text-white font-bold shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-black/10"></div>
             <span className="text-2xl drop-shadow-md z-10">MEGA SALE</span>
             <span className="text-[10px] uppercase font-semibold tracking-widest z-10 opacity-90 mt-1">Up to 50% Off</span>
          </div>

          <div className="flex overflow-x-auto gap-5 hide-scrollbar py-1">
              {['Phones', 'Laptops', 'Fashion', 'Gadgets', 'Home', 'Beauty'].map((cat, i) => (
                 <div key={cat} className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-lg shadow-sm border border-orange-100">
                       {cat.substring(0,1)}
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold">{cat}</span>
                 </div>
              ))}
          </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between bg-slate-100">
         <h3 className="font-bold text-slate-800 text-lg">Just For You</h3>
      </div>

      <div className="px-3 pb-8 grid grid-cols-2 gap-2">
        {products.length === 0 && <p className="col-span-2 text-center text-slate-400 py-10">No products yet.</p>}
        {products.map(p => (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} key={p.id} onClick={() => { setSelectedProduct(p); setView('detail'); }} className="bg-white rounded-md shadow-sm border border-slate-100/50 overflow-hidden flex flex-col relative group cursor-pointer active:scale-95 transition-transform">
            <div className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 z-10 shadow-sm">
               -20%
            </div>
            <div className="aspect-square bg-slate-50 relative p-2">
              <SafeImage src={p.photoUrl} alt={p.name} className="w-full h-full object-cover rounded-sm" />
            </div>
            <div className="p-2 bg-white flex-1 flex flex-col justify-between">
              <h4 className="text-slate-800 text-xs leading-snug line-clamp-2 mb-1">{p.name}</h4>
              <div>
                <div className="text-orange-500 font-bold text-sm">BDT {p.price}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex text-amber-400">
                    <Star size={8} fill="currentColor" />
                    <Star size={8} fill="currentColor" />
                    <Star size={8} fill="currentColor" />
                    <Star size={8} fill="currentColor" />
                    <Star size={8} fill="currentColor" />
                  </div>
                  <span className="text-[9px] text-slate-400">(45)</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
