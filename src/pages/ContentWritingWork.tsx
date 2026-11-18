import React from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  Clock, 
  ArrowRight, 
  FileText
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
    <div className="min-h-full bg-[#F4F5F7] p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Top Header Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70]">
          <div className="text-[11px] font-medium text-white/80 mb-1">
            Upcoming Module · ব্যাচ প্রস্তুতিমূলক পর্যায়
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            কন্টেন্ট রাইটিং প্রজেক্ট (Content Writing)
          </h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            প্রফেশনাল ব্লগ, প্রোডাক্ট রিভিউ এবং সম্পাদকীয় কন্টেন্ট রাইটিং মডিউলের আপডেটের কাজ চলছে।
          </p>
        </div>

        {/* Main Notice Box */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 text-center space-y-4">
          <div className="w-14 h-14 bg-[#FEF7E0] text-[#B47B00] rounded-xl flex items-center justify-center mx-auto border border-[#F3DFA2]">
            <Clock size={28} />
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#B47B00]">
              Coming Soon · কাজ এখনো শুরু হয়নি
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#111827]">
              এই প্রজেক্টের লাইভ কাজ সাময়িকভাবে স্থগিত রয়েছে
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              সম্মানিত শিক্ষার্থীদের জানানো যাচ্ছে যে, কন্টেন্ট রাইটিং প্রজেক্টের কাজ এখনো আনুষ্ঠানিকভাবে শুরু হয়নি। নতুন আন্তর্জাতিক ক্লায়েন্ট রিকোয়ারমেন্ট এবং রাইটিং কারিকুলাম তৈরির কাজ চলমান রয়েছে।
            </p>
          </div>

          {/* Feature Preview Card */}
          <div className="bg-[#EEF5FC] p-4 rounded-xl border border-[#D4E4F7] text-left space-y-2 text-xs">
            <div className="font-semibold text-[#0A4D8C] border-b border-[#D4E4F7] pb-2 flex items-center gap-1.5">
              <FileText size={14} />
              <span>আসন্ন কন্টেন্ট রাইটিং মডিউলের বৈশিষ্ট্যসমূহ</span>
            </div>

            <div className="space-y-1.5 text-slate-700 leading-relaxed">
              <div><strong>১. এসইও ও ব্লগ রাইটিং:</strong> কী-ওয়ার্ড রিসার্চ ও গুগল এসইও ফ্রেন্ডলি আর্টিকেল ড্রাফটিং।</div>
              <div><strong>২. প্রোডাক্ট কপিরাইটিং:</strong> ই-কমার্স স্টোরের জন্য ইউনিক প্রোডাক্ট ডেসক্রিপশন তৈরি।</div>
              <div><strong>৩. মেন্টর তত্ত্বাবধান:</strong> সাবরিনা নওশীন ও আল-আমিন হোসাইনের মতো দক্ষ মেন্টরদের সরাসরি রিভিউ।</div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-1 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>অন্যান্য সক্রিয় কাজগুলো দেখুন</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/mentors')}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
            >
              কোর্স মেন্টর ও গাইডলাইন দেখুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

