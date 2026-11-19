import type {
  CourseProgram,
  Institution,
  NewsNotification,
  SalaryBenchmark,
  Scholarship,
  SearchResultItem,
  Vacancy,
} from '../types/portal';

export interface EligibilityInput {
  passingYear: number;
  targetExamYear: number;
  subjects: ('Biology' | 'Chemistry' | 'Physics' | 'Mathematics')[];
  category: 'General' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST' | 'PwD';
  percentage: number;
  nationality: 'Indian' | 'OCI/PIO' | 'Foreign National';
}

export interface EligibilityResult {
  eligibleForBsMs: boolean;
  eligibleForBTechOrEcon: boolean;
  requiredPercentage: number;
  reasons: string[];
  notes: string[];
}

export function checkIatEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = [];
  const notes: string[] = [];

  const requiredPercentage = ['SC', 'ST', 'PwD'].includes(input.category) ? 55 : 60;
  const validYears = [input.targetExamYear - 2, input.targetExamYear - 1, input.targetExamYear];
  const yearOk = validYears.includes(input.passingYear);
  if (!yearOk) {
    reasons.push(
      `Class 12 passing year (${input.passingYear}) falls outside the typical 3-year IAT window (${validYears.join(', ')}) for target exam ${input.targetExamYear}.`
    );
  }

  const pctOk = input.percentage >= requiredPercentage;
  if (!pctOk) {
    reasons.push(
      `Aggregate percentage (${input.percentage}%) is below the ${requiredPercentage}% threshold for ${input.category} category.`
    );
  }

  const uniqueSubjects = new Set(input.subjects);
  const subjectCountOk = uniqueSubjects.size >= 3;
  if (!subjectCountOk) {
    reasons.push('You must have studied at least 3 subjects from Physics, Chemistry, Mathematics, and Biology in Class 12.');
  }

  const hasMath = uniqueSubjects.has('Mathematics');
  if (!hasMath) {
    notes.push(
      'Without Class 12 Mathematics, you are eligible for 5-Year BS-MS programmes, but NOT for IISER Bhopal B.Tech. or BS Economic Sciences.'
    );
  }

  if (input.nationality !== 'Indian') {
    notes.push(
      'OCI/PIO and Foreign National applicants must verify supernumerary seat and fee regulations in the active IAT Information Brochure.'
    );
  }

  const eligibleForBsMs = yearOk && pctOk && subjectCountOk;
  const eligibleForBTechOrEcon = eligibleForBsMs && hasMath;

  return {
    eligibleForBsMs,
    eligibleForBTechOrEcon,
    requiredPercentage,
    reasons,
    notes,
  };
}

export interface StudyPlanInput {
  targetYear: number;
  monthsAvailable: 3 | 6 | 12;
  dailyHours: number;
  strongSubjects: string[];
  weakSubjects: string[];
}

export interface StudyPlanWeekBlock {
  phase: string;
  durationLabel: string;
  focus: string;
  dailyAllocation: { subject: string; hours: number }[];
  milestones: string[];
}

