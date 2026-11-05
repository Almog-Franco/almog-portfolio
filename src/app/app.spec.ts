import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { PROFILE, SECTIONS } from './data/resume';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('renders the candidate name as the page heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent).toContain(PROFILE.name);
  });

  it('renders every section the nav links to', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    for (const section of SECTIONS) {
      expect(root.querySelector(`section#${section.id}`), `missing #${section.id}`).not.toBeNull();
    }
  });
});
