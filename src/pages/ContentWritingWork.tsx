import React from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  Edit3, 
  Clock, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  GraduationCap, 
  Bell, 
  FileText,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ContentWritingWork: React.FC = () => {
  return (
    <ModuleGuard moduleId="content_writing" title="Content Writing Work">
      <ContentWritingApp />
    </ModuleGuard>
  );
};

const ContentWritingApp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 py-5 max-w-2xl mx-auto pb-28 space-y-5">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg border border-violet-800/80 relative overflow-hidden">
        <div className="flex items-center gap-2 text-violet-300 text-[10px] font-bold uppercase tracking-wider mb-2 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full inline-flex">
          <Clock size={12} />
          <span>Upcoming Module • ব্যাচ প্রস্তুতিমূলক পর্যায়</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          কন্টেন্ট রাইটিং প্রজেক্ট (Content Writing)
        </h1>
        <p className="text-xs text-violet-200 mt-1 leading-relaxed">
          প্রফেশনাল ব্লগ, প্রোডাক্ট রিভিউ এবং সম্পাদকীয় কন্টেন্ট রাইটিং মডিউলের আপডেটের কাজ চলছে।
        </p>
      </div>

      {/* Main Notice Box - কাজ এখনো শুরু হয়নি */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-4">
        
        <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-violet-100">
          <Clock size={34} className="animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-block">
            কাজ এখনো শুরু হয়নি (Coming Soon)
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            এই প্রজেক্টের লাইভ কাজ সাময়িকভাবে স্থগিত রয়েছে
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            সম্মানিত শিক্ষার্থীদের জানানো যাচ্ছে যে, কন্টেন্ট রাইটিং প্রজেক্টের কাজ এখনো আনুষ্ঠানিকভাবে শুরু হয়নি। নতুন আন্তর্জাতিক ক্লায়েন্ট রিকোয়ারমেন্ট এবং রাইটিং কারিকুলাম তৈরির কাজ চলমান রয়েছে।
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <Sparkles size={14} className="text-violet-600" />
            <span>আসন্ন কন্টেন্ট রাইটিং মডিউলের বৈশিষ্ট্যসমূহ:</span>
          </div>

          <div className="space-y-2 text-slate-700">
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">•</span>
              <span><strong>এসইও ও ব্লগ রাইটিং:</strong> কী-ওয়ার্ড রিসার্চ ও গুগল এসইও ফ্রেন্ডলি আর্টিকেল ড্রাফটিং।</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">•</span>
              <span><strong>প্রোডাক্ট কপিরাইটিং:</strong> ই-কমার্স স্টোরের জন্য ইউনিক প্রোডাক্ট ডেসক্রিপশন তৈরি।</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-600 font-bold">•</span>
              <span><strong>মেন্টর তত্ত্বাবধান:</strong> সাবরিনা নওশীন ও আল-আমিন হোসাইনের মতো দক্ষ মেন্টরদের সরাসরি রিভিউ।</span>
            </div>
          </div>
        </div>

        {/* Action button to other active tasks */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>অন্যান্য সক্রিয় কাজগুলো দেখুন</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => navigate('/mentors')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            কোর্স মেন্টর ও গাইডলাইন দেখুন
          </button>
        </div>

      </div>

    </div>
  );
};
