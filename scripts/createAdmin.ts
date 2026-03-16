/**
 * One-time local script to create an admin account.
 * Run with: npx tsx scripts/createAdmin.ts
 *
 * Requires FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,
 * and FIREBASE_ADMIN_PRIVATE_KEY in your .env.local
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as readline from 'readline';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      rl.close();
      resolve(a.trim());
    }),
  );
}

async function main() {
  const app = initAdmin();
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('\n=== Create Admin Account ===\n');
  const email = await ask('Email: ');
  const password = await ask('Password (min 8 chars): ');
  const firstName = await ask('First name: ');
  const lastName = await ask('Last name: ');

  // Create Firebase Auth user
  const userRecord = await auth.createUser({
    email,
    password,
    emailVerified: true,
  });
  console.log(`\n✅ Auth user created: ${userRecord.uid}`);

  // Set admin custom claim — this is what secures the role
  await auth.setCustomUserClaims(userRecord.uid, { admin: true });
  console.log('✅ Custom claim set: { admin: true }');

  // Store admin profile in Firestore
  await db.collection('admin').doc(userRecord.uid).set({
    uid: userRecord.uid,
    firstName,
    lastName,
    email,
    role: 'admin',
    profileCompleted: true,
    mustChangePassword: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('✅ Admin profile stored in Firestore');

  console.log(`\n✅ Done! Admin account ready: ${email}\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
