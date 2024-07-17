import { Subtopic } from './../../../shared/interfaces/subtopic';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ContentService } from 'src/app/core/services/content.service';
import { ResourceService } from 'src/app/core/services/resource.service';
import { Content } from 'src/app/shared/interfaces/content';
import { Foro } from 'src/app/shared/interfaces/foro';
import { Respuesta } from 'src/app/shared/interfaces/respuesta';
import { Resource } from 'src/app/shared/interfaces/resource';
import {Subscription} from 'rxjs/internal/Subscription';
import Swal from 'sweetalert2';
import { User, UserClaims } from '../../../shared/interfaces/user';
import { UserService } from '../../../core/services/user.service';
import { SharedService } from '../../../core/services/sharedOp.service';


const RESOURCES_TYPES = {
  video: 'video',
  image: 'image',
  reference: 'reference',
};

let apiLoaded = false;

@Component({
  selector: 'app-form-add-lesson',
  templateUrl: './form-add-lesson.component.html',
  styleUrls: ['./form-add-lesson.component.css']
})
export class FormAddLessonComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService,
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) {
    this.createContent = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.createImage = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.createVideo = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      url: ['', Validators.required]
    });
    this.createPregunta = this.fb.group({
      respuesta: ['', Validators.required],
    });
    this.createRespuesta = this.fb.group({
      pregunta: ['', Validators.required],
    });
  }

  get createContentFormIsValid(): boolean {
    this.createContentIsValid = this.createContent.valid;
    return this.createContentIsValid;
  }

  get createVideoFormIsValid(): boolean {
    this.createVideoIsValid = this.createVideo.valid;
    return this.createVideoIsValid;
  }

  get createImageFormIsValid(): boolean {
    this.createImageIsValid = this.createImage.valid;

    if (this.image.length === 0){
      this.createImageIsValid = false;
      return this.createImageIsValid;
    } else {
      return this.createImageIsValid;
    }

    return this.createImageIsValid;
  }

  public user!: User;
  public claims!: UserClaims;

  createContent: FormGroup;
  createVideo: FormGroup;
  createImage: FormGroup;
  createPregunta: FormGroup;
  createRespuesta: FormGroup;

  private contentSavingSubscription: Subscription | null = null;
  private videoSavingSubscription: Subscription | null = null;
  private imageSavingSubscription: Subscription | null = null;

  contents!: Content[];
  resources!: Resource[];
  content: Content;
  video: Resource;
  reference: Resource;
  image: File[] = [];
  subtopicId!: string;
  selectedOption: string;
  nombreUsuario: string;
  correoUsuario: string;
  resUser: boolean = false;
  foro: Foro = {
    id: '',
    subtopicId: '',
    pregunta: '',
  }
  respuesta: Respuesta = {
    id: '',
    subtopicId: '',
    comentario: '',
    nombreUsuario: '',
    correoUsuario: '',
  }
  foros: Foro[] = [];
  respuestas: Respuesta[] = [];

  // @ViewChild('addContentcModal', { static: false })
  // addContentModal: ModalDirective;
  Editor = ClassicEditor;

  createContentIsValid!: boolean;
  createContentIsValidated!: boolean;
  createContentIsSaving!: boolean;

  createVideoIsValid!: boolean;
  createVideoIsValidated!: boolean;
  createVideoIsSaving!: boolean;

  createImageIsValid!: boolean;
  createImageIsValidated!: boolean;
  createImageIsSaving!: boolean;
  

  public file: File;

  ngOnInit(): void {
    this.createContentIsValid = false;
    this.createContentIsValidated = false;
    this.createContentIsSaving = false;

    this.createVideoIsValid = false;
    this.createVideoIsValidated = false;
    this.createVideoIsSaving = false;

    this.createImageIsValid = false;
    this.createImageIsValidated = false;
    this.createImageIsSaving = false;

    this.userService.currentUser.subscribe(
      currentUser => {
        this.userService.userDocument(currentUser.email).valueChanges().subscribe(
          user => {
            this.user = user;
            this.nombreUsuario = user.displayName;
            this.correoUsuario = user.email;
            this.userService.claimsDocument(user.email).valueChanges().subscribe(
              claims => this.claims = claims
            );
          }
        );
      }
    );

    this.activatedRoute.params.subscribe(async (params: Params) => {
      this.subtopicId = params.subtopicId;
      this.contentService.getContentsOfSubtopic(this.subtopicId).subscribe(
        contents => this.contents = contents
      );
      this.resourceService.getResourceOfSubtopic(this.subtopicId).subscribe(
        resources => this.resources = resources
      );
    });

    // Youtube player

    if (!apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }

    this.sharedService.getSelectedOption().subscribe(option => {
      this.selectedOption = option;
    });

    this.getPreguntas();
    this.getRespuestas();

    // this.userService.currentUser.subscribe(currentUser => {
    //   this.userService.userDocument(currentUser.email).valueChanges().subscribe(user => {
    //     const usuarioYaRespondio = this.respuestas.some(respuesta => respuesta.correoUsuario === user.email);
    //     this.resUser = !usuarioYaRespondio;
    //     console.log(this.resUser)
    //   });
    // });

  }

  addContent(): void {

    this.createContentIsValidated = true;
    this.createContentIsSaving = true;

    if (!!this.contentSavingSubscription) {
      this.createContentIsSaving = false;
      return;
    }

    if (!this.createContentFormIsValid) {

      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, asegúrese de ingresar todos los campos del formulario.',
      }).then(() => { this.createContentIsSaving = false; });

    } else {

      const newContent: Content = {
        title: this.createContent.value.title,
        description: this.createContent.value.description,
        subtopicId: this.subtopicId
      };

      this.contentSavingSubscription = this.contentService.saveContent(newContent).subscribe(
        async createdContent => {
          if (createdContent) {
            this.showSuccess();
          } else {
            this.showError();
          }
          this.createContentIsSaving = false;
          this.createContentIsValidated = false;
          this.contentSavingSubscription.unsubscribe();
        }
      );
    }
  }

  addPregunta() {
    this.foro.subtopicId = this.subtopicId;
    const path = 'foro';
    const id = this.contentService.createId();
    this.foro.id = id;

    this.contentService.createDoc(this.foro, path, id).then(res => {
      console.log('respuesta ->', res);
    });
  }

  getPreguntas(){
    this.contentService.getCollectionsAdmin<Foro>('foro').subscribe( res => {
      this.foros = res;
      const foroEncontrado = this.foros.find(foro => foro.subtopicId === this.subtopicId);
      if (foroEncontrado) {
        this.foro = foroEncontrado;
      }
    });
  }

  addRespuesta() {
    this.respuesta.nombreUsuario = this.nombreUsuario;
    this.respuesta.correoUsuario = this.correoUsuario;
    this.respuesta.subtopicId = this.subtopicId;
    const path = 'respuesta';
    const id = this.contentService.createId();
    this.respuesta.id = id;

    this.contentService.createDoc(this.respuesta, path, id).then(res => {
      console.log('respuesta ->', res);
    });
  }

  getRespuestas(){
    this.contentService.getCollectionsAdmin<Respuesta>('respuesta').subscribe( res => {
      this.respuestas = res;
      this.respuestas = this.respuestas.filter(respuesta => respuesta.subtopicId === this.subtopicId);
    });
  }

  addVideo(): void{

    this.createVideoIsValidated = true;
    this.createVideoIsSaving = true;

    if (!!this.videoSavingSubscription) {
      this.createVideoIsSaving = false;
      return;
    }

    if (!this.createVideoFormIsValid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, asegúrese de ingresar todos los campos del formulario.',
      }).then(
        () => {
          this.createVideoIsSaving = false;
        }
      );
    } else {

      const newVideoResourse: Resource = {
        title: this.createVideo.value.title,
        description: this.createVideo.value.description,
        subtopicId: this.subtopicId,
        type: RESOURCES_TYPES.video,
        source: this.createVideo.value.url
      };

      this.videoSavingSubscription = this.resourceService.saveResource(newVideoResourse, null).subscribe(
        async createdResource => {
          if (createdResource) {
            this.showSuccess();
          } else {
            this.showError();
          }
          this.createContentIsSaving = false;
          this.createContentIsValidated = false;
          this.contentSavingSubscription.unsubscribe();
        }
      );

    }

  }

  addImage(): void{

    this.createImageIsValidated = true;
    this.createImageIsSaving = true;

    if (!!this.imageSavingSubscription) {
      this.createImageIsSaving = false;
      return;
    }

    if (!this.createImageFormIsValid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, asegúrese de ingresar todos los campos del formulario.',
      }).then(
        () => {
          this.createImageIsSaving = false;
        }
      );
    } else {

      const newImageResource: Resource = {
        title: this.createImage.value.title,
        description: this.createImage.value.description,
        subtopicId: this.subtopicId,
        type: RESOURCES_TYPES.image
      };

      this.imageSavingSubscription = this.resourceService.saveResource(newImageResource, this.image).subscribe(
        async createdResource => {
          if (createdResource) {
            this.showSuccess();
          } else {
            this.showError();
          }
          this.createImageIsSaving = false;
          this.createImageIsValidated = false;
          this.imageSavingSubscription.unsubscribe();
        }
      );
    }
  }

  deleteContent(contentId: string): void{

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

        this.contentService.deleteContent(contentId).then(
          () => {
            Swal.fire(
              'Eliminado',
              'Contenido eliminado correctamente',
              'success'
            );
          }
        );
      }
    });

  }

  deletePregunta(foroId: string): void {
    const path = 'foro';
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
        this.contentService.deleteDoc(path, foroId).then(
          () => {
            Swal.fire(
              'Eliminado',
              'Contenido eliminado correctamente',
              'success'
            );
          }
        ).catch(error => {
          console.error('Error al eliminar la pregunta:', error);
          Swal.fire(
            'Error',
            'No se pudo eliminar la pregunta. Intente nuevamente más tarde.',
            'error'
          );
        });
      }
    });
  }  

  deleteResource(resourceId: string): void{

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

        this.resourceService.deleteResource(resourceId).then(
          () => {
            Swal.fire(
              'Eliminado',
              'Recurso eliminado correctamente',
              'success'
            );
          }
        );
      }
    });

  }

  showSuccess(): void {
    Swal.fire({
      title: 'Correcto',
      text: 'Contenido agregado correctamente',
      icon: 'success'
    }).then(
      () => {
        this.createContent.reset();
        this.createVideo.reset();
        this.createImage.reset();

        this.createContentIsValidated = false;
        this.createVideoIsValidated = false;
        this.createImageIsValidated = false;

        window.location.reload();
      });
  }

  showError(): void {
    Swal.fire({
      title: 'Lo sentimos',
      text: 'Ha ocurrido un problema, intente nuevamente',
      icon: 'error',
    }).then();
  }

  getYouTubeId(url): string{
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
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

  updateUserRes(userBool: boolean): void {
    this.sharedService.setUserBool(userBool);
  }
}
