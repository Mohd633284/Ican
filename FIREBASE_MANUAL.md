Recommended Firestore rules and Auth config

1) Firestore rules (only functions can write to `members`):

service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{memberId} {
      allow read: if request.auth != null && request.auth.uid == memberId; // members can read their own doc
      allow write: if false; // disallow direct client writes
    }

    match /metadata/{doc} {
      allow read: if false;
      allow write: if false; // only server-side code can modify metadata
    }

    // other rules...
  }
}

2) Disable client-side signup

- If you use Firebase Auth UI or custom client signup code, remove or gate it so only admin panel can call `createMember`.
- Keep only sign-in flows on the client.

3) Monitoring sign-ins

- To track sign-ins, either log events in Cloud Functions or enable Firebase Auth logging in Google Cloud's audit logs.
- Optionally, create a Callable function that the client calls after successful sign-in to record the event in `signins/{uid}/{timestamp}` for analytics.

4) Handling edge cases

- Race conditions are prevented using Firestore transactions in `createMember`.
- Be careful with the Admin secret: store it with `firebase functions:config:set` and access via `functions.config()`.
- For extra safety, add an allowlist of admin emails or IPs that can call the endpoint.

5) Deleting accounts

- If you want to allow members to be deleted by the admin and free a slot, use the Admin SDK or the Firebase console to delete a user; `onUserDelete` will decrement the counter automatically.