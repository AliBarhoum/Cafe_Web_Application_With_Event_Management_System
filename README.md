# Café Web Application with Event Management System

A full-stack web application for a café that lets customers browse and register for events, with an authenticated admin panel for managing them. The project pairs a **React + TypeScript** single-page app with an **ASP.NET Core** Web API, backed by **Entity Framework Core**, **ASP.NET Identity**, and **JWT** authentication, with **Hangfire** for background jobs and **MailKit** for transactional email.

## Repository

https://github.com/AliBarhoum/Cafe_Web_Application_With_Event_Management_System

## Architecture

```text
┌──────────────────────────────┐        HTTPS / JSON         ┌──────────────────────────────┐
│  Frontend (React + Vite)     │  ────────────────────────►  │  Backend (ASP.NET Core)      │
│  http://localhost:5173       │  ◄────────────────────────  │  http://localhost:5134       │
│                              │        JWT in Authorization │  https://localhost:5001      │
│  React Router · Axios        │                             │  Controllers · Identity      │
│  ESLint 9 flat config        │                             │  EF Core · Hangfire · MailKit│
└──────────────────────────────┘                             └──────────────┬───────────────┘
                                                                            │
                                                              ┌─────────────▼─────────────┐
                                                              │  SQLite (cafe.db)         │
                                                              │  Users, Roles, Events     │
                                                              └───────────────────────────┘
```

- The frontend calls the API with **Axios**, attaching the **JWT** returned by `POST /api/account/login`.
- The API stores users and roles via **ASP.NET Identity**, events and registrations via **EF Core**.
- **Hangfire** queues and runs background jobs (in-memory storage during development).
- **MailKit / MimeKit** sends transactional email; the frontend origin used in links is configurable via `FrontendBaseUrl`.

## Tech Stack

### Frontend

| Category | Technology |
| --- | --- |
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 5 |
| Routing | React Router 6 |
| HTTP client | Axios |
| Linting | ESLint 9 (flat config) |
| Package manager | npm |

### Backend

| Category | Technology |
| --- | --- |
| Runtime | .NET 10 |
| Web framework | ASP.NET Core Web API |
| ORM | Entity Framework Core 10 |
| Database | SQLite (`cafe.db`) |
| Identity | ASP.NET Core Identity |
| Authentication | JWT Bearer |
| Background jobs | Hangfire 1.8 (in-memory storage) |
| Email | MailKit / MimeKit |
| API docs | Swagger / OpenAPI (Swashbuckle 7) |

## Prerequisites

- **Node.js** >= 18.x and **npm** >= 9.x
- **.NET SDK 10.0**
- **EF Core CLI tools**:

```bash
dotnet tool install --global dotnet-ef
```

## Project Structure

```text
Cafe_Web_Application_With_Event_Management_System/
├── index.html
├── package.json
├── package-lock.json
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
├── src/                       # React + TypeScript source
│   ├── main.tsx
│   └── ...
│
└── Cafe.Api/                  # ASP.NET Core Web API
    ├── Controllers/           # AccountController, EventsController
    ├── Data/                  # ApplicationDbContext
    ├── Models/                # Customer, Event, DTOs
    ├── Services/              # EmailService, HangfireAuthorizationFilter
    ├── Program.cs             # DI, auth, CORS, seeding
    ├── appsettings.json
    ├── Events.http            # Sample API requests
    └── Cafe.Api.csproj
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AliBarhoum/Cafe_Web_Application_With_Event_Management_System.git
cd Cafe_Web_Application_With_Event_Management_System
```

### 2. Configure the backend secrets

The API reads the JWT signing key, email password, and seeded admin password from configuration. `appsettings.json` intentionally leaves these blank — supply them locally with **User Secrets**:

```bash
cd Cafe.Api
dotnet user-secrets init
```

Generate a JWT signing key of at least 32 characters:

```bash
# macOS / Linux
openssl rand -base64 32
```

```powershell
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Then set the secrets:

```bash
dotnet user-secrets set "JwtSettings:SecretKey"  "<the generated key>"
dotnet user-secrets set "EmailSettings:Password" "<your Gmail app password>"
dotnet user-secrets set "Seed:AdminPassword"     "<password for admin@cafe.com>"
```

The `EmailSettings:Password` value is a **Gmail app password**, not your Google account password. Create one at https://myaccount.google.com/apppasswords.

### 3. Create the database and run the API

```bash
dotnet restore
dotnet ef database update
dotnet run
```

The API listens on:

- HTTP:  `http://localhost:5134`
- HTTPS: `https://localhost:5001`

Swagger UI: `http://localhost:5134/swagger`
Hangfire dashboard: `http://localhost:5134/hangfire`

### 4. Run the frontend

From the repository root, in a second terminal:

```bash
npm install
npm run dev
```

The SPA is served at `http://localhost:5173` and is already whitelisted in the API's CORS policy.

### 5. Log in as the seeded admin

On first run the API creates an admin account:

| Field | Value |
| --- | --- |
| Email | `admin@cafe.com` |
| Password | the value you set in `Seed:AdminPassword` |

## Configuration

### Backend (`Cafe.Api/appsettings.json`)

