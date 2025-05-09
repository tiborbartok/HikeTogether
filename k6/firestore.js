import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '30s',
};

const FIREBASE_PROJECT_ID = 'hiketogetherofficial';
const COLLECTION = 'hikeParticipantData';
const API_KEY = "REPLACE_WITH_REAL_API_KEY";

export default function () {
  const res = http.get(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${COLLECTION}?key=${API_KEY}`);
  sleep(0.5);
}