import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { filter, map } from 'rxjs';

export const authGuardLoggedIn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (!user){
        router.navigateByUrl('/index');
        return false;
      }
      return true;
    })
  );
};

export const authGuardLoggedOut = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (user){
        router.navigateByUrl('/home');
        return false;
      }
      return true;
    })
  );
};
