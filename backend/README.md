# Burger Bliss Backend (Sequelize)

This backend implements the SQL schema provided (supabase migrations) using Sequelize, an Express REST API, migrations and seeders.

## Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` for a Postgres instance and `JWT_SECRET`.

2. From the `backend` folder install deps:

```powershell
cd backend; npm install
```

3. Create the database (if not exists) and run migrations + seeders:

```powershell
# using sequelize-cli (included in dev dependencies)
npm run migrate
npm run seed
```

4. Start the server:

```powershell
npm run dev
```

The server will run on port specified in `.env` or default 4000.

## Endpoints

- POST /auth/register - register new user (public)
- POST /auth/login - login to get JWT
- GET /platos - list all dishes (public)
- GET /platos/:id - dish details
- GET /platos/tipo/:tipo - list by type
- POST /platos - create dish (admin)
- PUT /platos/:id - update dish (admin)
- DELETE /platos/:id - delete dish (admin)

- GET /pedidos - list all orders (admin)
- GET /pedidos/usuario - user orders (authenticated)
- GET /pedidos/:id - order detail (admin)
- POST /pedidos - create order (authenticated)
- PUT /pedidos/:id/aceptar - set accepted (admin)
- PUT /pedidos/:id/comenzar - set en_camino (admin)
- PUT /pedidos/:id/entregar - set entregado (admin)
- DELETE /pedidos/:id - delete order (admin)

## Notes / conventions
- JWT token lasts 30 minutes.
- Registration automatically stores `admin: false` and creates a `customer` role.
- Admin user is seeded by the provided seeders: `admin@burger.dev` / `adminpass`.

If you want me to also add tests, CI config or convert the project into TypeScript — I can continue. 

### Connecting to Neon (hosted Postgres)

If you want to connect to a Neon Postgres instance, set the Neon-supplied credentials in `.env` (never commit secrets to source control). Example using the values you provided:

```dotenv
PGHOST='ep-damp-paper-acta17wi-pooler.sa-east-1.aws.neon.tech'
PGDATABASE='neondb'
PGUSER='neondb_owner'
PGPASSWORD='npg_gm0KCvQd2bVB'
PGPORT=5432
PGSSLMODE='require'
PGCHANNELBINDING='require'

DATABASE_URL=postgres://neondb_owner:npg_gm0KCvQd2bVB@ep-damp-paper-acta17wi-pooler.sa-east-1.aws.neon.tech:5432/neondb
JWT_SECRET=changeme
PORT=4000
```

The project config will detect PGSSLMODE and pass TLS settings to Sequelize. To quickly verify the connection locally run:

```powershell
cd backend
npm run test-connection
```
