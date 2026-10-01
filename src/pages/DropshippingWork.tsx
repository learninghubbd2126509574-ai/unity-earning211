import React, { useState } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Package, Truck, DollarSign, CheckCircle2, ShoppingBag, Sparkles, TrendingUp, Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const DROPSHIP_PRODUCTS = [
  {
    id: 'ds_1',
    name: 'Wireless Noise-Cancelling Earbuds Pro',
    category: 'Audio & Gadgets',
    wholesalePrice: 850,
    retailPrice: 1250,
    profit: 400,
    ordersPending: 2,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'ds_2',
    name: 'Ultra-Slim Fitness Smartwatch & Tracker',
    category: 'Wearables',
    wholesalePrice: 1200,
    retailPrice: 1800,
    profit: 600,
    ordersPending: 1,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'ds_3',
    name: 'Magnetic Fast Wireless Car Charger',
    category: 'Automotive Accessories',
    wholesalePrice: 500,
    retailPrice: 850,
    profit: 350,
    ordersPending: 3,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=300'
  }
];

export const DropshippingWork: React.FC = () => {
  return (
    <ModuleGuard moduleId="dropshipping" title="Dropshipping Business">
      <DropshippingApp />
    </ModuleGuard>
  );
};

const DropshippingApp: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState(DROPSHIP_PRODUCTS);
  const [totalProfitEarned, setTotalProfitEarned] = useState(0);
  const [fulfilledCount, setFulfilledCount] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleFulfillOrder = async (product: typeof DROPSHIP_PRODUCTS[0]) => {
    if (!user || processingId || product.ordersPending <= 0) return;
    setProcessingId(product.id);

    try {
      // Add profit margin (e.g. BDT 2.00 reward credit per dropship fulfillment action)
      const commissionCredit = 2.00;
      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(commissionCredit)
      });

      setTotalProfitEarned(prev => prev + commissionCredit);
      setFulfilledCount(prev => prev + 1);

      // Decrement pending orders for this product
      setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
          return { ...p, ordersPending: Math.max(0, p.ordersPending - 1) };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4 pb-24 h-full overflow-y-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-lime-700 to-emerald-800 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 text-lime-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={16} /> Wholesale E-Commerce Engine
        </div>
        <h1 className="text-xl font-bold">Dropshipping Hub</h1>
        <p className="text-xs text-lime-100 mt-1 leading-relaxed">
          Process verified retail customer shipments through direct wholesale fulfillment suppliers.
        </p>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-lime-600/50">
          <div>
            <div className="text-[10px] text-lime-200 uppercase font-bold">Orders Processed</div>
            <div className="text-lg font-mono font-bold">{fulfilledCount} Orders</div>
          </div>
          <div className="w-px h-8 bg-lime-600/50"></div>
          <div>
            <div className="text-[10px] text-lime-200 uppercase font-bold">Commission Earned</div>
            <div className="text-lg font-mono font-bold text-amber-300">BDT {totalProfitEarned.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Orders Queue Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Package size={16} className="text-lime-700" /> Pending Wholesale Orders
          </h3>
          <span className="text-[11px] font-bold text-lime-700 bg-lime-50 px-2.5 py-0.5 rounded-full">
            Active Catalog
          </span>
        </div>

        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-4">
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-100 bg-slate-50 shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">{p.category}</div>
                  <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{p.name}</h4>
                  
                  <div className="flex items-center gap-3 text-xs mt-1 font-mono">
                    <span className="text-slate-500">Retail: BDT {p.retailPrice}</span>
                    <span className="text-emerald-600 font-bold">Profit Margin: BDT {p.profit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-600">
                    Pending Orders: <span className="font-bold text-orange-600">{p.ordersPending}</span>
                  </div>

                  <button
                    onClick={() => handleFulfillOrder(p)}
                    disabled={p.ordersPending === 0 || processingId === p.id}
                    className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Truck size={14} />
                    {processingId === p.id ? 'Dispatching...' : p.ordersPending === 0 ? 'All Dispatched' : 'Fulfill (+BDT 2.00)'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
