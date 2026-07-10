# FixItNow

**A Home Service Marketplace Backend API**

## Live API

https://fix-it-now-backend-ivory.vercel.app/

## Admin Credentials

Email - admin@gmail.com

Password - 123456

## Project Overview

FixItNow is a backend REST API for a home service marketplace where customers can book home services, technicians can manage their services and availability, and admins can manage the entire platform.

The API supports secure authentication, role-based authorization, booking management, Stripe payment processing, reviews, technician availability, and admin management.

## Tech Stack

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

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Role-based access control (Customer, Technician, Admin)
- Get authenticated user profile

### Customer

- Browse service categories
- Search and filter services
- Browse technicians
- View technician details
- Create service bookings
- View booking history
- Submit technician reviews
- Secure payments using Stripe
- View payment history

### Technician

- Create and update technician profile
- Create and manage services
- Manage availability schedules
- View assigned bookings
- Accept or update booking status

### Admin

- Manage users
- Update user status
- Create and manage service categories
- View all bookings

### 💳 Payment

- Stripe Checkout integration
- Secure payment processing
- Payment status tracking

### ✅ API Features

- RESTful API architecture
- Server-side input validation
- Consistent JSON response format
- Global error handling
- PostgreSQL with Prisma ORM

## Installation

```bash
git clone https://github.com/nipaayasha05/fix_it_now_backend

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

- Customer
- Technician
- Admin

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
