import { ExternalLink } from 'lucide-react';
import type { PageRoute } from '../types/portal';
import { PORTAL_DISCLAIMER } from '../data/iiserInstitutionsData';

interface FooterProps {
  onNavigate: (route: PageRoute, detailId?: string) => void;
  lastUpdated: string;
}

export function Footer({ onNavigate, lastUpdated }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Mandatory Independence Disclaimer */}
        <div className="border border-slate-800 bg-slate-900/70 rounded-xl p-5 sm:p-6">
          <div className="text-sm font-semibold text-white mb-2">
            Independent Educational Portal Disclaimer
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {PORTAL_DISCLAIMER}
          </p>
        </div>

        {/* Sitemap & Official Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-lg font-bold text-white font-display mb-3">IISER GUIDE</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your Complete Roadmap to India&apos;s Premier Science and Research Institutions.
            </p>
            <p className="text-xs text-slate-400 mt-4 font-mono tabular-nums">
              Portal Data Updated: {lastUpdated}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Portal Sections</h3>
            <ul className="space-y-2 text-sm">
              {(
                [
                  ['About IISER', 'about'],
                  ['All 7 IISER Campuses', 'institutions'],
                  ['IAT Entrance Exam', 'iat'],
                  ['Courses & Degrees', 'courses'],
                  ['Fees & Admission', 'admission'],
                  ['Interactive Tools', 'tools'],
                ] as [string, PageRoute][]
              ).map(([label, route]) => (
                <li key={route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(route)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Careers, Research & CMS</h3>
            <ul className="space-y-2 text-sm">
              {(
                [
                  ['Placements & NIRF', 'placements'],
                  ['Jobs & Salary Explorer', 'salaries'],
                  ['Higher Education (PhD)', 'higher-ed'],
                  ['Faculty & Staff Recruitment', 'recruitment'],
                  ['IISER vs IIT vs IISc vs NISER', 'comparison'],
                  ['Administrator CMS', 'admin'],
                ] as [string, PageRoute][]
              ).map(([label, route]) => (
                <li key={route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(route)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Primary Official Portals</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['IAT Admission Portal', 'https://www.iiseradmission.in'],
                ['IISER Pune', 'https://www.iiserpune.ac.in'],
                ['IISER Kolkata', 'https://www.iiserkol.ac.in'],
                ['IISER Mohali', 'https://www.iisermohali.ac.in'],
                ['IISER Bhopal', 'https://www.iiserb.ac.in'],
                ['INSPIRE Scholarship', 'https://online-inspire.gov.in'],
              ].map(([label, url]) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-blue-300 transition-colors"
                  >
                    <span>{label}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} IISER GUIDE — Independent Educational Information Portal.</p>
          <div className="flex flex-wrap items-center gap-6">
            <button type="button" onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">
              About This Portal
            </button>
            <button type="button" onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">
              Privacy Policy & Disclaimer
            </button>
            <button type="button" onClick={() => onNavigate('resources')} className="hover:text-white cursor-pointer">
              Official Links Directory
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
