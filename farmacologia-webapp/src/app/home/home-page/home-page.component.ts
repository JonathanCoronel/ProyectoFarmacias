import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserClaims } from '../../shared/interfaces/user';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { Course } from '../../shared/interfaces/course';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public user!: User;
  public claims!: UserClaims;
  createCourseForm: FormGroup;
  isValid: boolean;
  isValidated: boolean;
  isSaving = false;
  courses: Course[] = [];
  selectedCourse: { id: string, title: string, description: string } | null = null;
  currentPage = 0;
  itemsPerPage = 3;

  private savingSubscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.createCourseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.courseService.getCoursesCollection().valueChanges().subscribe(
      courses => {
        this.courses = courses;
        console.log(this.courses);
      }
    );

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
  }

  get formIsValid(): boolean {
    this.isValid = this.createCourseForm.valid;
    return this.isValid;
  }

  send(courseId: string, nombre): void {
    if (this.user) {
      this.router.navigate(['/course', courseId, nombre]).then();
    } else {
      this.router.navigate(['/ingresar']).then();
    }
  }

  deleteCourse(courseId: string): void {
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
        this.courseService.deleteCourse(courseId).then(
          () => {
            Swal.fire(
              'Eliminado',
              'Curso eliminado correctamente',
              'success'
            );
          }
        );
      }
    });
  }

  addCourse(): void {
    this.isValidated = true;
    this.isSaving = true;

    if (!!this.savingSubscription) {
      this.isSaving = false;
      return;
    }

    if (!this.formIsValid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, asegúrese de ingresar todos los campos del formulario.',
      }).then(
        () => {
          this.isSaving = false;
        }
      );
    } else {
      const newCourse: Course = {
        title: this.createCourseForm.value.title,
        description: this.createCourseForm.value.description
      };

      this.savingSubscription = this.courseService.saveCourse(newCourse).subscribe(
        async createdCourse => {
          if (createdCourse) {
            this.showSuccess();
            this.createCourseForm.reset();
          } else {
            this.showError();
          }
          this.isSaving = false;
          this.isValidated = false;
          this.savingSubscription.unsubscribe();
        }
      );
    }
  }

  showSuccess(): void {
    Swal.fire({
      title: 'Correcto',
      text: 'El curso ha sido agregado correctamente',
      icon: 'success'
    }).then(
      () => {
        this.isValidated = false;
        window.location.reload();
      });
  }

  showError(): void {
    Swal.fire({
      title: 'Lo sentimos',
      text: 'Ha ocurrido un problema, intente nuevamente',
      icon: 'error',
    }).then(
      () => {
        this.isValidated = false;
        window.location.reload();
      }
    );
  }

  getCourseColorClass(index: number): string {
    const colors = ['color-course-1', 'color-course-2', 'color-course-3'];
    const colorIndex = index % colors.length;

    return colors[colorIndex];
  }

  getCourseClasses(course: Course, index: number): string {
    const baseClass = this.getCourseColorClass(index);
    return this.selectedCourse?.id === course.id ? `selected ${baseClass}` : baseClass;
  }

  selectCourse(course: Course): void {
    this.selectedCourse = {
      id: course.id,
      title: course.title,
      description: course.description
    };
    console.log(this.selectedCourse);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.itemsPerPage < this.courses.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
