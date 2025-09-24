import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingSessions } from './upcoming-sessions';

describe('UpcomingSessions', () => {
  let component: UpcomingSessions;
  let fixture: ComponentFixture<UpcomingSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingSessions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingSessions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
