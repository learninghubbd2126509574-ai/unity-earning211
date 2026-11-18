import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  Send,
  Clock,
  AlertCircle,
  ShieldCheck,
  BriefcaseBusiness,
  KeyRound,
  Search,
  X
} from 'lucide-react';
import {
  getDailyRotatedReviews,
  StudentReview,
  AvatarTone
} from '../data/reviewsData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const getAvatarToneClasses = (tone: AvatarTone): string => {
  switch (tone) {
    case 'blue':
      return 'bg-[#0A4D8C] text-white border-[#083D70]';
    case 'white':
      return 'bg-white text-[#1E2329] border-slate-300';
    case 'yellow':
      return 'bg-[#F59E0B] text-slate-950 border-[#D97706]';
    case 'black':
      return 'bg-[#1E2329] text-white border-slate-800';
    case 'teal':
      return 'bg-[#0D7A5F] text-white border-[#095C47]';
    case 'indigo':
      return 'bg-[#3730A3] text-white border-[#312E81]';
    default:
      return 'bg-[#EEF5FC] text-[#0A4D8C] border-[#D4E4F7]';
  }
};

export const Reviews: React.FC = () => {
  const { user, profile } = useAuth();

  const dailyBundle = useMemo(() => getDailyRotatedReviews(), []);
  const [dbApprovedReviews, setDbApprovedReviews] = useState<StudentReview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedSet, setUserLikedSet] = useState<Set<string>>(new Set());
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(new Set());

  // Compact top review submission state (10-point scale, minimum 7)
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [newRating, setNewRating] = useState<number>(10);
  const [ratingNotice, setRatingNotice] = useState<string>('');
  const [newReviewText, setNewReviewText] = useState('');
  const [projectSuccessId, setProjectSuccessId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pending confirmation modal
  const [showPendingNoticeModal, setShowPendingNoticeModal] = useState(false);

  // User's own pending reviews count
  const [userPendingCount, setUserPendingCount] = useState(0);

  // Real-time Firestore sync for custom approved reviews & user's pending reviews
  useEffect(() => {
    if (!user?.uid) {
      setDbApprovedReviews([]);
      setUserPendingCount(0);
      return;
    }

    const approvedQ = query(collection(db, 'reviews'), where('status', '==', 'approved'));
    const unsubApproved = onSnapshot(
      approvedQ,
      (snapshot) => {
        const approvedList: StudentReview[] = [];
        (snapshot.docs || []).forEach((docSnap: any) => {
          const d = docSnap.data();
          const rawRating = Number(d.rating || 10);
          const normalizedRating =
            rawRating <= 5 ? Math.max(7, rawRating * 2) : Math.min(10, Math.max(7, rawRating));

          approvedList.push({
            id: docSnap.id,
            name: d.name || 'Verified Member',
            gender: d.gender || 'male',
            location: d.location || 'Bangladesh',
            workRole: d.workRole || 'Platform Worker · Active',
            roleBadge: d.roleBadge || 'Verified Worker',
            avatarUrl: d.avatarUrl || undefined,
            avatarTone: (d.avatarTone as AvatarTone) || 'blue',
            rating: normalizedRating,
            text: d.text || '',
            category: d.category || 'general',
            date: d.date || 'Recently',
            likes: d.likes || 8,
            earnings: d.earnings,
            projectSuccessId: d.projectSuccessId,
            isVerified: d.isVerified ?? true,
            status: 'approved',
            submittedByStudentId: d.submittedByStudentId
          });
        });

        approvedList.sort((a: any, b: any) => String(b.id).localeCompare(String(a.id)));
        setDbApprovedReviews(approvedList);
      },
      (err) => {
        console.warn('Approved reviews listener warning:', err);
      }
    );

    const myReviewsQ = query(collection(db, 'reviews'), where('userId', '==', user.uid));
    const unsubMine = onSnapshot(
      myReviewsQ,
      (snapshot) => {
        let pendingCount = 0;
        (snapshot.docs || []).forEach((docSnap: any) => {
          if (docSnap.data()?.status === 'pending') {
            pendingCount++;
          }
        });
        setUserPendingCount(pendingCount);
      },
      (err) => {
        console.warn('User pending reviews listener warning:', err);
      }
    );

    return () => {
      unsubApproved();
      unsubMine();
    };
  }, [user?.uid]);

  // Keep user-approved custom reviews at top followed by today's structured reviews, strictly capped at 100
  const displayReviews = useMemo(() => {
    if (dbApprovedReviews.length === 0) return dailyBundle.reviews.slice(0, 100);
    return [...dbApprovedReviews, ...dailyBundle.reviews].slice(0, 100);
  }, [dbApprovedReviews, dailyBundle.reviews]);

  // Average rating across displayed reviews
  const averageRating = useMemo(() => {
    if (displayReviews.length === 0) return '9.2';
    const sum = displayReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / displayReviews.length).toFixed(1);
  }, [displayReviews]);

  const totalPlatformCount = displayReviews.length;

  const handleLike = (id: string, initialLikes: number) => {
    if (userLikedSet.has(id)) {
      setUserLikedSet((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setLikesMap((prev) => ({ ...prev, [id]: (prev[id] ?? initialLikes) - 1 }));
    } else {
      setUserLikedSet((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setLikesMap((prev) => ({ ...prev, [id]: (prev[id] ?? initialLikes) + 1 }));
    }
  };

  const handleSelectRating = (star: number) => {
    if (star < 7) {
      setNewRating(7);
      setRatingNotice('Minimum allowed rating is 7 / 10.');
    } else {
      setNewRating(star);
      setRatingNotice('');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const cleanProjectId = projectSuccessId.trim();
    const trimmedText = newReviewText.trim();

    if (!trimmedText) {
      setSubmitError('Please write your work feedback before submitting.');
      return;
    }

    if (!/^\d{7}$/.test(cleanProjectId)) {
      setSubmitError(
        'আপনার প্রজেক্টের আইডিটি ভুল এবং আপনি এখন পর্যন্ত কোনো সাকসেসফুল প্রজেক্ট কমপ্লিট করেননি। প্রজেক্ট কমপ্লিট করার পর আপনি রেটিং দিতে পারবেন।'
      );
      return;
    }

    if (!user) {
      setSubmitError('Please sign in first to submit a verified review.');
      return;
    }

    setIsSubmitting(true);
    try {
      const [subsSnap, projSubsSnap] = await Promise.all([
        getDocs(query(collection(db, 'submissions'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'projectSubmissions'), where('userId', '==', user.uid)))
      ]);

      const validProjectIds = new Set<string>();

      (subsSnap.docs || []).forEach((docSnap: any) => {
        const d = docSnap.data();
        if (d.status === 'approved' && d.projectSuccessId) {
          validProjectIds.add(String(d.projectSuccessId).trim());
        }
      });

      (projSubsSnap.docs || []).forEach((docSnap: any) => {
        const d = docSnap.data();
        if (d.status === 'Accepted' && d.projectSuccessId) {
          validProjectIds.add(String(d.projectSuccessId).trim());
        }
      });

      if (validProjectIds.size === 0 || !validProjectIds.has(cleanProjectId)) {
        setSubmitError(
          'আপনার প্রজেক্টের আইডিটি ভুল এবং আপনি এখন পর্যন্ত কোনো সাকসেসফুল প্রজেক্ট কমপ্লিট করেননি। প্রজেক্ট কমপ্লিট করার পর আপনি রেটিং দিতে পারবেন।'
        );
        setIsSubmitting(false);
        return;
      }

      const tones: AvatarTone[] = ['blue', 'white', 'yellow', 'black', 'teal', 'indigo'];
      const chosenTone = tones[(profile?.fullName?.length || 0) % tones.length];

      await addDoc(collection(db, 'reviews'), {
        name: profile?.fullName || 'Unity Member',
        gender: 'male',
        location: 'Bangladesh',
        workRole: 'Verified Worker · Active',
        roleBadge: 'Verified Member',
        avatarUrl: profile?.photoUrl || '',
        avatarTone: chosenTone,
        rating: Math.max(7, Math.min(10, newRating)),
        text: trimmedText,
        category: 'general',
        projectSuccessId: cleanProjectId,
        date: 'Just now',
        likes: 0,
        isVerified: true,
        status: 'pending',
        submittedByStudentId: profile?.studentIdCode || '',
        userId: user.uid,
        userPhone: profile?.whatsappNumber || '',
        createdAt: new Date().toISOString()
      });

      setNewReviewText('');
      setProjectSuccessId('');
      setNewRating(10);
      setRatingNotice('');
      setIsFormExpanded(false);
      setShowPendingNoticeModal(true);
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmitError('Verification failed. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search filter across all 100 reviews
  const filteredReviews = useMemo(() => {
    const queryStr = searchQuery.toLowerCase().trim();
    if (!queryStr) return displayReviews;
    return displayReviews.filter(
      (item) =>
        item.name.toLowerCase().includes(queryStr) ||
        item.text.toLowerCase().includes(queryStr) ||
        item.location.toLowerCase().includes(queryStr) ||
        item.workRole.toLowerCase().includes(queryStr)
    );
  }, [displayReviews, searchQuery]);

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-3.5 pb-24 font-sans">
      {/* 1. Compact Header + Stat Summary */}
      <div className="bg-[#0A4D8C] text-white rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-[11px] font-medium text-[#D4E4F7]">
              Verified Worker Ratings & Community Reviews
            </p>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              Worker Reviews & Ratings
            </h1>
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm sm:text-base font-semibold font-mono tabular-nums text-white flex items-center justify-end gap-1">
              <span>{averageRating} / 10</span>
              <Star size={14} className="fill-amber-300 text-amber-300" />
            </div>
            <p className="text-[10.5px] text-blue-100 tabular-nums">
              {totalPlatformCount} verified reviews
            </p>
          </div>
        </div>

        {/* Stat Strip */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-lg py-1.5 px-2 border border-white/15">
            <div className="text-xs sm:text-sm font-semibold font-mono tabular-nums text-white">
              {averageRating} / 10
            </div>
            <div className="text-[10px] text-blue-100">Average Score</div>
          </div>
          <div className="bg-white/10 rounded-lg py-1.5 px-2 border border-white/15">
            <div className="text-xs sm:text-sm font-semibold font-mono tabular-nums text-white">
              {displayReviews.length}
            </div>
            <div className="text-[10px] text-blue-100">Total Reviews</div>
          </div>
          <div className="bg-white/10 rounded-lg py-1.5 px-2 border border-white/15">
            <div className="text-xs sm:text-sm font-semibold font-mono tabular-nums text-white">
              98.6%
            </div>
            <div className="text-[10px] text-blue-100">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* 2. Compact Top Review Submission Box (Directly at top above review feed) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setIsFormExpanded((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
              <Star size={15} className="fill-amber-400 text-amber-500" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-[13px] font-semibold text-[#1E2329]">
                Write Your Own Review & Rating
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Requires a verified 7-digit completed Project ID · Min rating 7/10
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-[#0A4D8C] text-white text-[11px] font-semibold shrink-0 whitespace-nowrap">
            {isFormExpanded ? 'Hide Form' : 'Rate Now'}
          </span>
        </button>

        {isFormExpanded && (
          <form
            onSubmit={handleSubmitReview}
            className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3"
          >
            {/* 10-Star Selector + 7-Digit Project ID on compact grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#1E2329]">
                    Rating (Min 7 / 10)
                  </label>
                  <span className="text-[11px] font-semibold font-mono tabular-nums text-[#0A4D8C]">
                    {newRating} / 10
                  </span>
                </div>
                <div className="flex items-center gap-0.5 bg-[#F8FAFC] border border-slate-200 rounded-lg px-2 py-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleSelectRating(star)}
                      className={`p-1 rounded transition cursor-pointer ${
                        star < 7 ? 'opacity-50' : 'hover:bg-amber-50'
                      }`}
                    >
                      <Star
                        size={15}
                        className={
                          star <= newRating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                </div>
                {ratingNotice && (
                  <p className="text-[10.5px] text-[#B47B00] font-medium mt-1">{ratingNotice}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1E2329] mb-1">
                  7-Digit Project Successful ID <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <KeyRound size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={7}
                    value={projectSuccessId}
                    onChange={(e) => {
                      setProjectSuccessId(e.target.value.replace(/\D/g, ''));
                      if (submitError) setSubmitError('');
                    }}
                    placeholder="Enter your 7-digit Project ID"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-mono tracking-wider tabular-nums text-[#1E2329] focus:border-[#0A4D8C] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <textarea
                required
                rows={2}
                value={newReviewText}
                onChange={(e) => {
                  setNewReviewText(e.target.value);
                  if (submitError) setSubmitError('');
                }}
                placeholder="Share your honest work experience and earnings feedback..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2.5 text-xs text-[#1E2329] focus:border-[#0A4D8C] focus:bg-white focus:outline-none resize-none placeholder-slate-400"
              />
            </div>

            {submitError && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-start gap-2 text-rose-700">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                <p className="text-[11.5px] font-medium leading-relaxed">{submitError}</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10.5px] text-slate-500">
                Verified submissions are published after admin approval.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || !newReviewText.trim()}
                className="px-4 py-2 rounded-lg bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={13} />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User's Pending Review Notice Banner */}
      {userPendingCount > 0 && (
        <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-xl p-3 flex items-start gap-2.5 text-[#5F4B16]">
          <Clock size={15} className="text-[#B47B00] shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-[#1E2329]">
              You have {userPendingCount} pending review(s) awaiting verification
            </p>
            <p className="text-[#5F4B16] text-[11px] mt-0.5">
              Your review will appear publicly once verified and approved by the review team.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reviews by worker name, location, or feedback..."
          className="w-full bg-white border border-slate-200 pl-9 pr-8 py-2 rounded-xl text-xs text-[#1E2329] placeholder-slate-400 focus:outline-none focus:border-[#0A4D8C] transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Count Line */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5 tabular-nums">
        <span>Showing top verified worker reviews</span>
        <span>{filteredReviews.length} reviews</span>
      </div>

      {/* 3. Worker Reviews Stream (First screen already shows top reviews; scroll down for all 100) */}
      <div className="space-y-2.5">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200/90 space-y-1">
            <p className="font-semibold text-[#1E2329] text-sm">No matching reviews found</p>
            <p className="text-xs text-slate-500">Try a different search keyword.</p>
          </div>
        ) : (
          filteredReviews.map((rev, idx) => {
            const currentLikes = likesMap[rev.id] ?? rev.likes;
            const isLiked = userLikedSet.has(rev.id);

            return (
              <div
                key={`${rev.id}-${idx}`}
                className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-2.5"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {rev.avatarUrl && !failedAvatars.has(rev.id) ? (
                      <img
                        src={rev.avatarUrl}
                        alt={rev.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        onError={() => {
                          setFailedAvatars((prev) => {
                            const next = new Set(prev);
                            next.add(rev.id);
                            return next;
                          });
                        }}
                      />
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-full border flex items-center justify-center font-semibold text-xs shrink-0 ${getAvatarToneClasses(
                          rev.avatarTone
                        )}`}
                      >
                        {rev.name.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-semibold text-[#1E2329] text-[13px] truncate">
                          {rev.name}
                        </h4>
                        {rev.isVerified && (
                          <CheckCircle2 size={13} className="text-[#0D7A5F] shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#0A4D8C] font-medium flex-wrap">
                        <BriefcaseBusiness size={11} className="shrink-0" />
                        <span>{rev.workRole}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500 font-normal">{rev.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* 10-Point Rating Badge */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEF7E0] border border-[#F3DFA2] text-[#8F5F00] text-[11px] font-semibold font-mono tabular-nums">
                      <Star size={11} className="fill-amber-400 text-amber-500" />
                      <span>{rev.rating}/10</span>
                    </span>
                    <div className="hidden sm:flex items-center gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Star
                          key={i}
                          size={9.5}
                          className={
                            i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* English Review Text */}
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">
                  {rev.text}
                </p>

                {/* Bottom Metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>{rev.date}</span>
                    {rev.earnings && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#0D7A5F] font-semibold font-mono tabular-nums">
                          Earned {rev.earnings}
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLike(rev.id, rev.likes)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition cursor-pointer font-mono tabular-nums ${
                      isLiked
                        ? 'bg-[#EEF5FC] text-[#0A4D8C] font-semibold border border-[#D4E4F7]'
                        : 'text-slate-500 hover:text-[#1E2329] hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp size={12} className={isLiked ? 'text-[#0A4D8C]' : ''} />
                    <span>{currentLikes}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pending Confirmation Modal */}
      {showPendingNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF7E0] border border-[#F3DFA2] text-[#B47B00] flex items-center justify-center mx-auto">
              <Clock size={24} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#1E2329]">
                Review Submitted Successfully
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your review is currently <span className="font-semibold text-[#B47B00]">Pending</span> verification. Once approved by an administrator, it will appear live in the feed.
              </p>
            </div>

            <div className="bg-[#EEF5FC] border border-[#D4E4F7] rounded-xl p-3 text-left space-y-1 text-xs text-[#1E2329]">
              <div className="flex items-center gap-1.5 font-semibold text-[#0A4D8C]">
                <ShieldCheck size={14} />
                <span>Moderation Policy</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-snug">
                All submitted member ratings are verified against completed projects before publishing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPendingNoticeModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
