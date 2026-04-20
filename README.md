# Hotels + Taste Explorer
<!-- Triggering workflow on main branch -->

<!-- Triggering GitHub Actions workflow run -->

Independent Hotels and Taste web apps with separate FastAPI backends, separate PostgreSQL databases, a centralized Supabase login page, and API-driven right-side MFE widgets.

## Workspace Layout

- `hotels/react-app` - Hotels frontend on port `5174`
- `hotels/backend` - Hotels FastAPI backend on port `8001`
- `taste-explorer/react-app` - Taste frontend on port `5176`
- `taste-explorer/backend` - Taste FastAPI backend on port `8002`
- `login/react-app` - Centralized Supabase login on port `5173`

## Database

- Dockerized PostgreSQL with one DB per app
- Hotels DB: `localhost:5433` -> database `hotels`
- Taste DB: `localhost:5434` -> database `taste_explorer`
- PostgreSQL user: `postgres`
- PostgreSQL password: `secret`

### Start Databases With Docker

```bash
docker compose -f docker-compose.db.yml up -d
```

### Stop Databases

```bash
docker compose -f docker-compose.db.yml down
```

To remove persisted data volumes too:

```bash
docker compose -f docker-compose.db.yml down -v
```

### Backend Env Setup

Use these values in [hotels/backend/.env.example](hotels/backend/.env.example) and [taste-explorer/backend/.env.example](taste-explorer/backend/.env.example):

- Hotels backend: `DB_HOST=localhost`, `DB_PORT=5433`, `DB_NAME=hotels`
- Taste backend: `DB_HOST=localhost`, `DB_PORT=5434`, `DB_NAME=taste_explorer`

### First-Time Schema/Seed

Schema and sample data are created automatically by seed containers when you start Docker.
If you want to run the scripts manually, use:

```bash
# Hotels
cd hotels/backend
python setup_hotels_db.py

# Taste
cd ../../taste-explorer/backend
python setup_taste_db.py
```


## Full Docker Stack

Run the entire system with one command:

docker compose -f docker-compose.full.yml up -d --build
```

Ports:

- Hotels app: `http://localhost:5174`
- Taste app: `http://localhost:5176`
- Hotels backend: `http://localhost:8001`
- Taste backend: `http://localhost:8002`

Stop the full stack:

docker compose -f docker-compose.full.yml down
```

## Current Scope

- Hotels app: hotel search, booking flow, my bookings, cancellation, profile
- Taste app: city-based signature foods, save to library, grouped library, profile
- API-driven right-side MFE widgets between both apps

## Supabase Centralized Login Setup

1. Create a Supabase project.
2. In Supabase Dashboard, go to Authentication -> URL Configuration.
3. Set Site URL to `http://localhost:5173`.
4. Add these Redirect URLs:
	 - `http://localhost:5173`
Set env values in each frontend app:

- `login/react-app/.env`
	- `VITE_SUPABASE_URL=...`
	- `VITE_SUPABASE_ANON_KEY=...`
	- `VITE_ALLOWED_RETURN_ORIGINS=http://localhost:5174,http://localhost:5176`
- `hotels/react-app/.env`
	- `VITE_SUPABASE_URL=...`
	- `VITE_LOGIN_URL=http://localhost:5173`
- `taste-explorer/react-app/.env`
	- `VITE_SUPABASE_URL=...`
	- `VITE_SUPABASE_ANON_KEY=...`
	- `VITE_LOGIN_URL=http://localhost:5173`
# terminal 1
cd login/react-app
npm run dev -- --host --port 5173
npm run dev -- --host --port 5174

# terminal 3
cd taste-explorer/react-app
```

Flow:

- Hotels/Taste Sign In redirects to centralized login app.
- Login app signs in with Supabase and stores shared auth cookies.
- User is redirected back to source app via `returnTo`.

## CI/CD and Automated Testing

> **Best Practice:** Use Docker Compose for full stack orchestration in CI and local development. Do NOT start backends/frontends manually.

### Run Full Stack for Local Dev or CI

```bash
docker compose -f docker-compose.full.yml up -d --build
```

- This command starts:
  - Both PostgreSQL databases
  - Seeders for test/sample data
  - Hotels and Taste backends (FastAPI)
  - All frontends (login, hotels, taste)

### Wait for Services (for CI or scripts)

Use [wait-on](https://www.npmjs.com/package/wait-on) to ensure all services are ready before running tests:

```bash
npx wait-on http://localhost:8001/health
npx wait-on http://localhost:8002/health
npx wait-on http://localhost:5174
npx wait-on http://localhost:5176
```

### Run Playwright or Other Tests

Once all services are up and healthy, run your tests as usual:

```bash
npx playwright test
```

### Stopping Everything

```bash
docker compose -f docker-compose.full.yml down
```

---

> **Summary:**
> - Use `docker-compose.full.yml` for all-in-one startup (DB, seed, backend, frontend)
> - Never start backends/frontends manually in CI
> - Always wait for health endpoints before running tests
> - This ensures stable, seeded, and ready environments for all tests and development

## How to Run the Project (All-in-One)

1. **Open a terminal in your project root.**
2. **Start everything (databases, seeders, backends, frontends) with one command:**

```bash
docker compose -f docker-compose.full.yml up -d --build
```

3. **Wait for all services to be healthy:**

```bash
npx wait-on http://localhost:8001/health
npx wait-on http://localhost:8002/health
npx wait-on http://localhost:5174
npx wait-on http://localhost:5176
```

4. **Access the apps in your browser:**
- Login: http://localhost:5173
- Hotels: http://localhost:5174
- Taste Explorer: http://localhost:5176

5. **To stop everything:**

```bash
docker compose -f docker-compose.full.yml down
```

> This will run the full stack with seeded data, ready for development and testing. No manual backend/frontend/database steps needed!

## How to Run All 5 Servers Locally (No Docker)

### 1. Start PostgreSQL Databases
- You need two local PostgreSQL instances:
  - Hotels DB: port 5433, database: hotels
  - Taste DB: port 5434, database: taste_explorer
  - User: postgres, Password: secret

### 2. Seed Databases (if empty)
Open a terminal for each backend and run:

```bash
# Hotels DB
cd hotels/backend
python -m pip install -r requirements.txt
python setup_hotels_db.py

# Taste DB
cd ../../taste-explorer/backend
python -m pip install -r requirements.txt
python setup_taste_db.py
```

### 3. Start Backends
Open two terminals:

```bash
# Hotels backend (port 8001)
cd hotels/backend
python main.py

# Taste backend (port 8002)
cd ../../taste-explorer/backend
python main.py
```

### 4. Start Frontends
Open three more terminals:

```bash
# Login (port 5173)
cd login/react-app
npm install
npm run dev -- --host --port 5173

# Hotels (port 5174)
cd hotels/react-app
npm install
npm run dev -- --host --port 5174

# Taste (port 5176)
cd taste-explorer/react-app
npm install
npm run dev -- --host --port 5176
```

### 5. .env Configuration
- Set `DB_HOST=localhost` and correct `DB_PORT` in each backend's .env file.
- Example for hotels/backend/.env:
  - DB_HOST=localhost
  - DB_PORT=5433
- Example for taste-explorer/backend/.env:
  - DB_HOST=localhost
  - DB_PORT=5434

### 6. Access the Apps
- Login: http://localhost:5173
- Hotels: http://localhost:5174
- Taste Explorer: http://localhost:5176
- Hotels backend: http://localhost:8001/health
- Taste backend: http://localhost:8002/health

---
> This setup runs all 5 servers locally, no Docker required. Each service must be started in its own terminal window.
