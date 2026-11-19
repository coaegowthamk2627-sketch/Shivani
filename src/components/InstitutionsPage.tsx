import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Institution, PageRoute } from '../types/portal';
import { SafeImage } from './SafeImage';

interface InstitutionsPageProps {
  institutions: Institution[];
  onNavigate: (route: PageRoute, detailId?: string) => void;
}

export function InstitutionsPage({ institutions, onNavigate }: InstitutionsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Complete Institution Directory
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          All Seven IISER Campuses Across India
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Explore comprehensive profiles, departments, degree programmes, research facilities, hostels, placement cells, and direct official websites for every IISER.
        </p>
      </div>

      {/* Campus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((inst) => (
          <article
            key={inst.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full bg-slate-100 overflow-hidden">
                <SafeImage
                  src={inst.imageUrl}
                  alt={`${inst.shortName} campus view`}
                  className="w-full h-full object-cover"
                  fallbackTitle={inst.shortName}
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="text-xs text-slate-500 font-mono tabular-nums">
                  Est. {inst.establishedYear} · {inst.city}, {inst.state}
                </div>
                <h2 className="text-xl font-semibold text-slate-900 font-display">
                  {inst.shortName}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {inst.history}
                </p>
                <div className="pt-2 text-xs text-slate-700 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-900">UG Programmes:</span>{' '}
                    {inst.ugProgrammes.join(', ')}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Departments:</span>{' '}
                    {inst.departments.length} academic divisions
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate('institution-detail', inst.id)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:text-blue-950 cursor-pointer"
              >
                <span>Full campus profile</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href={inst.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-blue-800"
              >
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Comprehensive 7-IISER Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 font-display">
            Verified 7-IISER Side-by-Side Comparison Matrix
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Compare programmes, departments, research infrastructure, and official portals across all seven campuses.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3.5 px-4">Institution</th>
                <th className="py-3.5 px-4">Est.</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">UG Degrees</th>
                <th className="py-3.5 px-4">Key Research Centres &amp; Facilities</th>
                <th className="py-3.5 px-4">Official Portal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onNavigate('institution-detail', inst.id)}
                      className="text-blue-800 hover:underline cursor-pointer"
                    >
                      {inst.shortName}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                    {inst.establishedYear}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {inst.city}, {inst.state}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {inst.ugProgrammes.join(' · ')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                    {inst.researchLabs.slice(0, 2).join('; ')}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <a
                      href={inst.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-800 hover:underline font-medium"
                    >
                      <span>{inst.officialWebsite.replace('https://', '')}</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
