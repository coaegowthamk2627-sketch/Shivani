import { useEffect, useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { CheckCircle2, LogIn, LogOut, Plus, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';
import {
  ADMIN_EMAIL,
  db,
  deleteCmsItem,
  markContactReviewed,
  OperationType,
  saveCmsItem,
  seedDefaultsToFirestore,
  signInWithGoogle,
  signOutFirebase,
  subscribeToAllContacts,
  type CmsCollectionName,
  type ContactInquiryRecord,
} from '../lib/firebase';
import type { CmsPayload } from '../types/portal';

interface AdminDashboardPageProps {
  cmsData: CmsPayload;
  currentUser: User | null;
  isAuthReady: boolean;
}

type AdminSection =
  | 'news'
  | 'vacancies'
  | 'scholarships'
  | 'placements'
  | 'salaries'
  | 'courses'
  | 'institutions'
  | 'inquiries';

export function AdminDashboardPage({
  cmsData,
  currentUser,
  isAuthReady,
}: AdminDashboardPageProps) {
  const [section, setSection] = useState<AdminSection>('news');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  // News form state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('IAT Announcements');
  const [newsDate, setNewsDate] = useState('2026-11-18');
  const [newsSource, setNewsSource] = useState('Official IISER Admission Portal');
  const [newsUrl, setNewsUrl] = useState('https://www.iiseradmission.in');
  const [newsSummary, setNewsSummary] = useState('');

  // Vacancy form state
  const [vacInst, setVacInst] = useState('IISER Pune');
  const [vacPos, setVacPos] = useState('');
  const [vacCat, setVacCat] = useState('Research (JRF/SRF/Project)');
  const [vacDept, setVacDept] = useState('');
  const [vacPay, setVacPay] = useState('₹37,000/mo + HRA');
  const [vacDeadline, setVacDeadline] = useState('');
  const [vacUrl, setVacUrl] = useState('https://www.iiserpune.ac.in/opportunities');

  // Scholarship form state
  const [schName, setSchName] = useState('');
  const [schProvider, setSchProvider] = useState('');
  const [schAmount, setSchAmount] = useState('');
  const [schUrl, setSchUrl] = useState('https://scholarships.gov.in');

  useEffect(() => {
    let active = true;
    async function checkAdminAndSeed() {
      if (!currentUser) {
        if (active) setIsAdminUser(false);
        return;
      }
      let authorized =
        currentUser.email === ADMIN_EMAIL && currentUser.emailVerified;
      if (!authorized) {
        try {
          const adminSnap = await getDocFromServer(doc(db, 'admins', currentUser.uid));
          authorized = adminSnap.exists();
        } catch {
          authorized = false;
        }
      }
      if (!active) return;
      setIsAdminUser(authorized);

      if (authorized) {
        try {
          const metaSnap = await getDocFromServer(doc(db, 'portalMeta', 'cmsStatus'));
          if (!metaSnap.exists()) {
            await seedDefaultsToFirestore();
          }
        } catch {
          // Handled via explicit seed button if needed
        }
      }
    }
    void checkAdminAndSeed();
    return () => {
      active = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!isAdminUser) {
      setInquiries([]);
      return;
    }
    return subscribeToAllContacts(setInquiries);
  }, [isAdminUser]);

  const handleSignIn = async () => {
    setBusy(true);
    setStatusMsg('');
    try {
      await signInWithGoogle();
    } catch (error) {
      setStatusMsg(
        error instanceof Error ? error.message : 'Google Sign-In failed or was cancelled.'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOutFirebase();
      setStatusMsg('Signed out of administrator session.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddRecord = async (
    collectionName: CmsCollectionName,
    payload: Record<string, unknown>,
    onClear: () => void
  ) => {
    setBusy(true);
    setStatusMsg('');
    try {
      const id = `${collectionName}-${Date.now()}`;
      await saveCmsItem(collectionName, id, payload, OperationType.CREATE);
      onClear();
      setStatusMsg('Entry added and persisted to Cloud Firestore.');
    } catch (error) {
      setStatusMsg(
        error instanceof Error ? error.message : 'Failed to save entry to Firestore.'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteRecord = async (collectionName: CmsCollectionName, id: string) => {
    setBusy(true);
    setStatusMsg('');
    try {
      await deleteCmsItem(collectionName, id);
      setStatusMsg('Entry removed from Cloud Firestore.');
    } catch (error) {
      setStatusMsg(
        error instanceof Error ? error.message : 'Failed to delete entry from Firestore.'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleResetDefaults = async () => {
    setBusy(true);
    setStatusMsg('');
    try {
      await seedDefaultsToFirestore();
      setStatusMsg('Verified IISER GUIDE defaults synchronized to Cloud Firestore.');
    } catch (error) {
      setStatusMsg(
        error instanceof Error ? error.message : 'Failed to restore defaults to Firestore.'
      );
    } finally {
      setBusy(false);
    }
  };

  const submitNews = (e: FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;
    void handleAddRecord(
      'news',
      {
        title: newsTitle.trim(),
        category: newsCategory,
        date: newsDate.trim() || '2026',
        sourceName: newsSource.trim(),
        sourceType: 'Official Announcement',
        summary: newsSummary.trim(),
        officialUrl: newsUrl.trim(),
      },
      () => {
        setNewsTitle('');
        setNewsSummary('');
      }
    );
  };

  const submitVacancy = (e: FormEvent) => {
    e.preventDefault();
    if (!vacPos.trim() || !vacDept.trim()) return;
    void handleAddRecord(
      'vacancies',
      {
        institution: vacInst,
        position: vacPos.trim(),
        category: vacCat,
        department: vacDept.trim(),
        qualification: 'As per official IISER recruitment notification',
        experience: 'Verify official advertisement',
        ageLimit: 'As per Govt. of India norms',
        salaryOrPayLevel: vacPay.trim(),
        deadline: vacDeadline.trim() || 'Check Official Portal',
        status: 'Active (Rolling / Open)',
        selectionProcedure: 'Shortlisting & Interview',
        officialNotificationUrl: vacUrl.trim(),
        applicationUrl: vacUrl.trim(),
      },
      () => {
        setVacPos('');
        setVacDept('');
        setVacDeadline('');
      }
    );
  };

  const submitScholarship = (e: FormEvent) => {
    e.preventDefault();
    if (!schName.trim() || !schAmount.trim()) return;
    void handleAddRecord(
      'scholarships',
      {
        name: schName.trim(),
        provider: schProvider.trim() || 'Government / Funding Agency',
        category: 'Merit & Science',
        eligibility: 'Verify active scheme brochure on official portal.',
        benefitsAndAmount: schAmount.trim(),
        duration: 'Annual / Programme Duration',
        applicationProcedure: 'Apply online via official portal',
        importantDates: 'Check official notification cycle',
        requiredDocuments: ['Marksheet', 'Admission Proof', 'Bank Details'],
        officialUrl: schUrl.trim(),
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      () => {
        setSchName('');
        setSchProvider('');
        setSchAmount('');
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
            Content Management System
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 font-display mt-1">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Publish and update IAT notifications, vacancies, scholarships, placement records, salaries, courses, campus details, and user inquiries in Cloud Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isAdminUser && (
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sync Verified Defaults</span>
            </button>
          )}
          {currentUser && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 rounded-lg cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Authentication Banner / Gate */}
      {!isAuthReady ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          Verifying administrator session...
        </div>
      ) : !currentUser ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Google Authentication Required</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 font-display">
              Sign in with your Administrator Google Account
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Public visitors can read all verified IISER GUIDE directories without signing in. Publishing, editing, or deleting portal records requires verified administrator authentication.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignIn}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-blue-900 text-white text-sm font-medium rounded-lg cursor-pointer shrink-0"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            <span>Sign in with Google</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-700">
            Signed in as <span className="font-semibold text-slate-900">{currentUser.displayName || currentUser.email}</span>{' '}
            (<span className="font-mono">{currentUser.email}</span>)
          </div>
          <div className="text-xs font-medium">
            {isAdminUser ? (
              <span className="text-emerald-800">Authorized CMS Administrator</span>
            ) : (
              <span className="text-amber-800">
                Read-only preview — CMS edits require authorized administrator privileges ({ADMIN_EMAIL})
              </span>
            )}
          </div>
        </div>
      )}

      {statusMsg && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-950 text-sm rounded-lg">
          {statusMsg}
        </div>
      )}

      {isAdminUser && (
        <>
          {/* Collection Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['news', `News & IAT Notices (${cmsData.news.length})`],
                ['vacancies', `Job Vacancies (${cmsData.vacancies.length})`],
                ['scholarships', `Scholarships (${cmsData.scholarships.length})`],
                ['placements', `Placements (${cmsData.placements.length})`],
                ['salaries', `Salaries (${cmsData.salaries.length})`],
                ['courses', `Courses (${cmsData.courses.length})`],
                ['institutions', `Institutions (${cmsData.institutions.length})`],
                ['inquiries', `User Inquiries (${inquiries.length})`],
              ] as [AdminSection, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg border cursor-pointer ${
                  section === id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* News Management */}
          {section === 'news' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form onSubmit={submitNews} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 h-fit">
                <h2 className="text-lg font-semibold text-slate-900 font-display">
                  Publish News / IAT Notification
                </h2>
                <div>
                  <label htmlFor="cms-news-title" className="block text-xs font-semibold text-slate-700 mb-1">
                    Announcement Title
                  </label>
                  <input
                    id="cms-news-title"
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="e.g., IAT 2026 Information Brochure Released"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cms-news-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      id="cms-news-cat"
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="IAT Announcements">IAT Announcements</option>
                      <option value="Admission & Counselling">Admission &amp; Counselling</option>
                      <option value="Results & Cut-offs">Results &amp; Cut-offs</option>
                      <option value="Scholarships">Scholarships</option>
                      <option value="Placements">Placements</option>
                      <option value="Job & Faculty Recruitment">Job &amp; Faculty Recruitment</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cms-news-date" className="block text-xs font-semibold text-slate-700 mb-1">
                      Date Label
                    </label>
                    <input
                      id="cms-news-date"
                      type="text"
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cms-news-source" className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Source Name
                  </label>
                  <input
                    id="cms-news-source"
                    type="text"
                    value={newsSource}
                    onChange={(e) => setNewsSource(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="cms-news-url" className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Link URL
                  </label>
                  <input
                    id="cms-news-url"
                    type="url"
                    value={newsUrl}
                    onChange={(e) => setNewsUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="cms-news-summary" className="block text-xs font-semibold text-slate-700 mb-1">
                    Summary
                  </label>
                  <textarea
                    id="cms-news-summary"
                    rows={3}
                    required
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    placeholder="Provide clear, verified announcement summary..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Announcement</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                {cmsData.news.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-500">
                        {item.category} · {item.date} · {item.sourceName}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 mt-1">{item.title}</div>
                      <p className="text-xs text-slate-600 mt-1">{item.summary}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Delete notification ${item.title}`}
                      onClick={() => void handleDeleteRecord('news', item.id)}
                      className="p-2 text-slate-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vacancies Management */}
          {section === 'vacancies' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form onSubmit={submitVacancy} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 h-fit">
                <h2 className="text-lg font-semibold text-slate-900 font-display">Add Recruitment Notice</h2>
                <div>
                  <label htmlFor="vac-inst" className="block text-xs font-semibold text-slate-700 mb-1">Institution</label>
                  <select
                    id="vac-inst"
                    value={vacInst}
                    onChange={(e) => setVacInst(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {cmsData.institutions.map((i) => (
                      <option key={i.id} value={i.shortName}>{i.shortName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="vac-pos" className="block text-xs font-semibold text-slate-700 mb-1">Position Title</label>
                  <input
                    id="vac-pos"
                    type="text"
                    required
                    value={vacPos}
                    onChange={(e) => setVacPos(e.target.value)}
                    placeholder="e.g., Project Associate-I (DST Grant)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="vac-cat" className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      id="vac-cat"
                      value={vacCat}
                      onChange={(e) => setVacCat(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Faculty">Faculty</option>
                      <option value="Postdoctoral">Postdoctoral</option>
                      <option value="Research (JRF/SRF/Project)">Research (JRF/SRF/Project)</option>
                      <option value="Technical">Technical</option>
                      <option value="Administrative & Non-Teaching">Administrative &amp; Non-Teaching</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vac-pay" className="block text-xs font-semibold text-slate-700 mb-1">Pay Level / Fellowship</label>
                    <input
                      id="vac-pay"
                      type="text"
                      value={vacPay}
                      onChange={(e) => setVacPay(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="vac-dept" className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    id="vac-dept"
                    type="text"
                    required
                    value={vacDept}
                    onChange={(e) => setVacDept(e.target.value)}
                    placeholder="e.g., Department of Chemistry"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="vac-deadline" className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                  <input
                    id="vac-deadline"
                    type="text"
                    value={vacDeadline}
                    onChange={(e) => setVacDeadline(e.target.value)}
                    placeholder="e.g., 15 December 2026"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="vac-url" className="block text-xs font-semibold text-slate-700 mb-1">Official Notice URL</label>
                  <input
                    id="vac-url"
                    type="url"
                    value={vacUrl}
                    onChange={(e) => setVacUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-lg cursor-pointer">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Vacancy</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                {cmsData.vacancies.map((v) => (
                  <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-500">{v.institution} · {v.category} · {v.status}</div>
                      <div className="text-sm font-semibold text-slate-900 mt-0.5">{v.position}</div>
                      <div className="text-xs text-slate-600 mt-1">{v.department} · {v.salaryOrPayLevel}</div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Delete vacancy ${v.position}`}
                      onClick={() => void handleDeleteRecord('vacancies', v.id)}
                      className="p-2 text-slate-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scholarships Management */}
          {section === 'scholarships' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form onSubmit={submitScholarship} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 h-fit">
                <h2 className="text-lg font-semibold text-slate-900 font-display">Add Scholarship Scheme</h2>
                <input
                  type="text"
                  required
                  placeholder="Scholarship Name"
                  value={schName}
                  onChange={(e) => setSchName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Provider / Ministry"
                  value={schProvider}
                  onChange={(e) => setSchProvider(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  required
                  placeholder="Amount / Benefits (e.g., ₹5,000/month)"
                  value={schAmount}
                  onChange={(e) => setSchAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Official Application URL"
                  value={schUrl}
                  onChange={(e) => setSchUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
                <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-lg cursor-pointer">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Scholarship</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                {cmsData.scholarships.map((s) => (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-500">{s.category} · {s.provider}</div>
                      <div className="text-sm font-semibold text-slate-900 mt-0.5">{s.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{s.benefitsAndAmount}</div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Delete scholarship ${s.name}`}
                      onClick={() => void handleDeleteRecord('scholarships', s.id)}
                      className="p-2 text-slate-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Structured Overview & Quick Editor for Placements, Salaries, Courses, Institutions */}
          {['placements', 'salaries', 'courses', 'institutions'].includes(section) && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 font-display capitalize">
                    Managed {section} Records
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update verified statistics directly in Cloud Firestore.
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Last Synced: {cmsData.lastUpdated}
                </span>
              </div>

              {section === 'placements' && (
                <div className="space-y-3">
                  {cmsData.placements.map((p) => (
                    <div key={p.id} className="p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{p.institutionName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {p.academicYear} · Median: <span className="font-mono text-slate-800">{p.medianSalary}</span> · {p.dataStatus}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={async () => {
                            setBusy(true);
                            try {
                              await saveCmsItem(
                                'placements',
                                p.id,
                                {
                                  ...p,
                                  academicYear: '2024–25 (Verified Cycle)',
                                },
                                OperationType.UPDATE
                              );
                              setStatusMsg(`Updated placement cycle for ${p.institutionName}.`);
                            } finally {
                              setBusy(false);
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          Mark 2024–25 Verified
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section === 'salaries' && (
                <div className="divide-y divide-slate-200 text-sm">
                  {cmsData.salaries.map((s) => (
                    <div key={s.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-slate-900">{s.role}</span>
                        <span className="text-xs text-slate-500 ml-2 font-mono">{s.entryLevel}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-blue-800">{s.verificationType}</span>
                        <button
                          type="button"
                          aria-label={`Delete salary benchmark ${s.role}`}
                          onClick={() => void handleDeleteRecord('salaries', s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section === 'courses' && (
                <div className="divide-y divide-slate-200 text-sm">
                  {cmsData.courses.map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-semibold text-slate-900">{c.title}</span>
                        <span className="text-xs text-slate-500 ml-2">{c.duration}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-600">{c.degreeType}</span>
                    </div>
                  ))}
                </div>
              )}

              {section === 'institutions' && (
                <div className="divide-y divide-slate-200 text-sm">
                  {cmsData.institutions.map((inst) => (
                    <div key={inst.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-semibold text-slate-900">{inst.shortName}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          Est. {inst.establishedYear} · {inst.city}, {inst.state}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-blue-800">{inst.officialWebsite}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Inquiries Management */}
          {section === 'inquiries' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 font-display">
                Submitted Inquiries &amp; Data Corrections
              </h2>
              {inquiries.length === 0 ? (
                <p className="text-sm text-slate-600">No contact submissions recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500">
                          {inq.name} ({inq.email}) · {inq.role} · Status:{' '}
                          <span className="font-semibold text-slate-900">{inq.status}</span>
                        </div>
                        <p className="text-sm text-slate-800">{inq.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void markContactReviewed(inq)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{inq.status === 'reviewed' ? 'Reopen' : 'Mark Reviewed'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