| Key | Purpose | Source |
| --- | --- | --- |
| `ConnectionStrings:DefaultConnection` | SQLite connection string (`Data Source=cafe.db`) | `appsettings.json` |
| `JwtSettings:SecretKey` | HMAC signing key for JWTs (>= 32 chars) | User Secrets / env vars |
| `JwtSettings:Issuer` | JWT issuer (`Cafe.Api`) | `appsettings.json` |
| `JwtSettings:Audience` | JWT audience (`Cafe.Frontend`) | `appsettings.json` |
| `EmailSettings:SmtpServer` | SMTP host (`smtp.gmail.com`) | `appsettings.json` |
| `EmailSettings:SmtpPort` | SMTP port (`587`, STARTTLS) | `appsettings.json` |
| `EmailSettings:SenderEmail` | From address | `appsettings.json` |
| `EmailSettings:SenderName` | From display name | `appsettings.json` |
| `EmailSettings:Password` | SMTP app password | User Secrets / env vars |
| `Seed:AdminPassword` | Password for the seeded admin account | User Secrets / env vars |
| `FrontendBaseUrl` | Origin used in email links (`http://localhost:5173`) | `appsettings.json` |
| `AllowedHosts` | Host filtering | `appsettings.json` |

For deployment, supply the secret values via environment variables using the **double underscore** separator:

```bash
export JwtSettings__SecretKey="<key>"
export EmailSettings__Password="<app password>"
export Seed__AdminPassword="<admin password>"
```

### Frontend (`VITE_API_URL`)

Create `.env` at the repository root (and commit a `.env.example` with the same keys but placeholder values):

```ini
VITE_API_URL=http://localhost:5134
```

Read it in code with `import.meta.env.VITE_API_URL`.

## API Reference

Base URL: `http://localhost:5134` (or `https://localhost:5001`)

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/account/register` | Public | Register a new customer |
| `POST` | `/api/account/login` | Public | Log in and receive a JWT |
| `POST` | `/api/account/logout` | User | Log out |
| `GET`  | `/api/account/current-user` | User | Get the current user's profile |
| `GET`  | `/api/events` | Public | List events |
| `POST` | `/api/events` | Admin | Create a new event |
| `POST` | `/api/events/{id}/register` | User | Register the current user for an event |

Interactive docs are available in **Swagger UI** at `/swagger`. A ready-to-run collection of sample requests lives in `Cafe.Api/Events.http` (VS Code REST Client / JetBrains HTTP Client).

### Example: register and log in

```http
POST http://localhost:5134/api/account/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "P@ssw0rd123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

```http
POST http://localhost:5134/api/account/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "P@ssw0rd123!",
  "rememberMe": false
}
```

Send the returned token on protected calls:

```http
GET http://localhost:5134/api/account/current-user
Authorization: Bearer <token>
```

## Available Commands

### Frontend (repository root)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR on `http://localhost:5173` |
| `npm run build` | Type-check with `tsc` and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint over `.ts` / `.tsx` |
| `npm run lint:fix` | Auto-fix safe lint issues |

### Backend (`cd Cafe.Api`)

| Command | Description |
| --- | --- |
| `dotnet restore` | Restore NuGet packages |
| `dotnet run` | Run the API |
| `dotnet build` | Build the project |
| `dotnet ef database update` | Apply EF Core migrations |
| `dotnet ef migrations add <Name>` | Create a new migration |
| `dotnet publish -c Release -o ./publish` | Produce a deployable build |

## Code Quality

### Frontend

ESLint 9 with the flat config format (`eslint.config.js`):

- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react` recommended rules
- `eslint-plugin-react-hooks` recommended rules
- `eslint-plugin-react-refresh` for Fast Refresh compatibility

Notable overrides:

- `react/react-in-jsx-scope` is disabled (React 17+ JSX transform).
- `@typescript-eslint/no-unused-vars` warns, ignoring args prefixed with `_`.

### Backend

- `<Nullable>enable</Nullable>` and `<ImplicitUsings>enable</ImplicitUsings>` in `Cafe.Api.csproj`.
- `<TargetFramework>net10.0</TargetFramework>`.

## Building for Production

### Frontend

```bash
npm run build         # → dist/
```

Deploy `dist/` to Vercel, Netlify, GitHub Pages, or any static host. Set `VITE_API_URL` in the host's environment settings to the deployed API URL.

### Backend

```bash
cd Cafe.Api
dotnet publish -c Release -o ./publish
```

Deploy the `publish/` output to Azure App Service, Render, Railway, Fly.io, or a Linux VM. Configure `JwtSettings__SecretKey`, `EmailSettings__Password`, `Seed__AdminPassword`, and the connection string via the host's environment variables.

Then update the frontend's `VITE_API_URL` and the API's CORS policy in `Cafe.Api/Program.cs` to the deployed origins.

## Roadmap

- [ ] Replace in-memory Hangfire storage with SQLite or Redis for persistence.
- [ ] Add refresh tokens and token revocation.
- [ ] Add pagination and filtering to `GET /api/events`.
- [ ] Add automated tests (xUnit for the API, Vitest + Testing Library for the SPA).
- [ ] Add a CI workflow to build and lint both halves on every push.

## Contributing

This is a **solo student project**, but issues and PRs are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Make sure `npm run lint`, `npm run build`, and `dotnet build` pass.
4. Commit: `git commit -m "feat: my feature"`.
5. Push and open a Pull Request.

## License

This project is private and is not currently published under an open-source license. Add a `LICENSE` file if you intend to open source it.
