import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TestRoutingModule } from './test-routing.module';
import { TestPageComponent } from './test-page/test-page.component';
import { BackgroundDirective } from '../background.directive';
import { FomAddQuizzComponent } from './add-quizz/fom-add-quizz/fom-add-quizz.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [TestPageComponent, BackgroundDirective,FomAddQuizzComponent],
  imports: [
    CommonModule,
    TestRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
  ]
})
export class TestModule { }
