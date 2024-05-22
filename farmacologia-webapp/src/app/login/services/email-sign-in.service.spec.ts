import { TestBed } from '@angular/core/testing';

import { EmailSignInService } from './email-sign-in.service';

describe('EmailSignInService', () => {
  let service: EmailSignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailSignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
