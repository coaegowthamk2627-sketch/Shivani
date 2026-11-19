import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Compass,
  ExternalLink,
  FileText,
  FlaskConical,
  GraduationCap,
  Scale,
  TrendingUp,
} from 'lucide-react';
import type { CmsPayload, PageRoute } from '../types/portal';
import { PORTAL_IMAGES } from '../data/iiserInstitutionsData';
import { SafeImage } from './SafeImage';

interface HomePageProps {
  cmsData: CmsPayload;
  onNavigate: (route: PageRoute, detailId?: string) => void;
}

export function HomePage({ cmsData, onNavigate }: HomePageProps) {
  const exploreCards: {
    title: string;
    subtitle: string;
    route: PageRoute;
    icon: typeof Building2;
    actionText: string;
  }[] = [
    {
      title: 'Explore IISER Institutions',
      subtitle: 'Dedicated guides for Pune, Kolkata, Mohali, Bhopal, TVM, Tirupati & Berhampur.',
      route: 'institutions',
      icon: Building2,
      actionText: 'View 7 campuses',
    },
    {
      title: 'IISER Entrance Examination',
      subtitle: 'Complete IAT syllabus, eligibility, CBT pattern, study plans & cut-off trends.',
      route: 'iat',
      icon: FileText,
      actionText: 'Explore IAT guide',
    },
    {
      title: 'Courses and Degrees',
      subtitle: '5-Year BS-MS, 4-Year BS, B.Tech, M.Sc., Integrated Ph.D. & Doctoral tracks.',
      route: 'courses',
      icon: BookOpen,
      actionText: 'Browse programmes',
    },
    {
      title: 'Admission and Counselling',
      subtitle: 'Application steps, seat matrix, document checklist & institute-wise fee comparison.',
      route: 'admission',
      icon: Compass,
      actionText: 'Check admission',
    },
    {
      title: 'Placements and Salary',
      subtitle: 'Honest NIRF placement data, Career Development Cells & verified pay scales.',
      route: 'placements',
      icon: TrendingUp,
      actionText: 'View placement stats',
    },
    {
      title: 'Career Opportunities',
      subtitle: 'R&D, ISRO/DRDO/BARC, biotech, AI/data science, academia & policy pathways.',
      route: 'careers',
      icon: Briefcase,
      actionText: 'Explore careers',
    },
    {
      title: 'Research and PhD',
      subtitle: 'National laboratories, Centres of Excellence, CSIR-NET/GATE & Ph.D. abroad.',
      route: 'research',
      icon: FlaskConical,
      actionText: 'Discover research',
    },
    {
      title: 'Scholarships',
      subtitle: 'INSPIRE-SHE, NSP schemes, SC/ST/PwD tuition waivers & international fellowships.',
      route: 'scholarships',
      icon: Award,
      actionText: 'Find scholarships',
    },
    {
      title: 'IISER vs IIT vs NISER vs IISc',
      subtitle: 'Objective multi-criteria comparison tailored to science and career goals.',
      route: 'comparison',
      icon: Scale,
      actionText: 'Compare institutes',
    },
    {
      title: 'Previous Year Question Papers',
      subtitle: 'Sample IAT practice drills, NCERT booklists & interactive preparation planner.',
      route: 'iat',
      icon: GraduationCap,
      actionText: 'Practice & prepare',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs sm:text-sm font-medium tracking-wide text-blue-300">
                  Independent Academic &amp; Career Knowledge Hub · India
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight font-display">
                  Your Complete Roadmap to India&apos;s Premier Science and Research Institutions.
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  From Class 12 IAT preparation and campus admissions to BS-MS, B.Tech, scholarships, verified NIRF placement data, government scientist pay scales, and global doctoral pathways across all seven IISERs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('iat')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
                >
                  <span>Explore IAT &amp; Admissions</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('tools')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-medium text-sm rounded-lg transition-colors cursor-pointer"
                >
                  <span>Eligibility &amp; Study Tools</span>
                </button>
                <a
                  href="https://www.iiseradmission.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-300 hover:text-white transition-colors"
                >
                  <span>Official iiseradmission.in</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 relative">
                <SafeImage
                  src={PORTAL_IMAGES.heroCampus}
                  alt="Modern Indian science and research campus courtyard and laboratory architecture"
                  className="w-full h-full object-cover"
                  fallbackTitle="IISER Research Campuses Across India"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4">
                  <p className="text-xs text-slate-200">
                    Institutions of National Importance · NITSER Act, Govt. of India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Full-Width Key Facts Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums">7</div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Autonomous IISER Campuses (Est. 2006–2016)
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums">240</div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Total Marks in CBT IISER Aptitude Test (60 MCQs)
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums">55–65%+</div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Graduates Pursuing Ph.D. &amp; Research Worldwide
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums">₹37k–₹58k</div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Monthly DST/CSIR JRF to Postdoc Stipend (+ HRA)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is IISER & Why Choose IISER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
              Institutional Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">
              What is IISER &amp; Why Is It India&apos;s Premier Science Ecosystem?
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              The <strong>Indian Institutes of Science Education and Research (IISERs)</strong> are a network of seven autonomous public research universities established by the Ministry of Education, Government of India, beginning in 2006 with IISER Pune and IISER Kolkata.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              Declared <strong>Institutions of National Importance (INI)</strong> under the NITSER (Amendment) Act, 2012, IISERs were created to bridge a historic gap in Indian higher education: combining rigorous undergraduate teaching directly with frontier laboratory research. Unlike conventional degree colleges, students learn Physics, Chemistry, Biology, Mathematics, Earth Sciences, and Data Science together before specializing with a full-year Master&apos;s research thesis.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950 cursor-pointer"
              >
                <span>Read full history &amp; national science mandate</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 font-display">
              Core Academic Pillars at Every IISER
            </h3>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-900 block">Interdisciplinary Foundation</span>
                Compulsory first-year/two-year exposure across Biology, Chemistry, Physics, Maths, and Computing.
              </li>
              <li className="pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-900 block">Research From Semester One</span>
                Direct mentorship by Ph.D.-qualified active scientists, access to NMR, TEM, XRD, and HPC clusters.
              </li>
              <li className="pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-900 block">Diverse Career &amp; Doctoral Pathways</span>
                Equally strong springboard for funded Ph.D.s abroad/India, ISRO/DRDO/BARC scientist exams, and AI/biotech R&amp;D.
              </li>
              <li>
                <span className="font-semibold text-slate-900 block">Scholarships &amp; Fee Waivers</span>
                100% tuition waiver for SC/ST/PwD students and eligibility for INSPIRE-SHE &amp; NSP scholarships.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 10 Portal Exploration Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
              Portal Directory
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display mt-1">
              Explore Every Stage of Your IISER Journey
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tools')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-800 hover:text-blue-950 cursor-pointer shrink-0"
          >
            <span>Open all 8 interactive student tools</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {exploreCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                type="button"
                onClick={() => onNavigate(card.route)}
                className="group text-left bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div>
                  <Icon className="w-5 h-5 text-blue-800 mb-3" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-900 font-sans">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1 text-xs font-semibold text-blue-800">
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Seven IISER Campuses Strip */}
      <section className="bg-slate-100 border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
                Pan-India Network
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display mt-1">
                The Seven IISER Campuses
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('institutions')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:text-blue-950 cursor-pointer"
            >
              <span>Compare all 7 institutions</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cmsData.institutions.map((inst) => (
              <div
                key={inst.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums">
                    Est. {inst.establishedYear} · {inst.state}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1 font-display">
                    {inst.shortName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5">{inst.city}</p>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {inst.ugProgrammes.join(' · ')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('institution-detail', inst.id)}
                    className="text-xs font-semibold text-blue-800 hover:text-blue-950 cursor-pointer"
                  >
                    Campus profile →
                  </button>
                  <a
                    href={inst.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <span>Official site</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates & Official Notifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
              Latest Announcements
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display mt-1">
              Admission, Exam, Research &amp; Recruitment Updates
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('news')}
              className="text-sm font-semibold text-blue-800 hover:text-blue-950 cursor-pointer"
            >
              View all updates →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Manage in CMS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cmsData.news.slice(0, 6).map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-blue-800">{item.category}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="font-mono tabular-nums">{item.date}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  {item.sourceType} · {item.sourceName}
                </span>
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-800 hover:text-blue-950 shrink-0"
                >
                  <span>Source</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
