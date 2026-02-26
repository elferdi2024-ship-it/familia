/**
 * Crea o resetea el documento config/launch en Firestore para el banner Fundadores.
 * Uso: npx tsx scripts/init-founder-config.ts
 *
 * Requiere en .env.local (o variables de entorno):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 */

import * as dotenv from 'dotenv';
import { join } from 'path';
import admin from 'firebase-admin';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    '❌ Faltan variables de Firebase Admin. En .env.local agregá:\n' +
      '   FIREBASE_PROJECT_ID=...\n' +
      '   FIREBASE_CLIENT_EMAIL=...\n' +
      '   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."'
  );
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

async function main() {
  await db.doc('config/launch').set(
    { founderSlotsUsed: 0 },
    { merge: true }
  );
  console.log('✅ config/launch creado/actualizado con founderSlotsUsed: 0');
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
