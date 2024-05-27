import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TopicService } from '../../../core/services/topic.service';
import { UserService } from 'src/app/core/services/user.service';
import { Topic } from 'src/app/shared/interfaces/topic';
import { User, UserClaims } from '../../../shared/interfaces/user';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../shared/interfaces/course';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-course-page',
  templateUrl: './course-page.component.html',
  styleUrls: ['./course-page.component.css']
})
export class CoursePageComponent implements OnInit {

  courseId!: string;
  course!: Course;
  topics: Topic [] = [];
  public user!: User;
  public claims!: UserClaims;
  currentCourseIndex = 0;
  currentCourse: Topic | 0;
  titleCourse: string;
  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private topicService: TopicService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.userService.userDocument(currentUser.email).valueChanges().subscribe(
          user => {
            this.user = user;
            this.userService.claimsDocument(user.email).valueChanges().subscribe(
              claims => this.claims = claims
            );
          }
        );
      }
    );

    this.route.params.subscribe((params: Params) => {
      this.courseId = params.courseId;
      this.titleCourse = params.nombre;
      this.courseService.course(this.courseId).subscribe(course => {
        this.course = course;
        this.topicService.getTopicsOfCourse(this.courseId).subscribe(
          topics => {
            this.topics = topics;
            this.currentCourse = this.topics[this.currentCourseIndex];
          }
        );
      });
    });
  }


  nextCourse(): void {
    this.currentCourseIndex++;
    if (this.currentCourseIndex >= this.topics.length) {
      this.currentCourseIndex = 0;
    }
    this.currentCourse = this.topics[this.currentCourseIndex];
  }

  prevCourse(): void {
    this.currentCourseIndex--;
    if (this.currentCourseIndex < 0) {
      this.currentCourseIndex = this.topics.length - 1;}
    this.currentCourse = this.topics[this.currentCourseIndex];
  }
  deleteTopic(topicId: string): void {

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción es irreversible',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#264653',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.topicService.deleteTopic(topicId).then(
          () => {
            Swal.fire(
              'Eliminado',
              'Tema eliminado correctamente',
              'success'
            );
          }
        );
      }
    });

  }

  form(): void {
    this.router.navigate(['/course', this.courseId, 'add-topic']).then();
  }

  sendToTopicView(topicId: string): void {
    this.router.navigate(['/course', this.courseId, 'topic', topicId]).then();
  }
  
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
