import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);
  router = inject(Router);
  
  register(email: string, username: string, password: string): Observable<void>{
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => updateProfile(response.user, {displayName: username}));

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => {})
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  updateUserName(name: string): Observable<void> {
    const promise = updateProfile(this.firebaseAuth.currentUser!, {displayName: name});
    return from(promise);
  }

  updateUserPassword(password: string): Observable<void> {
    const promise = updatePassword(this.firebaseAuth.currentUser!, password);
    return from(promise);
  }

  updateUserPhoto(photoURL: string): Observable<void> {
    const promise = updateProfile(this.firebaseAuth.currentUser!, {photoURL: photoURL});
    return from(promise);
  }

  deleteUserAccount(): Observable<void> {
    const promise = deleteUser(this.firebaseAuth.currentUser!);
    return from(promise);
  }
}
