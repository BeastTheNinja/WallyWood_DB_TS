# WallyWood API - Quick Reference Card

## 🚀 Start Server
```bash
npm run dev
```
API runs on: `http://localhost:3000`

---

## 🔑 Login
```bash
POST /api/users/login
Body: {
  "email": "info@webudvikler.dk",
  "password": "password"
}
```
Returns: `{ token: "..." }`

---

## 📚 All Endpoints

### PUBLIC (No Token Required)
```
GET  /api/posters                    - All posters
GET  /api/posters/:id                - Poster by ID
GET  /api/posters/slug/:slug         - Poster by slug
GET  /api/genres                     - All genres
GET  /api/genres/:id                 - Genre by ID
GET  /api/genres/slug/:slug          - Genre by slug
GET  /api/ratings                    - All ratings
GET  /api/ratings/:id                - Rating by ID
GET  /api/ratings/poster/:id         - Ratings for poster
GET  /api/ratings/poster/:id/average - Average rating
POST /api/users/register             - Register
POST /api/users/login                - Login
```

### AUTHENTICATED (Token in Authorization Header)
```
GET    /api/users/profile            - My profile
GET    /api/cartlines/user/:id       - My cart
GET    /api/cartlines/:id            - Cart item
POST   /api/cartlines                - Add to cart
PUT    /api/cartlines/:id            - Update quantity
DELETE /api/cartlines/:id            - Remove from cart
DELETE /api/cartlines/user/:id/clear - Clear cart
POST   /api/ratings                  - Rate poster
GET    /api/ratings/user/:id         - My ratings
```

### ADMIN ONLY (Token + ADMIN role)
```
GET    /api/users                    - All users
GET    /api/users/:id                - User by ID
PUT    /api/users/:id                - Edit user
DELETE /api/users/:id                - Delete user

POST   /api/posters                  - Create poster
PUT    /api/posters/:id              - Edit poster
DELETE /api/posters/:id              - Delete poster

POST   /api/genres                   - Create genre
PUT    /api/genres/:id               - Edit genre
DELETE /api/genres/:id               - Delete genre

GET    /api/cartlines                - All cart items
DELETE /api/ratings/:id              - Delete rating
```

---

## 🔐 Using Token

All authenticated requests need header:
```
Authorization: Bearer {token_here}
```

Example in Postman:
```
Header: Authorization
Value:  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Common Tasks

### Register New User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname":"John",
    "lastname":"Doe",
    "email":"john@example.com",
    "password":"Pass123"
  }'
```

### Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cartlines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "userId":2,
    "posterId":1452,
    "quantity":1
  }'
```

### Rate a Poster
```bash
curl -X POST http://localhost:3000/api/ratings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "userId":2,
    "posterId":1452,
    "numStars":5
  }'
```

### Get Average Rating
```bash
curl http://localhost:3000/api/ratings/poster/1452/average
```

---

## 📊 Database Info

**Users:**
- Admin: info@webudvikler.dk / password
- Test: alm@webudvikler.dk / password

**Data:**
- 20+ genres
- 3000+ posters
- 2 test users

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Express app setup |
| `prisma/schema.prisma` | Database schema |
| `src/middleware/authMiddleware.ts` | JWT auth |
| `src/controller/*` | Business logic |
| `src/routes/*` | API endpoints |
| `.env` | Configuration |
| `API_DOCUMENTATION.md` | Full docs |
| `TESTING_GUIDE.md` | Test scenarios |

---

## 🧪 Testing

### Postman
1. Import `WallyWood_API_Postman_Collection.json`
2. Test endpoints from collection

### cURL
```bash
# Health check
curl http://localhost:3000/api/health

# Get all posters
curl http://localhost:3000/api/posters

# With authentication
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/users/profile
```

---

## ⚙️ Useful Scripts

```bash
npm run dev                # Start development server
npm run build              # Compile TypeScript
npm run start              # Run production build
npm run prisma:migrate     # Run migration
npm run prisma:reset       # Reset database
npm run prisma:generate    # Generate Prisma Client
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Check MySQL running, verify DATABASE_URL in .env |
| Port 3000 in use | Change PORT in .env or kill process on port 3000 |
| Token invalid | Get new token by logging in again |
| 403 Forbidden | Check user has ADMIN role for admin endpoints |
| 401 Unauthorized | Add Authorization header with Bearer token |
| Type errors | Run `npm run prisma:generate` |

---

## 📞 Support Resources

- **Full Docs**: See `API_DOCUMENTATION.md`
- **Testing**: See `TESTING_GUIDE.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **Checklist**: See `CHECKLIST.md`

---

## 🎯 Development Tips

1. **After changing schema**: Run `npm run prisma:migrate`
2. **Test authentication**: Login first, copy token, use in other requests
3. **Admin operations**: Need ADMIN role - default admin has it
4. **Error responses**: Check error message in response JSON
5. **CORS issues**: All requests to same `localhost:3000`

---

## 📝 Response Format

### Success (200/201)
```json
{
  "message": "Bruger oprettet",
  "data": { ... }
}
```

### Error (4xx/5xx)
```json
{
  "error": "Error description"
}
```

---

## 🔄 Authentication Flow

1. **Register** → POST `/api/users/register` → Get token
2. **Or Login** → POST `/api/users/login` → Get token
3. **Use token** → Add to Authorization header
4. **Make requests** → Server validates token
5. **Token expires** → Get new token by logging in again (7 days)

---

## 💾 Database Models

```
User ──┬─→ Cartline ──→ Poster ──┬─→ GenrePosterRel ──→ Genre
       │
       └─→ UserRating ──────────→ Poster
```

---

## 🛒 Shopping Cart Example

```
1. Get my cart:     GET /api/cartlines/user/2
2. Add item:        POST /api/cartlines
3. Update qty:      PUT /api/cartlines/1
4. Remove item:     DELETE /api/cartlines/1
5. Clear cart:      DELETE /api/cartlines/user/2/clear
```

---

## ⭐ Rating System

```
Ratings: 1-5 stars
Unique: One rating per user per poster
Average: Calculated from all ratings
Get average: GET /api/ratings/poster/:id/average
```

---

**Version**: 1.0.0 | **Date**: December 2025 | **Status**: ✅ Ready
