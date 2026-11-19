import { ExternalLink } from 'lucide-react';
import type { Institution } from '../types/portal';
import { IAT_EXAM_OVERVIEW } from '../data/iatAndCareersData';
import { PORTAL_IMAGES } from '../data/iiserInstitutionsData';
import { SafeImage } from './SafeImage';

interface AdmissionFeesPageProps {
  institutions: Institution[];
  initialFocus?: 'admission' | 'student-life';
}

export function AdmissionFeesPage({ institutions, initialFocus = 'admission' }: AdmissionFeesPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
            {initialFocus === 'student-life' ? 'Hostels, Fees & Campus Life' : 'Admission, Fees & Counselling'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
            IISER Admission Process, Fee Structure, Hostels &amp; Student Life
          </h1>
          <p className="text-base text-slate-700 leading-relaxed">
            Detailed guide to centralized IAT counselling, required verification documents, institute-wise semester fees, 100% SC/ST/PwD tuition waivers, mess charges, hostels, medical care, and residential campus life.
          </p>
          <a
            href="https://www.iiseradmission.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <span>Open Official IAT Admission Portal</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <div className="lg:col-span-5">
          <div className="h-full min-h-[220px] rounded-xl overflow-hidden border border-slate-200">
            <SafeImage
              src={PORTAL_IMAGES.libraryStudy}
              alt="Modern university library and student study space"
              className="w-full h-full object-cover"
              fallbackTitle="IISER Residential Campus Life"
            />
          </div>
        </div>
      </div>

      {/* Application, Counselling & Documents */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 font-display">
            1. Application &amp; Seat Allotment
          </h2>
          <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-2">
            <li>Register on <strong>iiseradmission.in</strong> and submit campus preference order across all 7 IISERs.</li>
            <li>Appear for the 3-hour CBT IISER Aptitude Test (IAT).</li>
            <li>Check provisional answer key, final rank card, and participate in Round-wise Freeze/Float seat allotment.</li>
            <li>Pay Seat Acceptance Fee (SAF) online to confirm seat before physical reporting.</li>
          </ol>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 font-display">
            2. Document Verification Checklist
          </h2>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
            <li>Class 10 &amp; Class 12 Original Marksheets &amp; Passing Certificates</li>
            <li>IAT Admit Card &amp; Official Rank Card / Offer Letter</li>
            <li>Valid Category Certificate (OBC-NCL / EWS issued after April 1 of admission year; SC/ST; PwD UDID)</li>
            <li>Government Photo ID (Aadhaar / Passport), Transfer &amp; Migration Certificates</li>
            <li>Medical Fitness Certificate in prescribed IAT format</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 font-display">
            3. Seat Acceptance Fee &amp; Refunds
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Seat Acceptance Fee (typically ₹35,000 for Gen/OBC/EWS and ₹17,500 for SC/ST/PwD; verify current brochure) is adjusted against Semester 1 tuition upon joining.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>Refund Policy:</strong> Withdrawals submitted before the official cut-off deadline in the counselling portal receive refunds (minus a nominal processing fee) per JAC/UGC norms.
          </p>
        </div>
      </section>

      {/* Institute-Wise Fee Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 font-display">
            Institute-Wise Semester Fee Structure Comparison (Reference)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Approximate semester charges compiled from recent official IISER fee circulars. Exact semester tuition, hostel, and mess bills must be verified against the active admission year circular on each campus site.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3.5 px-4">Institute</th>
                <th className="py-3.5 px-4">Gen/OBC/EWS Tuition / Sem</th>
                <th className="py-3.5 px-4">SC/ST/PwD Tuition</th>
                <th className="py-3.5 px-4">One-Time Admission Deposit</th>
                <th className="py-3.5 px-4">Hostel &amp; Other Charges / Sem</th>
                <th className="py-3.5 px-4">Mess Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {inst.shortName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-800">
                    {inst.feeSummary.generalObcEwsSemesterTuition}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-emerald-800 font-medium">
                    {inst.feeSummary.scStPwdTuition}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-700">
                    {inst.feeSummary.oneTimeAdmissionDeposit}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-700">
                    {inst.feeSummary.hostelAndOtherPerSemester}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {inst.feeSummary.messChargesNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hostels, Food, Medical, Labs, Libraries & Sports */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 font-display">
          Hostel Facilities, Dining, Healthcare &amp; Campus Living
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Residential Hostels',
              body: 'All seven IISERs are fully residential campuses. First-year UG students typically share twin rooms before transitioning to single rooms in senior years, equipped with high-speed Wi-Fi/LAN, study lounges, and washing areas.',
            },
            {
              title: 'Mess & Dining Facilities',
              body: 'Student-run or committee-supervised messes offer North and South Indian vegetarian and non-vegetarian menus, supplemented by campus cafeterias and late-night canteens.',
            },
            {
              title: 'Medical & Wellness Support',
              body: 'Each campus operates an on-site Health Centre with resident physicians, ambulance services, psychological counselling centres, and group student health insurance.',
            },
            {
              title: '24×7 Libraries & Computing',
              body: 'Central libraries provide remote VPN access to Springer, Nature, ScienceDirect, ACS, and IEEE journals, alongside High-Performance Computing (HPC) clusters.',
            },
            {
              title: 'Sports & Inter-IISER Meets (IISM)',
              body: 'Dedicated athletic tracks, cricket/football grounds, synthetic tennis/basketball courts, gyms, and annual Inter-IISER Sports Meets (IISM) & Cultural Meets (IICCM).',
            },
            {
              title: 'Science Outreach & Clubs',
              body: 'Active astronomy, coding, robotics, drama, music, debate, and school-outreach clubs create a lively, collaborative peer environment.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
              <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seat Matrix Summary */}
      <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 font-display">
          Indicative Admission Intake Summary
        </h2>
        <p className="text-sm text-slate-700">
          Combined undergraduate intake across all seven IISERs is approximately <strong>1,900+ seats</strong> across BS-MS, BS, and B.Tech programmes (including reservation categories per Govt. of India norms: OBC-NCL 27%, SC 15%, ST 7.5%, Gen-EWS 10%, and PwD 5% horizontal).
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          {IAT_EXAM_OVERVIEW.seatMatrixReference.map((s) => (
            <span key={s.institute} className="font-mono tabular-nums">
              {s.institute.replace('IISER ', '')}: {s.bsmsSeats}+ seats
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
