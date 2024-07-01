import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedOptionSource = new BehaviorSubject<string>(''); 
  selectedOption$ = this.selectedOptionSource.asObservable();

  constructor() {}

  setSelectedOption(option: string): void { 
    this.selectedOptionSource.next(option);
  }

  getSelectedOption(): string { 
    return this.selectedOptionSource.getValue();
  }
}
