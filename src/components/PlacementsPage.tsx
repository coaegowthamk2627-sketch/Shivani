import { ExternalLink } from 'lucide-react';
import type { Institution, PlacementRecord } from '../types/portal';

interface PlacementsPageProps {
  placements: PlacementRecord[];
  institutions: Institution[];
}

export function PlacementsPage({ placements, institutions }: PlacementsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Placements &amp; Career Outcomes
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          IISER Placements, Higher Studies &amp; Campus Recruitment
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Understanding IISER placement statistics requires context: unlike engineering colleges, the majority of IISER BS-MS graduates choose funded Ph.D. and research fellowships worldwide, while a growing cohort enters industry R&amp;D, data science, pharma, consulting, and B.Tech./BS corporate placements.
        </p>
      </div>

      {/* Transparency Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 text-sm text-slate-800 space-y-2">
        <div className="font-semibold text-slate-900">Data Accuracy &amp; Verification Standard</div>
        <p className="leading-relaxed">
          We never fabricate placement percentages, highest CTC figures, or unverified recruiter claims. Where an IISER publishes overall 5-year UG median figures in official NIRF submissions, the academic year and source are cited below. Where detailed branch-wise, highest, or minimum salary packages are not publicly released by the institute, this portal explicitly states <strong>&ldquo;Official data not publicly available&rdquo;</strong>.
        </p>
      </div>

      {/* How IISER Placements Work: Degree Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: '5-Year BS-MS Cohorts',
            desc: '55%–65%+ typically progress to Ph.D. programs in India (IISc, TIFR, IISERs) or abroad (US, Germany, UK, Switzerland). Remaining graduates join analytics, pharma/biotech R&D, ed-tech, and consulting.',
          },
          {
            title: '4-Year B.Tech & BS (Bhopal)',
            desc: 'IISER Bhopal’s B.Tech (ChemE, DSE, EECS) and BS (Economic Sciences) cohorts actively participate in campus corporate placements across software, AI/ML, core engineering, and quantitative analytics.',
          },
          {
            title: '2-Year M.Sc. Cohorts',
            desc: 'Offered at IISER TVM, Pune, and select tracks; graduates split between doctoral research via CSIR-NET/GATE and industry analytical/teaching roles.',
          },
          {
            title: 'Ph.D. & Postdoc Outcomes',
            desc: 'Doctoral graduates move to international postdoctoral fellowships, faculty roles at IITs/IISERs/Universities, Scientist positions (CSIR/DRDO), or senior corporate R&D.',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <h2 className="text-base font-semibold text-slate-900 font-display">{item.title}</h2>
            <p className="text-xs text-slate-700 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Institute-Wise Placement Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 font-display">
            Institute-Wise Placement &amp; Higher Studies Statistics
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Official figures compiled from NIRF submissions and Career Development Cell (CDC) portals.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3.5 px-4">Institution</th>
                <th className="py-3.5 px-4">Academic Year &amp; Scope</th>
                <th className="py-3.5 px-4">Higher Studies / PhD</th>
                <th className="py-3.5 px-4">Placed / Status</th>
                <th className="py-3.5 px-4">Median Salary</th>
                <th className="py-3.5 px-4">Highest / Avg / Min</th>
                <th className="py-3.5 px-4">Official Cell</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {placements.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 align-top">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {rec.institutionName}
                    <div className="text-xs font-normal text-slate-500 mt-0.5">{rec.dataStatus}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">
                    <div className="font-semibold text-slate-900">{rec.academicYear}</div>
                    <div>{rec.programScope}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700 max-w-[180px]">
                    {rec.higherStudiesCount}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700 max-w-[200px]">
                    <div className="font-medium text-slate-900">{rec.placedStudents}</div>
                    <div className="text-slate-500 mt-0.5">{rec.placementPercentage}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-900">
                    {rec.medianSalary}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 max-w-[200px]">
                    <div>Highest: {rec.highestSalary}</div>
                    <div>Avg: {rec.averageSalary}</div>
                    <div>Min: {rec.minimumSalary}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <a
                      href={rec.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline"
                    >
                      <span>CDC Portal</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Direct Links to All 7 Placement Cells */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 font-display">
          Official IISER Placement &amp; Career Development Cells
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {institutions.map((inst) => (
            <a
              key={inst.id}
              href={inst.placementCellUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 p-3.5 border border-slate-200 hover:border-blue-400 rounded-lg text-sm font-medium text-slate-800 hover:text-blue-900 transition-colors"
            >
              <span>{inst.shortName}</span>
              <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
