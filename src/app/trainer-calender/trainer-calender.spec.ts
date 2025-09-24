import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerCalender } from './trainer-calender';

describe('TrainerCalender', () => {
  let component: TrainerCalender;
  let fixture: ComponentFixture<TrainerCalender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerCalender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerCalender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
