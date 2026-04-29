# Trainer Sync — Backend API Documentation

> Reference document for frontend development. All endpoints use JSON. Base URL: `http://localhost:3000`

---

## Authentication

All endpoints require a Bearer JWT token in the `Authorization` header unless marked **Public**.

```
Authorization: Bearer <access_token>
```

### JWT Payload

```typescript
{
  sub: string;       // user UUID
  email: string;
  role: string;      // "admin" | "trainer" | "client"
  trainerId?: string; // present if role=trainer
  clientId?: string;  // present if role=client
}
```

### Token Lifecycle

- Access token expires in **15 minutes**
- Refresh token expires in **7 days**
- On login/refresh, both tokens are returned together

---

## Roles

```typescript
enum Role {
  ADMIN = "admin",
  TRAINER = "trainer",
  CLIENT = "client",
}
```

---

## Data Models

### User

| Field       | Type     | Notes    |
| ----------- | -------- | -------- |
| id          | uuid     | PK       |
| name        | string   |          |
| surname     | string   |          |
| email       | string   | unique   |
| phoneNumber | string?  | nullable |
| role        | UserRole | FK       |
| createdAt   | datetime |          |
| updatedAt   | datetime |          |

> `password` and `hashedRefreshToken` are hidden (never serialized).

### UserRole

| Field | Type   | Notes  |
| ----- | ------ | ------ |
| id    | uuid   | PK     |
| name  | string |        |
| code  | string | unique |

### Trainer

| Field              | Type     | Notes       |
| ------------------ | -------- | ----------- |
| id                 | uuid     | PK          |
| user               | User     | oneToOne FK |
| createdBy          | User     | FK          |
| bio                | text?    | nullable    |
| specialization     | string?  | nullable    |
| slotGenerationDays | smallint | default 21  |
| createdAt          | datetime |             |
| updatedAt          | datetime |             |

### Client

