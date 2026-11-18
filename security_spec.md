# Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Identity Integrity**: Every user-created resource (`users/{userId}`, `submissions`, `projectSubmissions`, `reviews`, `moderatorApplications`, `affiliateSubmissions`, `microjobs`, `transfers`) MUST enforce `userId == request.auth.uid` (or `senderId == request.auth.uid`) on creation.
2. **Privilege Escalation Prevention**: Non-admin users MUST NOT set `role: 'admin'`, modify `status` (`pending` / `active` / `blocked`), alter `assignedJobs` / `assignedJob`, or read/list other users' PII (`whatsappNumber`, `email`, `passwordText`).
3. **Admin Authority**: Administrator privileges (`isAdmin()`) require `request.auth != null && request.auth.token.email == 'learninghubbd2126509574@gmail.com' && request.auth.token.email_verified == true` (or explicit membership in `/admins/{uid}`).
4. **Path Variable Hardening**: Every single-document `get`, `create`, `update`, `delete` validates `isValidId(id)` (`^[a-zA-Z0-9_\-]+$` and max 128 chars).
5. **PII Isolation**: `/users` `list` is restricted strictly to `isAdmin()`. Public peer lookup for transfers uses `/memberDirectory/{studentIdCode}` (no phone, email, or password).
6. **Review Status Gating**: New member reviews MUST start with `status == 'pending'`; only `isAdmin()` can set `status: 'approved'` or delete reviews.

## 2. Dirty Dozen Payloads (Expected: PERMISSION_DENIED)
1. **Self-Admin Escalation**: `POST /users/{uid}` with `{ "role": "admin", "status": "active", "balance": 50000 }` -> Rejected (`role` must be `'student'`, `balance` must be `0`).
2. **Unauthenticated PII Read/List**: `GET /users` or `GET /users/otherUid` with `auth == null` -> Rejected (`isAdmin()` or `isOwner()` required).
3. **Spoofed Admin Email (Unverified)**: Write to `/settings/support` with `auth.token.email == 'learninghubbd2126509574@gmail.com'` and `email_verified == false` -> Rejected (`email_verified == true` required).
4. **Shadow Field Injection on User Registration**: `POST /users/{uid}` with extra field `{"isSuperAdmin": true}` -> Rejected by key allowlist.
5. **Fake Approved Review**: `POST /reviews/{id}` by student with `{"status": "approved", "rating": 10}` -> Rejected (`status` must be `'pending'`).
6. **Sub-Minimum Review Rating**: `POST /reviews/{id}` by student with `{"rating": 2}` -> Rejected (`rating >= 7 && rating <= 10`).
7. **Unauthorized Settings Tampering**: Non-admin `PUT /settings/support` changing `videoUrl` -> Rejected (`isAdmin()` required).
8. **Unauthorized Password Reset on Another User**: Student A updates `/users/studentB` `passwordText` -> Rejected (`isAdmin()` required for password/status changes).
9. **Identity Spoofing on Submission**: Student A creates `/submissions/sub1` with `userId: "studentB"` -> Rejected (`userId == request.auth.uid`).
10. **Oversized ID Poisoning**: `PUT /submissions/` + 500-char ID string -> Rejected (`isValidId` max 128 chars).
11. **Non-Admin User Deletion**: Student tries `DELETE /users/studentB` -> Rejected (`isAdmin()` required).
12. **Unfiltered List of Submissions by Non-Owner**: Student A runs `list /submissions` without `where('userId', '==', uid)` -> Rejected (`resource.data.userId == request.auth.uid`).
