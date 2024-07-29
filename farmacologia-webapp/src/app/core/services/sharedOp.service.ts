import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Foro } from 'src/app/shared/interfaces/foro';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedOptionSubject = new BehaviorSubject<string>('');
  private userBoolSubject = new BehaviorSubject<boolean>(false);
  private forosSubject = new BehaviorSubject<Foro[]>([]);
  foros$ = this.forosSubject.asObservable();

  setSelectedOption(option: string) {
    this.selectedOptionSubject.next(option);
  }

  getSelectedOption() {
    return this.selectedOptionSubject.asObservable();
  }

  setUserBool(userOp: boolean) {
    this.userBoolSubject.next(userOp);
  }

  getUserBool() {
    return this.userBoolSubject.asObservable();
  }
}
