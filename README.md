# MY OTT – My List Feature (Stage Assessment)

**Tech Stack:** NestJS · MongoDB · Redis

---

## Features

### **Functional Requirements**
- Add to My List (movie or TV show) with duplicate protection
- Remove from My List
- Get User List with pagination sorted by latest added item

### **Non-Functional Requirements**
- Sub-10ms read latency using Redis cache
- Optimized MongoDB indexes
- Full integration test coverage

---

## Prerequisites
- Node.js **v18+**
- Docker & Docker Compose
- npm or yarn

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/madhav3009/my-ott-1
cd stage-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
`.env` file is already included.

### 4. Start Infrastructure (MongoDB + Redis)
```bash
docker-compose up -d
docker-compose ps
```

### 5. Add Initial Data
```bash
npm run initialize-data
```

---

## Start the Application
```bash
npm run start:dev
```

**Base URL:** `http://localhost:3000`

---

## API Endpoints

**Base Path:** `/my-list`

**Authentication Header:**
```
x-user-id: <USER_ID>
```

### Add to My List
**Endpoint:** `POST /my-list`

**Request Body:**
```json
{
  "contentId": "CONTENT_ID",
  "contentType": "movie"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Item added to your list successfully",
  "data": { }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/my-list \
  -H "Content-Type: application/json" \
  -H "x-user-id: mock-user-id" \
  -d '{"contentId":"...","contentType":"movie"}'
```

---

### Remove from My List
**Endpoint:** `DELETE /my-list/:contentId`

**Success Response:**
```json
{
  "success": true,
  "message": "Item removed from your list successfully",
  "data": { }
}
```

---

### Get My List
**Endpoint:** `GET /my-list?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": { }
  }
}
```

---


## Assumptions 
1. **Authentication**: Mock authentication via x-user-id header for this assignment. Production would use JWT 
   tokens.
2. **Content Validation**: Assumes movies and TV shows exist and are validated before adding to list. 
3. **List Size**: Assumes reasonable list sizes (<5000 items per user). For larger lists, consider alternative 
   approaches. 
4. **Cache Strategy**: Redis is assumed to be available. Falls back to direct DB queries if Redis is unavailable. 5. **Concurrent Users**: Design supports high concurrency through caching and atomic operations.
6. **Data Consistency**: Strong consistency preferred over eventual consistency for user lists.


---

## Architecture & Design Choices

### MongoDB Schema
```typescript
MyList {
  userId: string,       
  items: [
    {
      contentId: string,
      contentType: "movie" | "tvshow",
      addedAt: Date
    }
  ],
  timestamps: true
}
```

### Key Design Decisions

**Embedded Items (Array Model)**
- Fast single-document reads
- Atomic `$push`/`$pull`
- No JOINs
- Perfect for ≤ 50 items per user

**Important Indexes:**
```javascript
{ userId: 1 }
{ userId: 1, "items.contentId": 1 }      // duplicate check
{ userId: 1, "items.addedAt": -1 }       // sorted fetch
```

---

## ⚡ Performance Optimizations

### Redis Caching
- **Key:** `mylist:{userId}:{page}:{limit}`
- **TTL:** 1 hour
- Cache invalidated on add/remove
- **Read latency:** < 10ms

### MongoDB Optimizations
- `.lean()` queries
- Projection
- Atomic updates
- App-level pagination

---

## Scalability

### Supports Today
- Thousands of items per user
- High read traffic via Redis
- Horizontally scalable

### Future Enhancements
- Sharding by `userId`
- Separate list-item collection
- DB pagination (skip/limit)
- CDN caching

---

## Error Handling
- DTO validation
- 409 for duplicates
- 404 for missing content/list
- Structured 500 logs

---

## Security
- `x-user-id` header for this assessment production version → JWT auth
- Inputs validated


---

## Index Summary
```javascript
// MyList
{ userId: 1, unique: true }
{ userId: 1, "items.contentId": 1 }
{ userId: 1, "items.addedAt": -1 }

// User
{ username: 1 }

// Movies / TV Shows
{ title: 1, genres: 1 }
```

---
