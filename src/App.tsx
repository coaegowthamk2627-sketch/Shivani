import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { CmsPayload, PageRoute } from './types/portal';
import {
  DEFAULT_COURSES,
  DEFAULT_INSTITUTIONS,
  DEFAULT_PLACEMENTS,
} from './data/iiserInstitutionsData';
import {
  DEFAULT_NEWS,
  DEFAULT_SALARIES,
  DEFAULT_SCHOLARSHIPS,
  DEFAULT_VACANCIES,
} from './data/iatAndCareersData';
import {
  auth,
  subscribeToCmsCollections,
  testConnection,
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { InstitutionsPage } from './components/InstitutionsPage';
import { InstitutionDetailPage } from './components/InstitutionDetailPage';
import { IatExamPage } from './components/IatExamPage';
import { CoursesPage } from './components/CoursesPage';
import { AdmissionFeesPage } from './components/AdmissionFeesPage';
import { ScholarshipsPage } from './components/ScholarshipsPage';
import { PlacementsPage } from './components/PlacementsPage';
import { CareersSalariesPage } from './components/CareersSalariesPage';
import { ComparisonPage } from './components/ComparisonPage';
import { ResearchPage, RecruitmentPage } from './components/ResearchAndRecruitmentPage';
import { ToolsHubPage } from './components/ToolsHubPage';
import { ResourcesNewsPage } from './components/ResourcesNewsPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';

const INITIAL_FALLBACK_CMS: CmsPayload = {
  news: DEFAULT_NEWS,
  vacancies: DEFAULT_VACANCIES,
  scholarships: DEFAULT_SCHOLARSHIPS,
  placements: DEFAULT_PLACEMENTS,
  salaries: DEFAULT_SALARIES,
  courses: DEFAULT_COURSES,
  institutions: DEFAULT_INSTITUTIONS,
  lastUpdated: '2026-11-18',
};

export default function App() {
  const [route, setRoute] = useState<PageRoute>('home');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('iiser-pune');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [cmsData, setCmsData] = useState<CmsPayload>(INITIAL_FALLBACK_CMS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  useEffect(() => {
    void testConnection();
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    const unsubCms = subscribeToCmsCollections(setCmsData);
    return () => {
      unsubAuth();
      unsubCms();
    };
  }, []);

  const handleNavigate = (nextRoute: PageRoute, detailId?: string) => {
    if (nextRoute === 'institution-detail' && detailId) {
      setSelectedInstitutionId(detailId);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const selectedInstitution =
    cmsData.institutions.find((i) => i.id === selectedInstitutionId) || cmsData.institutions[0];
  const selectedPlacement = cmsData.placements.find(
    (p) => p.institutionId === selectedInstitution.id
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        currentRoute={route}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        cmsData={cmsData}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {route === 'home' && <HomePage cmsData={cmsData} onNavigate={handleNavigate} />}
        {route === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {route === 'institutions' && (
          <InstitutionsPage institutions={cmsData.institutions} onNavigate={handleNavigate} />
        )}
        {route === 'institution-detail' && (
          <InstitutionDetailPage
            institution={selectedInstitution}
            placement={selectedPlacement}
            allInstitutions={cmsData.institutions}
            onNavigate={handleNavigate}
          />
        )}
        {route === 'iat' && <IatExamPage onNavigate={handleNavigate} />}
        {route === 'courses' && <CoursesPage courses={cmsData.courses} />}
        {route === 'admission' && (
          <AdmissionFeesPage institutions={cmsData.institutions} initialFocus="admission" />
        )}
        {route === 'student-life' && (
          <AdmissionFeesPage institutions={cmsData.institutions} initialFocus="student-life" />
        )}
        {route === 'scholarships' && <ScholarshipsPage scholarships={cmsData.scholarships} />}
        {route === 'placements' && (
          <PlacementsPage placements={cmsData.placements} institutions={cmsData.institutions} />
        )}
        {route === 'careers' && (
          <CareersSalariesPage salaries={cmsData.salaries} initialTab="careers" />
        )}
        {route === 'salaries' && (
          <CareersSalariesPage salaries={cmsData.salaries} initialTab="salaries" />
        )}
        {route === 'higher-ed' && (
          <CareersSalariesPage salaries={cmsData.salaries} initialTab="higher-ed" />
        )}
        {route === 'comparison' && <ComparisonPage />}
        {route === 'research' && <ResearchPage institutions={cmsData.institutions} />}
        {route === 'recruitment' && <RecruitmentPage vacancies={cmsData.vacancies} />}
        {route === 'tools' && <ToolsHubPage cmsData={cmsData} onNavigate={handleNavigate} />}
        {route === 'resources' && (
          <ResourcesNewsPage news={cmsData.news} initialSection="resources" />
        )}
        {route === 'news' && <ResourcesNewsPage news={cmsData.news} initialSection="news" />}
        {route === 'contact' && (
          <ContactPage currentUser={currentUser} isAuthReady={isAuthReady} />
        )}
        {route === 'admin' && (
          <AdminDashboardPage
            cmsData={cmsData}
            currentUser={currentUser}
            isAuthReady={isAuthReady}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} lastUpdated={cmsData.lastUpdated} />
    </div>
  );
}
