import type { IconName } from '../shared/icon';

/**
 * Single source of truth for everything shown on the site.
 * Update this file to change the content — no template edits needed.
 */

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  phoneHref: string;
  linkedin: string;
  linkedinLabel: string;
  cvUrl: string;
  cvFileName: string;
  openToWork: boolean;
  tagline: string;
  summary: string;
  roles: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  icon: IconName;
  skills: string[];
}

/** A measurable result, shown as a metric chip + one line on the job card. */
export interface Win {
  metric: string;
  text: string;
}

export interface Job {
  id: string;
  role: string;
  company: string;
  period: string;
  current: boolean;
  summary: string;
  wins?: Win[];
  highlights: string[];
  /** Tags that exactly match a skill name are cross-linked with the skills section. */
  tags: string[];
}

export const PROFILE: Profile = {
  name: 'Almog Franco',
  title: 'QA Automation Engineer',
  location: 'Gannei Tikva, Israel',
  email: 'almog246@gmail.com',
  phone: '054-7332609',
  phoneHref: 'tel:+972547332609',
  linkedin: 'https://www.linkedin.com/in/almog-franco-154573177',
  linkedinLabel: 'linkedin.com/in/almog-franco-154573177',
  cvUrl: '/Almog-Franco-Resume.pdf',
  cvFileName: 'Almog-Franco-Resume.pdf',
  openToWork: false,
  tagline:
    'I build end-to-end UI & API automation frameworks in Python and JavaScript — plus AI agents and workflows that take the busywork out of QA.',
  summary:
    'QA Automation Engineer with 4+ years of experience architecting end-to-end UI and API automation frameworks in Python and JavaScript. Specialized in Playwright, PyTest, CI/CD integration, and flaky-test stabilization. Leverages modern AI engineering (agents, LLM CLI tooling) to automate root-cause triage and streamline testing lifecycles.',
  roles: [
    'QA Automation Engineer',
    'Playwright & PyTest specialist',
    'Flaky-test exterminator',
    'AI workflow builder',
  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'automation',
    label: 'Languages & Automation',
    icon: 'code',
    skills: [
      'Python',
      'JavaScript',
      'Java',
      'Playwright',
      'PyTest',
      'Selenium WebDriver',
      'Page Object Model (POM)',
    ],
  },
  {
    id: 'testing',
    label: 'Testing Specialties',
    icon: 'flask',
    skills: [
      'API Automation',
      'End-to-End (E2E) Testing',
      'UI Testing',
      'Test Strategy',
      'Flaky Test Stabilization',
      'Root-Cause Analysis',
    ],
  },
  {
    id: 'cicd',
    label: 'CI/CD, Cloud & Tools',
    icon: 'cloud',
    skills: [
      'GitHub Actions',
      'Jenkins',
      'GitLab CI',
      'Docker',
      'AWS',
      'SQL',
      'MongoDB',
      'Jira',
      'Xray',
      'Git',
      'n8n',
    ],
  },
  {
    id: 'ai',
    label: 'AI-Assisted Engineering',
    icon: 'sparkles',
    skills: ['Claude Code (via AWS Bedrock)', 'Codex (OpenAI CLI)', 'Gemini CLI', 'GitHub Copilot'],
  },
];

export const ALL_SKILLS: string[] = SKILL_GROUPS.flatMap((g) => g.skills);

