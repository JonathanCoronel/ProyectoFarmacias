import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { ContributionService } from 'src/app/core/services/contribution/contribution.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { EmailSignInService } from 'src/app/login/services/email-sign-in.service';
import { Contribution } from 'src/app/shared/interfaces/contribution';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css'],
})
export class ContributionsComponent implements OnInit {
  createContribution: FormGroup;
  submited = false;
  userId: number | string;
  idRoute: string;
  result: any = [];
  coments: any = [];
  flag = false;
  idSubtopic;
  @ViewChild('deleteCommentModal', { static: false })
  deleteCommentModal: ModalDirective;
  constructor(
    private userService: UserService,
    public AuthUser: EmailSignInService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private contributionService: ContributionService
  ) {
    this.createContribution = this.fb.group({
      body: ['', Validators.required],
      response: ['', Validators.required]
    });
    this.idRoute = route.snapshot.params.id;
  }
  public contribution: Contribution;
  public idForo;
  public currentUser$ = this.userService.user$;
  ngOnInit(): void {
    if (this.currentUser$) {
      this.currentUser$.subscribe((res) => {
        this.userId = res.id;
      });
    }
    if (this.AuthUser) {
      this.userId = this.AuthUser.getUser.id;
    }
    this.getResponse();
  }
  changestatus(id:string){
    
   this.idForo = id;
   
   
  }
  saveid(id:string):void{
    this.idSubtopic = id;
  }
  getResponse(){
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.id;
        })
      )
      .subscribe((topicId) => {
        this.contributionService.getContributionById(topicId).subscribe(
          (res) => {
            this.result = res.data;
            console.log(res.data);
            
          },
          (error) => {
            console.log('error');
            console.log(error);
          }
        );
        this.coments = this.result.response;
        
            this.idForo = null;
      });

  }
  addResponse(){
    this.contribution = {
      body: this.createContribution.value.response,
      parent: this.idForo,
      userid: this.userId
    };
    this.contributionService
      .addContribution(this.contribution, this.idRoute)
      .subscribe((res) => {
        this.getResponse();
        this.createContribution.get('response').setValue('');
        console.log(res);
      });
    console.log(this.contribution);
    (<HTMLInputElement>document.getElementById('response')).value = '';
    
    
    
  }
  addContribution() {
    this.submited = true;

    this.contribution = {
      body: this.createContribution.value.body,
      parent: null,
      userid: this.userId
    };
    this.contributionService
      .addContribution(this.contribution, this.idRoute)
      .subscribe((res) => {
        this.getResponse();
        console.log(res);
      });
    console.log(this.contribution);
    (<HTMLInputElement>document.getElementById('box')).value = '';
    
  }
  public removeContribution(): void {
    this.contributionService.deleteContribution(this.idSubtopic).subscribe(res=>{
      this.deleteCommentModal.hide()
      this.getResponse();
    },error => {
      console.log('error');
      console.log(error);
    });
    }
}
