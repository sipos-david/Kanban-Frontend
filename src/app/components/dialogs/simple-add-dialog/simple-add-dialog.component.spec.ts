import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAddDialogComponent } from './simple-add-dialog.component';

describe('SimpleAddDialogComponent', () => {
  let component: SimpleAddDialogComponent;
  let fixture: ComponentFixture<SimpleAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleAddDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
