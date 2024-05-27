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

        // Move the route.params subscription here
        this.route.params.subscribe((params: Params) => {
          this.courseId = params.courseId;
          this.topicId = params.topicId;

          // Move the topic and subtopic retrieval here
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

  // send(id: string, text: object): void {
  //   // this.topicService.processCountdown(text);
  //   this.router.navigate(['/course/tema/subtema', id]).then();
  // }

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

}
