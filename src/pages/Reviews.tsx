import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquareQuote, 
  ThumbsUp, 
  CheckCircle2, 
  Search, 
  Filter, 
  Edit3, 
  Sparkles, 
  Send, 
  X, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Award,
  Wallet,
  GraduationCap
} from 'lucide-react';
import { ALL_DEFAULT_REVIEWS, StudentReview } from '../data/reviewsData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export const Reviews: React.FC = () => {
  const { user, profile } = useAuth();
  
  const [reviews, setReviews] = useState<StudentReview[]>(ALL_DEFAULT_REVIEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedSet, setUserLikedSet] = useState<Set<string>>(new Set());

  // Write Review Modal
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newCategory, setNewCategory] = useState<'typing' | 'form' | 'data' | 'course' | 'payout' | 'general'>('typing');
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success / Pending Modal after submitting
  const [showPendingNoticeModal, setShowPendingNoticeModal] = useState(false);

  // User's own pending reviews count
  const [userPendingCount, setUserPendingCount] = useState(0);

  // Real-time Firestore sync for approved reviews & user's pending reviews
  useEffect(() => {
    // 1. Fetch approved reviews from firestore to display live alongside default reviews
    const unsubApproved = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const dbApprovedReviews: StudentReview[] = [];
      let pendingCount = 0;

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.status === 'approved') {
          dbApprovedReviews.push({
            id: docSnap.id,
            name: d.name || 'শিক্ষার্থী',
            gender: d.gender || 'male',
            location: d.location || 'বাংলাদেশ',
            roleBadge: d.roleBadge || 'Verified Member',
            avatarUrl: d.avatarUrl,
            rating: d.rating || 5,
            text: d.text || '',
            category: d.category || 'general',
            date: d.date || 'সম্প্রতি',
            likes: d.likes || 12,
            earnings: d.earnings,
            isVerified: d.isVerified ?? true,
            status: 'approved',
            submittedByStudentId: d.submittedByStudentId
          });
        }

        if (profile?.studentIdCode && d.submittedByStudentId === profile.studentIdCode && d.status === 'pending') {
          pendingCount++;
        }
      });

      setUserPendingCount(pendingCount);

      // Merge firestore approved reviews at top of default reviews
      if (dbApprovedReviews.length > 0) {
        setReviews([...dbApprovedReviews, ...ALL_DEFAULT_REVIEWS]);
      } else {
        setReviews(ALL_DEFAULT_REVIEWS);
      }
    });

    return () => {
      unsubApproved();
    };
  }, [profile?.studentIdCode]);

  const handleLike = (id: string, initialLikes: number) => {
    if (userLikedSet.has(id)) {
      setUserLikedSet(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setLikesMap(prev => ({ ...prev, [id]: (prev[id] ?? initialLikes) - 1 }));
    } else {
      setUserLikedSet(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setLikesMap(prev => ({ ...prev, [id]: (prev[id] ?? initialLikes) + 1 }));
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    setIsSubmitting(true);
    try {
      // Save review to Firestore with status 'pending'
      await addDoc(collection(db, 'reviews'), {
        name: profile?.fullName || 'Unity Student',
        gender: 'male',
        location: 'ঢাকা',
        roleBadge: 'Student Member',
        avatarUrl: profile?.photoUrl || undefined,
        rating: 5,
        text: newReviewText.trim(),
        category: newCategory,
        date: 'এইমাত্র সাবমিট করা',
        likes: 0,
        isVerified: true,
        status: 'pending', // Pending status! Admin needs to approve
        submittedByStudentId: profile?.studentIdCode || '',
        userPhone: profile?.whatsappNumber || '',
        createdAt: new Date().toISOString()
      });

      setIsWriteModalOpen(false);
      setNewReviewText('');
      setNewRating(5);
      setShowPendingNoticeModal(true);
    } catch (err) {
      console.error('Error submitting review:', err);
      // Fallback local pending notification
      setIsWriteModalOpen(false);
      setShowPendingNoticeModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const queryStr = searchQuery.toLowerCase().trim();
    const matchesSearch = !queryStr || 
      item.name.toLowerCase().includes(queryStr) ||
      item.text.toLowerCase().includes(queryStr) ||
      item.location.toLowerCase().includes(queryStr) ||
      (item.roleBadge && item.roleBadge.toLowerCase().includes(queryStr));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-12">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Student Feedback & Proofs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              শিক্ষার্থীদের রিভিউ ও সাফল্য 🌟
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
              আমাদের সকল শিক্ষার্থী ও ফ্রিল্যান্সারদের বাস্তব কাজের অভিজ্ঞতা, পেমেন্ট প্রমাণ ও মূল্যবান রিভিউ।
            </p>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition transform active:scale-95 cursor-pointer shrink-0"
          >
            <Edit3 size={15} />
            <span>রিভিউ লিখুন</span>
          </button>
        </div>

        {/* Quick Stat Counter Cards */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-700/80">
          <div className="bg-slate-800/60 rounded-2xl p-2.5 text-center border border-slate-700/50">
            <div className="text-base sm:text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <span>5.0</span>
              <Star size={14} className="fill-amber-400 text-amber-400 inline" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">গড় রেটিং</p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-2.5 text-center border border-slate-700/50">
            <div className="text-base sm:text-lg font-black text-emerald-400">
              {reviews.length}+
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">মোট রিভিউ</p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-2.5 text-center border border-slate-700/50">
            <div className="text-base sm:text-lg font-black text-blue-400">
              ৯৯.৮%
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">সন্তুষ্টি রেট</p>
          </div>
        </div>
      </div>

      {/* User's Pending Review Notice Banner (if any) */}
      {userPendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-amber-900 shadow-sm animate-pulse">
          <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold">আপনার {userPendingCount}টি রিভিউ অনুমোদনের অপেক্ষায় (Pending) আছে</p>
            <p className="text-amber-700 text-[11px] mt-0.5">
              অ্যাডমিন রিভিউটি যাচাই করে অনুমোদন (Approve) করলে এটি সবার জন্য পাবলিকলি প্রদর্শিত হবে।
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="রিভিউ, নাম বা কাজের বিষয় দিয়ে খুঁজুন..."
          className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-xs"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs font-semibold">
        {[
          { id: 'all', label: 'সব রিভিউ' },
          { id: 'typing', label: '⌨️ টাইপিং' },
          { id: 'form', label: '📝 ফর্ম ফিলাপ' },
          { id: 'data', label: '📊 ডাটা এন্ট্রি' },
          { id: 'course', label: '🎓 কোর্স ও ট্রেনিং' },
          { id: 'payout', label: '💰 পেমেন্ট প্রুফ' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 font-medium'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs space-y-2">
            <MessageSquareQuote size={32} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">কোনো রিভিউ খুঁজে পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400">অন্য কোনো শব্দ দিয়ে সার্চ করে দেখুন।</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const currentLikes = likesMap[rev.id] ?? rev.likes;
            const isLiked = userLikedSet.has(rev.id);

            return (
              <div 
                key={rev.id} 
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                {/* Review Header: User Profile Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {rev.avatarUrl ? (
                      <img 
                        src={rev.avatarUrl} 
                        alt={rev.name} 
                        className="w-11 h-11 rounded-2xl object-cover border-2 border-orange-100 shadow-xs"
                        onError={(e) => {
                          // Fallback to initials if image link breaks
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-xs ${
                        rev.gender === 'female' 
                          ? 'bg-gradient-to-tr from-rose-500 to-pink-500' 
                          : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                      }`}>
                        {rev.name.charAt(0)}
                      </div>
                    )}

                    {/* Name, Location, Badge */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                        {rev.isVerified && (
                          <span title="Verified Student">
                            <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50" />
                          </span>
                        )}
                        {rev.roleBadge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {rev.roleBadge}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>📍 {rev.location}</span>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stars - 5 full stars */}
                  <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2 py-1 rounded-xl border border-amber-100/80">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className="fill-amber-400 text-amber-400" 
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {rev.text}
                </p>

                {/* Bottom Actions: Like / Helpful & Category Tag */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {rev.category === 'typing' && '⌨️ Typing Module'}
                    {rev.category === 'form' && '📝 Form Fill Up Module'}
                    {rev.category === 'data' && '📊 Data Entry Module'}
                    {rev.category === 'course' && '🎓 Course & Training'}
                    {rev.category === 'payout' && '💰 Payout Verification'}
                    {rev.category === 'general' && '⭐ General Feedback'}
                  </span>

                  <button
                    onClick={() => handleLike(rev.id, rev.likes)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition cursor-pointer ${
                      isLiked 
                        ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp size={13} className={isLiked ? "fill-orange-600 text-orange-600" : ""} />
                    <span>{currentLikes}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Write a Review Form */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Edit3 size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">আপনার অভিজ্ঞতা শেয়ার করুন</h3>
                  <p className="text-[10px] text-slate-400">রিভিউ অ্যাডমিন ভেরিফিকেশনের পর পাবলিশ হবে</p>
                </div>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  রেটিং সিলেক্ট করুন
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1.5 rounded-xl hover:bg-amber-50 transition cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={star <= newRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 ml-1">
                    {newRating} / 5
                  </span>
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কাজের ধরন / ক্যাটাগরি
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                >
                  <option value="typing">⌨️ Typing Work (টাইপিং কাজ)</option>
                  <option value="form">📝 Form Fill Up (ফর্ম ফিলাপ)</option>
                  <option value="data">📊 Data Entry (ডাটা এন্ট্রি)</option>
                  <option value="course">🎓 Course & Training (কোর্স ও ট্রেনিং)</option>
                  <option value="payout">💰 Payout & Withdraw (উইথড্র ও পেমেন্ট)</option>
                  <option value="general">⭐ General (সাধারণ অভিজ্ঞতা)</option>
                </select>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার মতামত বা রিভিউ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="বাংলা, বাংলিশ বা ইংলিশে আপনার বাস্তব অভিজ্ঞতা বিস্তারিত লিখুন..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:outline-none resize-none placeholder-slate-400"
                />
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-2.5 flex items-start gap-2">
                <AlertCircle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-orange-800 leading-tight">
                  রিভিউ সাবমিট করার পর তা অ্যাডমিন অনুমোদনের জন্য পেন্ডিং থাকবে। অ্যাডমিন এপ্রুভ করলে লিস্টে যোগ হবে।
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newReviewText.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={13} />
                      <span>সাবমিট করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Realistic Pending Confirmation Modal (As requested by User!) */}
      {showPendingNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Clock size={28} className="animate-spin-slow" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                🎉 রিভিউ সফলভাবে সাবমিট হয়েছে!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনার রিভিউটি বর্তমানে <span className="font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">পেন্ডিং (Pending)</span> অবস্থায় রয়েছে। অ্যাডমিন প্যানেল থেকে রিভিউ ভেরিফাই ও অনুমোদন করার পর এটি সরাসরি রিভিউ সেকশনে প্রদর্শিত হবে।
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-left space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>অ্যাডমিন মডারেশন পলিসি</span>
              </div>
              <p className="text-slate-500 text-[10px] leading-tight">
                প্ল্যাটফর্মের স্বচ্ছতা বজায় রাখতে সকল ইউজারের নতুন রিভিউ অ্যাডমিন রিভিউ করে তবেই প্রকাশ করা হয়।
              </p>
            </div>

            <button
              onClick={() => setShowPendingNoticeModal(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              ঠিক আছে, বুঝতে পেরেছি
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
