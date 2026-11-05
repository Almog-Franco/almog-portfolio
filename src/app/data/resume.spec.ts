import { ALL_SKILLS, JOBS, SKILL_GROUPS, STATS, jobsUsingSkill } from './resume';

describe('resume data', () => {
  it('has no duplicate skills across groups', () => {
    expect(new Set(ALL_SKILLS).size).toBe(ALL_SKILLS.length);
  });

  it('has unique job ids (used for anchors and test ids)', () => {
    const ids = JOBS.map((j) => j.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lists exactly one current role, first in the timeline', () => {
    expect(JOBS.filter((j) => j.current)).toHaveLength(1);
    expect(JOBS[0].current).toBe(true);
  });

  it('maps skills to the roles that used them', () => {
    expect(jobsUsingSkill('Playwright').map((j) => j.company)).toEqual(['Droxi']);
    expect(jobsUsingSkill('PyTest').map((j) => j.company)).toEqual(['Nutrino Health', 'Proofpoint']);
    expect(jobsUsingSkill('Not A Skill')).toEqual([]);
  });

  it('cross-links at least one tag per job to the skills section', () => {
    for (const job of JOBS) {
      expect(job.tags.some((t) => ALL_SKILLS.includes(t)), job.id).toBe(true);
    }
  });

  it('derives the stats from the data rather than hard-coding them', () => {
    const byLabel = Object.fromEntries(STATS.map((s) => [s.label, s.value]));
    expect(byLabel['Companies']).toBe(JOBS.length);
    expect(byLabel['Tools & technologies']).toBe(SKILL_GROUPS.flatMap((g) => g.skills).length);
  });
});
