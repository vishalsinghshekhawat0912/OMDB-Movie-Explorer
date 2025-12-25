
# OMDB Movie Explorer

OMDB Movie Explorer is a full-stack web application that allows users to search for movies and series using the **OMDB API**, view detailed information, and manage a list of favourite movies.  
The project is built with a **Node.js backend** and a **React frontend**, following clean architecture and best practices.

---

## Features

-  Search movies and series by title
-  Apply filters:
  - Year (optional)
  - Type (Movie / Series)
-  View detailed movie information:
  - Poster, plot, cast, director, genre, rating, etc.
-  Add movies to favourites
-  Display favourites in a responsive card grid
-  Backend caching using Redis
-  Fully responsive (mobile & desktop)

---

## Tech Stack

### Frontend
- React (JavaScript)
- HTML5
- CSS3 (Grid & Flexbox)
- Fetch API

### Backend
- Node.js
- Express.js
- TypeScript / JavaScript
- MySQL (Favourites storage)
- Redis (Caching layer)

### External API
- OMDB API

---

---

## Environment Variables

### Backend `.env`(root level of project)
BACKEND_PORT=8080
OMDB_BASE_URL=https://www.omdbapi.com/
OMDB_API_KEY=your_omdb_api_key
REDIS_URL=redis://localhost:6379
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=*****
DB_NAME=omdb movie explorer
DB_PORT=3306

### Frontend `.env`(inside frontend folder)
REACT_APP_BACKEND_URL="http://localhost:8080/"

> API keys are securely handled in the backend and are never exposed to the frontend.

---

## Why a Backend Layer?

The OMDB API is **not called directly from the frontend** to:

- Protect the OMDB API key
- Enable response caching (Redis)
- Reduce API rate-limit issues
- Validate and sanitize inputs
- Easily extend functionality (database, favourites)

---

## Caching Strategy

- Redis is used to cache OMDB responses
- Cache expiry (TTL) is applied
- Reduces repeated API calls
- Improves performance and response time

---

## Favourites Feature

- Stored in a MySQL database
- APIs:
  - `POST /favourites` → Add or update a favourite
  - `GET /favourites`
    - Without params → returns poster, title, year, type
    - With params → returns full movie details
- Results sorted by `updated_at DESC`
- Click on Favourite Movie Card to see full details

## Favorite Table create Query
    CREATE TABLE favourites (
    title VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    type VARCHAR(50) NOT NULL,     -- movie / series / episode
    poster TEXT NULL,
    director VARCHAR(255) NULL,
    actors TEXT NULL,
    plot TEXT NULL,
    rating VARCHAR(10) NULL,       -- stored as string (e.g. "8.5", "N/A")
    genre VARCHAR(255) NULL,
    writers TEXT NULL,
    language VARCHAR(100) NULL,
    time VARCHAR(50) NULL,
    collection VARCHAR(100) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (title, year, type)
);

---

## UI & UX

- Card-based layout for movies
- Responsive grid for favourites
- Natural image scaling (no fixed poster distortion)
- Loading and error states handled gracefully
- Clean typography and spacing
- Welcome screen for empty state

---

## Responsiveness

- Optimized for:
  - Mobile
  - Tablet
  - Desktop
- Uses CSS Grid and Flexbox
- Adapts naturally to different screen sizes

---

## How to Run Locally

### 1. Backend
cd backend
npm install
npm run dev

## 2. Frontend
cd frontend
npm install
npm start

Open in browser: http://localhost:3000
