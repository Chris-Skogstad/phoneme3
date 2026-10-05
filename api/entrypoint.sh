#!/bin/sh

# Wait for Postgres to be available
./wait-for-it.sh postgres:5432 --timeout=30 --strict -- echo "✅ Postgres is up"

# Run Prisma commands
npx prisma generate
npx prisma migrate deploy

# Production build and start
npm run build
npm run start