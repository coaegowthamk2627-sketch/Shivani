import { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import type { CmsPayload, PageRoute } from '../types/portal';
import {
  checkIatEligibility,
  compareSalaries,
  generateStudyPlan,
  matchScholarships,
  recommendCourses,
} from '../utils/iiserLogic';
import { IAT_EXAM_OVERVIEW } from '../data/iatAndCareersData';

interface ToolsHubPageProps {
  cmsData: CmsPayload;
  onNavigate: (route: PageRoute, detailId?: string) => void;
}

type ToolId =
  | 'eligibility'
  | 'planner'
  | 'college-compare'
  | 'course-finder'
  | 'salary-explorer'
  | 'career-roadmap'
  | 'scholarship-finder'
  | 'dates-calendar';

export function ToolsHubPage({ cmsData, onNavigate }: ToolsHubPageProps) {
  const [activeTool, setActiveTool] = useState<ToolId>('eligibility');

  // Tool 1: Eligibility
  const [passingYear, setPassingYear] = useState<number>(2026);
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [subjects, setSubjects] = useState<('Biology' | 'Chemistry' | 'Physics' | 'Mathematics')[]>([
    'Physics',
    'Chemistry',
    'Mathematics',
  ]);
  const [category, setCategory] = useState<'General' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST' | 'PwD'>('General');
  const [percentage, setPercentage] = useState<number>(82);
  const [nationality, setNationality] = useState<'Indian' | 'OCI/PIO' | 'Foreign National'>('Indian');

  // Tool 2: Study Planner
  const [monthsAvailable, setMonthsAvailable] = useState<3 | 6 | 12>(6);
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [strongSubjects, setStrongSubjects] = useState<string[]>(['Physics']);
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Biology']);

  // Tool 3: College Comparison
  const [compareIds, setCompareIds] = useState<string[]>(['iiser-pune', 'iiser-bhopal', 'iiser-kolkata']);

  // Tool 4: Course Finder
  const [cfStage, setCfStage] = useState<'Class 12' | 'Bachelor Graduate' | 'Master Graduate' | 'PhD Holder'>('Class 12');
  const [cfInterest, setCfInterest] = useState<string>('all');

  // Tool 5: Salary Explorer
  const [salSector, setSalSector] = useState<string>('All');

  // Tool 6: Career Roadmap
  const [roadmapTrack, setRoadmapTrack] = useState<'Biology' | 'Chemistry' | 'Physics' | 'Mathematics & Data Science' | 'Economics'>('Physics');

  // Tool 7: Scholarship Finder
  const [schDegree, setSchDegree] = useState<'UG (BS-MS / BS / B.Tech)' | 'PhD / Research' | 'International'>('UG (BS-MS / BS / B.Tech)');
  const [schCat, setSchCat] = useState<'General' | 'OBC' | 'EWS' | 'SC' | 'ST' | 'PwD'>('General');
  const [schIncome, setSchIncome] = useState<number>(5);

  const eligibilityResult = checkIatEligibility({
    passingYear,
    targetExamYear: targetYear,
    subjects,
    category,
    percentage,
    nationality,
  });

  const studyPlan = generateStudyPlan({
    targetYear,
    monthsAvailable,
    dailyHours,
    strongSubjects,
    weakSubjects,
  });

  const comparedInstitutions = cmsData.institutions.filter((i) => compareIds.includes(i.id));
  const matchedCourses = recommendCourses(cmsData.courses, cfInterest, cfStage);
  const filteredSalaries = compareSalaries(cmsData.salaries, salSector);
  const matchedScholarships = matchScholarships(cmsData.scholarships, {
    degreeLevel: schDegree,
    category: schCat,
    annualFamilyIncomeLakhs: schIncome,
  });

  const toggleSubject = (subj: 'Biology' | 'Chemistry' | 'Physics' | 'Mathematics') => {
    setSubjects((prev) => (prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]));
  };

  const toggleCompareId = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 2 ? prev.filter((x) => x !== id) : prev;
      }
      return prev.length >= 3 ? [...prev.slice(1), id] : [...prev, id];
    });
  };

  const ROADMAPS: Record<typeof roadmapTrack, { stage: string; detail: string }[]> = {
    Physics: [
      { stage: 'Years 1–2 (Foundation)', detail: 'Core Physics, Calculus, Linear Algebra, Electronics & Programming Labs' },
      { stage: 'Years 3–4 (Major)', detail: 'Quantum Mechanics, Condensed Matter, Astrophysics, Laser/Optics Labs + Summer Fellowships (IASc/DAAD)' },
      { stage: 'Year 5 (MS Thesis)', detail: 'Full-year thesis in Quantum Computing, High-Energy Physics, or Gravitational Waves' },
      { stage: 'Post-IISER Pathways', detail: 'Ph.D. (TIFR/IISc/Max Planck/US) · BARC OCES / ISRO ICRB Scientist · Quantitative Finance / Data Science' },
    ],
    Biology: [
      { stage: 'Years 1–2 (Foundation)', detail: 'Cell Biology, Biochemistry, Genetics, Chemistry & Biostatistics' },
      { stage: 'Years 3–4 (Major)', detail: 'Neurobiology, Immunology, Molecular Genomics, Ecology + National/International Summer Lab Projects' },
      { stage: 'Year 5 (MS Thesis)', detail: '1-Year Wet Lab or Computational Genomics / Structural Biology Thesis' },
      { stage: 'Post-IISER Pathways', detail: 'Ph.D. (NCBS/IISc/EMBL/US) · Pharma & Biotech R&D (Syngene/Biocon) · Bioinformatics / Patent Analysis' },
    ],
    Chemistry: [
      { stage: 'Years 1–2 (Foundation)', detail: 'Organic Mechanisms, Thermodynamics, Quantum Chemistry & Inorganic Labs' },
      { stage: 'Years 3–4 (Major)', detail: 'Catalysis, Organometallics, NMR Spectroscopy, Computational Chemistry & Green Synthesis' },
      { stage: 'Year 5 (MS Thesis)', detail: 'Independent Synthesis, Drug Discovery, or Energy Materials Thesis' },
      { stage: 'Post-IISER Pathways', detail: 'Ph.D. Globally · Pharmaceutical Process R&D · CSIR / DRDO / ONGC Chemist · Specialty Chemicals' },
    ],
    'Mathematics & Data Science': [
      { stage: 'Years 1–2 (Foundation)', detail: 'Real Analysis, Abstract Algebra, Probability & Python/C++ Computing' },
      { stage: 'Years 3–4 (Major)', detail: 'Topology, PDEs, Machine Learning, Statistical Inference & Optimization' },
      { stage: 'Year 5 (MS Thesis)', detail: 'Pure Mathematics Research or Applied AI/Quantitative Modelling Thesis' },
      { stage: 'Post-IISER Pathways', detail: 'Ph.D. (TIFR/IMSc/CMI/Abroad) · Data Scientist & AI Engineer · Quantitative Researcher' },
    ],
    Economics: [
      { stage: 'Years 1–2 (Foundation)', detail: 'Micro/Macroeconomics, Calculus, Probability & Scientific Computing (IISER Bhopal BS / Tirupati)' },
      { stage: 'Years 3–4 (Major)', detail: 'Econometrics, Game Theory, Development Economics & Capstone Research Project' },
      { stage: 'Post-IISER Pathways', detail: 'Ph.D. in Economics/Finance · RBI / NITI Aayog / Think-Tanks · Risk & Analytics Consulting' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Interactive Student Utilities
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          8 Interactive Tools for Aspirants, Students &amp; Career Planning
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Check your IAT eligibility, generate a personalized PCMB study schedule, compare IISER campuses side by side, discover courses and scholarships, and explore career roadmaps.
        </p>
      </div>

      {/* Tool Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {(
          [
            ['eligibility', '1. IAT Eligibility Checker'],
            ['planner', '2. IAT Study Planner'],
            ['college-compare', '3. IISER College Compare'],
            ['course-finder', '4. Course Finder'],
            ['salary-explorer', '5. Salary Explorer'],
            ['career-roadmap', '6. Career Roadmap'],
            ['scholarship-finder', '7. Scholarship Finder'],
            ['dates-calendar', '8. Important Dates'],
          ] as [ToolId, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTool(id)}
            className={`px-3.5 py-2.5 text-left text-xs sm:text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
              activeTool === id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tool 1: IAT Eligibility Checker */}
      {activeTool === 'eligibility' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Tool 1: IAT Eligibility Checker
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Verify whether your Class 12 passing year, subjects, and marks meet published IAT criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label htmlFor="elig-target" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target IAT Examination Year
              </label>
              <select
                id="elig-target"
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value={2026}>IAT 2026</option>
                <option value={2027}>IAT 2027</option>
              </select>
            </div>

            <div>
              <label htmlFor="elig-passing" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Class 12 Passing / Appearing Year
              </label>
              <select
                id="elig-passing"
                value={passingYear}
                onChange={(e) => setPassingYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                {[2022, 2023, 2024, 2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="elig-cat" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reservation Category
              </label>
              <select
                id="elig-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value="General">General</option>
                <option value="OBC-NCL">OBC-NCL</option>
                <option value="EWS">Gen-EWS</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="PwD">PwD</option>
              </select>
            </div>

            <div>
              <label htmlFor="elig-pct" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Class 12 Aggregate Percentage (%)
              </label>
              <input
                id="elig-pct"
                type="number"
                min={0}
                max={100}
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="elig-nat" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nationality Status
              </label>
              <select
                id="elig-nat"
                value={nationality}
                onChange={(e) => setNationality(e.target.value as typeof nationality)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value="Indian">Indian National</option>
                <option value="OCI/PIO">OCI / PIO Cardholder</option>
                <option value="Foreign National">Foreign National</option>
              </select>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1.5">
                Class 12 Science Subjects Studied
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Physics', 'Chemistry', 'Mathematics', 'Biology'] as const).map((subj) => {
                  const active = subjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                        active
                          ? 'bg-blue-800 text-white border-blue-800'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Eligibility Output */}
          <div
            data-testid="eligibility-output"
            className={`p-5 rounded-xl border ${
              eligibilityResult.eligibleForBsMs
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            } space-y-2`}
          >
            <div className="flex items-center gap-2 font-semibold text-base">
              {eligibilityResult.eligibleForBsMs ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" aria-hidden="true" />
              )}
              <span>
                {eligibilityResult.eligibleForBsMs
                  ? 'Appears Eligible for IAT 5-Year BS-MS Dual Degree'
                  : 'Does Not Meet Published Baseline IAT Criteria'}
              </span>
            </div>
            <div className="text-xs font-medium">
              Required Minimum Percentage ({category}): {eligibilityResult.requiredPercentage}% · B.Tech / BS Economics Eligible:{' '}
              {eligibilityResult.eligibleForBTechOrEcon ? 'Yes (Class 12 Maths present)' : 'No (Requires Class 12 Mathematics)'}
            </div>
            {eligibilityResult.reasons.length > 0 && (
              <ul className="list-disc pl-5 text-xs space-y-1">
                {eligibilityResult.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
            {eligibilityResult.notes.length > 0 && (
              <ul className="list-disc pl-5 text-xs space-y-1">
                {eligibilityResult.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
            <p className="text-xs text-slate-700 pt-2 border-t border-black/10">
              Disclaimer: Final eligibility is determined solely by the official IISER Admission Authority in the active year&apos;s Information Brochure at iiseradmission.in.
            </p>
          </div>
        </section>
      )}

      {/* Tool 2: Study Planner */}
      {activeTool === 'planner' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Tool 2: Personalized IAT Preparation Planner
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Generates a weighted study schedule allocating extra daily hours to your weak or non-board 4th subject.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="plan-months" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Available Preparation Window
              </label>
              <select
                id="plan-months"
                value={monthsAvailable}
                onChange={(e) => setMonthsAvailable(Number(e.target.value) as 3 | 6 | 12)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value={12}>12 Months (Full Plan)</option>
                <option value={6}>6 Months (Accelerated)</option>
                <option value={3}>3 Months (Final Revision)</option>
              </select>
            </div>
            <div>
              <label htmlFor="plan-hours" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Daily Self-Study Hours ({dailyHours}h)
              </label>
              <input
                id="plan-hours"
                type="range"
                min={2}
                max={12}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full accent-blue-800 mt-2"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1.5">Strong Subjects</div>
              <div className="flex flex-wrap gap-1.5">
                {['Biology', 'Chemistry', 'Physics', 'Mathematics'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setStrongSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
                    }
                    className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                      strongSubjects.includes(s) ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    {s.slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1.5">Weak / Priority Subjects</div>
              <div className="flex flex-wrap gap-1.5">
                {['Biology', 'Chemistry', 'Physics', 'Mathematics'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setWeakSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
                    }
                    className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                      weakSubjects.includes(s) ? 'bg-blue-800 text-white border-blue-800' : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    {s.slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {studyPlan.map((block) => (
              <div key={block.phase} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-mono text-blue-800 font-semibold">{block.durationLabel}</div>
                <h3 className="text-base font-semibold text-slate-900">{block.phase}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{block.focus}</p>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                  <div className="font-semibold text-slate-900">Recommended Daily Hours:</div>
                  {block.dailyAllocation.map((a) => (
                    <div key={a.subject} className="flex justify-between font-mono tabular-nums">
                      <span className="font-sans text-slate-700">{a.subject}</span>
                      <span className="font-semibold text-slate-900">{a.hours}h/day</span>
                    </div>
                  ))}
                </div>
                <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                  {block.milestones.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tool 3: College Comparison */}
      {activeTool === 'college-compare' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Tool 3: IISER College Comparison Tool (Select 2–3 Campuses)
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {cmsData.institutions.map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => toggleCompareId(inst.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                    compareIds.includes(inst.id)
                      ? 'bg-blue-800 text-white border-blue-800'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {inst.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-slate-700">Attribute</th>
                  {comparedInstitutions.map((inst) => (
                    <th key={inst.id} className="py-3 px-4 font-semibold text-slate-900 text-sm">
                      {inst.shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-700">Established &amp; Location</td>
                  {comparedInstitutions.map((i) => (
                    <td key={i.id} className="py-3 px-4 font-mono tabular-nums">
                      {i.establishedYear} · {i.city}, {i.state}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-700">UG Programmes</td>
                  {comparedInstitutions.map((i) => (
                    <td key={i.id} className="py-3 px-4">{i.ugProgrammes.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-700">Departments</td>
                  {comparedInstitutions.map((i) => (
                    <td key={i.id} className="py-3 px-4">{i.departments.join(' · ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-700">Key Research Labs</td>
                  {comparedInstitutions.map((i) => (
                    <td key={i.id} className="py-3 px-4">{i.researchLabs.join(' · ')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-700">Placement Snapshot</td>
                  {comparedInstitutions.map((i) => {
                    const pl = cmsData.placements.find((p) => p.institutionId === i.id);
                    return (
                      <td key={i.id} className="py-3 px-4">
                        {pl ? `${pl.medianSalary} (${pl.higherStudiesCount})` : 'Verify CDC'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-700">Profile &amp; Site</td>
                  {comparedInstitutions.map((i) => (
                    <td key={i.id} className="py-3 px-4 space-x-3">
                      <button
                        type="button"
                        onClick={() => onNavigate('institution-detail', i.id)}
                        className="text-blue-800 font-semibold hover:underline cursor-pointer"
                      >
                        Full Profile
                      </button>
                      <a
                        href={i.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:underline"
                      >
                        Website
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tool 4: Course Finder */}
      {activeTool === 'course-finder' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
          <h2 className="text-2xl font-semibold text-slate-900 font-display">
            Tool 4: Course &amp; Programme Finder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              aria-label="Academic stage"
              value={cfStage}
              onChange={(e) => setCfStage(e.target.value as typeof cfStage)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="Class 12">Class 12 Student</option>
              <option value="Bachelor Graduate">B.Sc. / B.Tech. Graduate</option>
              <option value="Master Graduate">M.Sc. / BS-MS Graduate</option>
              <option value="PhD Holder">Ph.D. Holder</option>
            </select>
            <select
              aria-label="Academic interest"
              value={cfInterest}
              onChange={(e) => setCfInterest(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Scientific Fields</option>
              <option value="biology">Biology</option>
              <option value="chemistry">Chemistry</option>
              <option value="physics">Physics</option>
              <option value="data science">Data Science / AI</option>
              <option value="economics">Economics</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedCourses.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="text-base font-semibold text-slate-900">{c.title}</div>
                <div className="text-xs text-blue-800">{c.duration} · {c.offeredAt.join(', ')}</div>
                <p className="text-xs text-slate-700">{c.curriculumSummary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tool 5: Salary Explorer */}
      {activeTool === 'salary-explorer' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Tool 5: Science Career Salary Explorer
            </h2>
            <select
              aria-label="Filter sector"
              value={salSector}
              onChange={(e) => setSalSector(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="All">All Sectors</option>
              <option value="Fellowship / Academia">Fellowship / Academia</option>
              <option value="Government R&D">Government R&amp;D</option>
              <option value="Private Industry / Biotech">Private Industry / Biotech</option>
              <option value="Data Science & AI">Data Science &amp; AI</option>
              <option value="International Research">International Research</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSalaries.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-xs text-blue-800 font-semibold">{s.verificationType}</div>
                <div className="text-base font-semibold text-slate-900">{s.role}</div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums pt-1">
                  <div><span className="text-slate-500 block font-sans">Entry</span>{s.entryLevel}</div>
                  <div><span className="text-slate-500 block font-sans">Mid</span>{s.midCareer}</div>
                  <div><span className="text-slate-500 block font-sans">Senior</span>{s.experienced}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tool 6: Career Roadmap Generator */}
      {activeTool === 'career-roadmap' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 font-display">
                Tool 6: Career Roadmap Generator
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Visualize progression from BS-MS entry to research, government, or corporate careers.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(ROADMAPS) as (keyof typeof ROADMAPS)[]).map((track) => (
                <button
                  key={track}
                  type="button"
                  onClick={() => setRoadmapTrack(track)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                    roadmapTrack === track ? 'bg-blue-800 text-white border-blue-800' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROADMAPS[roadmapTrack].map((step, i) => (
              <div key={step.stage} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-mono text-blue-800 font-semibold">
                  Step 0{i + 1}
                </div>
                <div className="text-sm font-semibold text-slate-900">{step.stage}</div>
                <p className="text-xs text-slate-700 leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tool 7: Scholarship Finder */}
      {activeTool === 'scholarship-finder' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
          <h2 className="text-2xl font-semibold text-slate-900 font-display">
            Tool 7: Scholarship Eligibility Finder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              aria-label="Degree level"
              value={schDegree}
              onChange={(e) => setSchDegree(e.target.value as typeof schDegree)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="UG (BS-MS / BS / B.Tech)">UG (BS-MS / BS / B.Tech)</option>
              <option value="PhD / Research">Ph.D. / Research</option>
              <option value="International">International Mobility</option>
            </select>
            <select
              aria-label="Category"
              value={schCat}
              onChange={(e) => setSchCat(e.target.value as typeof schCat)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="General">General</option>
              <option value="EWS">Gen-EWS</option>
              <option value="OBC">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="PwD">PwD</option>
            </select>
            <input
              aria-label="Family income in lakhs"
              type="number"
              min={0}
              max={50}
              value={schIncome}
              onChange={(e) => setSchIncome(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
            />
          </div>
          <div className="space-y-3">
            {matchedScholarships.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{s.benefitsAndAmount}</div>
                </div>
                <a
                  href={s.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline shrink-0"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tool 8: Important Dates Calendar */}
      {activeTool === 'dates-calendar' && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Tool 8: Admission, Fellowship &amp; Recruitment Calendar
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('news')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline cursor-pointer"
            >
              <span>Live News &amp; Notices</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="divide-y divide-slate-200 text-sm">
            {IAT_EXAM_OVERVIEW.importantDates.map((d) => (
              <div key={d.milestone} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-medium text-slate-900">{d.milestone}</div>
                <div className="text-xs text-slate-600 font-mono">{d.status}</div>
              </div>
            ))}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-medium text-slate-900">CSIR-UGC NET Cycles (PhD JRF)</div>
              <div className="text-xs text-slate-600 font-mono">June &amp; December Cycles (csirnet.nta.ac.in)</div>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-medium text-slate-900">INSPIRE-SHE &amp; NSP Scholarship Windows</div>
              <div className="text-xs text-slate-600 font-mono">August – November Annually</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
