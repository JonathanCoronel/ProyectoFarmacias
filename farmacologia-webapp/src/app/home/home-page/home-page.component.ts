import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

  @ViewChild('imageFile', {static: false}) inputImage: ElementRef;

  public user!: User;
  public claims!: UserClaims;
  createCourseForm: FormGroup;
  isValid: boolean;
  isValidated: boolean;
  isSaving = false;
  image: File[] = [];
  courses: Course[] = [];
  selectedCourse: { id: string, title: string, description: string } | null = null;

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

    if (this.image.length < 1) {
      this.isValid = false;
      return this.isValid;
    } else {
      return this.isValid;
    }
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
              'Tema eliminado correctamente',
              'success'
            );
          }
        );
      }
    });

  }

  detectImages(event): void {
    const files: FileList | null = event.target.files;
    this.image = [];
    if (files) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < files.length; i++) {
        this.image.push(files[i]);
      }
    }
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

      this.savingSubscription = this.courseService.saveCourse(newCourse, this.image).subscribe(
        async createdCourse => {
          if (createdCourse) {
            this.showSuccess();
            this.createCourseForm.reset();
            this.inputImage.nativeElement.value = '';
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
      text: 'El recurso ha sido agregado correctamente',
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
    const colorIndex = index % colors.length; // Usamos el operador módulo para asegurarnos de que el índice esté dentro del rango

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
}
