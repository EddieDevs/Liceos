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

function MainLayout() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-slate-800 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && <LandingPage />}
        {activeTab === 'student-portal' && <StudentPortal />}
        {activeTab === 'representative-portal' && <RepresentativePortal />}
        {activeTab === 'teacher-portal' && <TeacherPortal />}
        {activeTab === 'admin-portal' && <AdminPortal />}
      </main>

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
