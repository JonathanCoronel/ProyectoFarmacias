import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, Subject } from 'rxjs';
import { Topic } from 'src/app/shared/interfaces/topic';
import {
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

/*
 * Variable para adicionar información a las peticiones
 */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

/**
 * Don't use this service. DEPRECATED
 *  @deprecated
 */
@Injectable({
  providedIn: 'root',
})
export class TopicService {
  //Variable global para manejar la dirección del servidor
  private SEVER_URL: string = 'http://pharmacology-utpl-api.herokuapp.com';
  private countdownEndSource = new Subject<object>();
  public countdownEnd$ = this.countdownEndSource.asObservable();
  constructor(private httpClient: HttpClient, private router: Router) {}
  public processCountdown(text: object) {
    this.countdownEndSource.next(text);
  }

  private getEndUrl(endPoint: string): string {
    return `${this.SEVER_URL}${endPoint}`;
  }

  public testConnection(url: string = null): Observable<any> {
    return this.doGetRequest(url + '/test');
  }

  private doGetRequest(url: string): Observable<any> {
    console.log('Enviando HTTP GET: ' + url);
    return this.httpClient.get(url, httpOptions);
  }

  private doPostRequest(url: string,body: any = null,requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP POST: ' + url);
    return this.httpClient.post(url, body, {
      reportProgress: true,
      observe: 'events',
    } );
  }

  private doPutRequest(url: string,body: any = null,requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP PUT: ' + url);
    return this.httpClient.put(url, httpOptions);
  }

  private doDeleteRequest(url: string,body: any = null,requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP DELETE: ' + url);
    return this.httpClient.delete(url, httpOptions);
  }
  // public postTopic(data:FormData):  Observable<any> {
  //   let url = this.getEndUrl(`/api/topic`);
  //   return this.doPostRequest(url,data);
  // }

  //metodo para crear un topic o subtopic
  public postTopic(data: FormData, id: string): void {
    let url = this.getEndUrl('/api/topic');

    this.doPostRequest(url, data).subscribe((res) => {
      if(res.status==200){
        if (id.length == 0) {
          this.router.navigateByUrl('/course');
        } else {
          this.router.navigate(['/course/tema', id]);
        }
      }
    }, error => {
      console.log('error');
      console.log('error',error);
    }) ;
  }

  public getTopic(): Observable<any> {
    let url = this.getEndUrl(`/api/topic`);
    return this.doGetRequest(url);
  }

  public getTopicById(id: string): Observable<any> {
    let url = this.getEndUrl(`/api/topic/${id}`);
    return this.doGetRequest(url);
  }

  public put(param: any): Observable<any> {
    let url = this.getEndUrl('/api/example/post');
    return this.doPutRequest(url, param);
  }

  public deleteCourse(id: string): Observable<any> {
    let url = this.getEndUrl(`/api/topic/${id}`);
    return this.doDeleteRequest(url);
  }
}
