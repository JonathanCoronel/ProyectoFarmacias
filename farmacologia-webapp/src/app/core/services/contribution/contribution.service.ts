import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contribution } from 'src/app/shared/interfaces/contribution';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Don't use this service. DEPRECATED
 *  @deprecated
 */
@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  private SEVER_URL: string = 'http://pharmacology-utpl-api.herokuapp.com';
  constructor(
    private httpClient: HttpClient
  ) { }
  private getEndUrl(endPoint: string): string {
    return `${this.SEVER_URL}${endPoint}`;
  }
  private doPostRequest(url: string, body: any = null, requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP POST: ' + url);
    return this.httpClient.post(url, body, httpOptions);
  }
  private doGetRequest(url: string): Observable<any> {
    console.log('Enviando HTTP GET: ' + url);
    return this.httpClient.get(url, httpOptions);
  }
  private doDeleteRequest(url: string, body: any = null, requestOptions: HttpHeaders = null): Observable<any> {
    console.log('Enviando HTTP DELETE: ' + url);
    return this.httpClient.delete(url, httpOptions);
  }

  public addContribution(contribution: Contribution ,id:string): Observable<any> {
    let url = this.getEndUrl(`/api/contribution/${id}`);
    return this.doPostRequest(url,contribution);
  }
  public deleteContribution(id: string): Observable<any> {
    let url = this.getEndUrl(`/api/contribution/${id}`);
    return this.doDeleteRequest(url);
  }






  public getContributionById(id:string): Observable<any> {
    let url = this.getEndUrl(`/api/contribution/${id}`);
    return this.doGetRequest(url);
  }
  public addContributionPost(contribution: Contribution ,id:string): Observable<{ message: string }> {


    return this.httpClient.post<{ message: string }>(
      `${this.SEVER_URL}/api/contribution/${id}`,
      contribution
    );
  }
}
