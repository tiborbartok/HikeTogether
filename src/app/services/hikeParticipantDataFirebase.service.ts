import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { HikeParticipantDataInterface } from "../interfaces/hikeParticipantData.interface";

@Injectable({
  providedIn: 'root'
})
export class HikeParticipantDataFirebaseService {
  firestore = inject(Firestore);
  hikeParticipantDataCollection = collection(this.firestore, 'hikeParticipantData');

  addParticipation(userEmail: string, hikeId: string): Observable<string> {
    const participationToCreate = {userEmail, hikeId};
    const promise = addDoc(this.hikeParticipantDataCollection, participationToCreate)
      .then(response => response.id);
    return from(promise);
  }

  getParticipations(): Observable<HikeParticipantDataInterface[]>{
    return collectionData(this.hikeParticipantDataCollection, {
      idField: 'id'
    }) as Observable<HikeParticipantDataInterface[]>;
  }

  removeParticipation(participationId: string): Observable<void> {
    const docRef = doc(this.firestore, 'hikeParticipantData/' + participationId);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}
