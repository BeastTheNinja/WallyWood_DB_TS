# WallyWood API Documentation

## Overview
A Node.js/Express/TypeScript API for managing movie posters with user authentication, cart management, and rating system. Built with Prisma ORM and MySQL database.

## Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Features
✅ User authentication (Register/Login with JWT)  
✅ Role-based access control (ADMIN/USER)  
✅ CRUD operations for all models  
✅ Shopping cart functionality  
✅ Rating/Review system  
✅ Genre and poster management  
✅ CSV data seeding  

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL database running
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file with:
```
DATABASE_URL="mysql://user:password@localhost:3306/WallyWood_DB"
PORT=3000
JWT_SECRET=your_secure_jwt_secret_key
```

### Database Migration
```bash
npm run prisma:migrate
```

### Seed Database
```bash
npx tsx prisma/seedCSV.ts
```

### Start Server
```bash
npm run dev      # Development (with tsx watch)
npm run build    # Build TypeScript
npm run start    # Production (run compiled JS)
```

Server will run on `http://localhost:3000`

---

## API Endpoints

### Authentication (Public)

#### Register User
```
POST /api/users/register
```
**Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```
**Response:**
```json
{
  "message": "Bruger oprettet",
  "user": {
    "id": 3,
    "email": "john@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```
POST /api/users/login
```
**Body:**
```json
{
  "email": "info@webudvikler.dk",
  "password": "password"
}
```
**Response:**
```json
{
  "message": "Login succesfuldt",
  "user": {
    "id": 1,
    "email": "info@webudvikler.dk",
    "firstname": "Admin",
    "lastname": "Admin",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile (Authenticated)
```
GET /api/users/profile
Authorization: Bearer {token}
```

---

### Users (ADMIN Only)

#### Get All Users
```
GET /api/users
Authorization: Bearer {admin_token}
```

#### Get User by ID
```
GET /api/users/:id
Authorization: Bearer {admin_token}
```

#### Update User
```
PUT /api/users/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "firstname": "Updated",
  "lastname": "Name",
  "isActive": true
}
```

#### Delete User
```
DELETE /api/users/:id
Authorization: Bearer {admin_token}
```

---

### Posters (Public Read, Admin Write)

#### Get All Posters
```
GET /api/posters
```
**Response:** Array of posters with genres and ratings

#### Get Poster by ID
```
GET /api/posters/:id
```

#### Get Poster by Slug
```
GET /api/posters/slug/:slug
```

#### Create Poster (ADMIN)
```
POST /api/posters
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Movie Title",
  "slug": "movie-title-slug",
  "description": "Movie description",
  "image": "https://example.com/image.jpg",
  "width": 70,
  "height": 100,
  "price": 99.99,
  "stock": 5
}
```

#### Update Poster (ADMIN)
```
PUT /api/posters/:id
Authorization: Bearer {admin_token}
```

#### Delete Poster (ADMIN)
```
DELETE /api/posters/:id
Authorization: Bearer {admin_token}
```

---

### Genres (Public Read, Admin Write)

#### Get All Genres
```
GET /api/genres
```

#### Get Genre by ID
```
GET /api/genres/:id
```

#### Get Genre by Slug
```
GET /api/genres/slug/:slug
```

#### Create Genre (ADMIN)
```
POST /api/genres
Authorization: Bearer {admin_token}

{
  "title": "Action",
  "slug": "action"
}
```

#### Update Genre (ADMIN)
```
PUT /api/genres/:id
Authorization: Bearer {admin_token}

{
  "title": "Action Films"
}
```

#### Delete Genre (ADMIN)
```
DELETE /api/genres/:id
Authorization: Bearer {admin_token}
```

---

### Shopping Cart

#### Get All Cart Items (ADMIN)
```
GET /api/cartlines
Authorization: Bearer {admin_token}
```

#### Get User's Cart
```
GET /api/cartlines/user/:userId
Authorization: Bearer {token}
```

#### Get Cart Item by ID
```
GET /api/cartlines/:id
Authorization: Bearer {token}
```

#### Add to Cart / Update Quantity
```
POST /api/cartlines
Authorization: Bearer {token}

{
  "userId": 2,
  "posterId": 1452,
  "quantity": 1
}
```
*If item already in cart, quantity will be updated*

#### Update Cart Item Quantity
```
PUT /api/cartlines/:id
Authorization: Bearer {token}

{
  "quantity": 3
}
```

#### Remove from Cart
```
DELETE /api/cartlines/:id
Authorization: Bearer {token}
```

#### Clear Entire Cart
```
DELETE /api/cartlines/user/:userId/clear
Authorization: Bearer {token}
```

---

### Ratings

#### Get All Ratings
```
GET /api/ratings
```

#### Get Ratings for Poster
```
GET /api/ratings/poster/:posterId
```

#### Get Average Rating for Poster
```
GET /api/ratings/poster/:posterId/average
```

#### Get User's Ratings
```
GET /api/ratings/user/:userId
Authorization: Bearer {token}
```

#### Get Rating by ID
```
GET /api/ratings/:id
```

#### Create/Update Rating
```
POST /api/ratings
Authorization: Bearer {token}

{
  "userId": 2,
  "posterId": 1452,
  "numStars": 5
}
```
*Stars must be 1-5. If user already rated poster, it will update*

#### Delete Rating (ADMIN)
```
DELETE /api/ratings/:id
Authorization: Bearer {admin_token}
```

---

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

Tokens are valid for 7 days. Get a new token by logging in again.

## Role-Based Access Control

### Public Endpoints
- Login/Register
- Get posters, genres, ratings
- Get poster/genre details by ID or slug

### User Endpoints (Authenticated)
- View own profile
- Manage own cart
- Create/update own ratings
- View own ratings

### Admin Endpoints (Authenticated + ADMIN role)
- Manage all users
- Create/update/delete posters
- Create/update/delete genres
- Delete any ratings
- View all cart items

---

## Database Schema

### User
```
id: Int (Primary Key)
firstname: String
lastname: String
email: String (Unique)
password: String (Hashed)
role: Enum (ADMIN, USER)
isActive: Boolean
createdAt: DateTime
updatedAt: DateTime
```

### Poster
```
id: Int (Primary Key)
name: String
slug: String (Unique)
description: String
image: String (URL)
width: Int
height: Int
price: Float
stock: Int
createdAt: DateTime
updatedAt: DateTime
```

### Genre
```
id: Int (Primary Key)
title: String
slug: String (Unique)
createdAt: DateTime
updatedAt: DateTime
```

### GenrePosterRel (Junction Table)
```
id: Int (Primary Key)
genreId: Int (Foreign Key)
posterId: Int (Foreign Key)
```

### UserRating
```
id: Int (Primary Key)
userId: Int (Foreign Key)
posterId: Int (Foreign Key)
numStars: Int (1-5)
createdAt: DateTime
updatedAt: DateTime
```

### Cartline
```
id: Int (Primary Key)
userId: Int (Foreign Key)
posterId: Int (Foreign Key)
quantity: Int
createdAt: DateTime
updatedAt: DateTime
```

---

## Testing with Postman

1. **Import Collection**: Import `WallyWood_API_Postman_Collection.json` into Postman
2. **Set Environment Variables**: 
   - After login, copy the token from response
   - Set `token` variable in Postman with the JWT token
3. **Test Endpoints**: Use the pre-configured requests in the collection

### Test Flow:
1. Register a new user or use test user (email: `alm@webudvikler.dk`, password: `password`)
2. Login to get JWT token
3. Update Postman `token` variable with the token
4. Test endpoints with proper authorization

---

## Error Handling

All errors return JSON with error message:
```json
{
  "error": "Error description"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (Invalid/Missing token)
- `403`: Forbidden (Insufficient permissions)
- `404`: Not Found
- `500`: Server Error

---

## Deployment

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm run start
```

---

## Notes

- Passwords are automatically hashed using bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- All timestamps are in UTC
- Unique constraints on email, slug, and user-poster combinations
- Cascade delete enabled for relationships
- CSV data is seeded with skipDuplicates option

---

**Created**: December 2025  
**API Version**: 1.0.0
