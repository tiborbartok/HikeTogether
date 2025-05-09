import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, doc, docData, Firestore } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { HikeInterface } from "../interfaces/hike.interface";
import { AuthService } from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class HikesFirebaseService {
  firestore = inject(Firestore);
  hikesCollection = collection(this.firestore, 'hikes');
  authService = inject(AuthService);

  getHikes(): Observable<HikeInterface[]>{
    return collectionData(this.hikesCollection, {idField: 'id'}) as Observable<HikeInterface[]>;
  }

  createHike(name: string, location: string, dateAndTime: Date, difficulty: string, capacity: number, length: number, extraInformation: string): Observable<string> {
    const hikeToCreate = {name, location, dateAndTime, difficulty, capacity, length, extraInformation, userEmail: this.authService.currentUserSignal()!.email};
    const promise = addDoc(this.hikesCollection, hikeToCreate)
      .then(response => response.id);
    return from(promise);
  }

  getHikeById(id: string){
    const hikeDoc = doc(this.hikesCollection, id);
    return docData(hikeDoc, {idField: 'id'}) as Observable<HikeInterface>;
  }

  convertErrorMessage(code: string){
    switch (code) {
      case 'auth/email-already-in-use': {
        return 'E-mail already in use.';
      }
      case 'auth/wrong-password': {
        return 'Wrong e-mail or password.';
      }
      case 'auth/user-not-found': {
        return 'Wrong e-mail or password.';
      }
      case 'auth/requires-recent-login': {
        return 'Please log in again to perform this action.';
      }
      default: {
        return 'An error has occurred.';
      }
    }
  }
}
