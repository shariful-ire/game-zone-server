# GameZone Server

REST API backend for the GameZone sports facility booking platform.

## Live URL

> _Add your deployed URL here_

## Features

- **Facility Management** — CRUD operations for sports facilities (turf, football, badminton, swimming, tennis)
- **Booking System** — Create, view, and cancel bookings with status tracking (pending/confirmed/cancelled)
- **Authentication** — Email/password + Google OAuth via Better Auth with session cookies
- **Search & Filter** — Text search (`$regex`), sport type filter (`$in`), price range, location filtering
- **Owner Authorization** — Only facility owners can edit/delete their own listings
- **Request Validation** — Zod schema validation on all POST/PUT/PATCH endpoints
- **Security** — Helmet, CORS, rate limiting, request logging

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MongoDB (native driver)
- **Authentication:** Better Auth (email/password + Google OAuth)
- **Validation:** Zod
- **Security:** Helmet, express-rate-limit, cors
- **Logging:** Morgan

## npm Packages

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongodb | MongoDB native driver |
| better-auth | Authentication (email/password + Google OAuth) |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |
| cookie-parser | Parse cookies from requests |
| helmet | Security headers |
| express-rate-limit | API rate limiting |
| morgan | HTTP request logging |
| zod | Request body validation |
| nodemon | Development auto-restart |

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | API status |
| GET | `/api/facilities` | List facilities (with search/filter/pagination) |
| GET | `/api/facilities/:id` | Get facility details |
| ALL | `/api/auth/*` | Better Auth endpoints (login, register, OAuth) |

### Protected (requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/facilities/mine` | Get logged-in user's own facilities |
| POST | `/api/facilities` | Create a facility |
| PUT | `/api/facilities/:id` | Update a facility (owner only) |
| DELETE | `/api/facilities/:id` | Delete a facility (owner only) |
| GET | `/api/bookings` | Get logged-in user's bookings |
| POST | `/api/bookings` | Create a booking (prevents duplicates) |
| PATCH | `/api/bookings/:id` | Update booking status (owner only) |

### Query Parameters for GET `/api/facilities`
- `search` — Text search on facility name
- `type` — Comma-separated sport types (e.g., `Turf,Football`)
- `maxPrice` — Maximum price per hour
- `location` — Location text filter
- `featured` — Set to `true` to sort by booking count
- `page` — Page number (default: 1)
- `limit` — Results per page (default: 20)

## Setup

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file based on `.env.example`
4. Add your MongoDB Atlas URI, Better Auth secret, and Google OAuth credentials
5. In Google Cloud Console, add `http://localhost:5000/api/auth/callback/google` as an authorized redirect URI
6. Run `npm run dev` for development or `npm start` for production

## Deployment

- Set all `.env` variables in your hosting provider (Render, Vercel, etc.)
- Update `CLIENT_URL` to your deployed client URL
- Update `BASE_URL` to your deployed server URL
- Update Google OAuth redirect URI to match your deployed server
