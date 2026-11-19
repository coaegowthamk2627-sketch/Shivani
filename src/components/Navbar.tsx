import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import type { PageRoute } from '../types/portal';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, detailId?: string) => void;
  onOpenSearch: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  items: { label: string; route: PageRoute; detailId?: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'institutions',
    label: 'Institutions',
    items: [
      { label: 'About IISER & History', route: 'about' },
      { label: 'All 7 IISER Campuses', route: 'institutions' },
      { label: 'IISER Pune', route: 'institution-detail', detailId: 'iiser-pune' },
      { label: 'IISER Kolkata', route: 'institution-detail', detailId: 'iiser-kolkata' },
      { label: 'IISER Mohali', route: 'institution-detail', detailId: 'iiser-mohali' },
      { label: 'IISER Bhopal', route: 'institution-detail', detailId: 'iiser-bhopal' },
      { label: 'IISER Thiruvananthapuram', route: 'institution-detail', detailId: 'iiser-tvm' },
      { label: 'IISER Tirupati', route: 'institution-detail', detailId: 'iiser-tirupati' },
      { label: 'IISER Berhampur', route: 'institution-detail', detailId: 'iiser-berhampur' },
      { label: 'IISER vs IISc vs IIT vs NISER', route: 'comparison' },
    ],
  },
  {
    id: 'iat',
    label: 'IAT Exam',
    items: [
      { label: 'IAT Overview, Eligibility & Pattern', route: 'iat' },
      { label: 'Admission Process, Fees & Cut-offs', route: 'admission' },
      { label: 'Interactive Tools & Eligibility Checker', route: 'tools' },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    items: [
      { label: 'Courses & Degrees (BS-MS, BS, B.Tech, PhD)', route: 'courses' },
      { label: 'Hostels, Fees & Student Life', route: 'student-life' },
      { label: 'Scholarships & Fellowships', route: 'scholarships' },
      { label: 'Research, Labs & Innovation', route: 'research' },
    ],
  },
  {
    id: 'careers',
    label: 'Careers & Pay',
    items: [
      { label: 'Placements & Campus Recruitment', route: 'placements' },
      { label: 'Jobs After IISER (Govt, R&D, Private)', route: 'careers' },
      { label: 'Salary Explorer & Pay Scales', route: 'salaries' },
      { label: 'Higher Education (PhD India & Abroad)', route: 'higher-ed' },
      { label: 'IISER Faculty & Staff Recruitment', route: 'recruitment' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    items: [
      { label: 'Official Website & Portal Directory', route: 'resources' },
      { label: 'Latest News & Notifications', route: 'news' },
      { label: 'Contact, Privacy & Disclaimer', route: 'contact' },
      { label: 'Administrator CMS Dashboard', route: 'admin' },
    ],
  },
];

export function Navbar({ currentRoute, onNavigate, onOpenSearch }: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleSelect = (route: PageRoute, detailId?: string) => {
    setOpenDropdown(null);
    setMobileOpen(false);
    onNavigate(route, detailId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8"
      >
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="text-xl font-bold tracking-tight text-slate-900 hover:text-blue-800 transition-colors whitespace-nowrap shrink-0 font-display cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
        >
          IISER GUIDE
        </button>

        {/* Zone 2: 5 concise single-line dropdown groups */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_GROUPS.map((group) => {
            const isActiveGroup = group.items.some((item) => item.route === currentRoute);
            const isOpen = openDropdown === group.id;
            return (
              <div key={group.id} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                  className={`inline-flex items-center gap-1 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer border-b-2 ${
                    isActiveGroup
                      ? 'text-blue-800 border-blue-700'
                      : 'text-slate-700 border-transparent hover:text-slate-950 hover:border-slate-300'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                    {group.items.map((item) => (
                      <button
                        key={`${item.route}-${item.detailId || ''}`}
                        type="button"
                        onClick={() => handleSelect(item.route, item.detailId)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                          currentRoute === item.route && !item.detailId
                            ? 'bg-blue-50 text-blue-900 font-medium'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Zone 3: Primary Search Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Search Portal</span>
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[80vh] overflow-y-auto px-4 py-4 space-y-5">
          <button
            type="button"
            onClick={() => handleSelect('home')}
            className="block w-full text-left font-medium text-slate-900 py-2 border-b border-slate-100"
          >
            Home Dashboard
          </button>
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-500 tracking-wide px-1">
                {group.label}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {group.items.map((item) => (
                  <button
                    key={`${item.route}-${item.detailId || ''}`}
                    type="button"
                    onClick={() => handleSelect(item.route, item.detailId)}
                    className="w-full text-left px-2 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
