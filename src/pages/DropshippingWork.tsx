import React, { useState } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Package, Truck } from 'lucide-react';
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
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleFulfillOrder = async (product: typeof DROPSHIP_PRODUCTS[0]) => {
    if (!user || processingId || product.ordersPending <= 0) return;
    setProcessingId(product.id);

    try {
      const commissionCredit = 2.00;
      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(commissionCredit)
      });

      setTotalProfitEarned(prev => prev + commissionCredit);
      setFulfilledCount(prev => prev + 1);

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
    <div className="min-h-full bg-[#F4F5F7] p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70]">
          <div className="text-[11px] font-medium text-white/80 mb-1">
            Wholesale E-Commerce Engine
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Dropshipping Hub</h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Process verified retail customer shipments through direct wholesale fulfillment suppliers.
          </p>

          <div className="flex items-center gap-6 mt-4 pt-3.5 border-t border-white/15">
            <div>
              <div className="text-[11px] text-white/75 font-medium">Orders Processed</div>
              <div className="text-base font-mono tabular-nums font-semibold mt-0.5">{fulfilledCount} Orders</div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <div className="text-[11px] text-white/75 font-medium">Commission Earned</div>
              <div className="text-base font-mono tabular-nums font-semibold mt-0.5">BDT {totalProfitEarned.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Orders Queue Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#111827] text-sm flex items-center gap-2">
              <Package size={16} className="text-[#0A4D8C]" />
              <span>Pending Wholesale Orders</span>
            </h3>
            <span className="text-[11px] font-medium text-[#0A4D8C]">Active Catalog</span>
          </div>

          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-slate-200/90 flex flex-col sm:flex-row gap-4">
                {failedImages[p.id] ? (
                  <div className="w-20 h-20 rounded-lg border border-slate-200 bg-[#F8FAFC] text-slate-400 flex items-center justify-center shrink-0">
                    <Package size={24} />
                  </div>
                ) : (
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    onError={() => setFailedImages(prev => ({ ...prev, [p.id]: true }))}
                    className="w-20 h-20 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500">{p.category}</div>
                    <h4 className="text-sm font-semibold text-[#111827] truncate mt-0.5">{p.name}</h4>
                    
                    <div className="flex items-center gap-3 text-xs mt-1 font-mono tabular-nums">
                      <span className="text-slate-500">Retail: BDT {p.retailPrice}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[#0D7A5F] font-semibold">Margin: BDT {p.profit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-xs font-medium text-slate-600">
                      Pending: <span className="font-semibold font-mono tabular-nums text-[#B47B00]">{p.ordersPending}</span>
                    </div>

                    <button
                      onClick={() => handleFulfillOrder(p)}
                      disabled={p.ordersPending === 0 || processingId === p.id}
                      className="bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Truck size={14} />
                      <span>
                        {processingId === p.id ? 'Dispatching...' : p.ordersPending === 0 ? 'All Dispatched' : 'Fulfill (+BDT 2.00)'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

