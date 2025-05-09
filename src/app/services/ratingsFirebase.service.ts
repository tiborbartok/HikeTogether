import { inject, Injectable } from "@angular/core";
import { addDoc, collectionData, Firestore, query, where } from "@angular/fire/firestore";
import { collection } from "firebase/firestore";
import { from, Observable } from "rxjs";
import { RatingInterface } from "../interfaces/rating.interface";

@Injectable({
  providedIn: 'root'
})
export class RatingsFirebaseService {
  firestore = inject(Firestore);
  ratingsCollection = collection(this.firestore, 'ratings');

  addRating(userEmail: string, hikeId: string, rating: number) {
    const ratingToCreate = {userEmail, hikeId, rating};
    const promise = addDoc(this.ratingsCollection, ratingToCreate).then(response => response.id);
    return from(promise);
  }

  getRatingsForHike(hikeId: string): Observable<RatingInterface[]> {
    const q = query(this.ratingsCollection, where('hikeId', '==', hikeId));
    return collectionData(q, { idField: 'id' }) as Observable<RatingInterface[]>;
  }
}
