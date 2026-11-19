import { ArrowLeft, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import type { Institution, PageRoute, PlacementRecord } from '../types/portal';
import { SafeImage } from './SafeImage';

interface InstitutionDetailPageProps {
  institution: Institution;
  placement?: PlacementRecord;
  allInstitutions: Institution[];
  onNavigate: (route: PageRoute, detailId?: string) => void;
}

export function InstitutionDetailPage({
  institution,
  placement,
  allInstitutions,
  onNavigate,
}: InstitutionDetailPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top switcher & back link */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => onNavigate('institutions')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>All 7 IISER Campuses</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5">
          {allInstitutions.map((inst) => (
            <button
              key={inst.id}
              type="button"
              onClick={() => onNavigate('institution-detail', inst.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                inst.id === institution.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {inst.shortName.replace('IISER ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-medium text-blue-800 font-mono tabular-nums">
            Established {institution.establishedYear} · {institution.city}, {institution.state}
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
            {institution.name}
          </h1>
          <p className="text-sm text-slate-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{institution.campusAddress}</span>
          </p>
          <p className="text-base text-slate-700 leading-relaxed">{institution.history}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={institution.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={institution.placementCellUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg transition-colors"
            >
              <span>Placement Cell</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href={institution.recruitmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg transition-colors"
            >
              <span>Faculty &amp; Staff Openings</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-full min-h-[240px] rounded-xl overflow-hidden border border-slate-200">
            <SafeImage
              src={institution.imageUrl}
              alt={`${institution.shortName} campus architecture`}
              className="w-full h-full object-cover"
              fallbackTitle={institution.shortName}
            />
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <h2 className="text-lg font-semibold text-slate-900 font-display">Institutional Vision</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{institution.vision}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <h2 className="text-lg font-semibold text-slate-900 font-display">Mission</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{institution.mission}</p>
        </div>
      </div>

      {/* Academics: Departments & Degree Programmes */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 font-display">
          Departments &amp; Academic Programmes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Departments &amp; Schools</h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {institution.departments.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Undergraduate (UG)</h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {institution.ugProgrammes.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Postgraduate (PG)</h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {institution.pgProgrammes.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Doctoral &amp; Postdoc</h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {institution.phdProgrammes.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Research, Labs & Scientific Infrastructure */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 font-display">Key Research Areas</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {institution.researchAreas.map((r) => (
              <li key={r} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 font-display">Centres &amp; Laboratories</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {institution.researchLabs.map((r) => (
              <li key={r} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 font-display">Scientific Infrastructure</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {institution.scientificInfrastructure.map((r) => (
              <li key={r} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Campus Facilities, Library, Hostel, Sports & Student Life */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 font-display">
          Campus Facilities, Hostels &amp; Student Life
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Library Facilities</h3>
            <p className="leading-relaxed">{institution.libraryFacilities}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Hostel Facilities</h3>
            <p className="leading-relaxed">{institution.hostelFacilities}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Sports &amp; Extracurriculars</h3>
            <p className="leading-relaxed">{institution.sportsAndExtracurriculars}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Student Life &amp; Campus Amenities</h3>
            <p className="leading-relaxed">{institution.studentLife}</p>
            <p className="text-xs text-slate-500 mt-2">
              Facilities: {institution.campusFacilities.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      {/* Fees, Admission, Placement, Alumni & Collaborations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 text-sm text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Admissions, Fees &amp; Scholarships
          </h2>
          <p><strong className="text-slate-900">Admission:</strong> {institution.admissionOverview}</p>
          <p><strong className="text-slate-900">Scholarships:</strong> {institution.scholarshipsAndAid}</p>
          <div className="pt-2 border-t border-slate-100 space-y-1 font-mono text-xs tabular-nums">
            <div className="text-slate-500 font-sans font-semibold">{institution.feeSummary.academicYear}</div>
            <div>Gen/OBC/EWS Tuition: {institution.feeSummary.generalObcEwsSemesterTuition}</div>
            <div>SC/ST/PwD Tuition: {institution.feeSummary.scStPwdTuition}</div>
            <div>Hostel &amp; Semester Misc.: {institution.feeSummary.hostelAndOtherPerSemester}</div>
            <div className="text-slate-500 font-sans">{institution.feeSummary.messChargesNote}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 text-sm text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Placements, Internships &amp; Collaborations
          </h2>
          <p><strong className="text-slate-900">Career Cell:</strong> {institution.placementCellOverview}</p>
          {placement && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <div className="font-semibold text-slate-900">
                Verified Placement Snapshot ({placement.academicYear})
              </div>
              <div>Median Package: {placement.medianSalary}</div>
              <div>Highest/Average CTC: {placement.highestSalary}</div>
              <div>Higher Studies: {placement.higherStudiesCount}</div>
            </div>
          )}
          <p><strong className="text-slate-900">Alumni Network:</strong> {institution.alumniNetwork}</p>
          <p><strong className="text-slate-900">Internships:</strong> {institution.internshipOpportunities}</p>
          <p><strong className="text-slate-900">Industry &amp; Global Ties:</strong> {[...institution.industryCollaborations, ...institution.internationalCollaborations].join(' · ')}</p>
        </div>
      </section>

      {/* Official Contact Details */}
      <section className="bg-slate-900 text-slate-100 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold font-display text-white">
            Official Contact Details — {institution.shortName}
          </h2>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-300" aria-hidden="true" />
              <span>{institution.contactEmail}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
              <Phone className="w-4 h-4 text-blue-300" aria-hidden="true" />
              <span>{institution.contactPhone}</span>
            </span>
          </div>
          {institution.nirfRank2024 && (
            <p className="text-xs text-slate-400 pt-1">{institution.nirfRank2024}</p>
          )}
        </div>
        <a
          href={institution.researchPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <span>Research Portal</span>
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
