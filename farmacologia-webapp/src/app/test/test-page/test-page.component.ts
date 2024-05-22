import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TestService } from 'src/app/core/services/test/test.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css'],
})
export class TestPageComponent implements OnInit {
  public flag = true;
  quiz: any = [];
  questions: any = [];
  selectedAnswer = false;
  backgroud:string;
  respons:any[];
  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.id;
        })
      )
      .subscribe((subtopicId) => {
        this.testService.getQuizz(subtopicId).subscribe(
          (res) => {
            this.quiz = res.data;
            this.questions = res.data.questions;
            console.log(this.quiz);
            console.log(this.respons);
          },
          (error) => {
            console.log('error');
            console.log(error);
          }
        );
      });
  }
  onAnswer(correct: boolean):void{
    this.selectedAnswer = true;

    console.log(correct)
    if(correct){
      this.backgroud = "#F6D354"
      console.log("verdadero")
    }
    
    
  }
}
