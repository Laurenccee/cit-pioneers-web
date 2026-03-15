# Firebase Authentication Setup

This application uses **Firebase Authentication** for user management, with **middleware-based route protection** and a **two-step profile setup**.

## Overview

- **Authentication Provider**: Firebase Auth
- **Route Protection**: Next.js Middleware
- **Session Management**: Firebase Auth State + HTTP-only cookies
- **User Database**: Firestore (for user profiles)
- **Profile Setup**: Two-step process (email verification → profile completion)

## Architecture

### 1. Authentication Flow

#### Sign Up Flow

1. User submits form with **email and password only**
2. Client creates Firebase Auth user with `createUserWithEmailAndPassword`
3. Firebase sends verification email
4. User redirected to `/verify-email` page

#### Email Verification

1. User clicks verification link in email
2. `EmailVerificationChecker` auto-detects verification every 3 seconds
3. Once verified, user redirected to `/setup-profile` page

#### Profile Setup

1. User completes profile with:
   - Full name
   - Student ID (6 digits)
   - Year level (1-4)
   - Section
2. `profileSetupAction` validates and checks for duplicate student IDs
3. Client creates user profile in Firestore (keyed by Firebase UID)
4. User redirected to `/dashboard`

#### Sign In

1. User submits form with **email and password**
2. Client signs in with Firebase using `signInWithEmailAndPassword`
3. AuthProvider sets auth token cookie
4. Middleware checks auth token
5. Dashboard checks for profile completion → redirects if needed

### 2. Route Protection

**Middleware** (`proxy.ts`) handles basic route protection:

- Checks for `auth-token` cookie
- Redirects unauthenticated users to `/sign-in`
- Redirects authenticated users away from auth pages

**Client-side Protection** handles profile completion:

- `/verify-email` → requires authentication
- `/setup-profile` → requires email verification
- `/dashboard` → requires completed profile

Protected routes:

- `/dashboard`
- `/verify-email`
- `/setup-profile`

### 3. Components

**AuthProvider** (`src/components/AuthProvider.tsx`)

- Listens to Firebase auth state changes
- Sets/clears auth token cookie
- Provides user context to app

**useAuth** (`src/hooks/useAuth.ts`)

- Returns current user and loading state
- Provides `signOut` function
- `useRequireAuth` for protected pages (redirects if not authenticated)

### 4. Key Files

```
proxy.ts                               # Route protection
src/
  components/
    AuthProvider.tsx                   # Firebase auth context provider
  hooks/
    useAuth.ts                         # Auth hooks
  features/auth/
    actions/
      signInAction.ts                  # Server action for sign in (removed - handled client-side)
      signUpAction.ts                  # Server action for sign up (removed - handled client-side)
      profileSetupAction.ts            # Server action for profile setup
    components/
      SignInForm.tsx                   # Sign in form (email/password)
      SignUpForm.tsx                   # Sign up form (email/password only)
      ProfileSetupForm.tsx             # Profile setup form
      EmailVerificationChecker.tsx     # Auto-checks verification status
      ContinueAfterVerification.tsx    # Manual verification check button
    schemas/
      authSchemas.ts                   # Validation schemas
  lib/
    firestore.ts                       # Firestore helpers
  services/
    firebase.ts                        # Firebase config
app/
  (protected)/
    setup-profile/
      page.tsx                         # Profile setup page
```

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Firestore Structure

### Users Collection

Documents are keyed by Firebase UID:

```
users/{uid}
  - uid: string (Firebase Auth UID)
  - name: string (full name)
  - studentId: string (6 digits)
  - email: string
  - year: number (1-4)
  - section: string
  - emailVerified: boolean
  - profileCompleted: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
```

## Firebase Security Rules

### Firestore Rules (`firestore.rules`)

The security rules ensure:

- ✅ Users can only create their own profile (uid must match auth.uid)
- ✅ Users must be email verified before creating profile
- ✅ Any authenticated user can read profiles (for duplicate checking)
- ✅ Users can update their own profile (but not change uid or email)
- ❌ Users cannot delete profiles

### Deploying Rules

To deploy the security rules to Firebase:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Update .firebaserc with your project ID
# Then deploy the rules
firebase deploy --only firestore:rules
```

Or deploy rules manually in the Firebase Console:

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the contents of `firestore.rules`
3. Paste and publish

## User Journey

### New User

1. `/sign-up` → Enter email + password → Account created
2. `/verify-email` → Click link in email → Email verified
3. `/setup-profile` → Complete profile → Profile created
4. `/dashboard` → Access granted

### Returning User

1. `/sign-in` → Enter email + password
2. Automatic redirect based on state:
   - Not verified → `/verify-email`
   - No profile → `/setup-profile`
   - Profile complete → `/dashboard`

## Migration from NextAuth

This app was migrated from NextAuth to Firebase-only authentication:

### Removed:

- `next-auth` package
- `auth.config.ts`
- `auth.ts`
- `next-auth.d.ts`
- `/api/auth/[...nextauth]` route

### Benefits:

- Simpler architecture (one auth system instead of two)
- Direct Firebase integration
- Middleware-based protection (no need for auth guards)
- Better TypeScript support
- Reduced bundle size
- More flexible profile setup flow