export const JOBS: Job[] = [
  {
    id: 'droxi',
    role: 'QA Automation Engineer',
    company: 'Droxi',
    period: '2026 – Present',
    current: true,
    summary:
      'End-to-end automation for a clinical/EHR web platform with Playwright + Python, covering lab orders, clinical documents and Athena Health pipelines.',
    wins: [
      {
        metric: 'Shipped to production',
        text: 'Built the first working version of “Send to EHR”: one click writes a clinician-reviewed care plan straight into the patient’s Athena chart. Released in Care Plan V1.',
      },
      {
        metric: '1–3 h saved / day',
        text: 'Built an AI triage workflow that investigates failing runs and opens PRs with the automation fixes.',
      },
      {
        metric: 'UI → API setup',
        text: 'Moved test setup from the UI to the API by replicating the app’s network traffic.',
      },
    ],
    highlights: [
      'Design and maintain end-to-end test automation for a clinical/EHR web platform using Playwright and Python, covering critical workflows: clinical document handling, lab orders, and patient-request pipelines integrated with Athena Health.',
      'Developed an AI triage agent that automatically investigates failing test runs, isolates root causes, and opens pull requests with automated test fixes, drastically cutting triage overhead.',
      'Applied blast-radius analysis before changing shared fixtures and page objects to avoid unintended breakage across dependent tests.',
      'Architected maintainable test suites using the Page Object Model, separating locators and widget state from generic helpers so tests stay readable and reusable across the team.',
      'Integrated automated testing with Jira and Xray, authoring test cases and linking them to tickets for traceability; raised team code quality by codifying recurring PR-review patterns into a reusable review checklist.',
    ],
    tags: [
      'Playwright',
      'Python',
      'End-to-End (E2E) Testing',
      'UI Testing',
      'Page Object Model (POM)',
      'Root-Cause Analysis',
      'Jira',
      'Xray',
      'AI Agents',
    ],
  },
  {
    id: 'nutrino',
    role: 'Automation Engineer',
    company: 'Nutrino Health',
    period: '2024 – 2026',
    current: false,
    summary:
      'Backend REST API automation suites in Python & PyTest — validating payloads, response schemas and business logic for new microservices.',
    wins: [
      {
        metric: '3 days → 30 min',
        text: 'Automated test-data generation across 400+ iterations.',
      },
      {
        metric: 'Data integrity',
        text: 'Wrote automated scripts that validate the data our schema-validation service relies on.',
      },
      {
        metric: 'AI on nightlies',
        text: 'Added AI-based analysis of the nightly test runs.',
      },
    ],
    highlights: [
      'Architected and maintained comprehensive backend REST API automation test suites using Python and PyTest, validating complex data payloads, response schemas, and system business logic.',
      'Optimized test framework execution time and suite reliability through PyTest fixture optimization, modular setup/teardown hooks, and proactive flaky test refactoring.',
      'Defined API test strategies and structured comprehensive test plans for newly deployed microservices and backend endpoints.',
      'Conducted in-depth root-cause analysis on API automation failures, collaborating directly with R&D to patch backend defects and verify production releases.',
    ],
    tags: [
      'Python',
      'PyTest',
      'API Automation',
      'Test Strategy',
      'Flaky Test Stabilization',
      'Root-Cause Analysis',
      'Microservices',
    ],
  },
  {
    id: 'proofpoint',
    role: 'QA Automation Engineer',
    company: 'Proofpoint',
    period: '2022 – 2024',
    current: false,
    summary:
      'System Test Plans and 40+ automated sanity & regression flows in Python & PyTest, extending internal automation infrastructure.',
    wins: [
      {
        metric: '40+ flows',
        text: 'Automated 40+ critical sanity and regression flows with Python & PyTest.',
      },
      {
        metric: 'Award nominee',
        text: 'Nominated for a company award following a recommendation from a major enterprise customer.',
      },
    ],
    highlights: [
      'Formulated and executed System Test Plans (STP), automating 40+ critical sanity and regression test flows using Python and PyTest.',
      'Contributed Python code to extend internal automation infrastructure, enhancing test execution reliability.',
      'Analyzed automated test execution cycles to identify regressions and bridge gaps in automation coverage.',
      'Collaborated with developers to debug functional issues and validate software defect resolutions.',
    ],
    tags: ['Python', 'PyTest', 'Test Strategy', 'Regression Testing', 'STP'],
  },
  {
    id: 'namogoo',
    role: 'QA Engineer',
    company: 'Namogoo',
    period: '2021 – 2022',
    current: false,
    summary:
      'Functional, exploratory and regression testing of client-facing web solutions and JavaScript behaviors across browsers.',
    highlights: [
      'Executed functional, exploratory, and regression testing on client-facing web solutions, validating DOM extraction logic and JavaScript behaviors across diverse browser environments.',
      'Conducted root-cause analysis on client-reported defects using Chrome DevTools and network inspection, partnering closely with R&D to isolate bugs and verify patches.',
      'Tested and validated JavaScript-based webhooks to ensure accurate attribute extraction and minimal impact on host site performance.',
      'Authored comprehensive defect reports with step-by-step reproduction flows, logs, and payload traces to streamline developer turnaround.',
    ],
    tags: ['JavaScript', 'UI Testing', 'Root-Cause Analysis', 'Exploratory Testing', 'Chrome DevTools'],
  },
];

export const EDUCATION = {
  degree: 'B.Sc. Computer Science',
  school: 'HIT — Holon Institute of Technology',
  period: '2020 – 2024',
};

export const CERTIFICATIONS = [{ name: 'AWS Academy Graduate', detail: 'Introduction to Cloud', year: '2022' }];

export const LANGUAGES = [
  { name: 'Hebrew', level: 'Native' },
  { name: 'English', level: 'Fluent' },
];

/** Career rendered as a CI workflow run — oldest job first, like pipeline stages. */
export const CAREER_PIPELINE: Job[] = [...JOBS].reverse();

export const PIPELINE_META = {
  workflow: 'career.yml',
  startedYear: 2021,
  totalDuration: '4+ yrs',
  artifacts: `${ALL_SKILLS.length} skills`,
};

