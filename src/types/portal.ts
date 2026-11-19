export type PageRoute =
  | 'home'
  | 'about'
  | 'institutions'
  | 'institution-detail'
  | 'iat'
  | 'courses'
  | 'admission'
  | 'student-life'
  | 'scholarships'
  | 'placements'
  | 'careers'
  | 'salaries'
  | 'higher-ed'
  | 'research'
  | 'recruitment'
  | 'comparison'
  | 'tools'
  | 'resources'
  | 'news'
  | 'contact'
  | 'admin';

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  state: string;
  city: string;
  establishedYear: number;
  campusAddress: string;
  officialWebsite: string;
  placementCellUrl: string;
  researchPortalUrl: string;
  recruitmentUrl: string;
  imageUrl: string;
  history: string;
  vision: string;
  mission: string;
  departments: string[];
  ugProgrammes: string[];
  pgProgrammes: string[];
  phdProgrammes: string[];
  researchAreas: string[];
  researchLabs: string[];
  scientificInfrastructure: string[];
  libraryFacilities: string;
  hostelFacilities: string;
  sportsAndExtracurriculars: string;
  campusFacilities: string[];
  studentLife: string;
  scholarshipsAndAid: string;
  admissionOverview: string;
  placementCellOverview: string;
  alumniNetwork: string;
  internshipOpportunities: string;
  industryCollaborations: string[];
  internationalCollaborations: string[];
  contactEmail: string;
  contactPhone: string;
  nirfRank2024?: string;
  feeSummary: {
    academicYear: string;
    generalObcEwsSemesterTuition: string;
    scStPwdTuition: string;
    oneTimeAdmissionDeposit: string;
    hostelAndOtherPerSemester: string;
    messChargesNote: string;
    sourceNote: string;
  };
}

export interface CourseProgram {
  id: string;
  title: string;
  degreeType: 'BS-MS' | 'BS' | 'B.Tech' | 'MSc' | 'Integrated PhD' | 'PhD' | 'Postdoc';
  duration: string;
  eligibility: string;
  admissionProcedure: string;
  offeredAt: string[];
  subjectsOffered: string[];
  curriculumSummary: string;
  semesterStructure: string;
  researchOpportunities: string;
  internshipOpportunities: string;
  higherEducationOptions: string[];
  careerOptions: string[];
  salaryProspects: string;
  officialSourceUrl: string;
}

export interface PlacementRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  academicYear: string;
  programScope: string;
  graduatingStudents: string;
  higherStudiesCount: string;
  placedStudents: string;
  placementPercentage: string;
  medianSalary: string;
  averageSalary: string;
  highestSalary: string;
  minimumSalary: string;
  topSectorsAndRecruiters: string;
  sourceLabel: string;
  officialUrl: string;
  dataStatus: 'Published (NIRF / Institute Report)' | 'Partial Official Data' | 'Official data not publicly available';
}

export interface JobCareerPath {
  id: string;
  category: 'Research' | 'Government' | 'Private Sector' | 'Academic' | 'Other Careers';
  roleTitle: string;
  responsibilities: string;
  requiredQualifications: string;
  requiredSkills: string[];
  additionalDegreesNeeded: string;
  recruitmentExams: string;
  potentialEmployers: string[];
  salaryRangeIndia: string;
  salaryDataType: 'Verified Govt / Fellowship Scale' | 'Estimated Market Range';
  internationalOpportunities: string;
  careerGrowth: string;
}

export interface SalaryBenchmark {
  id: string;
  role: string;
  sector: 'Fellowship / Academia' | 'Government R&D' | 'Private Industry / Biotech' | 'Data Science & AI' | 'International Research';
  entryLevel: string;
  midCareer: string;
  experienced: string;
  payStructureNote: string;
  verificationType: 'Verified Official Notification / Guidelines' | 'Estimated Range';
  sourceAndYear: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  category: 'Merit & Science' | 'Category / Social Welfare' | 'PhD & Research Fellowship' | 'International';
  eligibility: string;
  benefitsAndAmount: string;
  duration: string;
  applicationProcedure: string;
  importantDates: string;
  requiredDocuments: string[];
  officialUrl: string;
  lastUpdated: string;
}

export interface Vacancy {
  id: string;
  institution: string;
  position: string;
  category: 'Faculty' | 'Postdoctoral' | 'Research (JRF/SRF/Project)' | 'Technical' | 'Administrative & Non-Teaching';
  department: string;
  qualification: string;
  experience: string;
  ageLimit: string;
  salaryOrPayLevel: string;
  deadline: string;
  status: 'Active (Rolling / Open)' | 'Closed' | 'Verify on Institute Portal';
  selectionProcedure: string;
  officialNotificationUrl: string;
  applicationUrl: string;
}

export interface NewsNotification {
  id: string;
  title: string;
  category:
    | 'IAT Announcements'
    | 'Admission & Counselling'
    | 'Results & Cut-offs'
    | 'Scholarships'
    | 'Research Achievements'
    | 'Placements'
    | 'Job & Faculty Recruitment'
    | 'PhD & Internships';
  date: string;
  sourceName: string;
  sourceType: 'Official Announcement' | 'Verified Institutional Update';
  summary: string;
  officialUrl: string;
}

export interface SyllabusSubject {
  id: 'biology' | 'chemistry' | 'physics' | 'mathematics';
  name: string;
  questionCount: number;
  maxMarks: number;
  recommendedNcert: string;
  chapters: {
    title: string;
    topics: string[];
    weightageFocus: string;
  }[];
}

export interface OfficialLink {
  id: string;
  name: string;
  category:
    | 'IISER Campuses & Admission'
    | 'Government & Regulators'
    | 'Science Agencies & Fellowships'
    | 'PhD & Higher Ed Exams'
    | 'Govt R&D Recruiters';
  description: string;
  url: string;
}

export interface CmsPayload {
  news: NewsNotification[];
  vacancies: Vacancy[];
  scholarships: Scholarship[];
  placements: PlacementRecord[];
  salaries: SalaryBenchmark[];
  courses: CourseProgram[];
  institutions: Institution[];
  lastUpdated: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  route: PageRoute;
  detailId?: string;
}
