import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { AFFILIATE_PRODUCTS, ShopProduct } from '../data/shopProducts';
import {
  Store,
  ShoppingBag,
  Search,
  Star,
  Link as LinkIcon,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
  Hash,
  Tag,
  KeyRound,
  FileText,
  MapPin,
  Phone,
  User,
  Wallet
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Shop: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'catalog' | 'links'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [linksSearchQuery, setLinksSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Student ID Link Generation State
  const [studentIdInput, setStudentIdInput] = useState(profile?.studentIdCode || '');
  const [activeStudentId, setActiveStudentId] = useState(profile?.studentIdCode || '');
  const [linkGenError, setLinkGenError] = useState('');
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);

  // Sync student ID once profile loads if user hasn't typed one yet
  useEffect(() => {
    if (profile?.studentIdCode && !studentIdInput) {
      setStudentIdInput(profile.studentIdCode);
    }
  }, [profile?.studentIdCode]);

  // Product Detail Modal state
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedProductId, setCopiedProductId] = useState<string | null>(null);

  // Affiliate Sell & Order Form Modal
  const [sellModalProduct, setSellModalProduct] = useState<ShopProduct | null>(null);
  const [sellStep, setSellStep] = useState<'create_link' | 'order_form' | 'success'>('create_link');

  // Seller Info
  const [modalStudentId, setModalStudentId] = useState(profile?.studentIdCode || '');
  const [sellerName, setSellerName] = useState(profile?.fullName || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  // Client Order Submission Form Details
  const [customerName, setCustomerName] = useState('');
  const [orderDetails, setOrderDetails] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderAmount, setOrderAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [payoutNumber, setPayoutNumber] = useState(profile?.whatsappNumber || '');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [formError, setFormError] = useState('');

  const buildProductUrl = (productId: string, refId?: string) => {
    const basePath = location.pathname.includes('affiliate') ? '/affiliate' : '/shop';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const cleanRef = (refId || '').trim();
    return cleanRef
      ? `${origin}${basePath}?product=${productId}&ref=${encodeURIComponent(cleanRef)}`
      : `${origin}${basePath}?product=${productId}`;
  };

  useEffect(() => {
    const productParam = searchParams.get('product') || searchParams.get('pid');
    if (productParam) {
      const found = AFFILIATE_PRODUCTS.find((item) => item.id === productParam);
      if (found) {
        setSelectedProduct(found);
        setActiveImageIndex(0);
      }
    }
  }, [searchParams]);

  const openProductDirectly = (product: ShopProduct) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setSearchParams({ product: product.id });
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    if (searchParams.has('product') || searchParams.has('pid')) {
      setSearchParams({});
    }
  };

  const handleCreateAllLinks = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = studentIdInput.replace(/\s+/g, '').trim();
    if (!cleanId || cleanId.length < 5) {
      setLinkGenError('Enter your valid Student ID number (e.g. 7-digit ID) to generate product links.');
      return;
    }
    setLinkGenError('');
    setActiveStudentId(cleanId);
    setModalStudentId(cleanId);
  };

  const handleCopyProductLink = (e: React.MouseEvent, product: ShopProduct, customRef?: string) => {
    e.stopPropagation();
    const refToUse = customRef || activeStudentId || studentIdInput;
    if (!refToUse.trim()) {
      setActiveTab('links');
      setLinkGenError('Enter your Student ID number first to create and copy your affiliate link.');
      return;
    }
    const url = buildProductUrl(product.id, refToUse);
    navigator.clipboard.writeText(url);
    setCopiedProductId(product.id);
    setTimeout(() => setCopiedProductId(null), 2000);
  };

  const handleCopyAllLinks = () => {
    if (!activeStudentId) return;
    const allText = AFFILIATE_PRODUCTS.map(
      (p, idx) =>
        `${idx + 1}. ${p.title} (${p.id.toUpperCase()}) — Price: ৳${p.price} | Comm: ৳${p.commission}\nLink: ${buildProductUrl(p.id, activeStudentId)}\nImage: ${p.images[0]}`
    ).join('\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedAllLinks(true);
    setTimeout(() => setCopiedAllLinks(false), 2500);
  };

  const filteredProducts = AFFILIATE_PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const filteredLinksProducts = AFFILIATE_PRODUCTS.filter((p) => {
    const q = linksSearchQuery.toLowerCase().trim();
    return (
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleStartSell = (product: ShopProduct) => {
    const initialId = activeStudentId || studentIdInput || profile?.studentIdCode || '';
    setSellModalProduct(product);
    setModalStudentId(initialId);
    setSellerName(profile?.fullName || '');
    setPayoutNumber(profile?.whatsappNumber || '');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setOrderDetails(`${product.title} (${product.id.toUpperCase()}) — Qty: 1`);
    setOrderAmount(String(product.price));
    setFormError('');

    if (activeStudentId) {
      setGeneratedLink(buildProductUrl(product.id, activeStudentId));
      setSellStep('order_form');
    } else {
      setGeneratedLink('');
      setSellStep('create_link');
    }
  };

  const handleCreateModalLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = modalStudentId.replace(/\s+/g, '').trim();
    if (!cleanId || cleanId.length < 5) {
      setFormError('Please enter your Student ID number to create your product link.');
      return;
    }
    if (!sellerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    setFormError('');
    setActiveStudentId(cleanId);
    setStudentIdInput(cleanId);
    const link = buildProductUrl(sellModalProduct?.id || 'prod_01', cleanId);
    setGeneratedLink(link);
    setSellStep('order_form');
  };

  const handleCopyModalLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmitOrderReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanStudentId = modalStudentId.replace(/\s+/g, '').trim() || activeStudentId;
    if (!cleanStudentId || cleanStudentId.length < 5) {
      setFormError('Valid Student ID number is required.');
      return;
    }
    if (!customerName.trim() || !orderDetails.trim() || !customerAddress.trim() || !customerPhone.trim()) {
      setFormError('Please fill in Client Name, Order Details, Home Address, and Phone Number.');
      return;
    }
    const numericAmount = Number(orderAmount);
    if (!orderAmount.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter a valid Order Amount in BDT.');
      return;
    }
    if (!payoutNumber.trim() || payoutNumber.length < 11) {
      setFormError('Enter a valid 11-digit bKash or Nagad number for commission payout.');
      return;
    }
    if (!user?.uid) {
      setFormError('Please sign in first to submit an affiliate order.');
      return;
    }

    setSubmittingOrder(true);
    setFormError('');

    try {
      const finalLink = generatedLink || buildProductUrl(sellModalProduct?.id || 'prod_01', cleanStudentId);

      await addDoc(collection(db, 'affiliateSubmissions'), {
        userId: user.uid,
        studentIdCode: cleanStudentId,
        sellerName: sellerName.trim() || profile?.fullName || 'Affiliate Member',
        sellerPhone: profile?.whatsappNumber || 'N/A',
        productId: sellModalProduct?.id || '',
        productTitle: sellModalProduct?.title || '',
        productImage: sellModalProduct?.images?.[0] || '',
        productPrice: sellModalProduct?.price || numericAmount,
        orderAmount: numericAmount,
        orderDetails: orderDetails.trim(),
        commissionAmount: sellModalProduct?.commission || 150,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        payoutMethod,
        payoutNumber: payoutNumber.trim(),
        affiliateLink: finalLink,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      setSellStep('success');
    } catch (err: any) {
      console.error(err);
      setFormError('Order submission failed: ' + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 font-sans text-[#1E2329] bg-[#F4F5F7]">
      {/* Formal Store Header */}
      <div className="bg-[#0A4D8C] rounded-xl p-4 sm:p-5 text-white shadow-xs space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/80">
              <Store size={13} />
              <span>Unity Earning Affiliate Marketing</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white truncate mt-0.5">
              Affiliate Product Hub & Order Center
            </h1>
            <p className="text-xs text-white/80">
              Create your Student ID product links, share with product photos, and submit client orders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'catalog' ? 'links' : 'catalog')}
            className="bg-white hover:bg-slate-100 text-[#0A4D8C] text-xs font-semibold px-3.5 py-2 rounded-lg transition shrink-0 cursor-pointer whitespace-nowrap"
          >
            {activeTab === 'catalog' ? 'All Product Links' : 'Storefront'}
          </button>
        </div>

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-lg py-2 px-2">
            <div className="text-xs sm:text-sm font-semibold text-white tabular-nums">{AFFILIATE_PRODUCTS.length}</div>
            <div className="text-[10.5px] text-white/75">All Products</div>
          </div>
          <div className="bg-white/10 rounded-lg py-2 px-2">
            <div className="text-xs sm:text-sm font-semibold text-white tabular-nums">৳150–৳200</div>
            <div className="text-[10.5px] text-white/75">Per Sale Comm.</div>
          </div>
          <div className="bg-white/10 rounded-lg py-2 px-2">
            <div className="text-xs sm:text-sm font-semibold text-white font-mono tabular-nums truncate">
              {activeStudentId || 'Not Set'}
            </div>
            <div className="text-[10.5px] text-white/75">Active Student ID</div>
          </div>
        </div>
      </div>

      {/* Segmented Navigation */}
      <div className="grid grid-cols-2 bg-white p-1 rounded-xl border border-slate-200/90 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`py-2.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'bg-[#0A4D8C] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag size={14} />
          <span>Product Storefront ({AFFILIATE_PRODUCTS.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`py-2.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'links'
              ? 'bg-[#0A4D8C] text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LinkIcon size={14} />
          <span>All Product Links ({AFFILIATE_PRODUCTS.length})</span>
        </button>
      </div>

      {/* VIEW 1: CATALOG GRID */}
      {activeTab === 'catalog' && (
        <div className="space-y-3">
          {/* Quick Student ID Reminder Strip */}
          {!activeStudentId && (
            <div className="bg-[#EEF5FC] border border-[#D4E4F7] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-[#0A4D8C] font-medium">
                <KeyRound size={15} className="shrink-0" />
                <span>Enter your Student ID in "All Product Links" to create & copy personalized links for every product.</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('links')}
                className="bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
              >
                Create Links Now
              </button>
            </div>
          )}

          {/* Search & Category Filter */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name or ID..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {['All', 'Gadgets', 'Audio', 'Fashion', 'Home', 'Lifestyle', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0A4D8C] text-white font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Uniform App-Store Frame Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredProducts.map((p) => {
              const directUrl = buildProductUrl(p.id, activeStudentId);
              return (
                <div
                  key={p.id}
                  onClick={() => openProductDirectly(p)}
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-[#0A4D8C]/40 transition flex flex-col cursor-pointer group"
                >
                  {/* Uniform Square Frame */}
                  <div className="relative w-full aspect-square bg-[#F8FAFC] overflow-hidden shrink-0">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded tabular-nums">
                      {p.id.toUpperCase()}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-900/75 text-white text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 tabular-nums">
                      <ImageIcon size={9} /> {p.images.length}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight h-[32px] group-hover:text-[#0A4D8C] transition-colors">
                        {p.title}
                      </h3>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-0.5 text-slate-600 font-medium tabular-nums">
                          <Star size={10} className="fill-amber-400 stroke-amber-400" />
                          {p.rating}
                        </span>
                        <span className="text-[#0D7A5F] font-semibold tabular-nums">
                          +৳{p.commission} comm.
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">৳{p.price}</span>
                        <span className="text-[10.5px] text-slate-400 line-through font-mono tabular-nums">৳{p.originalPrice}</span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        <a
                          href={directUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openProductDirectly(p);
                          }}
                          title={`Open ${p.id.toUpperCase()}`}
                          className="col-span-2 bg-[#F4F5F7] hover:bg-slate-200 text-slate-700 text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
                        >
                          <ExternalLink size={10} />
                          <span>View</span>
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartSell(p);
                          }}
                          className="col-span-3 bg-[#0A4D8C] hover:bg-[#083D70] text-white text-[11px] font-semibold py-1.5 rounded-lg transition flex items-center justify-center cursor-pointer"
                        >
                          Sell Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: STUDENT ID LINK GENERATOR + ALL PRODUCT LINKS DIRECTORY */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          {/* Form 1: Student ID Input to Generate Product Links */}
          <form
            onSubmit={handleCreateAllLinks}
            className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 space-y-3.5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-[#1E2329] flex items-center gap-2">
                  <KeyRound size={16} className="text-[#0A4D8C]" />
                  <span>Step 1: Enter Student ID to Create Product Links</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার স্টুডেন্ট আইডি নাম্বার দিয়ে সব প্রোডাক্টের অ্যাফিলিয়েট লিংক তৈরি করুন এবং কপি করে সংরক্ষণ করুন।
                </p>
              </div>
              {activeStudentId && (
                <span className="bg-emerald-50 text-[#0D7A5F] border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold shrink-0">
                  ID: {activeStudentId}
                </span>
              )}
            </div>

            {linkGenError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{linkGenError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  placeholder="Enter 7-digit Student ID (e.g. 4829105)"
                  className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg pl-9 pr-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <LinkIcon size={14} />
                <span>{activeStudentId ? 'Update Product Links' : 'Create Product Links'}</span>
              </button>
            </div>
          </form>

          {/* Form 2 / Directory: All Generated Product Links + Copy & Photo Sell */}
          {!activeStudentId ? (
            <div className="bg-white rounded-xl border border-slate-200/90 p-8 text-center space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center mx-auto border border-[#D4E4F7]">
                <LinkIcon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No Product Links Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Enter your Student ID number in the form above and click "Create Product Links" to unlock all {AFFILIATE_PRODUCTS.length} product links with photos.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-semibold text-[#1E2329] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#0D7A5F]" />
                    <span>All Product Links Directory ({filteredLinksProducts.length} Items)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Copy any product link below to save it, use the product image to promote, and click "Order Now" to sell.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAllLinks}
                  className="bg-[#0D7A5F] hover:bg-[#0A634C] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedAllLinks ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedAllLinks ? 'All 52 Links Copied' : 'Copy All Product Links'}</span>
                </button>
              </div>

              {/* Filter inside All Product Links */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={linksSearchQuery}
                  onChange={(e) => setLinksSearchQuery(e.target.value)}
                  placeholder="Filter generated links by product name, ID or category..."
                  className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                />
              </div>

              <div className="space-y-3">
                {filteredLinksProducts.map((p) => {
                  const directUrl = buildProductUrl(p.id, activeStudentId);
                  const isCopied = copiedProductId === p.id;

                  return (
                    <div
                      key={p.id}
                      className="bg-[#F8FAFC] rounded-xl border border-slate-200/90 p-3.5 space-y-3"
                    >
                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => openProductDirectly(p)}
                          className="relative w-18 h-18 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200 cursor-pointer"
                          title="Click to inspect product photos"
                        >
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-slate-900/75 text-white text-[9px] px-1 rounded font-mono tabular-nums">
                            {p.images.length}p
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#0A4D8C]">
                              <Hash size={11} />
                              {p.id.toUpperCase()} · Ref: {activeStudentId}
                            </span>
                            <span className="font-semibold text-[#0D7A5F] tabular-nums">
                              Comm: ৳{p.commission}
                            </span>
                          </div>

                          <h3
                            onClick={() => openProductDirectly(p)}
                            className="text-xs font-semibold text-slate-900 line-clamp-1 cursor-pointer hover:text-[#0A4D8C] transition"
                          >
                            {p.title}
                          </h3>

                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">৳{p.price}</span>
                              <span className="text-[11px] text-slate-400 line-through font-mono tabular-nums">৳{p.originalPrice}</span>
                            </div>
                            <span className="text-[11px] text-slate-500">{p.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Created Product Link Strip */}
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                        <a
                          href={directUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            openProductDirectly(p);
                          }}
                          className="flex items-center gap-1.5 text-[11px] font-mono text-[#0A4D8C] hover:underline truncate min-w-0 flex-1"
                        >
                          <LinkIcon size={11} className="shrink-0" />
                          <span className="truncate">{directUrl}</span>
                        </a>
                        <button
                          type="button"
                          onClick={(e) => handleCopyProductLink(e, p, activeStudentId)}
                          className="px-2.5 py-1 rounded-md bg-[#EEF5FC] border border-[#D4E4F7] hover:bg-blue-100 text-[11px] font-semibold text-[#0A4D8C] flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {isCopied ? <Check size={11} className="text-[#0D7A5F]" /> : <Copy size={11} />}
                          <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                        </button>
                      </div>

                      {/* Image & Sell Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openProductDirectly(p)}
                          className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-medium py-2 rounded-lg border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ImageIcon size={12} className="text-[#0A4D8C]" /> View Images ({p.images.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartSell(p)}
                          className="bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={12} /> Order Now / Sell
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: DIRECT PRODUCT PAGE VIEW */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-[440px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center shrink-0 bg-white">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-[#0A4D8C] shrink-0">
                    {selectedProduct.id.toUpperCase()}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-semibold text-slate-900 truncate">{selectedProduct.title}</span>
                </div>
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="w-7 h-7 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-4 overflow-y-auto space-y-4">
                {/* Uniform App-Store Square Gallery */}
                <div className="space-y-2.5">
                  <div className="w-full max-w-[280px] mx-auto aspect-square bg-[#F8FAFC] rounded-xl overflow-hidden border border-slate-200 relative">
                    <img
                      src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-slate-900/75 text-white text-[10px] font-mono px-2 py-0.5 rounded tabular-nums">
                      {activeImageIndex + 1} / {selectedProduct.images.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#0A4D8C]'
                            : 'border-slate-200 opacity-65 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Identity & Direct Link Box */}
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Tag size={12} className="text-[#0A4D8C]" />
                      Product ID: <strong className="font-mono text-slate-900">{selectedProduct.id.toUpperCase()}</strong>
                    </span>
                    <span className="text-[#0D7A5F] font-semibold">Stock: {selectedProduct.stock}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                    <LinkIcon size={12} className="text-[#0A4D8C] shrink-0" />
                    <span className="text-[11px] font-mono text-[#0A4D8C] truncate flex-1">
                      {buildProductUrl(selectedProduct.id, activeStudentId || studentIdInput)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyProductLink(e, selectedProduct)}
                      className="text-[11px] font-semibold bg-[#0A4D8C] text-white px-2.5 py-1 rounded cursor-pointer shrink-0"
                    >
                      {copiedProductId === selectedProduct.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Price & Commission */}
                <div className="flex items-center justify-between bg-[#0A4D8C] text-white p-3.5 rounded-xl">
                  <div>
                    <span className="text-[10.5px] text-white/75 block">Product Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold font-mono tabular-nums">৳{selectedProduct.price}</span>
                      <span className="text-xs text-white/60 line-through font-mono tabular-nums">৳{selectedProduct.originalPrice}</span>
                    </div>
                  </div>
                  <div className="bg-white/15 px-3 py-1.5 rounded-lg text-right">
                    <span className="text-[10px] text-white/80 block">Commission</span>
                    <span className="text-sm font-semibold font-mono tabular-nums">+৳{selectedProduct.commission}</span>
                  </div>
                </div>

                {/* Concise Details */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                    {selectedProduct.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                        <CheckCircle2 size={12} className="text-[#0D7A5F] shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3.5 bg-[#F8FAFC] border-t border-slate-200 flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="px-4 bg-white hover:bg-slate-100 text-slate-700 font-medium py-2.5 rounded-lg border border-slate-200 text-xs transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const p = selectedProduct;
                    closeProductModal();
                    handleStartSell(p);
                  }}
                  className="flex-1 bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg text-xs transition cursor-pointer"
                >
                  Sell / Order Now (+৳{selectedProduct.commission})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: STUDENT ID LINK CREATION + PRODUCT SELLING ("ORDER NOW") FORM */}
      <AnimatePresence>
        {sellModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-[480px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center shrink-0 bg-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={sellModalProduct.images[0]}
                    alt={sellModalProduct.title}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900">
                      Sell Product · {sellModalProduct.id.toUpperCase()}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">{sellModalProduct.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSellModalProduct(null)}
                  className="w-7 h-7 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
                {formError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* STEP 1: ENTER STUDENT ID TO CREATE PRODUCT LINK */}
                {sellStep === 'create_link' && (
                  <form onSubmit={handleCreateModalLink} className="space-y-3.5">
                    <div className="bg-[#EEF5FC] border border-[#D4E4F7] rounded-lg p-3 text-xs text-[#0A4D8C] flex items-center gap-2 font-semibold">
                      <ShieldCheck size={16} className="shrink-0" />
                      <span>Step 1: Enter Student ID to Create Product Link</span>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                      <img
                        src={sellModalProduct.images[0]}
                        alt={sellModalProduct.title}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-xs space-y-0.5">
                        <div className="font-semibold text-slate-900 truncate">{sellModalProduct.title}</div>
                        <div className="text-slate-500">
                          Price: <strong className="font-mono text-slate-900">৳{sellModalProduct.price}</strong> · Commission:{' '}
                          <strong className="font-mono text-[#0D7A5F]">+৳{sellModalProduct.commission}</strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Student ID Number *
                      </label>
                      <div className="relative">
                        <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={modalStudentId}
                          onChange={(e) => setModalStudentId(e.target.value)}
                          placeholder="Enter 7-digit Student ID (e.g. 4829105)"
                          className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Your Name (Affiliate Seller) *
                      </label>
                      <input
                        type="text"
                        required
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Create Product Link & Continue to Order Form</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* STEP 2: PRODUCT SELLING / CLIENT ORDER FORM ("ORDER NOW") */}
                {sellStep === 'order_form' && (
                  <form onSubmit={handleSubmitOrderReport} className="space-y-3">
                    {/* Generated Link + Product Photo Card */}
                    <div className="bg-[#EEF5FC] border border-[#D4E4F7] rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#0A4D8C] flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-[#0D7A5F]" />
                          Link Created (Student ID: {modalStudentId || activeStudentId})
                        </span>
                        <button
                          type="button"
                          onClick={() => setSellStep('create_link')}
                          className="text-[11px] text-[#0A4D8C] hover:underline font-medium cursor-pointer"
                        >
                          Change ID
                        </button>
                      </div>

                      <div className="flex gap-1.5">
                        <div className="flex-1 bg-white border border-[#D4E4F7] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-[#0A4D8C] truncate">
                          {generatedLink}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyModalLink}
                          className="bg-[#0A4D8C] hover:bg-[#083D70] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-semibold text-slate-900">
                        Client Order & Product Selling Form
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        ক্লায়েন্টের নাম, প্রোডাক্ট ডিটেইলস, বাসার ঠিকানা, ফোন নম্বর এবং অর্ডার অ্যামাউন্ট লিখে Order Now বাটনে ক্লিক করুন।
                      </p>
                    </div>

                    {/* Client Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1">
                          <User size={11} className="text-slate-400" />
                          <span>Client Name (ক্লায়েন্টের নাম) *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Client full name"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1">
                          <Phone size={11} className="text-slate-400" />
                          <span>Phone Number (ফোন নাম্বার) *</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                        />
                      </div>
                    </div>

                    {/* Order / Product Details */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <FileText size={11} className="text-slate-400" />
                        <span>Product & Order Details (ডিটেইলস) *</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={orderDetails}
                        onChange={(e) => setOrderDetails(e.target.value)}
                        placeholder="Product name, quantity, color/size, or buyer instructions..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] resize-none"
                      />
                    </div>

                    {/* Home Address */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        <span>Home Address (বাসার ঠিকানা) *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="House, Road, Area, Thana, District"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                      />
                    </div>

                    {/* Order Amount (BDT) */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <DollarSign size={11} className="text-slate-400" />
                        <span>Order Amount in BDT (কত টাকার অ্যামাউন্ট) *</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={orderAmount}
                        onChange={(e) => setOrderAmount(e.target.value)}
                        placeholder="e.g. 990"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                      />
                    </div>

                    {/* Commission Wallet Info */}
                    <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Wallet size={12} className="text-[#0A4D8C]" />
                          Your Commission Wallet (+৳{sellModalProduct.commission})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {(['bKash', 'Nagad'] as const).map((method) => (
                          <label
                            key={method}
                            className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer text-xs transition ${
                              payoutMethod === method
                                ? 'bg-[#0A4D8C] border-[#0A4D8C] text-white font-semibold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payoutMethod"
                              checked={payoutMethod === method}
                              onChange={() => setPayoutMethod(method)}
                              className="hidden"
                            />
                            <span>{method}</span>
                          </label>
                        ))}
                      </div>

                      <input
                        type="tel"
                        required
                        value={payoutNumber}
                        onChange={(e) => setPayoutNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder={`Your 11-digit ${payoutMethod} number`}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingOrder}
                      className="w-full bg-[#0D7A5F] hover:bg-[#0A634C] text-white font-semibold py-3 rounded-lg transition text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingBag size={14} />
                      <span>
                        {submittingOrder
                          ? 'Placing Order...'
                          : `Order Now · ৳${orderAmount || sellModalProduct.price} (Comm: +৳${sellModalProduct.commission})`}
                      </span>
                    </button>
                  </form>
                )}

                {/* STEP 3: SUCCESS */}
                {sellStep === 'success' && (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-11 h-11 bg-emerald-50 border border-emerald-200 text-[#0D7A5F] rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Order Placed Successfully!</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Client order for <strong>{customerName}</strong> (৳{orderAmount}) has been submitted under Student ID{' '}
                        <strong className="font-mono">{modalStudentId || activeStudentId}</strong>. ৳{sellModalProduct.commission}{' '}
                        commission is pending review for {payoutMethod} ({payoutNumber}).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSellModalProduct(null)}
                      className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg transition text-xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
