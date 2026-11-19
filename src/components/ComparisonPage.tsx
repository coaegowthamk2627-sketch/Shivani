import { INSTITUTION_COMPARISON_DATA } from '../data/iatAndCareersData';

export function ComparisonPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-blue-800 uppercase">
          Institutional Comparison
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">
          IISER vs IISc Bengaluru vs IITs vs NISER vs UM-DAE CEBS
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          No single institution is universally superior. The right choice depends on whether you aim for pure scientific research, engineering technology, nuclear/atomic sciences, or interdisciplinary data and biotech careers.
        </p>
      </div>

      {/* Multi-Criteria Comparison Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              <th className="py-3.5 px-4">Comparison Criterion</th>
              <th className="py-3.5 px-4">IISERs (7 Campuses)</th>
              <th className="py-3.5 px-4">IISc Bengaluru</th>
              <th className="py-3.5 px-4">IITs (Premier Tech)</th>
              <th className="py-3.5 px-4">NISER Bhubaneswar</th>
              <th className="py-3.5 px-4">UM-DAE CEBS Mumbai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs leading-relaxed">
            {INSTITUTION_COMPARISON_DATA.map((row) => (
              <tr key={row.criterion} className="align-top">
                <td className="py-3.5 px-4 font-semibold text-slate-900 bg-slate-50/50">
                  {row.criterion}
                </td>
                <td className="py-3.5 px-4 text-slate-800 font-medium">{row.iiser}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.iisc}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.iit}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.niser}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.cebs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Interest Fit Guide */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 font-display">
          Which Institution Matches Your Career &amp; Subject Goals?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              goal: 'Pure Science & Academic Research (Physics, Chemistry, Biology, Maths)',
              fit: 'IISERs, IISc Bengaluru, NISER & UM-DAE CEBS',
              note: 'All offer intensive theory + lab research from semester 1, with IISERs providing broad interdisciplinary flexibility across 7 campuses.',
            },
            {
              goal: 'Engineering, Software & Corporate Placements',
              fit: 'IITs & IISER Bhopal (B.Tech / Data Science)',
              note: 'IITs offer the broadest corporate placement ecosystem; IISER Bhopal B.Tech bridges core engineering with deep science.',
            },
            {
              goal: 'Biotechnology, Neuroscience & Life Sciences',
              fit: 'IISERs (Pune, Kolkata, Mohali, Bhopal, TVM) & IISc',
              note: 'PCB students gain direct entry via IAT without needing JEE Mathematics, with access to BSL-2/3, Cryo-EM, and genomics labs.',
            },
            {
              goal: 'Data Science, Quantitative Economics & AI',
              fit: 'IITs, IISc B.Tech (M&C), IISER Bhopal (BS Econ / DSE) & BS-MS Data Minors',
              note: 'Ideal for students wanting mathematical rigor paired with computing and statistical modelling.',
            },
            {
              goal: 'Nuclear, Space & Govt R&D (BARC / DAE / ISRO)',
              fit: 'NISER / CEBS (DAE DISHA), IISERs & IITs',
              note: 'NISER/CEBS have direct DAE alignment; IISER and IIT graduates enter via BARC OCES, ISRO ICRB, and DRDO RAC.',
            },
            {
              goal: 'Central Universities & State Research Universities',
              fit: 'DU, BHU, University of Hyderabad, JNU (PG)',
              note: 'Cost-effective honours and Master’s programmes via CUET; strong for UPSC/civil services and university teaching paths alongside research.',
            },
          ].map((card) => (
            <div key={card.goal} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <div className="text-xs font-semibold text-blue-800">{card.fit}</div>
              <h3 className="text-base font-semibold text-slate-900">{card.goal}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{card.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
