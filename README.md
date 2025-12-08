# WallyWood API - Node.js/Express/TypeScript/Prisma

A full-stack movie poster e-commerce API with user authentication, shopping cart, and rating system.

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Setup Environment
Create `.env` file:
```
DATABASE_URL="mysql://user:password@localhost:3306/WallyWood_DB"
PORT=3000
JWT_SECRET=your_secure_secret_key_here
```

### 3. Create Database & Run Migration
```bash
npm run prisma:migrate
```

### 4. Seed with CSV Data
```bash
npx tsx prisma/seedCSV.ts
```

### 5. Start Server
```bash
npm run dev
```

Server running at: `http://localhost:3000`

---

## 📦 Available Scripts

```bash
npm run dev                # Start with hot reload (development)
npm run build              # Compile TypeScript
npm run start              # Run compiled JavaScript (production)
npm run prisma:migrate     # Run Prisma migration
npm run prisma:reset       # Reset database and reseed
npm run prisma:generate    # Generate Prisma Client
```

---

## 📚 API Overview

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login (returns JWT token)
- `GET /api/users/profile` - Get current user profile (auth required)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posters
- `GET /api/posters` - Get all posters
- `GET /api/posters/:id` - Get poster by ID
- `GET /api/posters/slug/:slug` - Get poster by slug
- `POST /api/posters` - Create poster (admin)
- `PUT /api/posters/:id` - Update poster (admin)
- `DELETE /api/posters/:id` - Delete poster (admin)

### Genres
- `GET /api/genres` - Get all genres
- `GET /api/genres/:id` - Get genre by ID
- `GET /api/genres/slug/:slug` - Get genre by slug
- `POST /api/genres` - Create genre (admin)
- `PUT /api/genres/:id` - Update genre (admin)
- `DELETE /api/genres/:id` - Delete genre (admin)

### Cart
- `GET /api/cartlines` - Get all items (admin)
- `GET /api/cartlines/user/:userId` - Get user's cart
- `POST /api/cartlines` - Add to cart
- `PUT /api/cartlines/:id` - Update quantity
- `DELETE /api/cartlines/:id` - Remove from cart
- `DELETE /api/cartlines/user/:userId/clear` - Clear entire cart

### Ratings
- `GET /api/ratings` - Get all ratings
- `GET /api/ratings/poster/:posterId` - Get poster ratings
- `GET /api/ratings/poster/:posterId/average` - Get average rating
- `POST /api/ratings` - Create/update rating
- `DELETE /api/ratings/:id` - Delete rating (admin)

---

## 🔐 Authentication

All protected endpoints require JWT token:
```
Authorization: Bearer {token}
```

**Default Test Credentials:**
- Email: `info@webudvikler.dk`
- Password: `password`
- Role: `ADMIN`

---

## 📊 Database Models

### User
- id, firstname, lastname, email, password, role (ADMIN/USER), isActive, timestamps

### Poster
- id, name, slug, description, image, width, height, price, stock, timestamps

### Genre
- id, title, slug, timestamps

### UserRating
- id, userId, posterId, numStars (1-5), timestamps

### Cartline
- id, userId, posterId, quantity, timestamps

### GenrePosterRel (Junction)
- id, genreId, posterId

---

## 🧪 Testing with Postman

1. Import `WallyWood_API_Postman_Collection.json`
2. Login to get JWT token
3. Set `token` variable with the JWT
4. Test all endpoints

See `API_DOCUMENTATION.md` for detailed endpoint documentation.

---

## 🏗️ Project Structure

```
src/
├── index.ts                    # Express app setup
├── prisma.ts                   # Prisma client
├── controller/                 # Business logic
│   ├── userController.ts
│   ├── postersController.ts
│   ├── genresController.ts
│   ├── cartLinesController.ts
│   └── userRatingsController.ts
├── routes/                     # API endpoints
│   ├── userRoutes.ts
│   ├── postersRoutes.ts
│   ├── genresController.ts     # routes for genres
│   ├── cartLinesController.ts  # routes for cart
│   └── ratingsRoutes.ts
└── middleware/
    └── authMiddleware.ts       # JWT authentication & role-based access

prisma/
├── schema.prisma               # Database schema
├── seedCSV.ts                  # CSV seeding script
├── types.ts                    # Field types for seeding
└── csv/                        # Data files
    ├── user.csv
    ├── genre.csv
    ├── poster.csv
    └── genrePosterRel.csv
```

---

## 🔑 Key Features

✅ **User Authentication** - JWT-based auth with role system  
✅ **Password Security** - Bcrypt hashing (10 salt rounds)  
✅ **Role-Based Access** - ADMIN and USER roles  
✅ **CRUD Operations** - Full Create, Read, Update, Delete  
✅ **Relationships** - Proper foreign keys and constraints  
✅ **Data Seeding** - CSV import for bulk data  
✅ **Shopping Cart** - Add/remove/update items  
✅ **Rating System** - 1-5 star ratings with averages  
✅ **Error Handling** - Comprehensive error responses  
✅ **Documentation** - API docs + Postman collection  

---

## ⚠️ Important Notes

- All passwords are hashed and never stored in plain text
- JWT tokens expire after 7 days
- Admin operations require ADMIN role
- Unique constraints on email, slugs, and user-poster combinations
- CSV seeding uses `skipDuplicates` option
- Cascade delete enabled for maintaining referential integrity

---

## 🐛 Troubleshooting

### Database Connection Error
Check `.env` DATABASE_URL is correct and MySQL is running

### Migration Error
```bash
npm run prisma:reset       # Reset and reseed from scratch
```

### Port Already in Use
Change `PORT` in `.env` file

### JWT Issues
Ensure `JWT_SECRET` is set in `.env` file

---

## 📝 License

ISC

---

**Built with ❤️ using Node.js, Express, TypeScript, and Prisma**
