# Docker Orchestration — Task Management Application

This full-stack application is containerized into 3 coordinated services using Docker and Docker Compose.

```
       Browser (Host Machine)
         │               │
  :3000  │         :5000 │
         ▼               ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│     frontend     │  │     backend      │  │     mongodb      │
│  (React + Nginx) │  │  (Node / Express)│  │     (Mongo 7)    │
│    Port: 3000    │  │    Port: 5000    │  │    Port: 27017   │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │
         └──────────────┬──────┴─────────────────────┘
                        │
                app-network (Bridge)
```

---

## 📦 Services

| Service | Container Name | Image / Build Context | Port Mapping | Description |
| :--- | :--- | :--- | :--- | :--- |
| **mongodb** | `task-manager-mongodb` | `mongo:7.0` | `27017:27017` | Persistent MongoDB database with health check |
| **backend** | `task-manager-backend` | `./backend/Dockerfile` | `5000:5000` | REST API built with Node.js and Express |
| **frontend** | `task-manager-frontend` | `./frontend/Dockerfile` | `3000:3000` | Production React SPA served via Nginx |

---

## 🚀 Quick Start (Single Command)

From the project root:

```bash
docker-compose up --build
```

To run in detached (background) mode:
```bash
docker-compose up --build -d
```

Once running:
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/api/tasks](http://localhost:5000/api/tasks)
- **MongoDB**: `localhost:27017`

---

## 🛑 Useful Docker Commands

```bash
# View live logs from all 3 services
docker-compose logs -f

# View logs for a specific service (e.g. backend)
docker-compose logs -f backend

# Stop all containers
docker-compose down

# Stop all containers and remove persistent volumes
docker-compose down -v
```

---

## 🌐 Network & Communication Architecture

1. **Internal Bridge Network (`app-network`)**:
   - `backend` connects to MongoDB using the service name: `mongodb://mongodb:27017/task-manager`.
   - Nginx reverse-proxies `/api/` calls internally to `http://backend:5000/api/`.
2. **External Port Mappings**:
   - `3000:3000` exposes the React interface to the browser.
   - `5000:5000` allows direct REST testing (Postman, curl, browser).
   - `27017:27017` allows direct database inspection (MongoDB Compass, Studio 3T).
3. **Startup Coordination**:
   - `mongodb` includes an automated `mongosh` healthcheck.
   - `backend` waits for `mongodb` to report healthy before starting.
   - `backend` includes connection retry logic to eliminate race conditions.
   - `frontend` waits for `backend` to start.
