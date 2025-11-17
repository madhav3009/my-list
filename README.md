My List Feature – MY OTT (Stage Assessment)

Tech Stack: NestJS · MongoDB · Redis

Features
Functional Requirements

Add to My List: Add movies or TV shows to a user’s personal list with duplicate protection.

Remove from My List: Remove a specific item from the list.

Get User List: Fetch paginated items, always sorted by most recently added.

Non-Functional Requirements

High Performance: Sub-10ms responses using Redis caching for reads.

Scalability: Optimized indexing and efficient MongoDB queries.

Testing: Complete integration test coverage across all endpoints.

Prerequisites

Node.js v18+

Docker + Docker Compose

npm or yarn

🛠️ Setup Instructions
1. Clone the Repository
git clone https://github.com/madhav3009/my-ott-1
cd stage-project

2. Install Dependencies
npm install

3. Environment Setup

A sample .env file is already included in the repo.

4. Start Infrastructure (MongoDB + Redis)
docker-compose up -d
docker-compose ps

5. Add Initial Data
npm run initialize-data


This command initializes:

2 demo users

5 movies

4 TV shows

6. Start the Application

Development (with hot reload)

npm run start:dev


Production

npm run build
npm run start:prod


API Base URL: http://localhost:3000

🧪 Tests
Run All Integration Tests
npm run test:e2e

With Coverage
npm run test:e2e -- --coverage

Run a Specific Suite
npm run test:e2e -- -t "POST /my-list"

📡 API Endpoints

Base URL:

http://localhost:3000/my-list

Authentication

Every request must include:

x-user-id: <user-id>

1. Add to My List

POST /my-list

{
  "contentId": "CONTENT_ID",
  "contentType": "movie"
}


Successful Response:

{
  "success": true,
  "message": "Item added to your list successfully",
  "data": { ... }
}


cURL:

curl -X POST http://localhost:3000/my-list \
  -H "Content-Type: application/json" \
  -H "x-user-id: mock-user-id" \
  -d '{"contentId": "...", "contentType": "movie"}'

2. Remove from My List

DELETE /my-list/:contentId

Success:

{
  "success": true,
  "message": "Item removed from your list successfully",
  "data": { ... }
}

3. Get My List

GET /my-list?page=1&limit=10

Response:

{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { ... }
  }
}

🏗️ Assumptions

Most OTT users don’t keep thousands of items in their list.

So each user is allowed up to 50 items in My List.

This enables a simpler schema using embedded arrays instead of a separate mapping table.

Tradeoff:
If the list were unbounded, document size would grow uncontrollably, making writes slower and approaching MongoDB’s 16 MB document limit.

🏗️ Architecture & Design Decisions
Database Schema – MyList
{
  userId: string,       // unique + indexed
  items: [
    {
      contentId: string,
      contentType: 'movie' | 'tvshow',
      addedAt: Date
    }
  ],
  timestamps: true
}

Key Design Choices
1. Embedded Items

All list items live inside one document.
This gives:

Atomic add/remove operations

Single-document reads

Minimal joins/lookup overhead

2. Important Indexes

{ userId: 1 } – fast lookup

{ userId: 1, 'items.contentId': 1 } – O(1) duplicate check

{ userId: 1, 'items.addedAt': -1 } – fast sorted retrieval

3. Denormalized Storage

Only IDs are stored—content metadata is fetched separately.
Keeps the list light and avoids sync issues.

🚀 Performance Optimizations
Redis Caching

Key pattern: mylist:{userId}:{page}:{limit}

TTL: 1 hour

Cache invalidated on add/remove

Read responses drop to sub-10ms

MongoDB Optimizations

.lean() for read queries

Projection to fetch only necessary fields

Application-level pagination for predictable ordering

Atomic $push / $pull operations

📈 Scalability
What this architecture supports today

Up to a few thousand items per user (well below 16MB limit)

Read-heavy traffic via Redis

Easy horizontal scaling for the service and Redis

If the list needs to scale beyond this

Possible upgrades:

Sharding by userId

Splitting items into separate paginated collections

Using DB-level pagination (skip/limit)

Adding CDN caching for popular fetches

🐛 Error Handling

DTO validation

404 for missing content or missing user list

409 for duplicates

Structured 500 responses with logs

🔐 Security

For this assignment: simple x-user-id header

Inputs validated to avoid NoSQL injections

Production would switch to proper JWT-based auth

🔍 Index Summary
// MyList collection
{ userId: 1, unique: true }
{ userId: 1, 'items.contentId': 1 }
{ userId: 1, 'items.addedAt': -1 }

// User collection
{ username: 1 }

// Movie / TVShow collections
{ title: 1, genres: 1 }
