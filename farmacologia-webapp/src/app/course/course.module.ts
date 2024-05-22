import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursePageComponent } from './pages/course-page/course-page.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CourseRoutingModule } from './course-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TopicPageComponent } from './pages/topic-page/topic-page.component';
import { SubtopicPageComponent } from './pages/subtopic-page/subtopic-page.component';
import { ContributionsComponent } from './pages/contributions/contributions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './pages/form-add-topic/form.component';
import { FomAddSubtopicComponent } from './pages/fom-add-subtopic/fom-add-subtopic.component';
import { LessonsComponent } from './pages/lessons/lessons.component';
import { FormAddLessonComponent } from './pages/form-add-lesson/form-add-lesson.component';
import { MatIconModule } from '@angular/material/icon';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    CoursePageComponent,
    TopicPageComponent,
    SubtopicPageComponent,
    ContributionsComponent,
    FormComponent,
    FomAddSubtopicComponent,
    FormAddLessonComponent,
    LessonsComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    CourseRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    YouTubePlayerModule
  ]
})
export class CourseModule {}

