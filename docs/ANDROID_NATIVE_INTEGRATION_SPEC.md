# 📱 DriveIT Native Android Integration Specification & Architecture Guide

**Version:** 3.1.0  
**Target Environments:** Android Native (Kotlin / Jetpack Compose), Cross-Platform (Capacitor / React Native / Flutter)  
**Backend Protocol:** REST JSON API + Socket.io WebSockets + Firebase Cloud Messaging (FCM)

---

## 🏗️ 1. Architecture Overview

DriveIT's backend is architected with a **stateless REST + Real-time Socket.io** interface designed for native mobile clients.

```
┌─────────────────────────────────────────────────────────────┐
│                 Native Android Application                  │
│  (Kotlin / Jetpack Compose / Capacitor / React Native)      │
└──────────────┬──────────────────────────────┬───────────────┘
               │ HTTP / JSON                  │ WebSockets
               │ Authorization: Bearer <JWT>  │ socket.io-client
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  DriveIT Backend Gateway                     │
│  - JWT Verification & Rate Limiting                         │
│  - AI Pricing & NHAI Toll Engine                            │
│  - Corridor Anti-Collision Physics Engine                   │
│  - Razorpay & DigiLocker Aadhaar KYC Adapters               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 2. Authentication & Session Management

### Header Standard
All protected endpoints require standard HTTP Bearer token:
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Client-Platform: android
X-App-Version: 3.1.0
```

### Authentication Endpoints
1. **Google Native Sign-In / Sign-Up**:
   - `POST /api/auth/google`
   - Payload:
     ```json
     {
       "idToken": "<google_id_token>",
       "googleId": "104829104...",
       "email": "user@gmail.com",
       "name": "Rohan Sharma",
       "avatar": "https://...",
       "accountType": "passenger" // or "pilot"
     }
     ```
2. **Email & Password Login**:
   - `POST /api/auth/login` ➔ `{ token, user }`
3. **Phone OTP Verification**:
   - `POST /api/auth/send-otp` ➔ `{ success: true, txnId }`
   - `POST /api/auth/verify-otp` ➔ `{ token, user }`

---

## 🚗 3. Core Native Feature Workflows

### A. Pilot Corridor Operations
- **List Corridor Departure**:
  - `POST /api/lister/rides`
  - Anti-duplicate schedule collision protection returns `409 Conflict` if departure overlaps.
- **Pilot KYC Verification (Aadhaar & RC)**:
  - `POST /api/lister/kyc` (multipart or JSON doc URLs).
- **Booking Pause / Resume**:
  - `PATCH /api/lister/rides/{id}/toggle-bookings`

### B. Passenger Booking & Flight Deck
- **1-Active-Trip Integrity Rule**:
  - `POST /api/booker/bookings`
  - If passenger has an active trip or request in progress, returns `400 Bad Request` with `{ code: "ACTIVE_SESSION_EXISTS" }`.
- **4-Digit Boarding Pass PIN Verification**:
  - Passenger presents 4-digit PIN generated upon booking confirmation.
  - Pilot inputs PIN to start the trip.

### C. Real-Time Corridor GPS Telemetry (Socket.io)
Connect via `socket.io-client`:
```kotlin
// Android Kotlin Socket.io Connection
val socket = IO.socket("https://api.driveit.in")
socket.connect()

// Broadcast Pilot Live GPS
val gpsPayload = JSONObject().apply {
    put("rideId", "ride_mumbai_pune_01")
    put("lat", 18.7523)
    put("lng", 73.4120)
    put("speed", 85.4)
    put("heading", 142.0)
}
socket.emit("pilot:location:update", gpsPayload)

// Listen for Passenger Bookings
socket.on("booking:created") { args ->
    val booking = args[0] as JSONObject
    // Trigger Android Notification & Haptic Vibration
}
```

---

## 🔔 4. Push Notifications & FCM Setup

### FCM Registration Endpoint
- **Register Device Token**:
  - `POST /api/push/subscribe`
  - Body:
    ```json
    {
      "userId": "usr_12345",
      "fcmToken": "<firebase_cloud_messaging_device_token>",
      "platform": "android"
    }
    ```

---

## 🚀 5. Quick Android Packaging via Capacitor (Zero-Code Option)

To generate a working Android Studio project from this repository in 2 minutes:

```bash
# 1. Install Capacitor CLI
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize and add Android platform
npx cap add android

# 3. Build Web Assets & Sync to Android Studio
npm --prefix client run build
npx cap sync android

# 4. Open in Android Studio & Run on Device/Emulator
npx cap open android
```

---

## 📋 6. Deep Linking & App Links Configuration

In `AndroidManifest.xml`:
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="driveit.in" android:pathPrefix="/ride/" />
    <data android:scheme="driveit" />
</intent-filter>
```
