import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import type { CmsPayload, PageRoute } from '../types/portal';
import { globalSearchPortal } from '../utils/iiserLogic';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CmsPayload;
  onNavigate: (route: PageRoute, detailId?: string) => void;
}

const QUICK_QUERIES = ['IISER Pune', 'INSPIRE', 'B.Tech', 'IAT', 'JRF', 'IISc'];

export function GlobalSearchModal({
  isOpen,
  onClose,
  cmsData,
  onNavigate,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = globalSearchPortal(query, cmsData);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 backdrop-blur-xs p-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Global portal search"
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
          <label htmlFor="global-portal-search" className="sr-only">
            Search IISER campuses, IAT syllabus, courses, scholarships, jobs, or salaries
          </label>
          <input
            ref={inputRef}
            id="global-portal-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campuses, IAT syllabus, courses, INSPIRE, placements, JRF..."
            className="w-full text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search modal"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="space-y-4">
              <p className="text-xs font-medium text-slate-500">Suggested topics</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="px-3 py-1.5 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    ['7 IISER Campuses', 'institutions'],
                    ['IAT Exam Guide', 'iat'],
                    ['Course Directory', 'courses'],
                    ['Placements & NIRF', 'placements'],
                    ['Salary Explorer', 'salaries'],
                    ['Interactive Tools', 'tools'],
                  ] as [string, PageRoute][]
                ).map(([label, route]) => (
                  <button
                    key={route}
                    type="button"
                    onClick={() => {
                      onNavigate(route);
                      onClose();
                    }}
                    className="text-left px-3 py-2 text-sm text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No matching entries found for "{query}". Try searching by campus city, degree name, scholarship, or exam.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(item.route, item.detailId);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between gap-4 py-3 px-2 hover:bg-slate-50 rounded-lg text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span>{item.category}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{item.subtitle}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
