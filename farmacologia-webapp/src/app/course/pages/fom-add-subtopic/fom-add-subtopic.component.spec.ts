import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FomAddSubtopicComponent } from './fom-add-subtopic.component';

describe('FomAddSubtopicComponent', () => {
  let component: FomAddSubtopicComponent;
  let fixture: ComponentFixture<FomAddSubtopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FomAddSubtopicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FomAddSubtopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
