
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TestService } from 'src/app/core/services/test/test.service';
import { Question } from 'src/app/shared/interfaces/question';
import { Questions } from 'src/app/shared/interfaces/questions';
import { Quiz } from 'src/app/shared/interfaces/quiz';

@Component({
  selector: 'app-fom-add-quizz',
  templateUrl: './fom-add-quizz.component.html',
  styleUrls: ['./fom-add-quizz.component.css']
})
export class FomAddQuizzComponent implements OnInit {
  createQuizz: FormGroup;
  idRoute:string
  test:Quiz;
  quiz: any = [];
  pregunta: any = [];
  question:Question;
  questions:Questions[]=[];
  correct:any;
  incorrect2:any;
  incorrect1:any
  id;
  @ViewChild('addQuizzModal', { static: false })
  addQuizzModal: ModalDirective;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private testServices: TestService,private router: Router,) { 
    this.createQuizz = this.fb.group({
      descriptionQuizz: ['', Validators.required],
      question:['', Validators.required],
      correct:['', Validators.required],
      incorrect1:['', Validators.required],
      incorrect2:['', Validators.required],
      
    });
    this.idRoute = route.snapshot.params.id;
  }

  public flag = true;
  public flagQuestions = true;

  ngOnInit(): void {
    
  }

  createTest(){
    this.test={
      description: this.createQuizz.value.descriptionQuizz
    }
    this.testServices.postQuiz(this.test, this.idRoute).subscribe(res=>{
      console.log(res);
      this.flag= false;
    })
  }
  createQuestion(){
    this.testServices.getQuestion(this.quiz.id).subscribe(res=>{
      this.pregunta=res.data;
      this.id=this.pregunta[0].id
      console.log("question",this.pregunta[0].id)
      this.questions=[{
        content: this.createQuizz.value.correct,
        iscorrect: true
      },
      {
        content: this.createQuizz.value.incorrect1,
        iscorrect: false
      },
      {
        content: this.createQuizz.value.incorrect2,
        iscorrect: false
      },
    ]
    for (let question of this.questions){
      console.log(question)
       this.testServices.postQuestions(question,this.id).subscribe(res =>{
        
        
      })
    }
    this.router.navigate(['/course/tema/subtema', this.idRoute]).then();
      
    })
    
  }
  getQuizz(){
    this.testServices.getQuizz(this.idRoute).subscribe(res=>{
      this.quiz = res.data;
      this.question={
        question: this.createQuizz.value.question,
        value: 1
      }
      this.testServices.postQuestion(this.question,this.quiz.id).subscribe(res=>{
        console.log(res);
        this.flag = false;
        
      })
      console.log(this.quiz)
    })
    this.flagQuestions= false;
  }

}
