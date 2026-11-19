import { ArrowRight, ExternalLink } from 'lucide-react';
import type { PageRoute } from '../types/portal';
import { PORTAL_IMAGES } from '../data/iiserInstitutionsData';
import { SafeImage } from './SafeImage';

interface AboutPageProps {
  onNavigate: (route: PageRoute, detailId?: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
            About IISER
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
            India&apos;s Flagship Network for Integrated Science Education &amp; Frontier Research
          </h1>
          <p className="text-base text-slate-700 leading-relaxed">
            Recommended by the Scientific Advisory Council to the Prime Minister (SAC-PM) chaired by Prof. C.N.R. Rao, the Indian Institutes of Science Education and Research (IISERs) were conceived to create institutions for basic sciences comparable in stature to the IITs in engineering.
          </p>
          <p className="text-base text-slate-700 leading-relaxed">
            Under the <strong>National Institutes of Technology, Science Education and Research (Amendment) Act, 2012</strong>, Parliament recognized IISERs as <strong>Institutions of National Importance (INI)</strong>, empowering them to award their own BS-MS, BS, B.Tech, M.Sc., and Ph.D. degrees autonomously.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('institutions')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
            >
              <span>Explore all 7 IISER campuses</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href="https://www.education.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-800 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span>Ministry of Education</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200">
            <SafeImage
              src={PORTAL_IMAGES.labResearch}
              alt="Research instrumentation and optical physics bench at an Indian science institute"
              className="w-full h-full object-cover"
              fallbackTitle="IISER Research Infrastructure"
            />
          </div>
        </div>
      </div>

      {/* Historical Timeline */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 font-display">
          Establishment Timeline Across India (2006–2016)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { year: '2006', campuses: 'IISER Pune & IISER Kolkata', desc: 'First two IISERs established by the Ministry of Human Resource Development.' },
            { year: '2007', campuses: 'IISER Mohali', desc: 'Third IISER founded in Punjab’s Knowledge City near Chandigarh.' },
            { year: '2008', campuses: 'IISER Bhopal & IISER TVM', desc: 'Expanded to Madhya Pradesh and Kerala; Bhopal later pioneered Engineering & Economic Sciences.' },
            { year: '2015–2016', campuses: 'IISER Tirupati & IISER Berhampur', desc: 'Newest generation IISERs established in Andhra Pradesh and Odisha with modern permanent campuses.' },
          ].map((item) => (
            <div key={item.year} className="pt-4 border-t border-slate-200">
              <div className="text-lg font-semibold text-blue-800 font-mono tabular-nums">{item.year}</div>
              <div className="text-base font-semibold text-slate-900 mt-1">{item.campuses}</div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role in Indian Scientific Development & Why Choose IISER */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Role in India&apos;s Scientific Development
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            IISERs anchor India&apos;s basic science talent pipeline, producing thousands of researchers contributing to ISRO space missions (such as solar weather research at CESSI, IISER Kolkata), DST quantum technology hubs (I-HUB at IISER Pune), monsoon &amp; climate forecasting, infectious disease genomics, and sustainable energy materials.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Why Students Choose IISER Over Traditional Degrees
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Students gain direct access to world-class instrumentation, mandatory 1-year research theses, interdisciplinary electives (combining e.g. Biology with Data Science), vibrant residential campuses, and a 5-year dual BS-MS credential respected globally for direct Ph.D. admissions and technical R&amp;D careers.
          </p>
        </div>
      </section>
    </div>
  );
}