export function generateStudyPlan(input: StudyPlanInput): StudyPlanWeekBlock[] {
  const allSubjects = ['Biology', 'Chemistry', 'Physics', 'Mathematics'];
  const hours = Math.max(1, Math.min(12, input.dailyHours));

  // Weight weak subjects 1.5x, neutral 1.0x, strong 0.75x
  const weights = allSubjects.map((subj) => {
    if (input.weakSubjects.includes(subj)) return 1.5;
    if (input.strongSubjects.includes(subj)) return 0.75;
    return 1.0;
  });
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);

  const dailyAllocation = allSubjects.map((subject, idx) => ({
    subject,
    hours: Number(((hours * weights[idx]) / totalWeight).toFixed(1)),
  }));

  if (input.monthsAvailable === 12) {
    return [
      {
        phase: 'Phase 1: NCERT Foundation & Concept Building',
        durationLabel: 'Months 1 – 6',
        focus: 'Line-by-line NCERT Class 11–12 coverage across all four sciences, prioritizing weak subjects.',
        dailyAllocation,
        milestones: ['Complete 100% Class 11 & 12 NCERT theory', 'Maintain formula & reaction mechanism notebook', 'Solve topic-wise JEE/NEET/NCERT Exemplar drills'],
      },
      {
        phase: 'Phase 2: Cross-Disciplinary Problem Solving',
        durationLabel: 'Months 7 – 9',
        focus: 'Bridge conceptual gaps in your 4th subject (e.g., Biology for PCM or Maths for PCB) and tackle multi-concept IAT questions.',
        dailyAllocation,
        milestones: ['Finish all Previous Year IAT Papers (2017–2025)', 'Sectional 45-minute speed drills', 'Weekly error-log analysis'],
      },
      {
        phase: 'Phase 3: Full-Length CBT Mocks & Rapid Revision',
        durationLabel: 'Months 10 – 12',
        focus: 'Simulate 180-minute CBT conditions, refine negative-marking discipline (-1 penalty), and lock high-yield chapters.',
        dailyAllocation,
        milestones: ['Take 15–20 full 60-question CBT mock tests', 'Revise high-weightage Genetics, Kinetics, Mechanics & Calculus', 'Finalize campus preference order'],
      },
    ];
  }

  if (input.monthsAvailable === 6) {
    return [
      {
        phase: 'Phase 1: High-Yield Core Consolidation',
        durationLabel: 'Months 1 – 3',
        focus: 'Fast-track NCERT core chapters and build scoring competence in your non-board 4th subject.',
        dailyAllocation,
        milestones: ['Cover high-weightage 70% syllabus across PCB & M', 'Daily 30-question mixed practice sets'],
      },
      {
        phase: 'Phase 2: PYQ Mastery & Weak-Topic Repair',
        durationLabel: 'Months 4 – 5',
        focus: 'Solve chapter-wise IAT PYQs and eliminate recurring conceptual errors.',
        dailyAllocation,
        milestones: ['Complete all archived IAT papers under timed mode', 'Dedicated weekend drills for weak subjects'],
      },
      {
        phase: 'Phase 3: Mock Marathon & Accuracy Calibration',
        durationLabel: 'Month 6',
        focus: 'Balance attempt rate vs accuracy to avoid -1 negative marks.',
        dailyAllocation,
        milestones: ['2 full CBT mocks per week + deep post-test review', 'Final NCERT diagrams & formula sheet revision'],
      },
    ];
  }

  return [
    {
      phase: 'Phase 1: Intensive High-Yield Sprint',
      durationLabel: 'Weeks 1 – 6',
      focus: 'Target top-scoring chapters (Cell Bio, Genetics, GOC, Coordination Chem, Modern Physics, Calculus & Matrices).',
      dailyAllocation,
      milestones: ['NCERT summary revision + Exemplar key questions', 'Secure 40%+ baseline in your 4th subject'],
    },
    {
      phase: 'Phase 2: Timed PYQ & CBT Simulation',
      durationLabel: 'Weeks 7 – 12',
      focus: 'Full 180-minute mock exams every 3 days with strict time-split (40–45 mins per subject).',
      dailyAllocation,
      milestones: ['8–12 full mocks completed', 'Target >140–170/240 accuracy benchmark'],
    },
  ];
}

export function recommendCourses(
  courses: CourseProgram[],
  interest: string,
  currentStage: 'Class 12' | 'Bachelor Graduate' | 'Master Graduate' | 'PhD Holder'
): CourseProgram[] {
  const stageFilter: Record<typeof currentStage, CourseProgram['degreeType'][]> = {
    'Class 12': ['BS-MS', 'BS', 'B.Tech'],
    'Bachelor Graduate': ['MSc', 'Integrated PhD'],
    'Master Graduate': ['PhD'],
    'PhD Holder': ['PhD', 'Postdoc'],
  };

  const allowedTypes = stageFilter[currentStage];
  const normalizedInterest = interest.trim().toLowerCase();

  return courses
    .filter((c) => allowedTypes.includes(c.degreeType) || (currentStage === 'PhD Holder' && c.id === 'phd-prog'))
    .filter((c) => {
      if (!normalizedInterest || normalizedInterest === 'all') return true;
      const haystack = `${c.title} ${c.subjectsOffered.join(' ')} ${c.curriculumSummary} ${c.careerOptions.join(' ')}`.toLowerCase();
      return haystack.includes(normalizedInterest);
    });
}

