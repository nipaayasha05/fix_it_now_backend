# FixItNow 🔧

**A Home Service Marketplace Backend API**

## Live API

https://fix-it-now-backend-ivory.vercel.app/

## Admin Credentials

Email - admin@gmail.com

Password - 123456

## Project Overview

FixItNow is a backend REST API for a home service marketplace where customers can book home services, technicians can manage their services and availability, and admins can manage the entire platform.

The API supports secure authentication, role-based authorization, booking management, Stripe payment processing, reviews, technician availability, and admin management.

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- Prisma ORM

### Authentication & Security

- JWT (JSON Web Token)
- bcryptjs
- Cookie Parser
- CORS

### Payment Integration

- Stripe

### Environment & Configuration

- dotenv

### Build & Development

- tsx
- tsup

### Utilities

- HTTP Status

## Environment Variables

.env.example

## Installation

```bash
git clone https://github.com/your-username/fix-it-now-backend.git

cd fix-it-now-backend

npm install

npx prisma generate

npx prisma migrate deploy

npm run seed

npm run dev
```

## Database

Main Models

- User
- Technician
- Service
- Booking
- Payment
- Review
- Availability
- Category

## Roles

Customer

Technician

Admin

## Response Format

All API responses follow a consistent JSON structure.

### Successful Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully for public",
  "data": [
    {
      "id": "2714f3ee-0556-43fd-bde3-97e9ef11fb01",
      "name": "Cleaning",
      "description": null
    }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 404,
  "name": "NotFound",
  "message": "Route not found",
  "errorDetails": null,
  "path": "/api/categories1"
}
```
