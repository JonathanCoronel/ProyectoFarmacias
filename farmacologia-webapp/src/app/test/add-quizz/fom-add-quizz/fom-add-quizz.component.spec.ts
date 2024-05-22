import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FomAddQuizzComponent } from './fom-add-quizz.component';

describe('FomAddQuizzComponent', () => {
  let component: FomAddQuizzComponent;
  let fixture: ComponentFixture<FomAddQuizzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FomAddQuizzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FomAddQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
