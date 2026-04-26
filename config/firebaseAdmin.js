import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Production (Render): read from environment variable
// Local dev: fall back to serviceAccountKey.json file
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  console.log('Firebase Admin: using env var credentials');
} else {
  serviceAccount = JSON.parse(
    readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8')
  );
  console.log('Firebase Admin: using local serviceAccountKey.json');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "salon-app-booking.firebasestorage.app",
    databaseURL: "https://salon-app-booking-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
  console.log('Firebase Admin initialized (Realtime DB + Storage)');
}

export default admin;
