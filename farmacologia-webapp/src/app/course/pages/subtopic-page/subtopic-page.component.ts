import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { TopicService } from 'src/app/core/services/topic.service';
import { Topic } from 'src/app/shared/interfaces/topic';
import { UserService } from 'src/app/core/services/user.service';
import { Subtopic } from '../../../shared/interfaces/subtopic';
import { User, UserClaims } from '../../../shared/interfaces/user';
import { SubtopicService } from '../../../core/services/subtopic.service';


@Component({
  selector: 'app-subtopic-page',
  templateUrl: './subtopic-page.component.html',
  styleUrls: ['./subtopic-page.component.css']
})

export class SubtopicPageComponent implements OnInit {
  contents: any = [];
  subtopic!: Subtopic;
  subtopics: Subtopic[];
  resources: any = [];
  selectedSubtopic: Subtopic | null = null;
  subtopicIndex: number = 0;
  opciones: string[] = ["Lectura", "Video", "Foro"];
  tabs = [
    {name: 'CLASES', active: true},
    // {name: 'APORTES', active: false},
  ];
  selectedTab = this.tabs[0];
  public flag = true;

  subtopicId!: string;
  topicId!: string;
  topic!: Topic;
  courseId!: string;

  public user!: User;
  public claims!: UserClaims;

  constructor(
    private router: Router,
    private topicService: TopicService,
    private subtopicService: SubtopicService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.userService.currentUser.subscribe(currentUser => {
      this.userService.userDocument(currentUser.email).valueChanges().subscribe(user => {
        this.user = user;
        this.userService.claimsDocument(user.email).valueChanges().subscribe(claims => {
          this.claims = claims;
    
          // Aquí se mantiene la suscripción a route.params
          this.route.params.subscribe((params: Params) => {
            this.courseId = params.courseId;
            this.topicId = params.topicId;
    
            // Aquí se mantiene la recuperación del tema y subtema
            this.topicService.topicById(this.topicId).subscribe(topic => {
              this.topic = topic;
              console.log('Topic:', this.topic); // Verifica si está definido aquí
            });
    
            this.subtopicService.getSubtopicsOfTopic(this.topicId).subscribe(subtopics => {
              this.subtopics = subtopics;
    
              if (this.subtopics && this.subtopics.length > 0) {
                // Asumiendo que showSubtopicInfo es un método definido en tu componente
                this.showSubtopicInfo(this.subtopics[0], 0);
              }
              console.log('Subtopics:', this.subtopics); // Verifica si están definidos aquí
            });
          });
        });
      });
    });
    

    this.route.params.subscribe((params: Params) => {
      this.subtopicId = params.subtopicId;
      this.topicId = params.topicId;
      this.courseId = params.courseId;
      this.subtopicService.subtopicById(this.subtopicId).subscribe(
        subtopic => this.subtopic = subtopic
      );
      console.log(this.subtopic);
    });
  }

  changeSection(tab: any) {
    this.selectedTab = tab;
    this.tabs[0].active = false;
    this.tabs[1].active = false;
    this.tabs[2].active = false;
    this.tabs[this.tabs.indexOf(tab)].active = true;
  }
  
  showSubtopicInfo(subtopic: Subtopic, index: number): void {
    this.selectedSubtopic = subtopic;
    this.subtopicIndex = index;
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}

