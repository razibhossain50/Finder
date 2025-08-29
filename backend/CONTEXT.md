# Finder API – Project Context

## Overview
Finder API is a NestJS + TypeORM backend for managing users, biodata, favorites, uploads, and authentication (JWT and Google OAuth). It uses PostgreSQL as the database and organizes features into modules (`auth`, `user`, `biodata`, `favorites`, `upload`).

## Requirements to Start
- Node.js 18+
- PostgreSQL 13+
- Install dependencies: `npm install`
- Configure database connection in `src/data-source.ts`
- (Optional) Set environment variables if used by your setup

## Tech Stack
- NestJS (REST API)
- TypeORM (PostgreSQL)
- JWT Auth + Google OAuth
- Node 18+

## Key Modules
- `auth`: login, signup, admin login, Google auth
- `user`: CRUD for users and passwords
- `biodata`: biodata profiles and related enums
- `favorites`: user favorites for biodata
- `upload`: file uploads

## Database Migration & Seed
- Initial schema is defined in `src/migrations/001_initial_schema.ts`.
- Seed script: `src/seed-data.ts` (uses bcrypt to hash passwords).
- Commands:
  - Run migrations: `npm run migration:run`
  - Seed data: `npm run seed`
  - Combined setup: `npm run db:setup`

## Default Accounts
These are created during the initial migration:
- Super Admin — Email: `superadmin@finder.com`, Password: `Testpass@50`
- Admin — Email: `admin@finder.com`, Password: `Testpass@50`
- User — Email: `user@finder.com`, Password: `Testpass@50`

## Local Development
- Configure database in `src/data-source.ts`
- Start (watch): `npm run dev`
- Start (with migration + seed): `npm start`
- Run migration only: `npm run migration:run`
- Seed only: `npm run seed`

## Notes
- Passwords are stored using bcrypt in the seed script.
- If accounts already exist with the same emails, inserts are skipped by the seeder.

## Folder Structure
```
finder-api/
  check-schema.js
  eslint.config.mjs
  md/
    CONTEXT.md
    DATABASE_MIGRATION_COMPLETE.md
    DATABASE_SETUP_COMPLETE.md
    LOGIN_CREDENTIALS.md
    MIGRATION_GUIDE.md
    USERNAME_CLEANUP_COMPLETE.md
  nest-cli.json
  package-lock.json
  package.json
  README.md
  setup-database.js
  src/
    app.controller.spec.ts
    app.controller.ts
    app.module.ts
    app.service.ts
    auth/
      auth.controller.spec.ts
      auth.controller.ts
      auth.module.ts
      auth.service.spec.ts
      auth.service.ts
      decorators/
        current-user.decorator.ts
      dto/
        admin-login.dto.ts
        login.dto.ts
      guards/
        jwt-auth.guard.ts
        roles.guard.ts
      interfaces/
        auth-payload.interface.ts
      strategies/
        google.strategy.ts
        jwt.strategy.ts
    biodata/
      biodata.controller.ts
      biodata.entity.ts
      biodata.module.ts
      biodata.service.ts
      dto/
        create-biodata.dto.ts
        create-biodatum.dto.ts
        update-biodata.dto.ts
        update-biodatum.dto.ts
      entities/
        biodatum.entity.ts
        profile-view.entity.ts
      enums/
        admin-approval-status.enum.ts
        biodata-status.enum.ts
        user-visibility-status.enum.ts
    common/
      filters/
    data-source.ts
    favorites/
      favorites.controller.ts
      favorites.entity.ts
      favorites.module.ts
      favorites.service.ts
    main.ts
    migration-runner.ts
    migrations/
      001_initial_schema.ts
    polyfills.ts
    seed-data.ts
    seed.ts
    upload/
      upload.controller.ts
      upload.module.ts
      upload.service.ts
    user/
      create-user.dto.ts
      update-password.dto.ts
      update-user.dto.ts
      user.controller.ts
      user.entity.ts
      user.module.ts
      user.service.ts
  test/
    app.e2e-spec.ts
    jest-e2e.json
  tsconfig.build.json
  tsconfig.json
```

