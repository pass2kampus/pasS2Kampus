import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChecklistModule } from '@/components/ChecklistModule';
import { QAPage } from '@/components/QAPage';
import { HubPage } from '@/components/HubPage';
import { NewsPage } from '@/components/NewsPage';
import { AffiliationPage } from '@/components/AffiliationPage';
import { LanguagePage } from '@/components/LanguagePage';
import { TranslatePage } from '@/components/TranslatePage';
import { ContactPage } from '@/components/ContactPage';
import { ProfilePage } from '@/components/ProfilePage';
import { NotificationPage } from '@/components/NotificationPage';
import { SchoolDetails } from '@/components/SchoolDetails';
import { FrenchIntegrationPage } from '@/components/FrenchIntegrationPage';
import { DocumentsPage } from '@/components/DocumentsPage';
import { Header } from '@/components/Header';
import { SchoolInsightsPage } from './SchoolInsightsPage';
import { PreArrival1Page } from './PreArrival1Page';
import { PreArrival2Page } from './PreArrival2Page';
import { PostArrivalPage } from './PostArrivalPage';
import { FinanceTrackingPage } from './FinanceTrackingPage';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('checklist');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const { progress, loading, updateProgress } = useUserProgress();
  const { user } = useAuth();

  // Fallback progress for when Supabase data is loading
  const fallbackProgress = {
    keys: 4,
    completed_modules: [],
    unlocked_modules: ['school', 'pre-arrival-1', 'pre-arrival-2'],
    current_page: 'checklist'
  };

  const userProgress = progress || fallbackProgress;

  // Update current page when user progress changes
  const handleProgressUpdate = async (newProgress: any) => {
    if (updateProgress) {
      await updateProgress(newProgress);
    }
    if (newProgress.current_page && newProgress.current_page !== currentPage) {
      setCurrentPage(newProgress.current_page);
    }
  };

  const checklistModules = [
    {
      id: 'school',
      title: 'School & Local Insights',
      description: 'Explore French schools and get local insights for each city',
      icon: '🏫',
      color: 'from-blue-500 to-cyan-500',
      type: 'school'
    },
    {
      id: 'pre-arrival-1',
      title: 'Pre-Arrival Checklist (Part 1)',
      description: 'Campus France, VFS, and essential preparations',
      icon: '✈️',
      color: 'from-green-500 to-emerald-500',
      type: 'checklist'
    },
    {
      id: 'pre-arrival-2',
      title: 'Pre-Arrival Checklist (Part 2)',
      description: 'Food, clothes, and cultural preparation',
      icon: '🎒',
      color: 'from-orange-500 to-red-500',
      type: 'checklist'
    },
    {
      id: 'post-arrival',
      title: 'Post-Arrival Checklist',
      description: 'Bank account, SSN, insurance, CAF, and more',
      icon: '🏠',
      color: 'from-indigo-500 to-purple-500',
      type: 'checklist',
      keysRequired: 2
    },
    {
      id: 'integration',
      title: 'French Integration',
      description: 'Cultural adaptation and social integration',
      icon: '🤝',
      color: 'from-rose-500 to-pink-500',
      type: 'integration',
      keysRequired: 3
    },
    {
      id: 'finance',
      title: 'Tracking your Finances',
      description: 'Important paperwork and renewal processes',
      icon: '📄',
      color: 'from-teal-500 to-blue-500',
      type: 'documents',
      keysRequired: 1
    },
  ];

  const sidebarPages = ['qa', 'hub', 'news', 'affiliation', 'language', 'translate', 'contact', 'profile', 'notifications', 'integration', 'documents'];
  
  const checkIfPageRequiresKey = (page: string) => {
    return sidebarPages.includes(page) && userProgress.keys < 1;
  };

  const handlePageNavigation = (page: string) => {
    if (checkIfPageRequiresKey(page)) {
      alert('You need at least 1 key to access this page. Complete modules to earn keys!');
      return;
    }
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    if (selectedSchool) {
      return (
        <SchoolDetails 
          school={selectedSchool} 
          onBack={() => setSelectedSchool(null)}
        />
      );
    }

    switch (currentPage) {
      case 'checklist':
        return (
          <ChecklistModule 
            modules={checklistModules}
            userProgress={userProgress}
            setUserProgress={handleProgressUpdate}
            onSchoolSelect={setSelectedSchool}
            currentPage={currentPage}
          />
        );
      case 'school-insights':
        return <SchoolInsightsPage onBack={() => setCurrentPage('checklist')} />;
      case 'pre-arrival-1':
        return (
          <PreArrival1Page 
            onBack={() => setCurrentPage('checklist')} 
            onComplete={() => {
              const newProgress = {
                ...userProgress,
                completed_modules: [...userProgress.completed_modules, 'pre-arrival-1'],
                keys: userProgress.keys + 1
              };
              handleProgressUpdate(newProgress);
              setCurrentPage('checklist');
            }}
            isCompleted={userProgress.completed_modules.includes('pre-arrival-1')}
          />
        );
      case 'pre-arrival-2':
        return (
          <PreArrival2Page 
            onBack={() => setCurrentPage('checklist')} 
            onComplete={() => {
              const newProgress = {
                ...userProgress,
                completed_modules: [...userProgress.completed_modules, 'pre-arrival-2'],
                keys: userProgress.keys + 1
              };
              handleProgressUpdate(newProgress);
              setCurrentPage('checklist');
            }}
            isCompleted={userProgress.completed_modules.includes('pre-arrival-2')}
          />
        );
      case 'post-arrival':
        return (
          <PostArrivalPage 
            onBack={() => setCurrentPage('checklist')} 
            onComplete={() => {
              const newProgress = {
                ...userProgress,
                completed_modules: [...userProgress.completed_modules, 'post-arrival'],
                keys: userProgress.keys + 1
              };
              handleProgressUpdate(newProgress);
              setCurrentPage('checklist');
            }}
            isCompleted={userProgress.completed_modules.includes('post-arrival')}
          />
        );
      case 'finance-tracking':
        return (
          <FinanceTrackingPage 
            onBack={() => setCurrentPage('checklist')} 
            onComplete={() => {
              const newProgress = {
                ...userProgress,
                completed_modules: [...userProgress.completed_modules, 'finance'],
                keys: userProgress.keys + 1
              };
              handleProgressUpdate(newProgress);
              setCurrentPage('checklist');
            }}
            isCompleted={userProgress.completed_modules.includes('finance')}
          />
        );
      case 'qa':
        return <QAPage />;
      case 'hub':
        return <HubPage />;
      case 'news':
        return <NewsPage />;
      case 'affiliation':
        return <AffiliationPage />;
      case 'language':
        return <LanguagePage />;
      case 'translate':
        return <TranslatePage />;
      case 'contact':
        return <ContactPage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return <NotificationPage />;
      case 'integration':
        return <FrenchIntegrationPage />;
      case 'documents':
        return <DocumentsPage />;
      default:
        return (
          <ChecklistModule 
            modules={checklistModules}
            userProgress={userProgress}
            setUserProgress={handleProgressUpdate}
            onSchoolSelect={setSelectedSchool}
            currentPage={currentPage}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex w-full">
        <AppSidebar currentPage={currentPage} setCurrentPage={handlePageNavigation} />
        <div className="flex-1 flex flex-col">
          <Header 
            currentPage={currentPage} 
            setCurrentPage={handlePageNavigation}
            userProgress={userProgress}
          />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {renderCurrentPage()}
          </main>
          <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="text-center text-gray-600">
             🎓 © {new Date().getFullYear()} <span className="text-blue-600 font-semibold">  Kousthubhee Krishna K</span> & <span className="text-cyan-600 font-semibold">Srivatsava CK</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;