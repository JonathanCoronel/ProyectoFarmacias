import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CoursePageComponent } from './pages/course-page/course-page.component';
import { FomAddSubtopicComponent } from './pages/fom-add-subtopic/fom-add-subtopic.component';
import { FormComponent } from './pages/form-add-topic/form.component';
import { SubtopicPageComponent } from './pages/subtopic-page/subtopic-page.component';
import { TopicPageComponent } from './pages/topic-page/topic-page.component';

const routes: Routes = [
  {
    path: ':courseId/:nombre',
    component: CoursePageComponent,
  },
  {
    path: ':courseId/add-topic',
    component: FormComponent
  },
  {
    path: ':courseId/topic/:topicId',
    component: TopicPageComponent
  },
  {
    path: ':courseId/topic/:topicId/add-subtopic',
    component: FomAddSubtopicComponent
  },
  {
    path: ':courseId/topic/:topicId/subtopic/:subtopicId',
    component: SubtopicPageComponent
  },
  {
    path: '**',
    redirectTo: '/liv-home',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SharedModule],
})
export class CourseRoutingModule {
  
}
