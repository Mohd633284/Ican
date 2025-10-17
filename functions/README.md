Setup and usage

1) Install dependencies:

   cd functions
   npm install firebase-admin firebase-functions

2) Set the admin secret (use Firebase CLI - replace YOUR_SECRET):

   firebase functions:config:set app.dev_secret="YOUR_SECRET"

3) Deploy functions:

   firebase deploy --only functions:createMember,functions:onUserDelete

How it works

- `createMember` is an HTTP function that requires `secretKey` in the POST body. It checks the counter in `metadata/member_count` and only creates an Auth user and `members/{uid}` document if count < 3. The operation uses a Firestore transaction to avoid race conditions.

- `onUserDelete` will decrement the counter when a user is removed from Firebase Auth.

Client integration notes

- Disable any client-side sign-up flows. Only the developer should call `createMember` (or call your own secure admin panel) with the secret.
- Example request:

  POST https://us-central1-YOUR_PROJECT.cloudfunctions.net/createMember
  Content-Type: application/json

  {
    "email": "member@example.com",
    "password": "SomeStrongPassword123!",
    "displayName": "Member Name",
    "secretKey": "YOUR_SECRET"
  }

Security notes

- Do NOT embed `YOUR_SECRET` in a client app. Keep it only with the developer/admin.
- For production, restrict the function to your admin panel IPs or require authentication (e.g., verify a signed JWT from your admin backend).