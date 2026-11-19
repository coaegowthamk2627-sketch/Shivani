# IISER GUIDE Security Specification

## Phase 0: Data Invariants & Access Model

### Public Non-PII Educational Catalog Collections
Collections: `news`, `vacancies`, `scholarships`, `placements`, `salaries`, `courses`, `institutions`, `portalMeta`
- **Read**: Public (`get`, `list`) — zero personal identifiable information (PII); institutional registrar details (`contactEmail`, `contactPhone`) are official published campus contacts.
- **Write (`create`, `update`, `delete`)**: Strictly restricted to verified administrators (`isAdmin()`), validated against explicit schemas, required fields, `hasOnly`, string length limits, and HTTP/HTTPS URL checks.

### Private PII & User-Scoped Collections
1. **`contacts/{contactId}`**
   - **Read**: Only the submitting user (`resource.data.authorUid == request.auth.uid`) or a verified administrator (`isAdmin()`). Never publicly readable.
   - **Create**: Requires authenticated user (`request.auth != null`), valid `contactId`, `authorUid == request.auth.uid`, valid email format, `status == 'submitted'`, `createdAt == request.time`, bounded `name`/`role`/`message` lengths.
   - **Update**: Verified administrator (`isAdmin()`) only; `id`, `authorUid`, and `createdAt` are immutable.
   - **Delete**: Verified administrator (`isAdmin()`) only.

2. **`users/{userId}`**
   - **Read**: Owner (`request.auth.uid == userId`) or `isAdmin()`. List restricted to `isAdmin()`.
   - **Create**: Owner (`request.auth.uid == userId`), `uid == userId`, `createdAt == request.time`, `role == 'user'` (unless `isAdmin()`).
   - **Update**: Owner can update displayName/email without changing `uid`, `role`, or `createdAt`; `isAdmin()` can update `role` to `'user'` or `'admin'`.
   - **Delete**: `isAdmin()` only.

3. **`admins/{userId}`**
   - **Read**: Owner (`request.auth.uid == userId`) or `isAdmin()`. List restricted to `isAdmin()`.
   - **Write**: `isAdmin()` only.

### Dirty Dozen Abuse Cases (Must All Fail)
1. Unauthenticated write to `news`, `vacancies`, `scholarships`, `placements`, `salaries`, `courses`, `institutions`, `portalMeta`.
2. Non-admin authenticated user creating, updating, or deleting any CMS collection document.
3. Unauthenticated read or list on `contacts`, `users`, or `admins`.
4. Non-admin reading another user's `contacts` inquiry (`authorUid != request.auth.uid`) or `users/{otherUid}` profile.
5. Unauthenticated create on `contacts`.
6. Authenticated user creating a `contacts` inquiry with forged `authorUid != request.auth.uid`.
7. Self-escalation: user creating or updating `users/{uid}` with `role: 'admin'`.
8. Type mismatch / oversized strings (> 10000 chars) or extra unapproved keys (`extraField: 'hack'`) in CMS or `contacts` writes.
9. Client spoofing `createdAt` with a backdated or future timestamp instead of `request.time`.
10. Modifying immutable fields (`authorUid`, `createdAt`) on `contacts` update or (`uid`, `createdAt`) on `users` update.
11. Path traversal / bad document IDs (`.`, `..`, slashes, > 128 chars).
12. Non-HTTP(S) URLs (`javascript:alert(1)`) injected into `officialUrl` / `officialWebsite` / `officialNotificationUrl`.