export function matchScholarships(
  scholarships: Scholarship[],
  criteria: {
    degreeLevel: 'UG (BS-MS / BS / B.Tech)' | 'PhD / Research' | 'International';
    category: 'General' | 'OBC' | 'EWS' | 'SC' | 'ST' | 'PwD';
    annualFamilyIncomeLakhs: number;
  }
): Scholarship[] {
  return scholarships.filter((sch) => {
    if (criteria.degreeLevel === 'PhD / Research') {
      return sch.category === 'PhD & Research Fellowship' || sch.id === 'sch-moe-waiver' || sch.category === 'International';
    }
    if (criteria.degreeLevel === 'International') {
      return sch.category === 'International';
    }
    // UG
    if (sch.category === 'PhD & Research Fellowship') return false;
    if (sch.id === 'sch-moe-waiver') {
      return ['SC', 'ST', 'PwD'].includes(criteria.category);
    }
    if (sch.id === 'sch-nsp-css') {
      return criteria.annualFamilyIncomeLakhs <= 8 || ['SC', 'ST', 'OBC', 'EWS', 'PwD'].includes(criteria.category);
    }
    return true;
  });
}

export function compareSalaries(salaries: SalaryBenchmark[], sectorFilter: string): SalaryBenchmark[] {
  if (!sectorFilter || sectorFilter === 'All') return salaries;
  return salaries.filter((s) => s.sector === sectorFilter);
}

export function globalSearchPortal(
  query: string,
  data: {
    institutions: Institution[];
    courses: CourseProgram[];
    scholarships: Scholarship[];
    vacancies: Vacancy[];
    news: NewsNotification[];
  }
): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  for (const inst of data.institutions) {
    const text = `${inst.name} ${inst.shortName} ${inst.city} ${inst.state} ${inst.departments.join(' ')} ${inst.researchAreas.join(' ')}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `inst-${inst.id}`,
        title: inst.shortName,
        subtitle: `${inst.city}, ${inst.state} · Est. ${inst.establishedYear}`,
        category: 'Institution',
        route: 'institution-detail',
        detailId: inst.id,
      });
    }
  }

  for (const course of data.courses) {
    const text = `${course.title} ${course.degreeType} ${course.subjectsOffered.join(' ')} ${course.curriculumSummary}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `course-${course.id}`,
        title: course.title,
        subtitle: `${course.duration} · ${course.offeredAt[0]}`,
        category: 'Course',
        route: 'courses',
      });
    }
  }

  for (const sch of data.scholarships) {
    const text = `${sch.name} ${sch.provider} ${sch.eligibility} ${sch.benefitsAndAmount}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `sch-${sch.id}`,
        title: sch.name,
        subtitle: sch.benefitsAndAmount,
        category: 'Scholarship',
        route: 'scholarships',
      });
    }
  }

  for (const vac of data.vacancies) {
    const text = `${vac.position} ${vac.institution} ${vac.department} ${vac.category}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `vac-${vac.id}`,
        title: vac.position,
        subtitle: `${vac.institution} · ${vac.status}`,
        category: 'Recruitment',
        route: 'recruitment',
      });
    }
  }

  for (const item of data.news) {
    const text = `${item.title} ${item.category} ${item.summary}`.toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `news-${item.id}`,
        title: item.title,
        subtitle: `${item.category} · ${item.date}`,
        category: 'Latest Update',
        route: 'news',
      });
    }
  }

  // Static knowledge hubs
  const staticTopics: SearchResultItem[] = [
    { id: 'st-iat', title: 'IISER Aptitude Test (IAT) Syllabus, Pattern & Cut-offs', subtitle: '60 MCQs · 240 Marks · PCB & Maths', category: 'Entrance Exam', route: 'iat' },
    { id: 'st-placements', title: 'IISER Placements & NIRF Reports', subtitle: 'Institute-wise verified data & Career Development Cells', category: 'Placements', route: 'placements' },
    { id: 'st-salaries', title: 'Salary Explorer & Government Pay Scales', subtitle: 'JRF ₹37,000+HRA, Level 10 Scientist, Private R&D', category: 'Careers & Pay', route: 'salaries' },
    { id: 'st-comparison', title: 'IISER vs IISc vs IIT vs NISER vs CEBS', subtitle: 'Objective academic & career comparison', category: 'Comparison', route: 'comparison' },
    { id: 'st-fees', title: 'IISER Fees, Hostels & Campus Life', subtitle: 'Semester tuition, category waivers & residential living', category: 'Admission & Fees', route: 'admission' },
    { id: 'st-tools', title: 'Interactive Tools (Eligibility Checker, Study Planner, College Compare)', subtitle: '8 interactive student utilities', category: 'Student Tools', route: 'tools' },
  ];

  for (const topic of staticTopics) {
    if (`${topic.title} ${topic.subtitle} ${topic.category}`.toLowerCase().includes(q)) {
      results.push(topic);
    }
  }

  return results.slice(0, 12);
}
