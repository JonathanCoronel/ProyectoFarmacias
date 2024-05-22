import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resource } from 'src/app/shared/interfaces/resource';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
/**
 * Don't use this service. DEPRECATED
 *  @deprecated
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private SEVER_URL: string = 'http://pharmacology-utpl-api.herokuapp.com';
  constructor(private httpClient: HttpClient) { }

  private getEndUrl(endPoint: string): string {
    return `${this.SEVER_URL}${endPoint}`;
  }

  private doGetRequest(url: string): Observable<any> {
    console.log('Enviando HTTP GET: ' + url);
    return this.httpClient.get(url, httpOptions);
  }
  private doPostRequest(url: string, body: any = null, requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP POST: ' + url);
    return this.httpClient.post(url, body, httpOptions);
  }

  public getResourceById(id:string): Observable<any> {
    let url = this.getEndUrl(`/api/resource/${id}`);
    return this.doGetRequest(url);
  }
  private doPostRequestFormData(url: string,body: any = null,requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP POST: ' + url);
    return this.httpClient.post(url, body, {
      reportProgress: true,
      observe: 'events',
    } );
  }
  public postVideoRef(resource:Resource): Observable<any> {
    let url = this.getEndUrl(`/api/resource`);
    return this.doPostRequest(url,resource);
  }
  public postFormData(data:FormData): Observable<any> {
    let url = this.getEndUrl(`/api/resource`);
    return this.doPostRequestFormData(url,data);
  }
}
