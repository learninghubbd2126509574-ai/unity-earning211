import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Flame, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Gift,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeString: string;
  badge: string;
  badgeColor: string;
  icon: string;
  isImportant?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [readIds, setReadIds] = useState<string[]>([]);

  // Check if today is Friday (5) or Saturday (6)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  const isWeekendFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;

  // Dynamic notification list based on Day of Week as instructed by user
  const notifications: NotificationItem[] = isWeekendFridayOrSaturday
    ? [
        {
          id: 'notif-lead-130',
          title: 'শুক্রবার ও শনিবারের স্পেশাল লিড অফার!',
          description: 'আজকে কিন্তু অফার আছে সবাই ভালো করে কাজ করবেন। লিড জেনারেশনের কাজ করে প্রতি কনভার্টে পাচ্ছেন ১৩০ টাকা করে! এখনই সুযোগ অফার কাজে লাগান।',
          timeString: 'আজকে সকাল ০৯:০০ টা',
          badge: 'ধামাকা অফার (৳১৩০)',
          badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: '🔥',
          isImportant: true
        },
        {
          id: 'notif-discount-55',
          title: '৫৫% ডিসকাউন্টে আইডি এক্টিভ করার সুযোগ!',
          description: '৫৫% মেগা ডিসকাউন্টে নতুন আইডি একটিভ করার সুবর্ণ সুযোগ রয়েছে। অফারটি সীমিত সময়ের জন্য সক্রিয় রয়েছে, এখনই আপনার টিম ও ফ্রেন্ডদের রেফার করুন!',
          timeString: 'আজকে সকাল ০৯:১৫ টা',
          badge: '৫৫% ডিসকাউন্ট',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: '⚡',
          isImportant: true
        },
        {
          id: 'notif-friday-gift',
          title: 'সাপ্তাহিক ১,০০০ টাকা মেগা গিফট বোনাস ঘোষণা!',
          description: 'আজকে শুক্রবার রাত ৮:০০ টায় শীর্ষ ৩ জন কর্মীর তালিকা প্রকাশ করা হবে। ১ম স্থান ৳১,০০০, ২য় স্থান ৳৭০০ এবং ৩য় স্থান ৳৫০০ নগদ ক্যাশ বোনাস পাবেন।',
          timeString: 'আজকে সকাল ১০:০০ টা',
          badge: 'মেগা প্রাইজ',
          badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: '🎁'
        },
        {
          id: 'notif-fast-payout',
          title: 'উইকএন্ড স্পিড পেমেন্ট ও সাপোর্ট সক্রিয়',
          description: 'শুক্রবার ও শনিবারের সকল বিকাশ, নগদ ও রকেট উইথড্রয়াল সুপারফাস্ট ৫-১০ মিনিটে প্রসেস করা হচ্ছে। যেকোনো সহায়তায় হোয়াটসঅ্যাপ হেল্পলাইন সক্রিয়।',
          timeString: 'এইমাত্র',
          badge: 'ইনস্ট্যান্ট পে-আউট',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: '💳'
        }
      ]
    : [
        {
          id: 'notif-form-typing-20',
          title: 'ফর্ম ফিলাপ ও টাইপিং ওয়ার্কে ২০% এক্সট্রা কমিশন!',
          description: 'আজকে ফর্ম ফিলাপ এবং টাইপিংয়ের প্রতিটি কাজে ২০% অতিরিক্ত কমিশন বোনাস দেওয়া হচ্ছে! প্রতিটি কাজ নির্ভুলভাবে সম্পন্ন করে বাড়তি টাকা আয় করুন।',
          timeString: 'আজকে সকাল ০৯:০০ টা',
          badge: '২০% এক্সট্রা কমিশন',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: '📝',
          isImportant: true
        },
        {
          id: 'notif-data-entry-20',
          title: 'ডাটা এন্ট্রি প্রজেক্টে ২০% এক্সট্রা কমিশন বোনাস!',
          description: 'ডাটা এন্ট্রি টাস্ক সফলভাবে সম্পন্ন করলে মূল উপার্জনের সাথে পাচ্ছেন অতিরিক্ত ২০% কমিশন! এখনই ডাটা এন্ট্রি মডিউলে ঢুকে কাজ শুরু করুন।',
          timeString: 'আজকে সকাল ০৯:৩০ টা',
          badge: '২০% এক্সট্রা বোনাস',
          badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: '📊',
          isImportant: true
        },
        {
          id: 'notif-quota-boost',
          title: 'দৈনিক টাস্ক লিমিট বৃদ্ধি ও নতুন ব্যাচ উন্মুক্ত!',
          description: 'আজকের কাজের কোটা বৃদ্ধি করা হয়েছে। ছাত্রছাত্রীরা তাদের সুবিধাজনক সময়ে কাজ সম্পন্ন করে সরাসরি ওয়ালেটে ব্যালেন্স জমা করতে পারবেন।',
          timeString: 'আজকে সকাল ১০:০০ টা',
          badge: 'টাস্ক আপডেট',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: '🚀'
        },
        {
          id: 'notif-weekly-campaign',
          title: 'সাপ্তাহিক গিফট ক্যাম্পেইনে নিজের নাম নথিভুক্ত করুন',
          description: 'প্রতি শনিবার থেকে শুরু হওয়া মেগা গিফট ক্যাম্পেইনে প্রতিদিনের কাজের সংখ্যা জমা দিয়ে ১ম (৳১,০০০), ২য় (৳৭০০) ও ৩য় (৳৫০০) বিজয়ী হওয়ার সুযোগ নিন।',
          timeString: 'এইমাত্র',
          badge: 'সাপ্তাহিক ক্যাম্পেইন',
          badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: '🎁'
        }
      ];

  const handleMarkAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  const handleItemClick = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-[440px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shadow-xs">
              <Bell size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                <span>নোটিফিকেশন সেন্টার</span>
                <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  {notifications.length} টি নোটিশ
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {isWeekendFridayOrSaturday ? '🔥 উইকএন্ড মেগা স্পেশাল অফার সক্রিয়' : '⚡ দৈনিক বোনাস ও কাজের আপডেট'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700/60"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Day Status Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Calendar size={13} className="text-orange-400" />
            <span>
              {isWeekendFridayOrSaturday ? 'আজ শুক্রবার/শনিবার (স্পেশাল অফার ডে)' : 'সপ্তাহের কার্যদিবস অফার'}
            </span>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-bold text-orange-400 hover:text-orange-300 transition cursor-pointer"
          >
            সব পঠিত করুন
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {notifications.map((item) => {
            const isRead = readIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  item.isImportant
                    ? 'bg-gradient-to-r from-orange-950/30 via-slate-900 to-amber-950/20 border-orange-500/40 shadow-xs'
                    : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/90'
                } ${isRead ? 'opacity-75' : 'opacity-100'}`}
              >
                {!isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}

                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0 mt-0.5">
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock size={10} />
                        <span>{item.timeString}</span>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-[13px] font-black text-white leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center shrink-0">
          <p className="text-[10px] text-slate-500 font-mono">
            Unity Earning • Official Live Announcement System
          </p>
        </div>

      </div>
    </div>
  );
};
