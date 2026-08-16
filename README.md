# Driveit Intercity Rideshare Platform

Full-stack intercity carpooling platform built with React, Node.js, Express, and PostgreSQL. Features JWT-based RBAC, dynamic pricing, real-time support chat, and Aadhaar KYC verification.

## Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, React Hook Form, Zod, Leaflet
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
- **Real-time**: Socket.io
- **Payments**: Razorpay
- **Auth**: JWT with role-based access control (RBAC)

## Quick Start

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 16 (or Docker)

### Option 1: Docker (Recommended)

```bash
docker-compose up -d
```

### Option 2: Local Setup

```bash
# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# Start PostgreSQL
docker-compose up -d postgres

# Configure environment
cp server/.env.example server/.env

# Run database migrations
cd server && npx prisma migrate dev && npx prisma db seed && cd ..

# Start backend
cd server && npm run dev

# Start frontend (in another terminal)
cd client && npm run dev
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Driver (Lister) | rahul@driveit.in | password123 |
| Passenger (Booker) | ananya@driveit.in | password123 |
| Support/Admin | aman@driveit.in | password123 |
| Dual Role | rohan@driveit.in | password123 |

## Environment Variables

See `server/.env.example` for required variables.

## License

MIT
