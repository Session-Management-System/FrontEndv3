import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mysessions } from './mysessions';

describe('Mysessions', () => {
  let component: Mysessions;
  let fixture: ComponentFixture<Mysessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mysessions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mysessions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
