import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Institution, Vacancy } from '../types/portal';

interface ResearchPageProps {
  institutions: Institution[];
}

export function ResearchPage({ institutions }: ResearchPageProps) {
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const filtered =
    selectedCampus === 'all'
      ? institutions
      : institutions.filter((i) => i.id === selectedCampus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Research, Innovation &amp; Entrepreneurship
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          Scientific Centres, Laboratories, Patents &amp; Incubators
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Explore national research missions, Centres of Excellence, supercomputing clusters, technology incubators, and official institutional publication repositories across all seven IISERs.
        </p>
      </div>

      {/* National Initiatives & Incubators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-semibold text-blue-800">Quantum &amp; Space Missions</div>
          <h2 className="text-lg font-semibold text-slate-900 font-display">
            National Centres of Excellence
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Includes DST&apos;s I-HUB Quantum Technology Foundation at IISER Pune, Centre of Excellence in Space Sciences India (CESSI) at IISER Kolkata supporting ISRO&apos;s Aditya-L1 mission, and LIGO-India gravitational wave teams at IISER TVM.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-semibold text-blue-800">Deep-Tech Commercialization</div>
          <h2 className="text-lg font-semibold text-slate-900 font-display">
            Startup Incubators &amp; Patents
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Atal Incubation Centre (AIC-IISER Pune), RISE Foundation (IISER Kolkata), and IICE (IISER Bhopal) incubate faculty and student startups in diagnostics, clean energy, green chemistry, and AI instrumentation.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-semibold text-blue-800">Undergraduate Discovery</div>
          <h2 className="text-lg font-semibold text-slate-900 font-display">
            Student Research &amp; Publications
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            BS-MS Year 5 thesis projects regularly yield co-authored publications in Nature, Science, PRL, JACS, and Angewandte Chemie, supported by institute travel grants and iGEM/science symposia.
          </p>
        </div>
      </div>

      {/* Filter by Institution */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900 font-display">
            Research Infrastructure &amp; Repositories by Campus
          </h2>
          <select
            aria-label="Filter research by campus"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
          >
            <option value="all">All 7 IISER Campuses</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.shortName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((inst) => (
            <div key={inst.id} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 font-display">{inst.shortName}</h3>
                <a
                  href={inst.researchPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline"
                >
                  <span>Official Research Page</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
              <div className="text-xs text-slate-700 space-y-2">
                <div>
                  <strong className="text-slate-900">Research Areas:</strong> {inst.researchAreas.join(' · ')}
                </div>
                <div>
                  <strong className="text-slate-900">Major Labs &amp; Centres:</strong> {inst.researchLabs.join(' · ')}
                </div>
                <div>
                  <strong className="text-slate-900">Global &amp; Industry Ties:</strong> {[...inst.industryCollaborations, ...inst.internationalCollaborations].join(' · ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface RecruitmentPageProps {
  vacancies: Vacancy[];
}

export function RecruitmentPage({ vacancies }: RecruitmentPageProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = vacancies.filter((v) => {
    const catOk = categoryFilter === 'All' || v.category === categoryFilter;
    const statusOk =
      statusFilter === 'All' ||
      (statusFilter === 'Open' && v.status !== 'Closed') ||
      (statusFilter === 'Closed' && v.status === 'Closed');
    return catOk && statusOk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          IISER Careers &amp; Official Vacancies
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          IISER Faculty, Postdoc, Project JRF &amp; Non-Teaching Recruitment
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Track rolling faculty advertisements (Assistant/Associate/Professor), Institute Postdoctoral Fellowships, Project JRF/SRF/Associate positions, and technical/administrative openings across all seven IISERs. Closed notifications remain marked explicitly as Closed.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Faculty', 'Postdoctoral', 'Research (JRF/SRF/Project)', 'Technical', 'Administrative & Non-Teaching'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <select
          aria-label="Filter vacancy status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-900"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Active / Verify Open</option>
          <option value="Closed">Closed Notifications</option>
        </select>
      </div>

      {/* Vacancy List */}
      <div className="space-y-5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-600">
            No recruitment notifications match your selected filters.
          </div>
        ) : (
          filtered.map((vac) => (
            <article key={vac.id} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-blue-800">{vac.institution}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{vac.category}</span>
                    <span aria-hidden="true"> · </span>
                    <span className={vac.status === 'Closed' ? 'text-rose-700 font-semibold' : 'text-emerald-800 font-semibold'}>
                      {vac.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 font-display mt-1">
                    {vac.position}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a
                    href={vac.officialNotificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-2 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg hover:bg-slate-50"
                  >
                    <span>Official Notice</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={vac.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-800 text-white text-xs font-medium rounded-lg hover:bg-blue-900"
                  >
                    <span>Apply Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900 block mb-0.5">Department</strong>
                  {vac.department}
                </div>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Qualification &amp; Experience</strong>
                  {vac.qualification} ({vac.experience})
                </div>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Pay Level / Salary</strong>
                  <span className="font-mono tabular-nums">{vac.salaryOrPayLevel}</span>
                </div>
                <div>
                  <strong className="text-slate-900 block mb-0.5">Deadline &amp; Selection</strong>
                  {vac.deadline} · {vac.selectionProcedure}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
