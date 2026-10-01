/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MobileLayout } from './components/MobileLayout';
import { Home } from './pages/Home';
import { TypingWork } from './pages/TypingWork';
import { FormFillupWork } from './pages/FormFillupWork';
import { DataEntryWork } from './pages/DataEntryWork';
import { VideoSubmitWork } from './pages/VideoSubmitWork';
import { PhotoSubmitWork } from './pages/PhotoSubmitWork';
import { Shop } from './pages/Shop';
import { Microjob } from './pages/Microjob';
import { Reviews } from './pages/Reviews';
import { Mentors } from './pages/Mentors';
import { LiveChat } from './pages/LiveChat';
import { Profile } from './pages/Profile';
import { LivePayments } from './pages/LivePayments';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdViewingWork } from './pages/AdViewingWork';
import { ContentModerationWork } from './pages/ContentModerationWork';
import { SocialMarketingWork } from './pages/SocialMarketingWork';
import { ContentWritingWork } from './pages/ContentWritingWork';
import { DropshippingWork } from './pages/DropshippingWork';
import { GamingTournamentWork } from './pages/GamingTournamentWork';
import { WebsiteVisitWork } from './pages/WebsiteVisitWork';
import { WORK_MODULES } from './lib/modules';

const MyWorkRedirect: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const firstAssignedJob = (profile?.assignedJobs && profile.assignedJobs.length > 0)
      ? profile.assignedJobs[0]
      : profile?.assignedJob;

    if (firstAssignedJob) {
      const assigned = WORK_MODULES.find(m => m.id === firstAssignedJob);
      if (assigned) {
        navigate(assigned.route, { replace: true });
        return;
      }
    }
    navigate('/', { replace: true });
  }, [profile, navigate]);

  return (
    <div className="p-8 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route element={<MobileLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-work" element={<MyWorkRedirect />} />
            <Route path="/live-payments" element={<LivePayments />} />
            <Route path="/payouts" element={<LivePayments />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/guidelines" element={<Mentors />} />
            <Route path="/live-chat" element={<LiveChat />} />
            <Route path="/chat" element={<LiveChat />} />
            <Route path="/microjob" element={<Microjob />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Work Module Tasks */}
            <Route path="/module/typing" element={<TypingWork />} />
            <Route path="/module/form" element={<FormFillupWork />} />
            <Route path="/module/data" element={<DataEntryWork />} />
            <Route path="/module/video" element={<VideoSubmitWork />} />
            <Route path="/module/photo" element={<PhotoSubmitWork />} />
            <Route path="/module/shop_register" element={<Shop />} />
            <Route path="/module/ad-viewing" element={<AdViewingWork />} />
            <Route path="/module/moderation" element={<ContentModerationWork />} />
            <Route path="/module/social-marketing" element={<SocialMarketingWork />} />
            <Route path="/module/content-writing" element={<ContentWritingWork />} />
            <Route path="/module/dropshipping" element={<DropshippingWork />} />
            <Route path="/module/gaming-tournament" element={<GamingTournamentWork />} />
            <Route path="/module/website-visit" element={<WebsiteVisitWork />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
