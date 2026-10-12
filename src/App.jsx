import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StudentPortal from './components/StudentPortal';
import RepresentativePortal from './components/RepresentativePortal';
import TeacherPortal from './components/TeacherPortal';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import FloatingContactButtons from './components/FloatingContactButtons';

function MainLayout() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#101c30] denim-pattern text-slate-100 antialiased selection:bg-[#DCB35C] selection:text-[#1A2B45]">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && <LandingPage />}
        {activeTab === 'student-portal' && <StudentPortal />}
        {activeTab === 'representative-portal' && <RepresentativePortal />}
        {activeTab === 'teacher-portal' && <TeacherPortal />}
        {activeTab === 'admin-portal' && <AdminPortal />}
      </main>

      <FloatingContactButtons />
      <AuthModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
