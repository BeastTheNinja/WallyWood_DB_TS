# WallyWood API - Implementation Summary

## ✅ Completed Tasks

### 1. ✅ Database Schema (Prisma)
- **Updated `prisma/schema.prisma`** with proper relationships
- Added models: `User`, `Poster`, `Genre`, `GenrePosterRel`, `UserRating`, `Cartline`
- Configured role enum (`ADMIN`, `USER`)
- Added cascade delete for referential integrity
- Added unique constraints on email, slugs, and composite keys

### 2. ✅ Authentication System
- **Created `src/middleware/authMiddleware.ts`**:
  - JWT token validation
  - Role-based access control (`authMiddleware` + `adminMiddleware`)
  - Type definitions for authenticated requests

### 3. ✅ Controllers (Business Logic)
- **`userController.ts`**: Register, login, get profile, CRUD operations
- **`postersController.ts`**: Browse, create, update, delete posters
- **`genresController.ts`**: Browse, create, update, delete genres
- **`cartLinesController.ts`**: Shopping cart operations
- **`userRatingsController.ts`**: Rating system with averages

### 4. ✅ Routes/Endpoints
- **`userRoutes.ts`**: Auth (register/login) + user management
- **`postersRoutes.ts`**: Poster CRUD endpoints
- **`genresController.ts` (routes)**: Genre CRUD endpoints
- **`cartLinesController.ts` (routes)**: Cart management
- **`ratingsRoutes.ts`**: Rating endpoints
- Integrated all routes in `src/index.ts`

### 5. ✅ Data Seeding
- **Updated `prisma/seedCSV.ts`**:
  - Supports all models with proper type casting
  - Handles password hashing during seed
  - Logs progress and error handling
- **Updated `prisma/types.ts`**: Field type definitions for all models

### 6. ✅ Database Migration
- Ran `prisma migrate dev` - successfully created migration
- Generated Prisma Client
- Schema is now synced with database

### 7. ✅ Documentation
- **`API_DOCUMENTATION.md`**: Complete API reference with all endpoints
- **`README.md`**: Quick start guide and project overview
- **`TESTING_GUIDE.md`**: Step-by-step testing scenarios
- **`WallyWood_API_Postman_Collection.json`**: Pre-configured Postman collection

---

## 📊 API Endpoints Summary

### Authentication (Public)
```
POST   /api/users/register          - Register new user
POST   /api/users/login             - Login (returns JWT)
GET    /api/users/profile           - Get current profile (auth required)
```

### Users (Admin Only)
```
GET    /api/users                   - Get all users
GET    /api/users/:id               - Get user by ID
PUT    /api/users/:id               - Update user
DELETE /api/users/:id               - Delete user
```

### Posters (Public Read, Admin Write)
```
GET    /api/posters                 - Get all posters
GET    /api/posters/:id             - Get poster by ID
GET    /api/posters/slug/:slug      - Get poster by slug
POST   /api/posters                 - Create poster (admin)
PUT    /api/posters/:id             - Update poster (admin)
DELETE /api/posters/:id             - Delete poster (admin)
```

### Genres (Public Read, Admin Write)
```
GET    /api/genres                  - Get all genres
GET    /api/genres/:id              - Get genre by ID
GET    /api/genres/slug/:slug       - Get genre by slug
POST   /api/genres                  - Create genre (admin)
PUT    /api/genres/:id              - Update genre (admin)
DELETE /api/genres/:id              - Delete genre (admin)
```

### Shopping Cart (Authenticated)
```
GET    /api/cartlines               - Get all items (admin)
GET    /api/cartlines/user/:userId  - Get user's cart
GET    /api/cartlines/:id           - Get cart item by ID
POST   /api/cartlines               - Add to cart
PUT    /api/cartlines/:id           - Update quantity
DELETE /api/cartlines/:id           - Remove from cart
DELETE /api/cartlines/user/:userId/clear - Clear cart
```

### Ratings (Mixed)
```
GET    /api/ratings                 - Get all ratings (public)
GET    /api/ratings/poster/:posterId - Get poster ratings (public)
GET    /api/ratings/poster/:posterId/average - Average rating (public)
GET    /api/ratings/user/:userId    - Get user ratings (auth)
POST   /api/ratings                 - Create/update rating (auth)
DELETE /api/ratings/:id             - Delete rating (admin)
```

---

## 🔐 Security Features

✅ JWT token authentication (7-day expiry)  
✅ Bcrypt password hashing (10 salt rounds)  
✅ Role-based access control (ADMIN/USER)  
✅ Admin-only operations on sensitive data  
✅ Unique email constraint  
✅ Unique slug constraints  
✅ User-poster combination constraints (cart/ratings)

---

## 📁 Project Structure

