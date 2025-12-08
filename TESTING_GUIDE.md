# Testing Guide - WallyWood API

## Setup for Testing

### 1. Start the Server
```bash
npm run dev
```
You should see: `Server running on http://localhost:3000`

### 2. Test with Postman

#### Option A: Import Collection (Recommended)
1. Open Postman
2. Click "Import" 
3. Select `WallyWood_API_Postman_Collection.json`
4. Click Import

#### Option B: Manual Setup
1. Create new HTTP Request
2. Follow the endpoints below

---

## Test Scenarios

### Scenario 1: User Registration & Login

#### Step 1: Register New User
```
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "firstname": "Test",
  "lastname": "User",
  "email": "testuser@example.com",
  "password": "TestPassword123"
}
```

**Expected Response (201):**
```json
{
  "message": "Bruger oprettet",
  "user": {
    "id": 3,
    "email": "testuser@example.com",
    "firstname": "Test",
    "lastname": "User",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Step 2: Login with Credentials
```
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "info@webudvikler.dk",
  "password": "password"
}
```

**Expected Response (200):**
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

**📌 IMPORTANT**: Copy the `token` value for authenticated requests

#### Step 3: Get Your Profile
```
GET http://localhost:3000/api/users/profile
Authorization: Bearer {PASTE_TOKEN_HERE}
```

**Expected Response (200):**
```json
{
  "id": 1,
  "firstname": "Admin",
  "lastname": "Admin",
  "email": "info@webudvikler.dk",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "2023-01-30T04:42:11.000Z"
}
```

---

### Scenario 2: Browse Posters & Genres (No Auth Needed)

#### Get All Posters
```
GET http://localhost:3000/api/posters
```

#### Get Poster by ID
```
GET http://localhost:3000/api/posters/1452
```

#### Get All Genres
```
GET http://localhost:3000/api/genres
```

#### Get Genre by Slug
```
GET http://localhost:3000/api/genres/slug/drama
```

---

### Scenario 3: Shopping Cart

#### Add Item to Cart
```
POST http://localhost:3000/api/cartlines
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 2,
  "posterId": 1452,
  "quantity": 1
}
```

**Response:** Cart item created or quantity updated

#### Get Your Cart
```
GET http://localhost:3000/api/cartlines/user/2
Authorization: Bearer {token}
```

#### Update Cart Item Quantity
```
PUT http://localhost:3000/api/cartlines/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```
DELETE http://localhost:3000/api/cartlines/1
Authorization: Bearer {token}
```

#### Clear Entire Cart
```
DELETE http://localhost:3000/api/cartlines/user/2/clear
Authorization: Bearer {token}
```

---

### Scenario 4: Ratings

#### Rate a Poster
```
POST http://localhost:3000/api/ratings
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 2,
  "posterId": 1452,
  "numStars": 5
}
```

#### Get Average Rating for Poster
```
GET http://localhost:3000/api/ratings/poster/1452/average
```

**Response:**
```json
{
  "posterId": 1452,
  "averageRating": 4.5,
  "totalRatings": 2
}
```

#### Get All Ratings for Poster
```
GET http://localhost:3000/api/ratings/poster/1452
```

#### Get Your Ratings
```
GET http://localhost:3000/api/ratings/user/2
Authorization: Bearer {token}
```

---

### Scenario 5: Admin Operations

#### Create New Genre (Admin Only)
```
POST http://localhost:3000/api/genres
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Sci-Fi",
  "slug": "sci-fi"
}
```

#### Create New Poster (Admin Only)
```
POST http://localhost:3000/api/posters
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "The Inception",
  "slug": "the-inception",
  "description": "A sci-fi thriller about dreams",
  "image": "https://example.com/inception.jpg",
  "width": 70,
  "height": 100,
  "price": 99.99,
  "stock": 10
}
```

#### Get All Users (Admin Only)
```
GET http://localhost:3000/api/users
Authorization: Bearer {admin_token}
```

#### Update User (Admin Only)
```
PUT http://localhost:3000/api/users/2
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "firstname": "Updated",
  "lastname": "Name",
  "isActive": true
}
```

#### Delete User (Admin Only)
```
DELETE http://localhost:3000/api/users/2
Authorization: Bearer {admin_token}
```

---

## Postman Tips

### Setting Bearer Token Automatically

After login, you can set the token as a variable:

1. In login response, select the token value
2. Right-click → "Set as variable"
3. Create/Select "token" variable
4. In subsequent requests, use: `Bearer {{token}}`

### Collections & Environments

**Pre-configured in included collection:**
- Authentication requests (login/register)
- All CRUD endpoints organized by model
- Admin-only endpoints clearly marked
- Pre-filled example data

### Testing Workflow

1. **Import collection** from `WallyWood_API_Postman_Collection.json`
2. **Login** → copy token to variable
3. **Test public endpoints** (posters, genres, ratings)
4. **Test protected endpoints** (cart, profile)
5. **Admin testing** (create/update/delete operations)

---

## Common Test Cases

### ✅ Success Cases

| Endpoint | Method | Auth | Expected |
|----------|--------|------|----------|
| /api/users/login | POST | No | 200 + token |
| /api/posters | GET | No | 200 + array |
| /api/ratings | GET | No | 200 + array |
| /api/cartlines | POST | Yes | 201 + item |
| /api/users/profile | GET | Yes | 200 + user |
| /api/posters | POST | Admin | 201 + poster |

### ❌ Error Cases

| Scenario | Expected | HTTP |
|----------|----------|------|
| Invalid login | "Ugyldige login-oplysninger" | 401 |
| No token | "Ingen token fundet" | 401 |
| User token for admin route | "Kun admins har adgang" | 403 |
| Invalid poster ID | "Plakat ikke fundet" | 404 |
| Bad request data | "Alle felter skal udfyldes" | 400 |

---

## Health Check

Verify API is running:
```
GET http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "API is running"
}
```

---

## Troubleshooting

### Token Expired
- Get new token by logging in again

### Authorization Header Not Working
- Ensure format: `Bearer {token}` (space required)
- Don't include quotes or extra characters

### CORS Issues
- Check that requests are to `http://localhost:3000`
- Not `https://` or different port

### Database Errors
- Verify MySQL is running
- Check DATABASE_URL in .env
- Run `npm run prisma:reset` to reset database

---

**Need Help?** Check `API_DOCUMENTATION.md` for detailed endpoint documentation.