/** Names of the "tests" the hero terminal runs against the candidate. */
export const CANDIDATE_TESTS: string[] = [
  'test_has_4_plus_years_of_qa_experience',
  'test_builds_e2e_frameworks_with_playwright',
  'test_automates_rest_apis_with_pytest',
  'test_integrates_ci_cd_pipelines',
  'test_stabilizes_flaky_tests',
  'test_performs_root_cause_analysis',
  'test_builds_ai_agents_and_workflows',
  'test_holds_bsc_computer_science',
];

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export interface ProjectLink {
  label: string;
  href: string;
  icon: IconName;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  highlights: string[];
  tech: string[];
  image?: { src: string; alt: string; shape: 'wide' | 'phone' };
  /** Shown instead of an image: a short terminal transcript. */
  terminal?: string[];
  links: ProjectLink[];
  note?: string;
  /** Live GitHub Actions status for this repo's workflow. */
  ci?: { repo: string; workflow: string };
}

const GITHUB = 'https://github.com/Almog-Franco';

export const PROJECTS: Project[] = [
  {
    id: 'ammeter',
    name: 'Ammeter Test Framework',
    tagline:
      'A Python framework that samples three ammeter emulators, decides PASS/FAIL from physics-derived checks, and archives every run.',
    highlights: [
      'Scheduled sampling with hard deadlines across Greenlee, ENTES and CIRCUTOR emulators over TCP',
      'Acceptance limits calibrated from 4M simulated readings, then verified against 20,000 real emulator readings',
      'Fault injection proves the error handling; each run gets a report, charts and a JSON archive entry',
    ],
    tech: ['Python', 'PyTest', 'pytest-xdist', 'matplotlib', 'TCP sockets'],
    image: {
      src: '/projects/ammeter-timeseries.png',
      alt: 'Chart from a real run: ENTES ammeter readings over time with mean and ±1σ band, verdict PASS',
      shape: 'wide',
    },
    links: [{ label: 'Source', href: `${GITHUB}/ammeter-test-framework`, icon: 'github' }],
  },
  {
    id: 'email-to-trello',
    name: 'Email-to-Trello QA Suite',
    tagline:
      'End-to-end checks for a system that turns incoming emails into Trello cards — validated through the API and the board UI.',
    highlights: [
      'API sync validation: expected cards built from a mock inbox, compared with the live board (one test per card)',
      'Playwright UI scenarios with page objects and a saved session, so MFA is needed once, not every run',
      'Retries with exponential backoff, Allure reports in GitHub Actions, and a written manual test plan',
    ],
    tech: ['Python', 'PyTest', 'Playwright', 'Trello REST API', 'GitHub Actions', 'Allure'],
    terminal: [
      '$ pytest tests/test_sync_login.py -v',
      'test_card_description_sync[summarize the meeting] PASSED',
      'test_card_urgent_label_sync[summarize the meeting] PASSED',
      'test_no_extra_cards_in_trello PASSED',
    ],
    links: [{ label: 'Source', href: `${GITHUB}/email-to-trello-qa`, icon: 'github' }],
  },
  {
    id: 'neon-runner',
    name: 'Neon Runner Deluxe',
    tagline: 'My vaporwave endless-runner mobile game for iOS and Android.',
    highlights: [
      'Four game modes, power-ups, a character shop, achievements and daily challenges',
      'Firebase global leaderboard with anonymous sign-in and account-recovery codes',
      'Rewarded ads (AdMob + Unity Ads); a Jest suite runs before every Android build',
    ],
    tech: ['JavaScript', 'Capacitor', 'Firebase', 'AdMob', 'Jest'],
    image: { src: '/projects/neon-runner.png', alt: 'Neon Runner Deluxe main menu', shape: 'phone' },
    links: [],
    note: 'Private repo',
  },
  {
    id: 'portfolio',
    name: 'This portfolio',
    tagline: 'The site you’re on — built and tested like a production app.',
    highlights: [
      'Angular 22 with signals and zoneless change detection, ~60 kB initial load',
      'Playwright E2E suite with page objects, data-driven from the same content the UI renders',
      'CI on every push, and the same suite runs against the live production site',
    ],
    tech: ['Angular', 'TypeScript', 'Playwright', 'Vitest', 'GitHub Actions', 'Vercel'],
    terminal: [
      '$ npm run e2e:prod',
      'Running E2E tests against almog-portfolio-tau.vercel.app',
      '✓ terminal · skills ↔ experience · projects · site basics',
    ],
    links: [{ label: 'Source', href: `${GITHUB}/almog-portfolio`, icon: 'github' }],
    ci: { repo: 'Almog-Franco/almog-portfolio', workflow: 'ci.yml' },
  },
];

export const UNIVERSITY_PROJECTS = [
  {
    name: 'Search engine',
    detail: 'Python · Docker',
    href: `${GITHUB}/Search_engine`,
  },
  {
    name: 'Secure communication system',
    detail: 'Django · MySQL · STRIDE threat model · team of 4',
    href: `${GITHUB}/Django_system`,
  },
];

/** Jobs where a given skill was used (based on exact tag matches). */
export function jobsUsingSkill(skill: string): Job[] {
  return JOBS.filter((j) => j.tags.includes(skill));
}
