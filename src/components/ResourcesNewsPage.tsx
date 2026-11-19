import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { NewsNotification } from '../types/portal';
import { OFFICIAL_DIRECTORY_LINKS } from '../data/iatAndCareersData';

interface ResourcesNewsPageProps {
  news: NewsNotification[];
  initialSection?: 'resources' | 'news';
}

const FAQS = [
  {
    q: 'Can PCB (Biology without Mathematics) students apply for IISER via IAT?',
    a: 'Yes. Candidates with Physics, Chemistry, and Biology in Class 12 are eligible for the 5-Year BS-MS Dual Degree across all 7 IISERs. However, Class 12 Mathematics is mandatory for IISER Bhopal’s 4-Year B.Tech. and BS Economic Sciences programmes.',
  },
  {
    q: 'Are JEE Advanced or KVPY scores still accepted for IISER admission?',
    a: 'No. KVPY was subsumed under INSPIRE and the JEE Advanced channel was discontinued from 2024 onwards. The IISER Aptitude Test (IAT) is the sole centralized entrance exam for IISER UG admissions.',
  },
  {
    q: 'Is it mandatory to attempt all four subjects in IAT?',
    a: 'All four sections (Biology, Chemistry, Physics, Mathematics — 15 MCQs each, 240 total marks) appear in the CBT paper and contribute to your total rank. Attempting strong areas in your 4th subject significantly improves rank.',
  },
  {
    q: 'Do all IISER graduates get corporate campus placements?',
    a: 'IISERs are primarily scientific research universities. Roughly 55%–65%+ of BS-MS graduates choose funded Ph.D. programmes in India or abroad, while others take up roles in data analytics, biotech/pharma R&D, consulting, or B.Tech./BS industry placements.',
  },
];

export function ResourcesNewsPage({ news, initialSection = 'resources' }: ResourcesNewsPageProps) {
  const [linkCategory, setLinkCategory] = useState<string>('All');
  const [newsCategory, setNewsCategory] = useState<string>('All');

  const filteredLinks =
    linkCategory === 'All'
      ? OFFICIAL_DIRECTORY_LINKS
      : OFFICIAL_DIRECTORY_LINKS.filter((l) => l.category === linkCategory);

  const filteredNews =
    newsCategory === 'All' ? news : news.filter((n) => n.category === newsCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Latest News & Notifications */}
      <section className={initialSection === 'news' ? 'space-y-6' : 'space-y-6 order-2'}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
              Latest Updates &amp; Notifications
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
              Official IISER Announcements, IAT &amp; Career Updates
            </h1>
          </div>
          <select
            aria-label="Filter news category"
            value={newsCategory}
            onChange={(e) => setNewsCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 shrink-0"
          >
            <option value="All">All Categories</option>
            {[
              'IAT Announcements',
              'Admission & Counselling',
              'Results & Cut-offs',
              'Scholarships',
              'Research Achievements',
              'Placements',
              'Job & Faculty Recruitment',
              'PhD & Internships',
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((item) => (
            <article key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-blue-800">{item.category}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="font-mono tabular-nums">{item.date}</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 mt-2 leading-snug">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.summary}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  {item.sourceType} · {item.sourceName}
                </span>
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-800 hover:underline shrink-0"
                >
                  <span>Verify Source</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Central Official Website & Resource Directory */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
              Verified Primary Sources
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">
              Central Official Website &amp; Portal Directory
            </h2>
          </div>
          <select
            aria-label="Filter official directory category"
            value={linkCategory}
            onChange={(e) => setLinkCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 shrink-0"
          >
            <option value="All">All Official Portals</option>
            <option value="IISER Campuses & Admission">IISER Campuses &amp; Admission</option>
            <option value="Government & Regulators">Government &amp; Regulators</option>
            <option value="Science Agencies & Fellowships">Science Agencies &amp; Fellowships</option>
            <option value="PhD & Higher Ed Exams">PhD &amp; Higher Ed Exams</option>
            <option value="Govt R&D Recruiters">Govt R&amp;D Recruiters</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((lnk) => (
            <a
              key={lnk.id}
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="text-xs text-slate-500">{lnk.category}</div>
                <div className="text-base font-semibold text-slate-900 group-hover:text-blue-900 mt-1">
                  {lnk.name}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{lnk.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                <span>{lnk.url.replace('https://', '')}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <h2 className="text-2xl font-semibold text-slate-900 font-display">
          Frequently Asked Questions (FAQs)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-900">{f.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
