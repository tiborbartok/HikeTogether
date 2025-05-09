import { Timestamp } from "@angular/fire/firestore";

export interface CommentInterface {
  userEmail: string;
  hikeId: string;
  comment: string;
  timestamp: Timestamp;
  id: string;
}
