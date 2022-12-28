import { TestBed } from '@angular/core/testing';

import { PythonAnywhereService } from './python-anywhere.service';

describe('PythonAnywhereService', () => {
  let service: PythonAnywhereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PythonAnywhereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
