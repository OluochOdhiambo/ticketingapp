# Ticketing Application — Setup Guide

## Prerequisites

Ensure the following are installed on your machine before proceeding:

| Tool | Version | Download |
|---|---|---|
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |
| Git | Latest | https://git-scm.com |
| .NET SDK | 10.0 | https://dotnet.microsoft.com/download |
| Node.js | 20 LTS | https://nodejs.org |

---

## Clone the Repository

```bash
git clone https://github.com/yourusername/TicketingApplication.git
cd TicketingApplication
```

---

## Environment Configuration

The application uses a `.env` file for sensitive configuration. This file is **not committed to the repository** and must be created manually.

Create a `.env` file in the root of the cloned repository:

```env
# Database
DB_PASSWORD=YourPassword

---

## Project Structure

```
TicketingApplication/
├── docker-compose.yml                          # Docker orchestration
├── .env                                        # Environment variables (create manually)
├── Distirbuted.MainBoundedContext.Grpc/        # gRPC service
│   ├── Dockerfile
│   └── Keys/                                   # RSA keys (shared separately)
├── Ticketing.API/                              # REST API
│   └── Dockerfile
├── ticketing.webapp/                           # React frontend
│   ├── Dockerfile
│   └── nginx.conf
└── Infrastructure.Data.MainBoundedContext/     # EF Core migrations
    └── Migrations/
```

---

## Running with Docker

### Step 1 — Start Docker Desktop

Open Docker Desktop and wait for it to fully start (whale icon in system tray stops animating).

### Step 2 — Build and Run

```bash
# Navigate to the project root
cd TicketingApplication

# Build all images
docker-compose build

# Start all containers
docker-compose up -d
```

### Step 3 — Verify Containers Are Running

```bash
docker ps
```

Expected output:

```
CONTAINER ID   IMAGE                    PORTS                     NAMES
xxxxxxxxxxxx   ticketing-webapp         0.0.0.0:3000->80/tcp      ticketing-webapp
xxxxxxxxxxxx   ticketing-api            0.0.0.0:5252->8080/tcp    ticketing-api
xxxxxxxxxxxx   ticketing-grpc-service   0.0.0.0:5082->5082/tcp    ticketing-grpc-service
xxxxxxxxxxxx   ticketing-db             0.0.0.0:1434->1433/tcp    ticketing-db
```

### Step 4 — Watch Logs

```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f ticketing-grpc-service
```

---

## Accessing the Application

| Service | URL | Description |
|---|---|---|
| React Web App | http://localhost:3000 | Frontend UI |
| REST API | http://localhost:5252 | API endpoints |
| gRPC Service | http://localhost:5082 | gRPC (internal) |
| SQL Server | localhost,1434 | Database |

---

## Database Access (SSMS)

Connect to the Dockerized SQL Server using SQL Server Management Studio:

```
Server:         localhost,1434
Authentication: SQL Server Authentication
Login:          sa
Password:       YourPassword  (same as DB_PASSWORD in .env)
```

> The database schema is created automatically on first startup via EF Core migrations. No manual setup required.

---

## Troubleshooting

### Containers not starting
```bash
docker-compose logs -f
```
Check for connection errors or missing environment variables.

### Database not created
The gRPC service applies migrations automatically on startup. If it fails, check:
- SQL Server container is healthy: `docker ps`
- `.env` file has correct `DB_PASSWORD`
- Logs: `docker-compose logs -f ticketing-grpc-service`

### React app not loading
```bash
docker-compose logs -f ticketing-webapp
```
Ensure `ticketing-api` is running and healthy.

### Port conflicts
If ports `3000`, `5082`, `5252`, or `1434` are in use, update the host ports in `docker-compose.yml`:
```yaml
ports:
  - "NEW_PORT:CONTAINER_PORT"
```

---

## Architecture Overview

```
Browser
   │
   ▼
ticketing-webapp (React + Nginx) :3000
   │  /api/* proxied to
   ▼
ticketing-api (ASP.NET Core) :5252
   │  gRPC calls
   ▼
ticketing-grpc-service (gRPC) :5082
   │  EF Core
   ▼
ticketing-db (SQL Server) :1433
```

---

## Support

For issues or questions, reach me via email at:
```
oluochodhiambo11@gmail.com
```