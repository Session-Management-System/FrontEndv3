import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sessioncards } from './sessioncards';

describe('Sessioncards', () => {
  let component: Sessioncards;
  let fixture: ComponentFixture<Sessioncards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sessioncards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sessioncards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
