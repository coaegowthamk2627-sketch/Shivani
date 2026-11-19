import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkIatEligibility,
  generateStudyPlan,
  recommendCourses,
  matchScholarships,
  globalSearchPortal,
} from './iiserLogic';
import { DEFAULT_COURSES, DEFAULT_INSTITUTIONS } from '../data/iiserInstitutionsData';
import { DEFAULT_NEWS, DEFAULT_SCHOLARSHIPS, DEFAULT_VACANCIES } from '../data/iatAndCareersData';

test('IAT eligibility passes for 2026 PCM student with 82% General', () => {
  const res = checkIatEligibility({
    passingYear: 2026,
    targetExamYear: 2026,
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    category: 'General',
    percentage: 82,
    nationality: 'Indian',
  });
  assert.equal(res.eligibleForBsMs, true);
  assert.equal(res.eligibleForBTechOrEcon, true);
  assert.equal(res.requiredPercentage, 60);
});

test('IAT eligibility allows SC student with 56% PCB for BS-MS but flags B.Tech Maths requirement', () => {
  const res = checkIatEligibility({
    passingYear: 2025,
    targetExamYear: 2026,
    subjects: ['Physics', 'Chemistry', 'Biology'],
    category: 'SC',
    percentage: 56,
    nationality: 'Indian',
  });
  assert.equal(res.eligibleForBsMs, true);
  assert.equal(res.eligibleForBTechOrEcon, false);
  assert.equal(res.requiredPercentage, 55);
  assert.ok(res.notes.some((n) => n.includes('Mathematics')));
});

test('IAT eligibility rejects expired passing year and low percentage', () => {
  const res = checkIatEligibility({
    passingYear: 2022,
    targetExamYear: 2026,
    subjects: ['Physics', 'Chemistry'],
    category: 'General',
    percentage: 58,
    nationality: 'Indian',
  });
  assert.equal(res.eligibleForBsMs, false);
  assert.equal(res.reasons.length, 3);
});

test('Study planner allocates extra daily hours to weak subjects', () => {
  const plan = generateStudyPlan({
    targetYear: 2026,
    monthsAvailable: 6,
    dailyHours: 6,
    strongSubjects: ['Physics'],
    weakSubjects: ['Biology'],
  });
  assert.equal(plan.length, 3);
  const bio = plan[0].dailyAllocation.find((s) => s.subject === 'Biology');
  const phy = plan[0].dailyAllocation.find((s) => s.subject === 'Physics');
  assert.ok(bio && phy && bio.hours > phy.hours);
});

test('Course recommender filters properly for Class 12 vs Bachelor graduates', () => {
  const ugCourses = recommendCourses(DEFAULT_COURSES, 'all', 'Class 12');
  assert.ok(ugCourses.some((c) => c.degreeType === 'BS-MS'));
  assert.ok(!ugCourses.some((c) => c.degreeType === 'PhD'));

  const pgCourses = recommendCourses(DEFAULT_COURSES, 'all', 'Bachelor Graduate');
  assert.ok(pgCourses.some((c) => c.degreeType === 'Integrated PhD'));
});

test('Scholarship matcher includes MoE waiver only for SC/ST/PwD', () => {
  const genMatches = matchScholarships(DEFAULT_SCHOLARSHIPS, {
    degreeLevel: 'UG (BS-MS / BS / B.Tech)',
    category: 'General',
    annualFamilyIncomeLakhs: 10,
  });
  assert.ok(!genMatches.some((s) => s.id === 'sch-moe-waiver'));

  const scMatches = matchScholarships(DEFAULT_SCHOLARSHIPS, {
    degreeLevel: 'UG (BS-MS / BS / B.Tech)',
    category: 'SC',
    annualFamilyIncomeLakhs: 5,
  });
  assert.ok(scMatches.some((s) => s.id === 'sch-moe-waiver'));
});

test('Global search finds INSPIRE scholarship and IISER Pune', () => {
  const insResults = globalSearchPortal('INSPIRE', {
    institutions: DEFAULT_INSTITUTIONS,
    courses: DEFAULT_COURSES,
    scholarships: DEFAULT_SCHOLARSHIPS,
    vacancies: DEFAULT_VACANCIES,
    news: DEFAULT_NEWS,
  });
  assert.ok(insResults.some((r) => r.route === 'scholarships' && r.title.includes('INSPIRE')));

  const puneResults = globalSearchPortal('Pune', {
    institutions: DEFAULT_INSTITUTIONS,
    courses: DEFAULT_COURSES,
    scholarships: DEFAULT_SCHOLARSHIPS,
    vacancies: DEFAULT_VACANCIES,
    news: DEFAULT_NEWS,
  });
  assert.ok(puneResults.some((r) => r.route === 'institution-detail' && r.detailId === 'iiser-pune'));
});
