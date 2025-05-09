import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, Firestore, query, where } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { CommentInterface } from "../interfaces/comment.interface";

@Injectable({
  providedIn: 'root'
})
export class CommentsFirebaseService {
  firestore = inject(Firestore);
  commentsCollection = collection(this.firestore, 'comments');

  addComment(userEmail: string, hikeId: string, comment: string) {
    const commentToCreate = {userEmail, hikeId, comment, timestamp: new Date()};
    const promise = addDoc(this.commentsCollection, commentToCreate).then(response => response.id);
    return from(promise);
  }

  getCommentsForHike(hikeId: string): Observable<CommentInterface[]> {
    const q = query(this.commentsCollection, where('hikeId', '==', hikeId));
    return collectionData(q, { idField: 'id' }) as Observable<CommentInterface[]>;
  }
}
