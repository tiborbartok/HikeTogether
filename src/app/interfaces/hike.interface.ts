import { Timestamp } from "@angular/fire/firestore";

export interface HikeInterface {
  name: string;
  location: string;
  dateAndTime: Timestamp;
  difficulty: string;
  capacity: number;
  length: number;
  extraInformation: string;
  userEmail: string;
  id: string;
}
