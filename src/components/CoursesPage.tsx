import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { CourseProgram } from '../types/portal';
import { recommendCourses } from '../utils/iiserLogic';

interface CoursesPageProps {
  courses: CourseProgram[];
}

export function CoursesPage({ courses }: CoursesPageProps) {
  const [stage, setStage] = useState<'Class 12' | 'Bachelor Graduate' | 'Master Graduate' | 'PhD Holder'>('Class 12');
  const [interest, setInterest] = useState<string>('all');
  const [selectedDegreeFilter, setSelectedDegreeFilter] = useState<string>('All');

  const recommended = recommendCourses(courses, interest, stage);
  const displayed =
    selectedDegreeFilter === 'All'
      ? courses
      : courses.filter((c) => c.degreeType === selectedDegreeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Academics &amp; Degree Programmes
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          Courses &amp; Degree Directory Across IISERs
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          Compare 5-Year BS-MS Dual Degrees, 4-Year BS &amp; B.Tech. programmes, 2-Year M.Sc., Integrated Ph.D., Ph.D., and Postdoctoral pathways with curriculum structure and career outcomes.
        </p>
      </div>

      {/* Interactive Course Finder */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Interactive Course Finder
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Select your current qualification and academic interest to see matching IISER programmes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="course-stage" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Academic Stage
            </label>
            <select
              id="course-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value as typeof stage)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
            >
              <option value="Class 12">Class 12 / Intermediate Student</option>
              <option value="Bachelor Graduate">B.Sc. / B.Tech. Graduate</option>
              <option value="Master Graduate">M.Sc. / BS-MS / M.Tech. Graduate</option>
              <option value="PhD Holder">Ph.D. Holder (Postdoctoral)</option>
            </select>
          </div>
          <div>
            <label htmlFor="course-interest" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject / Career Focus
            </label>
            <select
              id="course-interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900"
            >
              <option value="all">All Scientific &amp; Technical Disciplines</option>
              <option value="biology">Biology &amp; Life Sciences</option>
              <option value="chemistry">Chemistry &amp; Chemical Sciences</option>
              <option value="physics">Physics &amp; Quantum Science</option>
              <option value="data science">Data Science, AI &amp; Computing</option>
              <option value="economics">Economics &amp; Statistical Sciences</option>
              <option value="engineering">Chemical / Electrical Engineering</option>
            </select>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <div className="text-xs font-semibold text-slate-600">
            Recommended Programmes ({recommended.length})
          </div>
          {recommended.length === 0 ? (
            <p className="text-sm text-slate-600">
              No exact specialization match at this stage. Try switching focus to &ldquo;All Scientific &amp; Technical Disciplines&rdquo;.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="text-sm font-semibold text-blue-900">{c.title}</div>
                  <div className="text-xs text-slate-600">{c.duration} · {c.offeredAt.join(', ')}</div>
                  <p className="text-xs text-slate-700 pt-1">{c.curriculumSummary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Degree Filter Tabs & Full Directory */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900 font-display">
            Detailed Programme Specifications
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'BS-MS', 'BS', 'B.Tech', 'MSc', 'Integrated PhD', 'PhD'].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => setSelectedDegreeFilter(deg)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  selectedDegreeFilter === deg
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {deg}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {displayed.map((course) => (
            <article key={course.id} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-semibold text-blue-800">
                    {course.degreeType} · {course.duration}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 font-display mt-1">
                    {course.title}
                  </h3>
                </div>
                <a
                  href={course.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:underline shrink-0"
                >
                  <span>Verify official programme notice</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-700">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Eligibility &amp; Admission</h4>
                  <p className="leading-relaxed">{course.eligibility}</p>
                  <p className="text-xs text-slate-600 mt-2">{course.admissionProcedure}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Curriculum &amp; Semester Structure</h4>
                  <p className="leading-relaxed">{course.curriculumSummary}</p>
                  <p className="text-xs text-slate-600 mt-2">{course.semesterStructure}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Research, Careers &amp; Prospects</h4>
                  <p className="leading-relaxed">{course.researchOpportunities}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    <strong>Salary Outlook:</strong> {course.salaryProspects}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-900">Offered At:</strong> {course.offeredAt.join(' · ')}
                </div>
                <div>
                  <strong className="text-slate-900">Subjects &amp; Tracks:</strong> {course.subjectsOffered.join(' · ')}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
