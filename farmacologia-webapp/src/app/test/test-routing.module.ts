import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FomAddQuizzComponent } from './add-quizz/fom-add-quizz/fom-add-quizz.component';
import { TestPageComponent } from './test-page/test-page.component';

const routes: Routes = [
  {
    path: ':id',
    component: TestPageComponent,
  },
  {
    path: 'add-quizz/:id',
    component: FomAddQuizzComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SharedModule],
})
export class TestRoutingModule {}
