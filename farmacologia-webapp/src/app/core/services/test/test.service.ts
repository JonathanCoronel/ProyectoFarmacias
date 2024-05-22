import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from 'src/app/shared/interfaces/question';
import { Questions } from 'src/app/shared/interfaces/questions';
import { Quiz } from 'src/app/shared/interfaces/quiz';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

/**
 * Don't use this service. DEPRECATED
 *  @deprecated
 */
@Injectable({
  providedIn: 'root'
})
export class TestService {
  private SEVER_URL: string = 'http://pharmacology-utpl-api.herokuapp.com';

  constructor(
    private httpClient: HttpClient
  ) { }
  private getEndUrl(endPoint: string): string {
    return `${this.SEVER_URL}${endPoint}`;
  }
  private doGetRequest(url: string): Observable<any> {
    console.log('Enviando HTTP GET: ' + url);
    return this.httpClient.get(url, httpOptions);
  }
  public getTest(id:string): Observable<any> {
    let url = this.getEndUrl(`/api/topic/${id}`);
    return this.doGetRequest(url);
  }
  private doPostRequest(url: string, body: any = null, requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP POST: ' + url);
    return this.httpClient.post(url, body, httpOptions);

  }
  public postQuiz(quiz: Quiz , id: string): Observable<any> {
    let url = this.getEndUrl(`/api/quiz/${id}`);
    return this.doPostRequest(url, quiz);
  }
  public getQuizz(id:string): Observable<any> {
    let url = this.getEndUrl(`/api/quiz/${id}`);
    return this.doGetRequest(url);
  }
  public postQuestion(question: Question , id: string): Observable<any> {
    let url = this.getEndUrl(`/api/question/${id}`);
    return this.doPostRequest(url, question);
  }
  public postQuestions(questions: Questions , id: string): Observable<any> {
    let url = this.getEndUrl(`/api/alternative/${id}`);
    return this.doPostRequest(url, questions);
  }
  public getQuestion(id:string): Observable<any> {
    let url = this.getEndUrl(`/api/question/${id}`);
    return this.doGetRequest(url);
  }
}


