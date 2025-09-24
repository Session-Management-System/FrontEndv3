import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerSessionList } from './trainer-session-list';

describe('TrainerSessionList', () => {
  let component: TrainerSessionList;
  let fixture: ComponentFixture<TrainerSessionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerSessionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerSessionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
