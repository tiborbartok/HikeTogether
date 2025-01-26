import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private auth: AngularFireAuth) {
    this.user$ = this.auth.authState;
    this.user$.subscribe(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
   }

  signUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getUserEmail(): string {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).email;
    }
    return '';
  }
}
