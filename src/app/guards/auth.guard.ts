import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

export const authGuard: CanActivateFn = () => {
  const hasToken = !!inject(PythonAnywhereService).getTokenPythonAnywhere();
  if (hasToken) {
    return true;
  }
  inject(Router).navigate(['/login']);
  return false;
};

export const loginGuard: CanActivateFn = () => {
  const hasToken = !!inject(PythonAnywhereService).getTokenPythonAnywhere();
  if (!hasToken) {
    return true;
  }
  inject(Router).navigate(['/']);
  return false;
};
