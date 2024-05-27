import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { TopicService } from 'src/app/core/services/topic.service';
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
  resources: any = [];
  tabs = [
    {name: 'CLASES', active: true},
    // {name: 'APORTES', active: false},
  ];
  selectedTab = this.tabs[0];
  public flag = true;

  subtopicId!: string;
  topicId!: string;
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

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}

