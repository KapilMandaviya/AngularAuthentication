import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { employeeAuthGuard } from './employee-auth.guard';

describe('employeeAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => employeeAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
