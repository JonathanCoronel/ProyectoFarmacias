import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subtopic } from '../../../shared/interfaces/subtopic';
import { UserService } from '../../../core/services/user.service';
import { User, UserClaims } from '../../../shared/interfaces/user';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';
import { SubtopicService } from '../../../core/services/subtopic.service';

@Component({
  selector: 'app-fom-add-subtopic',
  templateUrl: './fom-add-subtopic.component.html',
  styleUrls: ['./fom-add-subtopic.component.css'],
})
export class FomAddSubtopicComponent implements OnInit {

  createSubTopic: FormGroup;
  private savingSubscription: Subscription | null = null;
  public user!: User;
  public claims!: UserClaims;
  subtopic!: Subtopic;
  topicId!: string;
  courseId!: string;
  isValid: boolean;
  isValidated: boolean;
  isSaving = false;
  image: File[] = [];

  constructor(
    private fb: FormBuilder,
    private subtopicService: SubtopicService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.createSubTopic = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public file: File;
  public parent = null;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      this.topicId = params.topicId;
      this.courseId = params.courseId;
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
      this.isValid = this.createSubTopic.valid;

      if (this.image.length === 0){
        this.isValid = false;
        return this.isValid;
      } else {
        return this.isValid;
      }
    }

  addSubtopic(): void {
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

      const newSubtopic: Subtopic = {
        title: this.createSubTopic.value.title,
        description: this.createSubTopic.value.description   ,
        topicId: this.topicId
      }

      this.savingSubscription = this.subtopicService.saveSubtopic(newSubtopic, this.image).subscribe(
        async createdSubtopic => {
          if (createdSubtopic) {
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

  showSuccess(): void {
    Swal.fire({
      title: 'Correcto',
      text: 'Subtema agregado correctamente',
      icon: 'success'
    }).then(
      () => {
        this.isValidated = false;
        this.router.navigate(['/course', this.courseId, 'topic', this.topicId ]);
      });
  }

  showError(): void {
    Swal.fire({
      title: 'Lo sentimos',
      text: 'Ha ocurrido un problema, intente nuevamente',
      icon: 'error',
    }).then();
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
