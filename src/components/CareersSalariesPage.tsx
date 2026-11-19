import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { JobCareerPath, SalaryBenchmark } from '../types/portal';
import { DEFAULT_CAREERS } from '../data/iatAndCareersData';
import { compareSalaries } from '../utils/iiserLogic';

interface CareersSalariesPageProps {
  salaries: SalaryBenchmark[];
  initialTab?: 'careers' | 'salaries' | 'higher-ed';
}

export function CareersSalariesPage({ salaries, initialTab = 'careers' }: CareersSalariesPageProps) {
  const [activeTab, setActiveTab] = useState<'careers' | 'salaries' | 'higher-ed'>(initialTab);
  const [careerCategory, setCareerCategory] = useState<string>('All');
  const [sectorFilter, setSectorFilter] = useState<string>('All');

  const filteredCareers: JobCareerPath[] =
    careerCategory === 'All'
      ? DEFAULT_CAREERS
      : DEFAULT_CAREERS.filter((c) => c.category === careerCategory);

  const filteredSalaries = compareSalaries(salaries, sectorFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Careers, Pay Scales &amp; Higher Education
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          Jobs After IISER, Salary Explorer &amp; Global Ph.D. Pathways
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Explore research careers, government scientist roles (ISRO, DRDO, BARC, CSIR), private biotech/AI roles, realistic Indian &amp; international pay scales, and higher-education examinations.
        </p>
      </div>

      {/* Section Switcher */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl w-fit">
        {(
          [
            ['careers', 'Job Opportunities After IISER'],
            ['salaries', 'Salary & Pay Scale Explorer'],
            ['higher-ed', 'Higher Education & Exams'],
          ] as ['careers' | 'salaries' | 'higher-ed', string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Careers Section */}
      {activeTab === 'careers' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {['All', 'Research', 'Government', 'Private Sector', 'Academic', 'Other Careers'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCareerCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  careerCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {filteredCareers.map((job) => (
              <article key={job.id} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-blue-800">
                      {job.category} · {job.salaryDataType}
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 font-display mt-0.5">
                      {job.roleTitle}
                    </h2>
                  </div>
                  <div className="text-xs font-mono tabular-nums font-semibold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">
                    {job.salaryRangeIndia}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Responsibilities &amp; Qualifications</h3>
                    <p className="leading-relaxed">{job.responsibilities}</p>
                    <p className="text-xs text-slate-600 mt-2">
                      <strong>Qualification:</strong> {job.requiredQualifications}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Skills &amp; Recruitment Exams</h3>
                    <p className="text-xs text-slate-700">
                      <strong>Key Skills:</strong> {job.requiredSkills.join(', ')}
                    </p>
                    <p className="text-xs text-slate-700 mt-2">
                      <strong>Exams:</strong> {job.recruitmentExams}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      <strong>Further Degree:</strong> {job.additionalDegreesNeeded}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Employers, Growth &amp; Global Scope</h3>
                    <p className="text-xs text-slate-700">
                      <strong>Employers:</strong> {job.potentialEmployers.join(', ')}
                    </p>
                    <p className="text-xs text-slate-700 mt-2">
                      <strong>Growth:</strong> {job.careerGrowth}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      <strong>Global:</strong> {job.internationalOpportunities}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Salary Explorer Section */}
      {activeTab === 'salaries' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 font-display">
                  Interactive Salary &amp; Fellowship Comparison Explorer
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Clearly distinguishes <strong>Verified Official Govt/Fellowship Pay Scales</strong> from <strong>Estimated Industry CTC Ranges</strong>.
                </p>
              </div>
              <select
                aria-label="Filter salary sector"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
              >
                <option value="All">All Sectors</option>
                <option value="Fellowship / Academia">Fellowship / Academia</option>
                <option value="Government R&D">Government R&amp;D</option>
                <option value="Private Industry / Biotech">Private Industry / Biotech</option>
                <option value="Data Science & AI">Data Science &amp; AI</option>
                <option value="International Research">International Research</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                    <th className="py-3 px-4">Role &amp; Sector</th>
                    <th className="py-3 px-4">Entry-Level</th>
                    <th className="py-3 px-4">Mid-Career</th>
                    <th className="py-3 px-4">Experienced</th>
                    <th className="py-3 px-4">Verification &amp; Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSalaries.map((row) => (
                    <tr key={row.id} className="align-top">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{row.role}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{row.sector}</div>
                        <div className="text-xs text-slate-600 mt-1">{row.payStructureNote}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-900">
                        {row.entryLevel}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-800">
                        {row.midCareer}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-800">
                        {row.experienced}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-semibold text-blue-900">{row.verificationType}</div>
                        <div className="text-slate-500 mt-0.5">{row.sourceAndYear}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compensation Glossary */}
          <section className="bg-slate-100 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 font-display">
              Understanding Compensation Terms: CTC vs Gross vs Basic vs Fellowship
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700 leading-relaxed">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <strong className="text-slate-900 block mb-1">Basic Pay (Govt. 7th CPC)</strong>
                Core pay matrix component (e.g., ₹56,100 at Level 10). DA, HRA, and Transport Allowance are calculated on top of Basic Pay.
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <strong className="text-slate-900 block mb-1">Gross Salary vs In-Hand</strong>
                Gross includes Basic + DA + HRA + allowances before deductions. In-hand is net take-home after NPS/PF, professional tax, and income tax.
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <strong className="text-slate-900 block mb-1">Cost to Company (CTC)</strong>
                Total corporate employer outlay including base pay, employer PF/gratuity, insurance, performance bonus, and ESOPs/RSUs.
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <strong className="text-slate-900 block mb-1">Fellowship, Stipend &amp; Research Grant</strong>
                Monthly living support paid to Ph.D./Postdoc scholars (e.g. JRF ₹37,000 + HRA). Research grants / contingency funds are strictly for lab consumables, equipment, and conference travel.
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Higher Education Section */}
      {activeTab === 'higher-ed' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 font-display">
                Ph.D. in India vs Ph.D. Abroad
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Ph.D. in India:</strong> IISER BS-MS graduates with strong CGPA (often ≥ 8.0 from CFTIs) or national fellowships (CSIR-NET JRF, GATE, JEST) enter funded doctoral tracks at IISc, TIFR, NCBS, IITs, and IISERs with ₹37,000–₹42,000/month + HRA.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Ph.D. Abroad (US, Germany, Switzerland, UK, Japan):</strong> The 5-year IISER BS-MS with a 1-year thesis matches international Master&apos;s equivalence, enabling direct entry to funded doctoral programmes at ETH Zurich, Max Planck Institutes, MIT, Oxford, and Caltech (full tuition waiver + living stipend).
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 font-display">
                Research Internships &amp; Global Exchange
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                IISER undergraduates routinely win competitive summer fellowships including <strong>DAAD WISE</strong> (Germany), <strong>MITACS Globalink</strong> (Canada), <strong>Charpak</strong> (France), <strong>IASc-INSA-NASI Summer Research</strong>, and <strong>SN Bose / Khorana</strong> programmes, strengthening international Ph.D. applications.
              </p>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Key National &amp; International Entrance Examinations
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                    <th className="py-3 px-4">Examination</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Eligibility</th>
                    <th className="py-3 px-4">Official Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {[
                    ['CSIR-UGC NET', 'JRF Fellowship & Assistant Professor Eligibility (Sciences)', 'M.Sc. / BS-MS (final year or completed) with ≥55% (50% reserved)', 'https://csirnet.nta.ac.in'],
                    ['UGC NET', 'Assistant Professor & JRF in Humanities, Economics & Social Sciences', 'Master’s degree in relevant subject (≥55% / 50% reserved)', 'https://ugcnet.nta.ac.in'],
                    ['GATE', 'Ph.D. at IITs/IISc/IISERs, M.Tech., & PSU/DRDO Scientist recruitment', 'Bachelor’s (4-yr BS/B.Tech) or Master’s / 4th-yr BS-MS students', 'https://gate2025.iitr.ac.in'],
                    ['JEST', 'Ph.D. & Int-PhD in Physics & Theoretical Computer Science', 'M.Sc./BS-MS for Ph.D.; B.Sc. for Integrated Ph.D.', 'https://www.jest.org.in'],
                    ['TIFR GS', 'TIFR / NCBS / ICTS Ph.D. & Integrated Ph.D. admissions', 'B.Sc. / M.Sc. / BS-MS in Biology, Chem, Physics, Maths, CS', 'https://www.tifr.res.in'],
                    ['GRE / IELTS / TOEFL', 'International MS & Ph.D. applications (US, Europe, Singapore)', 'Undergraduate / BS-MS students (GRE optional at many US Bio/Chem depts)', 'https://www.ets.org'],
                  ].map(([exam, purpose, elig, url]) => (
                    <tr key={exam}>
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{exam}</td>
                      <td className="py-3 px-4 text-slate-700">{purpose}</td>
                      <td className="py-3 px-4 text-slate-700">{elig}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-800 hover:underline font-medium">
                          <span>Official site</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
