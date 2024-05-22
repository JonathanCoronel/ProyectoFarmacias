import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddLessonComponent } from './form-add-lesson.component';

describe('FormAddLessonComponent', () => {
  let component: FormAddLessonComponent;
  let fixture: ComponentFixture<FormAddLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddLessonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
