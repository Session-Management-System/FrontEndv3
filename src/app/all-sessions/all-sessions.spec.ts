import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSessions } from './all-sessions';

describe('AllSessions', () => {
  let component: AllSessions;
  let fixture: ComponentFixture<AllSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSessions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSessions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
