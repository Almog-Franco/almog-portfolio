import { ALL_SKILLS, CAREER_PIPELINE, JOBS, PIPELINE_META, jobsUsingSkill } from './resume';

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

  it('runs the career pipeline oldest-first, ending with the current role', () => {
    expect(CAREER_PIPELINE).toHaveLength(JOBS.length);
    expect(CAREER_PIPELINE[0].company).toBe('Namogoo');
    expect(CAREER_PIPELINE.at(-1)?.current).toBe(true);
  });

  it('derives pipeline artifacts from the skills list', () => {
    expect(PIPELINE_META.artifacts).toBe(`${ALL_SKILLS.length} skills`);
  });
});
