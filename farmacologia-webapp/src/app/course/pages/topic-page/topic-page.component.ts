import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TopicService } from 'src/app/core/services/topic.service';
import { UserService } from 'src/app/core/services/user.service';
import { Topic } from 'src/app/shared/interfaces/topic';
import { User, UserClaims } from '../../../shared/interfaces/user';
import { Subtopic } from '../../../shared/interfaces/subtopic';
import { SubtopicService } from '../../../core/services/subtopic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.css']
})
export class TopicPageComponent implements OnInit {

  subtopics: Subtopic[];
  topics: Topic [] = [];
  idRoute: string;
  courseId!: string;
  topicId!: string;
  topic!: Topic;
  opciones: string[] = ["Lectura", "Video", "Foro"];
  public flag = true;
  selectedSubtopic: Subtopic | null = null;
  public user!: User;
  public claims!: UserClaims;
  subtopicIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private subtopicService: SubtopicService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(currentUser => {
      this.userService.userDocument(currentUser.email).valueChanges().subscribe(user => {
        this.user = user;
        this.userService.claimsDocument(user.email).valueChanges().subscribe(claims => this.claims = claims);

        this.route.params.subscribe((params: Params) => {
          this.courseId = params.courseId;
          this.topicId = params.topicId;

          this.topicService.topicById(this.topicId).subscribe(topic => {
            this.topic = topic;
            console.log('Topic:', this.topic); // Check if it's defined here
          });

          this.subtopicService.getSubtopicsOfTopic(this.topicId).subscribe(subtopics => {
            this.subtopics = subtopics;

            if (this.subtopics && this.subtopics.length > 0) {
              this.showSubtopicInfo(this.subtopics[0], 0);
            }
            console.log('Subtopics:', this.subtopics); // Check if they are defined here
          });
        });
      });
    });
  }

  showSubtopicInfo(subtopic: Subtopic, index: number): void {
    this.selectedSubtopic = subtopic;
    this.subtopicIndex = index;
  }

  public deleteSubtopic(subtopicId: string): void {
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
        this.subtopicService.deleteSubtopic(subtopicId).then(
          () => {
            Swal.fire(
              'Eliminado',
              'Subtema eliminado correctamente',
              'success'
            );
            this.subtopicService.getSubtopicsOfTopic(this.topicId).subscribe(subtopics => {
              this.subtopics = subtopics;
              if (this.subtopics.length > 0) {
                this.showSubtopicInfo(this.subtopics[0], 0);
              } else {
                this.selectedSubtopic = null;
              }
            });
          }
        );
      }
    });
  }
  

  form(): void {
    this.router.navigate(['/course/add-subtopic', this.idRoute]).then();
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cambiarSubtema(direccion: 'next' | 'prev'): void {
    if (direccion === 'next') {
      this.subtopicIndex = (this.subtopicIndex + 1) % this.subtopics.length;
    } else if (direccion === 'prev') {
      this.subtopicIndex = (this.subtopicIndex - 1 + this.subtopics.length) % this.subtopics.length;
    }
    this.showSubtopicInfo(this.subtopics[this.subtopicIndex], this.subtopicIndex);
  }

  cambiarSubtema2(direccion: 'next' | 'prev'): void {
    this.subtopicIndex = (this.subtopicIndex - 1 + this.subtopics.length) % this.subtopics.length;
    this.showSubtopicInfo(this.subtopics[this.subtopicIndex], this.subtopicIndex);
  }
}
