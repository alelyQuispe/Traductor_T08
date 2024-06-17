import { TestBed } from '@angular/core/testing';

import { translateService } from './translate.service';

describe('translateService', () => {
  let service: translateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(translateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
