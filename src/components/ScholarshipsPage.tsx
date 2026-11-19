import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Scholarship } from '../types/portal';
import { matchScholarships } from '../utils/iiserLogic';

interface ScholarshipsPageProps {
  scholarships: Scholarship[];
}

export function ScholarshipsPage({ scholarships }: ScholarshipsPageProps) {
  const [degreeLevel, setDegreeLevel] = useState<'UG (BS-MS / BS / B.Tech)' | 'PhD / Research' | 'International'>('UG (BS-MS / BS / B.Tech)');
  const [category, setCategory] = useState<'General' | 'OBC' | 'EWS' | 'SC' | 'ST' | 'PwD'>('General');
  const [income, setIncome] = useState<number>(6);
  const [showAll, setShowAll] = useState<boolean>(true);

  const matched = matchScholarships(scholarships, {
    degreeLevel,
    category,
    annualFamilyIncomeLakhs: income,
  });

  const displayed = showAll ? scholarships : matched;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Financial Assistance &amp; Fellowships
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          Scholarships &amp; Research Fellowships Centre
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Explore INSPIRE-SHE, National Scholarship Portal (NSP) schemes, SC/ST/PwD tuition waivers, CSIR/UGC/DBT PhD fellowships, and international mobility grants. Eligibility and funding amounts depend on individual scheme regulations and current government circulars.
        </p>
      </div>

      {/* Interactive Scholarship Finder */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 font-display">
              Interactive Scholarship Finder
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Filter schemes relevant to your degree stage, category, and family income.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                !showAll ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Show Matched ({matched.length})
            </button>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                showAll ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Show All ({scholarships.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sch-degree" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Programme Stage
            </label>
            <select
              id="sch-degree"
              value={degreeLevel}
              onChange={(e) => {
                setDegreeLevel(e.target.value as typeof degreeLevel);
                setShowAll(false);
              }}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
            >
              <option value="UG (BS-MS / BS / B.Tech)">UG (BS-MS / BS / B.Tech)</option>
              <option value="PhD / Research">Ph.D. / Integrated Ph.D. Research</option>
              <option value="International">International Internships &amp; Ph.D.</option>
            </select>
          </div>

          <div>
            <label htmlFor="sch-category" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <select
              id="sch-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as typeof category);
                setShowAll(false);
              }}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
            >
              <option value="General">General</option>
              <option value="EWS">Gen-EWS</option>
              <option value="OBC">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="PwD">PwD</option>
            </select>
          </div>

          <div>
            <label htmlFor="sch-income" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Annual Family Income (₹ Lakhs): <span className="font-mono">{income}L</span>
            </label>
            <input
              id="sch-income"
              type="range"
              min={1}
              max={20}
              value={income}
              onChange={(e) => {
                setIncome(Number(e.target.value));
                setShowAll(false);
              }}
              className="w-full accent-blue-800 mt-2"
            />
          </div>
        </div>
      </section>

      {/* Scholarship Cards */}
      <div className="space-y-6">
        {displayed.map((sch) => (
          <article key={sch.id} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-blue-800">{sch.category}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{sch.provider}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 font-display mt-1">
                  {sch.name}
                </h3>
              </div>
              <a
                href={sch.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
              >
                <span>Official Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-700">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Eligibility Criteria</h4>
                <p className="leading-relaxed">{sch.eligibility}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Financial Benefits &amp; Duration</h4>
                <p className="font-medium text-slate-900">{sch.benefitsAndAmount}</p>
                <p className="text-xs text-slate-600 mt-1.5">Duration: {sch.duration}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Application &amp; Timeline</h4>
                <p className="leading-relaxed">{sch.applicationProcedure}</p>
                <p className="text-xs text-slate-600 mt-1.5">Dates: {sch.importantDates}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900">Required Documents:</strong> {sch.requiredDocuments.join(' · ')}
              </div>
              <div className="text-slate-500 shrink-0">{sch.lastUpdated}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
