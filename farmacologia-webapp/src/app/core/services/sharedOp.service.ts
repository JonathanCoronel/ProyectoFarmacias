import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedOptionSubject = new BehaviorSubject<string>('');
  private userBoolSubject = new BehaviorSubject<boolean>(false);

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
