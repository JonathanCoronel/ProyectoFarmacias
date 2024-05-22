import { TestBed } from '@angular/core/testing';

import { MicrosoftSignInService } from './microsoft-sign-in.service';

describe('MicrosoftSignInService', () => {
  let service: MicrosoftSignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrosoftSignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