```
WallyWood_DB_TS/
├── src/
│   ├── index.ts                          # Main Express app
│   ├── prisma.ts                         # Prisma client
│   ├── controller/
│   │   ├── userController.ts             # User CRUD & auth
│   │   ├── postersController.ts          # Poster CRUD
│   │   ├── genresController.ts           # Genre CRUD
│   │   ├── cartLinesController.ts        # Cart operations
│   │   └── userRatingsController.ts      # Rating operations
│   ├── routes/
│   │   ├── userRoutes.ts                 # User endpoints
│   │   ├── postersRoutes.ts              # Poster endpoints
│   │   ├── genresController.ts           # Genre routes
│   │   ├── cartLinesController.ts        # Cart routes
│   │   └── ratingsRoutes.ts              # Rating routes
│   └── middleware/
│       └── authMiddleware.ts             # JWT & role auth
├── prisma/
│   ├── schema.prisma                     # Database schema
│   ├── seedCSV.ts                        # Seeding script
│   ├── types.ts                          # Type definitions
│   ├── migrations/                       # Migration files
│   └── csv/                              # Data files
│       ├── user.csv
│       ├── genre.csv
│       ├── poster.csv
│       └── genrePosterRel.csv
├── .env                                  # Environment variables
├── .gitignore                            # Git ignore rules
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── README.md                             # Quick start
├── API_DOCUMENTATION.md                  # Full API docs
├── TESTING_GUIDE.md                      # Testing scenarios
└── WallyWood_API_Postman_Collection.json # Postman collection
```

---

## 🚀 Next Steps

### 1. **Seed the Database**
```bash
npx tsx prisma/seedCSV.ts
```
This will populate your database with:
- 2 test users (1 admin, 1 user)
- 20+ genres
- 3000+ movie posters
- Genre-poster relationships

### 2. **Start the Server**
```bash
npm run dev
```

### 3. **Test in Postman**
- Import `WallyWood_API_Postman_Collection.json`
- Login with: `info@webudvikler.dk` / `password`
- Test endpoints from collection

### 4. **Build for Production**
```bash
npm run build
npm run start
```

---

## 📊 Database Models

### User
```
id (int, PK, auto-increment)
firstname (string)
lastname (string)
email (string, unique)
password (string, hashed)
role (enum: ADMIN, USER)
isActive (boolean)
createdAt (datetime)
updatedAt (datetime)
```

### Poster
```
id (int, PK)
name (string)
slug (string, unique)
description (text)
image (string, URL)
width (int)
height (int)
price (float)
stock (int)
createdAt (datetime)
updatedAt (datetime)
```

### Genre
```
id (int, PK)
title (string)
slug (string, unique)
createdAt (datetime)
updatedAt (datetime)
```

### UserRating
```
id (int, PK)
userId (int, FK)
posterId (int, FK)
numStars (int, 1-5)
createdAt (datetime)
updatedAt (datetime)
Unique: (userId, posterId)
```

### Cartline
```
id (int, PK)
userId (int, FK)
posterId (int, FK)
quantity (int)
createdAt (datetime)
updatedAt (datetime)
Unique: (userId, posterId)
```

### GenrePosterRel (Junction)
```
id (int, PK)
genreId (int, FK)
posterId (int, FK)
Unique: (genreId, posterId)
```

---

## 🎯 Features Implemented

✅ **User Management**
- Registration with validation
- Login with JWT token
- Password hashing
- Role-based access (ADMIN/USER)
- Profile management

✅ **Poster Management**
- Browse all posters
- Filter by ID or slug
- Admin create/update/delete
- Stock management
- Price management

✅ **Genre Management**
- Browse genres
- Filter by ID or slug
- Admin create/update/delete
- Genre-poster relationships

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Clear cart
- User-specific carts

✅ **Rating System**
- 1-5 star ratings
- Average rating calculation
- User ratings history
- Admin can delete ratings

✅ **Authentication**
- JWT token-based
- 7-day token expiry
- Role-based middleware
- Secure password handling

✅ **Documentation**
- Full API documentation
- Testing guide with examples
- Postman collection
- README with quick start

---

## 🧪 How to Test

### Using Postman (Recommended)
1. Open Postman
2. Import `WallyWood_API_Postman_Collection.json`
3. Login: `POST /api/users/login`
4. Copy token from response
5. Set `token` variable in Postman
6. Test all endpoints from collection

### Using cURL
```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"Test","lastname":"User","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"info@webudvikler.dk","password":"password"}'

# Get protected endpoint
curl -H "Authorization: Bearer {token}" http://localhost:3000/api/users/profile
```

---

## ⚠️ Important Notes

1. **Database**: MySQL is required and must be running
2. **Environment Variables**: Set `.env` with DATABASE_URL, PORT, JWT_SECRET
3. **Passwords**: Hashed during registration and seeding - never stored plain
4. **Tokens**: 7-day expiry - login again to get new token
5. **Admin Role**: Only users with ADMIN role can perform admin operations
6. **Cascade Delete**: Deleting user/poster cascades to related records
7. **CSV Seeding**: Use `skipDuplicates` to prevent constraint violations

---

## 📝 Default Test Credentials

```
Email: info@webudvikler.dk
Password: password
Role: ADMIN
```

---

## 🔄 Migration & Reset

### Reset Database & Reseed
```bash
npm run prisma:reset
```

### Regenerate Prisma Client
```bash
npm run prisma:generate
```

### Check Migration Status
```bash
npx prisma migrate status
```

---

## 📞 Support

For issues or questions:
1. Check `API_DOCUMENTATION.md` for endpoint details
2. Review `TESTING_GUIDE.md` for testing scenarios
3. Check `.env` configuration
4. Verify MySQL connection
5. Review error messages in console

---

**Status**: ✅ Complete and Ready for Testing  
**Version**: 1.0.0  
**Last Updated**: December 8, 2025