| Field       | Type      | Notes                         |
| ----------- | --------- | ----------------------------- |
| id          | uuid      | PK                            |
| user        | User      | oneToOne FK                   |
| trainer     | Trainer   | manyToOne FK (owning trainer) |
| createdBy   | User      | FK                            |
| dateOfBirth | date?     | nullable                      |
| gender      | string?   | nullable                      |
| heightCm    | smallint? | nullable                      |
| goal        | string?   | nullable (e.g. "lose weight") |
| notes       | text?     | nullable (trainer's notes)    |
| createdAt   | datetime  |                               |
| updatedAt   | datetime  |                               |

### ScheduleTemplate

| Field     | Type     | Notes                              |
| --------- | -------- | ---------------------------------- |
| id        | uuid     | PK                                 |
| trainer   | Trainer  | manyToOne FK                       |
| weekDay   | smallint | 1=Monday .. 7=Sunday               |
| startTime | string   | "HH:mm" 24h format                 |
| endTime   | string   | "HH:mm" 24h format                 |
| blockTime | smallint | slot duration in minutes (e.g. 60) |
| active    | boolean  | default true                       |
| createdAt | datetime |                                    |
| updatedAt | datetime |                                    |

### AvailabilitySlot

| Field     | Type     | Notes         |
| --------- | -------- | ------------- |
| id        | uuid     | PK            |
| trainer   | Trainer  | manyToOne FK  |
| date      | date     | "YYYY-MM-DD"  |
| startTime | string   | "HH:mm"       |
| endTime   | string   | "HH:mm"       |
| active    | boolean  | default true  |
| booked    | boolean  | default false |
| createdAt | datetime |               |
| updatedAt | datetime |               |

### AvailabilityOverride

| Field     | Type     | Notes                                             |
| --------- | -------- | ------------------------------------------------- |
| id        | uuid     | PK                                                |
| trainer   | Trainer  | manyToOne FK                                      |
| startDate | date     | override start date                               |
| endDate   | date     | override end date (supports multi-day/vacation)   |
| fullDay   | boolean  | default false — if true, all slots for those days |
| startTime | string?  | nullable (required if fullDay=false)              |
| endTime   | string?  | nullable (required if fullDay=false)              |
| reason    | text?    | nullable                                          |
| createdAt | datetime |                                                   |
| updatedAt | datetime |                                                   |

### Appointment

| Field     | Type             | Notes                                  |
| --------- | ---------------- | -------------------------------------- |
| id        | uuid             | PK                                     |
| trainer   | Trainer          | manyToOne FK                           |
| client    | Client           | manyToOne FK                           |
| slot      | AvailabilitySlot | manyToOne FK                           |
| status    | string           | "scheduled" / "canceled" / "completed" |
| createdAt | datetime         |                                        |
| updatedAt | datetime         |                                        |

### ClientBiaScan

| Field             | Type         | Notes                  |
| ----------------- | ------------ | ---------------------- |
| id                | uuid         | PK                     |
| client            | Client       | manyToOne FK           |
| trainer           | Trainer      | manyToOne FK           |
| appointment       | Appointment? | manyToOne FK, nullable |
| measuredAt        | datetime     |                        |
| weight            | integer      | in grams               |
| bodyFatPercentage | double?      | nullable               |
| muscleMass        | integer?     | in grams, nullable     |
| notes             | text?        | nullable               |
| createdAt         | datetime     |                        |

### ClientBiaCircumference

| Field        | Type          | Notes       |
| ------------ | ------------- | ----------- |
| id           | uuid          | PK          |
| biaScan      | ClientBiaScan | oneToOne FK |
| chestCm      | double?       | nullable    |
| waistCm      | double?       | nullable    |
| hipsCm       | double?       | nullable    |
| leftArmCm    | double?       | nullable    |
| rightArmCm   | double?       | nullable    |
| leftThighCm  | double?       | nullable    |
| rightThighCm | double?       | nullable    |
| leftCalfCm   | double?       | nullable    |
| rightCalfCm  | double?       | nullable    |

---

## API Endpoints

### Auth (Public)

#### `POST /auth/login`

Login and receive tokens.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

#### `POST /auth/refresh`

Refresh tokens.

**Request:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response (200):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

#### `POST /auth/logout`

Invalidate refresh token. **Requires auth.**

**Response (200):**
```json
{ "message": "Logged out successfully" }
```

#### `GET /auth/profile`

Get current user's JWT payload. **Requires auth.**

**Response (200):** The JWT payload object.

---

### Users (Admin only)

#### `GET /users`

List all users with their roles.

**Response:** `User[]`

#### `GET /users/:id`

Get a single user.

**Response:** `User`

**Errors:** `404` if not found.

#### `POST /users`

Create a user (admin flow). Used to create trainers or clients with profiles.

**Request:**
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "123456789",  // optional
  "roleId": "<uuid>",
  "trainerProfile": {          // required if role=trainer
    "bio": "...",              // optional
    "specialization": "..."    // optional
  },
  "clientProfile": {           // required if role=client
    "trainerId": "<uuid>",     // required
    "dateOfBirth": "1990-01-15", // optional
    "gender": "male",          // optional
    "heightCm": 180,           // optional
    "goal": "build muscle",    // optional
    "notes": "..."             // optional
  }
}
```

**Response:** `User`

---

### Clients (Trainer only)

#### `GET /clients`

List all clients belonging to the logged trainer.

**Response:** `Client[]`

#### `GET /clients/:id`

Get full details for a single client, including user info, BIA scans, and appointments with their slots. The client must belong to the logged trainer.

**Response:** `Client` with populated:
- `user` — the client's user account
- `biaScans` — all BIA scans (ordered by measuredAt desc)
- `appointments` — all appointments with `slot` populated (ordered by createdAt desc)

**Errors:** `404` if client not found or doesn't belong to trainer.

#### `POST /clients`

Create a new client (creates User + Client). The client is auto-assigned to the logged trainer.

**Request:**
```json
{
  "name": "Jane",
  "surname": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "dateOfBirth": "1995-06-20",  // optional
  "gender": "female",           // optional
  "heightCm": 165,              // optional
  "goal": "lose weight",        // optional
  "notes": "..."                // optional
}
```

**Response:** `Client`

**Errors:** `409` if email already exists.

#### `GET /clients/:clientId/bia-scans`

List all BIA scans for a client (ordered by most recent). The client must belong to the logged trainer.

**Response:** `ClientBiaScan[]` (with appointment populated)

**Errors:** `404` if client not found or doesn't belong to trainer.

#### `POST /clients/:clientId/bia-scans`

Create a BIA scan with optional circumferences. The `clientId` comes from the URL. The client must belong to the logged trainer.

**Request:**
```json
{
  "measuredAt": "2026-04-28T10:00:00Z",
  "weight": 75000,                     // grams, required
  "bodyFatPercentage": 18.5,           // optional
  "muscleMass": 32000,                 // grams, optional
  "notes": "...",                      // optional
  "appointmentId": "<uuid>",           // optional
  "circumferences": {                  // optional
    "chestCm": 95.5,
    "waistCm": 82.0,
    "hipsCm": 98.0,
    "leftArmCm": 32.0,
    "rightArmCm": 33.0,
    "leftThighCm": 55.0,
    "rightThighCm": 56.0,
    "leftCalfCm": 38.0,
    "rightCalfCm": 38.5
  }
}
```

**Response:** `ClientBiaScan`

**Errors:** `404` if client or appointment not found.

---

### Schedule Templates (Trainer only)

#### `GET /schedule-templates`

List all schedule templates for the logged trainer.

**Response:** `ScheduleTemplate[]`

#### `GET /schedule-templates/:id`

Get a single template.

**Response:** `ScheduleTemplate`

**Errors:** `404` if not found.

#### `POST /schedule-templates`

Create a new schedule template.

**Request:**
```json
{
  "weekDay": 1,          // 1=Monday .. 7=Sunday
  "startTime": "08:00",  // HH:mm
  "endTime": "12:00",    // HH:mm
  "blockTime": 60         // minutes
}
```

**Validation:**
- Time range must be evenly divisible by blockTime
- No overlap with existing active templates for the same weekDay

**Response:** `ScheduleTemplate`

**Errors:** `400` if invalid time range. `409` if overlap.

#### `PATCH /schedule-templates/:id`

Update a template. All fields optional.

**Request:**
```json
{
  "weekDay": 2,
  "startTime": "09:00",
  "endTime": "13:00",
  "blockTime": 30
}
```

**Response:** `ScheduleTemplate`

#### `PATCH /schedule-templates/:id/activate`

Reactivate a deactivated template.

**Response:**
```json
{ "message": "Schedule template activated successfully" }
```

#### `DELETE /schedule-templates/:id`

Soft-deactivate a template (sets `active = false`).

**Response:**
```json
{ "message": "Schedule template deactivated successfully" }
```

---

### Availability Slots (Trainer + Client)

#### `GET /availability-slots?date=YYYY-MM-DD`

List available slots. Filters:
- Only `active = true` slots
- Only slots from **today onwards** (past dates ignored even if passed as query param)
- For today: only slots where `startTime >= current time`
- Slots covered by **availability overrides** are excluded
- `date` query param is optional — if omitted, returns all future slots

**Response:** `AvailabilitySlot[]` (ordered by date asc, startTime asc)

#### `POST /availability-slots/generate` (Trainer only)

Manually trigger slot generation (same logic as the daily cron). Generates slots for each trainer based on their active schedule templates, for the next `slotGenerationDays` days.

**Response:**
```json
{ "message": "Slots generated" }
```

### Slot Generation (Cron Job)

Runs daily at **00:15 AM** automatically:
1. Deactivates all slots with `date < today`
2. For each trainer, generates slots for the next `trainer.slotGenerationDays` days based on active schedule templates
3. Idempotent — skips slots that already exist (matched by trainer + date + startTime)

---

### Availability Overrides (Trainer only)

Overrides allow a trainer to mark time blocks or full days as unavailable. Overridden slots are hidden from the availability list but not physically modified.

#### `GET /availability-overrides`

List all overrides for the logged trainer.

**Response:** `AvailabilityOverride[]` (ordered by startDate asc)

#### `POST /availability-overrides`

Create an override. Blocks creation if any affected slots are already booked.

**Request (time range):**
```json
{
  "startDate": "2026-05-01",
  "endDate": "2026-05-01",
  "fullDay": false,
  "startTime": "09:00",
  "endTime": "12:00",
  "reason": "Personal appointment"  // optional
}
```

**Request (full day / vacation):**
```json
{
  "startDate": "2026-05-10",
  "endDate": "2026-05-15",
  "fullDay": true,
  "reason": "Vacation"  // optional
}
```

**Validation:**
- `startTime` and `endTime` are required when `fullDay = false` (HH:mm format)
- `startDate <= endDate`
- `startTime < endTime` (when not fullDay)

**Response:** `AvailabilityOverride`

**Errors:** `409` if any slots in the range are already booked (returns the list of conflicting booked slots).

#### `DELETE /availability-overrides/:id`

Remove an override. Slots that were hidden will become visible again in the availability list.

**Response:**
```json
{ "message": "Availability override removed" }
```

---

### Appointments (Trainer + Client)

#### `GET /appointments`

List appointments for the logged user.
- **Trainer:** sees all their appointments (with client + slot populated)
- **Client:** sees all their appointments (with trainer + slot populated)

Ordered by slot date/time ascending.

**Response:** `Appointment[]`

#### `POST /appointments`

Book an appointment by selecting an availability slot.

**Request (as Client):**
```json
{
  "slotId": "<uuid>"
}
```

**Request (as Trainer — must specify client):**
```json
{
  "slotId": "<uuid>",
  "clientId": "<uuid>"
}
```

**Business rules:**
- Slot must exist, be active, and not already booked
- Client booking: the slot must belong to the client's trainer
- Trainer booking: `clientId` is required and must be one of the trainer's clients
- The slot is marked as `booked = true`
- Appointment is created in `scheduled` status

**Response:** `Appointment`

**Errors:** `404` slot/client not found. `409` slot already booked. `400` missing clientId (trainer) or wrong trainer (client).

#### `PATCH /appointments/:id/cancel`

Cancel a scheduled appointment. Both trainer and client can cancel.

**Business rules:**
- Only `scheduled` appointments can be canceled
- Sets status to `canceled`
- Releases the slot (`booked = false`)

**Response:** `Appointment`

**Errors:** `404` not found. `400` if not in scheduled status.

---

## Error Responses

All errors follow the NestJS format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

Validation errors (from DTOs) return an array of messages:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than or equal to 8 characters"],
  "error": "Bad Request"
}
```

| Code | Usage                                 |
| ---- | ------------------------------------- |
| 400  | Validation / business rule violations |
| 401  | Missing or invalid JWT                |
| 403  | Insufficient role / token issues      |
| 404  | Resource not found                    |
| 409  | Conflict (duplicate, already booked)  |

---

## Important Business Rules

1. **Client ownership:** Whenever a trainer provides a `clientId`, the backend validates that the client belongs to that trainer. Unauthorized access to another trainer's clients is rejected with `404`.

2. **Availability overrides don't modify slots:** Overrides are applied at query time — the slots list endpoint filters out overridden slots. Slots in the DB remain untouched.

3. **Slot generation is idempotent:** The cron job and manual trigger only create missing slots. Existing slots (even from old templates) remain. New template changes only affect days without existing slots.

4. **Past slot filtering:** The availability slots endpoint never returns past slots or past time slots for today, regardless of query params.
