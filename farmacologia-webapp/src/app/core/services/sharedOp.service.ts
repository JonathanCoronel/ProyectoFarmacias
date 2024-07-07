import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedOptionSubject = new BehaviorSubject<string>('');

  setSelectedOption(option: string) {
    this.selectedOptionSubject.next(option);
  }

  getSelectedOption() {
    return this.selectedOptionSubject.asObservable();
  }
}
