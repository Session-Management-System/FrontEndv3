import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPending } from './admin-pending';

describe('AdminPending', () => {
  let component: AdminPending;
  let fixture: ComponentFixture<AdminPending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPending);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
