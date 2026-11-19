import { useState } from 'react';
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { IAT_EXAM_OVERVIEW, IAT_SYLLABUS } from '../data/iatAndCareersData';
import type { PageRoute } from '../types/portal';

interface IatExamPageProps {
  onNavigate: (route: PageRoute) => void;
  initialTab?: IatTab;
}

type IatTab = 'overview' | 'pattern' | 'syllabus' | 'prep' | 'cutoffs';

export function IatExamPage({ onNavigate, initialTab = 'overview' }: IatExamPageProps) {
  const [activeTab, setActiveTab] = useState<IatTab>(initialTab);
  const [activeSubjectId, setActiveSubjectId] = useState<'biology' | 'chemistry' | 'physics' | 'mathematics'>('biology');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const activeSubject = IAT_SYLLABUS.find((s) => s.id === activeSubjectId) || IAT_SYLLABUS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header + Official CTA */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
            IISER Entrance Examination
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
            IISER Aptitude Test (IAT) Complete Guide
          </h1>
          <p className="text-base text-slate-700 leading-relaxed">
            Everything Class 11–12 students and parents need to know about IAT eligibility, 60-question CBT pattern, complete PCMB syllabus, preparation roadmaps, practice questions, and cut-off trends.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href={IAT_EXAM_OVERVIEW.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <span>Visit Official IISER Admission Portal</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => onNavigate('tools')}
            className="px-4 py-3 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Check Eligibility Tool
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl w-fit">
        {(
          [
            ['overview', 'Overview & Eligibility'],
            ['pattern', 'Pattern & Process'],
            ['syllabus', 'Complete Syllabus (PCMB)'],
            ['prep', 'Prep Plans & Practice'],
            ['cutoffs', 'Cut-offs & Seat Matrix'],
          ] as [IatTab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Eligibility */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 font-display">
                A. Introduction to IAT
              </h2>
              <dl className="space-y-3 text-sm text-slate-700">
                <div className="pb-2 border-b border-slate-100">
                  <dt className="font-semibold text-slate-900">What is IAT?</dt>
                  <dd className="mt-1">
                    The IISER Aptitude Test (IAT) is the centralized national computer-based entrance test for admission to undergraduate science and engineering programmes across all 7 IISERs.
                  </dd>
                </div>
                <div className="pb-2 border-b border-slate-100">
                  <dt className="font-semibold text-slate-900">Who Conducts IAT?</dt>
                  <dd className="mt-1">{IAT_EXAM_OVERVIEW.conductingBody}.</dd>
                </div>
                <div className="pb-2 border-b border-slate-100">
                  <dt className="font-semibold text-slate-900">Institutions Accepting IAT Scores</dt>
                  <dd className="mt-1">
                    <ul className="list-disc pl-5 space-y-1">
                      {IAT_EXAM_OVERVIEW.acceptingInstitutions.map((inst) => (
                        <li key={inst}>{inst}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Programmes Available Through IAT</dt>
                  <dd className="mt-1">
                    5-Year BS-MS Dual Degree (all 7 IISERs), 4-Year BS Economic Sciences &amp; 4-Year B.Tech. (IISER Bhopal), and 4-Year BS Economic &amp; Statistical Sciences (IISER Tirupati — verify active intake).
                  </dd>
                </div>
              </dl>
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 font-display">
                B. Eligibility Criteria
              </h2>
              <dl className="space-y-3 text-sm text-slate-700">
                <div className="pb-2 border-b border-slate-100">
                  <dt className="font-semibold text-slate-900">Class 12 Passing Window</dt>
                  <dd className="mt-1">{IAT_EXAM_OVERVIEW.eligibilitySummary.passingYears}</dd>
                </div>
                <div className="pb-2 border-b border-slate-100">
                  <dt className="font-semibold text-slate-900">Minimum Percentage (Category-Wise)</dt>
                  <dd className="mt-1">{IAT_EXAM_OVERVIEW.eligibilitySummary.minimumPercentage}</dd>
                </div>
                <div className="pb-2 border-b border-slate-100">
                  <dt className="font-semibold text-slate-900">Mathematics &amp; Biology Requirements</dt>
                  <dd className="mt-1">{IAT_EXAM_OVERVIEW.eligibilitySummary.subjectRequirement}</dd>
                </div>
                <div className="pb-2 border-b border-slate-100">
                  <dt className="font-semibold text-slate-900">Nationality &amp; Attempts</dt>
                  <dd className="mt-1">
                    {IAT_EXAM_OVERVIEW.eligibilitySummary.nationality}{' '}
                    {IAT_EXAM_OVERVIEW.eligibilitySummary.attemptsNote}
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => onNavigate('tools')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-blue-900 cursor-pointer"
              >
                Launch Interactive IAT Eligibility Checker
              </button>
            </section>
          </div>
        </div>
      )}

      {/* Tab 2: Exam Pattern & Process */}
      {activeTab === 'pattern' && (
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              C. IAT Examination Pattern &amp; Marking Scheme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Mode &amp; Language</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">
                  Computer-Based Test · English &amp; Hindi
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Duration</div>
                <div className="text-sm font-semibold text-slate-900 mt-1 font-mono tabular-nums">
                  {IAT_EXAM_OVERVIEW.duration}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Total Questions &amp; Marks</div>
                <div className="text-sm font-semibold text-slate-900 mt-1 font-mono tabular-nums">
                  60 MCQs · 240 Marks
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Marking &amp; Negative Marking</div>
                <div className="text-sm font-semibold text-slate-900 mt-1 font-mono tabular-nums">
                  +4 Correct · -1 Incorrect
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                    <th className="py-3 px-4">Subject Section</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Max Marks</th>
                    <th className="py-3 px-4">Question Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {IAT_SYLLABUS.map((subj) => (
                    <tr key={subj.id}>
                      <td className="py-3 px-4 font-medium text-slate-900">{subj.name}</td>
                      <td className="py-3 px-4 font-mono tabular-nums">{subj.questionCount}</td>
                      <td className="py-3 px-4 font-mono tabular-nums">{subj.maxMarks}</td>
                      <td className="py-3 px-4 text-slate-600">Single-Choice MCQ (All 4 sections count toward total 240)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              E. Examination Timeline, Application &amp; Counselling Procedure
            </h2>
            <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
              {IAT_EXAM_OVERVIEW.keyDatesStatusNote}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                    <th className="py-3 px-4">Stage / Milestone</th>
                    <th className="py-3 px-4">Schedule Status</th>
                    <th className="py-3 px-4">Official Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {IAT_EXAM_OVERVIEW.importantDates.map((d) => (
                    <tr key={d.milestone}>
                      <td className="py-3 px-4 font-medium text-slate-900">{d.milestone}</td>
                      <td className="py-3 px-4 text-slate-700">{d.status}</td>
                      <td className="py-3 px-4 font-mono text-xs text-blue-800">{d.officialPortal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Registration Fees &amp; Exam Centres</h3>
                <p className="leading-relaxed">
                  Typical IAT application fees (verify active brochure): ~₹2,000 for General/OBC/EWS and ~₹1,000 for SC/ST/PwD/Kashmiri Migrants. Conducted across 100+ CBT centres across India.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Answer Key, Results &amp; Counselling</h3>
                <p className="leading-relaxed">
                  Provisional answer keys allow paid challenge objections before final rank cards are issued. Seat allotment happens over multiple Freeze/Float online counselling rounds followed by physical document verification at the allotted campus.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab 3: Interactive Complete Syllabus */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 font-display">
                D. Complete Subject &amp; Chapter Syllabus Explorer
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Select a subject below to explore every chapter and topic tested in IAT.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {IAT_SYLLABUS.map((subj) => (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => setActiveSubjectId(subj.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                    activeSubjectId === subj.id
                      ? 'bg-blue-800 text-white border-blue-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {subj.name} ({subj.questionCount} Qs)
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-sm text-slate-800">
            <strong>Primary Recommended Resource ({activeSubject.name}):</strong>{' '}
            {activeSubject.recommendedNcert}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSubject.chapters.map((chapter, idx) => (
              <div
                key={chapter.title}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {String(idx + 1).padStart(2, '0')}. {chapter.title}
                  </h3>
                  <span className="text-xs text-slate-500 shrink-0">
                    Focus: {chapter.weightageFocus}
                  </span>
                </div>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {chapter.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Preparation Strategy, Books & Sample Practice Questions */}
      {activeTab === 'prep' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
              <div className="text-xs font-mono text-blue-800 font-semibold">12-Month Roadmap</div>
              <h3 className="text-lg font-semibold text-slate-900 font-display">Full Foundation Plan</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Months 1–6: Complete NCERT Class 11 &amp; 12 across all 4 subjects. Months 7–9: Add your 4th subject (e.g., NCERT Biology for PCM or Calculus/Algebra basics for PCB) + PYQs. Months 10–12: 20 full 180-min CBT mock exams.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
              <div className="text-xs font-mono text-blue-800 font-semibold">6-Month Roadmap</div>
              <h3 className="text-lg font-semibold text-slate-900 font-display">Focused Acceleration</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Months 1–3: High-weightage 70% chapters + daily 1.5h on weak/4th subject. Months 4–5: Timed IAT 2017–2025 previous papers. Month 6: Twice-weekly CBT mocks &amp; accuracy drill.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
              <div className="text-xs font-mono text-blue-800 font-semibold">3-Month Revision</div>
              <h3 className="text-lg font-semibold text-slate-900 font-display">Final Sprint &amp; Timetable</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Daily 6–8h split: 2h Core Concept Review, 2h Weak Subject Practice, 2h Timed MCQs (40–45 mins per section), 1h Error Log &amp; Formula Revision.
              </p>
            </div>
          </div>

          <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 font-display">
                  Interactive Sample IAT Practice Questions
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Test your conceptual understanding with 4 subject-wise IAT-style questions (+4 / -1 pattern).
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('tools')}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-blue-900 cursor-pointer shrink-0"
              >
                Build Custom Study Plan
              </button>
            </div>

            <div className="space-y-6">
              {IAT_EXAM_OVERVIEW.samplePracticeQuestions.map((q, qIdx) => {
                const chosen = selectedAnswers[q.id];
                const answered = chosen !== undefined;
                return (
                  <div key={q.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="text-xs font-semibold text-blue-800">
                      Question {qIdx + 1} · {q.subject}
                    </div>
                    <p className="text-sm font-medium text-slate-900">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = chosen === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-blue-400';
                        if (answered) {
                          if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium';
                          else if (isSelected) btnStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                        }
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`text-left px-4 py-2.5 text-sm border rounded-lg transition-colors cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {answered && (
                      <div className="pt-2 flex items-start gap-2 text-xs text-slate-700">
                        {chosen === q.correctIndex ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                        <span>
                          <strong>{chosen === q.correctIndex ? 'Correct (+4):' : 'Incorrect (-1):'}</strong>{' '}
                          {q.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Tab 5: Cut-off & Seat Matrix */}
      {activeTab === 'cutoffs' && (
        <div className="space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-950">
            <strong>Historical vs Current-Cycle Notice:</strong> The rank bands below represent approximate <strong>previous-year (2024 reference)</strong> category closing ranks for orientation only. Current-cycle official round-wise closing ranks are published exclusively on{' '}
            <a href="https://www.iiseradmission.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
              iiseradmission.in
            </a>{' '}
            during counselling.
          </div>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Historical Category-Wise Closing Rank Bands (Reference Only)
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                    <th className="py-3 px-4">Institute</th>
                    <th className="py-3 px-4">General</th>
                    <th className="py-3 px-4">OBC-NCL (Cat. Rank)</th>
                    <th className="py-3 px-4">EWS (Cat. Rank)</th>
                    <th className="py-3 px-4">SC (Cat. Rank)</th>
                    <th className="py-3 px-4">ST (Cat. Rank)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-xs tabular-nums">
                  {IAT_EXAM_OVERVIEW.historicalCutoffs2024.map((row) => (
                    <tr key={row.institute}>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">{row.institute}</td>
                      <td className="py-3 px-4">{row.gen}</td>
                      <td className="py-3 px-4">{row.obcNcl}</td>
                      <td className="py-3 px-4">{row.ews}</td>
                      <td className="py-3 px-4">{row.sc}</td>
                      <td className="py-3 px-4">{row.st}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 font-display">
              Indicative Seat Matrix Across All 7 IISERs
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                    <th className="py-3 px-4">Institute</th>
                    <th className="py-3 px-4">BS-MS Intake (Ref.)</th>
                    <th className="py-3 px-4">Other IAT UG Seats</th>
                    <th className="py-3 px-4">Verification Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {IAT_EXAM_OVERVIEW.seatMatrixReference.map((row) => (
                    <tr key={row.institute}>
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.institute}</td>
                      <td className="py-3 px-4 font-mono tabular-nums">{row.bsmsSeats}</td>
                      <td className="py-3 px-4">{row.otherSeats}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{row.totalNote}</td>
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
