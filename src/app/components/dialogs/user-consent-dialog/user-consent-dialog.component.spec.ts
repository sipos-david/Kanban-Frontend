import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConsentDialogComponent } from './user-consent-dialog.component';

describe('UserConsentDialogComponent', () => {
  let component: UserConsentDialogComponent;
  let fixture: ComponentFixture<UserConsentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserConsentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConsentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
