import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopicService } from '../../../core/services/topic.service';
import { Topic } from 'src/app/shared/interfaces/topic';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User, UserClaims } from '../../../shared/interfaces/user';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {

  public user!: User;
  public claims!: UserClaims;
  public createTopic: FormGroup;
  private savingSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private topicService: TopicService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.createTopic = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      requirements: ['', Validators.required],
      learning: ['', Validators.required],
    });
  }

  isValid: boolean = false;
  isValidated: boolean = false;
  isSaving: boolean = false;
  image: File[] = [];
  courseId: string = '';
  courseName: string = '';

  // requirements
  selectableRequirements = true;
  removableRequirements = true;
  addOnBlurRequirements = true;
  readonly separatorKeysCodesRequirements: number[] = [ENTER, COMMA];
  requirements: string[] = [];

  // learning
  selectableLearning = true;
  removableLearning = true;
  addOnBlurLearning = true;
  readonly separatorKeysCodesLearning: number[] = [ENTER, COMMA];
  learning: string[] = [];

  addRequirement(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add requirement
    if ((value || '').trim()) {
      this.requirements.push(value.trim());
      this.createTopic.patchValue({
        requirements: this.requirements
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeRequirement(requirement: string): void {
    const index = this.requirements.indexOf(requirement);

    if (index >= 0) {
      this.requirements.splice(index, 1);
      this.createTopic.patchValue({
        requirements: this.requirements
      });
    }
  }

  addLearning(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add learning
    if ((value || '').trim()) {
      this.learning.push(value.trim());
      this.createTopic.patchValue({
        learning: this.learning
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeLearning(requirement: string): void {
    const index = this.learning.indexOf(requirement);

    if (index >= 0) {
      this.learning.splice(index, 1);
      this.createTopic.patchValue({
        learning: this.learning
      });
    }
  }

  ngOnInit(): void {
    console.log('el form');

    this.activatedRoute.params.subscribe(async (params: Params) => {
        this.courseId = params.courseId;
        this.courseName = params.nombre;
        console.log('Course ID:', this.courseId);
      });

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
    this.isValid = this.createTopic.valid;

    if (this.image.length === 0){
      this.isValid = false;
      return this.isValid;
    } else {
      return this.isValid;
    }
  }

  addTopic(): void {
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
      }).then(() => {
        this.isSaving = false;
      });
    } else {
      const newTopic: Topic = {
        courseId: this.courseId,
        title: this.createTopic.value.title,
        content: this.createTopic.value.content,
        requirements: this.createTopic.value.requirements,
        learning: this.createTopic.value.learning
      };
  
      this.savingSubscription = this.topicService.saveTopic(newTopic, this.image).subscribe(
        async createdCourse => {
          if (createdCourse) {
            this.showSuccess();
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

  showSuccess(): void{
    Swal.fire({
      title: 'Correcto',
      text: 'Tema agregado correctamente',
      icon: 'success'
    }).then(
      () => {
        this.isValidated = false;
        this.router.navigate(['/course/', this.courseId , this.courseName]);
        
      });
  }

  showError(): void{
    Swal.fire({
      title: 'Lo sentimos',
      text: 'Ha ocurrido un problema, intente nuevamente',
      icon: 'error',
    }).then();
  }

  cancel(): void {
    this.router.navigate(['/course/', this.courseId, this.courseName]);
  }

  captureFile(event): void {
    const files: FileList | null = event.target.files;
    this.image = [];
    if (files) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < files.length; i++) {
        this.image.push(files[i]);
      }
    }
  }

}
